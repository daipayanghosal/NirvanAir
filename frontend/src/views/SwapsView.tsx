import React, { useState } from "react";
import {
  RefreshCw,
  Leaf,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TreePine,
  Car,
  Zap,
  Trash2,
  HeartPulse,
  Package,
  Flame
} from "lucide-react";
import confetti from "canvas-confetti";
import { SustainableSwap, SwapImpactResult } from "../types";

interface SwapsViewProps {
  swaps: SustainableSwap[];
  recordedSwapIds: string[];
  impactData: SwapImpactResult | null;
  onRecordSwap: (swapId: string) => void;
  onRemoveRecordedSwap: (swapId: string) => void;
}

export const SwapsView: React.FC<SwapsViewProps> = ({
  swaps,
  recordedSwapIds,
  impactData,
  onRecordSwap,
  onRemoveRecordedSwap
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedMath, setExpandedMath] = useState<Record<string, boolean>>({});

  const categories = ["All", "Mobility & Transport", "Power & Energy", "Waste & Air Protection", "Indoor Health", "Material & Plastics"];

  const filteredSwaps = selectedCategory === "All"
    ? swaps
    : swaps.filter(s => s.category === selectedCategory);

  const toggleMath = (id: string) => {
    setExpandedMath(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRecord = (id: string) => {
    onRecordSwap(id);
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Mobility & Transport": return <Car className="w-4 h-4 text-blue-600" />;
      case "Power & Energy": return <Zap className="w-4 h-4 text-amber-600" />;
      case "Waste & Air Protection": return <Trash2 className="w-4 h-4 text-emerald-600" />;
      case "Indoor Health": return <HeartPulse className="w-4 h-4 text-rose-600" />;
      case "Material & Plastics": return <Package className="w-4 h-4 text-purple-600" />;
      default: return <Leaf className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e0] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#163323] uppercase tracking-wider mb-1">
            <RefreshCw className="w-4 h-4 text-emerald-600" />
            <span>Signature Engine</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Sustainable Swap Engine</h1>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Identify high-emission everyday habits and adopt quantified low-carbon alternatives. Every recommendation features transparent calculations and financial savings.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-900 shrink-0">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>{recordedSwapIds.length} Swaps Active This Month</span>
        </div>
      </div>

      {/* Cumulative Impact Dashboard */}
      {impactData && (
        <div className="bg-gradient-to-br from-[#163323] via-[#1b3d2b] to-[#122b1d] rounded-2xl p-6 text-white shadow-md border border-[#27533a]">
          <div className="flex items-center justify-between pb-3 border-b border-[#2d5c42] mb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold tracking-tight text-white uppercase">
                Your Cumulative Monthly Impact (30-Day Projection)
              </h2>
            </div>
            <span className="text-[11px] text-[#b0d2bc] font-mono">
              Based on {impactData.swaps_count} recorded lifestyle habits
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            
            <div className="p-3.5 bg-white/5 rounded-xl border border-white/10">
              <div className="text-[11px] text-[#a0c7ad] uppercase font-semibold">CO₂ Emissions Avoided</div>
              <div className="text-2xl font-black text-white mt-1">
                {impactData.total_co2_saved_kg} <span className="text-xs font-normal text-emerald-300">kg</span>
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">≈ {impactData.trees_equivalent} mature tree-years</div>
            </div>

            <div className="p-3.5 bg-white/5 rounded-xl border border-white/10">
              <div className="text-[11px] text-[#a0c7ad] uppercase font-semibold">Toxic PM2.5 Prevented</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {impactData.total_pm25_avoided_grams} <span className="text-xs font-normal text-amber-200">g</span>
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">Soot prevented from local airshed</div>
            </div>

            <div className="p-3.5 bg-white/5 rounded-xl border border-white/10">
              <div className="text-[11px] text-[#a0c7ad] uppercase font-semibold">Fossil Fuel Saved</div>
              <div className="text-2xl font-black text-teal-400 mt-1">
                {impactData.total_fuel_saved_litres} <span className="text-xs font-normal text-teal-200">L</span>
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">Petrol / Diesel eliminated</div>
            </div>

            <div className="p-3.5 bg-white/5 rounded-xl border border-white/10">
              <div className="text-[11px] text-[#a0c7ad] uppercase font-semibold">Net Household Savings</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                ₹{impactData.total_financial_savings_inr.toLocaleString()}
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">Reduced fuel & consumable spend</div>
            </div>

          </div>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? "bg-[#163323] text-white shadow-xs"
                : "bg-white text-gray-600 border border-[#e2e8e0] hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Swaps Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSwaps.map((swap) => {
          const isRecorded = recordedSwapIds.includes(swap.id);
          const showMath = expandedMath[swap.id] || false;

          return (
            <div
              key={swap.id}
              className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                isRecorded ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs" : "border-[#e2e8e0] shadow-xs hover:border-[#849974]"
              }`}
            >
              <div>
                {/* Card Header: Category & Difficulty */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-lg bg-gray-100">
                      {getCategoryIcon(swap.category)}
                    </div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      {swap.category}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    swap.difficulty === "Easy"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : swap.difficulty === "Moderate"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-purple-50 text-purple-700 border border-purple-200"
                  }`}>
                    {swap.difficulty} Difficulty
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 tracking-tight mb-3">
                  {swap.title}
                </h3>

                {/* Existing vs Proposed Box */}
                <div className="grid grid-cols-1 gap-2.5 text-xs mb-4">
                  <div className="p-3 bg-red-50/60 rounded-xl border border-red-100 text-red-950">
                    <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block mb-0.5">
                      Existing High-Emission Activity:
                    </span>
                    <span className="leading-snug">{swap.existing_activity}</span>
                  </div>

                  <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 text-emerald-950">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-0.5">
                      Proposed Clean Alternative:
                    </span>
                    <span className="font-semibold leading-snug">{swap.proposed_alternative}</span>
                  </div>
                </div>

                {/* Quantified Metrics: CO2, PM2.5 & Financial Savings */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase block">Environmental Gain</span>
                    <span className="font-extrabold text-emerald-700 text-sm">
                      {swap.environmental_benefit.co2_saved_kg_per_day} kg CO₂/day
                    </span>
                    <span className="text-[10px] text-gray-500 block">
                      +{swap.environmental_benefit.pm25_avoided_g_per_day}g PM2.5 avoided
                    </span>
                  </div>

                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase block">Financial Value</span>
                    <span className="font-extrabold text-emerald-700 text-sm">
                      ₹{swap.financial_implications.daily_savings_inr}/day
                    </span>
                    <span className="text-[10px] text-gray-500 block">
                      ₹{swap.financial_implications.annual_savings_inr.toLocaleString()}/year
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-gray-500 mb-4 bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                  <strong>Economics:</strong> {swap.financial_implications.cost_notes}
                </div>
              </div>

              {/* Action Buttons & Transparent Math Toggle */}
              <div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <button
                    onClick={() => toggleMath(swap.id)}
                    className="text-[11px] font-semibold text-gray-500 hover:text-gray-800 flex items-center space-x-1"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>{showMath ? "Hide Methodology" : "View Math & Factors"}</span>
                    {showMath ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {isRecorded ? (
                    <button
                      onClick={() => onRemoveRecordedSwap(swap.id)}
                      className="px-3 py-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Recorded (Click to undo)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRecord(swap.id)}
                      className="px-3 py-1.5 bg-[#163323] hover:bg-[#204933] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                    >
                      Record Completed Swap
                    </button>
                  )}
                </div>

                {/* Calculation Methodology Breakdown */}
                {showMath && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200 text-[11px] text-gray-700 animate-in fade-in space-y-1">
                    <strong className="text-gray-900 block font-bold">Calculation Physics & Standards:</strong>
                    <p className="leading-relaxed">{swap.calculation_explanation}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
