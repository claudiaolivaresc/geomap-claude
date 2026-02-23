'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { colorStopsToGradient } from '@/config/layers.config';
import type { ColorStop } from '@/types/admin.types';

interface ColorStopEditorProps {
  stops: ColorStop[];
  onChange: (stops: ColorStop[]) => void;
}

export function ColorStopEditor({ stops, onChange }: ColorStopEditorProps) {
  const sorted = [...stops].sort((a, b) => a.position - b.position);

  const updateStop = (index: number, updates: Partial<ColorStop>) => {
    const newStops = sorted.map((s, i) => (i === index ? { ...s, ...updates } : s));
    onChange(newStops);
  };

  const removeStop = (index: number) => {
    onChange(sorted.filter((_, i) => i !== index));
  };

  const addStop = () => {
    // Insert at midpoint of the range
    const newPos = sorted.length > 0
      ? (sorted[sorted.length - 1].position + (sorted[0]?.position ?? 0)) / 2
      : 0.5;
    onChange([...sorted, { position: Math.round(newPos * 100) / 100, color: '#888888' }]);
  };

  return (
    <div className="space-y-3">
      {/* Gradient preview */}
      <div
        className="h-6 rounded border border-gray-200"
        style={{ background: sorted.length > 0 ? colorStopsToGradient(sorted) : '#e5e7eb' }}
      />

      {/* Stop list */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {sorted.map((stop, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {/* Color picker */}
            <input
              type="color"
              value={stop.color}
              onChange={(e) => updateStop(idx, { color: e.target.value })}
              className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0"
            />

            {/* Position slider */}
            <Slider
              value={[Math.round(stop.position * 100)]}
              onValueChange={([v]) => updateStop(idx, { position: v / 100 })}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-gray-500 w-10 text-right">
              {Math.round(stop.position * 100)}%
            </span>

            {/* Delete */}
            <button
              type="button"
              onClick={() => removeStop(idx)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addStop}
        className="w-full gap-1"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Stop
      </Button>
    </div>
  );
}
