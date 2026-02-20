'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ColorRampPreview } from './ColorRampPreview';
import { COLOR_RAMPS } from '@/config/layers.config';

interface RasterStyleFormProps {
  overrides: Record<string, unknown>;
  defaults: Record<string, unknown>;
  onChange: (overrides: Record<string, unknown>) => void;
}

export function RasterStyleForm({ overrides, defaults, onChange }: RasterStyleFormProps) {
  const currentOpacity = (overrides['raster-opacity'] ?? defaults['raster-opacity'] ?? 0.8) as number;
  const currentRamp = (overrides['color_ramp'] as string) || '';
  const currentResampling = (overrides['raster-resampling'] ?? defaults['raster-resampling'] ?? 'nearest') as string;

  const setField = (key: string, value: unknown) => {
    onChange({ ...overrides, [key]: value });
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

      {/* Color Ramp */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Color Ramp</Label>
        <p className="text-xs text-gray-500 mb-2">
          Select a color ramp to override the default. Leave unselected to use default.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(COLOR_RAMPS).map((key) => (
            <ColorRampPreview
              key={key}
              rampKey={key}
              selected={currentRamp === key}
              onClick={() => setField('color_ramp', currentRamp === key ? '' : key)}
            />
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
