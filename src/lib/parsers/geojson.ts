import type { FeatureCollection, Feature, Geometry } from 'geojson';
import type { ParsedTable } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function parseGeoJSON(
  buffer: ArrayBuffer,
  fileName: string
): Promise<ParsedTable[]> {
  const text = new TextDecoder().decode(buffer);
  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON: the file could not be parsed as JSON.');
  }

  let fc: FeatureCollection;

  if (isFeatureCollection(parsed)) {
    fc = parsed;
  } else if (isFeature(parsed)) {
    fc = { type: 'FeatureCollection', features: [parsed] };
  } else if (isGeometry(parsed)) {
    fc = {
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: parsed, properties: {} }],
    };
  } else {
    throw new Error(
      'Invalid GeoJSON: expected a FeatureCollection, Feature, or Geometry object.'
    );
  }

  const name = fileName.replace(/\.(geojson|json)$/i, '');

  return [{ name, geojson: fc }];
}

function isFeatureCollection(obj: unknown): obj is FeatureCollection {
  return (obj as any)?.type === 'FeatureCollection' && Array.isArray((obj as any)?.features);
}

function isFeature(obj: unknown): obj is Feature {
  return (obj as any)?.type === 'Feature';
}

function isGeometry(obj: unknown): obj is Geometry {
  const geomTypes = ['Point', 'MultiPoint', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon', 'GeometryCollection'];
  return geomTypes.includes((obj as any)?.type);
}
