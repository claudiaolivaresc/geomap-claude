import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { getAllLayers, LAYER_GROUPS, getAllGroupIds } from '@/config';
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

function findGroupPathById(groupId: string): string {
  const allGroups = getAllGroupIds();
  const match = allGroups.find((g) => g.id === groupId);
  return match?.path || groupId || 'Uncategorized';
}

export async function GET() {
  const allLayers = getAllLayers();
  const pool = getPool();

  // Fetch ALL admin config rows from DB
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const allDbRows: any[] = [];
  const overridesMap = new Map<string, any>();

  if (pool) {
    try {
      const result = await pool.query('SELECT * FROM public.layer_admin_config');
      for (const row of result.rows) {
        overridesMap.set(row.layer_id, row);
        if (row.is_dynamic) {
          allDbRows.push(row);
        }
      }
    } catch {
      // DB not available, continue with defaults
    }
  }

  // Build AdminLayerView[] from static layers (existing logic)
  const staticViews: AdminLayerView[] = allLayers.map((layer) => {
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

  // Build AdminLayerView[] from dynamic layers in DB
  const dynamicViews: AdminLayerView[] = allDbRows.map((row) => {
    const title = row.title || row.metadata_overrides?.title || `${row.schema_name}.${row.table_name}`;
    return {
      id: row.layer_id,
      title,
      type: (row.layer_type as 'raster' | 'vector') || 'vector',
      schema: row.schema_name,
      table: row.table_name,
      group: findGroupPathById(row.group_id),
      vectorStyleType: row.vector_style_type as 'circle' | 'line' | 'fill' | undefined,
      defaultOpacity: row.default_opacity ?? 1,
      style_overrides: row.style_overrides || {},
      visible_fields: row.visible_fields || [],
      published: row.published !== false,
      is_dynamic: true,
      legend_config: row.legend_config && Object.keys(row.legend_config).length > 0 ? row.legend_config : undefined,
      permissions_config: row.permissions_config,
      metadata: {
        title,
        description: row.metadata_overrides?.description || '',
        citation: row.metadata_overrides?.citation || '',
      },
      defaults: {
        paint: row.style_overrides || {},
        opacity: row.default_opacity ?? 1,
        metadata: {
          description: row.metadata_overrides?.description || '',
          citation: row.metadata_overrides?.citation || '',
        },
      },
    };
  });

  return NextResponse.json({ layers: [...staticViews, ...dynamicViews] });
}
