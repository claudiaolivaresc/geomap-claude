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

      {/* Layer info */}
      <div className="flex-1 min-w-0" onClick={canAccess ? handleToggle : undefined}>
        <p className={cn(
          'text-sm font-medium break-words',
          canAccess ? 'text-[#141d2d]' : 'text-[#8b94a7]'
        )}>
          {layer.title}
        </p>
      </div>

      {/* Restricted badge */}
      {isRestricted && !canAccess && (
        <span className="px-2 py-0.5 text-xs font-medium text-white rounded-full bg-blue-500">
          RESTRICTED
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
