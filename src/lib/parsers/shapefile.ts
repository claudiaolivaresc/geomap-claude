import type { FeatureCollection } from 'geojson';
import type { ParsedTable } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Validate that the ZIP contains the required shapefile components.
 * Required: .shp, .dbf, .shx, .prj
 */
async function validateShapefileZip(buffer: ArrayBuffer): Promise<void> {
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(buffer);
  const files = Object.keys(zip.files).map((f) => f.toLowerCase());

  const required: [string, string][] = [
    ['.shp', 'Geometry (.shp)'],
    ['.dbf', 'Attributes (.dbf)'],
    ['.shx', 'Spatial index (.shx)'],
    ['.prj', 'Coordinate system (.prj)'],
  ];

  const missing = required
    .filter(([ext]) => !files.some((f) => f.endsWith(ext)))
    .map(([, label]) => label);

  if (missing.length > 0) {
    throw new Error(
      `Shapefile ZIP is missing required files: ${missing.join(', ')}. ` +
      `A valid shapefile ZIP must contain .shp, .dbf, .shx, and .prj files.`
    );
  }
}

/**
 * Parse a Shapefile ZIP (containing .shp, .dbf, .shx, .prj) into ParsedTable[].
 */
export async function parseShapefile(
  buffer: ArrayBuffer,
  fileName: string
): Promise<ParsedTable[]> {
  await validateShapefileZip(buffer);

  const shp = (await import('shpjs')).default;

  const result = await shp(buffer);

  // shpjs returns either a single FeatureCollection or an array of them
  const collections: FeatureCollection[] = Array.isArray(result)
    ? result
    : [result as FeatureCollection];

  if (collections.length === 0) {
    throw new Error('Shapefile ZIP contains no geographic data.');
  }

  const baseName = fileName.replace(/\.zip$/i, '');

  return collections.map((fc, index) => {
    const name =
      (fc as any).fileName ??
      (collections.length === 1 ? baseName : `${baseName}_${index + 1}`);
    return { name, geojson: fc };
  });
}
