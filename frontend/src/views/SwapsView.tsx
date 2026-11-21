import React, { useState } from "react";
import {
  RefreshCw,
  Leaf,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
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
      case "Mobility & Transport": return <Car className="w-4 h-4 text-blue-700" />;
      case "Power & Energy": return <Zap className="w-4 h-4 text-amber-700" />;
      case "Waste & Air Protection": return <Trash2 className="w-4 h-4 text-emerald-700" />;
      case "Indoor Health": return <HeartPulse className="w-4 h-4 text-rose-700" />;
      case "Material & Plastics": return <Package className="w-4 h-4 text-purple-700" />;
      default: return <Leaf className="w-4 h-4 text-emerald-700" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-[#ffffff] rounded-[28px] p-6 border border-[#c2c9bf]/40 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 m3-label-medium text-[#1e6b45] uppercase tracking-wider mb-1">
            <RefreshCw className="w-4 h-4 text-[#1e6b45]" />
            <span>Signature Engine</span>
          </div>
          <h1 className="m3-headline-small text-[#191d19]">Sustainable Swap Engine</h1>
          <p className="m3-body-small text-[#727972] mt-0.5 max-w-xl">
            Identify high-emission everyday habits and adopt quantified low-carbon alternatives. Every recommendation features transparent calculations and financial savings.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#d3e8d4] px-4 py-2 rounded-full text-xs font-bold text-[#0e1f13] shrink-0">
          <Flame className="w-4 h-4 text-amber-600 fill-amber-600" />
          <span>{recordedSwapIds.length} Swaps Active This Month</span>
        </div>
      </div>

      {/* M3 Cumulative Impact Surface Card */}
      {impactData && (
        <div className="bg-[#1e6b45] rounded-[32px] p-6 text-white shadow-sm border border-[#1e6b45]/60">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/15 mb-4">
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-5 h-5 text-[#bbf3cd]" />
              <h2 className="m3-title-small text-white uppercase tracking-wider">
                Your Cumulative Monthly Impact (30-Day Projection)
              </h2>
            </div>
            <span className="text-[11px] text-[#bbf3cd] font-mono">
              {impactData.swaps_count} recorded habits
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            
            <div className="p-4 bg-white/10 rounded-[24px] border border-white/15">
              <div className="m3-label-small text-[#bbf3cd] uppercase">CO₂ Emissions Avoided</div>
              <div className="text-2xl font-black text-white mt-1">
                {impactData.total_co2_saved_kg} <span className="text-xs font-normal text-[#bbf3cd]">kg</span>
              </div>
              <div className="text-[10px] text-white/70 mt-0.5">≈ {impactData.trees_equivalent} mature tree-years</div>
            </div>

            <div className="p-4 bg-white/10 rounded-[24px] border border-white/15">
              <div className="m3-label-small text-amber-200 uppercase">Toxic PM2.5 Prevented</div>
              <div className="text-2xl font-black text-amber-300 mt-1">
                {impactData.total_pm25_avoided_grams} <span className="text-xs font-normal text-amber-200">g</span>
              </div>
              <div className="text-[10px] text-white/70 mt-0.5">Soot averted from airshed</div>
            </div>

            <div className="p-4 bg-white/10 rounded-[24px] border border-white/15">
              <div className="m3-label-small text-[#beeaf2] uppercase">Fossil Fuel Saved</div>
              <div className="text-2xl font-black text-[#beeaf2] mt-1">
                {impactData.total_fuel_saved_litres} <span className="text-xs font-normal text-[#beeaf2]">L</span>
              </div>
              <div className="text-[10px] text-white/70 mt-0.5">Petrol / Diesel eliminated</div>
            </div>

            <div className="p-4 bg-white/10 rounded-[24px] border border-white/15">
              <div className="m3-label-small text-[#bbf3cd] uppercase">Household Savings</div>
              <div className="text-2xl font-black text-[#bbf3cd] mt-1">
                ₹{impactData.total_financial_savings_inr.toLocaleString()}
              </div>
              <div className="text-[10px] text-white/70 mt-0.5">Direct economic dividend</div>
            </div>

          </div>
        </div>
      )}

      {/* M3 Filter Chips Row */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-[#1e6b45] text-white shadow-xs"
                : "bg-[#ffffff] text-[#424942] border border-[#c2c9bf]/60 hover:bg-[#ebf0e8]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* M3 Swaps Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSwaps.map((swap) => {
          const isRecorded = recordedSwapIds.includes(swap.id);
          const showMath = expandedMath[swap.id] || false;

          return (
            <div
              key={swap.id}
              className={`bg-[#ffffff] rounded-[28px] p-6 border transition-all flex flex-col justify-between ${
                isRecorded ? "border-[#1e6b45] ring-2 ring-[#1e6b45]/20 shadow-xs" : "border-[#c2c9bf]/40 shadow-xs hover:border-[#1e6b45]"
              }`}
            >
              <div>
                {/* Header: Category & Difficulty */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#f1f5ed] flex items-center justify-center">
                      {getCategoryIcon(swap.category)}
                    </div>
                    <span className="m3-label-small text-[#506353] uppercase tracking-wider">
                      {swap.category}
                    </span>
                  </div>

                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    swap.difficulty === "Easy"
                      ? "bg-[#d3e8d4] text-[#0e1f13]"
                      : swap.difficulty === "Moderate"
                      ? "bg-amber-100 text-amber-900"
                      : "bg-[#beeaf2] text-[#001f24]"
                  }`}>
                    {swap.difficulty} Difficulty
                  </span>
                </div>

                <h3 className="m3-title-medium text-[#191d19] mb-3">
                  {swap.title}
                </h3>

                {/* Existing vs Proposed Box */}
                <div className="grid grid-cols-1 gap-2.5 text-xs mb-4">
                  <div className="p-3.5 bg-[#ffdad6]/40 rounded-[20px] border border-[#ffdad6] text-[#410002]">
                    <span className="text-[10px] font-bold text-[#ba1a1a] uppercase tracking-wider block mb-0.5">
                      Existing High-Emission Activity:
                    </span>
                    <span className="leading-snug">{swap.existing_activity}</span>
                  </div>

                  <div className="p-3.5 bg-[#d3e8d4]/40 rounded-[20px] border border-[#d3e8d4] text-[#0e1f13]">
                    <span className="text-[10px] font-bold text-[#1e6b45] uppercase tracking-wider block mb-0.5">
                      Proposed Clean Alternative:
                    </span>
                    <span className="font-bold leading-snug">{swap.proposed_alternative}</span>
                  </div>
                </div>

                {/* Quantified Metrics: CO2, PM2.5 & Financial Savings */}
                <div className="grid grid-cols-2 gap-2.5 text-xs mb-4">
                  <div className="p-3 bg-[#f1f5ed] rounded-[20px] border border-[#c2c9bf]/30">
                    <span className="m3-label-small text-[#727972] uppercase block">Environmental Gain</span>
                    <span className="font-black text-[#1e6b45] text-sm">
                      {swap.environmental_benefit.co2_saved_kg_per_day} kg CO₂/day
                    </span>
                    <span className="text-[10px] text-[#506353] block">
                      +{swap.environmental_benefit.pm25_avoided_g_per_day}g PM2.5 avoided
                    </span>
                  </div>

                  <div className="p-3 bg-[#f1f5ed] rounded-[20px] border border-[#c2c9bf]/30">
                    <span className="m3-label-small text-[#727972] uppercase block">Financial Value</span>
                    <span className="font-black text-[#1e6b45] text-sm">
                      ₹{swap.financial_implications.daily_savings_inr}/day
                    </span>
                    <span className="text-[10px] text-[#506353] block">
                      ₹{swap.financial_implications.annual_savings_inr.toLocaleString()}/year
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-[#506353] mb-4 bg-[#f1f5ed] p-2.5 rounded-[16px]">
                  <strong>Economics:</strong> {swap.financial_implications.cost_notes}
                </div>
              </div>

              {/* Action Buttons & Transparent Math Toggle */}
              <div>
                <div className="flex items-center justify-between pt-3 border-t border-[#c2c9bf]/30">
                  <button
                    onClick={() => toggleMath(swap.id)}
                    className="text-[11px] font-bold text-[#506353] hover:text-[#191d19] flex items-center space-x-1"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>{showMath ? "Hide Methodology" : "View Math & Factors"}</span>
                    {showMath ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {isRecorded ? (
                    <button
                      onClick={() => onRemoveRecordedSwap(swap.id)}
                      className="px-4 py-2 bg-[#d3e8d4] text-[#0e1f13] hover:bg-[#bbf3cd] rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1e6b45]" />
                      <span>Recorded (Undo)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRecord(swap.id)}
                      className="px-4 py-2 bg-[#1e6b45] hover:bg-[#155335] text-white rounded-full text-xs font-bold transition-transform active:scale-95 shadow-xs"
                    >
                      Record Completed Swap
                    </button>
                  )}
                </div>

                {/* Calculation Methodology Breakdown */}
                {showMath && (
                  <div className="mt-3 p-3.5 bg-[#f1f5ed] rounded-[20px] border border-[#c2c9bf]/40 text-[11px] text-[#424942] animate-in fade-in space-y-1">
                    <strong className="text-[#191d19] block font-bold">Calculation Physics & Standards:</strong>
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
