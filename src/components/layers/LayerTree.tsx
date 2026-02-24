'use client';

import { useMemo } from 'react';
import { LAYER_GROUPS } from '@/config';
import { useConfigStore } from '@/stores';
import { LayerGroup } from './LayerGroup';
import type { LayerGroup as LayerGroupType, LayerConfig } from '@/types';

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

/** Deep clone a group tree so we can mutate it without affecting the original */
function cloneTree(groups: LayerGroupType[]): LayerGroupType[] {
  return groups.map((g) => ({
    ...g,
    layers: g.layers ? [...g.layers] : undefined,
    children: g.children ? cloneTree(g.children) : undefined,
  }));
}

/** Find a group by id anywhere in the tree */
function findGroupById(groups: LayerGroupType[], id: string): LayerGroupType | null {
  for (const g of groups) {
    if (g.id === id) return g;
    if (g.children) {
      const found = findGroupById(g.children, id);
      if (found) return found;
    }
  }
  return null;
}

/** Inject dynamic layers into the appropriate groups in the tree */
function injectDynamicLayers(tree: LayerGroupType[], dynamicConfigs: LayerConfig[], getOverride: (id: string) => { group_id?: string } | undefined): LayerGroupType[] {
  const orphans: LayerConfig[] = [];

  for (const config of dynamicConfigs) {
    const override = getOverride(config.id);
    const groupId = override?.group_id;

    if (groupId) {
      const group = findGroupById(tree, groupId);
      if (group) {
        if (!group.layers) group.layers = [];
        group.layers.push(config);
        continue;
      }
    }

    orphans.push(config);
  }

  // Place orphan dynamic layers in a fallback group
  if (orphans.length > 0) {
    let dynamicGroup = tree.find((g) => g.id === 'dynamic-layers');
    if (!dynamicGroup) {
      dynamicGroup = {
        id: 'dynamic-layers',
        title: 'Additional Layers',
        color: '#6366f1',
        defaultExpanded: true,
        layers: [],
      };
      tree.push(dynamicGroup);
    }
    dynamicGroup.layers = [...(dynamicGroup.layers || []), ...orphans];
  }

  return tree;
}

export function LayerTree() {
  const { isLayerPublished, isLoaded, getDynamicLayers, getOverride } = useConfigStore();

  const visibleGroups = useMemo(() => {
    if (!isLoaded) return LAYER_GROUPS;

    // 1. Filter static layers by published status
    const filtered = filterPublished(LAYER_GROUPS, isLayerPublished);

    // 2. Get published dynamic layers and inject them into the tree
    const dynamicConfigs = getDynamicLayers();
    if (dynamicConfigs.length === 0) return filtered;

    const tree = cloneTree(filtered);
    return injectDynamicLayers(tree, dynamicConfigs, getOverride);
  }, [isLoaded, isLayerPublished, getDynamicLayers, getOverride]);

  return (
    <div className="space-y-2">
      {visibleGroups.map((group) => (
        <LayerGroup key={group.id} group={group} depth={0} />
      ))}
    </div>
  );
}
