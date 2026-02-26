import type { LayerGroup, LayerConfig, RasterClassification } from '@/types';
import { TILESERVER_URLS } from './map.config';

// Color ramps for raster layers (normalized 0-1 values)
export const COLOR_RAMPS: Record<string, unknown[]> = {
  thermal: [
    'step', ['raster-value'],
    '#313695',
    0.1, '#4575b4',
    0.2, '#74add1',
    0.3, '#abd9e9',
    0.4, '#e0f3f8',
    0.5, '#ffffbf',
    0.6, '#fee090',
    0.7, '#fdae61',
    0.8, '#f46d43',
    0.9, '#d73027',
    1.0, '#a50026',
  ],
  lab: [
    'step', ['raster-value'],
    '#e9dde0',
    0.09, '#e9c7cf',
    0.18, '#e9a6a9',
    0.27, '#e97775',
    0.36, '#eba983',
    0.45, '#ede594',
    0.55, '#bff05e',
    0.64, '#17dac3',
    0.73, '#12cee8',
    0.82, '#71c4eb',
    0.91, '#3b6fd0',
    1.0, '#242cb6',
  ],
  moho: [
    'step', ['raster-value'],
    '#ffffcc',
    0.1, '#ffeda0',
    0.2, '#fed976',
    0.3, '#feb24c',
    0.4, '#fd8d3c',
    0.5, '#fc4e2a',
    0.6, '#e31a1c',
    0.7, '#bd0026',
    1.0, '#800026',
  ],
  velocity: [
    'step', ['raster-value'],
    '#d73027',
    0.2, '#f46d43',
    0.4, '#fdae61',
    0.6, '#fee090',
    0.8, '#e0f3f8',
    0.9, '#abd9e9',
    0.95, '#74add1',
    0.975, '#4575b4',
    1.0, '#313695',
  ],
  // ── Sequential ──────────────────────────────────────────
  viridis: [
    'step', ['raster-value'],
    '#440154',
    0.1, '#482777',
    0.2, '#3f4a8a',
    0.3, '#31678e',
    0.4, '#26838f',
    0.5, '#1f9d8a',
    0.6, '#6cce5a',
    0.7, '#b6de2b',
    0.8, '#fee825',
    1.0, '#fee825',
  ],
  inferno: [
    'step', ['raster-value'],
    '#000004',
    0.1, '#160b39',
    0.2, '#420a68',
    0.3, '#6a176e',
    0.4, '#932667',
    0.5, '#bc3754',
    0.6, '#dd513a',
    0.7, '#f37819',
    0.8, '#fca50a',
    0.9, '#f6d746',
    1.0, '#fcffa4',
  ],
  magma: [
    'step', ['raster-value'],
    '#000004',
    0.1, '#140e36',
    0.2, '#3b0f70',
    0.3, '#641a80',
    0.4, '#8c2981',
    0.5, '#b73779',
    0.6, '#de4968',
    0.7, '#f7705c',
    0.8, '#fe9f6d',
    0.9, '#fecf92',
    1.0, '#fcfdbf',
  ],
  plasma: [
    'step', ['raster-value'],
    '#0d0887',
    0.1, '#3a049a',
    0.2, '#6a00a8',
    0.3, '#900da4',
    0.4, '#b12a90',
    0.5, '#cc4778',
    0.6, '#e16462',
    0.7, '#f2844b',
    0.8, '#fca636',
    0.9, '#fcce25',
    1.0, '#f0f921',
  ],
  cividis: [
    'step', ['raster-value'],
    '#002051',
    0.1, '#0a326a',
    0.2, '#2b446e',
    0.3, '#4d566d',
    0.4, '#696970',
    0.5, '#7f7c75',
    0.6, '#968f6e',
    0.7, '#b0a360',
    0.8, '#ccb94c',
    0.9, '#e8d02e',
    1.0, '#fdea45',
  ],
  turbo: [
    'step', ['raster-value'],
    '#30123b',
    0.1, '#4662d7',
    0.2, '#36aaf9',
    0.3, '#1ae4b6',
    0.4, '#72fe5e',
    0.5, '#c8ef34',
    0.6, '#faba39',
    0.7, '#f66b19',
    0.8, '#d93806',
    0.9, '#a11201',
    1.0, '#7a0403',
  ],
  // ── Diverging ───────────────────────────────────────────
  rdylgn: [
    'step', ['raster-value'],
    '#a50026',
    0.1, '#d73027',
    0.2, '#f46d43',
    0.3, '#fdae61',
    0.4, '#fee08b',
    0.5, '#ffffbf',
    0.6, '#d9ef8b',
    0.7, '#a6d96a',
    0.8, '#66bd63',
    0.9, '#1a9850',
    1.0, '#006837',
  ],
  spectral: [
    'step', ['raster-value'],
    '#9e0142',
    0.1, '#d53e4f',
    0.2, '#f46d43',
    0.3, '#fdae61',
    0.4, '#fee08b',
    0.5, '#ffffbf',
    0.6, '#e6f598',
    0.7, '#abdda4',
    0.8, '#66c2a5',
    0.9, '#3288bd',
    1.0, '#5e4fa2',
  ],
  coolwarm: [
    'step', ['raster-value'],
    '#3b4cc0',
    0.1, '#5977e3',
    0.2, '#7b9ff9',
    0.3, '#9ebeff',
    0.4, '#c0d4f5',
    0.5, '#dddcdc',
    0.6, '#f2cbb7',
    0.7, '#f7a889',
    0.8, '#ee7b5a',
    0.9, '#d44e41',
    1.0, '#b40426',
  ],
  // ── Mono ────────────────────────────────────────────────
  greys: [
    'step', ['raster-value'],
    '#ffffff',
    0.1, '#e6e6e6',
    0.2, '#cccccc',
    0.3, '#b3b3b3',
    0.4, '#999999',
    0.5, '#808080',
    0.6, '#666666',
    0.7, '#4d4d4d',
    0.8, '#333333',
    0.9, '#1a1a1a',
    1.0, '#000000',
  ],
};

// Gradient strings for legend display
export const GRADIENTS: Record<string, string> = {
  thermal: 'linear-gradient(to right, #313695, #4575b4, #74add1, #abd9e9, #e0f3f8, #ffffbf, #fee090, #fdae61, #f46d43, #d73027, #a50026)',
  lab: 'linear-gradient(to right, #e9dde0, #e9c7cf, #e9a6a9, #e97775, #eba983, #ede594, #bff05e, #17dac3, #12cee8, #71c4eb, #3b6fd0, #242cb6)',
  moho: 'linear-gradient(to right, #ffffcc, #ffeda0, #fed976, #feb24c, #fd8d3c, #fc4e2a, #e31a1c, #bd0026, #800026)',
  velocity: 'linear-gradient(to right, #d73027, #f46d43, #fdae61, #fee090, #e0f3f8, #abd9e9, #74add1, #4575b4, #313695)',
  viridis: 'linear-gradient(to right, #440154, #482777, #3f4a8a, #31678e, #26838f, #1f9d8a, #6cce5a, #b6de2b, #fee825)',
  inferno: 'linear-gradient(to right, #000004, #160b39, #420a68, #6a176e, #932667, #bc3754, #dd513a, #f37819, #fca50a, #f6d746, #fcffa4)',
  magma: 'linear-gradient(to right, #000004, #140e36, #3b0f70, #641a80, #8c2981, #b73779, #de4968, #f7705c, #fe9f6d, #fecf92, #fcfdbf)',
  plasma: 'linear-gradient(to right, #0d0887, #3a049a, #6a00a8, #900da4, #b12a90, #cc4778, #e16462, #f2844b, #fca636, #fcce25, #f0f921)',
  cividis: 'linear-gradient(to right, #002051, #0a326a, #2b446e, #4d566d, #696970, #7f7c75, #968f6e, #b0a360, #ccb94c, #e8d02e, #fdea45)',
  turbo: 'linear-gradient(to right, #30123b, #4662d7, #36aaf9, #1ae4b6, #72fe5e, #c8ef34, #faba39, #f66b19, #d93806, #a11201, #7a0403)',
  rdylgn: 'linear-gradient(to right, #a50026, #d73027, #f46d43, #fdae61, #fee08b, #ffffbf, #d9ef8b, #a6d96a, #66bd63, #1a9850, #006837)',
  spectral: 'linear-gradient(to right, #9e0142, #d53e4f, #f46d43, #fdae61, #fee08b, #ffffbf, #e6f598, #abdda4, #66c2a5, #3288bd, #5e4fa2)',
  coolwarm: 'linear-gradient(to right, #3b4cc0, #5977e3, #7b9ff9, #9ebeff, #c0d4f5, #dddcdc, #f2cbb7, #f7a889, #ee7b5a, #d44e41, #b40426)',
  greys: 'linear-gradient(to right, #ffffff, #e6e6e6, #cccccc, #b3b3b3, #999999, #808080, #666666, #4d4d4d, #333333, #1a1a1a, #000000)',
};

/** Convert a RasterClassification into a MapLibre raster-color expression */
export function buildRasterColorExpression(c: RasterClassification): unknown[] {
  const sorted = [...c.entries].sort((a, b) => a.value - b.value);
  const range = c.max - c.min;
  const normalize = (v: number) => range === 0 ? 0 : Math.max(0, Math.min(1, (v - c.min) / range));

  if (c.interpolation === 'linear') {
    const expr: unknown[] = ['interpolate', ['linear'], ['raster-value']];
    for (const e of sorted) {
      expr.push(normalize(e.value), e.color);
    }
    return expr;
  }

  // Discrete (step)
  if (sorted.length === 0) return ['step', ['raster-value'], '#000000'];
  const expr: unknown[] = ['step', ['raster-value'], sorted[0].color];
  for (let i = 1; i < sorted.length; i++) {
    expr.push(normalize(sorted[i].value), sorted[i].color);
  }
  return expr;
}

/** Convert a RasterClassification into a CSS linear-gradient for preview */
export function buildGradientFromClassification(c: RasterClassification): string {
  const sorted = [...c.entries].sort((a, b) => a.value - b.value);
  const range = c.max - c.min;
  if (sorted.length === 0) return 'linear-gradient(to right, #ccc, #ccc)';

  const stops = sorted.map((e) => {
    const pct = range === 0 ? 0 : ((e.value - c.min) / range) * 100;
    return `${e.color} ${pct.toFixed(1)}%`;
  });
  return `linear-gradient(to right, ${stops.join(', ')})`;
}

export const LAYER_GROUPS: LayerGroup[] = [
  {
    id: 'global',
    title: 'Global',
    icon: '🌍',
    color: '#10b981',
    defaultExpanded: true,
    children: [
      {
        id: 'surface-module',
        title: 'Surface module',
        color: '#10b981',
        defaultExpanded: true,
        children: [
          // ── Boundaries ──────────────────────────────────────────
          {
            id: 'boundaries',
            title: 'Boundaries',
            color: '#6b7280',
            defaultExpanded: false,
            layers: [
              {
                id: 'gl_esri_world_countries_fixed',
                type: 'vector',
                title: 'National Boundaries',
                schema: 'surface',
                table: 'gl_esri_world_countries_fixed',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_esri_world_countries_fixed/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'fill',
                  sourceLayer: 'surface.gl_esri_world_countries_fixed',
                  paint: {
                    'fill-color': 'rgba(0, 0, 0, 0)',
                    'fill-outline-color': '#374151',
                    'fill-opacity': 1,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: '#374151', label: 'Boundary' }],
                },
                metadata: {
                  description: 'Boundaries for world countries as of August 2022.',
                  citation: 'Esri, "World Countries Generalized," accessed February 2024.',
                },
                permissions: {
                  visibility: 'public',
                  allowedCompanies: [],
                },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_wdpa_jun2025_poly_and_points_and_india_indone',
                type: 'vector',
                title: 'Protected Areas (WDPA)',
                schema: 'surface',
                table: 'gl_wdpa_jun2025_poly_and_points_and_india_indone',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_wdpa_jun2025_poly_and_points_and_india_indone/{z}/{x}/{y}.pbf`],
                  minzoom: 2,
                },
                style: {
                  type: 'fill',
                  sourceLayer: 'surface.gl_wdpa_jun2025_poly_and_points_and_india_indone',
                  paint: {
                    'fill-color': '#60b638',
                    'fill-outline-color': '#008614',
                    'fill-opacity': 0.7,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: '#60b638', label: 'Protected Area' }],
                },
                metadata: {
                  description: 'The World Database on Protected Areas (WDPA) and other effective area-based conservation measures (OECM) database are joint products of UNEP and IUCN, managed by UNEP-WCMC. The databases store information on the global distribution of terrestrial and marine protected areas and OECMs designated at the national level and under regional and international conventions and agreements. Areas of India and Indonesia were added into this database. The marine protected areas are not shown.',
                  citation: 'UNEP-WCMC and IUCN (2025), Protected Planet: The World Database on Protected Areas (WDPA) and World Database on Other Effective Area-based Conservation Measures (WD-OECM), June 2025, Cambridge, UK.',
                },
                permissions: {
                  visibility: 'public',
                  allowedCompanies: [],
                },
                defaultVisible: false,
                defaultOpacity: 0.7,
              },
            ],
          },
          // ── Infrastructure ──────────────────────────────────────
          {
            id: 'infrastructure',
            title: 'Infrastructure',
            color: '#f59e0b',
            defaultExpanded: false,
            layers: [
              {
                id: 'gl_power_plant_database',
                type: 'vector',
                title: 'Global Power Plants',
                schema: 'surface',
                table: 'gl_power_plant_database',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_power_plant_database/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'surface.gl_power_plant_database',
                  paint: {
                    'circle-stroke-color': '#000000',
                    'circle-radius': [
                      'match', ['get', 'primary_fuel'],
                      'Geothermal', 6, 'Coal', 6, 'Gas', 6, 'Oil', 6,
                      3,
                    ] as unknown as number,
                    'circle-color': [
                      'match', ['get', 'primary_fuel'],
                      'Hydro', '#0096FF',
                      'Solar', '#FFC000',
                      'Gas', '#848884',
                      'Other', '#D2B48C',
                      'Oil', '#a23772',
                      'Wind', '#87CEEB',
                      'Nuclear', '#DE3163',
                      'Coal', '#023020',
                      'Waste', '#6E260E',
                      'Biomass', '#007159',
                      'Wave and Tidal', '#0437F2',
                      'Petcoke', '#afa500',
                      'Geothermal', '#FF5F15',
                      'Storage', '#FBCEB1',
                      'Cogeneration', '#649a24',
                      '#FF0000',
                    ] as unknown as string,
                    'circle-opacity': 0.7,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [
                    { color: '#FF5F15', label: 'Geothermal' },
                    { color: '#023020', label: 'Coal' },
                    { color: '#848884', label: 'Gas' },
                    { color: '#a23772', label: 'Oil' },
                    { color: '#DE3163', label: 'Nuclear' },
                    { color: '#0096FF', label: 'Hydro' },
                    { color: '#FFC000', label: 'Solar' },
                    { color: '#87CEEB', label: 'Wind' },
                    { color: '#007159', label: 'Biomass' },
                  ],
                },
                metadata: {
                  description: 'The Global Power Plant Database is an open-source open-access dataset of grid-scale (1 MW and greater) electricity generating facilities operating across the world. The Database currently contains nearly 35000 power plants in 167 countries, representing about 72% of the world\'s capacity.',
                  citation: 'Global Energy Observatory, Google, KTH Royal Institute of Technology in Stockholm, Enipedia, World Resources Institute. 2019.',
                },
                permissions: {
                  visibility: 'public',
                  allowedCompanies: [],
                },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_gem_integrated_power_tracker_july_2024',
                type: 'vector',
                title: 'Integrated Power Tracker',
                schema: 'surface',
                table: 'gl_gem_integrated_power_tracker_july_2024',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_gem_integrated_power_tracker_july_2024/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'surface.gl_gem_integrated_power_tracker_july_2024',
                  paint: {
                    'circle-stroke-color': '#000000',
                    'circle-radius': [
                      'match', ['get', 'Type'],
                      'geothermal', 6, 'coal', 6, 'Gas', 6, 'oil/gas', 6,
                      3,
                    ] as unknown as number,
                    'circle-color': [
                      'match', ['get', 'Type'],
                      'hydropower', '#0096FF',
                      'solar', '#FFC000',
                      'oil/gas', '#848884',
                      'wind', '#87CEEB',
                      'nuclear', '#DE3163',
                      'coal', '#023020',
                      'bioenergy', '#007159',
                      'geothermal', '#FF5F15',
                      '#FF0000',
                    ] as unknown as string,
                    'circle-opacity': 0.7,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [
                    { color: '#FF5F15', label: 'Geothermal' },
                    { color: '#023020', label: 'Coal' },
                    { color: '#848884', label: 'Oil/Gas' },
                    { color: '#DE3163', label: 'Nuclear' },
                    { color: '#0096FF', label: 'Hydro' },
                    { color: '#FFC000', label: 'Solar' },
                    { color: '#87CEEB', label: 'Wind' },
                    { color: '#007159', label: 'Bioenergy' },
                  ],
                },
                metadata: {
                  description: 'The Global Integrated Power Tracker (GIPT) is a multi-sector dataset of power stations and facilities worldwide. The tracker provides unit-level information on thermal power (coal, oil, gas, nuclear, geothermal, bioenergy) and renewables (solar, wind, hydro). The tracker includes data on unit capacity, status, ownership, fuel type, start year, retirement date, geolocation, and more.',
                  citation: 'Global Energy Monitor, Global Integrated Power Tracker, July 2024 release.',
                },
                permissions: {
                  visibility: 'public',
                  allowedCompanies: [],
                },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_gem_oil_and_gas_plant_tracker_20240516',
                type: 'vector',
                title: 'Oil and Gas Plants',
                schema: 'surface',
                table: 'gl_gem_oil_and_gas_plant_tracker_20240516',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_gem_oil_and_gas_plant_tracker_20240516/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'surface.gl_gem_oil_and_gas_plant_tracker_20240516',
                  paint: {
                    'circle-stroke-color': '#000000',
                    'circle-radius': [
                      'interpolate', ['linear'], ['zoom'],
                      10, 6, 20, 3,
                    ] as unknown as number,
                    'circle-color': [
                      'match', ['get', 'Status'],
                      'operating', '#0818A8',
                      'pre-construction', '#F0E68C',
                      'announced', '#F0E68C',
                      '#800000',
                    ] as unknown as string,
                    'circle-opacity': 0.7,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [
                    { color: '#0818A8', label: 'Operating' },
                    { color: '#F0E68C', label: 'Pre-construction' },
                    { color: '#800000', label: 'Other' },
                  ],
                },
                metadata: {
                  description: 'The Global Oil and Gas Plant Tracker (GOGPT) is a worldwide dataset of oil and gas-fired power plants. It includes units with capacities of 50 megawatts (MW) or more. The GOGPT catalogs every oil and gas power plant at this capacity threshold of any status, including operating, announced, pre-construction, construction, shelved, cancelled, mothballed, or retired.',
                  citation: 'Global Energy Monitor, Global Oil and Gas Plant Tracker, February 2024 release.',
                },
                permissions: {
                  visibility: 'public',
                  allowedCompanies: [],
                },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_gem_ggit_gas_pipelines_2023_12',
                type: 'vector',
                title: 'Gas Pipelines',
                schema: 'surface',
                table: 'gl_gem_ggit_gas_pipelines_2023_12',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_gem_ggit_gas_pipelines_2023_12/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'line',
                  sourceLayer: 'surface.gl_gem_ggit_gas_pipelines_2023_12',
                  paint: {
                    'line-color': '#ff842f',
                    'line-width': 1,
                    'line-opacity': 0.8,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: '#ff842f', label: 'Gas Pipeline' }],
                },
                metadata: {
                  description: 'The Global Gas Infrastructure Tracker (GGIT) is an information resource on natural gas transmission pipeline projects and liquefied natural gas (LNG) import and export terminals. Currently, GGIT aims to include all LNG terminals regardless of threshold, as well as all global gas transmission pipelines over predetermined size thresholds.',
                  citation: 'Global Energy Monitor, Global Gas Infrastructure Tracker, December 2023 release.',
                },
                permissions: {
                  visibility: 'public',
                  allowedCompanies: [],
                },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_gem_ggit_lng_terminals_2024_01',
                type: 'vector',
                title: 'Gas Terminals',
                schema: 'surface',
                table: 'gl_gem_ggit_lng_terminals_2024_01',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_gem_ggit_lng_terminals_2024_01/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'surface.gl_gem_ggit_lng_terminals_2024_01',
                  paint: {
                    'circle-stroke-color': '#000000',
                    'circle-radius': [
                      'interpolate', ['linear'], ['zoom'],
                      10, 6, 20, 3,
                    ] as unknown as number,
                    'circle-color': [
                      'match', ['get', 'Status'],
                      'Operating', '#0818A8',
                      'Proposed', '#F0E68C',
                      '#800000',
                    ] as unknown as string,
                    'circle-opacity': 0.8,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [
                    { color: '#0818A8', label: 'Operating' },
                    { color: '#F0E68C', label: 'Proposed' },
                    { color: '#800000', label: 'Other' },
                  ],
                },
                metadata: {
                  description: 'The Global Gas Infrastructure Tracker (GGIT) is an information resource on natural gas transmission pipeline projects and liquefied natural gas (LNG) import and export terminals. Currently, GGIT aims to include all LNG terminals regardless of threshold, as well as all global gas transmission pipelines over predetermined size thresholds.',
                  citation: 'Global Energy Monitor, Global Gas Infrastructure Tracker, January 2024 release.',
                },
                permissions: {
                  visibility: 'public',
                  allowedCompanies: [],
                },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_gem_coal_plant_tracker_april_2024_20240516',
                type: 'vector',
                title: 'Coal Plants',
                schema: 'surface',
                table: 'gl_gem_coal_plant_tracker_april_2024_20240516',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_gem_coal_plant_tracker_april_2024_20240516/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'surface.gl_gem_coal_plant_tracker_april_2024_20240516',
                  paint: {
                    'circle-stroke-color': '#000000',
                    'circle-radius': [
                      'interpolate', ['linear'], ['zoom'],
                      10, 6, 20, 3,
                    ] as unknown as number,
                    'circle-color': [
                      'match', ['get', 'Status'],
                      'operating', '#023020',
                      'pre-construction', '#F0E68C',
                      'announced', '#F0E68C',
                      '#800000',
                    ] as unknown as string,
                    'circle-opacity': 0.7,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [
                    { color: '#023020', label: 'Operating' },
                    { color: '#F0E68C', label: 'Pre-construction' },
                    { color: '#800000', label: 'Other' },
                  ],
                },
                metadata: {
                  description: 'The Global Coal Plant Tracker (GCPT) provides information on coal-fired power units from around the world generating 30 megawatts and above. The GCPT catalogues every operating coal-fired generating unit, every new unit proposed since 2010, and every unit retired since 2000.',
                  citation: 'Global Coal Plant Tracker, Global Energy Monitor, April 2024 Supplemental release and January 2024 release.',
                },
                permissions: {
                  visibility: 'public',
                  allowedCompanies: [],
                },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_gem_global_nuclear_power_tracker_20240516',
                type: 'vector',
                title: 'Nuclear Plants',
                schema: 'surface',
                table: 'gl_gem_global_nuclear_power_tracker_20240516',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_gem_global_nuclear_power_tracker_20240516/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'surface.gl_gem_global_nuclear_power_tracker_20240516',
                  paint: {
                    'circle-stroke-color': '#000000',
                    'circle-radius': [
                      'interpolate', ['linear'], ['zoom'],
                      10, 6, 20, 3,
                    ] as unknown as number,
                    'circle-color': [
                      'match', ['get', 'Status'],
                      'operating', '#DE3163',
                      'pre-construction', '#F0E68C',
                      'announced', '#F0E68C',
                      '#800000',
                    ] as unknown as string,
                    'circle-opacity': 0.8,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [
                    { color: '#DE3163', label: 'Operating' },
                    { color: '#F0E68C', label: 'Pre-construction' },
                    { color: '#800000', label: 'Other' },
                  ],
                },
                metadata: {
                  description: 'The Global Nuclear Power Tracker (GNPT) is a worldwide dataset of nuclear power facilities. The GNPT catalogs every nuclear power plant unit of any capacity and of any status, including operating, announced, pre-construction, under construction, shelved, cancelled, mothballed, or retired.',
                  citation: 'Global Energy Monitor, Global Nuclear Power Tracker, October 2023 release.',
                },
                permissions: {
                  visibility: 'public',
                  allowedCompanies: [],
                },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_gem_windfarms',
                type: 'vector',
                title: 'Wind Power Farms',
                schema: 'surface',
                table: 'gl_gem_windfarms',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_gem_windfarms/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'surface.gl_gem_windfarms',
                  paint: {
                    'circle-stroke-color': '#000000',
                    'circle-radius': [
                      'interpolate', ['linear'], ['zoom'],
                      10, 6, 20, 3,
                    ] as unknown as number,
                    'circle-color': [
                      'match', ['get', 'Status'],
                      'operating', '#0818A8',
                      'pre-construction', '#F0E68C',
                      'announced', '#F0E68C',
                      '#800000',
                    ] as unknown as string,
                    'circle-opacity': 0.7,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [
                    { color: '#0818A8', label: 'Operating' },
                    { color: '#F0E68C', label: 'Pre-construction' },
                    { color: '#800000', label: 'Other' },
                  ],
                },
                metadata: {
                  description: 'The Global Wind Power Tracker (GWPT) is a worldwide dataset of utility-scale, on and offshore wind facilities. It includes wind farm phases with capacities of 10 megawatts (MW) or more. The GWPT catalogs every wind farm phase at this capacity threshold of any status, including operating, announced, pre-construction, under construction, shelved, cancelled, mothballed, or retired.',
                  citation: 'Global Energy Monitor, Global Wind Power Tracker, February 2024 release.',
                },
                permissions: {
                  visibility: 'public',
                  allowedCompanies: [],
                },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_solar',
                type: 'vector',
                title: 'Solar Power Plants',
                schema: 'surface',
                table: 'gl_solar',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_solar/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'surface.gl_solar',
                  paint: {
                    'circle-opacity': 0.7,
                    'circle-color': '#FFC000',
                    'circle-stroke-width': [
                      'interpolate', ['linear'], ['zoom'],
                      8, 2, 10, 2,
                    ] as unknown as number,
                    'circle-stroke-color': 'rgb(0, 0, 0)',
                    'circle-radius': [
                      'interpolate', ['linear'], ['zoom'],
                      10, 6, 20, 3,
                    ] as unknown as number,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: '#FFC000', label: 'Solar Installation' }],
                },
                metadata: {
                  description: 'The Harmonised global dataset of solar farm locations and power represents global solar installations clustered using a neighbourhood distance of 400m. It was collected from OpenStreetMap March 2020.',
                  citation: 'Dunnett, S. (2020) Harmonised global datasets of wind and solar farm locations and power. figshare. Dataset.',
                },
                permissions: {
                  visibility: 'public',
                  allowedCompanies: [],
                },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_borehole_clipped',
                type: 'vector',
                title: 'Boreholes, MapStand',
                schema: 'surface',
                table: 'gl_borehole_clipped',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_borehole_clipped/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'surface.gl_borehole_clipped',
                  paint: {
                    'circle-radius': 3,
                    'circle-color': '#000000',
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: '#000000', label: 'Borehole' }],
                },
                metadata: {
                  geothermalRelevance: 'Screening is often accelerated where subsurface data exists. For example, geothermal activity in the USA and Netherlands benefits from decades of oil and gas data acquisition.',
                  description: 'The Borehole or Well layer includes oil wells, gas wells, geothermal wells and research on stratigraphic boreholes.',
                  citation: 'MapStand Limited.',
                },
                permissions: {
                  visibility: 'public',
                  allowedCompanies: [],
                },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_arderne',
                type: 'vector',
                title: 'Power Lines (Arderne)',
                schema: 'surface',
                table: 'gl_arderne',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_arderne/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'line',
                  sourceLayer: 'surface.gl_arderne',
                  paint: {
                    'line-color': '#FFFF00',
                    'line-width': 0.5,
                    'line-opacity': 0.8,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: '#FFFF00', label: 'Power Line (Arderne)' }],
                },
                metadata: {
                  geothermalRelevance: 'Geothermal power plants generate electricity, which needs to be transmitted to consumers. Nearby existing power lines are beneficial as they reduce the need for additional infrastructure investment to connect a geothermal plant to the power grid.',
                  description: 'MV lines: using state-of-the-art algorithms in geospatial data analysis, the GridFinder dataset is the first composite map of the global power system with an open license. Note that this dataset is derived, and represents an approximate representation of existing MV power lines.',
                  citation: 'Arderne, C., Zorn, C., Nicolas, C. et al. Predictive mapping of the global power system using open data. Sci Data 7, 19 (2020).',
                },
                permissions: {
                  visibility: 'public',
                  allowedCompanies: [],
                },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_osm_power_lines_20231003',
                type: 'vector',
                title: 'Power Lines (OSM)',
                schema: 'surface',
                table: 'gl_osm_power_lines_20231003',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_osm_power_lines_20231003/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'line',
                  sourceLayer: 'surface.gl_osm_power_lines_20231003',
                  paint: {
                    'line-color': '#FFAE42',
                    'line-width': 1,
                    'line-opacity': 0.8,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: '#FFAE42', label: 'Power Line (OSM)' }],
                },
                metadata: {
                  geothermalRelevance: 'Geothermal power plants generate electricity, which needs to be transmitted to consumers. Nearby existing power lines are beneficial as they reduce the need for additional infrastructure investment to connect a geothermal plant to the power grid.',
                  description: 'HV lines: OpenStreetMap (OSM) is an open collaborative project aimed at creating a free, editable map of the world. We specifically filter the OpenStreetMap power lines dataset to isolate high voltage grid lines for further analysis. These high voltage grid lines are defined as those with ratings greater than 35 kV.',
                  citation: 'OpenStreetMap contributors. Planet data retrieved from https://planet.osm.org, 2023.',
                },
                permissions: {
                  visibility: 'public',
                  allowedCompanies: [],
                },
                defaultVisible: false,
                defaultOpacity: 1,
              },
            ],
          },
          // ── Topography ──────────────────────────────────────────
          {
            id: 'topography',
            title: 'Topography',
            color: '#84cc16',
            defaultExpanded: false,
            layers: [],
          },
          // ── Energy Demand and Production ─────────────────────────
          {
            id: 'energy-demand-production',
            title: 'Energy demand and production',
            color: '#ec4899',
            defaultExpanded: false,
            layers: [
              {
                id: 'gl_energy_demand_production',
                type: 'vector',
                title: 'Electricity power consumption',
                schema: 'surface',
                table: 'gl_energy_demand_production',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_energy_demand_production/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'fill',
                  sourceLayer: 'surface.gl_energy_demand_production',
                  paint: {
                    'fill-opacity': 0.7,
                    'fill-color': [
                      'interpolate', ['linear'], ['get', 'Ave5Y_kWhc'],
                      0, 'rgb(255, 251, 0)',
                      10000, 'rgb(255, 123, 0)',
                      21000, 'rgb(255, 0, 0)',
                    ] as unknown as string,
                    'fill-outline-color': '#000000',
                  },
                },
                legend: {
                  type: 'gradient',
                  min: 0,
                  max: 21000,
                  unit: 'kWh/capita',
                  gradient: 'linear-gradient(to right, rgb(255, 251, 0), rgb(255, 123, 0), rgb(255, 0, 0))',
                },
                metadata: {
                  geothermalRelevance: 'This layer highlights the electricity consumption levels of all countries, helping to identify where geothermal energy could complement existing sources by enhancing grid reliability and energy diversification.',
                  description: 'Electric power consumption (kWh per capita). Electric power consumption measures the production of power plants and combined heat and power plants less transmission, distribution, and transformation losses and own use by heat and power plants. The average of the last five years available for the indicator has been calculated (2019-2023).',
                  citation: 'The World Bank Group, republishing information originally provided by the International Energy Agency (IEA).',
                },
                permissions: {
                  visibility: 'public',
                  allowedCompanies: [],
                },
                defaultVisible: false,
                defaultOpacity: 0.7,
              },
              {
                id: 'gl_energy_demand_production_oil_sources',
                type: 'vector',
                title: 'Energy Production - Oil Sources',
                schema: 'surface',
                table: 'gl_energy_demand_production_oil_sources',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_energy_demand_production_oil_sources/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'fill',
                  sourceLayer: 'surface.gl_energy_demand_production_oil_sources',
                  paint: {
                    'fill-opacity': 0.7,
                    'fill-color': [
                      'interpolate', ['linear'], ['get', 'Ave5Y_perc'],
                      0, 'rgb(198, 239, 206)',
                      25, 'rgb(255, 255, 153)',
                      75, 'rgb(255, 183, 76)',
                      100, 'rgb(204, 0, 0)',
                    ] as unknown as string,
                    'fill-outline-color': '#000000',
                  },
                },
                legend: {
                  type: 'gradient',
                  min: 0,
                  max: 100,
                  unit: '%',
                  gradient: 'linear-gradient(to right, rgb(198, 239, 206), rgb(255, 255, 153), rgb(255, 183, 76), rgb(204, 0, 0))',
                },
                metadata: {
                  geothermalRelevance: 'This layer shows the proportion of electricity generated from oil-based sources across all countries, helping to understand the role petroleum products play in the current energy mix and where geothermal could provide complementary value.',
                  description: 'Electricity production from oil sources (%) represents the share of total electricity generated from oil-based fuels in each country. "Oil" includes crude oil and petroleum products used as inputs to produce electricity. The data represent the average of the last five available years (2019-2023).',
                  citation: 'The World Bank Group, republishing information originally provided by the International Energy Agency (IEA).',
                },
                permissions: {
                  visibility: 'public',
                  allowedCompanies: [],
                },
                defaultVisible: false,
                defaultOpacity: 0.7,
              },
              {
                id: 'gl_energy_demand_production_renewable',
                type: 'vector',
                title: 'Energy Production - Renewable',
                schema: 'surface',
                table: 'gl_energy_demand_production_renewable',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_energy_demand_production_renewable/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'fill',
                  sourceLayer: 'surface.gl_energy_demand_production_renewable',
                  paint: {
                    'fill-opacity': 0.7,
                    'fill-color': [
                      'interpolate', ['linear'], ['get', 'Ave5Y_GWh'],
                      200, 'rgb(255, 251, 0)',
                      10000, 'rgb(255, 123, 0)',
                      45000, 'rgb(255, 0, 0)',
                    ] as unknown as string,
                    'fill-outline-color': '#000000',
                  },
                },
                legend: {
                  type: 'gradient',
                  min: 200,
                  max: 45000,
                  unit: 'GWh',
                  gradient: 'linear-gradient(to right, rgb(255, 251, 0), rgb(255, 123, 0), rgb(255, 0, 0))',
                },
                metadata: {
                  geothermalRelevance: 'This layer highlights the shares of non-hydro renewable electricity production across all countries, providing insight into the distribution of these resources and supporting strategic evaluations of geothermal integration within existing energy frameworks.',
                  description: 'Electricity production from renewable sources (%) measures the proportion of electricity generated from renewable sources other than hydroelectric power. This includes geothermal, solar, tidal, wind, biomass, and biofuel energy. The data represent the average of the last four available years for each country (2018-2021).',
                  citation: 'The World Bank Group, republishing information originally provided by the International Energy Agency (IEA).',
                },
                permissions: {
                  visibility: 'public',
                  allowedCompanies: [],
                },
                defaultVisible: false,
                defaultOpacity: 0.7,
              },
              {
                id: 'gl_energy_supply_2023',
                type: 'vector',
                title: 'Total energy supply',
                schema: 'surface',
                table: 'gl_energy_supply_2023',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_energy_supply_2023/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'fill',
                  sourceLayer: 'surface.gl_energy_supply_2023',
                  paint: {
                    'fill-opacity': 0.7,
                    'fill-color': [
                      'interpolate', ['linear'], ['get', 'Ind4_2023'],
                      50000, 'rgb(255, 251, 0)',
                      1200000, 'rgb(255, 123, 0)',
                      13000000, 'rgb(255, 0, 0)',
                    ] as unknown as string,
                    'fill-outline-color': '#000000',
                  },
                },
                legend: {
                  type: 'gradient',
                  min: 50000,
                  max: 13000000,
                  unit: 'TJ',
                  gradient: 'linear-gradient(to right, rgb(255, 251, 0), rgb(255, 123, 0), rgb(255, 0, 0))',
                },
                metadata: {
                  geothermalRelevance: 'This layer shows the total energy supply (TES) of each country, highlighting overall energy needs and helping to identify opportunities where geothermal energy could diversify and strengthen the national energy mix.',
                  description: 'Total energy supply (TES) includes all the energy produced in or imported to a country, minus that which is exported or stored. It represents all the energy required to supply end users in the country. Some of these energy sources are used directly while most are transformed into fuels or electricity for final consumption.',
                  citation: 'Total energy supply, regional ranking, 2023. International Energy Agency (IEA). Data accessed: 2025-10-01.',
                },
                permissions: {
                  visibility: 'public',
                  allowedCompanies: [],
                },
                defaultVisible: false,
                defaultOpacity: 0.7,
              },
              {
                id: 'gl_total_energy_supply_per_unit_gdp',
                type: 'vector',
                title: 'Energy intensity of the economy',
                schema: 'surface',
                table: 'gl_total_energy_supply_per_unit_gdp',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_total_energy_supply_per_unit_gdp/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'fill',
                  sourceLayer: 'surface.gl_total_energy_supply_per_unit_gdp',
                  paint: {
                    'fill-opacity': 0.7,
                    'fill-color': [
                      'interpolate', ['linear'], ['get', 'TES_GDP_PP'],
                      0, '#f7fcf5',
                      3000, '#c7e9c0',
                      6000, '#74c476',
                      9000, '#31a354',
                      12000, '#006d2c',
                      15000, '#00441b',
                    ] as unknown as string,
                    'fill-outline-color': '#000000',
                  },
                },
                legend: {
                  type: 'gradient',
                  min: 0,
                  max: 15000,
                  unit: 'MJ/$',
                  gradient: 'linear-gradient(to right, #f7fcf5, #c7e9c0, #74c476, #31a354, #006d2c, #00441b)',
                },
                metadata: {
                  description: 'One way of looking at the overall energy efficiency of a region is to measure the total energy supply per unit of economic output (here adjusted for purchasing power parity). This reflects not only energy efficiency but also the structure of the economy, with services-oriented economies generally having a lower energy intensity than those based on heavy industry. Year 2023.',
                  citation: 'IEA 2025; Energy intensity of the economy. License: CC BY 4.0.',
                },
                permissions: {
                  visibility: 'public',
                  allowedCompanies: [],
                },
                defaultVisible: false,
                defaultOpacity: 0.7,
              },
            ],
          },
          // ── Resources ──────────────────────────────────────────
          {
            id: 'resources',
            title: 'Resources',
            color: '#0ea5e9',
            defaultExpanded: false,
            layers: [
              {
                id: 'gl_water_demand_by_country2',
                type: 'vector',
                title: 'Water Demand for Human Purposes',
                schema: 'surface',
                table: 'gl_water_demand_by_country2',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_water_demand_by_country2/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'fill',
                  sourceLayer: 'surface.gl_water_demand_by_country2',
                  paint: {
                    'fill-opacity': 0.7,
                    'fill-color': [
                      'interpolate', ['linear'], ['get', 'Total_Water_Demand'],
                      0, '#ffffd4',
                      202.75, '#fed98e',
                      670.89, '#fe9929',
                      1570.98, '#d95f0e',
                      4707.76, '#993404',
                    ] as unknown as string,
                    'fill-outline-color': '#000000',
                  },
                },
                legend: {
                  type: 'gradient',
                  min: 0,
                  max: 4708,
                  unit: 'km\u00B3/yr',
                  gradient: 'linear-gradient(to right, #ffffd4, #fed98e, #fe9929, #d95f0e, #993404)',
                },
                metadata: {
                  geothermalRelevance: 'This data is valuable for geothermal energy development because it helps assess water availability for geothermal operations, which often require significant water for cooling and reinjection. Understanding regional water scarcity, recharge rates, and consumption patterns ensures sustainable geothermal resource management while minimizing conflicts with other water-dependent sectors.',
                  description: 'The World Water Map provides insights into global water resources from 1980 to 2019, covering water storage and movement within the terrestrial cycle, human influences on water use (such as demand, withdrawal, and consumption), and, crucially, the disparity between renewable water availability and human needs—known as the water gap. The data supporting the World Water Map is derived from the PCR-GLOBWB global hydrological model, developed at Utrecht University.',
                  citation: 'Droppers, B., & Wanders, N. (2023). World Water Map Data Package. Data publication platform of Utrecht University.',
                },
                permissions: {
                  visibility: 'public',
                  allowedCompanies: [],
                },
                defaultVisible: false,
                defaultOpacity: 0.7,
              },
            ],
          },
          // ── Surveys ──────────────────────────────────────────
          {
            id: 'surveys',
            title: 'Surveys',
            color: '#3b82f6',
            defaultExpanded: false,
            layers: [
              {
                id: 'gl_2d_seismic',
                type: 'vector',
                title: '2D Seismic, MapStand',
                schema: 'surface',
                table: 'gl_2d_seismic',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_2d_seismic/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'line',
                  sourceLayer: 'surface.gl_2d_seismic',
                  paint: {
                    'line-color': '#c31313',
                    'line-width': 1,
                    'line-opacity': 0.8,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: '#c31313', label: '2D Seismic Survey' }],
                },
                metadata: {
                  geothermalRelevance: 'Screening is often accelerated where subsurface data exists. For example, geothermal activity in the USA and Netherlands benefits from decades of oil and gas data acquisition.',
                  description: '2D Seismic Surveys are made up of a series of 2D seismic lines often acquired or processed with similar parameters.',
                  citation: 'MapStand Limited.',
                },
                permissions: {
                  visibility: 'public',
                  allowedCompanies: [],
                },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_3d_seismic',
                type: 'vector',
                title: '3D Seismic, MapStand',
                schema: 'surface',
                table: 'gl_3d_seismic',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_3d_seismic/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'fill',
                  sourceLayer: 'surface.gl_3d_seismic',
                  paint: {
                    'fill-color': '#0E4C92',
                    'fill-opacity': 0.7,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: '#0E4C92', label: '3D Seismic Survey' }],
                },
                metadata: {
                  geothermalRelevance: 'Screening is often accelerated where subsurface data exists. For example, geothermal activity in the USA and Netherlands benefits from decades of oil and gas data acquisition.',
                  description: '3D Seismic Surveys show the location of 3D seismic surveys. This dataset includes both original surveys and merged reprocessed areas. Datasets include both multi-client datasets and spec surveys.',
                  citation: 'MapStand Limited.',
                },
                permissions: {
                  visibility: 'public',
                  allowedCompanies: [],
                },
                defaultVisible: false,
                defaultOpacity: 0.7,
              },
            ],
          },
        ],
      },
      // ── Subsurface Module ──────────────────────────────────────────
      {
        id: 'subsurface-module',
        title: 'Subsurface Module',
        color: '#f59e0b',
        defaultExpanded: true,
        children: [
          // ── Advection ──────────────────────────────────────────
          {
            id: 'advection',
            title: 'Advection',
            color: '#f97316',
            defaultExpanded: false,
            layers: [
              {
                id: 'gl_advection',
                type: 'vector',
                title: 'Advection',
                schema: 'subsurface',
                table: 'gl_advection',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface.gl_advection/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'subsurface.gl_advection',
                  paint: {
                    'circle-color': [
                      'case',
                      ['match', ['get', 'GEOMAP_Cla'], ['Spring', 'Spring, Well', 'Well, Spring (Source Combination)'], true, false],
                      'rgb(0, 102, 204)',
                      ['==', ['get', 'GEOMAP_Cla'], 'Well'],
                      'hsl(205, 79%, 60%)',
                      ['==', ['get', 'GEOMAP_Cla'], 'Geothermal Area'],
                      'rgb(221, 196, 106)',
                      ['==', ['get', 'GEOMAP_Cla'], 'Geothermal Installation'],
                      'rgb(191, 129, 45)',
                      ['==', ['get', 'GEOMAP_Cla'], 'Geothermal System'],
                      'rgb(128, 95, 165)',
                      ['==', ['get', 'GEOMAP_Cla'], 'Volcano'],
                      'hsl(0, 90%, 49%)',
                      ['==', ['get', 'GEOMAP_Cla'], 'Vent'],
                      'rgb(245, 144, 83)',
                      'rgb(180, 180, 180)',
                    ] as unknown as string,
                    'circle-radius': [
                      'interpolate', ['exponential', 1.5], ['zoom'],
                      4, 2, 7, 4, 10, 6, 13, 10, 16, 18,
                    ] as unknown as number,
                    'circle-stroke-color': '#000000',
                    'circle-stroke-width': [
                      'interpolate', ['linear'], ['zoom'],
                      6, 0.5, 10, 1, 14, 1.5,
                    ] as unknown as number,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [
                    { color: 'rgb(0, 102, 204)', label: 'Spring' },
                    { color: 'hsl(205, 79%, 60%)', label: 'Well' },
                    { color: 'rgb(221, 196, 106)', label: 'Geothermal Area' },
                    { color: 'rgb(191, 129, 45)', label: 'Geothermal Installation' },
                    { color: 'rgb(128, 95, 165)', label: 'Geothermal System' },
                    { color: 'hsl(0, 90%, 49%)', label: 'Volcano' },
                    { color: 'rgb(245, 144, 83)', label: 'Vent' },
                  ],
                },
                metadata: {
                  description: 'Advection describes the transport of heat by a moving fluid or a rock mass. Examples include hydrothermal circulation in porous rocks. This process is usually much faster, and, therefore, more efficient in equilibrating temperature fields, than heat conduction. Volcanoes, Vents, thermal springs and recent Large Igneous Provinces (LIPS) are all signs of advection. This database combines multiple databases into one single repository.',
                  citation: 'Compiled and formatted into a single database by Doran, H. and Matt, V for Project InnerSpace. <a href=\'https://storage.googleapis.com/project-innerspace-beta/pdf_resources/GL_ADVECTION_DATA.pdf\' target=\'_blank\'>(For more details click here)</a>',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 1,
              },
            ],
          },
          // ── Tectonics ──────────────────────────────────────────
          {
            id: 'tectonics',
            title: 'Tectonics',
            color: '#dc2626',
            defaultExpanded: false,
            layers: [
              {
                id: 'gl_plate_boundaries',
                type: 'vector',
                title: 'Plate Boundaries',
                schema: 'subsurface',
                table: 'gl_plate_boundaries',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface.gl_plate_boundaries/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'line',
                  sourceLayer: 'subsurface.gl_plate_boundaries',
                  paint: {
                    'line-color': [
                      'match', ['get', 'type'],
                      ['spreading center'], 'hsl(3, 90%, 62%)',
                      ['collision zone'], 'hsl(143, 91%, 42%)',
                      ['dextral transform'], 'hsl(66, 90%, 68%)',
                      ['subduction zone'], 'hsl(293, 91%, 42%)',
                      ['sinistral transform'], 'hsl(40, 91%, 42%)',
                      ['extension zone'], 'hsl(345, 65%, 79%)',
                      ['inferred'], 'hsl(5, 7%, 94%)',
                      'hsl(235, 91%, 42%)',
                    ] as unknown as string,
                    'line-dasharray': [1, 1] as unknown as number[],
                    'line-width': 2,
                    'line-opacity': 1,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [
                    { color: 'hsl(3, 90%, 62%)', label: 'Spreading Center' },
                    { color: 'hsl(143, 91%, 42%)', label: 'Collision Zone' },
                    { color: 'hsl(66, 90%, 68%)', label: 'Dextral Transform' },
                    { color: 'hsl(293, 91%, 42%)', label: 'Subduction Zone' },
                    { color: 'hsl(40, 91%, 42%)', label: 'Sinistral Transform' },
                    { color: 'hsl(345, 65%, 79%)', label: 'Extension Zone' },
                  ],
                },
                metadata: {
                  geothermalRelevance: 'The geological processes at plate boundaries, such as subduction zones and rift zones, can lead to elevated subsurface temperatures.',
                  description: 'Active tectonic plates and their boundary zones.',
                  citation: 'Hasterok, D., Halpin, J., Hand, M., Collins, A., Kreemer, C., Gard, M.G., Glorie, S., (revised) New maps of global geologic provinces and tectonic plates, Earth Science Reviews. Preprint available (EarthArXiv) <a href=\'https://doi.org/10.31223/X5TD1C\' target=\'_blank\' rel=\'noreferrer\'>https://doi.org/10.31223/X5TD1C</a>',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_evenick_2021_global_basins_wgs84',
                type: 'vector',
                title: 'Sedimentary Basins',
                schema: 'subsurface',
                table: 'gl_evenick_2021_global_basins_wgs84',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface.gl_evenick_2021_global_basins_wgs84/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'fill',
                  sourceLayer: 'subsurface.gl_evenick_2021_global_basins_wgs84',
                  paint: {
                    'fill-color': 'rgb(238, 236, 236)',
                    'fill-opacity': 0.7,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: 'rgb(238, 236, 236)', label: 'Sedimentary Basin' }],
                },
                metadata: {
                  geothermalRelevance: 'Sedimentary Basins are caused by extension (rifting) that thins the lithosphere, increasing the heat from the mantle. The heat generated by these geological processes can persist for a considerable period after rifting has occurred. Understanding the time since rifting helps assess the availability and sustainability of the heat source for geothermal energy production. The formation age of each of these basins is included in the metadata. In addition different sedimentary basins can have varying thermal conductivities, which affect the ability of rocks to transfer heat.',
                  description: 'A global sedimentary basin map was constructed with 764 basins. A conscious effort was undertaken to draft an updated and revised global sedimentary basin map, which utilizes information from literature in the form of stratigraphic columns, gravity data, geological maps, well data, seismic data, previous compilations, and other sources of information that can be utilized for large-scale basin analysis, studies, and assessments.',
                  citation: 'Evenick, J.C., 2021, Glimpses into Earth\'s history using a revised global sedimentary basin map, Earth-Science Reviews, Volume 215, 2021, 103564, ISSN 0012-8252, <a href=\'https://doi.org/10.1016/j.earscirev.2021.103564\' target=\'_blank\' rel=\'noreferrer\'>https://doi.org/10.1016/j.earscirev.2021.103564</a>.',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 0.7,
              },
              {
                id: 'gl_innerspace_structures_1m_2025_12_final_all',
                type: 'vector',
                title: 'Faults',
                schema: 'subsurface',
                table: 'gl_innerspace_structures_1m_2025_12_final_all',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface.gl_innerspace_structures_1m_2025_12_final_all/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'line',
                  sourceLayer: 'subsurface.gl_innerspace_structures_1m_2025_12_final_all',
                  paint: {
                    'line-width': [
                      'match', ['get', 'CLASS'],
                      '1', 2, '2', 1, '3', 0.3, '4', 0.3, 1,
                    ] as unknown as number,
                    'line-color': '#000000',
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: '#000000', label: 'Fault' }],
                },
                metadata: {
                  geothermalRelevance: 'Some faults and fractures can serve as pathways for geothermal fluids to migrate from the deeper reservoir to the surface, they can also enhance heat transfer within the earth\'s crust. Deeper faults may provide a more efficient conduit for the transport of heat from the deeper, hotter portions of the earth\'s crust or mantle to shallower depths. This can result in higher geothermal temperatures at accessible depths. Many conventional geothermal systems are strongly structurally controlled with favourable locations at structural bends, transfer zones, termination zones, transtensional pull apart zones, relay ramps, step-overs, and accommodation zones.',
                  description: 'The Structural Elements Database includes the latest kinematics of each fault (compressional, extensional, strike-slip), where this is known or can be interpreted.',
                  citation: 'Global Crustal Architecture and Structure: Markwick, P.J., Paton, D.A., Mortimer, E.J. (In Prep). Reclus: A new database for investigating the tectonics of the Earth. Geochemistry, Geophysics, Geosystems, <a href=\'https://doi.org/10.1029/2021GC009897\' target=\'_blank\' rel=\'noreferrer\'>https://doi.org/10.1029/2021GC009897</a>',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_woa_active_faults',
                type: 'vector',
                title: 'Active Faults',
                schema: 'subsurface',
                table: 'gl_woa_active_faults',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface.gl_woa_active_faults/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'line',
                  sourceLayer: 'subsurface.gl_woa_active_faults',
                  paint: {
                    'line-width': 1,
                    'line-color': 'rgb(250, 52, 17)',
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: 'rgb(250, 52, 17)', label: 'Active Fault' }],
                },
                metadata: {
                  geothermalRelevance: 'An understanding of fault patterns, depth of penetration and stress type is important when exploring for geothermal systems. Many conventional geothermal systems are strongly structurally controlled with favourable locations at structural bends, transfer zones, termination zones, transtensional pull apart zones, relay ramps, step-overs, and accommodation zones.',
                  description: 'The GEM Foundation\'s Global Active Faults project (GEM-GAF) is building a comprehensive, global dataset of active fault traces of seismogenic concern. The dataset comprises GIS files of fault traces and a small amount of relevant attributes or metadata (fault geometry, kinematics, slip rate, etc.) useful for seismic hazard modeling and other tectonic applications.',
                  citation: 'Styron, Richard, and Marco Pagani. "The GEM Global Active Faults Database." Earthquake Spectra, vol. 36, no. 1_suppl, Oct. 2020, pp. 160-180, doi:10.1177/8755293020944182.',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_innerspace_structures_1m_global_2025_12_final',
                type: 'vector',
                title: 'Kinematics of Faults',
                schema: 'subsurface',
                table: 'gl_innerspace_structures_1m_global_2025_12_final',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface.gl_innerspace_structures_1m_global_2025_12_final/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'line',
                  sourceLayer: 'subsurface.gl_innerspace_structures_1m_global_2025_12_final',
                  paint: {
                    'line-color': [
                      'match', ['get', 'KINEMATICS'],
                      'C', '#d33aff',
                      'E', '#ffb72b',
                      'S', '#4cc94c',
                      'SC', '#c0bd3f',
                      'SE', '#33b5cc',
                      'U', '#999999',
                      '#999999',
                    ] as unknown as string,
                    'line-width': 1.4,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [
                    { color: '#d33aff', label: 'Compressional (C)' },
                    { color: '#ffb72b', label: 'Extensional (E)' },
                    { color: '#4cc94c', label: 'Strike-slip (S)' },
                    { color: '#c0bd3f', label: 'Strike-slip/Compressional (SC)' },
                    { color: '#33b5cc', label: 'Strike-slip/Extensional (SE)' },
                    { color: '#999999', label: 'Unknown (U)' },
                  ],
                },
                metadata: {
                  geothermalRelevance: 'Some faults and fractures can serve as pathways for geothermal fluids to migrate from the deeper reservoir to the surface, they can also enhance heat transfer within the earth\'s crust. Deeper faults may provide a more efficient conduit for the transport of heat from the deeper, hotter portions of the earth\'s crust or mantle to shallower depths. This can result in higher geothermal temperatures at accessible depths.',
                  description: 'The Structural Elements Database includes the latest kinematics of each fault (compressional, extensional, strike-slip), where this is known or can be interpreted.',
                  citation: 'Global Crustal Architecture and Structure: Markwick, P.J., Paton, D.A., Mortimer, E.J. (In Prep). Reclus: A new database for investigating the tectonics of the Earth. Geochemistry, Geophysics, Geosystems, <a href=\'https://doi.org/10.1029/2021GC009897\' target=\'_blank\' rel=\'noreferrer\'>https://doi.org/10.1029/2021GC009897</a>',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_crustal_facies',
                type: 'vector',
                title: 'Crustal Facies',
                schema: 'subsurface',
                table: 'gl_crustal_facies',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface.gl_crustal_facies/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'fill',
                  sourceLayer: 'subsurface.gl_crustal_facies',
                  paint: {
                    'fill-opacity': 0.7,
                    'fill-color': [
                      'match', ['get', 'SYM_ID'],
                      ['C9000'], 'rgb(50, 235, 210)',
                      ['C9020'], 'rgb(0, 190, 180)',
                      ['C9252'], 'rgb(210, 185, 220)',
                      ['C9254'], 'rgb(220, 210, 220)',
                      ['C9605'], 'rgb(255, 175, 255)',
                      ['C9610'], 'rgb(255, 225, 255)',
                      ['C9615'], 'rgb(255, 237, 255)',
                      ['C9616'], 'rgb(255, 240, 240)',
                      ['C9618'], 'rgb(194, 130, 227)',
                      ['C9620'], 'rgb(194, 158, 215)',
                      ['C9625'], 'rgb(210, 185, 220)',
                      ['C9630'], 'rgb(220, 210, 220)',
                      ['C9840'], 'rgb(150, 175, 210)',
                      ['C9816'], 'rgb(220, 120, 255)',
                      ['C9030'], 'rgb(25, 150, 165)',
                      ['C9600'], 'rgb(225, 255, 255)',
                      ['C9815'], 'rgb(230, 170, 255)',
                      ['C9826'], 'rgb(190, 165, 255)',
                      ['C9250'], 'rgb(0, 170, 170)',
                      ['C9810'], 'rgb(204, 102, 255)',
                      ['C9827'], 'rgb(208, 181, 255)',
                      ['C9828'], 'rgb(230, 190, 255)',
                      ['C9845'], 'rgb(180, 185, 215)',
                      ['C9120'], 'rgb(32, 162, 164)',
                      ['C9130'], 'rgb(36, 153, 165)',
                      ['C9238'], 'rgb(0, 190, 180)',
                      ['C9842'], 'rgb(34, 34, 102)',
                      ['C9400'], 'rgb(255, 237, 255)',
                      ['C9239'], 'rgb(25, 150, 165)',
                      ['C9800'], 'rgb(255, 175, 255)',
                      ['C9820'], 'rgb(185, 150, 255)',
                      ['C9230'], 'rgb(255, 225, 255)',
                      ['C9110'], 'rgb(158, 212, 158)',
                      ['C9818'], 'rgb(230, 200, 255)',
                      '#000000',
                    ] as unknown as string,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [
                    { color: 'rgb(50, 235, 210)', label: 'Oceanic Crust' },
                    { color: 'rgb(255, 175, 255)', label: 'Felsic Igneous' },
                    { color: 'rgb(194, 130, 227)', label: 'Intermediate' },
                    { color: 'rgb(150, 175, 210)', label: 'Metamorphic' },
                    { color: 'rgb(34, 34, 102)', label: 'Mafic' },
                  ],
                },
                metadata: {
                  geothermalRelevance: 'Different crustal facies have varying thermal conductivities, which influence the ability of the Earth\'s crust to conduct heat. Understanding the thermal properties of crustal facies is critical for assessing the subsurface\'s heat transfer capabilities. Facies with high thermal conductivity can facilitate the transfer of heat from deeper geological layers to shallower depths, potentially enhancing geothermal potential. In addition, crustal facies can vary in their radiogenic heat production. Some facies may contain higher concentrations of radioactive elements, which generate heat through radioactive decay.',
                  description: 'The Crustal Facies Database records the large-scale composition and thickness of crustal blocks at the present-day.',
                  citation: 'Global Crustal Architecture and Structure: Markwick, P.J., Paton, D.A., Mortimer, E.J. (In Prep). Reclus: A new database for investigating the tectonics of the Earth. Geochemistry, Geophysics, Geosystems, <a href=\'https://doi.org/10.1029/2021GC009897\' target=\'_blank\' rel=\'noreferrer\'>https://doi.org/10.1029/2021GC009897</a>',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 0.7,
              },
              {
                id: 'gl_igneous_features_global_2025_12_final_wiceland',
                type: 'vector',
                title: 'Igneous Features',
                schema: 'subsurface',
                table: 'gl_igneous_features_global_2025_12_final_wiceland',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface.gl_igneous_features_global_2025_12_final_wiceland/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'fill',
                  sourceLayer: 'subsurface.gl_igneous_features_global_2025_12_final_wiceland',
                  paint: {
                    'fill-color': [
                      'match', ['get', 'SYM_ID'],
                      ['IG300'], 'rgb(255, 190, 190)',
                      ['IG310'], 'rgb(255, 0, 0)',
                      ['IG320'], 'rgb(255, 227, 229)',
                      ['IG330'], 'rgb(245, 129, 115)',
                      '#000000',
                    ] as unknown as string,
                    'fill-opacity': 0.54,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [
                    { color: 'rgb(255, 190, 190)', label: 'IG300' },
                    { color: 'rgb(255, 0, 0)', label: 'IG310' },
                    { color: 'rgb(255, 227, 229)', label: 'IG320' },
                    { color: 'rgb(245, 129, 115)', label: 'IG330' },
                  ],
                },
                metadata: {
                  geothermalRelevance: 'Surface occurrence of igneous rocks are evidence of advection, the transport of heat by a moving fluid or a rock mass. This process is usually much faster and, therefore, more efficient in equilibrating temperature fields, than heat conduction.',
                  description: 'The igneous activity database includes the spatial distribution of active and inactive igneous rocks, including intrusions and extrusions.',
                  citation: 'Global Crustal Architecture and Structure: Markwick, P.J., Paton, D.A., Mortimer, E.J. (In Prep). Reclus: A new database for investigating the tectonics of the Earth. Geochemistry, Geophysics, Geosystems, <a href=\'https://doi.org/10.1029/2021GC009897\' target=\'_blank\' rel=\'noreferrer\'>https://doi.org/10.1029/2021GC009897</a>',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 0.54,
              },
              {
                id: 'gl_igneous_features_2025_12_active_wiceland',
                type: 'vector',
                title: 'Active Igneous Features',
                schema: 'subsurface',
                table: 'gl_igneous_features_2025_12_active_wiceland',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface.gl_igneous_features_2025_12_active_wiceland/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'fill',
                  sourceLayer: 'subsurface.gl_igneous_features_2025_12_active_wiceland',
                  paint: {
                    'fill-color': [
                      'match', ['get', 'SYM_ID'],
                      ['IG300'], 'rgb(255, 190, 190)',
                      ['IG310'], 'rgb(255, 0, 0)',
                      ['IG320'], 'rgb(255, 227, 229)',
                      ['IG330'], 'rgb(245, 129, 115)',
                      '#000000',
                    ] as unknown as string,
                    'fill-opacity': 0.54,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [
                    { color: 'rgb(255, 190, 190)', label: 'IG300' },
                    { color: 'rgb(255, 0, 0)', label: 'IG310' },
                    { color: 'rgb(255, 227, 229)', label: 'IG320' },
                    { color: 'rgb(245, 129, 115)', label: 'IG330' },
                  ],
                },
                metadata: {
                  geothermalRelevance: 'Surface occurrence of igneous rocks are evidence of advection, the transport of heat by a moving fluid or a rock mass. This process is usually much faster and, therefore, more efficient in equilibrating temperature fields, than heat conduction.',
                  description: 'The igneous activity database includes the spatial distribution of active and inactive igneous rocks, including intrusions and extrusions.',
                  citation: 'Global Crustal Architecture and Structure: Markwick, P.J., Paton, D.A., Mortimer, E.J. (In Prep). Reclus: A new database for investigating the tectonics of the Earth. Geochemistry, Geophysics, Geosystems, <a href=\'https://doi.org/10.1029/2021GC009897\' target=\'_blank\' rel=\'noreferrer\'>https://doi.org/10.1029/2021GC009897</a>',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 0.54,
              },
            ],
          },
          // ── Tectonics - Lithosphere Stress ─────────────────────
          {
            id: 'tectonics-lithosphere-stress',
            title: 'Tectonics - Lithosphere Stress',
            color: '#e11d48',
            defaultExpanded: false,
            layers: [
              {
                id: 'gl_fault_blocks',
                type: 'vector',
                title: 'Fault Block Stress',
                schema: 'subsurface',
                table: 'gl_fault_blocks',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface.gl_fault_blocks/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'fill',
                  sourceLayer: 'subsurface.gl_fault_blocks',
                  paint: {
                    'fill-opacity': 0.7,
                    'fill-outline-color': 'rgb(40, 36, 36)',
                    'fill-color': [
                      'match', ['get', 'Stress'],
                      ['No'], 'rgb(247, 24, 24)',
                      ['Yes'], 'rgb(16, 244, 115)',
                      'rgb(150, 150, 150)',
                    ] as unknown as string,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [
                    { color: 'rgb(16, 244, 115)', label: 'Stress: Yes' },
                    { color: 'rgb(247, 24, 24)', label: 'Stress: No' },
                    { color: 'rgb(150, 150, 150)', label: 'Unknown' },
                  ],
                },
                metadata: {
                  geothermalRelevance: 'Knowledge of the present-day tectonic stress is essential for numerous applications in geothermal exploration and production including risking the magnitude and location of induced seismicity, improving the stability of boreholes and enhancing fluid production through natural or induced fractures. Details of the present-day stress (magnitudes and orientations) are required to resolve these issues within an individual reservoir.',
                  description: 'This dataset highlights the size in terms of area of individual fault blocks.',
                  citation: 'Nemcok, M. et al., (In Prep.). Global Fault Block Stress',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 0.7,
              },
              {
                id: 'gl_fault_blocks_area',
                type: 'vector',
                title: 'Fault Block Stress - Area',
                schema: 'subsurface',
                table: 'gl_fault_blocks',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface.gl_fault_blocks/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'fill',
                  sourceLayer: 'subsurface.gl_fault_blocks',
                  paint: {
                    'fill-opacity': 0.7,
                    'fill-color': [
                      'step', ['get', 'Area_km2'],
                      'rgb(122, 4, 3)',
                      100, 'rgb(179, 27, 1)',
                      500, 'rgb(222, 62, 8)',
                      1000, 'rgb(247, 111, 26)',
                      2000, 'rgb(254, 169, 51)',
                      3000, 'rgb(234, 212, 57)',
                      4500, 'rgb(190, 244, 52)',
                      7000, 'rgb(133, 255, 81)',
                      9500, 'rgb(58, 244, 144)',
                      13000, 'rgb(24, 219, 198)',
                      20000, 'rgb(49, 175, 245)',
                      30000, 'rgb(70, 126, 245)',
                      40000, 'rgb(66, 74, 180)',
                      100000, 'rgb(25, 25, 127)',
                    ] as unknown as string,
                  },
                },
                legend: {
                  type: 'gradient',
                  min: 0,
                  max: 100000,
                  unit: 'km\u00B2',
                  gradient: 'linear-gradient(to right, rgb(122, 4, 3), rgb(247, 111, 26), rgb(234, 212, 57), rgb(133, 255, 81), rgb(24, 219, 198), rgb(49, 175, 245), rgb(25, 25, 127))',
                },
                metadata: {
                  geothermalRelevance: 'Knowledge of the present-day tectonic stress is essential for numerous applications in geothermal exploration and production including risking the magnitude and location of induced seismicity, improving the stability of boreholes and enhancing fluid production through natural or induced fractures. Details of the present-day stress (magnitudes and orientations) are required to resolve these issues within an individual reservoir.',
                  description: 'This dataset highlights which fault blocks contain maximum horizontal stress data and which do not to provide guidance of existing data and importantly knowledge of data gaps that potentially increase the risk around an individual geothermal project.',
                  citation: 'Nemcok, M. et al., (In Prep.). Global Fault Block Stress',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 0.7,
              },
              {
                id: 'gl_subsurface_wsm_database_2025_stress',
                type: 'vector',
                title: 'Crustal stress field orientation and regime',
                schema: 'subsurface',
                table: 'gl_subsurface_wsm_database_2025_stress',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface.gl_subsurface_wsm_database_2025_stress/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'subsurface.gl_subsurface_wsm_database_2025_stress',
                  paint: {
                    'circle-color': [
                      'match', ['get', 'REGIME'],
                      'TF', '#1f78b4',
                      'SS', '#33a02c',
                      'NF', '#e31a1c',
                      'NS', '#ff7f00',
                      'TS', '#00bfff',
                      '#000000',
                    ] as unknown as string,
                    'circle-radius': 4,
                    'circle-stroke-width': 0.5,
                    'circle-stroke-color': '#000000',
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [
                    { color: '#1f78b4', label: 'Thrust Faulting (TF)' },
                    { color: '#33a02c', label: 'Strike-Slip (SS)' },
                    { color: '#e31a1c', label: 'Normal Faulting (NF)' },
                    { color: '#ff7f00', label: 'Normal/Strike-Slip (NS)' },
                    { color: '#00bfff', label: 'Thrust/Strike-Slip (TS)' },
                  ],
                },
                metadata: {
                  geothermalRelevance: 'Crustal stress field orientation and regime data are critical for geothermal exploration and reservoir engineering, influencing borehole stability, induced seismicity risk assessment, and fracture-enhanced fluid production.',
                  description: 'Stress map displays the orientation of maximum horizontal stress SHmax.',
                  citation: 'Heidbach, O., Rajabi, M., Di Giacomo, D., Harris, J., Lammers, S., Morawietz, S., Pierdominici, S., Reiter, K., Storchak, D., von Specht, S., Ziegler, M. O. (2025): World Stress Map 2025, GFZ Data Services, doi:10.5880/WSM.2025.002',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'na_stress_relative_stress_magnitude_points',
                type: 'vector',
                title: '(NAM) Relative Stress Magnitude Points',
                schema: 'subsurface',
                table: 'na_stress_relative_stress_magnitude_points',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface.na_stress_relative_stress_magnitude_points/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'subsurface.na_stress_relative_stress_magnitude_points',
                  paint: {
                    'circle-color': [
                      'interpolate', ['linear'], ['get', 'A_phi_mean_mu'],
                      0, '#00FF00', 0.5, '#77FF00', 1, '#EEFF00',
                      1.5, '#FFAA00', 2, '#FF5500', 2.5, '#FF0000', 3, '#000000',
                    ] as unknown as string,
                    'circle-stroke-width': [
                      'interpolate', ['linear'], ['zoom'], 8, 0, 10, 2,
                    ] as unknown as number,
                    'circle-stroke-color': '#000000',
                    'circle-radius': [
                      'interpolate', ['linear'], ['zoom'], 2, 4, 20, 3,
                    ] as unknown as number,
                  },
                },
                legend: {
                  type: 'gradient',
                  min: 0,
                  max: 3,
                  unit: 'A\u03C6',
                  gradient: 'linear-gradient(to right, #00FF00, #77FF00, #EEFF00, #FFAA00, #FF5500, #FF0000, #000000)',
                },
                metadata: {
                  geothermalRelevance: 'Relative stress magnitude data helps assess faulting regimes and is essential for geothermal reservoir characterization and induced seismicity risk management.',
                  description: 'Points are styled based on mean or best value of relative stress magnitude. Data were collected between 2015 and 2022.',
                  citation: 'Lundstern, J., and Zoback, M.D., 2023, Maximum horizontal stress orientation and relative stress magnitude (faulting regime) data throughout North America: U.S. Geological Survey data release, <a href=\'https://doi.org/10.5066/P90LS6QF\' target=\'_blank\' rel=\'noreferrer\'>https://doi.org/10.5066/P90LS6QF</a>.',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'na_stress_shmax_orientations',
                type: 'vector',
                title: '(NAM) Maximum Horizontal Stress (SHmax)',
                schema: 'subsurface',
                table: 'na_stress_shmax_orientations',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface.na_stress_shmax_orientations/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'subsurface.na_stress_shmax_orientations',
                  paint: {
                    'circle-color': '#228B22',
                    'circle-stroke-width': [
                      'interpolate', ['linear'], ['zoom'], 8, 0, 10, 2,
                    ] as unknown as number,
                    'circle-stroke-color': '#000000',
                    'circle-radius': [
                      'interpolate', ['linear'], ['zoom'], 2, 4, 20, 3,
                    ] as unknown as number,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: '#228B22', label: 'SHmax Orientation' }],
                },
                metadata: {
                  geothermalRelevance: 'Maximum horizontal stress orientation is a critical input for geothermal well planning, hydraulic fracture design, and understanding reservoir permeability.',
                  description: 'Measured orientations of maximum horizontal stress (SHmax).',
                  citation: 'Lundstern, J., and Zoback, M.D., 2023, Maximum horizontal stress orientation and relative stress magnitude (faulting regime) data throughout North America: U.S. Geological Survey data release, <a href=\'https://doi.org/10.5066/P90LS6QF\' target=\'_blank\' rel=\'noreferrer\'>https://doi.org/10.5066/P90LS6QF</a>.',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'na_stress_focus_mechanisms_catalog',
                type: 'vector',
                title: '(NAM) Earthquake Magnitude',
                schema: 'subsurface',
                table: 'na_stress_focus_mechanisms_catalog',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface.na_stress_focus_mechanisms_catalog/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'subsurface.na_stress_focus_mechanisms_catalog',
                  paint: {
                    'circle-color': [
                      'interpolate', ['linear'], ['get', 'Magnitude'],
                      0, '#000080', 1, '#023603', 2, '#07c40d', 3, '#85fa89',
                      4, '#F8DC75', 5, '#FFFF00', 6, '#FFA500', 7, '#FF5349',
                      8, '#FF0000', 10, '#8B0000',
                    ] as unknown as string,
                    'circle-stroke-width': [
                      'interpolate', ['linear'], ['zoom'], 8, 0, 10, 2,
                    ] as unknown as number,
                    'circle-stroke-color': '#000000',
                    'circle-radius': [
                      'interpolate', ['linear'], ['zoom'], 2, 4, 20, 3,
                    ] as unknown as number,
                  },
                },
                legend: {
                  type: 'gradient',
                  min: 0,
                  max: 10,
                  unit: 'M',
                  gradient: 'linear-gradient(to right, #000080, #023603, #07c40d, #85fa89, #F8DC75, #FFFF00, #FFA500, #FF5349, #FF0000, #8B0000)',
                },
                metadata: {
                  geothermalRelevance: 'Earthquake focal mechanisms reveal faulting style and stress orientation, informing induced seismicity risk assessment for geothermal operations.',
                  description: 'Earthquakes from 1959-2020.',
                  citation: 'Lundstern, J., and Zoback, M.D., 2023, Maximum horizontal stress orientation and relative stress magnitude (faulting regime) data throughout North America: U.S. Geological Survey data release, <a href=\'https://doi.org/10.5066/P90LS6QF\' target=\'_blank\' rel=\'noreferrer\'>https://doi.org/10.5066/P90LS6QF</a>.',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 1,
              },
            ],
          },
          // ── Heat Source Proximity ───────────────────────────────
          {
            id: 'heat-source-proximity',
            title: 'Heat Source Proximity',
            color: '#8b5cf6',
            defaultExpanded: false,
            layers: [
              {
                id: 'gl_continents_merged_continental_seismic_points',
                type: 'vector',
                title: 'Continental Seismic Points',
                schema: 'subsurface',
                table: 'gl_continents_merged_continental_seismic_points',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface.gl_continents_merged_continental_seismic_points/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'subsurface.gl_continents_merged_continental_seismic_points',
                  paint: {
                    'circle-color': [
                      'match', ['get', 'field_3'],
                      'Continents reflection data', 'rgb(30, 96, 133)',
                      'Continents Reversed Refraction data', 'rgb(220, 136, 62)',
                      'Continents RF data', 'rgb(58, 140, 94)',
                      'Continents Unreversed Refraction data', 'rgb(124, 90, 158)',
                      'rgb(0, 0, 0)',
                    ] as unknown as string,
                    'circle-stroke-width': 0.5,
                    'circle-radius': [
                      'interpolate', ['linear'], ['zoom'], 10, 3, 20, 1,
                    ] as unknown as number,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [
                    { color: 'rgb(30, 96, 133)', label: 'Reflection' },
                    { color: 'rgb(220, 136, 62)', label: 'Reversed Refraction' },
                    { color: 'rgb(58, 140, 94)', label: 'RF' },
                    { color: 'rgb(124, 90, 158)', label: 'Unreversed Refraction' },
                  ],
                },
                metadata: {
                  geothermalRelevance: 'Seismic survey data provides critical constraints on subsurface structure, helping identify potential geothermal reservoirs, fault zones, and thermal anomalies at depth.',
                  description: 'Continental seismic survey points from reflection and refraction data.',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_s_wave_tomography_receivers_v01',
                type: 'vector',
                title: 'S WAVE TOMOGRAPHY Receivers',
                schema: 'subsurface',
                table: 'gl_s_wave_tomography_receivers_v01',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface.gl_s_wave_tomography_receivers_v01/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'subsurface.gl_s_wave_tomography_receivers_v01',
                  paint: {
                    'circle-color': 'rgb(255, 40, 0)',
                    'circle-stroke-width': 0.09,
                    'circle-stroke-color': 'rgb(0, 0, 0)',
                    'circle-radius': [
                      'interpolate', ['linear'], ['zoom'], 0, 4, 5, 4, 8, 2,
                    ] as unknown as number,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: 'rgb(255, 40, 0)', label: 'Receiver' }],
                },
                metadata: {
                  geothermalRelevance: 'S-wave tomography reveals subsurface temperature and compositional variations that are key indicators of geothermal potential, including partial melt zones and lithospheric thinning.',
                  description: 'These tomographic models were created using Automated Multimode Inversion (AMI). AMI analyses several types of seismic waves at once, comparing real earthquake seismograms with synthetic ones to determine Earth structure. This map shows the global distribution of the broadband seismic stations (receivers) used in the inversion.',
                  citation: 'Bonadio, R., and Lebedev, S., (2026) for Project InnerSpace, building on the most recent regional tomographic models for: Africa (AF2020, Celli et al., 2020), the Middle East and Asia (ASIA2024, Dou et al., 2024), North America (NA2014 and NAT2020), South America (SACI-24, Chagas de Melo et al., 2025), Oceania (Aus22, de Laat et al., 2023), and Britain and Ireland (Bonadio et al., 2025, and Chambers et al., 2025). <a href=\'https://storage.googleapis.com/project-innerspace-beta/pdf_resources/GL_Vs.pdf\' target=\'_blank\'>(For more details click here)</a>',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_s_wave_tomography_sources_v01',
                type: 'vector',
                title: 'S WAVE TOMOGRAPHY Sources',
                schema: 'subsurface',
                table: 'gl_s_wave_tomography_sources_v01',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface.gl_s_wave_tomography_sources_v01/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'subsurface.gl_s_wave_tomography_sources_v01',
                  paint: {
                    'circle-color': 'rgb(0, 17, 255)',
                    'circle-stroke-width': 0.09,
                    'circle-stroke-color': 'rgb(0, 0, 0)',
                    'circle-radius': [
                      'interpolate', ['linear'], ['zoom'], 0, 4, 5, 4, 8, 2,
                    ] as unknown as number,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: 'rgb(0, 17, 255)', label: 'Source' }],
                },
                metadata: {
                  geothermalRelevance: 'S-wave tomography reveals subsurface temperature and compositional variations that are key indicators of geothermal potential, including partial melt zones and lithospheric thinning.',
                  description: 'These tomographic models were created using Automated Multimode Inversion (AMI). AMI analyses several types of seismic waves at once, comparing real earthquake seismograms with synthetic ones to determine Earth structure. This map shows the global distribution of the earthquakes (sources) used in the inversion.',
                  citation: 'Bonadio, R., and Lebedev, S., (2026) for Project InnerSpace, building on the most recent regional tomographic models for: Africa (AF2020, Celli et al., 2020), the Middle East and Asia (ASIA2024, Dou et al., 2024), North America (NA2014 and NAT2020), South America (SACI-24, Chagas de Melo et al., 2025), Oceania (Aus22, de Laat et al., 2023), and Britain and Ireland (Bonadio et al., 2025, and Chambers et al., 2025). <a href=\'https://storage.googleapis.com/project-innerspace-beta/pdf_resources/GL_Vs.pdf\' target=\'_blank\'>(For more details click here)</a>',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_lab',
                type: 'raster',
                title: 'LAB Depth',
                schema: 'subsurface',
                table: 'gl_lab',
                source: {
                  type: 'raster',
                  tiles: [`${TILESERVER_URLS.raster}/tiles/subsurface.gl_lab/{z}/{x}/{y}.png`],
                  tileSize: 256,
                  minzoom: 3,
                  maxzoom: 7,
                },
                style: {
                  paint: {
                    'raster-opacity': 0.8,
                    'raster-color': COLOR_RAMPS.lab,
                    'raster-resampling': 'nearest',
                  },
                },
                legend: {
                  type: 'gradient',
                  min: 60,
                  max: 280,
                  unit: 'km',
                  gradient: GRADIENTS.lab,
                },
                metadata: {
                  description: 'The lithosphere-asthenosphere boundary (LAB) represents the transition from the rigid outer shell of Earth to the more ductile asthenosphere below.',
                  citation: 'WINTERC-G Global Lithosphere Model',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 0.8,
              },
              {
                id: 'gl_depth_to_moho_stephenson',
                type: 'raster',
                title: 'Depth to Moho',
                schema: 'subsurface',
                table: 'gl_depth_to_moho_stephenson',
                source: {
                  type: 'raster',
                  tiles: [`${TILESERVER_URLS.raster}/tiles/subsurface.gl_depth_to_moho_stephenson/{z}/{x}/{y}.png`],
                  tileSize: 256,
                  minzoom: 3,
                  maxzoom: 7,
                },
                style: {
                  paint: {
                    'raster-opacity': 0.8,
                    'raster-color': COLOR_RAMPS.moho,
                    'raster-resampling': 'nearest',
                  },
                },
                legend: {
                  type: 'gradient',
                  min: 0,
                  max: 80,
                  unit: 'km',
                  gradient: GRADIENTS.moho,
                },
                metadata: {
                  description: 'The Mohorovi\u010di\u0107 discontinuity (Moho) marks the boundary between Earth\'s crust and mantle.',
                  citation: 'Stephenson et al. 2023',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 0.8,
              },
              {
                id: 'gl_vs_110',
                type: 'raster',
                title: 'Shear Wave Velocity (110km)',
                schema: 'subsurface',
                table: 'gl_vs_110',
                source: {
                  type: 'raster',
                  tiles: [`${TILESERVER_URLS.raster}/tiles/subsurface.gl_vs_110/{z}/{x}/{y}.png`],
                  tileSize: 256,
                  minzoom: 3,
                  maxzoom: 7,
                },
                style: {
                  paint: {
                    'raster-opacity': 0.8,
                    'raster-color': COLOR_RAMPS.velocity,
                    'raster-resampling': 'nearest',
                  },
                },
                legend: {
                  type: 'gradient',
                  min: 4.0,
                  max: 5.0,
                  unit: 'km/s',
                  gradient: GRADIENTS.velocity,
                },
                metadata: {
                  description: 'Shear wave velocity measurements provide insights into the thermal and compositional structure of the upper mantle.',
                  citation: 'Global Seismic Tomography Model',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 0.8,
              },
            ],
          },
          // ── Thermal Model ──────────────────────────────────────
          {
            id: 'thermal-model',
            title: 'Thermal Model',
            color: '#ef4444',
            defaultExpanded: false,
            layers: [
              {
                id: 'gl_heatflow',
                type: 'vector',
                title: 'Heat Flow, IHFC',
                schema: 'subsurface',
                table: 'gl_heatflow',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface.gl_heatflow/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'subsurface.gl_heatflow',
                  paint: {
                    'circle-color': [
                      'interpolate', ['linear'], ['get', 'Heat-flow'],
                      0, 'rgb(43,131,186)',
                      50, 'rgb(171,221,164)',
                      60, 'rgb(255,255,191)',
                      80, 'rgb(253,174,97)',
                      120, 'rgb(215,25,28)',
                    ] as unknown as string,
                    'circle-opacity': 1,
                    'circle-radius': 3,
                  },
                },
                legend: {
                  type: 'gradient',
                  min: 0,
                  max: 120,
                  unit: 'mW/m\u00B2',
                  gradient: 'linear-gradient(to right, rgb(43,131,186), rgb(171,221,164), rgb(255,255,191), rgb(253,174,97), rgb(215,25,28))',
                },
                metadata: {
                  geothermalRelevance: 'Surface heat flow is a direct indicator of the thermal energy emanating from the Earth\'s interior. Regions with high surface heat flow often indicate a greater potential for geothermal resources.',
                  description: 'Compilation of global heat-flow data by the International Heat Flow Commission (IHFC) of the International Association of Seismology and Physics of the Earth\'s Interior (IASPEI). The presented data update contains data generated between 1939 and 2023.',
                  citation: 'Global Heat Flow Data Assessment Group (2024): The Global Heat Flow Database: Release 2024. GFZ Data Services. <a href=\'https://doi.org/10.5880/fidgeo.2024.014\' target=\'_blank\' rel=\'noreferrer\'>https://doi.org/10.5880/fidgeo.2024.014</a>',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_temperature_db',
                type: 'vector',
                title: 'InnerSpace Temperature Database',
                schema: 'subsurface',
                table: 'gl_temperature_db',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface.gl_temperature_db/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'subsurface.gl_temperature_db',
                  paint: {
                    'circle-opacity': 0.7,
                    'circle-radius': [
                      'interpolate', ['linear'], ['zoom'], 0, 2.5, 6, 2, 14, 1.5,
                    ] as unknown as number,
                    'circle-color': [
                      'interpolate', ['linear'],
                      ['coalesce', ['get', 'T_Correcte'], ['get', 'T_Measured']],
                      0, 'rgb(43,131,186)',
                      50, 'rgb(145,203,168)',
                      100, 'rgb(221,241,180)',
                      150, 'rgb(254,223,153)',
                      200, 'rgb(245,144,83)',
                      250, 'rgb(215,25,28)',
                    ] as unknown as string,
                  },
                },
                legend: {
                  type: 'gradient',
                  min: 0,
                  max: 250,
                  unit: '\u00B0C',
                  gradient: 'linear-gradient(to right, rgb(43,131,186), rgb(145,203,168), rgb(221,241,180), rgb(254,223,153), rgb(245,144,83), rgb(215,25,28))',
                },
                metadata: {
                  geothermalRelevance: 'By measuring the temperature at various depths, geoscientists can characterize the thermal properties of the subsurface, such as the temperature distribution with depth and the presence of thermal anomalies. This information aids in identifying favourable geothermal reservoirs for development.',
                  description: 'Raw data that was aggregated from 38 different sources referencing bottomhole temperature measurements. Both corrected and uncorrected data were collected.',
                  citation: 'InnerSpace 2024 <a href=\'https://storage.googleapis.com/project-innerspace-beta/pdf_resources/Description_TemperatureDatasets_GeoMap_20240529.pdf\' target=\'_blank\'>(Full Citation PDF)</a>',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 0.7,
              },
              {
                id: 'gl_gtg_clipped',
                type: 'raster',
                title: 'Geothermal Gradient',
                schema: 'subsurface',
                table: 'gl_gtg_clipped',
                source: {
                  type: 'raster',
                  tiles: [`${TILESERVER_URLS.raster}/tiles/subsurface.gl_gtg_clipped/{z}/{x}/{y}.png`],
                  tileSize: 256,
                  minzoom: 3,
                  maxzoom: 7,
                },
                style: {
                  paint: {
                    'raster-opacity': 0.8,
                    'raster-color': COLOR_RAMPS.thermal,
                    'raster-resampling': 'nearest',
                  },
                },
                legend: {
                  type: 'gradient',
                  min: 0,
                  max: 100,
                  unit: '\u00B0C/km',
                  gradient: GRADIENTS.thermal,
                },
                metadata: {
                  description: 'The geothermal gradient describes the rate at which temperature increases with depth in the Earth\'s crust.',
                  citation: 'Project InnerSpace Global Geothermal Gradient Map 2024',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 0.8,
              },
              {
                id: 'gl_shf_clipped',
                type: 'raster',
                title: 'Surface Heat Flow',
                schema: 'subsurface',
                table: 'gl_shf_clipped',
                source: {
                  type: 'raster',
                  tiles: [`${TILESERVER_URLS.raster}/tiles/subsurface.gl_shf_clipped/{z}/{x}/{y}.png`],
                  tileSize: 256,
                  minzoom: 3,
                  maxzoom: 7,
                },
                style: {
                  paint: {
                    'raster-opacity': 0.8,
                    'raster-color': COLOR_RAMPS.thermal,
                    'raster-resampling': 'nearest',
                  },
                },
                legend: {
                  type: 'gradient',
                  min: 0,
                  max: 150,
                  unit: 'mW/m\u00B2',
                  gradient: GRADIENTS.thermal,
                },
                metadata: {
                  description: 'Surface heat flow measures the amount of thermal energy escaping from Earth\'s interior through the surface.',
                  citation: 'WINTERC-G Model, Hasterok et al.',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 0.8,
              },
            ],
          },
          // ── Gases and Critical Minerals ────────────────────────
          {
            id: 'gases-critical-minerals',
            title: 'Gases and Critical Minerals',
            color: '#14b8a6',
            defaultExpanded: false,
            layers: [
              {
                id: 'gl_natural_hydrogen_geothermal_systems',
                type: 'vector',
                title: 'Natural Hydrogen Systems',
                schema: 'subsurface',
                table: 'gl_natural_hydrogen_geothermal_systems',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface.gl_natural_hydrogen_geothermal_systems/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'subsurface.gl_natural_hydrogen_geothermal_systems',
                  paint: {
                    'circle-radius': [
                      'interpolate', ['linear'], ['zoom'], 10, 6, 20, 3,
                    ] as unknown as number,
                    'circle-color': '#FFEA00',
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: '#FFEA00', label: 'Natural Hydrogen System' }],
                },
                metadata: {
                  geothermalRelevance: 'Combining natural hydrogen production with geothermal energy extraction is a burgeoning field of research that is garnering increasing attention from both the scientific and geothermal communities.',
                  description: 'Natural hydrogen has been found in various geological settings, with hydrogen emissions from natural geothermal systems being notably recognized in smokers along mid-ocean ridges. These occurrences are evident in volcanic gases, geysers, and hydrothermal systems linked to volcanic activity.',
                  citation: 'Zgonnik, V. The occurrence and geoscience of natural hydrogen: A comprehensive review. Earth-Sci. Rev. 2020, 203, 103140.',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_criticalmineraldepositsgeochemistrypoint',
                type: 'vector',
                title: 'Critical Mineral Deposits by Deposit Environment',
                schema: 'subsurface',
                table: 'gl_criticalmineraldepositsgeochemistrypoint',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface.gl_criticalmineraldepositsgeochemistrypoint/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'subsurface.gl_criticalmineraldepositsgeochemistrypoint',
                  paint: {
                    'circle-color': [
                      'match', ['get', 'DEPOSIT_EN'],
                      'Erosional', 'rgb(230, 220, 162)',
                      'Supergene', 'rgb(210, 116, 60)',
                      'Infiltrational', 'rgb(146, 110, 46)',
                      'Basin evaporative', 'rgb(146, 195, 226)',
                      'Basin chemical', 'rgb(49, 38, 130)',
                      'Basin hydrothermal', 'rgb(45, 80, 115)',
                      'Metamorphic hydrothermal', 'rgb(55, 116, 147)',
                      'Metamorphic', 'rgb(55, 117, 62)',
                      'Regional metasomatic', 'rgb(95, 163, 150)',
                      'Volcanic basin hydrothermal', 'rgb(161, 78, 154)',
                      'Magmatic hydrothermal', 'rgb(149, 44, 132)',
                      'Magmatic', 'rgb(149, 44, 47)',
                      'unknown', 'rgb(151, 152, 153)',
                      'rgb(200, 200, 200)',
                    ] as unknown as string,
                    'circle-stroke-color': 'rgb(0, 0, 0)',
                    'circle-stroke-width': [
                      'interpolate', ['linear'], ['zoom'], 8, 1, 10, 2,
                    ] as unknown as number,
                    'circle-radius': [
                      'interpolate', ['linear'], ['zoom'], 10, 6, 20, 3,
                    ] as unknown as number,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [
                    { color: 'rgb(230, 220, 162)', label: 'Erosional' },
                    { color: 'rgb(210, 116, 60)', label: 'Supergene' },
                    { color: 'rgb(146, 195, 226)', label: 'Basin Evaporative' },
                    { color: 'rgb(49, 38, 130)', label: 'Basin Chemical' },
                    { color: 'rgb(55, 116, 147)', label: 'Metamorphic Hydrothermal' },
                    { color: 'rgb(161, 78, 154)', label: 'Volcanic Basin Hydrothermal' },
                    { color: 'rgb(149, 44, 132)', label: 'Magmatic Hydrothermal' },
                    { color: 'rgb(149, 44, 47)', label: 'Magmatic' },
                  ],
                },
                metadata: {
                  geothermalRelevance: 'Geothermal brines can contain economically significant concentrations of critical minerals such as lithium, providing co-production opportunities that improve the economics of geothermal projects.',
                  description: 'Critical Mineral Deposits classified by deposit environment.',
                  citation: 'Critical Minerals Mapping Initiative 2024. Commonwealth of Australia (Geoscience Australia). Link: https://portal.ga.gov.au/persona/cmmi',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_usgs_npwgdv3_shape',
                type: 'vector',
                title: 'Lithium Concentration in Produced Waters',
                schema: 'subsurface',
                table: 'gl_usgs_npwgdv3_shape',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface.gl_usgs_npwgdv3_shape/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'subsurface.gl_usgs_npwgdv3_shape',
                  paint: {
                    'circle-radius': [
                      'interpolate', ['linear'], ['get', 'Li'],
                      0, 6, 0.099999, 3, 10, 6, 50, 8,
                      100, 10, 200, 10, 400, 12, 1700, 14,
                    ] as unknown as number,
                    'circle-color': [
                      'interpolate', ['linear'], ['get', 'Li'],
                      0, '#FFEA00', 0.099999, '#D22B2B', 10, '#FF5F1F', 50, '#FFAC1C',
                      100, '#40E0D0', 200, '#40E0D0', 400, '#000080', 1700, '#8B0000',
                    ] as unknown as string,
                    'circle-opacity': 1,
                  },
                },
                legend: {
                  type: 'gradient',
                  min: 0,
                  max: 1700,
                  unit: 'mg/L Li',
                  gradient: 'linear-gradient(to right, #FFEA00, #D22B2B, #FF5F1F, #FFAC1C, #40E0D0, #000080, #8B0000)',
                },
                metadata: {
                  geothermalRelevance: 'The data layer describes the concentration and distribution of lithium (mg/L) in the United States Geological Survey National Produced Waters Geochemical Database (PWGD). Geothermal brines with high lithium concentrations present co-production opportunities that can improve geothermal project economics.',
                  description: 'During hydrocarbon production, water is typically co-produced from the geologic formations producing oil and gas. Understanding the composition of these produced waters is important to help investigate the regional hydrogeology, the source of the water, the efficacy of water treatment and disposal plans, potential economic benefits of mineral commodities in the fluids, and the safety of potential sources of drinking or agricultural water.',
                  citation: 'Blondes, M.S., Knierim, K.J., Croke, M.R., Freeman, P.A., Doolan, C., Herzberg, A.S., and Shelton, J.L., 2023, U.S. Geological Survey National Produced Waters Geochemical Database (ver. 3.0, December 2023): U.S. Geological Survey data release, <a href=\'https://doi.org/10.5066/P9DSRCZJ\' target=\'_blank\' rel=\'noreferrer\'>https://doi.org/10.5066/P9DSRCZJ</a>',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 1,
              },
            ],
          },
          // ── Geothermal Sites, Projects and Plants ──────────────
          {
            id: 'geothermal-sites',
            title: 'Geothermal Sites, Projects and Plants',
            color: '#f59e0b',
            defaultExpanded: false,
            layers: [
              {
                id: 'gl_active_sites_coro_trumpy',
                type: 'vector',
                title: 'Active Geothermal Sites',
                schema: 'surface',
                table: 'gl_active_sites_coro_trumpy',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_active_sites_coro_trumpy/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'surface.gl_active_sites_coro_trumpy',
                  paint: {
                    'circle-color': 'hsl(127, 78%, 52%)',
                    'circle-radius': [
                      'interpolate', ['exponential', 2], ['zoom'], 5, 3, 15, 128,
                    ] as unknown as number,
                    'circle-opacity': 1,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: 'hsl(127, 78%, 52%)', label: 'Active Geothermal Site' }],
                },
                metadata: {
                  geothermalRelevance: 'Known active geothermal sites provide key reference points for understanding where geothermal energy is currently being exploited worldwide.',
                  description: 'IGA - Global Geothermal Energy Database.',
                  citation: 'G. Coro and Trumpy, E. 2020. Predicting geographical suitability of geothermal power plants. Journal of Cleaner Production 267 (2020) 121874',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_potential_sites_coro_trumpy',
                type: 'vector',
                title: 'Potential Geothermal Sites',
                schema: 'surface',
                table: 'gl_potential_sites_coro_trumpy',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_potential_sites_coro_trumpy/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'surface.gl_potential_sites_coro_trumpy',
                  paint: {
                    'circle-color': 'hsl(65, 87%, 57%)',
                    'circle-radius': [
                      'interpolate', ['exponential', 2], ['zoom'], 5, 3, 15, 128,
                    ] as unknown as number,
                    'circle-opacity': 1,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: 'hsl(65, 87%, 57%)', label: 'Potential Geothermal Site' }],
                },
                metadata: {
                  geothermalRelevance: 'Potential geothermal sites highlight areas where geothermal development may be feasible based on geological and environmental factors.',
                  description: 'IGA - Global Geothermal Energy Database.',
                  citation: 'G. Coro and Trumpy, E. 2020. Predicting geographical suitability of geothermal power plants. Journal of Cleaner Production 267 (2020) 121874',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_gem_geothermal_plant_tracker_52024',
                type: 'vector',
                title: 'Geothermal Plants (Global Energy Monitor)',
                schema: 'surface',
                table: 'gl_gem_geothermal_plant_tracker_52024',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_gem_geothermal_plant_tracker_52024/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'surface.gl_gem_geothermal_plant_tracker_52024',
                  paint: {
                    'circle-color': 'hsl(127, 78%, 52%)',
                    'circle-stroke-color': 'hsl(127, 78%, 52%)',
                    'circle-radius': 5,
                    'circle-opacity': 1,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: 'hsl(127, 78%, 52%)', label: 'Geothermal Plant (GEM)' }],
                },
                metadata: {
                  geothermalRelevance: 'Tracking operating and planned geothermal power plants provides insight into global geothermal capacity and development trends.',
                  description: 'The Global Geothermal Power Tracker (GGtPT) is a worldwide dataset of geothermal power facilities. The GGtPT includes geothermal power plant units with capacities of 30 megawatts (MW) or more, and catalogs every geothermal power plant unit at this capacity threshold of any status, including operating, announced, pre-construction, under construction, shelved, cancelled, mothballed, or retired.',
                  citation: 'Global Energy Monitor, Global Geothermal Power Tracker, May 2024 Release',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_power_plant_database_geothermal',
                type: 'vector',
                title: 'Geothermal Plants (Global Power Plants)',
                schema: 'surface',
                table: 'gl_power_plant_database',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_power_plant_database/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'surface.gl_power_plant_database',
                  paint: {
                    'circle-stroke-color': '#000000',
                    'circle-radius': [
                      'match', ['get', 'primary_fuel'], 'Geothermal', 4, 0,
                    ] as unknown as number,
                    'circle-color': [
                      'match', ['get', 'primary_fuel'], 'Geothermal', '#FF5F15', '#FF0000',
                    ] as unknown as string,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: '#FF5F15', label: 'Geothermal Power Plant' }],
                },
                metadata: {
                  geothermalRelevance: 'Understanding the global distribution of geothermal power plants helps identify regions with proven geothermal resources and established infrastructure.',
                  description: 'The Global Power Plant Database is an open-source open-access dataset of grid-scale (1 MW and greater) electricity generating facilities operating across the world. The Database currently contains nearly 35000 power plants in 167 countries, representing about 72% of the world\'s capacity.',
                  citation: 'Global Energy Observatory, Google, KTH Royal Institute of Technology in Stockholm, Enipedia, World Resources Institute. 2019. <a href=\'https://www.wri.org/research/global-database-power-plants\' target=\'_blank\' rel=\'noreferrer\'>Global Database of Power Plants</a>.',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_gem_geothermal_plant_tracker_below_thr_52024',
                type: 'vector',
                title: 'Below Threshold Geothermal Plants',
                schema: 'surface',
                table: 'gl_gem_geothermal_plant_tracker_below_thr_52024',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/surface.gl_gem_geothermal_plant_tracker_below_thr_52024/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'surface.gl_gem_geothermal_plant_tracker_below_thr_52024',
                  paint: {
                    'circle-radius': 5,
                    'circle-color': 'hsl(65, 87%, 57%)',
                    'circle-stroke-color': 'hsl(65, 87%, 57%)',
                    'circle-opacity': 1,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: 'hsl(65, 87%, 57%)', label: 'Below Threshold Plant' }],
                },
                metadata: {
                  geothermalRelevance: 'Below-threshold geothermal plants represent smaller-scale facilities that can serve local energy needs and demonstrate geothermal viability in diverse geological settings.',
                  description: 'The Global Geothermal Power Tracker (GGtPT) includes \'Below Threshold\' geothermal power plant units with capacities between 1 megawatt (MW) and 30 megawatts (MW), and catalogs every geothermal power plant unit at this capacity threshold of any status, including operating, announced, pre-construction, under construction, shelved, cancelled, mothballed, or retired.',
                  citation: 'Global Energy Monitor, Global Geothermal Power Tracker, May 2024 Release',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 1,
              },
            ],
          },
        ],
      },
    ],
  },
  // ── UK Module ──────────────────────────────────────────────────
  {
    id: 'uk-module',
    title: 'UK Module',
    color: '#3b82f6',
    defaultExpanded: false,
    children: [
      {
        id: 'uk-subsurface',
        title: 'Subsurface',
        color: '#6366f1',
        defaultExpanded: false,
        layers: [
              {
                id: 'uk_granites_and_buriedgranites_v02',
                type: 'vector',
                title: 'Granite',
                schema: 'subsurface_regional',
                table: 'uk_granites_and_buriedgranites',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface_regional.uk_granites_and_buriedgranites/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'fill',
                  sourceLayer: 'subsurface_regional.uk_granites_and_buriedgranites',
                  paint: {
                    'fill-opacity': 0.7,
                    'fill-color': [
                      'match', ['get', 'Name'],
                      'Buried', 'rgb(255, 255, 255)',
                      'rgb(255, 0, 0)',
                    ] as unknown as string,
                    'fill-outline-color': [
                      'match', ['get', 'Name'],
                      'Buried', 'rgb(255, 0, 0)',
                      'rgb(255, 0, 0)',
                    ] as unknown as string,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [
                    { color: 'rgb(255, 0, 0)', label: 'Exposed Granite' },
                    { color: 'rgb(255, 255, 255)', label: 'Buried Granite' },
                  ],
                },
                metadata: {
                  geothermalRelevance: 'The British Geological Survey (BGS) and the Geological Survey of Northern Ireland (GSNI) are the primary custodians of national subsurface datasets. Many of these datasets were initially acquired by the hydrocarbon and coal industries and have subsequently been repurposed for geothermal exploration.',
                  description: 'Distribution of granitic intrusions across the UK. Granites shown include key geothermal targets such as the Cornubian Batholith, Weardale Granite, Mourne Mountains, and Caledonian granites of Scotland.',
                  citation: 'Exposed and Buried Granites from BGS (625k_V5_Geology_UK_EPSG27700 and Abesser et al., 2023).',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 0.7,
              },
              {
                id: 'uk_superficial_geology',
                type: 'vector',
                title: 'Superficial Geology',
                schema: 'subsurface_regional',
                table: 'uk_superficial_geology',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface_regional.uk_superficial_geology/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'fill',
                  sourceLayer: 'subsurface_regional.uk_superficial_geology',
                  paint: {
                    'fill-opacity': 0.7,
                    'fill-color': [
                      'match', ['get', 'ROCK'],
                      'CLAY', '#f02218',
                      'CLSS', '#d35ea6',
                      'DMTN', '#44dbb0',
                      'PEAT', '#65b2e2',
                      'SAND', '#b851e1',
                      'SAGR', '#abf035',
                      'SILT', '#e6c165',
                      'UNKN', '#4037e0',
                      '#000000',
                    ] as unknown as string,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [
                    { color: '#f02218', label: 'Clay' },
                    { color: '#d35ea6', label: 'Clay/Silt/Sand' },
                    { color: '#44dbb0', label: 'Diamicton' },
                    { color: '#65b2e2', label: 'Peat' },
                    { color: '#b851e1', label: 'Sand' },
                    { color: '#abf035', label: 'Sand/Gravel' },
                    { color: '#e6c165', label: 'Silt' },
                  ],
                },
                metadata: {
                  geothermalRelevance: 'Superficial geology influences shallow geothermal systems, including ground-source heat pump installations and aquifer thermal energy storage (ATES) potential.',
                  description: 'UK superficial geology deposits.',
                  citation: '<a href=\'https://www.bgs.ac.uk/datasets/bgs-geology-625k/\' target=\'_blank\' rel=\'noreferrer\'>BGS Geology 625K - British Geological Survey</a>',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 0.7,
              },
              {
                id: 'uk_dykes',
                type: 'vector',
                title: 'UK Dykes',
                schema: 'subsurface_regional',
                table: 'uk_dykes',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface_regional.uk_dykes/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'fill',
                  sourceLayer: 'subsurface_regional.uk_dykes',
                  paint: {
                    'fill-opacity': 0.7,
                    'fill-color': 'rgb(255, 69, 0)',
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: 'rgb(255, 69, 0)', label: 'Dyke' }],
                },
                metadata: {
                  geothermalRelevance: 'The British Geological Survey (BGS) and the Geological Survey of Northern Ireland (GSNI) are the primary custodians of national subsurface datasets. Dyke intrusions can influence local heat flow patterns and subsurface permeability.',
                  description: 'UK dyke intrusions.',
                  citation: 'https://www.bgs.ac.uk/map-viewers/geoindex-onshore/',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 0.7,
              },
              {
                id: 'ni_dykes',
                type: 'vector',
                title: 'Northern Ireland Dykes',
                schema: 'subsurface_regional',
                table: 'ni_dykes',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface_regional.ni_dykes/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'line',
                  sourceLayer: 'subsurface_regional.ni_dykes',
                  paint: {
                    'line-color': 'rgb(255, 69, 0)',
                    'line-width': 1,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: 'rgb(255, 69, 0)', label: 'NI Dyke' }],
                },
                metadata: {
                  geothermalRelevance: 'Palaeogene dyke swarms in Northern Ireland are associated with the Icelandic plume-related magmatism and can influence local geothermal gradients.',
                  description: 'Palaeogene dyke swarms in Northern Ireland.',
                  citation: 'Cooper, M. R., Anderson, H., Walsh, J. J., van Dam, C. L., Young, M. E., Earls, G., & Walker, A. (2012). Palaeogene Alpine tectonics and Icelandic plume-related magmatism and deformation in Northern Ireland. Geological Survey of Northern Ireland, University College Dublin, and British Geological Survey.',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'ni_uk3d_boreholes_v3_3_3d_wgs84',
                type: 'vector',
                title: 'Boreholes Northern Ireland',
                schema: 'subsurface_regional',
                table: 'ni_uk3d_boreholes_v3_3_3d_wgs84',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface_regional.ni_uk3d_boreholes_v3_3_3d_wgs84/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'subsurface_regional.ni_uk3d_boreholes_v3_3_3d_wgs84',
                  paint: {
                    'circle-color': 'blue',
                    'circle-stroke-color': 'blue',
                    'circle-opacity': 0.7,
                    'circle-radius': 4,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: 'blue', label: 'Borehole (NI)' }],
                },
                metadata: {
                  geothermalRelevance: 'BGS UK Digital Geothermal Catalogue: The data is a first digital release of the UK legacy geothermal catalogue of temperature measurements, thermal conductivity measurements and heat flow calculations. The geothermal catalogue comprises data from the 1977-1991 Geothermal Energy Programme.',
                  description: 'Northern Ireland boreholes from UK3D model.',
                  citation: 'BGS Legacy Geothermal Platform: This resource has been made available under the Open Government Licence (OGL). Contains data supplied by Natural Environment Research Council.',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 0.7,
              },
              {
                id: 'uk_wgs84uk3d_boreholes_v2015',
                type: 'vector',
                title: 'Boreholes GB',
                schema: 'subsurface_regional',
                table: 'uk_wgs84uk3d_boreholes_v2015',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface_regional.uk_wgs84uk3d_boreholes_v2015/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'circle',
                  sourceLayer: 'subsurface_regional.uk_wgs84uk3d_boreholes_v2015',
                  paint: {
                    'circle-color': 'red',
                    'circle-stroke-color': 'red',
                    'circle-opacity': 0.7,
                    'circle-radius': 4,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: 'red', label: 'Borehole (GB)' }],
                },
                metadata: {
                  geothermalRelevance: 'BGS UK Digital Geothermal Catalogue: The data is a first digital release of the UK legacy geothermal catalogue of temperature measurements, thermal conductivity measurements and heat flow calculations. The geothermal catalogue comprises data from the 1977-1991 Geothermal Energy Programme.',
                  description: 'Records of all onshore (or near shore) boreholes, trial pits, shafts and wells held in the BGS archives. The records range from simple single page lithological logs through to hydrocarbon completion reports. Current collection over 1 million records covering the whole of Great Britain.',
                  citation: 'BGS Legacy Geothermal Platform: This resource has been made available under the Open Government Licence (OGL). Contains data supplied by Natural Environment Research Council.',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 0.7,
              },
              {
                id: 'uk_faults',
                type: 'vector',
                title: 'UK Faults',
                schema: 'subsurface_regional',
                table: 'uk_faults',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface_regional.uk_faults/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'line',
                  sourceLayer: 'subsurface_regional.uk_faults',
                  paint: {
                    'line-color': 'rgb(11, 10, 10)',
                    'line-width': 2,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: 'rgb(11, 10, 10)', label: 'Fault' }],
                },
                metadata: {
                  geothermalRelevance: 'The British Geological Survey (BGS) is the primary custodian of national subsurface datasets. Fault mapping is critical for geothermal exploration as faults can act as conduits or barriers to fluid flow.',
                  description: 'BGS Fault Database: 1:625,000 scale.',
                  citation: 'Source: BGS <a href=\'https://www.bgs.ac.uk/download/bgs-geology-625k-bedrock/\' target=\'_blank\' rel=\'noreferrer\'>https://www.bgs.ac.uk/download/bgs-geology-625k-bedrock/</a>',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gb_coal_resources_for_new_technologies_gb',
                type: 'vector',
                title: 'Onshore Coal Mines',
                schema: 'subsurface_regional',
                table: 'gb_coal_resources_for_new_technologies_gb',
                source: {
                  type: 'vector',
                  tiles: [`${TILESERVER_URLS.vector}/subsurface_regional.gb_coal_resources_for_new_technologies_gb/{z}/{x}/{y}.pbf`],
                },
                style: {
                  type: 'fill',
                  sourceLayer: 'subsurface_regional.gb_coal_resources_for_new_technologies_gb',
                  paint: {
                    'fill-opacity': 0.7,
                    'fill-color': '#b688bd',
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: '#b688bd', label: 'Coal Resource' }],
                },
                metadata: {
                  geothermalRelevance: 'Abandoned coal mines present opportunities for mine water geothermal energy, where flooded mine workings can serve as low-enthalpy heat sources for district heating schemes.',
                  description: 'This legacy dataset contains a series of maps showing the potential of the UK onshore coal resources for exploitation by both conventional (mining) and new technologies. The data available here is a facsimile of the maps that were originally published in 2004.',
                  citation: 'Coal resources for new technologies coverage. BGS UKRI - Contains OS data Crown copyright 2020.',
                },
                permissions: { visibility: 'public', allowedCompanies: [] },
                defaultVisible: false,
                defaultOpacity: 0.7,
              },
            ],
          },
    ],
  },
];

// Build CSS linear-gradient from color stops
export function colorStopsToGradient(stops: { position: number; color: string }[]): string {
  if (stops.length === 0) return 'linear-gradient(to right, #ccc, #ccc)';
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const parts = sorted.map((s) => `${s.color} ${(s.position * 100).toFixed(1)}%`);
  return `linear-gradient(to right, ${parts.join(', ')})`;
}

// Flatten group tree into id/title pairs for group selector
export function getAllGroupIds(): { id: string; title: string; path: string }[] {
  const result: { id: string; title: string; path: string }[] = [];
  function walk(groups: LayerGroup[], parentPath = '') {
    for (const g of groups) {
      const path = parentPath ? `${parentPath} > ${g.title}` : g.title;
      result.push({ id: g.id, title: g.title, path });
      if (g.children) walk(g.children, path);
    }
  }
  walk(LAYER_GROUPS);
  return result;
}

// Helper function to flatten all layers for easy lookup
export function getAllLayers(): LayerConfig[] {
  const layers: LayerConfig[] = [];

  function extractLayers(groups: LayerGroup[]) {
    for (const group of groups) {
      if (group.layers) {
        layers.push(...group.layers);
      }
      if (group.children) {
        extractLayers(group.children);
      }
    }
  }

  extractLayers(LAYER_GROUPS);
  return layers;
}

// Helper function to find a layer by ID
export function getLayerById(id: string): LayerConfig | undefined {
  return getAllLayers().find((layer) => layer.id === id);
}
