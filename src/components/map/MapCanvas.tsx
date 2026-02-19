'use client';

import { useRef, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapStore, useLayerStore } from '@/stores';
import { MAP_CONFIG, MAPBOX_ACCESS_TOKEN } from '@/config';

// Set Mapbox access token
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

export function MapCanvas() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  const { setMap, setViewport, setIsLoaded, viewport, currentBasemap } = useMapStore();
  const { activeLayers, addLayerToMap } = useLayerStore();

  // Initialize map
  useEffect(() => {
    if (mapInstance.current || !mapContainer.current) return;

    const style = MAP_CONFIG.styles.find((s) => s.id === currentBasemap);

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: style?.url || MAP_CONFIG.styles[0].url,
      center: viewport.center as [number, number],
      zoom: viewport.zoom,
      bearing: viewport.bearing || 0,
      pitch: viewport.pitch || 0,
      attributionControl: false,
    });

    // Add navigation control
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add scale control
    map.addControl(
      new mapboxgl.ScaleControl({ maxWidth: 100, unit: 'metric' }),
      'bottom-right'
    );

    // Add attribution control
    map.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      'bottom-right'
    );

    // Handle map load
    map.on('load', () => {
      setIsLoaded(true);
      setMap(map);
      mapInstance.current = map;

      // Add any active layers that were persisted
      activeLayers.forEach((state, layerId) => {
        if (state.visible) {
          const { getLayerById } = require('@/config');
          const config = getLayerById(layerId);
          if (config) {
            addLayerToMap(map, config);
          }
        }
      });
    });

    // Update viewport on move
    map.on('moveend', () => {
      setViewport({
        center: map.getCenter().toArray() as [number, number],
        zoom: map.getZoom(),
        bearing: map.getBearing(),
        pitch: map.getPitch(),
      });
    });

    // Handle errors
    map.on('error', (e) => {
      console.error('Map error:', e);
    });

    return () => {
      map.remove();
      mapInstance.current = null;
      setMap(null);
      setIsLoaded(false);
    };
  }, []); // Empty deps - only run once on mount

  // Handle basemap changes
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    const style = MAP_CONFIG.styles.find((s) => s.id === currentBasemap);
    if (style && map.isStyleLoaded()) {
      // Store current layers before style change
      const layersToRestore = new Map(activeLayers);

      map.once('style.load', () => {
        // Re-add layers after style change
        layersToRestore.forEach((state, layerId) => {
          if (state.visible) {
            const { getLayerById } = require('@/config');
            const config = getLayerById(layerId);
            if (config) {
              addLayerToMap(map, config);
            }
          }
        });
      });

      map.setStyle(style.url);
    }
  }, [currentBasemap]);

  return (
    <div ref={mapContainer} className="w-full h-full" />
  );
}
