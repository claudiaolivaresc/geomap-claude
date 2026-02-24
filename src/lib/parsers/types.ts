import type { FeatureCollection } from 'geojson';

export interface ParsedTable {
  name: string;
  geojson: FeatureCollection;
}
