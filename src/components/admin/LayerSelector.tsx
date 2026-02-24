'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AdminLayerView } from '@/types/admin.types';

interface LayerSelectorProps {
  layers: AdminLayerView[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function LayerSelector({ layers, selectedId, onSelect }: LayerSelectorProps) {
  // Group layers by their group path
  const grouped = new Map<string, AdminLayerView[]>();
  for (const layer of layers) {
    const group = layer.group || 'Other';
    if (!grouped.has(group)) grouped.set(group, []);
    grouped.get(group)!.push(layer);
  }

  return (
    <Select value={selectedId || ''} onValueChange={onSelect}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a layer to configure..." />
      </SelectTrigger>
      <SelectContent>
        {Array.from(grouped.entries()).map(([group, groupLayers]) => (
          <SelectGroup key={group}>
            <SelectLabel className="text-xs text-gray-500">{group}</SelectLabel>
            {groupLayers.map((layer) => (
              <SelectItem key={layer.id} value={layer.id}>
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: layer.type === 'raster' ? '#8b5cf6' : '#10b981',
                    }}
                  />
                  {layer.title}
                  <span className="text-xs text-gray-400 ml-1">
                    ({layer.type})
                  </span>
                  {layer.is_dynamic && (
                    <span className="text-xs text-indigo-500 ml-1">dynamic</span>
                  )}
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
