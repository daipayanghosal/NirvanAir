import React from "react";
import {
  Info,
  Droplets,
  Thermometer,
  Compass,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Activity,
  CheckCircle2,
  Layers,
  ChevronRight
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { EnvironmentalData, UserProfile, NirvanAirBriefing } from "../types";
import { AirQualityMap } from "../components/AirQualityMap";

interface OverviewViewProps {
  envData: EnvironmentalData;
  userProfile: UserProfile;
  briefing: NirvanAirBriefing | null;
  loadingBriefing: boolean;
  aqiStandard: "NAQI" | "USEPA";
  onNavigateTab: (tab: string) => void;
  onRefreshData: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  envData,
  userProfile,
  briefing,
  loadingBriefing,
  aqiStandard,
  onNavigateTab,
  onRefreshData
}) => {
  const aq = envData.air_quality;
  const weather = envData.weather;
  const prov = envData.data_provenance;
  const aqiVal = aqiStandard === "NAQI" ? aq.aqi : aq.us_aqi_equivalent;

  const pollutantsList = [
    {
      key: "pm2_5",
      name: "PM2.5",
      label: "Fine Particulate Matter (<2.5µm)",
      data: aq.pollutants.pm2_5,
      impact: "Deep alveolar lung penetration & vascular inflammation",
      who_guide: "15 µg/m³"
    },
    {
      key: "pm10",
      name: "PM10",
      label: "Coarse Inhalable Dust (<10µm)",
      data: aq.pollutants.pm10,
      impact: "Upper respiratory irritation & asthma exacerbation",
      who_guide: "45 µg/m³"
    },
    {
      key: "no2",
      name: "NO₂",
      label: "Nitrogen Dioxide",
      data: aq.pollutants.no2,
      impact: "Traffic combustion, airway reactivity",
      who_guide: "25 µg/m³"
    },
    {
      key: "so2",
      name: "SO₂",
      label: "Sulphur Dioxide",
      data: aq.pollutants.so2,
      impact: "Industrial coal/coke combustion byproduct",
      who_guide: "40 µg/m³"
    },
    {
      key: "co",
      name: "CO",
      label: "Carbon Monoxide",
      data: aq.pollutants.co,
      impact: "Incomplete fuel combustion, oxygen displacement",
      who_guide: "4.0 mg/m³"
    },
    {
      key: "o3",
      name: "Ozone",
      label: "Ground-Level Ozone (O₃)",
      data: aq.pollutants.o3,
      impact: "Photochemical smog, bronchial oxidative stress",
      who_guide: "100 µg/m³"
    }
  ];

  return (
    <div className="space-y-6 pb-12">

      {/* 1. M3 Data Provenance Banner */}
      <div className={`p-4.5 rounded-[24px] border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs ${
        prov.is_live
          ? "bg-[#d3e8d4]/60 border-[#1e6b45]/30 text-[#0e1f13]"
          : "bg-[#ffdad6]/70 border-[#ba1a1a]/30 text-[#410002]"
      }`}>
        <div className="flex items-start space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            prov.is_live ? "bg-[#1e6b45] text-white" : "bg-[#ba1a1a] text-white"
          }`}>
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-tight text-sm">{prov.label}</span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/80 border border-current">
                {prov.is_live ? "Live Satellite & Station Bridge" : "Realistic Winter Baseline"}
              </span>
            </div>
            <p className="text-[11px] text-current/80 mt-0.5">
              Station: <strong>{prov.station.name}</strong> ({prov.station.distance_km} km) • {prov.station.authority} • Updated {prov.station.freshness_minutes}m ago
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end md:self-auto shrink-0">
          <span className="text-[11px] text-[#506353] font-mono">
            {new Date(prov.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button
            onClick={onRefreshData}
            className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-white text-[#191d19] border border-[#c2c9bf]/60 shadow-2xs hover:bg-[#ebf0e8] transition-colors"
          >
            Refresh Feed
          </button>
        </div>
      </div>

      {/* 2. Hero Section: AQI Meter & Weather & Immediate Health Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* M3 Primary Elevated Card (7 cols) */}
        <div className="lg:col-span-7 bg-[#ffffff] rounded-[28px] p-6 border border-[#c2c9bf]/40 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="m3-label-medium text-[#727972] uppercase tracking-wider">Current Air Quality</span>
                <span className="m3-label-small bg-[#ebf0e8] text-[#506353] px-2.5 py-0.5 rounded-full">
                  {aqiStandard === "NAQI" ? "Indian NAQI Standard" : "US EPA Standard"}
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-[#506353]">
                <MapPin className="w-3.5 h-3.5 text-[#1e6b45]" />
                <span className="font-bold text-[#191d19]">{envData.location.name}</span>
              </div>
            </div>

            {/* Main AQI Tonal Display */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-2">
              <div className="flex items-baseline space-x-4">
                <div
                  className="w-28 h-28 rounded-[24px] flex flex-col items-center justify-center text-white shadow-md relative overflow-hidden"
                  style={{ backgroundColor: aq.color }}
                >
                  <span className="text-4xl font-black tracking-tight">{aqiVal}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">{aqiStandard}</span>
                  <div className="absolute inset-0 bg-white/10 opacity-30 pointer-events-none" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      className="m3-headline-small font-black uppercase tracking-tight"
                      style={{ color: aq.color }}
                    >
                      {aq.category}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ebf0e8] text-[#191d19] font-bold">
                      Dominant: {aq.dominant_pollutant}
                    </span>
                  </div>
                  <p className="m3-body-small text-[#424942] mt-1 max-w-md leading-relaxed">
                    {aq.health_implications}
                  </p>
                </div>
              </div>

              {/* Sub-reading: PM2.5 vs WHO Standard */}
              <div className="bg-[#f1f5ed] border border-[#c2c9bf]/40 p-4 rounded-[22px] shrink-0 sm:w-44 text-center sm:text-left">
                <div className="m3-label-small text-[#506353] uppercase">PM2.5 Level</div>
                <div className="text-2xl font-black text-[#191d19] mt-0.5">
                  {aq.pollutants.pm2_5.value} <span className="text-xs font-normal text-[#727972]">µg/m³</span>
                </div>
                <div className="mt-1 flex items-center justify-center sm:justify-start space-x-1">
                  <span className="text-[11px] font-black text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded-full">
                    {aq.pollutants.pm2_5.times_who}× WHO limit
                  </span>
                </div>
                <div className="text-[10px] text-[#727972] mt-1">WHO 24h Guide: 15 µg/m³</div>
              </div>
            </div>
          </div>

          {/* Sensitive Groups Alert Box */}
          <div className="mt-6 pt-4 border-t border-[#c2c9bf]/30 flex items-start space-x-3 bg-[#ffdad6]/40 p-3.5 rounded-[20px] border border-[#ffdad6]">
            <ShieldAlert className="w-5 h-5 text-[#ba1a1a] shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-[#410002] block mb-0.5">Vulnerable Household Guidance:</span>
              <span className="text-[#410002]/90 leading-relaxed">{aq.sensitive_groups}</span>
            </div>
          </div>
        </div>

        {/* Real-time Atmospheric Physics Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#ffffff] rounded-[28px] p-6 border border-[#c2c9bf]/40 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="m3-label-medium text-[#727972] uppercase tracking-wider">Atmospheric Physics</span>
              <span className="text-xs font-bold text-[#0e1f13] bg-[#d3e8d4] px-3 py-1 rounded-full">
                {weather.condition}
              </span>
            </div>

            {/* Weather Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3.5 rounded-[20px] bg-[#f1f5ed] border border-[#c2c9bf]/30">
                <div className="flex items-center space-x-2 text-[#727972] text-xs mb-1">
                  <Thermometer className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold">Temperature</span>
                </div>
                <div className="text-xl font-bold text-[#191d19]">
                  {weather.temperature_c}°C
                  <span className="text-xs font-normal text-[#506353] ml-1">Feels {weather.apparent_temp_c}°C</span>
                </div>
              </div>

              <div className="p-3.5 rounded-[20px] bg-[#f1f5ed] border border-[#c2c9bf]/30">
                <div className="flex items-center space-x-2 text-[#727972] text-xs mb-1">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">Humidity</span>
                </div>
                <div className="text-xl font-bold text-[#191d19]">
                  {weather.relative_humidity}%
                  <span className="text-xs font-normal text-[#506353] ml-1">{weather.relative_humidity > 70 ? "Moist" : "Moderate"}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-[20px] bg-[#f1f5ed] border border-[#c2c9bf]/30">
                <div className="flex items-center space-x-2 text-[#727972] text-xs mb-1">
                  <Compass className="w-4 h-4 text-teal-600" />
                  <span className="font-semibold">Surface Wind</span>
                </div>
                <div className="text-xl font-bold text-[#191d19]">
                  {weather.wind_speed_kmh} <span className="text-xs font-normal text-[#506353]">km/h</span>
                </div>
                <div className="text-[10px] text-[#727972]">Heading: {weather.wind_direction_cardinal} ({weather.wind_direction_deg}°)</div>
              </div>

              <div className="p-3.5 rounded-[20px] bg-[#f1f5ed] border border-[#c2c9bf]/30">
                <div className="flex items-center space-x-2 text-[#727972] text-xs mb-1">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold">Barometer</span>
                </div>
                <div className="text-xl font-bold text-[#191d19]">
                  {weather.pressure_hpa} <span className="text-xs font-normal text-[#506353]">hPa</span>
                </div>
                <div className="text-[10px] text-[#727972]">UV Index: {weather.uv_index}</div>
              </div>
            </div>
          </div>

          {/* M3 Tonal Boundary Layer Card */}
          <div className="p-3.5 bg-[#beeaf2]/40 border border-[#beeaf2] rounded-[20px] text-xs text-[#001f24]">
            <div className="flex items-center space-x-1.5 font-bold mb-0.5">
              <Activity className="w-4 h-4 text-[#3a656e]" />
              <span>Boundary Layer & Thermal Inversion:</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">{weather.inversion_risk}</p>
          </div>
        </div>

      </div>

      {/* 3. YOUR NIRVANAIR BRIEFING (M3 Tonal Deep Surface) */}
      <div className="bg-[#1e6b45] rounded-[32px] p-6 text-white shadow-sm border border-[#1e6b45]/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/15 mb-5 gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#bbf3cd] text-[#002111] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-[#1e6b45]" />
            </div>
            <div>
              <h2 className="m3-title-large text-white">Your NirvanAir Briefing</h2>
              <p className="text-xs text-[#bbf3cd]">
                {briefing?.generated_by || "Google Gemini 2.5 Flash Grounded Inference"}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab("planner")}
            className="flex items-center space-x-1.5 text-xs font-bold px-4 py-2 rounded-full bg-[#bbf3cd] hover:bg-[#a6e6b9] text-[#002111] transition-transform active:scale-95 shadow-xs"
          >
            <span>View Full 24h Routine</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loadingBriefing ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#bbf3cd]">Synthesizing environmental conditions & household risks...</p>
          </div>
        ) : briefing ? (
          <div className="space-y-4">
            
            {/* Headline & Summary */}
            <div>
              <h3 className="m3-title-medium text-[#bbf3cd] mb-1">{briefing.headline}</h3>
              <p className="m3-body-medium text-white/95 leading-relaxed">{briefing.summary}</p>
            </div>

            {/* 2-Column Reasoning: Root Cause + Demographic Care */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-[22px] bg-white/10 border border-white/15">
                <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider block mb-1">
                  What is causing concern?
                </span>
                <p className="text-xs text-white/90 leading-relaxed">
                  {briefing.what_is_causing_concern}
                </p>
              </div>

              <div className="p-4 rounded-[22px] bg-white/10 border border-white/15">
                <span className="text-[11px] font-bold text-red-200 uppercase tracking-wider block mb-1">
                  Who should be particularly careful?
                </span>
                <p className="text-xs text-white/90 leading-relaxed">
                  {briefing.who_should_be_careful}
                </p>
              </div>
            </div>

            {/* Priority Actions Today (The 3 Questions Answered: What, Why, Benefit) */}
            <div className="pt-2">
              <span className="m3-label-medium text-[#bbf3cd] uppercase tracking-wider block mb-3">
                Priority Actions Today:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {briefing.priority_actions_today.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-[24px] bg-[#155335] border border-[#2e8257] space-y-2">
                    <div className="flex items-start space-x-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#bbf3cd] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#bbf3cd] block">
                          What should I do?
                        </span>
                        <span className="text-xs font-bold text-white leading-snug">{item.action}</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-white/80 pl-6 border-l-2 border-[#bbf3cd]/30 ml-2 space-y-1">
                      <div>
                        <strong className="text-gray-200">Why: </strong>
                        <span>{item.reason}</span>
                      </div>
                      <div>
                        <strong className="text-[#bbf3cd]">Difference: </strong>
                        <span className="text-[#bbf3cd] font-semibold">{item.benefit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : null}
      </div>

      {/* 4. 24-HOUR AIR QUALITY & SMOG INVERSION TREND (Recharts) */}
      <div className="bg-[#ffffff] rounded-[28px] p-6 border border-[#c2c9bf]/40 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#c2c9bf]/30 mb-4 gap-2">
          <div>
            <h2 className="m3-title-medium text-[#191d19]">24-Hour Diurnal Pollution Trend</h2>
            <p className="m3-body-small text-[#727972]">Hourly NAQI and Particulate (PM2.5) concentrations with peak smog zones</p>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-[#f97316]" />
              <span className="text-[#506353] font-bold">PM2.5 (µg/m³)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ba1a1a]" />
              <span className="text-[#506353] font-bold">Inversion Peak</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={envData.hourly_24h} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="pm25Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#727972" fontSize={11} tickLine={false} />
              <YAxis stroke="#727972" fontSize={11} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#191d19] text-white p-3 rounded-[16px] text-xs shadow-lg space-y-1">
                        <div className="font-bold border-b border-gray-700 pb-1">{data.time} hrs</div>
                        <div>NAQI Sub-Index: <strong className="text-amber-400">{data.aqi}</strong></div>
                        <div>PM2.5: <strong className="text-orange-400">{data.pm25} µg/m³</strong></div>
                        <div>PM10: <strong>{data.pm10} µg/m³</strong></div>
                        {data.is_peak && (
                          <div className="text-[10px] text-[#ffdad6] font-bold mt-1">⚠️ Peak Smog Inversion Window</div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={60} stroke="#1e6b45" strokeDasharray="3 3" label={{ value: "NAQI Satisfactory (60)", fill: "#1e6b45", fontSize: 10 }} />
              <ReferenceLine y={120} stroke="#ba1a1a" strokeDasharray="3 3" label={{ value: "Very Poor (120)", fill: "#ba1a1a", fontSize: 10 }} />
              <Area type="monotone" dataKey="pm25" stroke="#ea580c" strokeWidth={2.5} fillOpacity={1} fill="url(#pm25Gradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 p-3.5 bg-[#f1f5ed] rounded-[20px] flex items-center justify-between text-xs text-[#424942]">
          <span>💡 <strong>Atmospheric Insight:</strong> Particulate peaks occur between 06:00 – 09:00 AM due to nocturnal thermal cooling. Midday warming (12:00 – 15:30 PM) expands the boundary layer.</span>
          <button
            onClick={() => onNavigateTab("indoor")}
            className="text-xs font-bold text-[#1e6b45] hover:underline shrink-0 ml-3"
          >
            Ventilation Timing →
          </button>
        </div>
      </div>

      {/* 5. CRITERIA POLLUTANTS DETAILED BREAKDOWN */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="m3-title-medium text-[#191d19]">Criteria Pollutant Telemetry</h2>
          <span className="m3-body-small text-[#727972]">Benchmark against WHO 24-hr Air Quality Guidelines</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pollutantsList.map((p) => {
            const isHigh = p.data.times_who > 1.5;
            return (
              <div key={p.key} className="bg-[#ffffff] p-5 rounded-[26px] border border-[#c2c9bf]/40 shadow-2xs hover:border-[#1e6b45] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-[#191d19]">{p.name}</span>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                    isHigh ? "bg-[#ffdad6] text-[#ba1a1a]" : "bg-[#d3e8d4] text-[#0e1f13]"
                  }`}>
                    {p.data.times_who}× WHO
                  </span>
                </div>
                <div className="text-2xl font-black text-[#191d19]">
                  {p.data.value} <span className="text-xs font-normal text-[#727972]">{p.data.unit}</span>
                </div>
                <div className="text-[11px] text-[#506353] mt-0.5">{p.label}</div>
                <p className="text-[11px] text-[#424942] mt-2.5 pt-2 border-t border-[#c2c9bf]/20 leading-relaxed">
                  {p.impact}
                </p>
                <div className="mt-2 text-[10px] text-[#727972]">
                  WHO 24h standard: {p.who_guide} • NAQI Sub-Index: <strong>{p.data.subindex}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Hyperlocal Monitoring Station & Ambient Dispersion Map */}
      <div className="bg-[#ffffff] rounded-[28px] p-6 border border-[#c2c9bf]/40 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#c2c9bf]/30 mb-4 gap-2">
          <div>
            <h2 className="m3-title-medium text-[#191d19]">Hyperlocal Station Mapping & Airshed Radius</h2>
            <p className="m3-body-small text-[#727972]">Geographic proximity to nearest ground monitoring station in {envData.location.name}</p>
          </div>
          <div className="text-xs text-[#506353] bg-[#ebf0e8] px-3.5 py-1.5 rounded-full font-semibold">
            Station: <strong>{prov.station.name}</strong> ({prov.station.distance_km} km)
          </div>
        </div>
        <AirQualityMap envData={envData} />
      </div>

      {/* 7. Quick Action Links & Community Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Family Shield Summary Card */}
        <div className="bg-[#ffffff] p-6 rounded-[28px] border border-[#c2c9bf]/40 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[#1e6b45] font-bold text-sm mb-2">
              <ShieldCheck className="w-5 h-5 text-[#1e6b45]" />
              <span className="m3-title-small">Household Protection Status</span>
            </div>
            <p className="m3-body-small text-[#424942] mb-3 leading-relaxed">
              Configured for <strong>{userProfile.household_size} members</strong> ({userProfile.has_children ? "Children, " : ""}{userProfile.has_elderly ? "Elderly, " : ""}Vulnerabilities: {userProfile.vulnerabilities.join(", ") || "None"}).
            </p>
            <div className="p-3.5 bg-[#f1f5ed] rounded-[20px] border border-[#c2c9bf]/40 text-xs text-[#191d19] space-y-1">
              <div className="font-bold">Today's Family Exposure Rule:</div>
              <div className="text-[#424942]">Keep school children indoors during recess if AQI remains &gt;200. Restrict senior morning walks.</div>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab("family")}
            className="mt-4 w-full py-2.5 bg-[#ebf0e8] hover:bg-[#dfe5dc] rounded-full text-xs font-bold text-[#191d19] transition-colors flex items-center justify-center space-x-1"
          >
            <span>Manage Family Safety Rules</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sustainable Living Snapshot Card */}
        <div className="bg-[#ffffff] p-6 rounded-[28px] border border-[#c2c9bf]/40 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[#1e6b45] font-bold text-sm mb-2">
              <Activity className="w-5 h-5 text-[#1e6b45]" />
              <span className="m3-title-small">Community Impact & Sustainable Swaps</span>
            </div>
            <p className="m3-body-small text-[#424942] mb-3 leading-relaxed">
              Explore everyday sustainable swaps (Metro transit, battery inverters, leaf composting) or model community-scale reductions in our What-If Simulator.
            </p>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 bg-[#d3e8d4]/40 rounded-[20px] border border-[#d3e8d4]">
                <span className="text-[10px] text-[#506353] uppercase font-bold block">Swaps Catalog</span>
                <span className="font-black text-[#0e1f13] text-sm">6 Verified Swaps</span>
              </div>
              <div className="p-3 bg-[#beeaf2]/40 rounded-[20px] border border-[#beeaf2]">
                <span className="text-[10px] text-[#3a656e] uppercase font-bold block">What-If Tool</span>
                <span className="font-black text-[#001f24] text-sm">Active Simulator</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => onNavigateTab("swaps")}
              className="py-2.5 bg-[#1e6b45] text-white hover:bg-[#155335] rounded-full text-xs font-bold transition-transform active:scale-95 shadow-xs"
            >
              Explore Swaps
            </button>
            <button
              onClick={() => onNavigateTab("community")}
              className="py-2.5 bg-[#ebf0e8] hover:bg-[#dfe5dc] text-[#191d19] rounded-full text-xs font-bold transition-colors"
            >
              Run Simulator
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
