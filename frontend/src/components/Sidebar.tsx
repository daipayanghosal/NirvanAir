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
      shortLabel: "Overview",
      icon: LayoutDashboard,
      description: "Hyperlocal conditions & AI briefing",
      badge: null
    },
    {
      id: "planner",
      label: "AI Daily Planner",
      shortLabel: "Daily Plan",
      icon: CalendarCheck2,
      description: "Personalized 24h routine",
      badge: "Smart"
    },
    {
      id: "indoor",
      label: "Indoor Air Doctor",
      shortLabel: "Indoor Air",
      icon: Home,
      description: "HEPA, DIY filter & ventilation",
      badge: null
    },
    {
      id: "swaps",
      label: "Sustainable Swaps",
      shortLabel: "Swaps",
      icon: RefreshCw,
      description: "Low-emission alternatives",
      badge: swapsCount > 0 ? `${swapsCount}` : "New"
    },
    {
      id: "family",
      label: "Family Protection",
      shortLabel: "Family",
      icon: ShieldAlert,
      description: "Children, seniors & vulnerable",
      badge: null
    },
    {
      id: "community",
      label: "Community & What-If",
      shortLabel: "Community",
      icon: Users2,
      description: "Neighborhood impact simulator",
      badge: "Simulator"
    },
    {
      id: "assistant",
      label: "AIRWISE Assistant",
      shortLabel: "AI Chat",
      icon: Sparkles,
      description: "Grounded conversational advice",
      badge: "Gemini"
    },
    {
      id: "settings",
      label: "Settings & Profile",
      shortLabel: "Settings",
      icon: Settings,
      description: "Preferences & API keys",
      badge: null
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#e2e8e0] min-h-[calc(100vh-4rem)] flex flex-col justify-between p-3 select-none">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          Intelligence Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group ${
                isActive
                  ? "bg-[#163323] text-white shadow-sm font-semibold"
                  : "text-gray-700 hover:bg-[#f3f7f4] hover:text-[#163323]"
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#254f38] text-white"
                      : "bg-gray-100 text-gray-600 group-hover:bg-[#e4ede7] group-hover:text-[#163323]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-sm tracking-tight truncate leading-tight">{item.label}</div>
                  <div
                    className={`text-[10px] truncate leading-tight ${
                      isActive ? "text-[#a2c9b0]" : "text-gray-400"
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ml-2 shrink-0 ${
                    isActive
                      ? "bg-[#849974] text-white"
                      : item.badge === "Simulator" || item.badge === "Gemini"
                      ? "bg-[#eaf3ed] text-[#163323]"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sustainable Streak Footer Card */}
      <div className="mt-4 p-3 bg-gradient-to-br from-[#f2f7f3] to-[#eaf3ed] rounded-xl border border-[#d6e5d9]">
        <div className="flex items-center space-x-2 mb-1.5">
          <div className="p-1 rounded-md bg-[#163323] text-amber-400">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#163323]">Impact Score</span>
            <span className="text-[10px] text-gray-500 block leading-none">Sustainable Living</span>
          </div>
        </div>
        <div className="text-xs text-gray-600 leading-snug mb-2">
          {swapsCount > 0 ? (
            <span>You have recorded <strong>{swapsCount}</strong> low-emission swaps this month!</span>
          ) : (
            <span>Log everyday sustainable swaps to reduce personal and local emissions.</span>
          )}
        </div>
        <button
          onClick={() => onSelectTab("swaps")}
          className="w-full flex items-center justify-between text-[11px] font-semibold text-[#163323] bg-white px-2.5 py-1.5 rounded-lg border border-[#c9dcd0] hover:bg-[#163323] hover:text-white transition-colors"
        >
          <span>Explore Swaps</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
