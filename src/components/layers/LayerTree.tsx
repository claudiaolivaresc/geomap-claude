'use client';

import { useMemo } from 'react';
import { LAYER_GROUPS } from '@/config';
import { useConfigStore } from '@/stores';
import { LayerGroup } from './LayerGroup';
import type { LayerGroup as LayerGroupType } from '@/types';

function filterPublished(groups: LayerGroupType[], isPublished: (id: string) => boolean): LayerGroupType[] {
  return groups
    .map((group) => {
      const filteredLayers = group.layers?.filter((l) => isPublished(l.id));
      const filteredChildren = group.children ? filterPublished(group.children, isPublished) : undefined;

      // Skip empty groups
      const hasLayers = filteredLayers && filteredLayers.length > 0;
      const hasChildren = filteredChildren && filteredChildren.length > 0;
      if (!hasLayers && !hasChildren) return null;

      return { ...group, layers: filteredLayers, children: filteredChildren };
    })
    .filter(Boolean) as LayerGroupType[];
}

export function LayerTree() {
  const { isLayerPublished, isLoaded } = useConfigStore();

  const visibleGroups = useMemo(() => {
    if (!isLoaded) return LAYER_GROUPS;
    return filterPublished(LAYER_GROUPS, isLayerPublished);
  }, [isLoaded, isLayerPublished]);

  return (
    <div className="space-y-2">
      {visibleGroups.map((group) => (
        <LayerGroup key={group.id} group={group} depth={0} />
      ))}
    </div>
  );
}
