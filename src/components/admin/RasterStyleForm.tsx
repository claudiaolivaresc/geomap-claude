'use client';

import { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { ColorRampPreview } from './ColorRampPreview';
import { GRADIENTS, buildGradientFromClassification } from '@/config/layers.config';
import type { LayerLegend, RasterClassification, RasterClassificationEntry } from '@/types';

const RAMP_GROUPS: { label: string; keys: string[] }[] = [
  { label: 'Domain', keys: ['thermal', 'lab', 'moho', 'velocity'] },
  { label: 'Sequential', keys: ['viridis', 'inferno', 'magma', 'plasma', 'cividis', 'turbo'] },
  { label: 'Diverging', keys: ['rdylgn', 'spectral', 'coolwarm'] },
  { label: 'Mono', keys: ['greys'] },
];

/** Extract hex colors from a GRADIENTS CSS string */
function extractRampColors(rampKey: string): string[] {
  const grad = GRADIENTS[rampKey];
  if (!grad) return [];
  const matches = grad.match(/#[0-9a-fA-F]{6}/g);
  return matches || [];
}

/** Interpolate a color at position t (0–1) from a color array */
function interpolateColor(colors: string[], t: number): string {
  if (colors.length === 0) return '#3388ff';
  if (colors.length === 1) return colors[0];
  const idx = t * (colors.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.min(lo + 1, colors.length - 1);
  const frac = idx - lo;
  const parse = (hex: string) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
  const c1 = parse(colors[lo]);
  const c2 = parse(colors[hi]);
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * frac);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * frac);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * frac);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// ── QML / SLD parsers ──────────────────────────────────────────

function parseQML(xml: string): RasterClassification | null {
  try {
    const doc = new DOMParser().parseFromString(xml, 'text/xml');
    const shader = doc.querySelector('colorrampshader') || doc.querySelector('colorRampShader');
    if (!shader) return null;

    const rampType = (shader.getAttribute('colorRampType') || '').toUpperCase();
    const interpolation: 'discrete' | 'linear' = rampType === 'INTERPOLATED' ? 'linear' : 'discrete';

    const items = shader.querySelectorAll('item');
    const entries: RasterClassificationEntry[] = [];
    for (const item of items) {
      const value = parseFloat(item.getAttribute('value') || '0');
      const color = item.getAttribute('color') || '#000000';
      const label = item.getAttribute('label') || String(value);
      if (!isNaN(value)) entries.push({ value, color, label });
    }

    if (entries.length === 0) return null;
    const values = entries.map((e) => e.value);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      unit: '',
      interpolation,
      entries,
    };
  } catch {
    return null;
  }
}

function parseSLD(xml: string): RasterClassification | null {
  try {
    const doc = new DOMParser().parseFromString(xml, 'text/xml');
    // Try with and without namespace
    const colorMap = doc.querySelector('ColorMap') ||
      doc.getElementsByTagNameNS('http://www.opengis.net/sld', 'ColorMap')[0];
    if (!colorMap) return null;

    const mapType = (colorMap.getAttribute('type') || 'ramp').toLowerCase();
    const interpolation: 'discrete' | 'linear' = mapType === 'intervals' ? 'discrete' : 'linear';

    const items = colorMap.querySelectorAll('ColorMapEntry') ||
      colorMap.getElementsByTagNameNS('http://www.opengis.net/sld', 'ColorMapEntry');
    const entries: RasterClassificationEntry[] = [];
    for (const item of items) {
      const value = parseFloat(item.getAttribute('quantity') || '0');
      const color = item.getAttribute('color') || '#000000';
      const label = item.getAttribute('label') || String(value);
      if (!isNaN(value)) entries.push({ value, color, label });
    }

    if (entries.length === 0) return null;
    const values = entries.map((e) => e.value);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      unit: '',
      interpolation,
      entries,
    };
  } catch {
    return null;
  }
}

// ── Component ──────────────────────────────────────────────────

interface RasterStyleFormProps {
  overrides: Record<string, unknown>;
  defaults: Record<string, unknown>;
  onChange: (overrides: Record<string, unknown>) => void;
  legend: LayerLegend;
  onLegendChange: (legend: LayerLegend) => void;
}

export function RasterStyleForm({ overrides, defaults, onChange, legend, onLegendChange }: RasterStyleFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentOpacity = (overrides['raster-opacity'] ?? defaults['raster-opacity'] ?? 0.8) as number;
  const currentRamp = (overrides['color_ramp'] as string) || '';
  const currentResampling = (overrides['raster-resampling'] ?? defaults['raster-resampling'] ?? 'nearest') as string;
  const classification = overrides['raster_classification'] as RasterClassification | undefined;
  const hasClassification = !!classification?.entries?.length;

  const setField = (key: string, value: unknown) => {
    onChange({ ...overrides, [key]: value });
  };

  // ── Classification helpers ──

  const updateClassification = (updates: Partial<RasterClassification>) => {
    const current: RasterClassification = classification || {
      min: 0, max: 100, unit: '', interpolation: 'discrete', entries: [],
    };
    const updated = { ...current, ...updates };
    setField('raster_classification', updated);
    syncLegend(updated);
  };

  const syncLegend = (c: RasterClassification) => {
    if (c.entries.length > 0) {
      onLegendChange({
        type: 'gradient',
        min: c.min,
        max: c.max,
        unit: c.unit,
        gradient: buildGradientFromClassification(c),
      });
    }
  };

  const handleEntryChange = (index: number, field: keyof RasterClassificationEntry, value: string | number) => {
    const entries = [...(classification?.entries || [])];
    entries[index] = { ...entries[index], [field]: value };
    updateClassification({ entries });
  };

  const handleAddEntry = () => {
    const entries = [...(classification?.entries || [])];
    const lastVal = entries.length > 0 ? entries[entries.length - 1].value : (classification?.min ?? 0);
    entries.push({ value: lastVal, color: '#3388ff', label: '' });
    updateClassification({ entries });
  };

  const handleRemoveEntry = (index: number) => {
    const entries = (classification?.entries || []).filter((_, i) => i !== index);
    updateClassification({ entries });
  };

  const handleClearClassification = () => {
    const next = { ...overrides };
    delete next['raster_classification'];
    onChange(next);
  };

  // ── Classify (equal interval) ──

  const [numClasses, setNumClasses] = [
    (classification as RasterClassification & { _numClasses?: number })?._numClasses ?? 10,
    (n: number) => {
      if (classification) {
        // Store numClasses transiently (not persisted, just for UI state)
        setField('raster_classification', { ...classification, _numClasses: n });
      }
    },
  ];

  const handleClassify = () => {
    const min = classification?.min ?? 0;
    const max = classification?.max ?? 100;
    const interp = classification?.interpolation ?? 'discrete';
    const count = Math.max(2, Math.min(50, numClasses));
    const rampColors = extractRampColors(currentRamp || 'viridis');
    const fallbackColors = rampColors.length > 0 ? rampColors : extractRampColors('viridis');

    const entries: RasterClassificationEntry[] = [];
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0 : i / (count - 1);
      const value = min + t * (max - min);
      const color = interpolateColor(fallbackColors, t);
      entries.push({
        value: Math.round(value * 1000) / 1000,
        color,
        label: String(Math.round(value * 100) / 100),
      });
    }

    updateClassification({ min, max, interpolation: interp, entries });
  };

  // ── QML/SLD import ──

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const ext = file.name.toLowerCase();
      let result: RasterClassification | null = null;

      if (ext.endsWith('.qml')) {
        result = parseQML(text);
      } else if (ext.endsWith('.sld')) {
        result = parseSLD(text);
      } else {
        // Try both parsers
        result = parseQML(text) || parseSLD(text);
      }

      if (result) {
        setField('raster_classification', result);
        syncLegend(result);
      } else {
        alert('Could not parse the style file. Ensure it is a valid QML or SLD file.');
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be re-imported
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Ramp click ──

  const handleRampClick = (key: string) => {
    const newKey = currentRamp === key ? '' : key;
    setField('color_ramp', newKey);

    if (hasClassification && newKey) {
      // Redistribute ramp colors across existing entries
      const rampColors = extractRampColors(newKey);
      if (rampColors.length > 0) {
        const entries = (classification!.entries || []).map((entry, i, arr) => {
          const t = arr.length === 1 ? 0 : i / (arr.length - 1);
          return { ...entry, color: interpolateColor(rampColors, t) };
        });
        updateClassification({ entries });
      }
    } else if (newKey && GRADIENTS[newKey] && legend?.type === 'gradient') {
      onLegendChange({ ...legend, gradient: GRADIENTS[newKey] });
    }
  };

  return (
    <div className="space-y-5">
      {/* Opacity */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Opacity</Label>
        <div className="flex items-center gap-3">
          <Slider
            value={[Math.round(currentOpacity * 100)]}
            onValueChange={([v]) => setField('raster-opacity', v / 100)}
            max={100}
            step={5}
            className="flex-1"
          />
          <span className="text-sm text-gray-500 w-12 text-right">
            {Math.round(currentOpacity * 100)}%
          </span>
        </div>
      </div>

      {/* Classification (Pseudocolor) */}
      <div className="border rounded-lg p-4 space-y-4 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Singleband Pseudocolor</Label>
          {hasClassification && (
            <Button size="sm" variant="ghost" className="h-7 text-xs text-gray-500" onClick={handleClearClassification}>
              <X className="h-3 w-3 mr-1" /> Clear
            </Button>
          )}
        </div>

        {/* Min / Max / Unit */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label className="text-xs">Min</Label>
            <Input
              type="number"
              value={classification?.min ?? 0}
              onChange={(e) => updateClassification({ min: Number(e.target.value) })}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Max</Label>
            <Input
              type="number"
              value={classification?.max ?? 100}
              onChange={(e) => updateClassification({ max: Number(e.target.value) })}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Unit</Label>
            <Input
              value={classification?.unit ?? ''}
              onChange={(e) => updateClassification({ unit: e.target.value })}
              placeholder="e.g. °C"
              className="h-8 text-sm"
            />
          </div>
        </div>

        {/* Interpolation toggle */}
        <div>
          <Label className="text-xs mb-1 block">Interpolation</Label>
          <div className="flex gap-2">
            {(['discrete', 'linear'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => updateClassification({ interpolation: mode })}
                className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                  (classification?.interpolation ?? 'discrete') === mode
                    ? 'bg-[#141d2d] text-white border-[#141d2d]'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Classify controls */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label className="text-xs">Mode</Label>
            <select
              className="w-full h-8 text-sm rounded border border-gray-300 px-2 bg-white"
              defaultValue="equal_interval"
            >
              <option value="equal_interval">Equal Interval</option>
            </select>
          </div>
          <div className="w-20">
            <Label className="text-xs">Classes</Label>
            <Input
              type="number"
              min={2}
              max={50}
              value={numClasses}
              onChange={(e) => setNumClasses(Math.max(2, Math.min(50, Number(e.target.value))))}
              className="h-8 text-sm"
            />
          </div>
          <Button size="sm" className="h-8" onClick={handleClassify}>
            Classify
          </Button>
        </div>

        {/* Import QML/SLD */}
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".qml,.sld,.xml"
            className="hidden"
            onChange={handleFileImport}
          />
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-3 w-3 mr-1" /> Import QML / SLD
          </Button>
        </div>

        {/* Classification table */}
        {hasClassification && (
          <div className="space-y-1.5">
            <div className="grid grid-cols-[2rem_1fr_1fr_2rem] gap-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-0.5">
              <span>Color</span>
              <span>Value</span>
              <span>Label</span>
              <span />
            </div>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {classification!.entries.map((entry, i) => (
                <div key={i} className="grid grid-cols-[2rem_1fr_1fr_2rem] gap-1 items-center">
                  <input
                    type="color"
                    value={entry.color}
                    onChange={(e) => handleEntryChange(i, 'color', e.target.value)}
                    className="w-7 h-7 rounded border cursor-pointer p-0"
                  />
                  <Input
                    type="number"
                    value={entry.value}
                    onChange={(e) => handleEntryChange(i, 'value', Number(e.target.value))}
                    className="h-7 text-xs"
                  />
                  <Input
                    value={entry.label}
                    onChange={(e) => handleEntryChange(i, 'label', e.target.value)}
                    className="h-7 text-xs"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-gray-400 hover:text-red-500"
                    onClick={() => handleRemoveEntry(i)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <Button size="sm" variant="outline" onClick={handleAddEntry} className="w-full h-7 text-xs">
              <Plus className="h-3 w-3 mr-1" /> Add Entry
            </Button>
          </div>
        )}

        {/* Classification preview */}
        {hasClassification && (
          <div>
            <div
              className="h-3 rounded"
              style={{ background: buildGradientFromClassification(classification!) }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-gray-500">{Math.round(classification!.min * 100) / 100}</span>
              <span className="text-[10px] text-gray-500">
                {Math.round(classification!.max * 100) / 100} {classification!.unit}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Color Ramp Presets */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Color Ramp</Label>
        <p className="text-xs text-gray-500 mb-3">
          {hasClassification
            ? 'Click a ramp to recolor the classification entries.'
            : 'Select a color ramp to override the default. Click again to deselect.'}
        </p>
        <div className="space-y-3">
          {RAMP_GROUPS.map((group) => (
            <div key={group.label}>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                {group.label}
              </span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {group.keys.map((key) => (
                  <ColorRampPreview
                    key={key}
                    rampKey={key}
                    selected={currentRamp === key}
                    onClick={() => handleRampClick(key)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resampling */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Resampling</Label>
        <div className="flex gap-2">
          {(['nearest', 'linear'] as const).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setField('raster-resampling', method)}
              className={`px-4 py-2 text-sm rounded border transition-colors ${
                currentResampling === method
                  ? 'bg-[#141d2d] text-white border-[#141d2d]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {method.charAt(0).toUpperCase() + method.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
