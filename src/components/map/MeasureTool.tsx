'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Ruler, MousePointerClick, Hexagon, Undo2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMapStore, useMeasureStore } from '@/stores';
import type { MeasureMode, MeasurePoint, CompletedMeasurement } from '@/stores/measureStore';
import {
  haversineDistance,
  sphericalPolygonArea,
  formatDistance,
  formatArea,
} from '@/lib/geo';
import { cn } from '@/lib/utils';

const SRC_LINE = 'measure-line-source';
const SRC_POINTS = 'measure-points-source';
const SRC_LABELS = 'measure-labels-source';
const LYR_LINE = 'measure-line-layer';
const LYR_FILL = 'measure-fill-layer';
const LYR_POINTS = 'measure-points-layer';
const LYR_LABELS = 'measure-labels-layer';

const EMPTY_FC: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };

/* ── Helpers to build GeoJSON features from a set of points ── */

function buildDistanceFeatures(pts: MeasurePoint[], finished: boolean) {
  const lineFeatures: GeoJSON.Feature[] = [];
  const pointFeatures: GeoJSON.Feature[] = [];
  const labelFeatures: GeoJSON.Feature[] = [];

  const coords = pts.map((p) => [p.lng, p.lat]);

  if (coords.length >= 2) {
    lineFeatures.push({
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: coords },
    });
  }

  // Points
  pts.forEach((p) => {
    pointFeatures.push({
      type: 'Feature',
      properties: {},
      geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
    });
  });

  // Segment labels
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const d = haversineDistance(pts[i].lng, pts[i].lat, pts[i + 1].lng, pts[i + 1].lat);
    total += d;
    const midLng = (pts[i].lng + pts[i + 1].lng) / 2;
    const midLat = (pts[i].lat + pts[i + 1].lat) / 2;
    labelFeatures.push({
      type: 'Feature',
      properties: { label: formatDistance(d) },
      geometry: { type: 'Point', coordinates: [midLng, midLat] },
    });
  }

  // Total at last point when finished
  if (finished && pts.length >= 2) {
    const last = pts[pts.length - 1];
    labelFeatures.push({
      type: 'Feature',
      properties: { label: `Total: ${formatDistance(total)}` },
      geometry: { type: 'Point', coordinates: [last.lng, last.lat] },
    });
  }

  return { lineFeatures, pointFeatures, labelFeatures };
}

function buildAreaFeatures(pts: MeasurePoint[], finished: boolean) {
  const lineFeatures: GeoJSON.Feature[] = [];
  const pointFeatures: GeoJSON.Feature[] = [];
  const labelFeatures: GeoJSON.Feature[] = [];

  const coords = pts.map((p) => [p.lng, p.lat]);

  if (coords.length >= 2) {
    lineFeatures.push({
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: coords },
    });
  }

  if (coords.length >= 3) {
    const closed = [...coords, coords[0]];
    lineFeatures.push({
      type: 'Feature',
      properties: {},
      geometry: { type: 'Polygon', coordinates: [closed] },
    });
  }

  pts.forEach((p) => {
    pointFeatures.push({
      type: 'Feature',
      properties: {},
      geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
    });
  });

  // Segment labels
  for (let i = 0; i < pts.length - 1; i++) {
    const d = haversineDistance(pts[i].lng, pts[i].lat, pts[i + 1].lng, pts[i + 1].lat);
    const midLng = (pts[i].lng + pts[i + 1].lng) / 2;
    const midLat = (pts[i].lat + pts[i + 1].lat) / 2;
    labelFeatures.push({
      type: 'Feature',
      properties: { label: formatDistance(d) },
      geometry: { type: 'Point', coordinates: [midLng, midLat] },
    });
  }

  // Area label at centroid when finished
  if (finished && pts.length >= 3) {
    const cx = pts.reduce((s, p) => s + p.lng, 0) / pts.length;
    const cy = pts.reduce((s, p) => s + p.lat, 0) / pts.length;
    labelFeatures.push({
      type: 'Feature',
      properties: { label: formatArea(sphericalPolygonArea(pts)) },
      geometry: { type: 'Point', coordinates: [cx, cy] },
    });
  }

  return { lineFeatures, pointFeatures, labelFeatures };
}

function buildCoordinateFeatures(pts: MeasurePoint[]) {
  const pointFeatures: GeoJSON.Feature[] = [];
  const labelFeatures: GeoJSON.Feature[] = [];

  pts.forEach((p) => {
    pointFeatures.push({
      type: 'Feature',
      properties: {},
      geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
    });
    labelFeatures.push({
      type: 'Feature',
      properties: { label: `${p.lat.toFixed(6)}, ${p.lng.toFixed(6)}` },
      geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
    });
  });

  return { lineFeatures: [] as GeoJSON.Feature[], pointFeatures, labelFeatures };
}

export function MeasureTool() {
  const map = useMapStore((s) => s.map);
  const { mode, currentPoints, completed, startMeasure, addPoint, undoLastPoint, finishMeasure, clearMeasure } =
    useMeasureStore();
  const clickRef = useRef<((e: mapboxgl.MapMouseEvent) => void) | null>(null);
  const contextRef = useRef<((e: mapboxgl.MapMouseEvent) => void) | null>(null);

  // ── Setup / teardown sources + layers ──
  const setupLayers = useCallback(() => {
    if (!map) return;
    if (map.getSource(SRC_LINE)) return;

    map.addSource(SRC_LINE, { type: 'geojson', data: EMPTY_FC });
    map.addSource(SRC_POINTS, { type: 'geojson', data: EMPTY_FC });
    map.addSource(SRC_LABELS, { type: 'geojson', data: EMPTY_FC });

    map.addLayer({
      id: LYR_FILL,
      type: 'fill',
      source: SRC_LINE,
      paint: { 'fill-color': '#ffa925', 'fill-opacity': 0.15 },
      filter: ['==', '$type', 'Polygon'],
    });
    map.addLayer({
      id: LYR_LINE,
      type: 'line',
      source: SRC_LINE,
      paint: { 'line-color': '#ffa925', 'line-width': 2.5, 'line-dasharray': [4, 3] },
      filter: ['==', '$type', 'LineString'],
    });
    map.addLayer({
      id: LYR_POINTS,
      type: 'circle',
      source: SRC_POINTS,
      paint: {
        'circle-radius': 5,
        'circle-color': '#ffffff',
        'circle-stroke-color': '#ffa925',
        'circle-stroke-width': 2,
      },
    });
    map.addLayer({
      id: LYR_LABELS,
      type: 'symbol',
      source: SRC_LABELS,
      layout: {
        'text-field': ['get', 'label'],
        'text-size': 12,
        'text-offset': [0, -1.2],
        'text-anchor': 'bottom',
        'text-allow-overlap': true,
      },
      paint: {
        'text-color': '#141d2d',
        'text-halo-color': '#ffffff',
        'text-halo-width': 1.5,
      },
    });
  }, [map]);

  useEffect(() => {
    if (!map) return;

    setupLayers();
    map.on('style.load', setupLayers);

    return () => {
      map.off('style.load', setupLayers);
      for (const lyr of [LYR_LABELS, LYR_POINTS, LYR_LINE, LYR_FILL]) {
        if (map.getLayer(lyr)) map.removeLayer(lyr);
      }
      for (const src of [SRC_LABELS, SRC_POINTS, SRC_LINE]) {
        if (map.getSource(src)) map.removeSource(src);
      }
    };
  }, [map, setupLayers]);

  // ── Update GeoJSON when points/mode/completed change ──
  useEffect(() => {
    if (!map) return;
    if (!map.getSource(SRC_LINE)) return;

    const allLine: GeoJSON.Feature[] = [];
    const allPoints: GeoJSON.Feature[] = [];
    const allLabels: GeoJSON.Feature[] = [];

    // Render completed measurements
    for (const m of completed) {
      let result;
      if (m.mode === 'distance') {
        result = buildDistanceFeatures(m.points, true);
      } else if (m.mode === 'area') {
        result = buildAreaFeatures(m.points, true);
      } else {
        result = buildCoordinateFeatures(m.points);
      }
      allLine.push(...result.lineFeatures);
      allPoints.push(...result.pointFeatures);
      allLabels.push(...result.labelFeatures);
    }

    // Render in-progress measurement
    if (currentPoints.length > 0 && mode && mode !== 'coordinates') {
      let result;
      if (mode === 'distance') {
        result = buildDistanceFeatures(currentPoints, false);
      } else {
        result = buildAreaFeatures(currentPoints, false);
      }
      allLine.push(...result.lineFeatures);
      allPoints.push(...result.pointFeatures);
      allLabels.push(...result.labelFeatures);
    }

    (map.getSource(SRC_LINE) as mapboxgl.GeoJSONSource).setData({
      type: 'FeatureCollection',
      features: allLine,
    });
    (map.getSource(SRC_POINTS) as mapboxgl.GeoJSONSource).setData({
      type: 'FeatureCollection',
      features: allPoints,
    });
    (map.getSource(SRC_LABELS) as mapboxgl.GeoJSONSource).setData({
      type: 'FeatureCollection',
      features: allLabels,
    });
  }, [map, currentPoints, completed, mode]);

  // ── Register / unregister click + contextmenu handlers ──
  useEffect(() => {
    if (!map || !mode) return;

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      const store = useMeasureStore.getState();
      if (!store.mode) return;

      if (store.mode === 'coordinates') {
        // Each click adds a new completed coordinate measurement
        useMeasureStore.setState((s) => ({
          completed: [
            ...s.completed,
            { mode: 'coordinates' as const, points: [{ lng: e.lngLat.lng, lat: e.lngLat.lat }] },
          ],
        }));
      } else {
        store.addPoint(e.lngLat.lng, e.lngLat.lat);
      }
    };

    const handleContextMenu = (e: mapboxgl.MapMouseEvent) => {
      e.preventDefault();
      const store = useMeasureStore.getState();
      if (!store.mode || store.mode === 'coordinates') return;
      if (store.currentPoints.length < 2) return;
      store.finishMeasure();
    };

    map.on('click', handleClick);
    map.on('contextmenu', handleContextMenu);
    clickRef.current = handleClick;
    contextRef.current = handleContextMenu;
    map.getCanvas().style.cursor = 'crosshair';
    map.doubleClickZoom.disable();

    return () => {
      if (clickRef.current) map.off('click', clickRef.current);
      if (contextRef.current) map.off('contextmenu', contextRef.current);
      clickRef.current = null;
      contextRef.current = null;
      map.getCanvas().style.cursor = '';
      map.doubleClickZoom.enable();
    };
  }, [map, mode]);

  // ── Computed totals for current in-progress measurement ──
  let currentTotal = 0;
  for (let i = 0; i < currentPoints.length - 1; i++) {
    currentTotal += haversineDistance(
      currentPoints[i].lng, currentPoints[i].lat,
      currentPoints[i + 1].lng, currentPoints[i + 1].lat,
    );
  }
  const currentArea = currentPoints.length >= 3 ? sphericalPolygonArea(currentPoints) : 0;

  const handleStartMode = (m: MeasureMode) => {
    // If switching modes, finish current measurement first if it has enough points
    const store = useMeasureStore.getState();
    if (store.currentPoints.length >= 2 && store.mode && store.mode !== 'coordinates') {
      store.finishMeasure();
    }
    startMeasure(m);
  };

  return (
    <>
      {/* Activation button */}
      <div className="absolute top-4 right-14 z-10">
        <Button
          variant="secondary"
          size="icon"
          className={cn(
            'bg-white shadow-md hover:bg-gray-50',
            mode && 'ring-2 ring-[#ffa925] bg-orange-50',
          )}
          onClick={() => (mode ? clearMeasure() : startMeasure('distance'))}
          title="Measure"
        >
          <Ruler className="h-4 w-4" />
        </Button>
      </div>

      {/* Floating toolbar */}
      {mode && (
        <div className="absolute top-16 right-14 z-10 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 min-w-[180px]">
          {/* Mode selector */}
          <div className="flex gap-1">
            <Button
              variant={mode === 'distance' ? 'default' : 'secondary'}
              size="xs"
              className={mode === 'distance' ? 'bg-[#ffa925] hover:bg-[#ffa925]/90 text-white' : ''}
              onClick={() => handleStartMode('distance')}
            >
              <Ruler className="h-3 w-3" /> Distance
            </Button>
            <Button
              variant={mode === 'area' ? 'default' : 'secondary'}
              size="xs"
              className={mode === 'area' ? 'bg-[#ffa925] hover:bg-[#ffa925]/90 text-white' : ''}
              onClick={() => handleStartMode('area')}
            >
              <Hexagon className="h-3 w-3" /> Area
            </Button>
            <Button
              variant={mode === 'coordinates' ? 'default' : 'secondary'}
              size="xs"
              className={mode === 'coordinates' ? 'bg-[#ffa925] hover:bg-[#ffa925]/90 text-white' : ''}
              onClick={() => handleStartMode('coordinates')}
            >
              <MousePointerClick className="h-3 w-3" /> Coords
            </Button>
          </div>

          {/* Measurement summary list */}
          {(completed.length > 0 || currentPoints.length >= 2 || (mode === 'coordinates' && currentPoints.length > 0)) && (
            <div className="border-t pt-1 max-h-[180px] overflow-y-auto flex flex-col gap-0.5">
              {completed.map((m, i) => {
                const typeIndex = completed.slice(0, i + 1).filter((c) => c.mode === m.mode).length;
                if (m.mode === 'distance') {
                  let d = 0;
                  for (let j = 0; j < m.points.length - 1; j++) {
                    d += haversineDistance(m.points[j].lng, m.points[j].lat, m.points[j + 1].lng, m.points[j + 1].lat);
                  }
                  return (
                    <div key={i} className="text-xs text-[#141d2d] flex justify-between px-1">
                      <span className="text-gray-500">Line {typeIndex}:</span>
                      <span className="font-semibold">{formatDistance(d)}</span>
                    </div>
                  );
                }
                if (m.mode === 'area') {
                  const a = sphericalPolygonArea(m.points);
                  return (
                    <div key={i} className="text-xs text-[#141d2d] flex justify-between px-1">
                      <span className="text-gray-500">Polygon {typeIndex}:</span>
                      <span className="font-semibold">{formatArea(a)}</span>
                    </div>
                  );
                }
                // coordinates
                const pt = m.points[0];
                return (
                  <div key={i} className="text-xs text-[#141d2d] flex justify-between px-1">
                    <span className="text-gray-500">Coord {typeIndex}:</span>
                    <span className="font-mono">{pt.lat.toFixed(6)}, {pt.lng.toFixed(6)}</span>
                  </div>
                );
              })}
              {/* In-progress line */}
              {mode === 'distance' && currentPoints.length >= 2 && (
                <div className="text-xs text-[#141d2d] flex justify-between px-1 opacity-60">
                  <span className="text-gray-400 italic">Drawing...</span>
                  <span className="font-semibold">{formatDistance(currentTotal)}</span>
                </div>
              )}
              {mode === 'area' && currentPoints.length >= 3 && (
                <div className="text-xs text-[#141d2d] flex justify-between px-1 opacity-60">
                  <span className="text-gray-400 italic">Drawing...</span>
                  <span className="font-semibold">{formatArea(currentArea)}</span>
                </div>
              )}
            </div>
          )}

          {/* Hint when no measurements yet */}
          {completed.length === 0 && currentPoints.length === 0 && mode !== 'coordinates' && (
            <div className="text-[10px] text-gray-400 text-center">
              Click to add points. Right-click to finish.
            </div>
          )}
          {completed.length === 0 && mode === 'coordinates' && (
            <div className="text-[10px] text-gray-400 text-center">
              Click on the map to get coordinates.
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-1 justify-end border-t pt-1">
            {currentPoints.length > 0 && mode !== 'coordinates' && (
              <Button variant="secondary" size="xs" onClick={undoLastPoint}>
                <Undo2 className="h-3 w-3" /> Undo
              </Button>
            )}
            {currentPoints.length >= 2 && mode !== 'coordinates' && (
              <Button
                size="xs"
                onClick={finishMeasure}
                className="bg-[#ffa925] hover:bg-[#ffa925]/90 text-white"
              >
                Finish
              </Button>
            )}
            <Button variant="secondary" size="xs" onClick={clearMeasure}>
              <Trash2 className="h-3 w-3" /> Clear
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
