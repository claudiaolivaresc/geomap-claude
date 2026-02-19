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
    layers: [
      {
        id: 'gl_gem_geothermal_plant_tracker_52024',
        type: 'vector',
        title: 'Geothermal Power Plants',
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
        id: 'gl_borehole_clipped',
        type: 'vector',
        title: 'Boreholes',
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
