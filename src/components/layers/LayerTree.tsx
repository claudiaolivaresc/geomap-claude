'use client';

import { useMemo } from 'react';
import { LAYER_GROUPS } from '@/config';
import { useConfigStore } from '@/stores';
import { LayerGroup } from './LayerGroup';
import type { LayerGroup as LayerGroupType, LayerConfig } from '@/types';
import type { CustomGroup } from '@/stores/configStore';

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

/** Relocate static layers that have a group_id override to their new group */
function relocateStaticLayers(tree: LayerGroupType[], getOverride: (id: string) => { group_id?: string } | undefined): LayerGroupType[] {
  const toRelocate: { config: LayerConfig; targetGroupId: string }[] = [];

  // Collect layers that need to move and remove them from their current group
  function scanAndRemove(groups: LayerGroupType[]) {
    for (const g of groups) {
      if (g.layers) {
        g.layers = g.layers.filter((l) => {
          const override = getOverride(l.id);
          if (override?.group_id && override.group_id !== g.id) {
            toRelocate.push({ config: l, targetGroupId: override.group_id });
            return false;
          }
          return true;
        });
      }
      if (g.children) scanAndRemove(g.children);
    }
  }
  scanAndRemove(tree);

  // Place relocated layers in their target groups
  for (const { config, targetGroupId } of toRelocate) {
    const target = findGroupById(tree, targetGroupId);
    if (target) {
      if (!target.layers) target.layers = [];
      target.layers.push(config);
    }
  }

  return tree;
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

/** Inject custom (DB-defined) groups into the tree */
function injectCustomGroups(tree: LayerGroupType[], customGroups: CustomGroup[]) {
  // Sort so parents are processed before children
  const sorted = [...customGroups].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  for (const cg of sorted) {
    // Skip if already in tree (shouldn't happen, but guard)
    if (findGroupById(tree, cg.id)) continue;

    const node: LayerGroupType = {
      id: cg.id,
      title: cg.title,
      color: cg.color || '#6366f1',
      defaultExpanded: true,
      layers: [],
      children: [],
    };

    if (cg.parent_id) {
      const parent = findGroupById(tree, cg.parent_id);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(node);
        continue;
      }
    }

    // No parent or parent not found → top-level
    tree.push(node);
  }
}

export function LayerTree() {
  const { isLayerPublished, isLoaded, getDynamicLayers, getOverride, getCustomGroups } = useConfigStore();

  const visibleGroups = useMemo(() => {
    if (!isLoaded) return LAYER_GROUPS;

    // 1. Filter static layers by published status
    const filtered = filterPublished(LAYER_GROUPS, isLayerPublished);

    // 2. Clone tree so we can mutate it
    const tree = cloneTree(filtered);

    // 3. Inject custom (DB) groups so they are available as targets
    const customGroups = getCustomGroups();
    if (customGroups.length > 0) {
      injectCustomGroups(tree, customGroups);
    }

    // 4. Relocate static layers that have a group_id override
    relocateStaticLayers(tree, getOverride);

    // 5. Get published dynamic layers and inject them into the tree
    const dynamicConfigs = getDynamicLayers();
    if (dynamicConfigs.length > 0) {
      injectDynamicLayers(tree, dynamicConfigs, getOverride);
    }

    return tree;
  }, [isLoaded, isLayerPublished, getDynamicLayers, getOverride, getCustomGroups]);

  return (
    <div className="space-y-2">
      {visibleGroups.map((group) => (
        <LayerGroup key={group.id} group={group} depth={0} />
      ))}
    </div>
  );
}
