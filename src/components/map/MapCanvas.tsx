'use client';

import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapStore, useLayerStore, useConfigStore } from '@/stores';
import { MAP_CONFIG, MAPBOX_ACCESS_TOKEN, getAllLayers } from '@/config';
import { queryRasterValues } from '@/lib/rasterQuery';

// Set Mapbox access token and limit parallel tile requests (tileserver is sensitive to concurrency)
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
(mapboxgl as unknown as { maxParallelImageRequests: number }).maxParallelImageRequests = 1;

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

    // Query features on click (vector + raster)
    const popup = new mapboxgl.Popup({ closeButton: true, closeOnClick: true, maxWidth: '320px' });

    map.on('click', async (e) => {
      const { activeLayers: layers } = useLayerStore.getState();
      const allConfigs = getAllLayers();
      const htmlParts: string[] = [];

      // ── Vector: queryRenderedFeatures ──
      const visibleVectorIds = allConfigs
        .filter((cfg) => cfg.type === 'vector' && layers.get(cfg.id)?.visible)
        .map((cfg) => `layer-${cfg.id}`);

      if (visibleVectorIds.length > 0) {
        const features = map.queryRenderedFeatures(e.point, { layers: visibleVectorIds });
        const configState = useConfigStore.getState();

        for (const feat of features) {
          if (!feat.layer) continue;
          const layerId = feat.layer.id.replace('layer-', '');
          const cfg = allConfigs.find((c) => c.id === layerId);
          const title = cfg?.title || layerId;
          const props = feat.properties || {};

          // Filter fields: use admin-configured visible_fields if set
          const override = configState.getOverride(layerId);
          const allowedFields = override?.visible_fields?.length ? override.visible_fields : null;

          const rows = Object.entries(props)
            .filter(([k]) => !k.startsWith('_') && k !== 'geom' && k !== 'gid')
            .filter(([k]) => !allowedFields || allowedFields.includes(k))
            .map(
              ([k, v]) =>
                `<tr><td style="padding:2px 8px 2px 0;font-size:11px;color:#888;white-space:nowrap;">${k}</td>` +
                `<td style="padding:2px 0;font-size:12px;color:#141d2d;font-weight:500;">${v ?? '—'}</td></tr>`
            )
            .join('');

          if (rows) {
            htmlParts.push(
              `<div style="padding:6px 0;border-bottom:1px solid #eee;">` +
              `<div style="font-size:11px;font-weight:600;color:#ffa925;margin-bottom:4px;">${title}</div>` +
              `<table style="border-collapse:collapse;">${rows}</table></div>`
            );
          }
        }
      }

      // ── Raster: PostGIS ST_Value (or pixel fallback) ──
      const visibleRasterConfigs = allConfigs.filter(
        (cfg) => cfg.type === 'raster' && layers.get(cfg.id)?.visible
      );

      if (visibleRasterConfigs.length > 0) {
        // Show popup immediately with vector results + "Querying rasters..."
        popup
          .setLngLat(e.lngLat)
          .setHTML(
            `<div style="padding:4px;max-height:300px;overflow-y:auto;">` +
            htmlParts.join('') +
            `<div style="padding:4px;font-size:13px;color:#666;">Querying rasters...</div></div>`
          )
          .addTo(map);
        const results = await queryRasterValues(
          e.lngLat.lng,
          e.lngLat.lat,
          map.getZoom(),
          visibleRasterConfigs
        );

        for (const r of results) {
          htmlParts.push(
            `<div style="padding:6px 0;border-bottom:1px solid #eee;">` +
            `<div style="font-size:11px;color:#888;">${r.title}</div>` +
            `<div style="font-size:15px;font-weight:600;color:#141d2d;">${r.rawValue} ${r.unit}</div>` +
            (r.source === 'pixel' ? `<div style="font-size:9px;color:#bbb;">~ approx (tile pixel)</div>` : '') +
            `</div>`
          );
        }
      }

      if (htmlParts.length === 0) return;

      popup
        .setLngLat(e.lngLat)
        .setHTML(`<div style="padding:4px;max-height:300px;overflow-y:auto;">${htmlParts.join('')}</div>`)
        .addTo(map);
    });

    // Handle errors (suppress tile-loading failures — expected for empty/missing tiles)
    map.on('error', (e: mapboxgl.ErrorEvent & Record<string, unknown>) => {
      if (e.sourceId || e.tile || (e.error as unknown as Record<string, unknown>)?.status != null) return;
      console.error('Map error:', e.error?.message || e.error || e);
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
