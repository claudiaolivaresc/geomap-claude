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
  const { openLayerInfo } = useUIStore();
  const { map } = useMapStore();

  const isActive = isLayerActive(layer.id);
  const canAccess = hasPermission(layer.permissions);
  const isRestricted = layer.permissions.visibility === 'restricted';

  const handleToggle = () => {
    if (!canAccess) {
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

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 py-1 px-1 rounded transition-colors',
        canAccess ? 'hover:bg-[#e8f2ed] cursor-pointer' : 'opacity-60 cursor-not-allowed',
        depth > 0 && 'ml-3'
      )}
    >
      {/* Checkbox or Lock */}
      {canAccess ? (
        <Checkbox
          checked={isActive}
          onCheckedChange={handleToggle}
          className="h-3.5 w-3.5 data-[state=checked]:bg-[#ffa925] data-[state=checked]:border-[#ffa925]"
        />
      ) : (
        <div className="w-3.5 h-3.5 flex items-center justify-center">
          <Lock className="h-3 w-3 text-[#8b94a7]" />
        </div>
      )}

      {/* Layer name */}
      <span
        className={cn(
          'text-[13px] leading-tight flex-1 min-w-0',
          canAccess ? 'text-[#141d2d]' : 'text-[#8b94a7]'
        )}
        title={layer.title}
        onClick={canAccess ? handleToggle : undefined}
      >
        {layer.title}
      </span>

      {/* Restricted badge */}
      {isRestricted && !canAccess && (
        <span className="px-1.5 py-0.5 text-[10px] font-medium text-white rounded bg-blue-500 flex-shrink-0">
          RESTRICTED
        </span>
      )}

      {/* Info button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 flex-shrink-0"
        onClick={handleInfoClick}
      >
        <Info className="h-3 w-3 text-[#819a93]" />
      </Button>
    </div>
  );
}
