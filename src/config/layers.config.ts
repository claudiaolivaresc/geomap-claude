import type { LayerGroup, LayerConfig } from '@/types';
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
};

// Gradient strings for legend display
export const GRADIENTS: Record<string, string> = {
  thermal: 'linear-gradient(to right, #313695, #4575b4, #74add1, #abd9e9, #e0f3f8, #ffffbf, #fee090, #fdae61, #f46d43, #d73027, #a50026)',
  lab: 'linear-gradient(to right, #e9dde0, #e9c7cf, #e9a6a9, #e97775, #eba983, #ede594, #bff05e, #17dac3, #12cee8, #71c4eb, #3b6fd0, #242cb6)',
  moho: 'linear-gradient(to right, #ffffcc, #ffeda0, #fed976, #feb24c, #fd8d3c, #fc4e2a, #e31a1c, #bd0026, #800026)',
  velocity: 'linear-gradient(to right, #d73027, #f46d43, #fdae61, #fee090, #e0f3f8, #abd9e9, #74add1, #4575b4, #313695)',
};

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
    ],
  },
  {
    id: 'subsurface',
    title: 'Subsurface Data',
    icon: '🔥',
    color: '#f59e0b',
    defaultExpanded: true,
    children: [
      {
        id: 'thermal-model',
        title: 'Thermal Model',
        icon: '🌡️',
        color: '#ef4444',
        defaultExpanded: true,
        layers: [
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
              unit: '°C/km',
              gradient: GRADIENTS.thermal,
            },
            metadata: {
              description: 'The geothermal gradient describes the rate at which temperature increases with depth in the Earth\'s crust. Higher gradients indicate more favorable conditions for geothermal energy development.',
              citation: 'Project InnerSpace Global Geothermal Gradient Map 2024',
            },
            permissions: {
              visibility: 'public',
              allowedCompanies: [],
            },
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
              unit: 'mW/m²',
              gradient: GRADIENTS.thermal,
            },
            metadata: {
              description: 'Surface heat flow measures the amount of thermal energy escaping from Earth\'s interior through the surface. It is a key indicator for geothermal resource potential.',
              citation: 'WINTERC-G Model, Hasterok et al.',
            },
            permissions: {
              visibility: 'public',
              allowedCompanies: [],
            },
            defaultVisible: false,
            defaultOpacity: 0.8,
          },
        ],
      },
      {
        id: 'heat-source-proximity',
        title: 'Heat Source Proximity',
        icon: '🎯',
        color: '#8b5cf6',
        defaultExpanded: false,
        layers: [
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
            permissions: {
              visibility: 'public',
              allowedCompanies: [],
            },
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
              description: 'The Mohorovičić discontinuity (Moho) marks the boundary between Earth\'s crust and mantle.',
              citation: 'Stephenson et al. 2023',
            },
            permissions: {
              visibility: 'public',
              allowedCompanies: [],
            },
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
            permissions: {
              visibility: 'public',
              allowedCompanies: [],
            },
            defaultVisible: false,
            defaultOpacity: 0.8,
          },
        ],
      },
    ],
  },
  {
    id: 'structural',
    title: 'Structural / Tectonic',
    icon: '⚡',
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
            'line-color': 'rgb(195, 19, 19)',
            'line-width': 2,
            'line-opacity': 1,
          },
        },
        legend: {
          type: 'symbol',
          items: [{ color: 'rgb(195, 19, 19)', label: 'Plate Boundary' }],
        },
        metadata: {
          description: 'Tectonic plate boundaries are zones of intense geological activity where plates interact.',
          citation: 'Hasterok et al. Plate Boundary Database',
        },
        permissions: {
          visibility: 'public',
          allowedCompanies: [],
        },
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
            'line-color': 'rgb(255, 140, 0)',
            'line-width': 1.5,
            'line-opacity': 1,
          },
        },
        legend: {
          type: 'symbol',
          items: [{ color: 'rgb(255, 140, 0)', label: 'Active Fault' }],
        },
        metadata: {
          description: 'Active faults can serve as pathways for geothermal fluids and enhance heat transfer within the crust.',
          citation: 'Project InnerSpace Active Fault Database 2025',
        },
        permissions: {
          visibility: 'public',
          allowedCompanies: [],
        },
        defaultVisible: false,
        defaultOpacity: 1,
      },
      {
        id: 'gl_heatflow',
        type: 'vector',
        title: 'Heat Flow Measurements',
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
            'circle-radius': 4,
            'circle-color': '#FF0000',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#FFFFFF',
            'circle-opacity': 0.7,
          },
        },
        legend: {
          type: 'symbol',
          items: [{ color: '#FF0000', label: 'Heat Flow Point' }],
        },
        metadata: {
          description: 'Direct measurements of heat flow from boreholes and other sources.',
          citation: 'International Heat Flow Commission Database',
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
