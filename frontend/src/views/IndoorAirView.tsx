import React, { useState } from "react";
import {
  Home,
  Wind,
  ShieldCheck,
  Sparkles,
  Wrench,
  Clock,
  HelpCircle,
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

  const [filterAgeDays, setFilterAgeDays] = useState(45);
  const [dailyHours, setDailyHours] = useState(12);

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
  const isSafeVentilationHour = currentHour >= 13 && currentHour <= 15;

  const toggleCheck = (id: string) => {
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updated);

    const totalCount = activeMode === "budget" ? 5 : 6;
    const currentCompleted = Object.values(updated).filter(Boolean).length;
    if (currentCompleted >= totalCount) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const maxRatedHours = aqi > 250 ? 1800 : aqi > 150 ? 2400 : 3000;
  const totalUsedHours = filterAgeDays * dailyHours;
  const filterLifePercent = Math.max(0, Math.min(100, Math.round(((maxRatedHours - totalUsedHours) / maxRatedHours) * 100)));

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header with M3 Segmented Button */}
      <div className="bg-[#ffffff] rounded-[28px] p-6 border border-[#c2c9bf]/40 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 m3-label-medium text-[#1e6b45] uppercase tracking-wider mb-1">
            <Home className="w-4 h-4 text-[#1e6b45]" />
            <span>Indoor Air Quality Improvement</span>
          </div>
          <h1 className="m3-headline-small text-[#191d19]">Indoor Air Doctor & Protocols</h1>
          <p className="m3-body-small text-[#727972] mt-0.5 max-w-xl">
            Clean air interventions, DIY Corsi-Rosenthal construction, ventilation timing, and household hygiene to maintain indoor PM2.5 below WHO standards.
          </p>
        </div>

        {/* M3 Segmented Button */}
        <div className="flex items-center p-1 bg-[#ebf0e8] rounded-full border border-[#c2c9bf]/50 shrink-0">
          <button
            onClick={() => setActiveMode("budget")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeMode === "budget"
                ? "bg-[#1e6b45] text-white shadow-xs"
                : "text-[#424942] hover:text-[#191d19]"
            }`}
          >
            Budget Mode (DIY)
          </button>
          <button
            onClick={() => setActiveMode("advanced")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeMode === "advanced"
                ? "bg-[#1e6b45] text-white shadow-xs"
                : "text-[#424942] hover:text-[#191d19]"
            }`}
          >
            Advanced (HEPA)
          </button>
        </div>
      </div>

      {/* 1. Live Ventilation Timing Guidance Banner */}
      <div className={`p-5 rounded-[26px] border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isSafeVentilationHour
          ? "bg-[#d3e8d4]/60 border-[#1e6b45]/30 text-[#0e1f13]"
          : "bg-[#ffdad6]/60 border-[#ba1a1a]/30 text-[#410002]"
      }`}>
        <div className="flex items-start space-x-3.5">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
            isSafeVentilationHour ? "bg-[#1e6b45] text-white" : "bg-[#ba1a1a] text-white"
          }`}>
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm uppercase tracking-tight">
                {isSafeVentilationHour ? "Safe Ventilation Window Active (1:00 PM – 3:30 PM)" : "Keep All Windows Sealed Now"}
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                isSafeVentilationHour ? "bg-[#bbf3cd] text-[#002111]" : "bg-[#ffdad6] text-[#410002]"
              }`}>
                Diurnal Boundary Layer
              </span>
            </div>
            <p className="m3-body-small mt-1 max-w-2xl leading-relaxed opacity-90">
              {isSafeVentilationHour
                ? "Solar warming has lifted the atmospheric inversion layer, reducing ground-level PM2.5. You may open leeward windows for 15–20 minutes to exchange stale indoor CO2."
                : `Current outside AQI is ${aqi} (${envData.air_quality.category}). Surface temperature inversion traps vehicle exhaust and coal smoke near ground level. Opening windows now will flood living spaces with fine particles.`}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="m3-label-small text-[#506353] uppercase">Recommended Window</div>
          <div className="text-base font-black text-[#191d19]">01:00 PM – 03:30 PM</div>
        </div>
      </div>

      {/* 2. CRUCIAL SCIENTIFIC FACT: Houseplants vs HEPA Filtration */}
      <div className="p-5 rounded-[26px] bg-[#191d19] text-white border border-[#424942] flex items-start space-x-3.5 text-xs shadow-xs">
        <div className="w-9 h-9 rounded-2xl bg-amber-400 text-black flex items-center justify-center shrink-0 font-bold">
          <HelpCircle className="w-5 h-5 text-black" />
        </div>
        <div className="space-y-1">
          <span className="m3-title-small text-amber-300 block">
            Scientific Clarification: Do Houseplants Clean Smog?
          </span>
          <p className="text-white/80 leading-relaxed text-xs">
            <strong>No.</strong> While plants (Snake Plant, Areca Palm) metabolize tiny amounts of chemical VOCs inside sealed 1-m³ NASA chambers over days, <strong>they have zero mechanical filtration capacity for microscopic particulate matter (PM2.5 / PM10)</strong>. Relying on houseplants instead of mechanical filtration during acute winter smog leaves lungs completely unprotected. Effective filtration requires active volumetric air passage through high-density fibrous media (HEPA / MERV-13).
          </p>
        </div>
      </div>

      {/* 3. Mode Specific Protocols */}
      {activeMode === "budget" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* DIY Corsi-Rosenthal Box Air Purifier */}
          <div className="bg-[#ffffff] rounded-[28px] p-6 border border-[#c2c9bf]/40 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 rounded-2xl bg-[#d3e8d4] text-[#0e1f13] flex items-center justify-center font-bold">
                    <Wrench className="w-4 h-4 text-[#1e6b45]" />
                  </div>
                  <h3 className="m3-title-small text-[#191d19]">DIY Corsi-Rosenthal Box Purifier</h3>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#bbf3cd] text-[#002111]">
                  Total Cost: ~₹1,800
                </span>
              </div>
              <p className="m3-body-small text-[#424942] leading-relaxed mb-4">
                Constructed using a standard 12-inch or 16-inch domestic box fan taped to a MERV-13 or HEPA filter panel. Delivers over <strong>200 CFM CADR (Clean Air Delivery Rate)</strong>, performing identically to commercial ₹14,000 branded units.
              </p>

              <div className="space-y-2 text-xs bg-[#f1f5ed] p-4 rounded-[22px] border border-[#c2c9bf]/30 mb-4">
                <div className="m3-label-small text-[#191d19] uppercase tracking-wider">Bill of Materials (BOM):</div>
                <ul className="space-y-1.5 text-[#424942] pl-4 list-disc">
                  <li>Standard 12" domestic box fan (~₹1,100)</li>
                  <li>1× MERV-13 or True HEPA H13 replacement filter sheet (20x20") (~₹650)</li>
                  <li>Duct tape or packing tape (~₹50)</li>
                  <li>Cardboard shroud with 11" circular cutout to prevent air recirculation</li>
                </ul>
              </div>
            </div>

            <div className="p-3.5 bg-[#d3e8d4]/40 rounded-[20px] border border-[#d3e8d4] text-xs text-[#0e1f13]">
              <span><strong>Efficiency:</strong> Removes 85–92% of indoor PM2.5 in a 150 sq ft room within 30 minutes.</span>
            </div>
          </div>

          {/* Low-Cost Household Interventions */}
          <div className="bg-[#ffffff] rounded-[28px] p-6 border border-[#c2c9bf]/40 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-9 h-9 rounded-2xl bg-[#beeaf2] text-[#001f24] flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4 text-[#3a656e]" />
                </div>
                <h3 className="m3-title-small text-[#191d19]">Zero-Cost & Low-Cost Hygiene Rules</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-[20px] bg-[#f1f5ed] border border-[#c2c9bf]/30">
                  <strong className="text-[#191d19] block mb-0.5">1. Damp Mopping vs Dry Sweeping</strong>
                  <span className="text-[#424942] leading-relaxed">
                    Dry straw brooms re-suspend settled toxic coarse PM10 particles into your breathing zone for 2–3 hours. Always wet-mop with plain water or mild disinfectant twice daily.
                  </span>
                </div>

                <div className="p-3.5 rounded-[20px] bg-[#f1f5ed] border border-[#c2c9bf]/30">
                  <strong className="text-[#191d19] block mb-0.5">2. Window Damp Cotton Barrier</strong>
                  <span className="text-[#424942] leading-relaxed">
                    Hanging thick, damp cotton sheets or towels over window grilles during morning smog creates a capillary moisture trap that captures outdoor coarse dust.
                  </span>
                </div>

                <div className="p-3.5 rounded-[20px] bg-[#f1f5ed] border border-[#c2c9bf]/30">
                  <strong className="text-[#191d19] block mb-0.5">3. Door Draft Weatherstripping</strong>
                  <span className="text-[#424942] leading-relaxed">
                    Place rolled damp towels at the threshold of exterior doors to block ground-level dust infiltration through under-door gaps.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-[#ebf0e8] rounded-[20px] text-xs text-[#506353]">
              💡 <em>Total monthly cost of these protocols: ₹0. Cumulative particulate exposure averted: &gt;50%.</em>
            </div>
          </div>

        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Advanced HEPA & Sensor Protocols */}
          <div className="bg-[#ffffff] rounded-[28px] p-6 border border-[#c2c9bf]/40 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-9 h-9 rounded-2xl bg-[#d3e8d4] text-[#0e1f13] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#1e6b45]" />
                </div>
                <h3 className="m3-title-small text-[#191d19]">True HEPA (H13) Continuous Filtration</h3>
              </div>
              <p className="m3-body-small text-[#424942] leading-relaxed mb-4">
                Mechanical filtration with H13-certified borosilicate microfibers removes 99.97% of particles down to 0.3 microns. Maintain continuous operation in occupied bedrooms.
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-[20px] bg-[#f1f5ed] border border-[#c2c9bf]/30">
                  <strong className="text-[#191d19] block mb-0.5">Placement Strategy</strong>
                  <span className="text-[#424942]">
                    Place purifier 3 feet away from walls and at least 4 feet from the bed headboard. Elevate off the floor by 6–12 inches for optimal convective circular airflow.
                  </span>
                </div>

                <div className="p-3.5 rounded-[20px] bg-[#f1f5ed] border border-[#c2c9bf]/30">
                  <strong className="text-[#191d19] block mb-0.5">Optical Sensor Calibration</strong>
                  <span className="text-[#424942]">
                    Clean the rear infrared/laser optical dust sensor every 30 days with a dry cotton swab to prevent sensor drift and incorrect fan speed throttling.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3.5 bg-[#d3e8d4]/40 rounded-[20px] border border-[#d3e8d4] text-xs text-[#0e1f13]">
              <span><strong>Target Threshold:</strong> Maintain bedroom PM2.5 &lt; 15 µg/m³ continuously during sleep.</span>
            </div>
          </div>

          {/* M3 Filter Life Estimator */}
          <div className="bg-[#ffffff] rounded-[28px] p-6 border border-[#c2c9bf]/40 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-2xl bg-[#beeaf2] text-[#001f24] flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4 text-[#3a656e]" />
                </div>
                <h3 className="m3-title-small text-[#191d19]">HEPA Filter Life Estimator</h3>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                filterLifePercent > 30 ? "bg-[#bbf3cd] text-[#002111]" : "bg-[#ffdad6] text-[#ba1a1a]"
              }`}>
                {filterLifePercent}% Health Remaining
              </span>
            </div>

            <p className="m3-body-small text-[#727972] mb-4">
              Calculates remaining filtration media capacity based on ambient winter smog density ({aqi} NAQI).
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-bold text-[#191d19] mb-1.5">
                  <span>Current Filter Age in Use:</span>
                  <span>{filterAgeDays} days</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="180"
                  value={filterAgeDays}
                  onChange={(e) => setFilterAgeDays(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-[#191d19] mb-1.5">
                  <span>Average Daily Operation:</span>
                  <span>{dailyHours} hours/day</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="24"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* M3 Progress Bar */}
              <div className="pt-2">
                <div className="h-3.5 w-full bg-[#ebf0e8] rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      filterLifePercent > 50 ? "bg-[#1e6b45]" : filterLifePercent > 20 ? "bg-amber-500" : "bg-[#ba1a1a]"
                    }`}
                    style={{ width: `${filterLifePercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[#727972] mt-1.5">
                  <span>{totalUsedHours} hours logged</span>
                  <span>Est. Replacement: {filterLifePercent <= 15 ? "Immediate Replacement Recommended" : `In ~${Math.round((maxRatedHours - totalUsedHours) / dailyHours)} days`}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 4. M3 Household Checklist */}
      <div className="bg-[#ffffff] rounded-[28px] p-6 border border-[#c2c9bf]/40 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#c2c9bf]/30 mb-4 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-[#1e6b45]" />
              <h2 className="m3-title-medium text-[#191d19]">Household Clean Air Checklist</h2>
            </div>
            <p className="m3-body-small text-[#727972]">Track and complete daily habits to maintain a safe indoor sanctuary</p>
          </div>

          <div className="text-xs font-bold px-4 py-1.5 bg-[#d3e8d4] text-[#0e1f13] rounded-full self-start sm:self-auto">
            {Object.values(checkedItems).filter(Boolean).length} / {Object.keys(checkedItems).length} Actions Completed
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          
          <div
            onClick={() => toggleCheck("chk_ventilation")}
            className={`p-4 rounded-[22px] border cursor-pointer transition-all flex items-start space-x-3.5 ${
              checkedItems.chk_ventilation ? "bg-[#d3e8d4]/40 border-[#1e6b45]/40" : "bg-[#f1f5ed] border-[#c2c9bf]/40 hover:bg-[#ebf0e8]"
            }`}
          >
            <input
              type="checkbox"
              checked={checkedItems.chk_ventilation}
              onChange={() => {}}
              className="mt-0.5 rounded-md text-[#1e6b45] focus:ring-[#1e6b45] w-4 h-4"
            />
            <div className="text-xs">
              <span className="font-bold text-[#191d19] block mb-0.5">Strict Ventilation Timing Window</span>
              <span className="text-[#424942] leading-snug">
                Windows kept sealed during morning smog (06:00 – 10:00). Micro-ventilation only during solar midday.
              </span>
            </div>
          </div>

          <div
            onClick={() => toggleCheck("chk_no_combustion")}
            className={`p-4 rounded-[22px] border cursor-pointer transition-all flex items-start space-x-3.5 ${
              checkedItems.chk_no_combustion ? "bg-[#d3e8d4]/40 border-[#1e6b45]/40" : "bg-[#f1f5ed] border-[#c2c9bf]/40 hover:bg-[#ebf0e8]"
            }`}
          >
            <input
              type="checkbox"
              checked={checkedItems.chk_no_combustion}
              onChange={() => {}}
              className="mt-0.5 rounded-md text-[#1e6b45] focus:ring-[#1e6b45] w-4 h-4"
            />
            <div className="text-xs">
              <span className="font-bold text-[#191d19] block mb-0.5">Zero Indoor Smoldering Combustion</span>
              <span className="text-[#424942] leading-snug">
                Eliminated burning of incense (agarbatti), dhoop, and mosquito coils. Switched to liquid repellents.
              </span>
            </div>
          </div>

          <div
            onClick={() => toggleCheck("chk_wet_mop")}
            className={`p-4 rounded-[22px] border cursor-pointer transition-all flex items-start space-x-3.5 ${
              checkedItems.chk_wet_mop ? "bg-[#d3e8d4]/40 border-[#1e6b45]/40" : "bg-[#f1f5ed] border-[#c2c9bf]/40 hover:bg-[#ebf0e8]"
            }`}
          >
            <input
              type="checkbox"
              checked={checkedItems.chk_wet_mop}
              onChange={() => {}}
              className="mt-0.5 rounded-md text-[#1e6b45] focus:ring-[#1e6b45] w-4 h-4"
            />
            <div className="text-xs">
              <span className="font-bold text-[#191d19] block mb-0.5">Twice-Daily Damp Mopping</span>
              <span className="text-[#424942] leading-snug">
                Replaced dry sweeping with damp microfiber mopping to avoid re-suspending settled dust.
              </span>
            </div>
          </div>

          <div
            onClick={() => toggleCheck("chk_exhaust_fan")}
            className={`p-4 rounded-[22px] border cursor-pointer transition-all flex items-start space-x-3.5 ${
              checkedItems.chk_exhaust_fan ? "bg-[#d3e8d4]/40 border-[#1e6b45]/40" : "bg-[#f1f5ed] border-[#c2c9bf]/40 hover:bg-[#ebf0e8]"
            }`}
          >
            <input
              type="checkbox"
              checked={checkedItems.chk_exhaust_fan}
              onChange={() => {}}
              className="mt-0.5 rounded-md text-[#1e6b45] focus:ring-[#1e6b45] w-4 h-4"
            />
            <div className="text-xs">
              <span className="font-bold text-[#191d19] block mb-0.5">Kitchen Exhaust Fan Discipline</span>
              <span className="text-[#424942] leading-snug">
                Operate kitchen exhaust with kitchen door closed during all frying or spice roasting.
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
