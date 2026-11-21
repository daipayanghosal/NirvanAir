import React, { useState } from "react";
import {
  Users2,
  Sliders,
  Sparkles,
  TreePine,
  Car,
  Zap,
  Trash2,
  DollarSign,
  AlertTriangle,
  Info,
  Award,
  Flame,
  CheckCircle2,
  BarChart3,
  HelpCircle
} from "lucide-react";
import { SimulatorResults } from "../types";
import { runSimulation } from "../services/api";

interface CommunityViewProps {
  initialSimulatorData?: SimulatorResults | null;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  initialSimulatorData
}) => {
  // Simulator input parameters
  const [numHouseholds, setNumHouseholds] = useState(100);
  const [vehicleReduction, setVehicleReduction] = useState(20);
  const [dieselGensetReduction, setDieselGensetReduction] = useState(30);
  const [wasteComposting, setWasteComposting] = useState(25);
  const [energyConservation, setEnergyConservation] = useState(15);
  
  const [simResults, setSimResults] = useState<SimulatorResults | null>(initialSimulatorData || null);
  const [simulating, setSimulating] = useState(false);

  // Recalculate simulation dynamically
  const handleSimulate = async () => {
    setSimulating(true);
    const results = await runSimulation({
      num_households: numHouseholds,
      vehicle_reduction_percent: vehicleReduction,
      diesel_genset_reduction_percent: dieselGensetReduction,
      waste_composting_percent: wasteComposting,
      energy_conservation_percent: energyConservation
    });
    setSimResults(results);
    setSimulating(false);
  };

  // Run on first load if null
  React.useEffect(() => {
    if (!simResults) {
      handleSimulate();
    }
  }, []);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e0] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#163323] uppercase tracking-wider mb-1">
            <Users2 className="w-4 h-4 text-emerald-600" />
            <span>Collective Environmental Intelligence</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Community Impact & What-If Simulator</h1>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Model the aggregate environmental and financial benefits of collective neighborhood action over a 30-day period.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs bg-gray-50 p-3 rounded-xl border border-gray-200 shrink-0">
          <div className="text-right">
            <span className="font-bold text-gray-900 block">Durgapur Action Hub</span>
            <span className="text-[10px] text-gray-500">342 Participating Households</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#163323] text-white flex items-center justify-center font-bold text-xs">
            #4
          </div>
        </div>
      </div>

      {/* 1. SIGNATURE FEATURE: "WHAT-IF" NEIGHBORHOOD SIMULATOR */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e0] shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-5">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-base font-bold text-gray-900 tracking-tight">
                Neighborhood "What-If" Scenario Simulator
              </h2>
              <span className="text-xs text-gray-500">
                Adjust sliders to model realistic 30-day mass emission reductions across community cohorts
              </span>
            </div>
          </div>

          <button
            onClick={handleSimulate}
            disabled={simulating}
            className="px-4 py-2 bg-[#163323] hover:bg-[#204933] text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{simulating ? "Calculating..." : "Update Projection"}</span>
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          
          {/* 1. Households Slider */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-1.5">
              <span>Participating Households:</span>
              <span className="font-bold text-[#163323] text-sm">{numHouseholds} homes</span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={numHouseholds}
              onChange={(e) => setNumHouseholds(Number(e.target.value))}
              className="w-full accent-[#163323]"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>10 homes (Lane)</span>
              <span>1,000 homes (Ward)</span>
            </div>
          </div>

          {/* 2. Vehicle Trip Reduction */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-1.5">
              <span>Private Vehicle Reduction:</span>
              <span className="font-bold text-blue-700 text-sm">{vehicleReduction}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={vehicleReduction}
              onChange={(e) => setVehicleReduction(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>0% (Solo Car/Bike)</span>
              <span>100% (Full Transit/Cycling)</span>
            </div>
          </div>

          {/* 3. Diesel Generator Reduction */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-1.5">
              <span>Diesel Genset Reduction:</span>
              <span className="font-bold text-amber-700 text-sm">{dieselGensetReduction}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={dieselGensetReduction}
              onChange={(e) => setDieselGensetReduction(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>0% (Fossil Backup)</span>
              <span>100% (Solar/Battery Inverter)</span>
            </div>
          </div>

          {/* 4. Organic Waste Composting */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-1.5">
              <span>Open Waste Burning Diverted:</span>
              <span className="font-bold text-emerald-700 text-sm">{wasteComposting}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={wasteComposting}
              onChange={(e) => setWasteComposting(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>0% (Street Smoldering)</span>
              <span>100% (Composting / Mulch)</span>
            </div>
          </div>

          {/* 5. Electricity Conservation */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-1.5">
              <span>Household Energy Conservation:</span>
              <span className="font-bold text-purple-700 text-sm">{energyConservation}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={energyConservation}
              onChange={(e) => setEnergyConservation(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>0%</span>
              <span>50% (Star-rated / LED)</span>
            </div>
          </div>

          {/* Quick Scenario Preset Button */}
          <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 flex flex-col justify-between text-xs">
            <div>
              <span className="font-bold text-emerald-950 block">Quick Benchmark Scenario:</span>
              <span className="text-emerald-800 text-[11px]">
                "What if 100 households reduced private vehicle usage by 20%?"
              </span>
            </div>
            <button
              onClick={() => {
                setNumHouseholds(100);
                setVehicleReduction(20);
                setDieselGensetReduction(30);
                setWasteComposting(25);
                setEnergyConservation(15);
                handleSimulate();
              }}
              className="mt-2 text-xs font-bold text-[#163323] hover:underline text-left"
            >
              Apply Benchmark Preset →
            </button>
          </div>

        </div>

        {/* Calculated Simulation Results Display */}
        {simResults && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Projected 30-Day Airshed Benefit
              </span>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Cohort: {numHouseholds} Homes
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
              
              <div className="p-3 bg-[#f8faf8] border border-[#e2ece4] rounded-xl text-center">
                <div className="text-[10px] text-gray-500 uppercase font-semibold">Travel Distance</div>
                <div className="text-lg font-black text-gray-900 mt-0.5">
                  {simResults.results.vehicle_km_avoided.toLocaleString()} <span className="text-xs font-normal text-gray-500">km</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">Vehicle travel averted</div>
              </div>

              <div className="p-3 bg-[#f8faf8] border border-[#e2ece4] rounded-xl text-center">
                <div className="text-[10px] text-gray-500 uppercase font-semibold">Fuel Conserved</div>
                <div className="text-lg font-black text-blue-700 mt-0.5">
                  {simResults.results.fuel_saved_litres.toLocaleString()} <span className="text-xs font-normal text-gray-500">L</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">Petrol & Diesel saved</div>
              </div>

              <div className="p-3 bg-[#f8faf8] border border-[#e2ece4] rounded-xl text-center">
                <div className="text-[10px] text-gray-500 uppercase font-semibold">CO₂ Prevented</div>
                <div className="text-lg font-black text-emerald-700 mt-0.5">
                  {simResults.results.co2_avoided_kg.toLocaleString()} <span className="text-xs font-normal text-gray-500">kg</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">≈ {simResults.results.clean_air_equivalent_tree_years} tree-years</div>
              </div>

              <div className="p-3 bg-[#f8faf8] border border-[#e2ece4] rounded-xl text-center">
                <div className="text-[10px] text-gray-500 uppercase font-semibold">PM2.5 Soot Stopped</div>
                <div className="text-lg font-black text-amber-600 mt-0.5">
                  {simResults.results.pm25_emissions_prevented_kg} <span className="text-xs font-normal text-gray-500">kg</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">Toxic mass from tailpipe</div>
              </div>

              <div className="p-3 bg-[#f8faf8] border border-[#e2ece4] rounded-xl text-center">
                <div className="text-[10px] text-gray-500 uppercase font-semibold">NOx Exhaust Cut</div>
                <div className="text-lg font-black text-indigo-700 mt-0.5">
                  {simResults.results.nox_emissions_prevented_kg} <span className="text-xs font-normal text-gray-500">kg</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">Smog precursors averted</div>
              </div>

              <div className="p-3 bg-[#f8faf8] border border-[#e2ece4] rounded-xl text-center">
                <div className="text-[10px] text-gray-500 uppercase font-semibold">Community Savings</div>
                <div className="text-lg font-black text-emerald-800 mt-0.5">
                  ₹{simResults.results.estimated_community_savings_inr.toLocaleString()}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">Direct economic dividend</div>
              </div>

            </div>

            {/* Crucial Scientific Disclaimer */}
            <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-xl text-xs text-amber-950 flex items-start space-x-3">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-amber-950 block">Scientific Integrity Disclaimer:</span>
                <p className="text-amber-900 leading-relaxed text-[11px]">
                  {simResults.scientific_integrity_disclaimer}
                </p>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 2. Community Initiatives & Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Neighborhood Clean-Air Initiatives */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8e0] shadow-xs">
          <div className="flex items-center space-x-2 mb-3">
            <Award className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-gray-900">Active Neighborhood Initiatives (Durgapur Hub)</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start space-x-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900 block">Decentralized Leaf Composting Station</strong>
                <span className="text-gray-600">
                  Sector 2B Community Park has installed 4 aerobic composting pits, eliminating 100% of evening biomass leaf burning across 120 residential plots.
                </span>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start space-x-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900 block">Industrial Corridor School Bus Carpooling</strong>
                <span className="text-gray-600">
                  48 families pooled school transit into shared CNG minibuses, eliminating 90 individual two-wheeler morning trips during peak inversion hours.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Community Clean-Air Leaderboard */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8e0] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h3 className="font-bold text-sm text-gray-900">Community Action Leaderboard</h3>
            </div>
            <span className="text-[11px] text-gray-400">November 2026</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs">1</span>
                <div>
                  <span className="font-bold text-gray-900">City Centre Eco-Warriors</span>
                  <span className="text-[10px] text-gray-500 block">42 Active Households</span>
                </div>
              </div>
              <span className="font-black text-amber-800">485 kg CO₂ saved</span>
            </div>

            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-gray-300 text-gray-800 font-bold flex items-center justify-center text-xs">2</span>
                <div>
                  <span className="font-bold text-gray-900">B-Zone Green Society</span>
                  <span className="text-[10px] text-gray-500 block">38 Active Households</span>
                </div>
              </div>
              <span className="font-black text-gray-800">392 kg CO₂ saved</span>
            </div>

            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center text-xs">3</span>
                <div>
                  <span className="font-bold text-gray-900">Benachity Transit Champions</span>
                  <span className="text-[10px] text-gray-500 block">29 Active Households</span>
                </div>
              </div>
              <span className="font-black text-gray-800">310 kg CO₂ saved</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
