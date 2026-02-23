'use client';

import { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMapStore, useUploadStore } from '@/stores';
import { parseGeoPackage } from '@/lib/geopackage';
import type { Feature } from 'geojson';

/** Detect the predominant geometry type from a FeatureCollection */
function detectGeometryType(features: Feature[]): 'Polygon' | 'LineString' | 'Point' {
  for (const f of features) {
    if (!f.geometry) continue;
    const t = f.geometry.type;
    if (t === 'Polygon' || t === 'MultiPolygon') return 'Polygon';
    if (t === 'LineString' || t === 'MultiLineString') return 'LineString';
    if (t === 'Point' || t === 'MultiPoint') return 'Point';
  }
  return 'Point';
}

export function GeoPackageUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const { map } = useMapStore();
  const { addUploadedLayer } = useUploadStore();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !map) return;

    setLoading(true);
    try {
      const buffer = await file.arrayBuffer();
      const tables = await parseGeoPackage(buffer);

      for (const table of tables) {
        const id = `upload-${Date.now()}-${table.name}`;
        const sourceId = `source-${id}`;
        const geomType = detectGeometryType(table.geojson.features);

        // Add GeoJSON source
        map.addSource(sourceId, {
          type: 'geojson',
          data: table.geojson,
        });

        // Add layer styled by geometry type
        if (geomType === 'Polygon') {
          map.addLayer({
            id: `layer-${id}-fill`,
            type: 'fill',
            source: sourceId,
            paint: {
              'fill-color': '#ff6b35',
              'fill-opacity': 0.15,
            },
          });
          map.addLayer({
            id: `layer-${id}-outline`,
            type: 'line',
            source: sourceId,
            paint: {
              'line-color': '#ff6b35',
              'line-width': 2,
              'line-dasharray': [4, 2],
            },
          });
        } else if (geomType === 'LineString') {
          map.addLayer({
            id: `layer-${id}-line`,
            type: 'line',
            source: sourceId,
            paint: {
              'line-color': '#ff6b35',
              'line-width': 2,
            },
          });
        } else {
          map.addLayer({
            id: `layer-${id}-circle`,
            type: 'circle',
            source: sourceId,
            paint: {
              'circle-color': '#ff6b35',
              'circle-radius': 5,
              'circle-stroke-color': '#fff',
              'circle-stroke-width': 1,
            },
          });
        }

        addUploadedLayer({
          id,
          fileName: file.name,
          tableName: table.name,
          visible: true,
          opacity: 1,
          geojson: table.geojson,
        });
      }
    } catch (err) {
      console.error('Failed to parse GeoPackage:', err);
      alert('Failed to parse GeoPackage file. Please check the file format.');
    } finally {
      setLoading(false);
      // Reset input so the same file can be re-uploaded
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".gpkg"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-white hover:bg-white/10"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        title="Upload GeoPackage"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
      </Button>
    </>
  );
}
