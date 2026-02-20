import type { LayerConfig, LegendGradient } from '@/types';

export interface RasterQueryResult {
  layerId: string;
  title: string;
  rawValue: number;
  unit: string;
  source: 'postgis' | 'pixel';
}

/**
 * Try querying the raw PostGIS value via the API route.
 * Returns the raw value or null if the DB isn't configured / query fails.
 */
async function queryPostGIS(
  lng: number,
  lat: number,
  table: string
): Promise<number | null> {
  try {
    const params = new URLSearchParams({
      lng: String(lng),
      lat: String(lat),
      table,
    });
    const res = await fetch(`/api/raster/value?${params}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.value ?? null;
  } catch {
    return null;
  }
}

// ── Pixel fallback helpers ──────────────────────────────────────────

function lngLatToTile(lng: number, lat: number, zoom: number, tileSize: number = 256) {
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  );
  const pixelX = Math.floor((((lng + 180) / 360) * n - x) * tileSize);
  const pixelY = Math.floor(
    (((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n - y) *
      tileSize
  );
  return { x, y, z: zoom, pixelX, pixelY };
}

function readTilePixel(
  tileUrl: string,
  pixelX: number,
  pixelY: number
): Promise<number | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(null); return; }
      ctx.drawImage(img, 0, 0);
      const pixel = ctx.getImageData(pixelX, pixelY, 1, 1).data;
      if (pixel[3] === 0) { resolve(null); return; }
      resolve(pixel[0] / 255);
    };
    img.onerror = () => resolve(null);
    img.src = tileUrl;
  });
}

async function queryPixelFallback(
  lng: number,
  lat: number,
  zoom: number,
  layer: LayerConfig,
  legend: LegendGradient
): Promise<number | null> {
  const z = Math.floor(zoom);
  const minzoom = layer.source.minzoom ?? 0;
  if (z < minzoom) return null;

  const tileSize = layer.source.tileSize || 256;
  const effectiveZoom = Math.min(z, layer.source.maxzoom ?? 22);
  const { x, y, pixelX, pixelY } = lngLatToTile(lng, lat, effectiveZoom, tileSize);

  const tileUrl = layer.source.tiles[0]
    .replace('{z}', String(effectiveZoom))
    .replace('{x}', String(x))
    .replace('{y}', String(y));

  const normalized = await readTilePixel(tileUrl, pixelX, pixelY);
  if (normalized === null) return null;

  return legend.min + normalized * (legend.max - legend.min);
}

// ── Main query function ─────────────────────────────────────────────

/**
 * Query visible raster layers at a given lng/lat.
 * Tries PostGIS ST_Value first; falls back to tile pixel reading.
 */
export async function queryRasterValues(
  lng: number,
  lat: number,
  zoom: number,
  visibleLayers: LayerConfig[]
): Promise<RasterQueryResult[]> {
  const results: RasterQueryResult[] = [];

  const queries = visibleLayers
    .filter((layer) => layer.type === 'raster')
    .map(async (layer) => {
      const legend = layer.legend as LegendGradient | undefined;
      if (!legend || legend.type !== 'gradient') return;

      const table = layer.schema && layer.table ? `${layer.schema}.${layer.table}` : null;

      // Try PostGIS first
      if (table) {
        const pgValue = await queryPostGIS(lng, lat, table);
        if (pgValue !== null) {
          results.push({
            layerId: layer.id,
            title: layer.title,
            rawValue: Math.round(pgValue * 100) / 100,
            unit: legend.unit,
            source: 'postgis',
          });
          return;
        }
      }

      // Fall back to pixel reading from tile PNG
      const pixelValue = await queryPixelFallback(lng, lat, zoom, layer, legend);
      if (pixelValue !== null) {
        results.push({
          layerId: layer.id,
          title: layer.title,
          rawValue: Math.round(pixelValue * 100) / 100,
          unit: legend.unit,
          source: 'pixel',
        });
      }
    });

  await Promise.all(queries);
  return results;
}
