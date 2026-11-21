import React from "react";
import {
  AlertTriangle,
  Info,
  Wind,
  Droplets,
  Thermometer,
  Compass,
  Gauge,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  Clock,
  MapPin,
  TrendingUp,
  Activity,
  CheckCircle2,
  Calendar,
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
import { EnvironmentalData, UserProfile, AirwiseBriefing } from "../types";
import { AirQualityMap } from "../components/AirQualityMap";

interface OverviewViewProps {
  envData: EnvironmentalData;
  userProfile: UserProfile;
  briefing: AirwiseBriefing | null;
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

  // Pollutants array for the grid
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

      {/* 1. Data Provenance & Attribution Banner */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-sm ${
        prov.is_live
          ? "bg-[#eef6f0] border-[#cce4d3] text-[#163323]"
          : "bg-amber-50 border-amber-200 text-amber-900"
      }`}>
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
            prov.is_live ? "bg-[#163323] text-white" : "bg-amber-600 text-white"
          }`}>
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-tight">{prov.label}</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/80 border border-current">
                {prov.is_live ? "Live Satellite & Station Bridge" : "Realistic Winter Baseline"}
              </span>
            </div>
            <p className="text-xs text-current/80 mt-0.5">
              Station: <strong>{prov.station.name}</strong> ({prov.station.distance_km} km away) • Authority: {prov.station.authority} • Updated {prov.station.freshness_minutes} mins ago
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end md:self-auto shrink-0">
          <span className="text-xs text-gray-500 font-mono">
            {new Date(prov.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button
            onClick={onRefreshData}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border shadow-xs hover:bg-gray-50 transition-colors"
          >
            Refresh Telemetry
          </button>
        </div>
      </div>

      {/* 2. Hero Section: AQI Meter & Weather & Immediate Health Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* AQI Primary Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#e2e8e0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Air Quality</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                  {aqiStandard === "NAQI" ? "Indian NAQI Standard" : "US EPA Standard"}
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                <MapPin className="w-3.5 h-3.5 text-[#849974]" />
                <span className="font-semibold text-gray-800">{envData.location.name}</span>
              </div>
            </div>

            {/* Main AQI Display */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-2">
              <div className="flex items-baseline space-x-4">
                <div
                  className="w-28 h-28 rounded-2xl flex flex-col items-center justify-center text-white shadow-md relative overflow-hidden"
                  style={{ backgroundColor: aq.color }}
                >
                  <span className="text-4xl font-black tracking-tight">{aqiVal}</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider mt-0.5">{aqiStandard}</span>
                  <div className="absolute inset-0 bg-white/10 opacity-30 pointer-events-none" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      className="text-xl font-extrabold tracking-tight uppercase"
                      style={{ color: aq.color }}
                    >
                      {aq.category}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-semibold">
                      Dominant: {aq.dominant_pollutant}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 max-w-md leading-snug">
                    {aq.health_implications}
                  </p>
                </div>
              </div>

              {/* Sub-reading comparison: PM2.5 vs WHO Standard */}
              <div className="bg-[#f8faf8] border border-[#e5ece5] p-3.5 rounded-xl shrink-0 sm:w-44 text-center sm:text-left">
                <div className="text-[11px] text-gray-500 font-semibold uppercase">PM2.5 Concentration</div>
                <div className="text-2xl font-black text-gray-900 mt-0.5">
                  {aq.pollutants.pm2_5.value} <span className="text-xs font-normal text-gray-500">µg/m³</span>
                </div>
                <div className="mt-1 flex items-center justify-center sm:justify-start space-x-1">
                  <span className="text-xs font-extrabold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                    {aq.pollutants.pm2_5.times_who}× WHO limit
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 mt-1">WHO 24h Guideline: 15 µg/m³</div>
              </div>
            </div>
          </div>

          {/* Sensitive Groups Alert Box */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-start space-x-3 bg-red-50/50 p-3 rounded-xl border border-red-100/60">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-red-900 block">Vulnerable Groups Guidance:</span>
              <span className="text-red-800 leading-relaxed">{aq.sensitive_groups}</span>
            </div>
          </div>
        </div>

        {/* Real-time Weather & Atmospheric Physics Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#e2e8e0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Atmospheric Conditions</span>
              <span className="text-xs font-medium text-emerald-800 bg-[#eaf3ed] px-2 py-0.5 rounded-full">
                {weather.condition}
              </span>
            </div>

            {/* Weather Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center space-x-2 text-gray-500 text-xs mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                  <span>Temperature</span>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {weather.temperature_c}°C
                  <span className="text-xs font-normal text-gray-500 ml-1">Feels {weather.apparent_temp_c}°C</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center space-x-2 text-gray-500 text-xs mb-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                  <span>Humidity</span>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {weather.relative_humidity}%
                  <span className="text-xs font-normal text-gray-500 ml-1">{weather.relative_humidity > 70 ? "High Moisture" : "Moderate"}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center space-x-2 text-gray-500 text-xs mb-1">
                  <Compass className="w-3.5 h-3.5 text-teal-500" />
                  <span>Wind Speed</span>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {weather.wind_speed_kmh} <span className="text-xs font-normal text-gray-500">km/h</span>
                </div>
                <div className="text-[10px] text-gray-400">Direction: {weather.wind_direction_cardinal} ({weather.wind_direction_deg}°)</div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center space-x-2 text-gray-500 text-xs mb-1">
                  <Layers className="w-3.5 h-3.5 text-purple-500" />
                  <span>Pressure</span>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {weather.pressure_hpa} <span className="text-xs font-normal text-gray-500">hPa</span>
                </div>
                <div className="text-[10px] text-gray-400">UV Index: {weather.uv_index}</div>
              </div>
            </div>
          </div>

          {/* Thermal Inversion Indicator */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900">
            <div className="flex items-center space-x-1.5 font-bold mb-0.5">
              <Activity className="w-3.5 h-3.5 text-amber-700" />
              <span>Boundary Layer & Thermal Inversion:</span>
            </div>
            <p className="text-amber-800 leading-relaxed text-[11px]">{weather.inversion_risk}</p>
          </div>
        </div>

      </div>

      {/* 3. YOUR AIRWISE BRIEFING (AI-GENERATED SUMMARY) */}
      <div className="bg-gradient-to-br from-[#163323] via-[#1b3d2b] to-[#122b1d] rounded-2xl p-6 text-white shadow-md border border-[#27533a]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#2d5c42] mb-5 gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">Your Airwise Briefing</h2>
              <p className="text-xs text-[#a0c7ad]">
                {briefing?.generated_by || "Google Gemini 2.5 Environmental Intelligence Engine"}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab("planner")}
            className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#849974] hover:bg-[#96ac85] text-white transition-colors self-start sm:self-auto"
          >
            <span>View Full 24h Routine</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loadingBriefing ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#b0d2bc]">Synthesizing environmental conditions & household risks...</p>
          </div>
        ) : briefing ? (
          <div className="space-y-4">
            
            {/* Headline & Summary */}
            <div>
              <h3 className="text-base font-semibold text-emerald-300 mb-1">{briefing.headline}</h3>
              <p className="text-sm text-gray-200 leading-relaxed">{briefing.summary}</p>
            </div>

            {/* 2-Column Reasoning: What is causing concern + Who should be careful */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block mb-1">
                  What is causing concern?
                </span>
                <p className="text-xs text-gray-200 leading-relaxed">
                  {briefing.what_is_causing_concern}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[11px] font-bold text-red-300 uppercase tracking-wider block mb-1">
                  Who should be particularly careful?
                </span>
                <p className="text-xs text-gray-200 leading-relaxed">
                  {briefing.who_should_be_careful}
                </p>
              </div>
            </div>

            {/* Priority Actions Today (The 3 Questions Answered: What, Why, Benefit) */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-[#b0d2bc] uppercase tracking-wider block mb-2.5">
                Priority Actions Today:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {briefing.priority_actions_today.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#204933]/60 border border-[#2e6245] space-y-2">
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                          What should I do?
                        </span>
                        <span className="text-xs font-semibold text-white">{item.action}</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-[#c5ded0] pl-6 border-l-2 border-emerald-500/30 ml-2 space-y-1">
                      <div>
                        <strong className="text-gray-300">Why: </strong>
                        <span>{item.reason}</span>
                      </div>
                      <div>
                        <strong className="text-emerald-300">Difference: </strong>
                        <span className="text-emerald-200">{item.benefit}</span>
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
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e0] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 mb-4 gap-2">
          <div>
            <h2 className="text-base font-bold text-gray-900 tracking-tight">24-Hour Diurnal Pollution Trend</h2>
            <p className="text-xs text-gray-500">Hourly NAQI and Particulate (PM2.5) concentrations with peak smog zones</p>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-[#f97316]" />
              <span className="text-gray-600 font-medium">PM2.5 (µg/m³)</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-gray-600 font-medium">Smog Inversion Peak</span>
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
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-gray-900 text-white p-2.5 rounded-lg text-xs shadow-lg space-y-1">
                        <div className="font-bold border-b border-gray-700 pb-1">{data.time} hrs</div>
                        <div>NAQI Sub-Index: <strong className="text-amber-400">{data.aqi}</strong></div>
                        <div>PM2.5: <strong className="text-orange-400">{data.pm25} µg/m³</strong></div>
                        <div>PM10: <strong>{data.pm10} µg/m³</strong></div>
                        {data.is_peak && (
                          <div className="text-[10px] text-red-400 font-semibold mt-1">⚠️ Peak Smog Inversion Window</div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={60} stroke="#84cc16" strokeDasharray="3 3" label={{ value: "NAQI Satisfactory (60)", fill: "#84cc16", fontSize: 10 }} />
              <ReferenceLine y={120} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "Very Poor (120)", fill: "#ef4444", fontSize: 10 }} />
              <Area type="monotone" dataKey="pm25" stroke="#ea580c" strokeWidth={2.5} fillOpacity={1} fill="url(#pm25Gradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-xl flex items-center justify-between text-xs text-gray-600">
          <span>💡 <strong>Atmospheric Insight:</strong> Particulate peaks occur between 06:00 – 09:00 AM due to cold nocturnal ground cooling. Midday warming (12:00 – 15:30 PM) disperses the boundary layer.</span>
          <button
            onClick={() => onNavigateTab("indoor")}
            className="text-xs font-semibold text-[#163323] hover:underline shrink-0 ml-3"
          >
            Ventilation Timing →
          </button>
        </div>
      </div>

      {/* 5. CRITERIA POLLUTANTS DETAILED BREAKDOWN */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900 tracking-tight">Criteria Pollutant Telemetry</h2>
          <span className="text-xs text-gray-500">Benchmark against WHO 24-hr Air Quality Guidelines</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pollutantsList.map((p) => {
            const isHigh = p.data.times_who > 1.5;
            return (
              <div key={p.key} className="bg-white p-4 rounded-xl border border-[#e2e8e0] shadow-2xs hover:border-[#849974] transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-gray-900">{p.name}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isHigh ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}>
                    {p.data.times_who}× WHO
                  </span>
                </div>
                <div className="text-2xl font-black text-gray-900">
                  {p.data.value} <span className="text-xs font-normal text-gray-500">{p.data.unit}</span>
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">{p.label}</div>
                <p className="text-[11px] text-gray-600 mt-2 pt-2 border-t border-gray-100 leading-snug">
                  {p.impact}
                </p>
                <div className="mt-2 text-[10px] text-gray-400">
                  WHO 24h standard: {p.who_guide} • NAQI Sub-Index: <strong>{p.data.subindex}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Hyperlocal Monitoring Station & Ambient Dispersion Map */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e0] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 mb-4 gap-2">
          <div>
            <h2 className="text-base font-bold text-gray-900 tracking-tight">Hyperlocal Station Mapping & Airshed Radius</h2>
            <p className="text-xs text-gray-500">Live geographic proximity to ground monitoring station in {envData.location.name}</p>
          </div>
          <div className="text-xs text-gray-600 bg-gray-50 px-3 py-1 rounded-xl border border-gray-200">
            Station: <strong>{prov.station.name}</strong> ({prov.station.distance_km} km)
          </div>
        </div>
        <AirQualityMap envData={envData} />
      </div>

      {/* 7. Quick Action Links & Community Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Family Shield Summary Card */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8e0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[#163323] font-bold text-sm mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Household Protection Status</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              Configured for <strong>{userProfile.household_size} members</strong> ({userProfile.has_children ? "Children, " : ""}{userProfile.has_elderly ? "Elderly, " : ""}Vulnerabilities: {userProfile.vulnerabilities.join(", ") || "None"}).
            </p>
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-semibold">Today's Family Exposure Rule:</div>
              <div>Keep school children indoors during recess if AQI remains &gt;200. Restrict senior morning walks.</div>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab("family")}
            className="mt-4 w-full py-2 bg-gray-50 hover:bg-[#163323] hover:text-white rounded-xl text-xs font-semibold text-gray-700 transition-colors flex items-center justify-center space-x-1"
          >
            <span>Manage Family Safety Rules</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sustainable Living Snapshot Card */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8e0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[#163323] font-bold text-sm mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Community Impact & Sustainable Swaps</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              Explore everyday sustainable swaps (e.g. Metro transit, battery inverters, leaf composting) or model community-scale reductions in our What-If Simulator.
            </p>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-gray-500 uppercase font-semibold block">Swaps Catalog</span>
                <span className="font-bold text-emerald-800 text-sm">6 Verified Swaps</span>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-gray-500 uppercase font-semibold block">What-If Tool</span>
                <span className="font-bold text-emerald-800 text-sm">Active Simulator</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => onNavigateTab("swaps")}
              className="py-2 bg-[#163323] text-white hover:bg-[#204933] rounded-xl text-xs font-semibold transition-colors"
            >
              Explore Swaps
            </button>
            <button
              onClick={() => onNavigateTab("community")}
              className="py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition-colors"
            >
              Run Simulator
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
