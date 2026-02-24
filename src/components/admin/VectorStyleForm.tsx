'use client';

import { useState, useEffect, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import type { LayerLegend } from '@/types';
import {
  parseMatchExpression,
  buildMatchExpression,
  assignColors,
  DEFAULT_PALETTE,
  type CategoryEntry,
} from '@/lib/colorByField';

interface ColumnInfo {
  column_name: string;
  data_type: string;
}

interface VectorStyleFormProps {
  vectorType: 'circle' | 'line' | 'fill';
  overrides: Record<string, unknown>;
  defaults: Record<string, unknown>;
  onChange: (overrides: Record<string, unknown>) => void;
  schema?: string;
  table?: string;
  legend: LayerLegend;
  onLegendChange: (legend: LayerLegend) => void;
}

/** Color property key per vector type */
function colorKeyFor(vectorType: string): string {
  if (vectorType === 'line') return 'line-color';
  if (vectorType === 'fill') return 'fill-color';
  return 'circle-color';
}

export function VectorStyleForm({
  vectorType,
  overrides,
  defaults,
  onChange,
  schema,
  table,
  legend,
  onLegendChange,
}: VectorStyleFormProps) {
  const colorKey = colorKeyFor(vectorType);
  const effectiveColor = overrides[colorKey] ?? defaults[colorKey];

  // Detect initial mode from current paint value
  const parsed = Array.isArray(effectiveColor) ? parseMatchExpression(effectiveColor) : null;
  const [mode, setMode] = useState<'single' | 'field'>(parsed ? 'field' : 'single');

  // Color-by-field state
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [selectedField, setSelectedField] = useState<string>(parsed?.field || '');
  const [categories, setCategories] = useState<CategoryEntry[]>(parsed?.categories || []);
  const [fallbackColor, setFallbackColor] = useState(parsed?.fallbackColor || '#cccccc');
  const [loadingValues, setLoadingValues] = useState(false);

  const get = (key: string) => overrides[key] ?? defaults[key];

  const setField = (key: string, value: unknown) => {
    onChange({ ...overrides, [key]: value });
  };

  const tableKey = schema && table ? `${schema}.${table}` : '';

  // Sync legend from categories
  const syncLegend = useCallback(
    (cats: CategoryEntry[]) => {
      const items = cats.map((c) => ({ color: c.color, label: c.label }));
      if (items.length > 0) {
        onLegendChange({ type: 'symbol', items });
      }
    },
    [onLegendChange]
  );

  // Sync legend from simple color
  const syncSingleLegend = useCallback(
    (color: string) => {
      const label =
        legend.type === 'symbol' && legend.items.length === 1
          ? legend.items[0].label
          : '';
      onLegendChange({ type: 'symbol', items: [{ color, label }] });
    },
    [onLegendChange, legend]
  );

  // Re-sync state when layer changes (detected by colorKey value changing)
  useEffect(() => {
    const currentColor = overrides[colorKey] ?? defaults[colorKey];
    const p = Array.isArray(currentColor) ? parseMatchExpression(currentColor) : null;
    if (p) {
      setMode('field');
      setSelectedField(p.field);
      // Merge legend labels into parsed categories
      const legendItems = legend.type === 'symbol' ? legend.items : [];
      const merged = p.categories.map((cat, i) => ({
        ...cat,
        label: legendItems[i]?.label || cat.label,
      }));
      setCategories(merged);
      setFallbackColor(p.fallbackColor);
    } else {
      setMode('single');
      setSelectedField('');
      setCategories([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorKey, defaults]);

  // Fetch columns when table is available
  useEffect(() => {
    if (!tableKey) return;
    fetch(`/api/admin/fields/${tableKey}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.columns) {
          // Filter to text-like columns for categorization
          const textCols = data.columns.filter((c: ColumnInfo) =>
            ['text', 'character varying', 'varchar', 'character', 'char', 'name'].includes(
              c.data_type.toLowerCase()
            )
          );
          setColumns(textCols);
        }
      })
      .catch(() => {});
  }, [tableKey]);

  // Fetch distinct values when field changes
  const fetchDistinctValues = useCallback(
    async (field: string) => {
      if (!tableKey || !field) return;
      setLoadingValues(true);
      try {
        const res = await fetch(
          `/api/admin/fields/${tableKey}/distinct?column=${encodeURIComponent(field)}`
        );
        const data = await res.json();
        if (data.values) {
          const newCats = assignColors(data.values, categories);
          setCategories(newCats);
          // Build and emit match expression
          const expr = buildMatchExpression(field, newCats, fallbackColor);
          setField(colorKey, expr);
          syncLegend(newCats);
        }
      } catch {
        // ignore
      } finally {
        setLoadingValues(false);
      }
    },
    [tableKey, categories, fallbackColor, colorKey, syncLegend] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleModeSwitch = (newMode: 'single' | 'field') => {
    setMode(newMode);
    if (newMode === 'single') {
      // Switch to single color — use fallback or first category color
      const color = fallbackColor || categories[0]?.color || '#FF0000';
      setField(colorKey, color);
      syncSingleLegend(color);
    } else {
      // Switch to field mode — if we have a selected field + categories, rebuild
      if (selectedField && categories.length > 0) {
        const expr = buildMatchExpression(selectedField, categories, fallbackColor);
        setField(colorKey, expr);
        syncLegend(categories);
      }
    }
  };

  const handleFieldSelect = (field: string) => {
    setSelectedField(field);
    setCategories([]);
    fetchDistinctValues(field);
  };

  const handleCategoryColorChange = (index: number, color: string) => {
    const updated = categories.map((c, i) => (i === index ? { ...c, color } : c));
    setCategories(updated);
    const expr = buildMatchExpression(selectedField, updated, fallbackColor);
    setField(colorKey, expr);
    syncLegend(updated);
  };

  const handleCategoryLabelChange = (index: number, label: string) => {
    const updated = categories.map((c, i) => (i === index ? { ...c, label } : c));
    setCategories(updated);
    syncLegend(updated);
  };

  const handleRemoveCategory = (index: number) => {
    const updated = categories.filter((_, i) => i !== index);
    setCategories(updated);
    if (updated.length > 0) {
      const expr = buildMatchExpression(selectedField, updated, fallbackColor);
      setField(colorKey, expr);
      syncLegend(updated);
    } else {
      setField(colorKey, fallbackColor);
      syncSingleLegend(fallbackColor);
    }
  };

  const handleFallbackChange = (color: string) => {
    setFallbackColor(color);
    if (categories.length > 0 && selectedField) {
      const expr = buildMatchExpression(selectedField, categories, color);
      setField(colorKey, expr);
    }
  };

  const handleSingleColorChange = (color: string) => {
    setField(colorKey, color);
    syncSingleLegend(color);
  };

  // --- Shared property controls (opacity, radius/width, stroke) ---
  const renderSharedControls = () => {
    if (vectorType === 'circle') {
      return (
        <>
          <div>
            <Label className="text-sm font-medium mb-2 block">Opacity</Label>
            <div className="flex items-center gap-3">
              <Slider
                value={[Math.round(((get('circle-opacity') as number) ?? 1) * 100)]}
                onValueChange={([v]) => setField('circle-opacity', v / 100)}
                max={100}
                step={5}
                className="flex-1"
              />
              <span className="text-sm text-gray-500 w-12 text-right">
                {Math.round(((get('circle-opacity') as number) ?? 1) * 100)}%
              </span>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Radius</Label>
            <div className="flex items-center gap-3">
              <Slider
                value={[(get('circle-radius') as number) ?? 5]}
                onValueChange={([v]) => setField('circle-radius', v)}
                max={20}
                min={1}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-gray-500 w-12 text-right">
                {(get('circle-radius') as number) ?? 5}px
              </span>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Stroke Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={String(get('circle-stroke-color') || '#FFFFFF')}
                onChange={(e) => setField('circle-stroke-color', e.target.value)}
                className="h-9 w-14 rounded border border-gray-300 cursor-pointer"
              />
              <Input
                value={String(get('circle-stroke-color') || '#FFFFFF')}
                onChange={(e) => setField('circle-stroke-color', e.target.value)}
                className="flex-1 font-mono text-sm"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Stroke Width</Label>
            <div className="flex items-center gap-3">
              <Slider
                value={[(get('circle-stroke-width') as number) ?? 1]}
                onValueChange={([v]) => setField('circle-stroke-width', v)}
                max={5}
                min={0}
                step={0.5}
                className="flex-1"
              />
              <span className="text-sm text-gray-500 w-12 text-right">
                {(get('circle-stroke-width') as number) ?? 1}px
              </span>
            </div>
          </div>
        </>
      );
    }

    if (vectorType === 'line') {
      return (
        <>
          <div>
            <Label className="text-sm font-medium mb-2 block">Opacity</Label>
            <div className="flex items-center gap-3">
              <Slider
                value={[Math.round(((get('line-opacity') as number) ?? 1) * 100)]}
                onValueChange={([v]) => setField('line-opacity', v / 100)}
                max={100}
                step={5}
                className="flex-1"
              />
              <span className="text-sm text-gray-500 w-12 text-right">
                {Math.round(((get('line-opacity') as number) ?? 1) * 100)}%
              </span>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Line Width</Label>
            <div className="flex items-center gap-3">
              <Slider
                value={[(get('line-width') as number) ?? 2]}
                onValueChange={([v]) => setField('line-width', v)}
                max={10}
                min={0.5}
                step={0.5}
                className="flex-1"
              />
              <span className="text-sm text-gray-500 w-12 text-right">
                {(get('line-width') as number) ?? 2}px
              </span>
            </div>
          </div>
        </>
      );
    }

    // Fill
    return (
      <div>
        <Label className="text-sm font-medium mb-2 block">Opacity</Label>
        <div className="flex items-center gap-3">
          <Slider
            value={[Math.round(((get('fill-opacity') as number) ?? 1) * 100)]}
            onValueChange={([v]) => setField('fill-opacity', v / 100)}
            max={100}
            step={5}
            className="flex-1"
          />
          <span className="text-sm text-gray-500 w-12 text-right">
            {Math.round(((get('fill-opacity') as number) ?? 1) * 100)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Mode toggle — only show if table is known */}
      {tableKey && (
        <div>
          <Label className="text-sm font-medium mb-2 block">Color Mode</Label>
          <div className="flex gap-2">
            {(['single', 'field'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleModeSwitch(m)}
                className={`px-4 py-2 text-sm rounded border transition-colors flex-1 ${
                  mode === m
                    ? 'bg-[#141d2d] text-white border-[#141d2d]'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {m === 'single' ? 'Single Color' : 'Color by Field'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Single Color */}
      {mode === 'single' && (
        <div>
          <Label className="text-sm font-medium mb-2 block">
            {vectorType === 'line' ? 'Line Color' : 'Fill Color'}
          </Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={typeof effectiveColor === 'string' ? effectiveColor : '#FF0000'}
              onChange={(e) => handleSingleColorChange(e.target.value)}
              className="h-9 w-14 rounded border border-gray-300 cursor-pointer"
            />
            <Input
              value={typeof effectiveColor === 'string' ? effectiveColor : '#FF0000'}
              onChange={(e) => handleSingleColorChange(e.target.value)}
              className="flex-1 font-mono text-sm"
            />
          </div>
        </div>
      )}

      {/* Color by Field */}
      {mode === 'field' && (
        <div className="space-y-4">
          {/* Field selector */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Color Field</Label>
            {columns.length > 0 ? (
              <select
                value={selectedField}
                onChange={(e) => handleFieldSelect(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">Select a field...</option>
                {columns.map((c) => (
                  <option key={c.column_name} value={c.column_name}>
                    {c.column_name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-gray-500">No text fields available for this layer.</p>
            )}
          </div>

          {/* Categories */}
          {loadingValues && (
            <p className="text-xs text-gray-500">Loading values...</p>
          )}
          {!loadingValues && categories.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium block">Categories</Label>
              {categories.map((cat, i) => (
                <div key={cat.value} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={cat.color}
                    onChange={(e) => handleCategoryColorChange(i, e.target.value)}
                    className="w-8 h-8 rounded border cursor-pointer flex-shrink-0"
                  />
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded font-mono flex-shrink-0 max-w-[120px] truncate" title={cat.value}>
                    {cat.value}
                  </span>
                  <Input
                    value={cat.label}
                    onChange={(e) => handleCategoryLabelChange(i, e.target.value)}
                    placeholder="Label"
                    className="flex-1 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(i)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              {/* Fallback color */}
              <div className="flex items-center gap-2 pt-2 border-t mt-2">
                <input
                  type="color"
                  value={fallbackColor}
                  onChange={(e) => handleFallbackChange(e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer flex-shrink-0"
                />
                <span className="text-xs text-gray-500">Default (unmatched values)</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Shared controls (opacity, radius/width, stroke) */}
      {renderSharedControls()}
    </div>
  );
}
