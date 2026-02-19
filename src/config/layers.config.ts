import type { LayerGroup, LayerConfig } from '@/types';
import { TILESERVER_URLS } from './map.config';

// Color ramps for raster layers (normalized 0-1 values)
const COLOR_RAMPS = {
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
const GRADIENTS = {
  thermal: 'linear-gradient(to right, #313695, #4575b4, #74add1, #abd9e9, #e0f3f8, #ffffbf, #fee090, #fdae61, #f46d43, #d73027, #a50026)',
  lab: 'linear-gradient(to right, #e9dde0, #e9c7cf, #e9a6a9, #e97775, #eba983, #ede594, #bff05e, #17dac3, #12cee8, #71c4eb, #3b6fd0, #242cb6)',
  moho: 'linear-gradient(to right, #ffffcc, #ffeda0, #fed976, #feb24c, #fd8d3c, #fc4e2a, #e31a1c, #bd0026, #800026)',
  velocity: 'linear-gradient(to right, #d73027, #f46d43, #fdae61, #fee090, #e0f3f8, #abd9e9, #74add1, #4575b4, #313695)',
};

export const LAYER_GROUPS: LayerGroup[] = [
  {
    id: 'surface',
    title: 'Surface Data',
    icon: '🌍',
    color: '#10b981',
    defaultExpanded: true,
    children: [
      // ── Geothermal ──────────────────────────────────────────
      {
        id: 'geothermal-surface',
        title: 'Geothermal',
        color: '#10b981',
        defaultExpanded: true,
        layers: [
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
                'circle-radius': 6,
                'circle-color': '#10b981',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
                'circle-opacity': 0.9,
              },
            },
            legend: {
              type: 'symbol',
              items: [{ color: '#10b981', label: 'Geothermal Plant' }],
            },
            metadata: {
              description: 'Operating and planned geothermal power plants worldwide.',
              citation: 'Global Energy Monitor, May 2024',
              source: 'GEM Geothermal Plant Tracker',
            },
            permissions: {
              requiresAuth: false,
              allowedRoles: ['public', 'free', 'premium', 'admin'],
            },
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
                'circle-color': '#6ee7b7',
                'circle-stroke-width': 1,
                'circle-stroke-color': '#ffffff',
                'circle-opacity': 0.8,
              },
            },
            legend: {
              type: 'symbol',
              items: [{ color: '#6ee7b7', label: 'Geothermal (Below Threshold)' }],
            },
            metadata: {
              description: 'Geothermal power plants below the capacity threshold.',
              citation: 'Global Energy Monitor, May 2024',
            },
            permissions: {
              requiresAuth: false,
              allowedRoles: ['free', 'premium', 'admin'],
            },
            defaultVisible: false,
            defaultOpacity: 1,
          },
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
                'circle-radius': 5,
                'circle-color': '#059669',
                'circle-stroke-width': 1,
                'circle-stroke-color': '#ffffff',
                'circle-opacity': 0.8,
              },
            },
            legend: {
              type: 'symbol',
              items: [{ color: '#059669', label: 'Active Geothermal Site' }],
            },
            metadata: {
              description: 'Active geothermal sites identified by Coro & Trumpy.',
              citation: 'Coro & Trumpy Global Geothermal Database',
            },
            permissions: {
              requiresAuth: false,
              allowedRoles: ['free', 'premium', 'admin'],
            },
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
                'circle-radius': 5,
                'circle-color': '#a7f3d0',
                'circle-stroke-width': 1,
                'circle-stroke-color': '#059669',
                'circle-opacity': 0.8,
              },
            },
            legend: {
              type: 'symbol',
              items: [{ color: '#a7f3d0', label: 'Potential Geothermal Site' }],
            },
            metadata: {
              description: 'Potential geothermal sites identified by Coro & Trumpy.',
              citation: 'Coro & Trumpy Global Geothermal Database',
            },
            permissions: {
              requiresAuth: false,
              allowedRoles: ['free', 'premium', 'admin'],
            },
            defaultVisible: false,
            defaultOpacity: 1,
          },
        ],
      },
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
              items: [{ color: '#374151', label: 'Country Border' }],
            },
            metadata: {
              description: 'World country boundaries.',
              citation: 'ESRI World Countries',
            },
            permissions: {
              requiresAuth: false,
              allowedRoles: ['public', 'free', 'premium', 'admin'],
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
            },
            style: {
              type: 'fill',
              sourceLayer: 'surface.gl_wdpa_jun2025_poly_and_points_and_india_indone',
              paint: {
                'fill-color': '#60b638',
                'fill-outline-color': '#008614',
                'fill-opacity': 0.5,
              },
            },
            legend: {
              type: 'symbol',
              items: [{ color: '#60b638', label: 'Protected Area' }],
            },
            metadata: {
              description: 'World Database on Protected Areas - protected land and marine areas worldwide.',
              citation: 'WDPA, June 2025',
            },
            permissions: {
              requiresAuth: false,
              allowedRoles: ['public', 'free', 'premium', 'admin'],
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
        children: [
          {
            id: 'power-generation',
            title: 'Power Generation',
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
                    'circle-radius': 4,
                    'circle-color': '#f59e0b',
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#000000',
                    'circle-opacity': 0.7,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: '#f59e0b', label: 'Power Plant' }],
                },
                metadata: {
                  description: 'Global database of power plant locations and capacities.',
                  citation: 'Global Power Plant Database, 2024',
                },
                permissions: {
                  requiresAuth: false,
                  allowedRoles: ['free', 'premium', 'admin'],
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
                    'circle-radius': 4,
                    'circle-color': '#8b5cf6',
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#000000',
                    'circle-opacity': 0.7,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: '#8b5cf6', label: 'Integrated Power' }],
                },
                metadata: {
                  description: 'GEM integrated power generation tracker covering multiple fuel types.',
                  citation: 'Global Energy Monitor, July 2024',
                },
                permissions: {
                  requiresAuth: false,
                  allowedRoles: ['free', 'premium', 'admin'],
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
                    'circle-radius': 4,
                    'circle-color': '#78716c',
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#000000',
                    'circle-opacity': 0.7,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: '#78716c', label: 'Oil & Gas Plant' }],
                },
                metadata: {
                  description: 'Oil and gas power plant locations worldwide.',
                  citation: 'Global Energy Monitor, May 2024',
                },
                permissions: {
                  requiresAuth: false,
                  allowedRoles: ['free', 'premium', 'admin'],
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
                    'circle-radius': 4,
                    'circle-color': '#44403c',
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#000000',
                    'circle-opacity': 0.7,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: '#44403c', label: 'Coal Plant' }],
                },
                metadata: {
                  description: 'Coal power plant locations and status worldwide.',
                  citation: 'Global Energy Monitor, April 2024',
                },
                permissions: {
                  requiresAuth: false,
                  allowedRoles: ['free', 'premium', 'admin'],
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
                    'circle-radius': 5,
                    'circle-color': '#7c3aed',
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#000000',
                    'circle-opacity': 0.8,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: '#7c3aed', label: 'Nuclear Plant' }],
                },
                metadata: {
                  description: 'Nuclear power plant locations and status worldwide.',
                  citation: 'Global Energy Monitor, May 2024',
                },
                permissions: {
                  requiresAuth: false,
                  allowedRoles: ['free', 'premium', 'admin'],
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
                    'circle-radius': 4,
                    'circle-color': '#06b6d4',
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#000000',
                    'circle-opacity': 0.7,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: '#06b6d4', label: 'Wind Farm' }],
                },
                metadata: {
                  description: 'Wind farm locations worldwide.',
                  citation: 'Global Energy Monitor',
                },
                permissions: {
                  requiresAuth: false,
                  allowedRoles: ['free', 'premium', 'admin'],
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
                    'circle-radius': 4,
                    'circle-color': '#FFC000',
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#000000',
                    'circle-opacity': 0.7,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: '#FFC000', label: 'Solar Installation' }],
                },
                metadata: {
                  description: 'Solar power installation locations worldwide.',
                  citation: 'Global Solar Database',
                },
                permissions: {
                  requiresAuth: false,
                  allowedRoles: ['free', 'premium', 'admin'],
                },
                defaultVisible: false,
                defaultOpacity: 1,
              },
            ],
          },
          {
            id: 'oil-gas-transmission',
            title: 'Oil & Gas Transmission',
            color: '#f97316',
            defaultExpanded: false,
            layers: [
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
                  description: 'Global gas pipeline infrastructure.',
                  citation: 'Global Energy Monitor GGIT, December 2023',
                },
                permissions: {
                  requiresAuth: false,
                  allowedRoles: ['free', 'premium', 'admin'],
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
                    'circle-radius': 5,
                    'circle-color': '#ea580c',
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#000000',
                    'circle-opacity': 0.8,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: '#ea580c', label: 'LNG Terminal' }],
                },
                metadata: {
                  description: 'LNG terminal locations worldwide.',
                  citation: 'Global Energy Monitor GGIT, January 2024',
                },
                permissions: {
                  requiresAuth: false,
                  allowedRoles: ['free', 'premium', 'admin'],
                },
                defaultVisible: false,
                defaultOpacity: 1,
              },
            ],
          },
          {
            id: 'power-grid',
            title: 'Power Grid',
            color: '#eab308',
            defaultExpanded: false,
            layers: [
              {
                id: 'gl_arderne',
                type: 'vector',
                title: 'Power Lines',
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
                  description: 'Predicted power line network based on Arderne et al. model.',
                  citation: 'Arderne et al. 2020',
                },
                permissions: {
                  requiresAuth: false,
                  allowedRoles: ['free', 'premium', 'admin'],
                },
                defaultVisible: false,
                defaultOpacity: 1,
              },
              {
                id: 'gl_osm_power_lines_20231003',
                type: 'vector',
                title: 'Power Lines',
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
                  description: 'Power transmission lines from OpenStreetMap.',
                  citation: 'OpenStreetMap Contributors, October 2023',
                },
                permissions: {
                  requiresAuth: false,
                  allowedRoles: ['free', 'premium', 'admin'],
                },
                defaultVisible: false,
                defaultOpacity: 1,
              },
            ],
          },
          {
            id: 'boreholes-surveys',
            title: 'Boreholes & Surveys',
            color: '#3b82f6',
            defaultExpanded: false,
            layers: [
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
                    'circle-radius': 4,
                    'circle-color': '#3b82f6',
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#ffffff',
                    'circle-opacity': 0.7,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: '#3b82f6', label: 'Borehole' }],
                },
                metadata: {
                  description: 'Borehole locations providing subsurface temperature and geological data.',
                  citation: 'Various sources compiled by Project InnerSpace',
                },
                permissions: {
                  requiresAuth: false,
                  allowedRoles: ['public', 'free', 'premium', 'admin'],
                },
                defaultVisible: false,
                defaultOpacity: 1,
              },
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
                  description: '2D seismic survey paths worldwide.',
                  citation: 'MapStand',
                },
                permissions: {
                  requiresAuth: false,
                  allowedRoles: ['free', 'premium', 'admin'],
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
                    'fill-opacity': 0.5,
                  },
                },
                legend: {
                  type: 'symbol',
                  items: [{ color: '#0E4C92', label: '3D Seismic Survey' }],
                },
                metadata: {
                  description: '3D seismic survey coverage areas worldwide.',
                  citation: 'MapStand',
                },
                permissions: {
                  requiresAuth: false,
                  allowedRoles: ['free', 'premium', 'admin'],
                },
                defaultVisible: false,
                defaultOpacity: 0.7,
              },
            ],
          },
        ],
      },
      // ── Energy Demand & Production ──────────────────────────
      {
        id: 'energy-demand',
        title: 'Energy Demand & Production',
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
                'fill-color': '#ec4899',
                'fill-outline-color': '#9d174d',
                'fill-opacity': 0.4,
              },
            },
            legend: {
              type: 'symbol',
              items: [{ color: '#ec4899', label: 'Energy Demand/Production' }],
            },
            metadata: {
              description: 'Global energy demand and production by country.',
              citation: 'IEA / Project InnerSpace',
            },
            permissions: {
              requiresAuth: false,
              allowedRoles: ['free', 'premium', 'admin'],
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
                'fill-color': '#f472b6',
                'fill-outline-color': '#9d174d',
                'fill-opacity': 0.4,
              },
            },
            legend: {
              type: 'symbol',
              items: [{ color: '#f472b6', label: 'Energy Supply 2023' }],
            },
            metadata: {
              description: 'Global energy supply data for 2023.',
              citation: 'IEA / Project InnerSpace',
            },
            permissions: {
              requiresAuth: false,
              allowedRoles: ['free', 'premium', 'admin'],
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
                'fill-color': '#be185d',
                'fill-outline-color': '#831843',
                'fill-opacity': 0.4,
              },
            },
            legend: {
              type: 'symbol',
              items: [{ color: '#be185d', label: 'Energy Supply / GDP' }],
            },
            metadata: {
              description: 'Total energy supply per unit of GDP by country.',
              citation: 'IEA / Project InnerSpace',
            },
            permissions: {
              requiresAuth: false,
              allowedRoles: ['free', 'premium', 'admin'],
            },
            defaultVisible: false,
            defaultOpacity: 0.7,
          },
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
                'fill-color': '#0ea5e9',
                'fill-outline-color': '#0369a1',
                'fill-opacity': 0.4,
              },
            },
            legend: {
              type: 'symbol',
              items: [{ color: '#0ea5e9', label: 'Water Demand' }],
            },
            metadata: {
              description: 'Water demand by country for geothermal resource assessment.',
              citation: 'Project InnerSpace',
            },
            permissions: {
              requiresAuth: false,
              allowedRoles: ['free', 'premium', 'admin'],
            },
            defaultVisible: false,
            defaultOpacity: 0.7,
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
            },
            style: {
              paint: {
                'raster-opacity': 0.8,
                'raster-color': COLOR_RAMPS.thermal,
                'raster-color-range': [0, 100],
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
              requiresAuth: true,
              allowedRoles: ['premium', 'admin'],
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
            },
            style: {
              paint: {
                'raster-opacity': 0.8,
                'raster-color': COLOR_RAMPS.thermal,
                'raster-color-range': [0, 150],
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
              requiresAuth: true,
              allowedRoles: ['premium', 'admin'],
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
            },
            style: {
              paint: {
                'raster-opacity': 0.8,
                'raster-color': COLOR_RAMPS.lab,
                'raster-color-range': [60, 280],
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
              requiresAuth: true,
              allowedRoles: ['premium', 'admin'],
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
            },
            style: {
              paint: {
                'raster-opacity': 0.8,
                'raster-color': COLOR_RAMPS.moho,
                'raster-color-range': [0, 80],
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
              requiresAuth: true,
              allowedRoles: ['premium', 'admin'],
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
            },
            style: {
              paint: {
                'raster-opacity': 0.8,
                'raster-color': COLOR_RAMPS.velocity,
                'raster-color-range': [4.0, 5.0],
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
              requiresAuth: true,
              allowedRoles: ['premium', 'admin'],
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
            'line-color': '#dc2626',
            'line-width': 2,
            'line-opacity': 1,
          },
        },
        legend: {
          type: 'symbol',
          items: [{ color: '#dc2626', label: 'Plate Boundary' }],
        },
        metadata: {
          description: 'Tectonic plate boundaries are zones of intense geological activity where plates interact.',
          citation: 'Hasterok et al. Plate Boundary Database',
        },
        permissions: {
          requiresAuth: false,
          allowedRoles: ['public', 'free', 'premium', 'admin'],
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
            'line-color': '#f97316',
            'line-width': 1.5,
            'line-opacity': 0.8,
          },
        },
        legend: {
          type: 'symbol',
          items: [{ color: '#f97316', label: 'Active Fault' }],
        },
        metadata: {
          description: 'Active faults can serve as pathways for geothermal fluids and enhance heat transfer within the crust.',
          citation: 'Project InnerSpace Active Fault Database 2025',
        },
        permissions: {
          requiresAuth: false,
          allowedRoles: ['free', 'premium', 'admin'],
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
            'circle-color': '#ef4444',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': 0.7,
          },
        },
        legend: {
          type: 'symbol',
          items: [{ color: '#ef4444', label: 'Heat Flow Point' }],
        },
        metadata: {
          description: 'Direct measurements of heat flow from boreholes and other sources.',
          citation: 'International Heat Flow Commission Database',
        },
        permissions: {
          requiresAuth: false,
          allowedRoles: ['free', 'premium', 'admin'],
        },
        defaultVisible: false,
        defaultOpacity: 1,
      },
    ],
  },
];

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
