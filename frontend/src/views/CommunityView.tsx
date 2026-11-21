import React, { useState } from "react";
import {
  Users2,
  Sparkles,
  AlertTriangle,
  Award,
  Flame,
  CheckCircle2,
  BarChart3
} from "lucide-react";
import { SimulatorResults } from "../types";
import { runSimulation, runCommunityScenario } from "../services/api";

interface CommunityViewProps {
  initialSimulatorData?: SimulatorResults | null;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  initialSimulatorData
}) => {
  const [numHouseholds, setNumHouseholds] = useState(100);
  const [vehicleReduction, setVehicleReduction] = useState(20);
  const [dieselGensetReduction, setDieselGensetReduction] = useState(30);
  const [wasteComposting, setWasteComposting] = useState(25);
  const [energyConservation, setEnergyConservation] = useState(15);
  
  const [simResults, setSimResults] = useState<SimulatorResults>(() => {
    if (initialSimulatorData) return initialSimulatorData;
    return runCommunityScenario({
      num_households: 100,
      vehicle_reduction_percent: 20,
      diesel_genset_reduction_percent: 30,
      waste_composting_percent: 25,
      energy_conservation_percent: 15
    });
  });
  const [simulating, setSimulating] = useState(false);

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

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-[#ffffff] rounded-[28px] p-6 border border-[#c2c9bf]/40 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 m3-label-medium text-[#1e6b45] uppercase tracking-wider mb-1">
            <Users2 className="w-4 h-4 text-[#1e6b45]" />
            <span>Collective Environmental Intelligence</span>
          </div>
          <h1 className="m3-headline-small text-[#191d19]">Community Impact & What-If Simulator</h1>
          <p className="m3-body-small text-[#727972] mt-0.5 max-w-xl">
            Model the aggregate environmental and financial benefits of collective neighborhood action over a 30-day period.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs bg-[#f1f5ed] p-3.5 rounded-[22px] border border-[#c2c9bf]/40 shrink-0">
          <div className="text-right">
            <span className="font-bold text-[#191d19] block">Durgapur Action Hub</span>
            <span className="text-[10px] text-[#506353]">342 Participating Homes</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#1e6b45] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            #4
          </div>
        </div>
      </div>

      {/* 1. M3 "WHAT-IF" NEIGHBORHOOD SIMULATOR */}
      <div className="bg-[#ffffff] rounded-[28px] p-6 border border-[#c2c9bf]/40 shadow-xs">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#c2c9bf]/30 mb-5">
          <div className="flex items-center space-x-2.5">
            <BarChart3 className="w-5 h-5 text-[#1e6b45]" />
            <div>
              <h2 className="m3-title-medium text-[#191d19]">
                Neighborhood "What-If" Scenario Simulator
              </h2>
              <span className="m3-body-small text-[#727972]">
                Adjust sliders to model 30-day mass emission reductions across community cohorts
              </span>
            </div>
          </div>

          <button
            onClick={handleSimulate}
            disabled={simulating}
            className="px-5 py-2.5 bg-[#1e6b45] hover:bg-[#155335] text-white rounded-full text-xs font-bold transition-transform active:scale-95 shadow-xs shrink-0 flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#bbf3cd]" />
            <span>{simulating ? "Calculating..." : "Update Projection"}</span>
          </button>
        </div>

        {/* Sliders Grid with Material 3 styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          
          {/* 1. Households Slider */}
          <div className="p-4 bg-[#f1f5ed] rounded-[22px] border border-[#c2c9bf]/30">
            <div className="flex justify-between items-center text-xs font-bold text-[#191d19] mb-2">
              <span>Participating Households:</span>
              <span className="font-black text-[#1e6b45] text-sm">{numHouseholds} homes</span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={numHouseholds}
              onChange={(e) => setNumHouseholds(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-[#727972] mt-1.5">
              <span>10 homes (Lane)</span>
              <span>1,000 homes (Ward)</span>
            </div>
          </div>

          {/* 2. Vehicle Trip Reduction */}
          <div className="p-4 bg-[#f1f5ed] rounded-[22px] border border-[#c2c9bf]/30">
            <div className="flex justify-between items-center text-xs font-bold text-[#191d19] mb-2">
              <span>Private Vehicle Reduction:</span>
              <span className="font-black text-blue-700 text-sm">{vehicleReduction}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={vehicleReduction}
              onChange={(e) => setVehicleReduction(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-[#727972] mt-1.5">
              <span>0% (Solo Car/Bike)</span>
              <span>100% (Full Transit)</span>
            </div>
          </div>

          {/* 3. Diesel Generator Reduction */}
          <div className="p-4 bg-[#f1f5ed] rounded-[22px] border border-[#c2c9bf]/30">
            <div className="flex justify-between items-center text-xs font-bold text-[#191d19] mb-2">
              <span>Diesel Genset Reduction:</span>
              <span className="font-black text-amber-700 text-sm">{dieselGensetReduction}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={dieselGensetReduction}
              onChange={(e) => setDieselGensetReduction(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-[#727972] mt-1.5">
              <span>0% (Fossil Backup)</span>
              <span>100% (Battery/Solar)</span>
            </div>
          </div>

          {/* 4. Organic Waste Composting */}
          <div className="p-4 bg-[#f1f5ed] rounded-[22px] border border-[#c2c9bf]/30">
            <div className="flex justify-between items-center text-xs font-bold text-[#191d19] mb-2">
              <span>Waste Burning Diverted:</span>
              <span className="font-black text-[#1e6b45] text-sm">{wasteComposting}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={wasteComposting}
              onChange={(e) => setWasteComposting(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-[#727972] mt-1.5">
              <span>0% (Street Smolder)</span>
              <span>100% (Composting)</span>
            </div>
          </div>

          {/* 5. Electricity Conservation */}
          <div className="p-4 bg-[#f1f5ed] rounded-[22px] border border-[#c2c9bf]/30">
            <div className="flex justify-between items-center text-xs font-bold text-[#191d19] mb-2">
              <span>Energy Conservation:</span>
              <span className="font-black text-purple-700 text-sm">{energyConservation}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={energyConservation}
              onChange={(e) => setEnergyConservation(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-[#727972] mt-1.5">
              <span>0%</span>
              <span>50% (Star-Rated)</span>
            </div>
          </div>

          {/* Quick Scenario Preset Button */}
          <div className="p-4 bg-[#d3e8d4]/40 rounded-[22px] border border-[#d3e8d4] flex flex-col justify-between text-xs">
            <div>
              <span className="font-bold text-[#0e1f13] block">Benchmark Scenario:</span>
              <span className="text-[#0e1f13]/80 text-[11px]">
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
              className="mt-2 text-xs font-bold text-[#1e6b45] hover:underline text-left"
            >
              Apply Benchmark Preset →
            </button>
          </div>

        </div>

        {/* Calculated Simulation Results Display */}
        {simResults && (
          <div className="mt-6 pt-6 border-t border-[#c2c9bf]/30">
            <div className="flex items-center space-x-2 mb-3">
              <span className="m3-label-small text-[#727972] uppercase tracking-wider">
                Projected 30-Day Airshed Benefit
              </span>
              <span className="text-[11px] font-mono font-bold text-[#0e1f13] bg-[#d3e8d4] px-2.5 py-0.5 rounded-full">
                Cohort: {numHouseholds} Homes
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
              
              <div className="p-3.5 bg-[#f1f5ed] border border-[#c2c9bf]/30 rounded-[20px] text-center">
                <div className="text-[10px] text-[#727972] uppercase font-bold">Travel Distance</div>
                <div className="text-lg font-black text-[#191d19] mt-0.5">
                  {simResults.results.vehicle_km_avoided.toLocaleString()} <span className="text-xs font-normal text-[#727972]">km</span>
                </div>
                <div className="text-[10px] text-[#506353] mt-0.5">Vehicle-km avoided</div>
              </div>

              <div className="p-3.5 bg-[#f1f5ed] border border-[#c2c9bf]/30 rounded-[20px] text-center">
                <div className="text-[10px] text-[#727972] uppercase font-bold">Fuel Conserved</div>
                <div className="text-lg font-black text-blue-700 mt-0.5">
                  {simResults.results.fuel_saved_litres.toLocaleString()} <span className="text-xs font-normal text-[#727972]">L</span>
                </div>
                <div className="text-[10px] text-[#506353] mt-0.5">Petrol & Diesel saved</div>
              </div>

              <div className="p-3.5 bg-[#f1f5ed] border border-[#c2c9bf]/30 rounded-[20px] text-center">
                <div className="text-[10px] text-[#727972] uppercase font-bold">CO₂ Prevented</div>
                <div className="text-lg font-black text-[#1e6b45] mt-0.5">
                  {simResults.results.co2_avoided_kg.toLocaleString()} <span className="text-xs font-normal text-[#727972]">kg</span>
                </div>
                <div className="text-[10px] text-[#506353] mt-0.5">≈ {simResults.results.clean_air_equivalent_tree_years} tree-years</div>
              </div>

              <div className="p-3.5 bg-[#f1f5ed] border border-[#c2c9bf]/30 rounded-[20px] text-center">
                <div className="text-[10px] text-[#727972] uppercase font-bold">PM2.5 Soot Stopped</div>
                <div className="text-lg font-black text-amber-700 mt-0.5">
                  {simResults.results.pm25_emissions_prevented_kg} <span className="text-xs font-normal text-[#727972]">kg</span>
                </div>
                <div className="text-[10px] text-[#506353] mt-0.5">Toxic mass from tailpipe</div>
              </div>

              <div className="p-3.5 bg-[#f1f5ed] border border-[#c2c9bf]/30 rounded-[20px] text-center">
                <div className="text-[10px] text-[#727972] uppercase font-bold">NOx Exhaust Cut</div>
                <div className="text-lg font-black text-indigo-700 mt-0.5">
                  {simResults.results.nox_emissions_prevented_kg} <span className="text-xs font-normal text-[#727972]">kg</span>
                </div>
                <div className="text-[10px] text-[#506353] mt-0.5">Smog precursors cut</div>
              </div>

              <div className="p-3.5 bg-[#f1f5ed] border border-[#c2c9bf]/30 rounded-[20px] text-center">
                <div className="text-[10px] text-[#727972] uppercase font-bold">Community Savings</div>
                <div className="text-lg font-black text-[#1e6b45] mt-0.5">
                  ₹{simResults.results.estimated_community_savings_inr.toLocaleString()}
                </div>
                <div className="text-[10px] text-[#506353] mt-0.5">Direct economic dividend</div>
              </div>

            </div>

            {/* Crucial Scientific Disclaimer */}
            <div className="p-4 bg-[#ffdad6]/40 border border-[#ba1a1a]/30 rounded-[22px] text-xs text-[#410002] flex items-start space-x-3">
              <AlertTriangle className="w-4 h-4 text-[#ba1a1a] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-[#410002] block">Scientific Integrity Disclaimer:</span>
                <p className="text-[#410002]/90 leading-relaxed text-[11px]">
                  {simResults.scientific_integrity_disclaimer}
                </p>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 2. Community Initiatives & Leaderboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Neighborhood Clean-Air Initiatives */}
        <div className="bg-[#ffffff] p-6 rounded-[28px] border border-[#c2c9bf]/40 shadow-xs">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="w-5 h-5 text-[#1e6b45]" />
            <h3 className="m3-title-small text-[#191d19]">Active Neighborhood Initiatives</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-[#f1f5ed] rounded-[20px] border border-[#c2c9bf]/30 flex items-start space-x-3">
              <CheckCircle2 className="w-4 h-4 text-[#1e6b45] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#191d19] block mb-0.5">Decentralized Leaf Composting Station</strong>
                <span className="text-[#424942]">
                  Sector 2B Community Park has installed 4 aerobic composting pits, eliminating 100% of evening biomass leaf burning across 120 residential plots.
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-[#f1f5ed] rounded-[20px] border border-[#c2c9bf]/30 flex items-start space-x-3">
              <CheckCircle2 className="w-4 h-4 text-[#1e6b45] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#191d19] block mb-0.5">Industrial Corridor School Bus Carpooling</strong>
                <span className="text-[#424942]">
                  48 families pooled school transit into shared CNG minibuses, eliminating 90 individual two-wheeler morning trips during peak inversion hours.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Community Leaderboard */}
        <div className="bg-[#ffffff] p-6 rounded-[28px] border border-[#c2c9bf]/40 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h3 className="m3-title-small text-[#191d19]">Clean-Air Leaderboard</h3>
            </div>
            <span className="text-[11px] text-[#727972]">November 2026</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-[20px] bg-amber-50 border border-amber-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs shadow-xs">1</span>
                <div>
                  <span className="font-bold text-[#191d19]">City Centre Eco-Warriors</span>
                  <span className="text-[10px] text-[#506353] block">42 Active Households</span>
                </div>
              </div>
              <span className="font-black text-amber-800">485 kg CO₂ saved</span>
            </div>

            <div className="p-3 rounded-[20px] bg-[#f1f5ed] border border-[#c2c9bf]/30 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="w-7 h-7 rounded-full bg-[#c2c9bf] text-[#191d19] font-bold flex items-center justify-center text-xs">2</span>
                <div>
                  <span className="font-bold text-[#191d19]">B-Zone Green Society</span>
                  <span className="text-[10px] text-[#506353] block">38 Active Households</span>
                </div>
              </div>
              <span className="font-black text-[#191d19]">392 kg CO₂ saved</span>
            </div>

            <div className="p-3 rounded-[20px] bg-[#f1f5ed] border border-[#c2c9bf]/30 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="w-7 h-7 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center text-xs">3</span>
                <div>
                  <span className="font-bold text-[#191d19]">Benachity Transit Champions</span>
                  <span className="text-[10px] text-[#506353] block">29 Active Households</span>
                </div>
              </div>
              <span className="font-black text-[#191d19]">310 kg CO₂ saved</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
