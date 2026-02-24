import type { FeatureCollection } from 'geojson';
import type { ParsedTable } from './types';

/**
 * Parse a KML file (XML) into ParsedTable[].
 */
export async function parseKML(
  buffer: ArrayBuffer,
  fileName: string
): Promise<ParsedTable[]> {
  const { kml: kmlToGeoJSON } = await import('@tmcw/togeojson');

  const text = new TextDecoder().decode(buffer);
  const dom = new DOMParser().parseFromString(text, 'application/xml');

  const parseError = dom.querySelector('parsererror');
  if (parseError) {
    throw new Error('Invalid KML: the file could not be parsed as XML.');
  }

  const fc = kmlToGeoJSON(dom) as FeatureCollection;

  if (!fc.features || fc.features.length === 0) {
    throw new Error('KML file contains no geographic features.');
  }

  const name = fileName.replace(/\.kml$/i, '');
  return [{ name, geojson: fc }];
}

/**
 * Parse a KMZ file (ZIP containing KML files) into ParsedTable[].
 */
export async function parseKMZ(
  buffer: ArrayBuffer,
  fileName: string
): Promise<ParsedTable[]> {
  const JSZip = (await import('jszip')).default;
  const { kml: kmlToGeoJSON } = await import('@tmcw/togeojson');

  const zip = await JSZip.loadAsync(buffer);
  const results: ParsedTable[] = [];

  const kmlFiles = Object.keys(zip.files).filter(
    (name) => name.endsWith('.kml') && !zip.files[name].dir
  );

  if (kmlFiles.length === 0) {
    throw new Error('KMZ archive contains no KML files.');
  }

  for (const kmlPath of kmlFiles) {
    const kmlText = await zip.files[kmlPath].async('string');
    const dom = new DOMParser().parseFromString(kmlText, 'application/xml');
    const fc = kmlToGeoJSON(dom) as FeatureCollection;

    if (fc.features && fc.features.length > 0) {
      const tableName = kmlPath.replace(/\.kml$/i, '').replace(/^.*\//, '');
      results.push({ name: tableName, geojson: fc });
    }
  }

  if (results.length === 0) {
    throw new Error('KMZ archive contains no geographic features.');
  }

  return results;
}
