import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { getAllLayers, LAYER_GROUPS } from '@/config';
import type { AdminLayerView } from '@/types/admin.types';
import type { LayerGroup } from '@/types';

function findGroupForLayer(layerId: string, groups: LayerGroup[], parentTitle = ''): string {
  for (const g of groups) {
    const title = parentTitle ? `${parentTitle} > ${g.title}` : g.title;
    if (g.layers?.some((l) => l.id === layerId)) return title;
    if (g.children) {
      const found = findGroupForLayer(layerId, g.children, title);
      if (found) return found;
    }
  }
  return '';
}

export async function GET() {
  const allLayers = getAllLayers();
  const pool = getPool();

  // Fetch admin overrides from DB
  const overridesMap = new Map<string, { style_overrides: Record<string, unknown>; visible_fields: string[]; metadata_overrides: Record<string, string>; published: boolean }>();
  if (pool) {
    try {
      const result = await pool.query('SELECT * FROM public.layer_admin_config');
      for (const row of result.rows) {
        overridesMap.set(row.layer_id, {
          style_overrides: row.style_overrides || {},
          visible_fields: row.visible_fields || [],
          metadata_overrides: row.metadata_overrides || {},
          published: row.published !== false,
        });
      }
    } catch {
      // DB not available, continue with defaults
    }
  }

  const layers: AdminLayerView[] = allLayers.map((layer) => {
    const override = overridesMap.get(layer.id);
    const vectorStyle = layer.type === 'vector'
      ? (layer.style as { type?: string })
      : undefined;

    const defaultPaint = layer.type === 'raster'
      ? (layer.style as { paint: Record<string, unknown> }).paint
      : (layer.style as { paint: Record<string, unknown> }).paint;

    return {
      id: layer.id,
      title: override?.metadata_overrides?.title || layer.title,
      type: layer.type,
      schema: layer.schema,
      table: layer.table,
      group: findGroupForLayer(layer.id, LAYER_GROUPS),
      vectorStyleType: vectorStyle?.type as 'circle' | 'line' | 'fill' | undefined,
      defaultOpacity: layer.defaultOpacity ?? 1,
      style_overrides: override?.style_overrides || {},
      visible_fields: override?.visible_fields || [],
      published: override?.published !== false,
      metadata: {
        title: override?.metadata_overrides?.title || layer.title,
        description: override?.metadata_overrides?.description || layer.metadata.description,
        citation: override?.metadata_overrides?.citation || layer.metadata.citation,
      },
      defaults: {
        paint: defaultPaint,
        opacity: layer.defaultOpacity ?? 1,
        metadata: {
          description: layer.metadata.description,
          citation: layer.metadata.citation,
        },
      },
    };
  });

  return NextResponse.json({ layers });
}
