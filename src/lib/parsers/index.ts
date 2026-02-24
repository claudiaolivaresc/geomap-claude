import type { ParsedTable } from './types';

export type { ParsedTable } from './types';

const FORMAT_LABELS: Record<string, string> = {
  '.gpkg': 'GeoPackage',
  '.geojson': 'GeoJSON',
  '.json': 'GeoJSON',
  '.kml': 'KML',
  '.kmz': 'KMZ',
  '.zip': 'Shapefile',
};

/** All accepted file extensions for the file input */
export const ACCEPTED_EXTENSIONS = Object.keys(FORMAT_LABELS).join(',');

function getExtension(fileName: string): string {
  const dot = fileName.lastIndexOf('.');
  return dot >= 0 ? fileName.slice(dot).toLowerCase() : '';
}

/**
 * Parse a file of any supported format into ParsedTable[].
 * Dispatches to the appropriate parser based on file extension.
 */
export async function parseFile(file: File): Promise<ParsedTable[]> {
  const ext = getExtension(file.name);
  const formatLabel = FORMAT_LABELS[ext];

  if (!formatLabel) {
    const supported = [...new Set(Object.values(FORMAT_LABELS))].join(', ');
    throw new Error(
      `Unsupported file format "${ext}". Supported formats: ${supported}.`
    );
  }

  const buffer = await file.arrayBuffer();

  try {
    switch (ext) {
      case '.gpkg': {
        const { parseGeoPackage } = await import('./geopackage');
        return await parseGeoPackage(buffer);
      }
      case '.geojson':
      case '.json': {
        const { parseGeoJSON } = await import('./geojson');
        return await parseGeoJSON(buffer, file.name);
      }
      case '.kml': {
        const { parseKML } = await import('./kml');
        return await parseKML(buffer, file.name);
      }
      case '.kmz': {
        const { parseKMZ } = await import('./kml');
        return await parseKMZ(buffer, file.name);
      }
      case '.zip': {
        const { parseShapefile } = await import('./shapefile');
        return await parseShapefile(buffer, file.name);
      }
      default:
        throw new Error(`No parser available for "${ext}".`);
    }
  } catch (err) {
    if (err instanceof Error && (err.message.startsWith('Invalid') || err.message.startsWith('KML') || err.message.startsWith('KMZ') || err.message.startsWith('Shapefile'))) {
      throw err;
    }
    throw new Error(
      `Failed to parse ${formatLabel} file "${file.name}": ${err instanceof Error ? err.message : 'Unknown error'}`
    );
  }
}
