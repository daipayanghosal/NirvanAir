export interface PollutantDetail {
  value: number;
  unit: string;
  subindex: number;
  who_standard: number;
  times_who: number;
}

export interface AirQualityData {
  scale: string;
  aqi: number;
  category: "Good" | "Satisfactory" | "Moderate" | "Poor" | "Very Poor" | "Severe";
  color: string;
  dominant_pollutant: string;
  health_implications: string;
  sensitive_groups: string;
  pollutants: {
    pm2_5: PollutantDetail;
    pm10: PollutantDetail;
    no2: PollutantDetail;
    so2: PollutantDetail;
    co: PollutantDetail;
    o3: PollutantDetail;
  };
  us_aqi_equivalent: number;
  european_aqi_equivalent: number;
}

export interface WeatherData {
  temperature_c: number;
  apparent_temp_c: number;
  relative_humidity: number;
  wind_speed_kmh: number;
  wind_direction_deg: number;
  wind_direction_cardinal: string;
  pressure_hpa: number;
  condition: string;
  uv_index: number;
  inversion_risk: string;
}

export interface DataProvenance {
  mode: "live_model_and_reanalysis" | "demonstration_sample" | "client_fallback";
  is_live: boolean;
  label: string;
  message: string;
  station: {
    name: string;
    authority: string;
    distance_km: number;
    freshness_minutes: number;
    elevation_m: number;
  };
  timestamp: string;
}

export interface HourlyTrendPoint {
  time: string;
  aqi: number;
  pm25: number;
  pm10: number;
  is_peak: boolean;
}

export interface EnvironmentalData {
  status: string;
  data_provenance: DataProvenance;
  location: {
    name: string;
    state?: string;
    country?: string;
    latitude: number;
    longitude: number;
  };
  air_quality: AirQualityData;
  weather: WeatherData;
  hourly_24h: HourlyTrendPoint[];
}

export interface UserProfile {
  location_name: string;
  latitude: number;
  longitude: number;
  household_size: number;
  has_children: boolean;
  has_elderly: boolean;
  vulnerabilities: string[];
  commute_mode: string;
  commute_distance_km: number;
  exercise_pref: string;
  budget: "budget" | "moderate" | "premium";
  has_air_purifier: boolean;
}

export interface PriorityAction {
  action: string;
  reason: string;
  benefit: string;
}

export interface NirvanAirBriefing {
  headline: string;
  summary: string;
  what_is_causing_concern: string;
  who_should_be_careful: string;
  priority_actions_today: PriorityAction[];
  generated_by: string;
  timestamp: string;
}

export interface DailyPlanSegment {
  segment: string;
  time_window: string;
  suggested_activity: string;
  suggested_action?: string;
  reasoning: string;
  expected_benefit: string;
  alternative: string;
  alternative_if_impractical?: string;
  status: "recommended" | "adjusted" | "critical";
  icon: string;
}

export interface SustainableSwap {
  id: string;
  category: string;
  title: string;
  existing_activity: string;
  proposed_alternative: string;
  environmental_benefit: {
    co2_saved_kg_per_day: number;
    pm25_avoided_g_per_day: number;
    fuel_saved_litres_per_day: number;
    annual_co2_saved_kg: number;
  };
  financial_implications: {
    daily_savings_inr: number;
    monthly_savings_inr: number;
    annual_savings_inr: number;
    cost_notes: string;
  };
  difficulty: "Easy" | "Moderate" | "High";
  calculation_explanation: string;
}

export interface SwapImpactResult {
  swaps_count: number;
  days_tracked: number;
  total_co2_saved_kg: number;
  total_pm25_avoided_grams: number;
  total_fuel_saved_litres: number;
  total_financial_savings_inr: number;
  trees_equivalent: number;
  clean_air_breathing_days: number;
}

export interface SimulatorResults {
  parameters: {
    num_households: number;
    vehicle_reduction_percent: number;
    diesel_genset_reduction_percent: number;
    waste_composting_percent: number;
    energy_conservation_percent: number;
    timeframe_days: number;
  };
  results: {
    vehicle_km_avoided: number;
    fuel_saved_litres: number;
    co2_avoided_kg: number;
    pm25_emissions_prevented_kg: number;
    nox_emissions_prevented_kg: number;
    clean_air_equivalent_tree_years: number;
    estimated_community_savings_inr: number;
  };
  scientific_integrity_disclaimer: string;
}

export interface ActionableCard {
  recommendation_id: string;
  category: string;
  title: string;
  priority: "critical" | "high" | "medium" | "low";
  suggested_action: string;
  reasoning: string;
  expected_benefit: string;
  confidence: number;
  data_sources: string[];
  limitations: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  actionable_cards?: ActionableCard[];
  follow_up_suggestions?: string[];
  source?: string;
  timestamp: string;
}
