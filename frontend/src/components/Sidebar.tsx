import React from "react";
import {
  LayoutDashboard,
  CalendarCheck2,
  Home,
  RefreshCw,
  ShieldAlert,
  Users2,
  Sparkles,
  Settings,
  Flame,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  swapsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  swapsCount = 0
}) => {
  const navItems = [
    {
      id: "overview",
      label: "Home Dashboard",
      icon: LayoutDashboard,
      description: "Hyperlocal telemetry",
      badge: null
    },
    {
      id: "planner",
      label: "AI Daily Planner",
      icon: CalendarCheck2,
      description: "24h smog routine",
      badge: "Smart"
    },
    {
      id: "indoor",
      label: "Indoor Air Doctor",
      icon: Home,
      description: "DIY & ventilation",
      badge: null
    },
    {
      id: "swaps",
      label: "Sustainable Swaps",
      icon: RefreshCw,
      description: "Clean alternatives",
      badge: swapsCount > 0 ? `${swapsCount}` : "New"
    },
    {
      id: "family",
      label: "Family Protection",
      icon: ShieldAlert,
      description: "Children & seniors",
      badge: null
    },
    {
      id: "community",
      label: "Community & What-If",
      icon: Users2,
      description: "Impact simulator",
      badge: "Simulator"
    },
    {
      id: "assistant",
      label: "AIRWISE Assistant",
      icon: Sparkles,
      description: "Gemini 2.5 advice",
      badge: "Gemini"
    },
    {
      id: "settings",
      label: "Settings & API",
      icon: Settings,
      description: "Preferences & keys",
      badge: null
    }
  ];

  return (
    <aside className="w-68 bg-[#f1f5ed] border-r border-[#c2c9bf]/40 min-h-[calc(100vh-4.5rem)] flex flex-col justify-between p-4 select-none">
      <div className="space-y-1">
        <div className="px-4 py-2 m3-label-medium text-[#506353] uppercase tracking-wider">
          Intelligence Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-left transition-all relative ${
                isActive
                  ? "bg-[#d3e8d4] text-[#0e1f13] font-bold shadow-xs"
                  : "text-[#424942] hover:bg-[#ebf0e8] hover:text-[#191d19]"
              }`}
            >
              <div className="flex items-center space-x-3.5 truncate">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-[#1e6b45] text-white"
                      : "bg-[#e5eae2] text-[#506353]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="m3-title-small truncate leading-tight">{item.label}</div>
                  <div className="m3-body-small text-[#727972] truncate mt-0.5">{item.description}</div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 shrink-0 ${
                    isActive
                      ? "bg-[#1e6b45] text-white"
                      : "bg-[#ebf0e8] text-[#506353]"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* M3 Tonal Surface Card for Impact Streak */}
      <div className="mt-6 p-4.5 rounded-[24px] bg-[#ebf0e8] border border-[#c2c9bf]/50">
        <div className="flex items-center space-x-2.5 mb-2">
          <div className="w-7 h-7 rounded-full bg-[#1e6b45] text-amber-300 flex items-center justify-center">
            <Flame className="w-4 h-4 fill-amber-300" />
          </div>
          <div>
            <span className="m3-title-small text-[#191d19] block">Impact Tracker</span>
            <span className="m3-body-small text-[#727972] block">Sustainable Living</span>
          </div>
        </div>

        <p className="m3-body-small text-[#424942] mb-3 leading-snug">
          {swapsCount > 0 ? (
            <span>You have logged <strong>{swapsCount}</strong> low-emission swaps this month!</span>
          ) : (
            <span>Log daily sustainable swaps to reduce personal and local emissions.</span>
          )}
        </p>

        <button
          onClick={() => onSelectTab("swaps")}
          className="w-full flex items-center justify-between m3-label-small text-[#1e6b45] bg-[#ffffff] hover:bg-[#d3e8d4] px-3.5 py-2 rounded-full font-bold transition-colors shadow-2xs"
        >
          <span>Explore Swaps</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
