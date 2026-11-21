import React, { useState } from "react";
import {
  Clock,
  Sparkles,
  Sun,
  Activity,
  Navigation,
  ShoppingBag,
  ShieldAlert,
  Utensils,
  Moon,
  ChevronDown,
  ChevronUp,
  Sliders,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { EnvironmentalData, UserProfile, DailyPlanSegment } from "../types";

interface PlannerViewProps {
  envData: EnvironmentalData;
  userProfile: UserProfile;
  planSegments: DailyPlanSegment[];
  onUpdateProfile: (profile: UserProfile) => void;
  onRefreshPlan: () => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  envData,
  userProfile,
  planSegments,
  onUpdateProfile,
  onRefreshPlan
}) => {
  const [expandedAlternatives, setExpandedAlternatives] = useState<Record<number, boolean>>({});
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [commuteMode, setCommuteMode] = useState(userProfile.commute_mode);
  const [exercisePref, setExercisePref] = useState(userProfile.exercise_pref);
  const [budget, setBudget] = useState(userProfile.budget);

  const toggleAlternative = (idx: number) => {
    setExpandedAlternatives(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSavePreferences = () => {
    onUpdateProfile({
      ...userProfile,
      commute_mode: commuteMode,
      exercise_pref: exercisePref,
      budget: budget
    });
    setIsEditingPreferences(false);
    onRefreshPlan();
  };

  const getSegmentIcon = (iconName: string) => {
    switch (iconName) {
      case "Sun": return <Sun className="w-5 h-5 text-amber-600" />;
      case "Activity": return <Activity className="w-5 h-5 text-rose-600" />;
      case "Navigation": return <Navigation className="w-5 h-5 text-blue-600" />;
      case "ShoppingBag": return <ShoppingBag className="w-5 h-5 text-emerald-600" />;
      case "ShieldAlert": return <ShieldAlert className="w-5 h-5 text-red-600" />;
      case "Utensils": return <Utensils className="w-5 h-5 text-orange-600" />;
      case "Moon": return <Moon className="w-5 h-5 text-indigo-600" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const aqi = envData.air_quality.aqi;
  const category = envData.air_quality.category;

  return (
    <div className="space-y-6 pb-12">
      
      {/* M3 Header Banner */}
      <div className="bg-[#ffffff] rounded-[28px] p-6 border border-[#c2c9bf]/40 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 m3-label-medium text-[#1e6b45] uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-[#1e6b45]" />
            <span>AI Dynamic Schedule</span>
          </div>
          <h1 className="m3-headline-small text-[#191d19]">Personalized Clean-Air Schedule</h1>
          <p className="m3-body-small text-[#727972] mt-0.5 max-w-xl">
            Customized 24-hour guidance harmonizing your schedule with real-time atmospheric inversion dynamics ({aqi} NAQI — {category}) in {envData.location.name}.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setIsEditingPreferences(!isEditingPreferences)}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-full bg-[#ebf0e8] hover:bg-[#dfe5dc] text-[#191d19] transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isEditingPreferences ? "Close Preferences" : "Customize Lifestyle"}</span>
          </button>
          <button
            onClick={onRefreshPlan}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-full bg-[#1e6b45] hover:bg-[#155335] text-white transition-transform active:scale-95 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate Plan</span>
          </button>
        </div>
      </div>

      {/* M3 Preference Customizer Drawer */}
      {isEditingPreferences && (
        <div className="bg-[#f1f5ed] border border-[#c2c9bf]/50 p-6 rounded-[28px] animate-in fade-in slide-in-from-top-2">
          <h3 className="m3-title-small text-[#191d19] mb-4">
            Lifestyle & Household Preferences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div>
              <label className="m3-label-medium text-[#424942] block mb-1.5">Primary Commute Mode</label>
              <select
                value={commuteMode}
                onChange={(e) => setCommuteMode(e.target.value)}
                className="w-full text-xs p-3 bg-white border border-[#c2c9bf]/60 rounded-2xl focus:ring-2 focus:ring-[#1e6b45] text-[#191d19]"
              >
                <option value="two-wheeler">Motorcycle / Scooter (Two-Wheeler)</option>
                <option value="car">Private Petrol / Diesel Car</option>
                <option value="public_transit">Metro / Bus / Train</option>
                <option value="cycling_walking">Bicycle / Walking</option>
              </select>
            </div>

            <div>
              <label className="m3-label-medium text-[#424942] block mb-1.5">Exercise Preference</label>
              <select
                value={exercisePref}
                onChange={(e) => setExercisePref(e.target.value)}
                className="w-full text-xs p-3 bg-white border border-[#c2c9bf]/60 rounded-2xl focus:ring-2 focus:ring-[#1e6b45] text-[#191d19]"
              >
                <option value="morning_outdoor">Outdoor Jogging / Running (Morning)</option>
                <option value="evening_outdoor">Outdoor Walking (Evening)</option>
                <option value="indoor_gym">Indoor Gym / Treadmill</option>
                <option value="home_yoga">Home Yoga / Calisthenics</option>
              </select>
            </div>

            <div>
              <label className="m3-label-medium text-[#424942] block mb-1.5">Budget Allocation</label>
              <select
                value={budget}
                onChange={(e: any) => setBudget(e.target.value)}
                className="w-full text-xs p-3 bg-white border border-[#c2c9bf]/60 rounded-2xl focus:ring-2 focus:ring-[#1e6b45] text-[#191d19]"
              >
                <option value="budget">Budget Mode (DIY & Zero-Cost Measures)</option>
                <option value="moderate">Moderate (Standard Filters & Masks)</option>
                <option value="premium">Premium (Smart Air Purifiers & Monitors)</option>
              </select>
            </div>

          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleSavePreferences}
              className="px-5 py-2.5 bg-[#1e6b45] text-white text-xs font-bold rounded-full hover:bg-[#155335] transition-transform active:scale-95 shadow-xs"
            >
              Apply Changes & Recalculate Plan
            </button>
          </div>
        </div>
      )}

      {/* Atmospheric Context Callout */}
      <div className="p-4 rounded-[24px] bg-[#d3e8d4]/60 border border-[#1e6b45]/30 flex items-start space-x-3 text-xs text-[#0e1f13]">
        <Clock className="w-4 h-4 text-[#1e6b45] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Diurnal Smog Inversion Awareness:</span>
          <span className="ml-1 opacity-90">
            {aqi > 200
              ? `Due to high surface particulate density (${aqi} NAQI), strenuous morning outdoor activities are shifted indoors or to the 1:30 PM – 3:30 PM solar dispersal window.`
              : `Current air conditions allow moderate outdoor activity, but commuter respiratory protection remains advised.`}
          </span>
        </div>
      </div>

      {/* 7-Segment Timeline Grid with M3 Cards */}
      <div className="space-y-4">
        {planSegments.map((segment, idx) => {
          const isExpanded = expandedAlternatives[idx] || false;
          const isCritical = segment.status === "critical";
          const isAdjusted = segment.status === "adjusted";

          return (
            <div
              key={idx}
              className={`bg-[#ffffff] rounded-[28px] p-6 border transition-all ${
                isCritical
                  ? "border-[#ba1a1a]/40 shadow-xs"
                  : isAdjusted
                  ? "border-[#1e6b45]/40 shadow-2xs"
                  : "border-[#c2c9bf]/40 shadow-2xs"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[#c2c9bf]/20 gap-2">
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#ebf0e8] flex items-center justify-center">
                    {getSegmentIcon(segment.icon)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="m3-title-small text-[#191d19]">{segment.segment}</h2>
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isCritical
                          ? "bg-[#ffdad6] text-[#ba1a1a]"
                          : isAdjusted
                          ? "bg-[#beeaf2] text-[#001f24]"
                          : "bg-[#d3e8d4] text-[#0e1f13]"
                      }`}>
                        {segment.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs text-[#506353] mt-0.5 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-[#727972]" />
                      <span>{segment.time_window}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleAlternative(idx)}
                  className="text-xs font-bold text-[#1e6b45] hover:text-[#155335] flex items-center space-x-1 self-start sm:self-auto bg-[#ebf0e8] hover:bg-[#dfe5dc] px-3.5 py-1.5 rounded-full transition-colors"
                >
                  <span>{isExpanded ? "Hide Alternative" : "Alternative Plan"}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* The Core 3 Questions M3 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
                
                {/* 1. What should I do? */}
                <div className="p-4 rounded-[22px] bg-[#f1f5ed] border border-[#c2c9bf]/30">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#727972] mb-1.5 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1e6b45]" />
                    <span>1. What should I do?</span>
                  </div>
                  <p className="font-bold text-[#191d19] leading-snug">
                    {segment.suggested_activity}
                  </p>
                </div>

                {/* 2. Why should I do it? */}
                <div className="p-4 rounded-[22px] bg-[#f1f5ed] border border-[#c2c9bf]/30">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#727972] mb-1.5 flex items-center space-x-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>2. Why should I do it?</span>
                  </div>
                  <p className="text-[#424942] leading-relaxed">
                    {segment.reasoning}
                  </p>
                </div>

                {/* 3. Expected Benefit */}
                <div className="p-4 rounded-[22px] bg-[#d3e8d4]/40 border border-[#d3e8d4]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#0e1f13] mb-1.5 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#1e6b45]" />
                    <span>3. Expected Difference</span>
                  </div>
                  <p className="font-bold text-[#0e1f13] leading-relaxed">
                    {segment.expected_benefit}
                  </p>
                </div>

              </div>

              {/* Alternative Accordion */}
              {isExpanded && (
                <div className="mt-3.5 p-4 bg-[#beeaf2]/40 border border-[#beeaf2] rounded-[22px] text-xs text-[#001f24] animate-in fade-in">
                  <strong className="block text-[11px] font-bold text-[#001f24] mb-0.5">
                    Feasible Alternative (If recommendation is impractical):
                  </strong>
                  <span>{segment.alternative}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
