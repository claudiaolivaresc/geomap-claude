'use client';

import { useEffect, useRef, useState } from 'react';
import { GripVertical, Info, X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useUIStore, useLayerStore, useMapStore, useUploadStore } from '@/stores';
import { getAnyLayerById } from '@/lib/layerLookup';
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

/** Active layers content — rendered inside the sidebar */
export function ActiveLayersContent() {
  const { openLayerInfo } = useUIStore();
  const { activeLayers, setLayerOpacity, updateLayerOnMap, toggleLayer, removeLayerFromMap, reorderLayers } = useLayerStore();
  const { map } = useMapStore();
  const { uploadedLayers, removeUploadedLayer, setUploadedLayerOpacity } = useUploadStore();

  // Drag state
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const dragNode = useRef<HTMLDivElement | null>(null);

  // Get active layers with their configs
  const activeLayersList = Array.from(activeLayers.entries())
    .filter(([, state]) => state.visible)
    .map(([id, state]) => ({
      id,
      state,
      config: getAnyLayerById(id),
    }))
    .filter((item) => item.config !== undefined);

  const visibleUploads = uploadedLayers.filter((l) => l.visible);
  const totalCount = activeLayersList.length + visibleUploads.length;

  // Sync map z-order whenever the active layer list/order changes.
  const layerOrderKey = activeLayersList.map((l) => l.id).join(',');
  useEffect(() => {
    if (!map || activeLayersList.length === 0) return;
    for (let i = activeLayersList.length - 1; i >= 0; i--) {
      const mapLayerId = `layer-${activeLayersList[i].id}`;
      if (map.getLayer(mapLayerId)) {
        map.moveLayer(mapLayerId);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layerOrderKey, map]);

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

  const handleRemoveLayer = (layerId: string) => {
    if (map) {
      removeLayerFromMap(map, layerId);
    }
    toggleLayer(layerId);
  };

  // --- Drag-and-drop handlers ---
  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDragIdx(idx);
    dragNode.current = e.currentTarget as HTMLDivElement;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    setOverIdx(idx);
  };

  const handleDrop = (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === dropIdx) {
      setDragIdx(null);
      setOverIdx(null);
      return;
    }

    const ids = activeLayersList.map((l) => l.id);
    const [movedId] = ids.splice(dragIdx, 1);
    ids.splice(dropIdx, 0, movedId);

    reorderLayers(ids);

    setDragIdx(null);
    setOverIdx(null);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
    setOverIdx(null);
  };

  if (totalCount === 0) {
    return (
      <div className="p-4 text-sm text-gray-500 text-center">
        No active layers. Enable layers from the Layers tab.
      </div>
    );
  }

  return (
    <div className="p-3 space-y-1">
      {activeLayersList.map(({ id, state, config }, idx) => {
        const hasSymbols =
          config!.legend?.type === 'symbol' && config!.legend.items.length > 0;

        const isDragging = dragIdx === idx;
        const isOver = overIdx === idx && dragIdx !== idx;

        return (
          <div
            key={id}
            draggable
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={(e) => handleDrop(e, idx)}
            onDragEnd={handleDragEnd}
            className={cn(
              'p-3 bg-white rounded-lg border transition-all',
              isDragging && 'opacity-40 scale-95',
              isOver
                ? 'border-[#ffa925] shadow-md shadow-[#ffa925]/20'
                : 'border-gray-200',
            )}
          >
            {/* Layer title */}
            <div className="flex items-center gap-1.5 mb-2">
              <GripVertical className="h-4 w-4 text-gray-300 flex-shrink-0 cursor-grab active:cursor-grabbing" />
              <span className="text-sm font-medium text-gray-900 truncate flex-1">
                {config!.title}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0"
                onClick={() => openLayerInfo(id)}
                title="Layer info"
              >
                <Info className="h-3.5 w-3.5 text-[#819a93]" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0"
                onClick={() => handleRemoveLayer(id)}
                title="Remove layer"
              >
                <X className="h-3.5 w-3.5 text-gray-400" />
              </Button>
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
            {config!.legend?.type === 'symbol' && hasSymbols && (
              <div className="space-y-1 mb-3">
                {config!.legend.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
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

      {/* Uploaded layers */}
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
  );
}

/** Legacy export — kept for backward compatibility but no longer used as standalone */
export const Legend = ActiveLayersContent;
