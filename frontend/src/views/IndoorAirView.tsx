import React, { useState } from "react";
import {
  Home,
  Wind,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Wrench,
  Clock,
  Droplets,
  Flame,
  XCircle,
  HelpCircle,
  Sliders,
  Award
} from "lucide-react";
import confetti from "canvas-confetti";
import { EnvironmentalData, UserProfile } from "../types";

interface IndoorAirViewProps {
  envData: EnvironmentalData;
  userProfile: UserProfile;
}

export const IndoorAirView: React.FC<IndoorAirViewProps> = ({
  envData,
  userProfile
}) => {
  const [activeMode, setActiveMode] = useState<"budget" | "advanced">(
    userProfile.budget === "budget" ? "budget" : "advanced"
  );

  // Filter life calculator states
  const [filterAgeDays, setFilterAgeDays] = useState(45);
  const [dailyHours, setDailyHours] = useState(12);

  // Interactive Checklist states
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    chk_ventilation: true,
    chk_no_combustion: true,
    chk_wet_mop: false,
    chk_exhaust_fan: true,
    chk_budget_filter: false,
    chk_advanced_hepa: false,
    chk_smart_sensor: false
  });

  const aqi = envData.air_quality.aqi;
  const currentHour = new Date().getHours();
  // Safe ventilation window: 13:00 to 15:30
  const isSafeVentilationHour = currentHour >= 13 && currentHour <= 15;

  const toggleCheck = (id: string) => {
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updated);

    // If all checked in current mode, trigger confetti!
    const totalCount = activeMode === "budget" ? 5 : 6;
    const currentCompleted = Object.entries(updated).filter(([k, v]) => v).length;
    if (currentCompleted >= totalCount) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  // Filter Health Estimator: assuming standard HEPA lasts ~2,000 to 2,500 hours depending on ambient AQI
  const maxRatedHours = aqi > 250 ? 1800 : aqi > 150 ? 2400 : 3000;
  const totalUsedHours = filterAgeDays * dailyHours;
  const filterLifePercent = Math.max(0, Math.min(100, Math.round(((maxRatedHours - totalUsedHours) / maxRatedHours) * 100)));

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header with Mode Switcher */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e0] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#163323] uppercase tracking-wider mb-1">
            <Home className="w-4 h-4 text-emerald-600" />
            <span>Indoor Air Quality Improvement</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Indoor Air Doctor & Protocols</h1>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Clean air interventions, DIY Corsi-Rosenthal construction, ventilation timing, and household hygiene to maintain indoor PM2.5 below WHO standards.
          </p>
        </div>

        {/* Budget Mode vs Advanced Mode Switcher */}
        <div className="flex items-center p-1 bg-gray-100 rounded-xl border border-gray-200 shrink-0">
          <button
            onClick={() => setActiveMode("budget")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === "budget"
                ? "bg-[#163323] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Budget Mode (DIY & Low-Cost)
          </button>
          <button
            onClick={() => setActiveMode("advanced")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === "advanced"
                ? "bg-[#163323] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Advanced Mode (HEPA & Sensors)
          </button>
        </div>
      </div>

      {/* 1. Live Ventilation Timing Guidance Banner */}
      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isSafeVentilationHour
          ? "bg-emerald-50 border-emerald-200 text-emerald-950"
          : "bg-amber-50 border-amber-200 text-amber-950"
      }`}>
        <div className="flex items-start space-x-3.5">
          <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
            isSafeVentilationHour ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
          }`}>
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm uppercase tracking-tight">
                {isSafeVentilationHour ? "Safe Ventilation Window Active (1:00 PM – 3:30 PM)" : "Keep All Windows Sealed Now"}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isSafeVentilationHour ? "bg-emerald-200/80 text-emerald-900" : "bg-amber-200/80 text-amber-900"
              }`}>
                Diurnal Boundary Layer
              </span>
            </div>
            <p className="text-xs text-current/80 mt-1 max-w-2xl leading-relaxed">
              {isSafeVentilationHour
                ? "Solar warming has lifted the atmospheric inversion layer, reducing ground-level PM2.5. You may open leeward windows for 15–20 minutes to exchange stale indoor CO2."
                : `Current outside AQI is ${aqi} (${envData.air_quality.category}). Surface temperature inversion traps vehicle exhaust and coal smoke at ground level. Opening windows now will flood living spaces with fine particles.`}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-[11px] font-semibold text-gray-500 uppercase">Recommended Window</div>
          <div className="text-sm font-black text-gray-900">01:00 PM – 03:30 PM</div>
        </div>
      </div>

      {/* 2. CRUCIAL SCIENTIFIC FACT: Houseplants vs HEPA Filtration */}
      <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-700 flex items-start space-x-3 text-xs shadow-xs">
        <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-300 text-sm block">
            Scientific Clarification: Do Houseplants Clean Smog?
          </span>
          <p className="text-slate-300 leading-relaxed">
            <strong>No.</strong> While plants (e.g. Snake Plant, Areca Palm) metabolize tiny amounts of chemical VOCs inside sealed 1-cubic-meter NASA laboratory chambers over many days, <strong>they have zero mechanical filtration capacity for microscopic particulate matter (PM2.5 / PM10)</strong>. Relying on houseplants instead of mechanical filtration during acute winter smog leaves lungs completely unprotected. True filtration requires active volumetric air passage through high-density fibrous media (HEPA / MERV-13).
          </p>
        </div>
      </div>

      {/* 3. Mode Specific Protocols: Budget DIY vs Advanced */}
      {activeMode === "budget" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* DIY Corsi-Rosenthal Box Air Purifier */}
          <div className="bg-white rounded-2xl p-6 border border-[#e2e8e0] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900">DIY Corsi-Rosenthal Air Purifier</h3>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Total Cost: ~₹1,800
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Constructed using a standard 12-inch or 16-inch domestic box fan taped to a MERV-13 or HEPA filter panel. Delivers over <strong>200 CFM CADR (Clean Air Delivery Rate)</strong>, performing identically to commercial ₹14,000 branded units.
              </p>

              <div className="space-y-2 text-xs bg-gray-50 p-3.5 rounded-xl border border-gray-100 mb-4">
                <div className="font-bold text-gray-800 text-[11px] uppercase tracking-wider">Bill of Materials (BOM):</div>
                <ul className="space-y-1 text-gray-600 pl-4 list-disc">
                  <li>Standard 12" domestic box fan (~₹1,100)</li>
                  <li>1× MERV-13 or True HEPA H13 replacement filter sheet (20x20") (~₹650)</li>
                  <li>Duct tape or packing tape (~₹50)</li>
                  <li>Cardboard shroud with 11" circular cutout to prevent air recirculation</li>
                </ul>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-950 flex items-center justify-between">
              <span><strong>Efficiency:</strong> Removes 85–92% of indoor PM2.5 in a 150 sq ft room within 30 minutes.</span>
            </div>
          </div>

          {/* Low-Cost Household Interventions */}
          <div className="bg-white rounded-2xl p-6 border border-[#e2e8e0] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-gray-900">Zero-Cost & Low-Cost Hygiene Rules</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <strong className="text-gray-900 block mb-0.5">1. Damp Mopping vs Dry Sweeping</strong>
                  <span className="text-gray-600 leading-relaxed">
                    Dry straw brooms re-suspend settled toxic coarse PM10 particles into your breathing zone for 2–3 hours. Always wet-mop with plain water or mild disinfectant twice daily.
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <strong className="text-gray-900 block mb-0.5">2. Window Damp Cotton Barrier</strong>
                  <span className="text-gray-600 leading-relaxed">
                    Hanging thick, damp cotton sheets or towels over window grilles during morning smog creates a capillary moisture trap that captures outdoor coarse dust.
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <strong className="text-gray-900 block mb-0.5">3. Door Draft Weatherstripping</strong>
                  <span className="text-gray-600 leading-relaxed">
                    Place rolled damp towels at the threshold of exterior doors to block ground-level dust infiltration through under-door gaps.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-100 rounded-xl text-xs text-gray-700">
              💡 <em>Total monthly cost of these protocols: ₹0. Cumulative particulate exposure averted: &gt;50%.</em>
            </div>
          </div>

        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Advanced HEPA & Sensor Protocols */}
          <div className="bg-white rounded-2xl p-6 border border-[#e2e8e0] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-gray-900">True HEPA (H13) Continuous Filtration</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Mechanical filtration with H13-certified borosilicate microfibers removes 99.97% of particles down to 0.3 microns. Maintain continuous operation in occupied bedrooms.
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <strong className="text-gray-900 block mb-0.5">Placement Strategy</strong>
                  <span className="text-gray-600">
                    Place purifier 3 feet away from walls and at least 4 feet from the bed headboard. Elevate off the floor by 6–12 inches for optimal convective circular airflow.
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <strong className="text-gray-900 block mb-0.5">Optical Sensor Calibration</strong>
                  <span className="text-gray-600">
                    Clean the rear infrared/laser optical dust sensor every 30 days with a dry cotton swab to prevent sensor drift and incorrect fan speed throttling.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-indigo-950">
              <span><strong>Target Threshold:</strong> Maintain bedroom PM2.5 &lt; 15 µg/m³ continuously during sleep.</span>
            </div>
          </div>

          {/* Interactive Filter Life Estimator */}
          <div className="bg-white rounded-2xl p-6 border border-[#e2e8e0] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-gray-900">HEPA Filter Life Estimator</h3>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                filterLifePercent > 30 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
              }`}>
                {filterLifePercent}% Health Remaining
              </span>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Calculates remaining filtration media capacity based on ambient winter smog density ({aqi} NAQI).
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-gray-700 mb-1">
                  <span>Current Filter Age in Use:</span>
                  <span>{filterAgeDays} days</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="180"
                  value={filterAgeDays}
                  onChange={(e) => setFilterAgeDays(Number(e.target.value))}
                  className="w-full accent-[#163323]"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-gray-700 mb-1">
                  <span>Average Daily Operation:</span>
                  <span>{dailyHours} hours/day</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="24"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="w-full accent-[#163323]"
                />
              </div>

              {/* Progress bar */}
              <div className="pt-2">
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      filterLifePercent > 50 ? "bg-emerald-500" : filterLifePercent > 20 ? "bg-amber-500" : "bg-red-500"
                    }`}
                    style={{ width: `${filterLifePercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                  <span>{totalUsedHours} hours logged</span>
                  <span>Est. Replacement: {filterLifePercent <= 15 ? "Immediate Replacement Recommended" : `In ~${Math.round((maxRatedHours - totalUsedHours) / dailyHours)} days`}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 4. Interactive Household Checklist & Progress Tracker */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e0] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 mb-4 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-gray-900 tracking-tight">Household Clean Air Checklist</h2>
            </div>
            <p className="text-xs text-gray-500">Track and complete daily habits to maintain a safe indoor sanctuary</p>
          </div>

          <div className="text-xs font-semibold px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl self-start sm:self-auto">
            {Object.values(checkedItems).filter(Boolean).length} / {Object.keys(checkedItems).length} Actions Completed
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          
          <div
            onClick={() => toggleCheck("chk_ventilation")}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
              checkedItems.chk_ventilation ? "bg-emerald-50/50 border-emerald-200" : "bg-gray-50/60 border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              checked={checkedItems.chk_ventilation}
              onChange={() => {}}
              className="mt-0.5 rounded text-[#163323] focus:ring-[#163323]"
            />
            <div className="text-xs">
              <span className="font-bold text-gray-900 block">Strict Ventilation Timing Window</span>
              <span className="text-gray-600 leading-snug">
                Windows kept sealed during morning smog (06:00 – 10:00). Micro-ventilation only during solar midday.
              </span>
            </div>
          </div>

          <div
            onClick={() => toggleCheck("chk_no_combustion")}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
              checkedItems.chk_no_combustion ? "bg-emerald-50/50 border-emerald-200" : "bg-gray-50/60 border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              checked={checkedItems.chk_no_combustion}
              onChange={() => {}}
              className="mt-0.5 rounded text-[#163323] focus:ring-[#163323]"
            />
            <div className="text-xs">
              <span className="font-bold text-gray-900 block">Zero Indoor Smoldering Combustion</span>
              <span className="text-gray-600 leading-snug">
                Eliminated burning of incense (agarbatti), dhoop, and mosquito coils. Switched to liquid repellents.
              </span>
            </div>
          </div>

          <div
            onClick={() => toggleCheck("chk_wet_mop")}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
              checkedItems.chk_wet_mop ? "bg-emerald-50/50 border-emerald-200" : "bg-gray-50/60 border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              checked={checkedItems.chk_wet_mop}
              onChange={() => {}}
              className="mt-0.5 rounded text-[#163323] focus:ring-[#163323]"
            />
            <div className="text-xs">
              <span className="font-bold text-gray-900 block">Twice-Daily Damp Mopping</span>
              <span className="text-gray-600 leading-snug">
                Replaced dry sweeping with damp microfiber mopping to avoid re-suspending settled dust.
              </span>
            </div>
          </div>

          <div
            onClick={() => toggleCheck("chk_exhaust_fan")}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
              checkedItems.chk_exhaust_fan ? "bg-emerald-50/50 border-emerald-200" : "bg-gray-50/60 border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              checked={checkedItems.chk_exhaust_fan}
              onChange={() => {}}
              className="mt-0.5 rounded text-[#163323] focus:ring-[#163323]"
            />
            <div className="text-xs">
              <span className="font-bold text-gray-900 block">Kitchen Exhaust Fan Discipline</span>
              <span className="text-gray-600 leading-snug">
                Operate kitchen exhaust with kitchen door closed during all frying or spice roasting.
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
