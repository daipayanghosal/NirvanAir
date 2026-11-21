import React, { useState } from "react";
import {
  Settings,
  Key,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Download,
  Database,
  Sliders,
  Sparkles,
  Info
} from "lucide-react";
import { UserProfile, EnvironmentalData } from "../types";

interface SettingsViewProps {
  userProfile: UserProfile;
  envData: EnvironmentalData;
  onUpdateProfile: (profile: UserProfile) => void;
  isDemoMode: boolean;
  onToggleDemoMode: (val: boolean) => void;
  aqiStandard: "NAQI" | "USEPA";
  onToggleAqiStandard: (val: "NAQI" | "USEPA") => void;
  onResetAll: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userProfile,
  envData,
  onUpdateProfile,
  isDemoMode,
  onToggleDemoMode,
  aqiStandard,
  onToggleAqiStandard,
  onResetAll
}) => {
  const [apiKey, setApiKey] = useState("");
  const [keySaved, setKeySaved] = useState(false);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("airwise_gemini_key", apiKey.trim());
      setKeySaved(true);
      setTimeout(() => setKeySaved(false), 3000);
    }
  };

  const handleExportData = () => {
    const exportObject = {
      userProfile,
      environmentalData: envData,
      isDemoMode,
      aqiStandard,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `airwise_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#163323] uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4 text-emerald-600" />
            <span>Application Configuration</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Settings & API Management</h1>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Configure Google Gemini API credentials, telemetry preferences, and export persistent household decision data.
          </p>
        </div>
      </div>

      {/* 1. Google Gemini API Key Management */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e0] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-base font-bold text-gray-900 tracking-tight">Google Gemini API Configuration</h2>
              <span className="text-xs text-gray-500">Provide an optional custom key or use the backend environment default</span>
            </div>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-lg">
            Gemini 2.5 Active
          </span>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          AIRWISE runs with a secure server-side Gemini integration. If running locally without backend environment variables, you can provide your Google AI Studio Gemini API key below:
        </p>

        <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
          <input
            type="password"
            placeholder="AIzaSy..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="flex-1 text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#163323]"
          />
          <button
            onClick={handleSaveKey}
            className="px-4 py-2 bg-[#163323] hover:bg-[#204933] text-white text-xs font-bold rounded-xl transition-colors shrink-0"
          >
            Save Key
          </button>
        </div>

        {keySaved && (
          <div className="text-xs font-semibold text-emerald-700 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Gemini API key saved to local session.</span>
          </div>
        )}
      </div>

      {/* 2. Telemetry & AQI Standards */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e0] shadow-xs space-y-4">
        <h2 className="text-base font-bold text-gray-900 tracking-tight pb-2 border-b border-gray-100">
          Telemetry & Index Standards
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
            <div>
              <strong className="text-gray-900 block text-sm mb-0.5">Air Quality Standard</strong>
              <span className="text-gray-500">
                {aqiStandard === "NAQI" ? "Indian CPCB NAQI (6 Categories)" : "US EPA Standard (0-500)"}
              </span>
            </div>
            <button
              onClick={() => onToggleAqiStandard(aqiStandard === "NAQI" ? "USEPA" : "NAQI")}
              className="px-3 py-1.5 bg-[#163323] text-white font-semibold rounded-lg hover:bg-[#204933] transition-colors"
            >
              Switch to {aqiStandard === "NAQI" ? "US EPA" : "NAQI"}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
            <div>
              <strong className="text-gray-900 block text-sm mb-0.5">Data Feed Mode</strong>
              <span className="text-gray-500">
                {isDemoMode ? "Durgapur Winter Smog Baseline" : "Live Satellite & Station Bridge"}
              </span>
            </div>
            <button
              onClick={() => onToggleDemoMode(!isDemoMode)}
              className="px-3 py-1.5 bg-[#163323] text-white font-semibold rounded-lg hover:bg-[#204933] transition-colors"
            >
              Switch to {isDemoMode ? "Live Sensing" : "Demo Mode"}
            </button>
          </div>

        </div>
      </div>

      {/* 3. Data Export & Reset */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e0] shadow-xs space-y-4">
        <h2 className="text-base font-bold text-gray-900 tracking-tight pb-2 border-b border-gray-100">
          Data Management
        </h2>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportData}
            className="flex items-center space-x-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Household Profile & Impact Log (JSON)</span>
          </button>

          <button
            onClick={onResetAll}
            className="flex items-center space-x-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Profile & Clear Recorded Swaps</span>
          </button>
        </div>
      </div>

    </div>
  );
};
