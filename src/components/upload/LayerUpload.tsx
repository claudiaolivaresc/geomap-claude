'use client';

import { useRef, useState } from 'react';
import { Upload, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMapStore, useUploadStore } from '@/stores';
import { parseFile, ACCEPTED_EXTENSIONS } from '@/lib/parsers';
import type { Feature } from 'geojson';

const SUPPORTED_FORMATS = [
  { ext: '.geojson / .json', label: 'GeoJSON', desc: 'Standard geospatial JSON format' },
  { ext: '.gpkg', label: 'GeoPackage', desc: 'OGC open format (SQLite-based)' },
  { ext: '.kml', label: 'KML', desc: 'Google Earth markup' },
  { ext: '.kmz', label: 'KMZ', desc: 'Compressed KML archive' },
  { ext: '.zip', label: 'Shapefile', desc: 'Zipped .shp, .dbf, .shx, .prj' },
];

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

export function LayerUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { map } = useMapStore();
  const { addUploadedLayer } = useUploadStore();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !map) return;

    setShowDialog(false);
    setLoading(true);
    try {
      const tables = await parseFile(file);

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
      console.error('Failed to parse uploaded file:', err);
      alert(err instanceof Error ? err.message : 'Failed to parse file. Please check the format.');
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-white hover:bg-white/10"
        onClick={() => setShowDialog(true)}
        disabled={loading}
        title="Upload layer"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
      </Button>

      {/* Upload dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowDialog(false)}>
          <div
            className="bg-white rounded-lg shadow-xl w-[360px] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-sm font-semibold text-gray-900">Upload Layer</h3>
              <button
                type="button"
                onClick={() => setShowDialog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Supported formats */}
            <div className="px-4 py-3">
              <p className="text-xs text-gray-500 mb-3">
                Upload a file to display it on the map. Supported formats:
              </p>
              <div className="space-y-1.5 mb-4">
                {SUPPORTED_FORMATS.map((f) => (
                  <div key={f.label} className="flex items-baseline gap-2">
                    <code className="text-[11px] font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 flex-shrink-0">
                      {f.ext}
                    </code>
                    <span className="text-xs text-gray-500">{f.desc}</span>
                  </div>
                ))}
              </div>

              {/* CRS note */}
              <div className="mb-4 p-2.5 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                <span className="font-medium">Coordinate Reference System:</span>{' '}
                Files must use <span className="font-mono font-medium">WGS 84 (EPSG:4326)</span>.
                GeoJSON and KML/KMZ are natively in WGS 84.
                For Shapefiles, include a <span className="font-mono">.prj</span> file.
                GeoPackages should store geometries in EPSG:4326.
              </div>

              {/* Upload button */}
              <Button
                className="w-full bg-[#141d2d] hover:bg-[#1e2a3d] text-white"
                onClick={() => inputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
