'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

interface VectorStyleFormProps {
  vectorType: 'circle' | 'line' | 'fill';
  overrides: Record<string, unknown>;
  defaults: Record<string, unknown>;
  onChange: (overrides: Record<string, unknown>) => void;
}

export function VectorStyleForm({ vectorType, overrides, defaults, onChange }: VectorStyleFormProps) {
  const get = (key: string) => overrides[key] ?? defaults[key];

  const setField = (key: string, value: unknown) => {
    onChange({ ...overrides, [key]: value });
  };

  if (vectorType === 'circle') {
    return (
      <div className="space-y-5">
        {/* Circle Color */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Fill Color</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={String(get('circle-color') || '#FF0000')}
              onChange={(e) => setField('circle-color', e.target.value)}
              className="h-9 w-14 rounded border border-gray-300 cursor-pointer"
            />
            <Input
              value={String(get('circle-color') || '#FF0000')}
              onChange={(e) => setField('circle-color', e.target.value)}
              className="flex-1 font-mono text-sm"
            />
          </div>
        </div>

        {/* Circle Opacity */}
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

        {/* Circle Radius */}
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

        {/* Stroke Color */}
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

        {/* Stroke Width */}
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
      </div>
    );
  }

  if (vectorType === 'line') {
    return (
      <div className="space-y-5">
        {/* Line Color */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Line Color</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={String(get('line-color') || '#FF0000')}
              onChange={(e) => setField('line-color', e.target.value)}
              className="h-9 w-14 rounded border border-gray-300 cursor-pointer"
            />
            <Input
              value={String(get('line-color') || '#FF0000')}
              onChange={(e) => setField('line-color', e.target.value)}
              className="flex-1 font-mono text-sm"
            />
          </div>
        </div>

        {/* Line Opacity */}
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

        {/* Line Width */}
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
      </div>
    );
  }

  // Fill type
  return (
    <div className="space-y-5">
      <div>
        <Label className="text-sm font-medium mb-2 block">Fill Color</Label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={String(get('fill-color') || '#FF0000')}
            onChange={(e) => setField('fill-color', e.target.value)}
            className="h-9 w-14 rounded border border-gray-300 cursor-pointer"
          />
          <Input
            value={String(get('fill-color') || '#FF0000')}
            onChange={(e) => setField('fill-color', e.target.value)}
            className="flex-1 font-mono text-sm"
          />
        </div>
      </div>

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
    </div>
  );
}
