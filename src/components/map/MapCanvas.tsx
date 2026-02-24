'use client';

import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapStore, useLayerStore, useConfigStore, useUploadStore, useMeasureStore } from '@/stores';
import { MAP_CONFIG, MAPBOX_ACCESS_TOKEN, VECTOR_LAYER_INFO } from '@/config';
import { getAnyLayerById, getAllLayersIncludingDynamic } from '@/lib/layerLookup';
import type { TooltipField } from '@/config/vectorLayerInfo';
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
          const config = getAnyLayerById(layerId);
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
      // Skip feature queries when measurement tool is active
      if (useMeasureStore.getState().mode) return;

      const { activeLayers: layers } = useLayerStore.getState();
      const allConfigs = getAllLayersIncludingDynamic();
      const htmlParts: string[] = [];

      // ── Vector: queryRenderedFeatures ──
      const visibleVectorIds = allConfigs
        .filter((cfg) => cfg.type === 'vector' && layers.get(cfg.id)?.visible)
        .map((cfg) => `layer-${cfg.id}`);

      if (visibleVectorIds.length > 0) {
        // Use a small bounding box around the click point for better hit detection on lines
        const px = 10;
        const bbox: [mapboxgl.PointLike, mapboxgl.PointLike] = [
          [e.point.x - px, e.point.y - px],
          [e.point.x + px, e.point.y + px],
        ];
        const features = map.queryRenderedFeatures(bbox, { layers: visibleVectorIds });
        const configState = useConfigStore.getState();

        for (const feat of features) {
          if (!feat.layer) continue;
          const layerId = feat.layer.id.replace('layer-', '');
          const cfg = allConfigs.find((c) => c.id === layerId);
          const title = cfg?.title || layerId;
          const props = feat.properties || {};

          const tooltipConfig = VECTOR_LAYER_INFO[layerId];

          let rows: string;

          // Helper: render all properties as a generic table
          const renderAllProps = () => {
            const override = configState.getOverride(layerId);
            const fieldEntries = override?.visible_fields?.length ? override.visible_fields : null;
            const allowedNames = fieldEntries ? new Set(fieldEntries.map((f) => f.name)) : null;
            const labelMap = fieldEntries
              ? new Map(fieldEntries.map((f) => [f.name, f.label]))
              : null;
            return Object.entries(props)
              .filter(([k]) => !k.startsWith('_') && k !== 'geom' && k !== 'gid')
              .filter(([k]) => !allowedNames || allowedNames.has(k))
              .map(
                ([k, v]) => {
                  const displayLabel = labelMap?.get(k) || k;
                  return `<tr><td style="padding:2px 8px 2px 0;font-size:11px;color:#888;white-space:nowrap;">${displayLabel}</td>` +
                  `<td style="padding:2px 0;font-size:12px;color:#141d2d;font-weight:500;">${v ?? '—'}</td></tr>`;
                }
              )
              .join('');
          };

          if (tooltipConfig) {
            // Use curated tooltip fields
            rows = tooltipConfig.tooltip_fields
              .map((field: TooltipField) => {
                // Resolve value: support array of field names (first defined wins)
                const names = Array.isArray(field.name) ? field.name : [field.name];
                let raw: unknown = undefined;
                for (const n of names) {
                  if (props[n] != null && props[n] !== '') { raw = props[n]; break; }
                }
                if (raw == null) return '';

                // Format numeric values
                let display = String(raw);
                if (field.toFixedVal != null && typeof raw === 'number') {
                  display = raw.toFixed(field.toFixedVal);
                } else if (field.toFixedVal != null && !isNaN(Number(raw))) {
                  display = Number(raw).toFixed(field.toFixedVal);
                }

                const label = field.prefix_str || '';
                const units = field.units ? ` ${field.units}` : '';

                if (label) {
                  return (
                    `<tr><td style="padding:2px 8px 2px 0;font-size:11px;color:#888;white-space:nowrap;">${label}</td>` +
                    `<td style="padding:2px 0;font-size:12px;color:#141d2d;font-weight:500;">${display}${units}</td></tr>`
                  );
                }
                // No prefix — show as a header-style value
                return (
                  `<tr><td colspan="2" style="padding:2px 0;font-size:13px;color:#141d2d;font-weight:600;">${display}${units}</td></tr>`
                );
              })
              .filter(Boolean)
              .join('');

            // If curated fields produced nothing, fall back to all properties
            if (!rows) {
              rows = renderAllProps();
            }
          } else {
            rows = renderAllProps();
          }

          if (rows) {
            htmlParts.push(
              `<div style="padding:6px 0;border-bottom:1px solid #eee;">` +
              `<div style="font-size:11px;font-weight:600;color:#ffa925;margin-bottom:4px;">${title}</div>` +
              `<table style="border-collapse:collapse;">${rows}</table></div>`
            );
          }
        }
      }

      // ── Uploaded layers ──
      const { uploadedLayers } = useUploadStore.getState();
      const uploadLayerIds = uploadedLayers
        .filter((ul) => ul.visible)
        .flatMap((ul) => {
          const ids: string[] = [];
          for (const suffix of ['-fill', '-outline', '-line', '-circle']) {
            const mlid = `layer-${ul.id}${suffix}`;
            if (map.getLayer(mlid)) ids.push(mlid);
          }
          return ids;
        });

      if (uploadLayerIds.length > 0) {
        const px = 10;
        const bbox: [mapboxgl.PointLike, mapboxgl.PointLike] = [
          [e.point.x - px, e.point.y - px],
          [e.point.x + px, e.point.y + px],
        ];
        const uploadFeats = map.queryRenderedFeatures(bbox, { layers: uploadLayerIds });

        // De-duplicate: only show one popup entry per unique upload layer
        const seenUploads = new Set<string>();
        for (const feat of uploadFeats) {
          if (!feat.layer) continue;
          // Extract upload id from layer id like "layer-upload-123-tableName-fill"
          const fullId = feat.layer.id.replace('layer-', '');
          const uploadId = fullId.replace(/-(fill|outline|line|circle)$/, '');
          if (seenUploads.has(uploadId)) continue;
          seenUploads.add(uploadId);

          const ul = uploadedLayers.find((u) => u.id === uploadId);
          const title = ul ? `${ul.tableName} (uploaded)` : uploadId;
          const props = feat.properties || {};
          const rows = Object.entries(props)
            .filter(([k]) => !k.startsWith('_'))
            .map(
              ([k, v]) =>
                `<tr><td style="padding:2px 8px 2px 0;font-size:11px;color:#888;white-space:nowrap;">${k}</td>` +
                `<td style="padding:2px 0;font-size:12px;color:#141d2d;font-weight:500;">${v ?? '—'}</td></tr>`
            )
            .join('');

          if (rows) {
            htmlParts.push(
              `<div style="padding:6px 0;border-bottom:1px solid #eee;">` +
              `<div style="font-size:11px;font-weight:600;color:#ff6b35;margin-bottom:4px;">${title}</div>` +
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

    // Resize map when its container changes size (e.g. sidebar/legend panels open/close)
    const ro = new ResizeObserver(() => {
      map.resize();
    });
    ro.observe(mapContainer.current);

    return () => {
      ro.disconnect();
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
            const config = getAnyLayerById(layerId);
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
