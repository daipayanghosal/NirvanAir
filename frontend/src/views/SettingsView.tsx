import React, { useState } from "react";
import {
  Settings,
  Key,
  CheckCircle2,
  Trash2,
  Download
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
      <div className="bg-[#ffffff] rounded-[28px] p-6 border border-[#c2c9bf]/40 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 m3-label-medium text-[#1e6b45] uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4 text-[#1e6b45]" />
            <span>Application Configuration</span>
          </div>
          <h1 className="m3-headline-small text-[#191d19]">Settings & API Management</h1>
          <p className="m3-body-small text-[#727972] mt-0.5 max-w-xl">
            Configure Google Gemini API credentials, telemetry preferences, and export persistent household decision data.
          </p>
        </div>
      </div>

      {/* 1. Google Gemini API Key Management */}
      <div className="bg-[#ffffff] rounded-[28px] p-6 border border-[#c2c9bf]/40 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#c2c9bf]/30">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#d3e8d4] text-[#0e1f13] flex items-center justify-center font-bold">
              <Key className="w-5 h-5 text-[#1e6b45]" />
            </div>
            <div>
              <h2 className="m3-title-small text-[#191d19]">Google Gemini API Configuration</h2>
              <span className="m3-body-small text-[#727972]">Provide an optional custom key or use backend defaults</span>
            </div>
          </div>
          <span className="text-xs bg-[#d3e8d4] text-[#0e1f13] font-bold px-3 py-1 rounded-full">
            Gemini 2.5 Active
          </span>
        </div>

        <p className="m3-body-small text-[#424942] leading-relaxed">
          AIRWISE runs with a secure server-side Gemini integration. If running locally without backend environment variables, you can provide your Google AI Studio Gemini API key below:
        </p>

        <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
          <input
            type="password"
            placeholder="AIzaSy..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="flex-1 text-xs p-3 bg-[#f1f5ed] border border-[#c2c9bf]/60 rounded-full focus:ring-2 focus:ring-[#1e6b45] text-[#191d19]"
          />
          <button
            onClick={handleSaveKey}
            className="px-5 py-2.5 bg-[#1e6b45] hover:bg-[#155335] text-white text-xs font-bold rounded-full transition-transform active:scale-95 shadow-xs shrink-0"
          >
            Save Key
          </button>
        </div>

        {keySaved && (
          <div className="text-xs font-bold text-[#1e6b45] flex items-center space-x-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Gemini API key saved to local session.</span>
          </div>
        )}
      </div>

      {/* 2. Telemetry & AQI Standards */}
      <div className="bg-[#ffffff] rounded-[28px] p-6 border border-[#c2c9bf]/40 shadow-xs space-y-4">
        <h2 className="m3-title-medium text-[#191d19] pb-2 border-b border-[#c2c9bf]/30">
          Telemetry & Index Standards
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 rounded-[22px] bg-[#f1f5ed] border border-[#c2c9bf]/40 flex items-center justify-between">
            <div>
              <strong className="text-[#191d19] block text-sm mb-0.5">Air Quality Standard</strong>
              <span className="text-[#506353]">
                {aqiStandard === "NAQI" ? "Indian CPCB NAQI (6 Categories)" : "US EPA Standard (0-500)"}
              </span>
            </div>
            <button
              onClick={() => onToggleAqiStandard(aqiStandard === "NAQI" ? "USEPA" : "NAQI")}
              className="px-4 py-2 bg-[#1e6b45] text-white font-bold rounded-full hover:bg-[#155335] transition-transform active:scale-95 shadow-xs"
            >
              Switch to {aqiStandard === "NAQI" ? "US EPA" : "NAQI"}
            </button>
          </div>

          <div className="p-4 rounded-[22px] bg-[#f1f5ed] border border-[#c2c9bf]/40 flex items-center justify-between">
            <div>
              <strong className="text-[#191d19] block text-sm mb-0.5">Data Feed Mode</strong>
              <span className="text-[#506353]">
                {isDemoMode ? "Durgapur Winter Baseline" : "Live Atmospheric Sensing"}
              </span>
            </div>
            <button
              onClick={() => onToggleDemoMode(!isDemoMode)}
              className="px-4 py-2 bg-[#1e6b45] text-white font-bold rounded-full hover:bg-[#155335] transition-transform active:scale-95 shadow-xs"
            >
              Switch to {isDemoMode ? "Live Sensing" : "Demo Mode"}
            </button>
          </div>

        </div>
      </div>

      {/* 3. Data Export & Reset */}
      <div className="bg-[#ffffff] rounded-[28px] p-6 border border-[#c2c9bf]/40 shadow-xs space-y-4">
        <h2 className="m3-title-medium text-[#191d19] pb-2 border-b border-[#c2c9bf]/30">
          Data Management
        </h2>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportData}
            className="flex items-center space-x-2 px-5 py-2.5 bg-[#f1f5ed] hover:bg-[#dfe5dc] text-[#191d19] text-xs font-bold rounded-full transition-colors"
          >
            <Download className="w-4 h-4 text-[#1e6b45]" />
            <span>Export Household Profile & Log (JSON)</span>
          </button>

          <button
            onClick={onResetAll}
            className="flex items-center space-x-2 px-5 py-2.5 bg-[#ffdad6] hover:bg-[#ffb4ab] text-[#410002] text-xs font-bold rounded-full transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset Profile & Clear Recorded Swaps</span>
          </button>
        </div>
      </div>

    </div>
  );
};
