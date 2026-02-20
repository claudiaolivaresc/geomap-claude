'use client';

import { Info, Lock } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useLayerStore, useAuthStore, useUIStore, useMapStore } from '@/stores';
import type { LayerConfig } from '@/types';
import { cn } from '@/lib/utils';

interface LayerItemProps {
  layer: LayerConfig;
  depth: number;
}

export function LayerItem({ layer, depth }: LayerItemProps) {
  const { isLayerActive, toggleLayer, addLayerToMap, removeLayerFromMap } = useLayerStore();
  const { hasPermission } = useAuthStore();
  const { openLayerInfo, setUpgradeModalOpen } = useUIStore();
  const { map } = useMapStore();

  const isActive = isLayerActive(layer.id);
  const canAccess = hasPermission(layer.permissions);
  const isPremium = layer.permissions.requiresAuth &&
    layer.permissions.allowedRoles.includes('premium') &&
    !layer.permissions.allowedRoles.includes('free');

  const handleToggle = () => {
    if (!canAccess) {
      setUpgradeModalOpen(true);
      return;
    }

    if (map) {
      if (isActive) {
        removeLayerFromMap(map, layer.id);
      } else {
        addLayerToMap(map, layer);
      }
    }
    toggleLayer(layer.id);
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openLayerInfo(layer.id);
  };

  // Get preview color for the layer
  const getPreviewColor = () => {
    if (layer.legend?.type === 'symbol') {
      return layer.legend.items[0]?.color || '#6b7280';
    }
    if (layer.legend?.type === 'gradient') {
      return undefined; // Will use gradient
    }
    return '#6b7280';
  };

  const previewColor = getPreviewColor();

  return (
    <div
      className={cn(
        'flex items-center gap-2 p-2 rounded-lg border border-[#b4ccc5]/50 bg-white transition-colors',
        canAccess ? 'hover:bg-[#f6fbf8]' : 'opacity-60 cursor-not-allowed',
        depth > 0 && 'ml-3'
      )}
    >
      {/* Checkbox or Lock */}
      {canAccess ? (
        <Checkbox
          checked={isActive}
          onCheckedChange={handleToggle}
          className="data-[state=checked]:bg-[#ffa925] data-[state=checked]:border-[#ffa925]"
        />
      ) : (
        <div className="w-4 h-4 flex items-center justify-center">
          <Lock className="h-3.5 w-3.5 text-[#8b94a7]" />
        </div>
      )}

      {/* Layer preview (color swatch or gradient) */}
      <div className="flex-shrink-0">
        {layer.legend?.type === 'gradient' ? (
          <div
            className="w-8 h-5 rounded border border-gray-200"
            style={{ background: layer.legend.gradient }}
          />
        ) : (
          <div
            className="w-5 h-5 rounded border border-gray-200"
            style={{ backgroundColor: previewColor }}
          />
        )}
      </div>

      {/* Layer info */}
      <div className="flex-1 min-w-0" onClick={canAccess ? handleToggle : undefined}>
        <p className={cn(
          'text-sm font-medium break-words',
          canAccess ? 'text-[#141d2d]' : 'text-[#8b94a7]'
        )}>
          {layer.title}
        </p>
        {layer.legend?.type === 'gradient' && (
          <p className="text-xs text-[#819a93]">
            {layer.legend.min} - {layer.legend.max} {layer.legend.unit}
          </p>
        )}
      </div>

      {/* Premium badge */}
      {isPremium && !canAccess && (
        <span className="px-2 py-0.5 text-xs font-medium text-white rounded-full" style={{ backgroundColor: '#e14716' }}>
          PRO
        </span>
      )}

      {/* Info button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 flex-shrink-0"
        onClick={handleInfoClick}
      >
        <Info className="h-4 w-4 text-[#819a93]" />
      </Button>
    </div>
  );
}
