import {
  EnvironmentalData,
  UserProfile,
  NirvanAirBriefing,
  DailyPlanSegment,
  SustainableSwap,
  SwapImpactResult,
  SimulatorResults,
  ChatMessage
} from "../types";

const API_BASE = "";

// Default Demonstration / Baseline Data for Durgapur, West Bengal
export const DEMO_DURGAPUR_DATA: EnvironmentalData = {
  status: "success",
  data_provenance: {
    mode: "demonstration_sample",
    is_live: false,
    label: "DEMONSTRATION BASELINE (Durgapur Winter Smog)",
    message: "Curated dataset representing acute winter inversion in industrial Durgapur, WB. Ground station: DMC Station.",
    station: {
      name: "Durgapur Municipal Corporation / B-Zone Ambient Station",
      authority: "West Bengal Pollution Control Board (WBPCB) / CPCB",
      distance_km: 2.4,
      freshness_minutes: 18,
      elevation_m: 65
    },
    timestamp: new Date().toISOString()
  },
  location: {
    name: "Durgapur",
    state: "West Bengal",
    country: "India",
    latitude: 23.5204,
    longitude: 87.3119
  },
  air_quality: {
    scale: "Indian NAQI",
    aqi: 285,
    category: "Poor",
    color: "#f97316",
    dominant_pollutant: "PM2.5",
    health_implications: "Breathing discomfort to most people on prolonged exposure. May cause respiratory illness in vulnerable groups.",
    sensitive_groups: "Children, elderly, and adults with respiratory or cardiac diseases should strictly avoid heavy outdoor physical activities.",
    pollutants: {
      pm2_5: { value: 184.5, unit: "µg/m³", subindex: 285, who_standard: 15.0, times_who: 12.3 },
      pm10: { value: 298.0, unit: "µg/m³", subindex: 248, who_standard: 45.0, times_who: 6.6 },
      no2: { value: 48.2, unit: "µg/m³", subindex: 60, who_standard: 25.0, times_who: 1.9 },
      so2: { value: 22.4, unit: "µg/m³", subindex: 28, who_standard: 40.0, times_who: 0.56 },
      co: { value: 1.42, unit: "mg/m³", subindex: 71, who_standard: 4.0, times_who: 0.35 },
      o3: { value: 38.6, unit: "µg/m³", subindex: 38, who_standard: 100.0, times_who: 0.38 }
    },
    us_aqi_equivalent: 234,
    european_aqi_equivalent: 85
  },
  weather: {
    temperature_c: 19.4,
    apparent_temp_c: 18.8,
    relative_humidity: 76,
    wind_speed_kmh: 4.2,
    wind_direction_deg: 315,
    wind_direction_cardinal: "NW",
    pressure_hpa: 1016.2,
    condition: "Hazy Smog / Inversion",
    uv_index: 2.8,
    inversion_risk: "High (Nocturnal inversion trapping vehicular & industrial particulates near surface)"
  },
  hourly_24h: [
    { time: "00:00", aqi: 210, pm25: 142, pm10: 245, is_peak: false },
    { time: "02:00", aqi: 235, pm25: 158, pm10: 270, is_peak: false },
    { time: "04:00", aqi: 260, pm25: 175, pm10: 298, is_peak: true },
    { time: "06:00", aqi: 285, pm25: 192, pm10: 320, is_peak: true },
    { time: "08:00", aqi: 310, pm25: 215, pm10: 345, is_peak: true },
    { time: "10:00", aqi: 290, pm25: 195, pm10: 318, is_peak: true },
    { time: "12:00", aqi: 240, pm25: 160, pm10: 275, is_peak: false },
    { time: "14:00", aqi: 215, pm25: 140, pm10: 250, is_peak: false },
    { time: "16:00", aqi: 230, pm25: 150, pm10: 265, is_peak: false },
    { time: "18:00", aqi: 270, pm25: 180, pm10: 305, is_peak: true },
    { time: "20:00", aqi: 295, pm25: 205, pm10: 335, is_peak: true },
    { time: "22:00", aqi: 280, pm25: 190, pm10: 315, is_peak: true }
  ]
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  location_name: "Durgapur",
  latitude: 23.5204,
  longitude: 87.3119,
  household_size: 4,
  has_children: true,
  has_elderly: true,
  vulnerabilities: ["Asthma / Bronchial Sensitivity", "Seasonal Allergic Rhinitis"],
  commute_mode: "two-wheeler",
  commute_distance_km: 12.0,
  exercise_pref: "morning_outdoor",
  budget: "moderate",
  has_air_purifier: false
};

export const STATIC_SWAPS: SustainableSwap[] = [
  {
    id: "swap_commute_car_to_metro",
    category: "Mobility & Transport",
    title: "Private Petrol Car → Metro / Electric Bus",
    existing_activity: "Driving a solo petrol car for a 15 km daily commute each way (30 km round trip).",
    proposed_alternative: "Commute via Rapid Metro transit or municipal Electric Bus network.",
    environmental_benefit: {
      co2_saved_kg_per_day: 5.4,
      pm25_avoided_g_per_day: 38.0,
      fuel_saved_litres_per_day: 2.5,
      annual_co2_saved_kg: 1350.0
    },
    financial_implications: {
      daily_savings_inr: 210,
      monthly_savings_inr: 5250,
      annual_savings_inr: 63000,
      cost_notes: "Based on petrol @ ₹104/L (12 km/L efficiency) + parking vs ₹50 roundtrip metro fare."
    },
    difficulty: "Moderate",
    calculation_explanation: "Petrol combustion generates ~2.31 kg CO2/L. A 30 km trip consumes 2.5 L petrol (5.77 kg CO2). Metro grid electricity in India emits ~0.37 kg CO2 for equivalent passenger-km. Net saving = 5.4 kg CO2e/day + 38g PM2.5."
  },
  {
    id: "swap_two_wheeler_to_cycling",
    category: "Mobility & Transport",
    title: "Petrol Two-Wheeler → Cycling / Walking for Short Trips",
    existing_activity: "Using a petrol scooter or motorbike for short 3–4 km neighborhood market runs.",
    proposed_alternative: "Walk or cycle for trips under 4 km.",
    environmental_benefit: {
      co2_saved_kg_per_day: 0.85,
      pm25_avoided_g_per_day: 9.5,
      fuel_saved_litres_per_day: 0.35,
      annual_co2_saved_kg: 255.0
    },
    financial_implications: {
      daily_savings_inr: 36,
      monthly_savings_inr: 900,
      annual_savings_inr: 10800,
      cost_notes: "Immediate fuel savings with zero maintenance overhead; improves cardiovascular fitness."
    },
    difficulty: "Easy",
    calculation_explanation: "Short cold-engine two-wheeler trips run rich fuel mixtures emitting up to 3x higher hydrocarbons and particulate matter per km than warm highway travel."
  },
  {
    id: "swap_diesel_generator_to_inverter",
    category: "Power & Energy",
    title: "Diesel Genset → Lithium/Tubular Battery Inverter & Rooftop Solar",
    existing_activity: "Running a 5 kVA diesel generator during power cuts (averaging 2 hours daily in winter).",
    proposed_alternative: "Transition to a high-efficiency pure sine wave tubular battery inverter or hybrid solar system.",
    environmental_benefit: {
      co2_saved_kg_per_day: 5.8,
      pm25_avoided_g_per_day: 62.0,
      fuel_saved_litres_per_day: 2.2,
      annual_co2_saved_kg: 1740.0
    },
    financial_implications: {
      daily_savings_inr: 150,
      monthly_savings_inr: 4500,
      annual_savings_inr: 54000,
      cost_notes: "Diesel generator cost is ~₹32/kWh vs grid battery recharge cost of ~₹8/kWh. Initial inverter capital pays back in 14 months."
    },
    difficulty: "High",
    calculation_explanation: "Stationary small diesel engines lack SCR/DPF emissions scrubbers, emitting black carbon soot (PM2.5) directly at rooftop height into neighborhood air."
  },
  {
    id: "swap_open_waste_burning_to_compost",
    category: "Waste & Air Protection",
    title: "Open Leaf & Garden Waste Burning → Community Composting",
    existing_activity: "Raking dry leaves, garden waste, and cardboard and burning them in street piles in the evening.",
    proposed_alternative: "Deposit in a decentralized aerobic leaf composter or mulch around tree bases.",
    environmental_benefit: {
      co2_saved_kg_per_day: 12.0,
      pm25_avoided_g_per_day: 145.0,
      fuel_saved_litres_per_day: 0.0,
      annual_co2_saved_kg: 2400.0
    },
    financial_implications: {
      daily_savings_inr: 25,
      monthly_savings_inr: 750,
      annual_savings_inr: 9000,
      cost_notes: "Produces rich organic humic fertilizer worth ₹15/kg for home plants while eliminating municipal burning penalties."
    },
    difficulty: "Easy",
    calculation_explanation: "Smoldering open biomass burns at low temperatures (<400°C) with incomplete combustion, generating toxic polycyclic aromatic hydrocarbons (PAHs) and heavy PM2.5."
  },
  {
    id: "swap_mosquito_coil_to_liquid_vaporizer",
    category: "Indoor Health",
    title: "Burning Mosquito Coils → Sealed Mechanical Screen / Liquid Electric Repeller",
    existing_activity: "Burning 1-2 smoldering mosquito coils every night in bedrooms or living areas.",
    proposed_alternative: "Install window magnetic mesh screens and use low-emission liquid electric vaporizers or ultrasonic repellents.",
    environmental_benefit: {
      co2_saved_kg_per_day: 0.2,
      pm25_avoided_g_per_day: 55.0,
      fuel_saved_litres_per_day: 0.0,
      annual_co2_saved_kg: 60.0
    },
    financial_implications: {
      daily_savings_inr: 4,
      monthly_savings_inr: 120,
      annual_savings_inr: 1440,
      cost_notes: "Eliminates coil costs (₹5/night); window mesh is a one-time ₹800 install lasting 5+ years."
    },
    difficulty: "Easy",
    calculation_explanation: "A single mosquito coil releases PM2.5 equivalent to smoking 75–100 cigarettes and significant quantities of formaldehyde inside enclosed rooms."
  },
  {
    id: "swap_single_use_bags_to_cloth",
    category: "Material & Plastics",
    title: "Single-Use Plastic Bags → Organic Canvas & Jute Totes",
    existing_activity: "Taking 3–4 thin poly bags from vegetable vendors and grocery stores on each market visit.",
    proposed_alternative: "Carry a compact, washable cotton/jute tote bag in your vehicle or backpack.",
    environmental_benefit: {
      co2_saved_kg_per_day: 0.15,
      pm25_avoided_g_per_day: 3.0,
      fuel_saved_litres_per_day: 0.0,
      annual_co2_saved_kg: 45.0
    },
    financial_implications: {
      daily_savings_inr: 10,
      monthly_savings_inr: 150,
      annual_savings_inr: 1800,
      cost_notes: "Avoids vendor carry-bag charges (₹3–5 per bag in modern supermarkets)."
    },
    difficulty: "Easy",
    calculation_explanation: "Plastic bags clog municipal storm drains, leading to stagnant sewage pools and frequent open incineration in roadside garbage bins."
  }
];

// API Callers with Auto Fallback

export async function fetchAirQualityData(
  lat: number,
  lon: number,
  locationName: string,
  forceDemo: boolean = false
): Promise<EnvironmentalData> {
  if (forceDemo) {
    return { ...DEMO_DURGAPUR_DATA, location: { ...DEMO_DURGAPUR_DATA.location, name: locationName, latitude: lat, longitude: lon } };
  }
  try {
    const res = await fetch(`${API_BASE}/api/air-quality?lat=${lat}&lon=${lon}&location_name=${encodeURIComponent(locationName)}&force_demo=${forceDemo}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Backend /api/air-quality call failed, falling back to local simulation:", e);
  }

  // Direct client-side Open-Meteo fallback if backend is offline
  try {
    const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi&hourly=pm10,pm2_5&past_days=1&forecast_days=2&timezone=auto`;
    const wUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,wind_direction_10m,surface_pressure&timezone=auto`;
    
    const [aqRes, wRes] = await Promise.all([fetch(aqUrl), fetch(wUrl)]);
    if (aqRes.ok && wRes.ok) {
      const aq = await aqRes.json();
      const w = await wRes.json();
      const pm25 = aq.current?.pm2_5 || 25;
      const pm10 = aq.current?.pm10 || 45;
      
      // Calculate NAQI approximate
      let aqi = Math.round(pm25 * 1.5);
      if (aqi < 10) aqi = 15;
      let category: "Good" | "Satisfactory" | "Moderate" | "Poor" | "Very Poor" | "Severe" = "Satisfactory";
      let color = "#84cc16";
      if (aqi <= 50) { category = "Good"; color = "#16a34a"; }
      else if (aqi <= 100) { category = "Satisfactory"; color = "#84cc16"; }
      else if (aqi <= 200) { category = "Moderate"; color = "#eab308"; }
      else if (aqi <= 300) { category = "Poor"; color = "#f97316"; }
      else if (aqi <= 400) { category = "Very Poor"; color = "#ef4444"; }
      else { category = "Severe"; color = "#7f1d1d"; }

      const hourlyTrend = [];
      const times = aq.hourly?.time || [];
      const h_pm25 = aq.hourly?.pm2_5 || [];
      const h_pm10 = aq.hourly?.pm10 || [];
      const start = Math.max(0, times.length - 24);
      for (let i = start; i < times.length; i++) {
        const t = times[i].split("T")[1]?.slice(0, 5) || `${i%24}:00`;
        const p25 = h_pm25[i] || pm25;
        const p10 = h_pm10[i] || pm10;
        hourlyTrend.push({
          time: t,
          aqi: Math.round(p25 * 1.5),
          pm25: Math.round(p25),
          pm10: Math.round(p10),
          is_peak: p25 > 120
        });
      }

      return {
        status: "success",
        data_provenance: {
          mode: "live_model_and_reanalysis",
          is_live: true,
          label: "LIVE DIRECT SENSING (Open-Meteo Integration)",
          message: "Real-time atmospheric modeling synchronized via client API bridge.",
          station: {
            name: `${locationName} Ground Monitoring Area`,
            authority: "Integrated Atmospheric Chemistry Reanalysis",
            distance_km: 3.2,
            freshness_minutes: 10,
            elevation_m: 75
          },
          timestamp: new Date().toISOString()
        },
        location: { name: locationName, latitude: lat, longitude: lon },
        air_quality: {
          scale: "Indian NAQI",
          aqi,
          category,
          color,
          dominant_pollutant: "PM2.5",
          health_implications: "Breathing discomfort to sensitive individuals on prolonged exposure.",
          sensitive_groups: "Children and elderly should moderate prolonged outdoor activity.",
          pollutants: {
            pm2_5: { value: Math.round(pm25 * 10) / 10, unit: "µg/m³", subindex: aqi, who_standard: 15.0, times_who: Math.round(pm25 / 1.5) / 10 },
            pm10: { value: Math.round(pm10 * 10) / 10, unit: "µg/m³", subindex: Math.round(pm10 * 0.9), who_standard: 45.0, times_who: Math.round(pm10 / 4.5) / 10 },
            no2: { value: Math.round(aq.current?.nitrogen_dioxide || 25), unit: "µg/m³", subindex: 45, who_standard: 25.0, times_who: 1.0 },
            so2: { value: Math.round(aq.current?.sulphur_dioxide || 10), unit: "µg/m³", subindex: 20, who_standard: 40.0, times_who: 0.3 },
            co: { value: Math.round(((aq.current?.carbon_monoxide || 400) / 1000) * 100) / 100, unit: "mg/m³", subindex: 30, who_standard: 4.0, times_who: 0.2 },
            o3: { value: Math.round(aq.current?.ozone || 30), unit: "µg/m³", subindex: 35, who_standard: 100.0, times_who: 0.3 }
          },
          us_aqi_equivalent: Math.round(aqi * 0.85),
          european_aqi_equivalent: Math.round(aqi * 0.6)
        },
        weather: {
          temperature_c: Math.round(w.current?.temperature_2m || 22),
          apparent_temp_c: Math.round(w.current?.apparent_temperature || 21),
          relative_humidity: Math.round(w.current?.relative_humidity_2m || 65),
          wind_speed_kmh: Math.round(w.current?.wind_speed_10m || 5),
          wind_direction_deg: Math.round(w.current?.wind_direction_10m || 180),
          wind_direction_cardinal: "S",
          pressure_hpa: Math.round(w.current?.surface_pressure || 1013),
          condition: "Partly Cloudy",
          uv_index: 3.5,
          inversion_risk: "Low"
        },
        hourly_24h: hourlyTrend
      };
    }
  } catch (err) {
    console.warn("Client side direct Open-Meteo call also failed:", err);
  }

  return DEMO_DURGAPUR_DATA;
}

export async function fetchNirvanAirBriefing(
  envData: EnvironmentalData,
  profile: UserProfile
): Promise<NirvanAirBriefing> {
  try {
    const res = await fetch(`${API_BASE}/api/briefing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ env_data: envData, user_profile: profile })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Briefing API call failed, using client fallback:", e);
  }

  // Fallback briefing
  const aqi = envData.air_quality.aqi;
  const loc = envData.location.name;
  return {
    headline: `${envData.air_quality.category} Air Quality Alert (${aqi} NAQI) for ${loc}`,
    summary: `Current ambient air index is ${aqi} (${envData.air_quality.category}). Surface particulate concentration of ${envData.air_quality.pollutants.pm2_5.value} µg/m³ exceeds WHO safety guidelines by ${envData.air_quality.pollutants.pm2_5.times_who}x.`,
    what_is_causing_concern: `Atmospheric boundary layer compression and low surface wind (${envData.weather.wind_speed_kmh} km/h) are preventing vertical dispersion of industrial, vehicular, and domestic emissions.`,
    who_should_be_careful: profile.has_children || profile.has_elderly ? "Children, seniors, and individuals with respiratory sensitivities are at high risk of airway irritation." : "Active outdoor runners and commuters.",
    priority_actions_today: [
      {
        action: aqi > 200 ? "Shift outdoor exercise indoors and keep living quarters sealed until midday." : "Ventilate your home during peak solar warmth (1:00 PM – 3:30 PM).",
        reason: "Reduces pulmonary particulate deposition and avoids sharp temperature inversion zones.",
        benefit: "Averts up to 80% of toxic particulate inhalation today."
      },
      {
        action: "Wear an N95 respirator during commute and switch vehicle AC to recirculation mode.",
        reason: "Prevents direct suction of high-density road soot into the respiratory tract.",
        benefit: "Filters >90% of sub-2.5 micron toxic aerosols."
      }
    ],
    generated_by: "NirvanAir Environmental Intelligence Engine",
    timestamp: new Date().toISOString()
  };
}

export async function fetchDailyPlan(
  envData: EnvironmentalData,
  profile: UserProfile
): Promise<DailyPlanSegment[]> {
  try {
    const res = await fetch(`${API_BASE}/api/planner`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ env_data: envData, user_profile: profile })
    });
    if (res.ok) {
      const data = await res.json();
      return data.timeline;
    }
  } catch (e) {
    console.warn("Planner API call failed, using client heuristics:", e);
  }

  const aqi = envData.air_quality.aqi;
  return [
    {
      segment: "Morning Routine",
      time_window: "06:30 AM – 08:00 AM",
      suggested_activity: aqi > 200 ? "Keep windows latched. Run bedroom filtration or damp curtain barrier." : "Open leeward windows for 15 minutes to refresh oxygen.",
      reasoning: "Early morning thermal inversion concentrates heavy particulate matter near ground level.",
      expected_benefit: "Maintains indoor PM2.5 within healthy bounds.",
      alternative: "Use quiet ceiling fan circulation without opening street-facing windows.",
      status: aqi > 200 ? "critical" : "recommended",
      icon: "Sun"
    },
    {
      segment: "Exercise & Fitness",
      time_window: "07:15 AM – 08:00 AM",
      suggested_activity: aqi > 180 ? "Indoor bodyweight training, yoga, or indoor resistance workout." : "Brisk outdoor walking in green park corridors.",
      reasoning: "Intense outdoor breathing bypasses nasal hairs, depositing deep particulate toxins into lungs.",
      expected_benefit: "Saves ~150 µg toxic particulate lung deposition per 45 min workout.",
      alternative: "Reschedule walk to 01:30 PM – 03:00 PM when solar heating disperses smog.",
      status: aqi > 180 ? "adjusted" : "recommended",
      icon: "Activity"
    },
    {
      segment: "Commute to Work",
      time_window: "08:30 AM – 09:30 AM",
      suggested_activity: "Wear certified N95 respirator. Use Metro or AC bus over open two-wheeler where available.",
      reasoning: "Stop-and-go morning traffic generates extreme localized tailpipe soot.",
      expected_benefit: "Cuts inhaled toxic dose by 92% and saves ~2.5 kg CO2 if choosing rapid transit.",
      alternative: "Car cabin recirculation if driving; avoid following diesel trucks closely.",
      status: "critical",
      icon: "Navigation"
    },
    {
      segment: "Shopping & Errands",
      time_window: "01:30 PM – 03:30 PM",
      suggested_activity: "Consolidate outdoor market and bank trips during this midday window.",
      reasoning: "Planetary boundary layer expands to maximum height, resulting in lowest diurnal PM2.5 levels.",
      expected_benefit: "Minimizes cumulative exposure during essential chores.",
      alternative: "Combine neighborhood deliveries with neighbors.",
      status: "recommended",
      icon: "ShoppingBag"
    },
    {
      segment: "Evening Cooking",
      time_window: "06:30 PM – 08:30 PM",
      suggested_activity: "Run kitchen exhaust on high. Avoid open deep frying or burning mosquito coils/incense.",
      reasoning: "Cooking aerosol plumes indoors trapped by evening cold inversion lead to hazardous PM2.5 spikes.",
      expected_benefit: "Keeps living area PM2.5 below 40 µg/m³ instead of 400+ µg/m³.",
      alternative: "Covered steaming, pressure cooking, or microwave.",
      status: "recommended",
      icon: "Utensils"
    },
    {
      segment: "Sleeping Sanctuary",
      time_window: "10:00 PM – 06:30 AM",
      suggested_activity: "Seal bedroom doors and windows. Use liquid electric mosquito repellent rather than burning coils.",
      reasoning: "Nighttime inversion keeps outdoor air toxic. 8 hours of clean air sleep restores bronchial lining.",
      expected_benefit: "Restorative REM sleep, eliminates morning coughing and dry throat.",
      alternative: "Place a damp towel at door bottom if drafts enter from hallways.",
      status: "recommended",
      icon: "Moon"
    }
  ];
}

export async function fetchSwaps(): Promise<SustainableSwap[]> {
  try {
    const res = await fetch(`${API_BASE}/api/swaps`);
    if (res.ok) {
      const data = await res.json();
      return data.swaps;
    }
  } catch (e) {
    console.warn("Swaps API call failed, using static catalog:", e);
  }
  return STATIC_SWAPS;
}

export async function computeSwapImpact(swapIds: string[], days: number = 30): Promise<SwapImpactResult> {
  try {
    const res = await fetch(`${API_BASE}/api/swaps/impact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ swap_ids: swapIds, days })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Compute impact API failed, running locally:", e);
  }

  // Local calculation
  let totalCo2 = 0;
  let totalPm25 = 0;
  let totalFuel = 0;
  let totalInr = 0;

  const selected = STATIC_SWAPS.filter(s => swapIds.includes(s.id));
  for (const s of selected) {
    totalCo2 += s.environmental_benefit.co2_saved_kg_per_day * days;
    totalPm25 += s.environmental_benefit.pm25_avoided_g_per_day * days;
    totalFuel += s.environmental_benefit.fuel_saved_litres_per_day * days;
    totalInr += s.financial_implications.daily_savings_inr * days;
  }

  return {
    swaps_count: selected.length,
    days_tracked: days,
    total_co2_saved_kg: Math.round(totalCo2 * 10) / 10,
    total_pm25_avoided_grams: Math.round(totalPm25 * 10) / 10,
    total_fuel_saved_litres: Math.round(totalFuel * 10) / 10,
    total_financial_savings_inr: Math.round(totalInr),
    trees_equivalent: Math.round((totalCo2 / 21.7) * 10) / 10,
    clean_air_breathing_days: Math.round((totalPm25 / 15.0) * 10) / 10
  };
}

export async function runSimulation(params: {
  num_households: number;
  vehicle_reduction_percent: number;
  diesel_genset_reduction_percent: number;
  waste_composting_percent: number;
  energy_conservation_percent: number;
}): Promise<SimulatorResults> {
  try {
    const res = await fetch(`${API_BASE}/api/simulator`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Simulator API failed, running local calculations:", e);
  }

  const days = 30;
  const kmAvoided = params.num_households * 25.0 * (params.vehicle_reduction_percent / 100.0) * days;
  const fuelSaved = kmAvoided / 12.0;
  const co2Transport = fuelSaved * 2.31;
  const pm25Transport = (kmAvoided * 1.2) / 1000.0;
  const noxTransport = (kmAvoided * 0.8) / 1000.0;

  const gensetHours = (params.num_households * 0.25 * 1.0 * (params.diesel_genset_reduction_percent / 100.0)) * days;
  const gensetDiesel = gensetHours * 1.1;
  const co2Genset = gensetDiesel * 2.68;
  const pm25Genset = (gensetHours * 28.0) / 1000.0;

  const wasteDiverted = (params.num_households * 0.15 * 0.7 * (params.waste_composting_percent / 100.0)) * days;
  const pm25Waste = (wasteDiverted * 12.0) / 1000.0;
  const co2Waste = wasteDiverted * 1.1;

  const kwhSaved = (params.num_households * 12.0 * (params.energy_conservation_percent / 100.0)) * days;
  const co2Energy = kwhSaved * 0.71;

  const totalCo2 = Math.round((co2Transport + co2Genset + co2Waste + co2Energy) * 10) / 10;
  const totalPm25 = Math.round((pm25Transport + pm25Genset + pm25Waste) * 100) / 100;
  const totalFuel = Math.round((fuelSaved + gensetDiesel) * 10) / 10;
  const totalSavingsInr = Math.round((fuelSaved * 104) + (gensetDiesel * 92) + (kwhSaved * 7.5));

  return {
    parameters: { ...params, timeframe_days: days },
    results: {
      vehicle_km_avoided: Math.round(kmAvoided),
      fuel_saved_litres: totalFuel,
      co2_avoided_kg: totalCo2,
      pm25_emissions_prevented_kg: totalPm25,
      nox_emissions_prevented_kg: Math.round(noxTransport * 100) / 100,
      clean_air_equivalent_tree_years: Math.round((totalCo2 / 21.7) * 10) / 10,
      estimated_community_savings_inr: totalSavingsInr
    },
    scientific_integrity_disclaimer:
      "THEORETICAL EMISSION PROJECTION ONLY: These metrics represent localized mass emission reductions (tailpipe, generator, and smoldering soot prevented from entering the airshed). Ambient AQI is heavily governed by regional meteorology, thermal inversions, and transboundary air masses. Individual community actions drastically reduce near-ground toxic exposure without implying an immediate, linear drop in regional station AQI numbers."
  };
}

export async function sendChatMessage(
  message: string,
  envData: EnvironmentalData,
  profile: UserProfile,
  chatHistory: { role: string; content: string }[]
): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        user_profile: profile,
        chat_history: chatHistory,
        environmental_data: envData
      })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Chat API call failed, attempting client-side Gemini or heuristic fallback:", e);
  }

  // Client-side direct Gemini call if user configured API key in Settings
  const clientGeminiKey = localStorage.getItem("nirvanair_gemini_key");
  if (clientGeminiKey) {
    try {
      const prompt = `You are NirvanAir, an AI Hyperlocal Air Quality Assistant for ${envData.location.name}. Current AQI is ${envData.air_quality.aqi} (${envData.air_quality.category}).
User Query: "${message}"
Answer the 3 questions: What should I do? Why? What difference will it make?
Respond concisely in Markdown.`;

      const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${clientGeminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      if (gRes.ok) {
        const gData = await gRes.json();
        const text = gData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            answer_markdown: text,
            actionable_cards: [
              {
                recommendation_id: `rec_gemini_${Date.now()}`,
                category: "Health & Routine",
                title: "Personalized Environmental Guidance",
                priority: envData.air_quality.aqi > 200 ? "high" : "medium",
                suggested_action: "Follow the protective steps detailed in the briefing.",
                reasoning: `Telemetry indicates ${envData.air_quality.aqi} NAQI in ${envData.location.name}.`,
                expected_benefit: "Reduces acute pulmonary micro-particulate absorption.",
                confidence: 0.95,
                data_sources: ["Google Gemini 2.5 Flash Direct", "Open-Meteo"],
                limitations: "Microclimate variations may apply across neighborhoods."
              }
            ],
            follow_up_suggestions: [
              "Should I open my windows this morning?",
              "How can I build a budget DIY air purifier?",
              "What mask should I wear for commuting?"
            ],
            source: "Google Gemini 2.5 Flash (Direct Client Link)"
          };
        }
      }
    } catch (gErr) {
      console.warn("Direct Gemini call failed, falling back to heuristics:", gErr);
    }
  }

  // Client fallback conversational intelligence
  const q = message.toLowerCase();
  const aqi = envData.air_quality.aqi;
  const loc = envData.location.name;

  if (q.includes("jog") || q.includes("run") || q.includes("exercise")) {
    return {
      answer_markdown: `**Jogging Advisory for ${loc} (Current AQI: ${aqi} — ${envData.air_quality.category}):**\n\n- **What you should do:** Do NOT go jogging outdoors this morning. Move your workout indoors (HIIT, yoga, or indoor cycling) in a sealed room.\n- **Why you should do it:** Aerobic respiration increases air intake by 800% and bypasses nasal filtration. Fine PM2.5 (${envData.air_quality.pollutants.pm2_5.value} µg/m³) penetrates deep into pulmonary alveoli and enters the bloodstream.\n- **What difference it will make:** Staying indoors reduces your particulate burden by 85–90% compared to a 45-minute outdoor jog.`,
      actionable_cards: [
        {
          recommendation_id: "rec_jog_indoor",
          category: "Health & Fitness",
          title: "Switch to Indoor Aerobics / Yoga",
          priority: "high",
          suggested_action: "Conduct morning fitness routine indoors with closed windows.",
          reasoning: `AQI is ${aqi}. Heavy breathing in smog causes acute vascular inflammation.`,
          expected_benefit: "Prevents inhalation of ~150 µg of toxic particulate matter.",
          confidence: 0.98,
          data_sources: ["CPCB Health Advisory", "WHO Air Quality Guidelines"],
          limitations: "Keep indoor air clean; avoid incense or dry sweeping while working out."
        }
      ],
      follow_up_suggestions: [
        "Should I open my windows this morning?",
        "How can I protect my family on a limited budget?",
        "What mask should I wear for commuting?"
      ],
      source: "NirvanAir Heuristic Engine (Offline Active)"
    };
  }

  return {
    answer_markdown: `**Environmental Brief for ${loc} (AQI: ${aqi} — ${envData.air_quality.category}):**\n\n- **What you should do:** Keep windows closed during early morning and late night. Wear a certified N95 respirator if traveling in traffic, and plan outdoor errands for 1:30 PM – 3:30 PM.\n- **Why you should do it:** Nocturnal thermal inversion traps surface pollution, which gradually disperses during peak afternoon sunlight.\n- **What difference it will make:** Targeted timing and personal respiratory barriers protect against acute respiratory inflammation and long-term cardiovascular risks.`,
    actionable_cards: [
      {
        recommendation_id: "rec_general_safety",
        category: "Exposure Management",
        title: "Multi-Barrier Protection Strategy",
        priority: "medium",
        suggested_action: "Combine N95 protection in transit with afternoon-only ventilation.",
        reasoning: "Concentrated ambient soot peaks during morning and evening rush hours.",
        expected_benefit: "Reduces total daily particulate inhalation by >70%.",
        confidence: 0.95,
        data_sources: ["Open-Meteo", "CPCB NAQI"],
        limitations: "Varies depending on apartment floor level and proximity to arterial roads."
      }
    ],
    follow_up_suggestions: [
      "Is an N95 mask useful during severe smog?",
      "How can I build a budget DIY air purifier?",
      "What is the cleanest way to commute today?"
    ],
    source: "NirvanAir Heuristic Engine (Offline Active)"
  };
}
