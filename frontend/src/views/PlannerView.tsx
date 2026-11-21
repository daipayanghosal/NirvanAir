import React, { useState } from "react";
import {
  CalendarCheck,
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
  RefreshCw,
  Compass
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
      case "Sun": return <Sun className="w-5 h-5 text-amber-500" />;
      case "Activity": return <Activity className="w-5 h-5 text-rose-500" />;
      case "Navigation": return <Navigation className="w-5 h-5 text-blue-500" />;
      case "ShoppingBag": return <ShoppingBag className="w-5 h-5 text-emerald-500" />;
      case "ShieldAlert": return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case "Utensils": return <Utensils className="w-5 h-5 text-orange-500" />;
      case "Moon": return <Moon className="w-5 h-5 text-indigo-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const aqi = envData.air_quality.aqi;
  const category = envData.air_quality.category;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e0] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#163323] uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>AI Dynamic Daily Routine</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Personalized Clean-Air Schedule</h1>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Customized 24-hour guidance harmonizing your schedule with real-time atmospheric inversion dynamics ({aqi} NAQI — {category}) in {envData.location.name}.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setIsEditingPreferences(!isEditingPreferences)}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isEditingPreferences ? "Close Preferences" : "Customize Lifestyle"}</span>
          </button>
          <button
            onClick={onRefreshPlan}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-[#163323] hover:bg-[#204933] text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate Plan</span>
          </button>
        </div>
      </div>

      {/* Preference Customizer Drawer */}
      {isEditingPreferences && (
        <div className="bg-[#f8faf8] border border-[#d6e5d9] p-5 rounded-2xl animate-in fade-in slide-in-from-top-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#163323] mb-3">
            Lifestyle & Household Preferences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Primary Commute Mode</label>
              <select
                value={commuteMode}
                onChange={(e) => setCommuteMode(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#163323]"
              >
                <option value="two-wheeler">Motorcycle / Scooter (Two-Wheeler)</option>
                <option value="car">Private Petrol / Diesel Car</option>
                <option value="public_transit">Metro / Bus / Train</option>
                <option value="cycling_walking">Bicycle / Walking</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Exercise Preference</label>
              <select
                value={exercisePref}
                onChange={(e) => setExercisePref(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#163323]"
              >
                <option value="morning_outdoor">Outdoor Jogging / Running (Morning)</option>
                <option value="evening_outdoor">Outdoor Walking (Evening)</option>
                <option value="indoor_gym">Indoor Gym / Treadmill</option>
                <option value="home_yoga">Home Yoga / Calisthenics</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Budget Allocation</label>
              <select
                value={budget}
                onChange={(e: any) => setBudget(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#163323]"
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
              className="px-4 py-1.5 bg-[#163323] text-white text-xs font-semibold rounded-lg hover:bg-[#204933] transition-colors"
            >
              Apply Changes & Recalculate Plan
            </button>
          </div>
        </div>
      )}

      {/* Atmospheric Context Callout */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-start space-x-3 text-xs text-[#163323]">
        <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Diurnal Smog Inversion Awareness:</span>
          <span className="ml-1 text-emerald-900">
            {aqi > 200
              ? `Due to high surface particulate density (${aqi} NAQI), strenuous morning outdoor activities are shifted indoors or to the 1:30 PM – 3:30 PM solar dispersal window.`
              : `Current air conditions allow moderate outdoor activity, but commuter respiratory protection remains advised.`}
          </span>
        </div>
      </div>

      {/* 7-Segment Timeline Grid */}
      <div className="space-y-4">
        {planSegments.map((segment, idx) => {
          const isExpanded = expandedAlternatives[idx] || false;
          const isCritical = segment.status === "critical";
          const isAdjusted = segment.status === "adjusted";

          return (
            <div
              key={idx}
              className={`bg-white rounded-2xl p-5 border transition-all ${
                isCritical
                  ? "border-amber-300 shadow-sm"
                  : isAdjusted
                  ? "border-emerald-300 shadow-xs"
                  : "border-[#e2e8e0] shadow-xs"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    {getSegmentIcon(segment.icon)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-sm font-bold text-gray-900 tracking-tight">{segment.segment}</h2>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isCritical
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : isAdjusted
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}>
                        {segment.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs text-gray-500 mt-0.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{segment.time_window}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleAlternative(idx)}
                  className="text-xs font-semibold text-[#163323] hover:text-emerald-700 flex items-center space-x-1 self-start sm:self-auto bg-gray-50 hover:bg-gray-100 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <span>{isExpanded ? "Hide Alternative" : "Alternative Plan"}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* The Core 3 Questions Card Body */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
                
                {/* 1. What should I do? */}
                <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-[#163323]" />
                    <span>1. What should I do?</span>
                  </div>
                  <p className="font-semibold text-gray-900 leading-snug">
                    {segment.suggested_activity}
                  </p>
                </div>

                {/* 2. Why should I do it? */}
                <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    <span>2. Why should I do it?</span>
                  </div>
                  <p className="text-gray-700 leading-snug">
                    {segment.reasoning}
                  </p>
                </div>

                {/* 3. What difference will it make? */}
                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>3. Expected Benefit</span>
                  </div>
                  <p className="font-semibold text-emerald-950 leading-snug">
                    {segment.expected_benefit}
                  </p>
                </div>

              </div>

              {/* Alternative Accordion */}
              {isExpanded && (
                <div className="mt-3 p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 animate-in fade-in">
                  <strong className="block text-[11px] font-bold text-amber-950 mb-0.5">
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
