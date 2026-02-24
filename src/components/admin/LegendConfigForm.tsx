'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import type { LayerLegend, LegendSymbol, LegendGradient } from '@/types';

interface LegendConfigFormProps {
  legend?: LayerLegend;
  onChange: (legend: LayerLegend) => void;
}

export function LegendConfigForm({ legend, onChange }: LegendConfigFormProps) {
  const [mode, setMode] = useState<'symbol' | 'gradient'>(legend?.type || 'symbol');

  const symbolLegend: LegendSymbol = legend?.type === 'symbol'
    ? legend
    : { type: 'symbol', items: [{ color: '#3388ff', label: 'Feature' }] };

  const gradientLegend: LegendGradient = legend?.type === 'gradient'
    ? legend
    : { type: 'gradient', min: 0, max: 100, unit: '', gradient: 'linear-gradient(to right, #3388ff, #ff3838)' };

  const handleModeChange = (newMode: 'symbol' | 'gradient') => {
    setMode(newMode);
    if (newMode === 'symbol') {
      onChange(symbolLegend);
    } else {
      onChange(gradientLegend);
    }
  };

  // Symbol mode handlers
  const handleAddItem = () => {
    const items = [...symbolLegend.items, { color: '#3388ff', label: '' }];
    onChange({ type: 'symbol', items });
  };

  const handleRemoveItem = (index: number) => {
    const items = symbolLegend.items.filter((_, i) => i !== index);
    if (items.length === 0) items.push({ color: '#3388ff', label: 'Feature' });
    onChange({ type: 'symbol', items });
  };

  const handleItemChange = (index: number, field: 'color' | 'label', value: string) => {
    const items = symbolLegend.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange({ type: 'symbol', items });
  };

  // Gradient mode handlers
  const handleGradientChange = (field: keyof LegendGradient, value: string | number) => {
    onChange({ ...gradientLegend, [field]: value });
  };

  return (
    <div className="space-y-4">
      {/* Mode selector */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={mode === 'symbol' ? 'default' : 'outline'}
          onClick={() => handleModeChange('symbol')}
          className="flex-1"
        >
          Symbol
        </Button>
        <Button
          size="sm"
          variant={mode === 'gradient' ? 'default' : 'outline'}
          onClick={() => handleModeChange('gradient')}
          className="flex-1"
        >
          Gradient
        </Button>
      </div>

      {mode === 'symbol' ? (
        <div className="space-y-2">
          {symbolLegend.items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="color"
                value={item.color}
                onChange={(e) => handleItemChange(i, 'color', e.target.value)}
                className="w-8 h-8 rounded border cursor-pointer"
              />
              <Input
                value={item.label}
                onChange={(e) => handleItemChange(i, 'label', e.target.value)}
                placeholder="Label"
                className="flex-1"
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-gray-400 hover:text-red-500"
                onClick={() => handleRemoveItem(i)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={handleAddItem} className="w-full">
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Item
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Preview */}
          <div>
            <div className="h-4 rounded" style={{ background: gradientLegend.gradient }} />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">{gradientLegend.min}</span>
              <span className="text-xs text-gray-500">{gradientLegend.max} {gradientLegend.unit}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">Min</Label>
              <Input
                type="number"
                value={gradientLegend.min}
                onChange={(e) => handleGradientChange('min', Number(e.target.value))}
              />
            </div>
            <div>
              <Label className="text-xs">Max</Label>
              <Input
                type="number"
                value={gradientLegend.max}
                onChange={(e) => handleGradientChange('max', Number(e.target.value))}
              />
            </div>
            <div>
              <Label className="text-xs">Unit</Label>
              <Input
                value={gradientLegend.unit}
                onChange={(e) => handleGradientChange('unit', e.target.value)}
                placeholder="e.g. km"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">CSS Gradient</Label>
            <Input
              value={gradientLegend.gradient}
              onChange={(e) => handleGradientChange('gradient', e.target.value)}
              placeholder="linear-gradient(to right, #color1, #color2)"
              className="font-mono text-xs"
            />
          </div>
        </div>
      )}
    </div>
  );
}
