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

// Accent colors per group, styled to fit the navy/sage/orange theme
const GROUP_COLORS: Record<string, { bg: string; border: string; text: string; accent: string }> = {
  global:                  { bg: 'bg-[#eef6f3]', border: 'border-[#b4ccc5]', text: 'text-[#141d2d]', accent: 'bg-[#b4ccc5]' },
  surface:                 { bg: 'bg-[#eef6f3]', border: 'border-[#b4ccc5]', text: 'text-[#141d2d]', accent: 'bg-[#b4ccc5]' },
  'surface-module':        { bg: 'bg-[#eef6f3]', border: 'border-[#b4ccc5]', text: 'text-[#141d2d]', accent: 'bg-[#b4ccc5]' },
  boundaries:              { bg: 'bg-[#f0f4f8]', border: 'border-[#c0c8d0]', text: 'text-[#141d2d]', accent: 'bg-[#c0c8d0]/30' },
  infrastructure:          { bg: 'bg-[#fff8ee]', border: 'border-[#ffa925]/40', text: 'text-[#141d2d]', accent: 'bg-[#ffa925]/20' },
  topography:              { bg: 'bg-[#f2f8ee]', border: 'border-[#8bb87a]/40', text: 'text-[#141d2d]', accent: 'bg-[#8bb87a]/20' },
  'energy-demand-production': { bg: 'bg-[#fef2ee]', border: 'border-[#e14716]/30', text: 'text-[#141d2d]', accent: 'bg-[#e14716]/15' },
  resources:               { bg: 'bg-[#eef2f8]', border: 'border-[#5a8cc8]/30', text: 'text-[#141d2d]', accent: 'bg-[#5a8cc8]/15' },
  surveys:                 { bg: 'bg-[#eef0f8]', border: 'border-[#6b7cc8]/30', text: 'text-[#141d2d]', accent: 'bg-[#6b7cc8]/15' },
  subsurface:              { bg: 'bg-[#fff8ee]', border: 'border-[#ffa925]/40', text: 'text-[#141d2d]', accent: 'bg-[#ffa925]/20' },
  structural:              { bg: 'bg-[#fef2ee]', border: 'border-[#e14716]/30', text: 'text-[#141d2d]', accent: 'bg-[#e14716]/15' },
  'thermal-model':         { bg: 'bg-[#fff5ee]', border: 'border-[#ffa925]/30', text: 'text-[#141d2d]', accent: 'bg-[#ffa925]/15' },
  'heat-source-proximity': { bg: 'bg-[#f3eef8]', border: 'border-[#8b5cf6]/30', text: 'text-[#141d2d]', accent: 'bg-[#8b5cf6]/15' },
};

export function LayerGroup({ group, depth }: LayerGroupProps) {
  const { expandedGroups, toggleGroupExpanded } = useLayerStore();
  const isExpanded = expandedGroups.has(group.id);

  const colors = GROUP_COLORS[group.id] || {
    bg: 'bg-[#f6fbf8]',
    border: 'border-[#b4ccc5]',
    text: 'text-[#141d2d]',
    accent: 'bg-[#b4ccc5]/20',
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
            colors.accent,
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
