'use client';

import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useUIStore, useLayerStore, useMapStore, useUploadStore } from '@/stores';
import { getLayerById } from '@/config';
import { cn } from '@/lib/utils';
import type { LayerConfig, VectorStyle } from '@/types';

/** Render the appropriate symbol shape based on the layer's vector style type */
function LegendSymbol({ color, config }: { color: string; config: LayerConfig }) {
  const styleType = (config.style as VectorStyle)?.type;

  if (styleType === 'line') {
    return (
      <div
        className="w-5 h-[3px] rounded-full"
        style={{ backgroundColor: color }}
      />
    );
  }
  if (styleType === 'fill') {
    return (
      <div
        className="w-3 h-3 rounded-sm border border-gray-300"
        style={{ backgroundColor: color }}
      />
    );
  }
  // circle or default
  return (
    <div
      className="w-3 h-3 rounded-full border border-gray-300"
      style={{ backgroundColor: color }}
    />
  );
}

export function Legend() {
  const { legendOpen, toggleLegend } = useUIStore();
  const { activeLayers, setLayerOpacity, updateLayerOnMap } = useLayerStore();
  const { map } = useMapStore();
  const { uploadedLayers, removeUploadedLayer, setUploadedLayerOpacity } = useUploadStore();

  // Get active layers with their configs
  const activeLayersList = Array.from(activeLayers.entries())
    .filter(([, state]) => state.visible)
    .map(([id, state]) => ({
      id,
      state,
      config: getLayerById(id),
    }))
    .filter((item) => item.config !== undefined);

  const visibleUploads = uploadedLayers.filter((l) => l.visible);
  const totalCount = activeLayersList.length + visibleUploads.length;

  const handleOpacityChange = (layerId: string, value: number[]) => {
    setLayerOpacity(layerId, value[0] / 100);
    if (map) {
      updateLayerOnMap(map, layerId);
    }
  };

  const handleUploadOpacityChange = (id: string, value: number[]) => {
    const opacity = value[0] / 100;
    setUploadedLayerOpacity(id, opacity);
    if (map) {
      // Update all sub-layers for this upload
      for (const suffix of ['-fill', '-outline', '-line', '-circle']) {
        const mapLayerId = `layer-${id}${suffix}`;
        if (map.getLayer(mapLayerId)) {
          const layerType = map.getLayer(mapLayerId)?.type;
          if (layerType === 'fill') map.setPaintProperty(mapLayerId, 'fill-opacity', opacity * 0.15);
          else if (layerType === 'line') map.setPaintProperty(mapLayerId, 'line-opacity', opacity);
          else if (layerType === 'circle') map.setPaintProperty(mapLayerId, 'circle-opacity', opacity);
        }
      }
    }
  };

  const handleRemoveUpload = (id: string) => {
    if (map) {
      for (const suffix of ['-fill', '-outline', '-line', '-circle']) {
        const mapLayerId = `layer-${id}${suffix}`;
        if (map.getLayer(mapLayerId)) map.removeLayer(mapLayerId);
      }
      const sourceId = `source-${id}`;
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    }
    removeUploadedLayer(id);
  };

  if (totalCount === 0) {
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
          Active Layers ({totalCount})
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
          {activeLayersList.map(({ id, state, config }) => {
            const hasMultipleSymbols =
              config!.legend?.type === 'symbol' && config!.legend.items.length > 1;

            return (
              <div
                key={id}
                className="p-3 bg-white rounded-lg border border-gray-200"
              >
                {/* Layer title */}
                <div className="flex items-center gap-2 mb-2">
                  {config!.legend?.type === 'symbol' && (
                    <LegendSymbol
                      color={config!.legend.items[0]?.color}
                      config={config!}
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

                {/* Symbol legend — only shown when there are multiple items */}
                {config!.legend?.type === 'symbol' && hasMultipleSymbols && (
                  <div className="space-y-1 mb-3">
                    {config!.legend.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <LegendSymbol color={item.color} config={config!} />
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
            );
          })}

          {/* Uploaded GeoPackage layers */}
          {visibleUploads.map((ul) => (
            <div
              key={ul.id}
              className="p-3 bg-white rounded-lg border border-dashed border-[#ff6b35]/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-sm border-2 border-dashed"
                  style={{ borderColor: '#ff6b35', backgroundColor: '#ff6b3526' }}
                />
                <span className="text-sm font-medium text-gray-900 truncate flex-1">
                  {ul.tableName}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 flex-shrink-0"
                  onClick={() => handleRemoveUpload(ul.id)}
                  title="Remove layer"
                >
                  <X className="h-3 w-3 text-gray-400" />
                </Button>
              </div>
              <div className="text-xs text-gray-400 mb-2 truncate">{ul.fileName}</div>
              <div className="flex items-center gap-3">
                <Slider
                  value={[Math.round(ul.opacity * 100)]}
                  onValueChange={(value) => handleUploadOpacityChange(ul.id, value)}
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <span className="text-xs text-gray-500 w-10 text-right">
                  {Math.round(ul.opacity * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
