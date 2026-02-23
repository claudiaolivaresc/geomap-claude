export interface TooltipField {
  /** Property key(s) to read from the feature. Array = first defined value wins. */
  name: string | string[];
  units: string;
  prefix_str: string;
  toFixedVal: number | null;
}

export interface VectorLayerTooltipConfig {
  tooltip_fields: TooltipField[];
}

export const VECTOR_LAYER_INFO: Record<string, VectorLayerTooltipConfig> = {
  // ── Boundaries ────────────────────────────────────────────────────
  gl_esri_world_countries_fixed: {
    tooltip_fields: [
      { name: 'COUNTRY', units: '', prefix_str: 'Country:', toFixedVal: null },
    ],
  },
  gl_wdpa_jun2025_poly_and_points_and_india_indone: {
    tooltip_fields: [
      { name: 'NAME', units: '', prefix_str: 'Name:', toFixedVal: null },
      { name: 'WDPA_ID', units: '', prefix_str: 'WDPA ID:', toFixedVal: null },
      { name: 'DESIG_ENG', units: '', prefix_str: 'Designation:', toFixedVal: null },
    ],
  },

  // ── Infrastructure ────────────────────────────────────────────────
  gl_power_plant_database: {
    tooltip_fields: [
      { name: 'name', units: '', prefix_str: '', toFixedVal: null },
      { name: 'primary_fuel', units: '', prefix_str: 'Fuel:', toFixedVal: null },
      { name: 'estimated_generation_gwh_2017', units: 'GWh', prefix_str: '2017 Est. Generation:', toFixedVal: null },
    ],
  },
  gl_gem_integrated_power_tracker_july_2024: {
    tooltip_fields: [
      { name: 'Plant / Project name', units: '', prefix_str: 'Plant/Project:', toFixedVal: null },
      { name: 'Unit / Phase name', units: '', prefix_str: 'Unit/Phase:', toFixedVal: null },
      { name: 'Type', units: '', prefix_str: 'Type:', toFixedVal: null },
      { name: 'Technology', units: '', prefix_str: 'Technology:', toFixedVal: null },
      { name: 'Fuel', units: '', prefix_str: 'Fuel:', toFixedVal: null },
      { name: 'Capacity(MW)', units: 'MW', prefix_str: 'Capacity:', toFixedVal: null },
      { name: 'Status', units: '', prefix_str: 'Status:', toFixedVal: null },
    ],
  },
  gl_gem_oil_and_gas_plant_tracker_20240516: {
    tooltip_fields: [
      { name: 'Plant name', units: '', prefix_str: '', toFixedVal: null },
      { name: 'Fuel', units: '', prefix_str: 'Fuel:', toFixedVal: null },
      { name: 'Capacity (MW)', units: 'MW', prefix_str: 'Capacity:', toFixedVal: null },
      { name: 'Status', units: '', prefix_str: 'Status:', toFixedVal: null },
      { name: 'Start year', units: '', prefix_str: 'Start year:', toFixedVal: null },
      { name: 'Retired year', units: '', prefix_str: 'Retired year:', toFixedVal: null },
      { name: 'Owner', units: '', prefix_str: 'Owner:', toFixedVal: null },
      { name: 'Operator', units: '', prefix_str: 'Operator:', toFixedVal: null },
    ],
  },
  gl_gem_ggit_gas_pipelines_2023_12: {
    tooltip_fields: [
      { name: 'PipelineName', units: '', prefix_str: '', toFixedVal: null },
      { name: 'Status', units: '', prefix_str: 'Status:', toFixedVal: null },
      { name: 'StartYear1', units: '', prefix_str: 'Start Year:', toFixedVal: null },
      { name: 'StartCountry', units: '', prefix_str: 'Start Country:', toFixedVal: null },
    ],
  },
  gl_gem_ggit_lng_terminals_2024_01: {
    tooltip_fields: [
      { name: 'TerminalName', units: '', prefix_str: '', toFixedVal: null },
      { name: 'Status', units: '', prefix_str: 'Status:', toFixedVal: null },
      { name: 'CapacityInMtpa', units: 'Mtpa', prefix_str: 'Capacity:', toFixedVal: 1 },
      { name: 'Country', units: '', prefix_str: 'Country:', toFixedVal: null },
    ],
  },
  gl_gem_coal_plant_tracker_april_2024_20240516: {
    tooltip_fields: [
      { name: 'Plant name', units: '', prefix_str: '', toFixedVal: null },
      { name: 'Coal type', units: '', prefix_str: 'Coal Type:', toFixedVal: null },
      { name: 'Coal source', units: '', prefix_str: 'Coal Source:', toFixedVal: null },
      { name: 'Alternative Fuel', units: '', prefix_str: 'Alt. Fuel:', toFixedVal: null },
      { name: 'Capacity (MW)', units: 'MW', prefix_str: 'Capacity:', toFixedVal: null },
      { name: 'Status', units: '', prefix_str: 'Status:', toFixedVal: null },
    ],
  },
  gl_gem_global_nuclear_power_tracker_20240516: {
    tooltip_fields: [
      { name: 'Project Name', units: '', prefix_str: '', toFixedVal: null },
      { name: 'Reactor Type', units: '', prefix_str: 'Reactor Type:', toFixedVal: null },
      { name: 'Model', units: '', prefix_str: 'Model:', toFixedVal: null },
      { name: 'Capacity (MW)', units: 'MW', prefix_str: 'Capacity:', toFixedVal: null },
      { name: 'Status', units: '', prefix_str: 'Status:', toFixedVal: null },
    ],
  },
  gl_gem_windfarms: {
    tooltip_fields: [
      { name: ['Project Name', 'name'], units: '', prefix_str: '', toFixedVal: null },
      { name: 'Status', units: '', prefix_str: 'Status:', toFixedVal: null },
      { name: ['Capacity(MW)', 'Capacity (MW)'], units: 'MW', prefix_str: 'Capacity:', toFixedVal: null },
      { name: 'Country', units: '', prefix_str: 'Country:', toFixedVal: null },
    ],
  },
  gl_solar: {
    tooltip_fields: [
      { name: ['name', 'Name'], units: '', prefix_str: '', toFixedVal: null },
      { name: ['capacity', 'Capacity'], units: 'MW', prefix_str: 'Capacity:', toFixedVal: 1 },
    ],
  },
  gl_borehole_clipped: {
    tooltip_fields: [
      { name: ['name', 'Name', 'fid'], units: '', prefix_str: 'Borehole:', toFixedVal: null },
    ],
  },
  gl_arderne: {
    tooltip_fields: [
      { name: 'fid', units: '', prefix_str: 'Gridfinder ID:', toFixedVal: null },
    ],
  },
  gl_osm_power_lines_20231003: {
    tooltip_fields: [
      { name: 'tags-volta', units: 'V', prefix_str: 'Voltage:', toFixedVal: null },
      { name: 'id', units: '', prefix_str: 'OSM ID:', toFixedVal: null },
    ],
  },

  // ── Energy Demand and Production ──────────────────────────────────
  gl_energy_demand_production: {
    tooltip_fields: [
      { name: 'Country_1', units: '', prefix_str: 'Country:', toFixedVal: null },
      { name: ['Ave5Y_kWhc', 'Ind1value'], units: 'kWh/capita', prefix_str: 'Electricity consumption:', toFixedVal: 0 },
    ],
  },
  gl_energy_demand_production_oil_sources: {
    tooltip_fields: [
      { name: 'Country_1', units: '', prefix_str: 'Country:', toFixedVal: null },
      { name: ['Ave5Y_perc', 'Ind2value'], units: '%', prefix_str: 'Oil sources:', toFixedVal: 1 },
    ],
  },
  gl_energy_demand_production_renewable: {
    tooltip_fields: [
      { name: 'Country_1', units: '', prefix_str: 'Country:', toFixedVal: null },
      { name: ['Ave5Y_GWh', 'Ind3value'], units: 'GWh', prefix_str: 'Renewable production:', toFixedVal: 1 },
    ],
  },
  gl_energy_supply_2023: {
    tooltip_fields: [
      { name: 'COUNTRY', units: '', prefix_str: 'Country:', toFixedVal: null },
      { name: ['Ind4_2023', 'Total2'], units: 'TJ', prefix_str: 'Total energy supply:', toFixedVal: 1 },
    ],
  },
  gl_total_energy_supply_per_unit_gdp: {
    tooltip_fields: [
      { name: 'COUNTRY', units: '', prefix_str: 'Country:', toFixedVal: null },
      { name: 'TES_GDP_PP', units: 'MJ/$', prefix_str: 'Energy intensity:', toFixedVal: 1 },
    ],
  },

  // ── Resources ─────────────────────────────────────────────────────
  gl_water_demand_by_country2: {
    tooltip_fields: [
      { name: 'NAME_EN', units: '', prefix_str: 'Country:', toFixedVal: null },
      { name: 'Total_Water_Demand', units: 'km\u00B3/yr', prefix_str: 'Total Demand:', toFixedVal: 2 },
      { name: 'Domestic_Water_Demand', units: 'km\u00B3/yr', prefix_str: 'Domestic:', toFixedVal: 2 },
      { name: 'Irrigation_Water_Demand', units: 'km\u00B3/yr', prefix_str: 'Irrigation:', toFixedVal: 2 },
      { name: 'Industry_Water_Demand', units: 'km\u00B3/yr', prefix_str: 'Industry:', toFixedVal: 2 },
    ],
  },
};
