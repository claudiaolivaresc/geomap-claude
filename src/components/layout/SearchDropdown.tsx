'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Layers, Lock } from 'lucide-react';
import { getAllLayers, MAPBOX_ACCESS_TOKEN } from '@/config';
import { useUIStore, useLayerStore, useAuthStore, useMapStore } from '@/stores';
import type { LayerConfig } from '@/types';

interface GeoResult {
  id: string;
  place_name: string;
  center: [number, number];
  place_type: string[];
}

const ZOOM_BY_TYPE: Record<string, number> = {
  country: 4,
  region: 6,
  district: 8,
  place: 10,
  locality: 12,
  neighborhood: 13,
  address: 15,
  poi: 15,
};

export function SearchDropdown() {
  const { searchQuery, setSearchQuery } = useUIStore();
  const { isLayerActive, toggleLayer, addLayerToMap, removeLayerFromMap } = useLayerStore();
  const { hasPermission } = useAuthStore();
  const { map, flyTo } = useMapStore();

  const [open, setOpen] = useState(false);
  const [geoResults, setGeoResults] = useState<GeoResult[]>([]);
  const [geoLoading, setGeoLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const query = searchQuery.trim().toLowerCase();

  // Filter layers client-side
  const matchedLayers: LayerConfig[] =
    query.length >= 2
      ? getAllLayers().filter((l) => l.title.toLowerCase().includes(query)).slice(0, 8)
      : [];

  // Geocode with debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.length < 2) {
      setGeoResults([]);
      setGeoLoading(false);
      return;
    }

    setGeoLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=5`
        );
        if (res.ok) {
          const data = await res.json();
          setGeoResults(
            (data.features || []).map((f: Record<string, unknown>) => ({
              id: f.id as string,
              place_name: f.place_name as string,
              center: f.center as [number, number],
              place_type: f.place_type as string[],
            }))
          );
        }
      } catch {
        // Geocoding failed silently
      } finally {
        setGeoLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Show dropdown when query is long enough
  useEffect(() => {
    setOpen(query.length >= 2);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const handleLayerClick = useCallback(
    (layer: LayerConfig) => {
      const canAccess = hasPermission(layer.permissions);
      if (!canAccess) return;

      if (map) {
        if (isLayerActive(layer.id)) {
          removeLayerFromMap(map, layer.id);
        } else {
          addLayerToMap(map, layer);
        }
      }
      toggleLayer(layer.id);
      setSearchQuery('');
      setOpen(false);
    },
    [map, hasPermission, isLayerActive, toggleLayer, addLayerToMap, removeLayerFromMap, setSearchQuery]
  );

  const handleLocationClick = useCallback(
    (result: GeoResult) => {
      const zoom = ZOOM_BY_TYPE[result.place_type[0]] ?? 10;
      flyTo(result.center, zoom);
      setSearchQuery('');
      setOpen(false);
    },
    [flyTo, setSearchQuery]
  );

  if (!open) return null;

  const hasLayers = matchedLayers.length > 0;
  const hasGeo = geoResults.length > 0;
  const hasAny = hasLayers || hasGeo || geoLoading;

  if (!hasAny) {
    return (
      <div ref={containerRef} className="absolute top-full left-0 right-0 mt-1 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <p className="text-sm text-gray-400 text-center">No results found</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute top-full left-0 right-0 mt-1 z-50 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto"
    >
      {/* Layer results */}
      {hasLayers && (
        <div>
          <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100">
            <Layers className="h-3 w-3" />
            Layers
          </div>
          {matchedLayers.map((layer) => {
            const canAccess = hasPermission(layer.permissions);
            const active = isLayerActive(layer.id);
            return (
              <button
                key={layer.id}
                onClick={() => handleLayerClick(layer)}
                disabled={!canAccess}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Color swatch */}
                {layer.legend?.type === 'gradient' ? (
                  <div
                    className="w-5 h-3 rounded flex-shrink-0 border border-gray-200"
                    style={{ background: layer.legend.gradient }}
                  />
                ) : (
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0 border border-gray-200"
                    style={{
                      backgroundColor: layer.legend?.type === 'symbol' ? layer.legend.items[0]?.color : '#6b7280',
                    }}
                  />
                )}

                {/* Title */}
                <span className="text-sm text-gray-800 flex-1 truncate">
                  {layer.title}
                </span>

                {/* Active indicator */}
                {active && (
                  <span className="text-xs text-[#ffa925] font-medium">ON</span>
                )}

                {/* Type badge */}
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 flex-shrink-0">
                  {layer.type}
                </span>

                {/* Lock */}
                {!canAccess && <Lock className="h-3 w-3 text-gray-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Location results */}
      {(hasGeo || geoLoading) && (
        <div>
          <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 border-t">
            <MapPin className="h-3 w-3" />
            Locations
          </div>
          {geoLoading && !hasGeo && (
            <div className="px-3 py-3 text-sm text-gray-400 text-center">Searching...</div>
          )}
          {geoResults.map((result) => (
            <button
              key={result.id}
              onClick={() => handleLocationClick(result)}
              className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 transition-colors"
            >
              <MapPin className="h-3.5 w-3.5 text-[#ffa925] flex-shrink-0" />
              <span className="text-sm text-gray-800 flex-1 truncate">{result.place_name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 flex-shrink-0">
                {result.place_type[0]}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
