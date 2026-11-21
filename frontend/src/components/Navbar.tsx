import React, { useState } from "react";
import {
  Wind,
  MapPin,
  Search,
  Crosshair,
  Sliders,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X
} from "lucide-react";
import { EnvironmentalData, UserProfile } from "../types";

interface NavbarProps {
  envData: EnvironmentalData;
  userProfile: UserProfile;
  onUpdateLocation: (name: string, lat: number, lon: number) => void;
  onOpenSettings: () => void;
  onOpenOnboarding: () => void;
  isDemoMode: boolean;
  onToggleDemoMode: (val: boolean) => void;
  aqiStandard: "NAQI" | "USEPA";
  onToggleAqiStandard: (val: "NAQI" | "USEPA") => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  envData,
  userProfile,
  onUpdateLocation,
  onOpenSettings,
  onOpenOnboarding,
  isDemoMode,
  onToggleDemoMode,
  aqiStandard,
  onToggleAqiStandard,
  activeTab,
  onSelectTab
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const presets = [
    { name: "Durgapur", lat: 23.5204, lon: 87.3119, label: "Durgapur (Demo)" },
    { name: "New Delhi", lat: 28.6139, lon: 77.2090, label: "Delhi" },
    { name: "Kolkata", lat: 22.5726, lon: 88.3639, label: "Kolkata" },
    { name: "Mumbai", lat: 19.0760, lon: 72.8777, label: "Mumbai" },
    { name: "Bengaluru", lat: 12.9716, lon: 77.5946, label: "Bengaluru" },
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || searchQuery.length < 2) return;
    setSearching(true);
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5&language=en&format=json`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.results || []);
      }
    } catch (err) {
      console.warn("Geocoding failed:", err);
    } finally {
      setSearching(false);
    }
  };

  const handleDetectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            // Reverse geocode via open-meteo or nominatim
            onUpdateLocation("Detected Location", lat, lon);
            setSearchOpen(false);
          } catch (e) {
            onUpdateLocation("My Location", lat, lon);
            setSearchOpen(false);
          }
        },
        (error) => {
          alert("Could not retrieve GPS location. Please select a city manually.");
        }
      );
    } else {
      alert("Browser geolocation not supported on this device.");
    }
  };

  const aqiValue = aqiStandard === "NAQI" ? envData.air_quality.aqi : envData.air_quality.us_aqi_equivalent;
  const aqiCategory = envData.air_quality.category;
  const aqiColor = envData.air_quality.color;

  return (
    <header className="sticky top-0 z-40 bg-[#163323] text-white border-b border-[#244b35] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab("overview")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#849974] to-[#406850] flex items-center justify-center shadow-inner">
              <Wind className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl tracking-tight text-white">AIRWISE</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-[#244b35] text-[#b6d4be]">
                  GenAI 2.5
                </span>
              </div>
              <p className="text-xs text-[#b0c8b6] hidden sm:block">Breathe smarter. Live sustainably.</p>
            </div>
          </div>

          {/* Location Selector & Quick Presets */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#1f422e] hover:bg-[#28553c] border border-[#2d5c42] text-sm text-[#e4ede6] transition-colors"
                title="Change Location"
              >
                <MapPin className="w-4 h-4 text-[#8ec59f]" />
                <span className="font-medium max-w-[140px] truncate">{envData.location.name}</span>
                <span className="text-xs text-[#a0c2ab] bg-[#163323] px-1.5 py-0.5 rounded">
                  {envData.location.state || "WB"}
                </span>
              </button>

              {/* Location Search Dropdown Modal */}
              {searchOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 text-gray-800 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
                    <span className="font-semibold text-sm text-gray-900">Select City or Coordinates</span>
                    <button
                      onClick={() => setSearchOpen(false)}
                      className="text-gray-400 hover:text-gray-600 text-xs"
                    >
                      Close
                    </button>
                  </div>

                  <form onSubmit={handleSearch} className="mb-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search city (e.g., Durgapur, Delhi)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28553c]"
                      />
                      <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                    </div>
                  </form>

                  {/* Detect GPS */}
                  <button
                    onClick={handleDetectLocation}
                    className="w-full flex items-center justify-center space-x-2 py-1.5 px-3 bg-[#eaf3ed] hover:bg-[#dbeee0] text-[#163323] text-xs font-semibold rounded-lg mb-3 transition-colors"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>Use My Current Device Location</span>
                  </button>

                  {/* Search Results */}
                  {searching && <p className="text-xs text-gray-500 text-center py-2">Searching locations...</p>}
                  {searchResults.length > 0 && (
                    <div className="mb-3 max-h-36 overflow-y-auto space-y-1">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Search Results</p>
                      {searchResults.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            onUpdateLocation(item.name, item.latitude, item.longitude);
                            setSearchOpen(false);
                            setSearchResults([]);
                            setSearchQuery("");
                          }}
                          className="w-full text-left px-2 py-1.5 text-xs hover:bg-gray-100 rounded flex justify-between items-center"
                        >
                          <span className="font-medium text-gray-800">{item.name}</span>
                          <span className="text-gray-400 text-[10px]">{item.admin1 || item.country}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quick Presets */}
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Preset Hubs</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {presets.map((p) => (
                        <button
                          key={p.name}
                          onClick={() => {
                            onUpdateLocation(p.name, p.lat, p.lon);
                            setSearchOpen(false);
                          }}
                          className={`text-xs px-2.5 py-1 rounded text-left transition-colors flex items-center space-x-1.5 ${
                            envData.location.name === p.name
                              ? "bg-[#163323] text-white font-medium"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          <span className="truncate">{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick preset chips */}
            <div className="hidden lg:flex items-center space-x-1">
              {presets.slice(0, 3).map((p) => (
                <button
                  key={p.name}
                  onClick={() => onUpdateLocation(p.name, p.lat, p.lon)}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                    envData.location.name === p.name
                      ? "bg-[#29563c] text-white font-medium"
                      : "text-[#b0c8b6] hover:bg-[#1f422e]"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right Section: AQI Badge, Mode Toggle, Settings */}
          <div className="flex items-center space-x-3">
            
            {/* Live AQI Badge */}
            <div
              className="flex items-center space-x-2 px-3 py-1 rounded-lg border"
              style={{
                backgroundColor: `${aqiColor}20`,
                borderColor: `${aqiColor}60`
              }}
              title={`Dominant Pollutant: ${envData.air_quality.dominant_pollutant}`}
            >
              <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: aqiColor }} />
              <div className="text-right">
                <div className="flex items-baseline space-x-1">
                  <span className="font-extrabold text-sm text-white">{aqiValue}</span>
                  <span className="text-[10px] text-[#c7ded0] font-medium">{aqiStandard}</span>
                </div>
              </div>
              <span
                className="text-[11px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-white"
                style={{ backgroundColor: aqiColor }}
              >
                {aqiCategory}
              </span>
            </div>

            {/* Demo vs Live Mode Indicator */}
            <button
              onClick={() => onToggleDemoMode(!isDemoMode)}
              className={`hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                isDemoMode
                  ? "bg-amber-900/40 border-amber-600/60 text-amber-300 hover:bg-amber-900/60"
                  : "bg-[#1f422e] border-[#2d5c42] text-[#c5e1ce] hover:bg-[#28553c]"
              }`}
              title={isDemoMode ? "Currently showing Durgapur winter baseline demo dataset" : "Currently connected to live atmospheric sensing"}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isDemoMode ? "bg-amber-400" : "bg-emerald-400"}`} />
              <span>{isDemoMode ? "Demo Mode" : "Live Sensing"}</span>
            </button>

            {/* Scale toggle (NAQI vs US EPA) */}
            <button
              onClick={() => onToggleAqiStandard(aqiStandard === "NAQI" ? "USEPA" : "NAQI")}
              className="hidden md:flex text-xs px-2 py-1 rounded bg-[#1f422e] hover:bg-[#28553c] text-[#c0dbca] border border-[#2d5c42]"
              title="Toggle between Indian NAQI and US EPA AQI standard"
            >
              {aqiStandard}
            </button>

            {/* Onboarding Wizard trigger */}
            <button
              onClick={onOpenOnboarding}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#849974] hover:bg-[#96ac85] text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">My Profile</span>
            </button>

            {/* Settings button */}
            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-lg bg-[#1f422e] hover:bg-[#28553c] text-[#c5e1ce] transition-colors"
              title="Settings & Data Configuration"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg bg-[#1f422e] text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#122b1d] border-t border-[#244b35] px-4 pt-3 pb-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#244b35]">
            <span className="text-xs text-[#a0c2ab]">Location: {envData.location.name}</span>
            <button
              onClick={() => {
                setSearchOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-xs text-emerald-400 font-semibold"
            >
              Change Location
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#a0c2ab]">Data Feed:</span>
            <button
              onClick={() => onToggleDemoMode(!isDemoMode)}
              className="text-xs px-2 py-1 rounded bg-[#1f422e] text-white"
            >
              {isDemoMode ? "Demo Mode (Durgapur)" : "Live Sensing"}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#a0c2ab]">AQI Scale:</span>
            <button
              onClick={() => onToggleAqiStandard(aqiStandard === "NAQI" ? "USEPA" : "NAQI")}
              className="text-xs px-2 py-1 rounded bg-[#1f422e] text-white"
            >
              {aqiStandard === "NAQI" ? "Indian NAQI (CPCB)" : "US EPA Standard"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
