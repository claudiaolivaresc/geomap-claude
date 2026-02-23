import type { Feature, FeatureCollection } from 'geojson';

export interface ParsedTable {
  name: string;
  geojson: FeatureCollection;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    GeoPackage?: any;
  }
}

/** Load the GeoPackage browser bundle from public/ via a script tag (avoids bundler issues with fs/better-sqlite3) */
function loadGeoPackageScript(): Promise<any> {
  if (window.GeoPackage) return Promise.resolve(window.GeoPackage);

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/geopackage.min.js';
    script.onload = () => {
      if (window.GeoPackage) resolve(window.GeoPackage);
      else reject(new Error('GeoPackage global not found after script load'));
    };
    script.onerror = () => reject(new Error('Failed to load geopackage.min.js'));
    document.head.appendChild(script);
  });
}

/**
 * Parse a GeoPackage ArrayBuffer and return GeoJSON FeatureCollections per table.
 * Loads the library at runtime via script tag to bypass Turbopack module resolution.
 */
export async function parseGeoPackage(buffer: ArrayBuffer): Promise<ParsedTable[]> {
  const GP = await loadGeoPackageScript();

  // Point sql.js to the WASM file in public/
  GP.setSqljsWasmLocateFile((file: string) => `/${file}`);

  const uint8 = new Uint8Array(buffer);
  const gp = await GP.GeoPackageAPI.open(uint8);

  const tables: string[] = gp.getFeatureTables();
  const results: ParsedTable[] = [];

  for (const tableName of tables) {
    const features: Feature[] = [];
    const iterator = gp.iterateGeoJSONFeatures(tableName);
    for (const feat of iterator) {
      features.push(feat as Feature);
    }

    results.push({
      name: tableName,
      geojson: {
        type: 'FeatureCollection',
        features,
      },
    });
  }

  gp.close();
  return results;
}
