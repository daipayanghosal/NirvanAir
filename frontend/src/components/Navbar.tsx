import React, { useState } from "react";
import {
  Wind,
  MapPin,
  Search,
  Crosshair,
  Sliders,
  Sparkles,
  Menu,
  X,
  ChevronDown
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
  onUpdateLocation,
  onOpenSettings,
  onOpenOnboarding,
  isDemoMode,
  onToggleDemoMode,
  aqiStandard,
  onToggleAqiStandard,
  onSelectTab
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const presets = [
    { name: "Durgapur", lat: 23.5204, lon: 87.3119, label: "Durgapur" },
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
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          onUpdateLocation("My Location", lat, lon);
          setSearchOpen(false);
        },
        () => {
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
    <header className="sticky top-0 z-40 bg-[#f1f5ed]/95 backdrop-blur-md border-b border-[#c2c9bf]/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* M3 Brand Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => onSelectTab("overview")}
          >
            <div className="w-11 h-11 rounded-2xl bg-[#bbf3cd] text-[#002111] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Wind className="w-6 h-6 text-[#1e6b45]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-[#191d19]">NirvanAir</span>
                <span className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#d3e8d4] text-[#0e1f13]">
                  M3 • Gemini
                </span>
              </div>
              <p className="text-[11px] text-[#424942] hidden sm:block font-medium">Breathe smarter. Live sustainably.</p>
            </div>
          </div>

          {/* M3 Search & Location Pill */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#ebf0e8] hover:bg-[#dfe5dc] border border-[#c2c9bf]/60 text-xs text-[#191d19] font-medium transition-all"
              >
                <MapPin className="w-4 h-4 text-[#1e6b45]" />
                <span className="font-bold max-w-[130px] truncate">{envData.location.name}</span>
                <span className="text-[11px] text-[#506353] bg-[#d3e8d4] px-2 py-0.5 rounded-full font-semibold">
                  {envData.location.state || "IN"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#727972]" />
              </button>

              {/* M3 Search Surface Container Modal */}
              {searchOpen && (
                <div className="absolute left-0 mt-2 w-88 bg-[#f7fbf3] rounded-[28px] shadow-xl border border-[#c2c9bf]/50 p-5 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 mb-3">
                    <span className="m3-title-small text-[#191d19]">Choose Location</span>
                    <button
                      onClick={() => setSearchOpen(false)}
                      className="w-7 h-7 rounded-full hover:bg-[#ebf0e8] flex items-center justify-center text-[#424942]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSearch} className="mb-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search city, district, or pin..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#ebf0e8] border border-transparent focus:border-[#1e6b45] rounded-full focus:outline-none text-[#191d19]"
                      />
                      <Search className="w-4 h-4 text-[#727972] absolute left-3.5 top-3" />
                    </div>
                  </form>

                  <button
                    onClick={handleDetectLocation}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-[#bbf3cd] hover:bg-[#a6e6b9] text-[#002111] text-xs font-bold rounded-full mb-3 transition-colors shadow-xs"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>Detect Device Location (GPS)</span>
                  </button>

                  {searching && <p className="text-xs text-[#727972] text-center py-2">Searching cities...</p>}
                  {searchResults.length > 0 && (
                    <div className="mb-3 max-h-36 overflow-y-auto space-y-1">
                      <p className="text-[10px] font-bold text-[#727972] uppercase tracking-wider">Search Results</p>
                      {searchResults.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            onUpdateLocation(item.name, item.latitude, item.longitude);
                            setSearchOpen(false);
                            setSearchResults([]);
                            setSearchQuery("");
                          }}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-[#ebf0e8] rounded-2xl flex justify-between items-center"
                        >
                          <span className="font-semibold text-[#191d19]">{item.name}</span>
                          <span className="text-[#506353] text-[11px]">{item.admin1 || item.country}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div>
                    <p className="text-[10px] font-bold text-[#727972] uppercase tracking-wider mb-2">Preset Hubs</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {presets.map((p) => (
                        <button
                          key={p.name}
                          onClick={() => {
                            onUpdateLocation(p.name, p.lat, p.lon);
                            setSearchOpen(false);
                          }}
                          className={`text-xs px-3 py-1.5 rounded-full text-left transition-all ${
                            envData.location.name === p.name
                              ? "bg-[#1e6b45] text-white font-bold shadow-xs"
                              : "bg-[#ebf0e8] hover:bg-[#dfe5dc] text-[#191d19] font-medium"
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

            {/* M3 Assist Chips for fast switching */}
            <div className="hidden lg:flex items-center space-x-1.5">
              {presets.slice(0, 3).map((p) => (
                <button
                  key={p.name}
                  onClick={() => onUpdateLocation(p.name, p.lat, p.lon)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    envData.location.name === p.name
                      ? "bg-[#1e6b45] border-[#1e6b45] text-white font-bold shadow-xs"
                      : "bg-[#f7fbf3] border-[#c2c9bf] text-[#424942] hover:bg-[#ebf0e8]"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right Section: M3 AQI Pill, Toggles, Profile */}
          <div className="flex items-center space-x-2.5">
            
            {/* M3 Elevated AQI Badge */}
            <div
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full shadow-xs"
              style={{
                backgroundColor: `${aqiColor}18`,
                border: `1.5px solid ${aqiColor}55`
              }}
            >
              <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: aqiColor }} />
              <div className="flex items-baseline space-x-1">
                <span className="font-black text-sm text-[#191d19]">{aqiValue}</span>
                <span className="text-[10px] text-[#506353] font-semibold">{aqiStandard}</span>
              </div>
              <span
                className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: aqiColor }}
              >
                {aqiCategory}
              </span>
            </div>

            {/* M3 Mode Toggle Chip */}
            <button
              onClick={() => onToggleDemoMode(!isDemoMode)}
              className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                isDemoMode
                  ? "bg-[#ffdad6] border-[#ba1a1a]/30 text-[#410002]"
                  : "bg-[#d3e8d4] border-[#1e6b45]/30 text-[#0e1f13]"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isDemoMode ? "bg-[#ba1a1a]" : "bg-[#1e6b45]"}`} />
              <span>{isDemoMode ? "Demo Mode" : "Live Feed"}</span>
            </button>

            {/* M3 Segmented Button for AQI scale */}
            <button
              onClick={() => onToggleAqiStandard(aqiStandard === "NAQI" ? "USEPA" : "NAQI")}
              className="hidden md:flex text-xs px-3 py-1.5 rounded-full bg-[#ebf0e8] hover:bg-[#dfe5dc] text-[#191d19] font-bold border border-[#c2c9bf]/60 transition-colors"
            >
              {aqiStandard}
            </button>

            {/* M3 Filled Tonal Button for Profile */}
            <button
              onClick={onOpenOnboarding}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#1e6b45] hover:bg-[#155335] text-white text-xs font-bold shadow-xs transition-transform active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#bbf3cd]" />
              <span className="hidden sm:inline">Household</span>
            </button>

            {/* M3 Circular Icon Button for Settings */}
            <button
              onClick={onOpenSettings}
              className="w-10 h-10 rounded-full bg-[#ebf0e8] hover:bg-[#dfe5dc] text-[#191d19] flex items-center justify-center transition-colors"
              title="Settings & API"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full bg-[#ebf0e8] text-[#191d19] flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#f1f5ed] border-t border-[#c2c9bf]/40 px-4 py-4 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-[#c2c9bf]/30">
            <span className="text-xs text-[#506353]">Location: <strong>{envData.location.name}</strong></span>
            <button
              onClick={() => {
                setSearchOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-xs text-[#1e6b45] font-bold"
            >
              Change Location
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#506353]">Telemetry Feed:</span>
            <button
              onClick={() => onToggleDemoMode(!isDemoMode)}
              className="text-xs px-3 py-1 rounded-full bg-[#ebf0e8] text-[#191d19] font-bold"
            >
              {isDemoMode ? "Demo Mode (Durgapur)" : "Live Sensing"}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#506353]">Standard:</span>
            <button
              onClick={() => onToggleAqiStandard(aqiStandard === "NAQI" ? "USEPA" : "NAQI")}
              className="text-xs px-3 py-1 rounded-full bg-[#ebf0e8] text-[#191d19] font-bold"
            >
              {aqiStandard === "NAQI" ? "Indian NAQI (CPCB)" : "US EPA Standard"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
