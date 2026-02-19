'use client';

import { ChevronRight, ChevronDown } from 'lucide-react';
import { useLayerStore } from '@/stores';
import { LayerItem } from './LayerItem';
import type { LayerGroup as LayerGroupType } from '@/types';
import { cn } from '@/lib/utils';

interface LayerGroupProps {
  group: LayerGroupType;
  depth: number;
}

const GROUP_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  surface: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800' },
  subsurface: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800' },
  structural: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
  'thermal-model': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800' },
  'heat-source-proximity': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800' },
};

export function LayerGroup({ group, depth }: LayerGroupProps) {
  const { expandedGroups, toggleGroupExpanded } = useLayerStore();
  const isExpanded = expandedGroups.has(group.id);

  const colors = GROUP_COLORS[group.id] || {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-800',
  };

  const layerCount = countLayers(group);

  return (
    <div className={cn('space-y-1', depth > 0 && 'ml-3')}>
      {/* Group header */}
      <button
        onClick={() => toggleGroupExpanded(group.id)}
        className={cn(
          'w-full flex items-center gap-2 p-2 rounded-lg transition-colors',
          colors.bg,
          'border',
          colors.border,
          'hover:opacity-90'
        )}
      >
        {/* Expand/collapse icon */}
        <div className="flex-shrink-0">
          {isExpanded ? (
            <ChevronDown className={cn('h-4 w-4', colors.text)} />
          ) : (
            <ChevronRight className={cn('h-4 w-4', colors.text)} />
          )}
        </div>

        {/* Icon */}
        {group.icon && (
          <span className="text-sm flex-shrink-0">{group.icon}</span>
        )}

        {/* Title */}
        <span className={cn('font-medium text-sm flex-1 text-left', colors.text)}>
          {group.title}
        </span>

        {/* Layer count badge */}
        <span
          className={cn(
            'text-xs px-2 py-0.5 rounded-full',
            colors.bg,
            colors.text,
            'opacity-70'
          )}
        >
          {layerCount} {layerCount === 1 ? 'layer' : 'layers'}
        </span>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="space-y-1 pt-1">
          {/* Nested groups */}
          {group.children?.map((childGroup) => (
            <LayerGroup
              key={childGroup.id}
              group={childGroup}
              depth={depth + 1}
            />
          ))}

          {/* Layers */}
          {group.layers?.map((layer) => (
            <LayerItem key={layer.id} layer={layer} depth={depth} />
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function to count total layers in a group (including nested)
function countLayers(group: LayerGroupType): number {
  let count = group.layers?.length || 0;
  if (group.children) {
    for (const child of group.children) {
      count += countLayers(child);
    }
  }
  return count;
}
