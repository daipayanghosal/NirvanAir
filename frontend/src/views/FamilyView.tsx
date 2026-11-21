import React, { useState } from "react";
import {
  ShieldAlert,
  Users,
  Baby,
  HeartPulse,
  Heart,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  School,
  Bus,
  Activity,
  Plus,
  Trash2,
  Sparkles
} from "lucide-react";
import { EnvironmentalData, UserProfile } from "../types";

interface FamilyViewProps {
  envData: EnvironmentalData;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export const FamilyView: React.FC<FamilyViewProps> = ({
  envData,
  userProfile,
  onUpdateProfile
}) => {
  const [hasChildren, setHasChildren] = useState(userProfile.has_children);
  const [hasElderly, setHasElderly] = useState(userProfile.has_elderly);
  const [householdSize, setHouseholdSize] = useState(userProfile.household_size);
  const [vulnerabilities, setVulnerabilities] = useState<string[]>(userProfile.vulnerabilities || []);
  const [newVulnerability, setNewVulnerability] = useState("");

  const aqi = envData.air_quality.aqi;
  const category = envData.air_quality.category;

  const handleSaveProfile = () => {
    onUpdateProfile({
      ...userProfile,
      household_size: householdSize,
      has_children: hasChildren,
      has_elderly: hasElderly,
      vulnerabilities: vulnerabilities
    });
  };

  const addVulnerability = () => {
    if (newVulnerability.trim() && !vulnerabilities.includes(newVulnerability.trim())) {
      const updated = [...vulnerabilities, newVulnerability.trim()];
      setVulnerabilities(updated);
      setNewVulnerability("");
      onUpdateProfile({ ...userProfile, vulnerabilities: updated });
    }
  };

  const removeVulnerability = (item: string) => {
    const updated = vulnerabilities.filter(v => v !== item);
    setVulnerabilities(updated);
    onUpdateProfile({ ...userProfile, vulnerabilities: updated });
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e0] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#163323] uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 text-emerald-600" />
            <span>Vulnerability & Household Protection</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Family Safety & Exposure Defense</h1>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Tailor environmental safety rules specifically for children, senior citizens, and household members with respiratory or cardiovascular vulnerabilities.
          </p>
        </div>

        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 shrink-0 max-w-xs">
          <div className="font-bold flex items-center space-x-1 mb-0.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            <span>Important Medical Disclaimer</span>
          </div>
          <p className="text-[11px] text-red-800 leading-tight">
            AIRWISE is an informational decision-support platform, NOT a medical device. It does not diagnose diseases or prescribe clinical therapies.
          </p>
        </div>
      </div>

      {/* Household Profile Configurator */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e0] shadow-xs">
        <h2 className="text-base font-bold text-gray-900 tracking-tight mb-4">Configure Household Profile</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Household Size */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Total Household Members</label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                min="1"
                max="12"
                value={householdSize}
                onChange={(e) => {
                  setHouseholdSize(Number(e.target.value));
                  onUpdateProfile({ ...userProfile, household_size: Number(e.target.value) });
                }}
                className="w-24 p-2 text-sm bg-gray-50 border border-gray-300 rounded-xl font-bold text-center"
              />
              <span className="text-xs text-gray-500">People residing together</span>
            </div>
          </div>

          {/* Children & Elderly Toggles */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-700 block">Vulnerable Demographics</label>
            
            <label className="flex items-center space-x-2.5 text-xs text-gray-800 cursor-pointer">
              <input
                type="checkbox"
                checked={hasChildren}
                onChange={(e) => {
                  setHasChildren(e.target.checked);
                  onUpdateProfile({ ...userProfile, has_children: e.target.checked });
                }}
                className="rounded text-[#163323] focus:ring-[#163323]"
              />
              <span className="font-medium">Infants / Children (&lt;14 yrs) present</span>
            </label>

            <label className="flex items-center space-x-2.5 text-xs text-gray-800 cursor-pointer">
              <input
                type="checkbox"
                checked={hasElderly}
                onChange={(e) => {
                  setHasElderly(e.target.checked);
                  onUpdateProfile({ ...userProfile, has_elderly: e.target.checked });
                }}
                className="rounded text-[#163323] focus:ring-[#163323]"
              />
              <span className="font-medium">Senior Citizens (65+ yrs) present</span>
            </label>
          </div>

          {/* Health Vulnerabilities */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Diagnosed Vulnerabilities</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                placeholder="e.g. Asthma, COPD, Hypertension..."
                value={newVulnerability}
                onChange={(e) => setNewVulnerability(e.target.value)}
                className="w-full text-xs p-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163323]"
              />
              <button
                onClick={addVulnerability}
                className="px-3 py-1 bg-[#163323] text-white rounded-lg text-xs font-semibold hover:bg-[#204933] shrink-0"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {vulnerabilities.map((v, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-800 text-[11px] font-semibold"
                >
                  <span>{v}</span>
                  <button onClick={() => removeVulnerability(v)} className="hover:text-red-950">
                    <Trash2 className="w-3 h-3 ml-1" />
                  </button>
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Demographics Vulnerability Guidance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Children Guidance Card */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8e0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-rose-700 font-bold text-sm mb-2">
              <Baby className="w-5 h-5" />
              <span>Children & Pediatric Protection</span>
            </div>
            <div className="text-xs text-gray-600 space-y-2 mb-4 leading-relaxed">
              <p>
                <strong>Why children are vulnerable:</strong> Children breathe 2–3 times faster than adults relative to body mass, and their lung alveoli are actively developing until age 8.
              </p>
              <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl text-rose-950 space-y-1">
                <strong>Action Protocol:</strong>
                <div>• Restrict outdoor school sports whenever AQI &gt; 150.</div>
                <div>• Use child-sized N95 masks (adult sizes create leakage gaps).</div>
                <div>• Avoid school transit in open auto-rickshaws during peak morning smog.</div>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-gray-400">Status: {hasChildren ? "Active in Household" : "Not configured"}</div>
        </div>

        {/* Elderly Guidance Card */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8e0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-indigo-700 font-bold text-sm mb-2">
              <Heart className="w-5 h-5" />
              <span>Senior Citizens & Cardiovascular</span>
            </div>
            <div className="text-xs text-gray-600 space-y-2 mb-4 leading-relaxed">
              <p>
                <strong>Cardiovascular risk:</strong> Fine PM2.5 crosses into capillaries, triggering systemic endothelial inflammation, blood viscosity elevation, and arterial spasm.
              </p>
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-indigo-950 space-y-1">
                <strong>Action Protocol:</strong>
                <div>• Cancel early morning walks (06:00 – 08:30 AM).</div>
                <div>• Maintain indoor temperature &gt;20°C to prevent cold-induced vasoconstriction.</div>
                <div>• Monitor blood pressure closely during acute smog episodes.</div>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-gray-400">Status: {hasElderly ? "Active in Household" : "Not configured"}</div>
        </div>

        {/* Respiratory & Asthmatic Guidance Card */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8e0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-amber-700 font-bold text-sm mb-2">
              <HeartPulse className="w-5 h-5" />
              <span>Respiratory & Asthmatic Action</span>
            </div>
            <div className="text-xs text-gray-600 space-y-2 mb-4 leading-relaxed">
              <p>
                <strong>Airway hyper-reactivity:</strong> Acidic sulfates and fine carbon particles cause rapid bronchospasm in asthmatic individuals.
              </p>
              <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl text-amber-950 space-y-1">
                <strong>Action Protocol:</strong>
                <div>• Keep prescribed rescue inhalers readily accessible at all times.</div>
                <div>• Seal bedroom with HEPA filtration running 24/7.</div>
                <div>• Avoid indoor fragrance, frying fumes, and agarbatti completely.</div>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-gray-400">Status: {vulnerabilities.length > 0 ? "Active Vulnerabilities Tracked" : "None Tracked"}</div>
        </div>

      </div>

      {/* School & Outdoor Activity Decision Matrix */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e0] shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div className="flex items-center space-x-2">
            <School className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-gray-900 tracking-tight">
              School & Children Outdoor Activity Decision Matrix
            </h2>
          </div>
          <span className="text-xs bg-gray-100 text-gray-700 font-semibold px-2.5 py-1 rounded-lg">
            Current AQI: {aqi} ({category})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">NAQI Range</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">School Recess & Sports</th>
                <th className="py-2.5 px-3">Commute Precautions</th>
                <th className="py-2.5 px-3">Recommended Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className={aqi <= 100 ? "bg-emerald-50/60 font-semibold" : ""}>
                <td className="py-3 px-3 text-emerald-700 font-bold">0 – 100</td>
                <td className="py-3 px-3">Good / Satisfactory</td>
                <td className="py-3 px-3 text-gray-700">Normal outdoor recess and PE sports allowed</td>
                <td className="py-3 px-3 text-gray-500">Standard transit</td>
                <td className="py-3 px-3 text-emerald-800">Natural classroom cross-ventilation encouraged</td>
              </tr>
              <tr className={aqi >= 101 && aqi <= 200 ? "bg-yellow-50/60 font-semibold" : ""}>
                <td className="py-3 px-3 text-amber-700 font-bold">101 – 200</td>
                <td className="py-3 px-3">Moderate</td>
                <td className="py-3 px-3 text-gray-700">Reduce vigorous outdoor running for asthmatic students</td>
                <td className="py-3 px-3 text-gray-500">Cloth mask or light scarf optional</td>
                <td className="py-3 px-3 text-amber-900">Keep emergency inhalers available with teachers</td>
              </tr>
              <tr className={aqi >= 201 && aqi <= 300 ? "bg-orange-50/70 font-semibold" : ""}>
                <td className="py-3 px-3 text-orange-700 font-bold">201 – 300</td>
                <td className="py-3 px-3">Poor</td>
                <td className="py-3 px-3 text-orange-950 font-bold">Move all physical education indoors; cancel playground recess</td>
                <td className="py-3 px-3 text-gray-700">Child-sized N95 masks strongly advised during transit</td>
                <td className="py-3 px-3 text-orange-900">Keep school classroom windows closed</td>
              </tr>
              <tr className={aqi >= 301 && aqi <= 400 ? "bg-red-50/70 font-semibold" : ""}>
                <td className="py-3 px-3 text-red-700 font-bold">301 – 400</td>
                <td className="py-3 px-3">Very Poor</td>
                <td className="py-3 px-3 text-red-950 font-bold">All outdoor activity strictly suspended. Consider hybrid online classes</td>
                <td className="py-3 px-3 text-red-950">Mandatory N95 respirator</td>
                <td className="py-3 px-3 text-red-900">Schools should operate HEPA purifiers or moist barriers</td>
              </tr>
              <tr className={aqi > 400 ? "bg-rose-100 font-bold" : ""}>
                <td className="py-3 px-3 text-red-900 font-black">401 – 500</td>
                <td className="py-3 px-3 text-red-950">Severe / Emergency</td>
                <td className="py-3 px-3 text-red-950">Immediate closure of primary schools as per GRAP / state protocol</td>
                <td className="py-3 px-3 text-red-950">Avoid all movement</td>
                <td className="py-3 px-3 text-red-950">Total shelter-in-place with indoor air purification</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Mask Efficacy Comparison Table */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8e0] shadow-xs">
        <h2 className="text-base font-bold text-gray-900 tracking-tight mb-3">Respiratory Mask Efficacy & Physics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-emerald-900">Certified N95 / FFP2</span>
              <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold text-[10px]">GOLD STANDARD</span>
            </div>
            <div className="text-2xl font-black text-emerald-800 mb-1">&gt;95%</div>
            <div className="text-[11px] text-gray-500 mb-2">Filtration of 0.3 µm test particles</div>
            <p className="text-gray-700 leading-snug">
              Uses electrostatically charged meltblown polypropylene. Forms a tight facial perimeter seal around nose bridge and chin. Essential during high smog commutes.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-gray-800">Surgical 3-Ply Mask</span>
              <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-700 font-bold text-[10px]">LIMITED</span>
            </div>
            <div className="text-2xl font-black text-gray-700 mb-1">30–50%</div>
            <div className="text-[11px] text-gray-500 mb-2">Filtration due to severe edge leakage</div>
            <p className="text-gray-600 leading-snug">
              Designed to catch exhaled droplet sprays, NOT microscopic smog particles. Air leaks freely around cheeks and nose gaps.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-red-200 bg-red-50/40">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-red-900">Cloth Mask / Scarf / Gamcha</span>
              <span className="px-2 py-0.5 rounded bg-red-200 text-red-900 font-bold text-[10px]">INEFFECTIVE</span>
            </div>
            <div className="text-2xl font-black text-red-800 mb-1">&lt;15%</div>
            <div className="text-[11px] text-gray-500 mb-2">PM2.5 filtration capacity</div>
            <p className="text-gray-600 leading-snug">
              Woven cotton weave has pores of 50–100 microns. Fine PM2.5 (2.5 microns) passes right through unhindered. Provides false sense of security.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
