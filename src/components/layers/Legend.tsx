'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useUIStore, useLayerStore, useMapStore } from '@/stores';
import { getLayerById } from '@/config';
import { cn } from '@/lib/utils';

export function Legend() {
  const { legendOpen, toggleLegend } = useUIStore();
  const { activeLayers, setLayerOpacity, updateLayerOnMap } = useLayerStore();
  const { map } = useMapStore();

  // Get active layers with their configs
  const activeLayersList = Array.from(activeLayers.entries())
    .filter(([, state]) => state.visible)
    .map(([id, state]) => ({
      id,
      state,
      config: getLayerById(id),
    }))
    .filter((item) => item.config !== undefined);

  const handleOpacityChange = (layerId: string, value: number[]) => {
    setLayerOpacity(layerId, value[0] / 100);
    if (map) {
      updateLayerOnMap(map, layerId);
    }
  };

  if (activeLayersList.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <button
        onClick={toggleLegend}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium text-sm text-gray-700">
          📊 Active Layers ({activeLayersList.length})
        </span>
        {legendOpen ? (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        )}
      </button>

      {/* Content */}
      {legendOpen && (
        <div className="p-3 pt-0 space-y-3">
          {activeLayersList.map(({ id, state, config }) => (
              <div
                key={id}
                className="p-3 bg-white rounded-lg border border-gray-200"
              >
                {/* Layer title */}
                <div className="flex items-center gap-2 mb-2">
                  {config!.legend?.type === 'symbol' && (
                    <div
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: config!.legend.items[0]?.color }}
                    />
                  )}
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {config!.title}
                  </span>
                </div>

                {/* Gradient legend */}
                {config!.legend?.type === 'gradient' && (
                  <div className="mb-3">
                    <div
                      className="h-3 rounded"
                      style={{ background: config!.legend.gradient }}
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        {config!.legend.min}
                      </span>
                      <span className="text-xs text-gray-500">
                        {config!.legend.max} {config!.legend.unit}
                      </span>
                    </div>
                  </div>
                )}

                {/* Symbol legend */}
                {config!.legend?.type === 'symbol' && (
                  <div className="space-y-1 mb-3">
                    {config!.legend.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs text-gray-600">{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Opacity slider */}
                <div className="flex items-center gap-3">
                  <Slider
                    value={[Math.round(state.opacity * 100)]}
                    onValueChange={(value) => handleOpacityChange(id, value)}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-500 w-10 text-right">
                    {Math.round(state.opacity * 100)}%
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
