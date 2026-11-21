import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { OnboardingModal } from "./components/OnboardingModal";

import { OverviewView } from "./views/OverviewView";
import { PlannerView } from "./views/PlannerView";
import { IndoorAirView } from "./views/IndoorAirView";
import { SwapsView } from "./views/SwapsView";
import { FamilyView } from "./views/FamilyView";
import { CommunityView } from "./views/CommunityView";
import { AssistantView } from "./views/AssistantView";
import { SettingsView } from "./views/SettingsView";

import {
  EnvironmentalData,
  UserProfile,
  NirvanAirBriefing,
  DailyPlanSegment,
  SustainableSwap,
  SwapImpactResult
} from "./types";
import {
  DEMO_DURGAPUR_DATA,
  DEFAULT_USER_PROFILE,
  fetchAirQualityData,
  fetchNirvanAirBriefing,
  fetchDailyPlan,
  fetchSwaps,
  computeSwapImpact
} from "./services/api";

export function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Environmental Telemetry State
  const [envData, setEnvData] = useState<EnvironmentalData>(DEMO_DURGAPUR_DATA);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  // User Profile State (persisted in localStorage)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem("nirvanair_user_profile");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to parse saved user profile:", e);
    }
    return DEFAULT_USER_PROFILE;
  });

  // Mode and Standards
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [aqiStandard, setAqiStandard] = useState<"NAQI" | "USEPA">("NAQI");

  // AI Briefing State
  const [briefing, setBriefing] = useState<NirvanAirBriefing | null>(null);
  const [loadingBriefing, setLoadingBriefing] = useState<boolean>(false);

  // Daily Plan Segments
  const [planSegments, setPlanSegments] = useState<DailyPlanSegment[]>([]);

  // Swaps State
  const [swaps, setSwaps] = useState<SustainableSwap[]>([]);
  const [recordedSwapIds, setRecordedSwapIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("nirvanair_recorded_swaps");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ["swap_commute_car_to_metro", "swap_mosquito_coil_to_liquid_vaporizer"];
  });
  const [impactData, setImpactData] = useState<SwapImpactResult | null>(null);

  // Onboarding Modal State
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(() => {
    return !localStorage.getItem("nirvanair_onboarded_completed");
  });

  // Save profile to localStorage whenever changed
  useEffect(() => {
    localStorage.setItem("nirvanair_user_profile", JSON.stringify(userProfile));
  }, [userProfile]);

  // Save recorded swaps whenever changed
  useEffect(() => {
    localStorage.setItem("nirvanair_recorded_swaps", JSON.stringify(recordedSwapIds));
    computeSwapImpact(recordedSwapIds, 30).then(setImpactData);
  }, [recordedSwapIds]);

  // Initial Load: Fetch Swaps & Air Quality Data
  useEffect(() => {
    fetchSwaps().then(setSwaps);
    loadEnvironmentalData(userProfile.latitude, userProfile.longitude, userProfile.location_name, isDemoMode);
  }, []);

  const loadEnvironmentalData = async (lat: number, lon: number, locationName: string, demo: boolean) => {
    setLoadingData(true);
    try {
      const data = await fetchAirQualityData(lat, lon, locationName, demo);
      setEnvData(data);
      
      // Concurrently trigger briefing and plan generation
      setLoadingBriefing(true);
      fetchNirvanAirBriefing(data, userProfile)
        .then(setBriefing)
        .finally(() => setLoadingBriefing(false));

      fetchDailyPlan(data, userProfile)
        .then(setPlanSegments);
    } catch (err) {
      console.error("Failed to load telemetry:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleUpdateLocation = (name: string, lat: number, lon: number) => {
    const updated = { ...userProfile, location_name: name, latitude: lat, longitude: lon };
    setUserProfile(updated);
    loadEnvironmentalData(lat, lon, name, isDemoMode);
  };

  const handleToggleDemoMode = (demo: boolean) => {
    setIsDemoMode(demo);
    loadEnvironmentalData(userProfile.latitude, userProfile.longitude, userProfile.location_name, demo);
  };

  const handleRecordSwap = (swapId: string) => {
    if (!recordedSwapIds.includes(swapId)) {
      setRecordedSwapIds([...recordedSwapIds, swapId]);
    }
  };

  const handleRemoveRecordedSwap = (swapId: string) => {
    setRecordedSwapIds(recordedSwapIds.filter(id => id !== swapId));
  };

  const handleCompleteOnboarding = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem("nirvanair_onboarded_completed", "true");
    loadEnvironmentalData(newProfile.latitude, newProfile.longitude, newProfile.location_name, isDemoMode);
  };

  const handleResetAll = () => {
    if (confirm("Reset household profile and clear recorded swaps?")) {
      localStorage.clear();
      setUserProfile(DEFAULT_USER_PROFILE);
      setRecordedSwapIds([]);
      loadEnvironmentalData(DEFAULT_USER_PROFILE.latitude, DEFAULT_USER_PROFILE.longitude, DEFAULT_USER_PROFILE.location_name, false);
      alert("Application state reset to defaults.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fbf8] text-[#18201b] flex flex-col antialiased">
      
      {/* Top Navbar */}
      <Navbar
        envData={envData}
        userProfile={userProfile}
        onUpdateLocation={handleUpdateLocation}
        onOpenSettings={() => setActiveTab("settings")}
        onOpenOnboarding={() => setOnboardingOpen(true)}
        isDemoMode={isDemoMode}
        onToggleDemoMode={handleToggleDemoMode}
        aqiStandard={aqiStandard}
        onToggleAqiStandard={setAqiStandard}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Content Layout with Persistent Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        
        {/* Persistent Desktop Navigation Sidebar */}
        <div className="hidden md:block shrink-0">
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            swapsCount={recordedSwapIds.length}
          />
        </div>

        {/* Dynamic View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          
          {activeTab === "overview" && (
            <OverviewView
              envData={envData}
              userProfile={userProfile}
              briefing={briefing}
              loadingBriefing={loadingBriefing}
              aqiStandard={aqiStandard}
              onNavigateTab={setActiveTab}
              onRefreshData={() => loadEnvironmentalData(userProfile.latitude, userProfile.longitude, userProfile.location_name, isDemoMode)}
            />
          )}

          {activeTab === "planner" && (
            <PlannerView
              envData={envData}
              userProfile={userProfile}
              planSegments={planSegments}
              onUpdateProfile={setUserProfile}
              onRefreshPlan={() => fetchDailyPlan(envData, userProfile).then(setPlanSegments)}
            />
          )}

          {activeTab === "indoor" && (
            <IndoorAirView
              envData={envData}
              userProfile={userProfile}
            />
          )}

          {activeTab === "swaps" && (
            <SwapsView
              swaps={swaps}
              recordedSwapIds={recordedSwapIds}
              impactData={impactData}
              onRecordSwap={handleRecordSwap}
              onRemoveRecordedSwap={handleRemoveRecordedSwap}
            />
          )}

          {activeTab === "family" && (
            <FamilyView
              envData={envData}
              userProfile={userProfile}
              onUpdateProfile={setUserProfile}
            />
          )}

          {activeTab === "community" && (
            <CommunityView />
          )}

          {activeTab === "assistant" && (
            <AssistantView
              envData={envData}
              userProfile={userProfile}
            />
          )}

          {activeTab === "settings" && (
            <SettingsView
              userProfile={userProfile}
              envData={envData}
              onUpdateProfile={setUserProfile}
              isDemoMode={isDemoMode}
              onToggleDemoMode={handleToggleDemoMode}
              aqiStandard={aqiStandard}
              onToggleAqiStandard={setAqiStandard}
              onResetAll={handleResetAll}
            />
          )}

        </main>
      </div>

      {/* Onboarding Wizard Modal */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        userProfile={userProfile}
        onComplete={handleCompleteOnboarding}
      />

      {/* Footer */}
      <footer className="border-t border-[#e2e8e0] bg-white py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-[#1e6b45] text-sm">NirvanAir</span>
            <span>•</span>
            <span>Breathe smarter. Live sustainably.</span>
          </div>
          <div>
            Built for Google GenAI Innovation Challenge (PromptWars) • Powered by Gemini & Open-Meteo
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
