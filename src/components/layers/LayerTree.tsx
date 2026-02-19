'use client';

import { LAYER_GROUPS } from '@/config';
import { LayerGroup } from './LayerGroup';

export function LayerTree() {
  return (
    <div className="space-y-2">
      {LAYER_GROUPS.map((group) => (
        <LayerGroup key={group.id} group={group} depth={0} />
      ))}
    </div>
  );
}
