import React, { useState } from "react";
import {
  ShieldAlert,
  Baby,
  HeartPulse,
  Heart,
  AlertTriangle,
  School,
  Trash2
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
      <div className="bg-[#ffffff] rounded-[28px] p-6 border border-[#c2c9bf]/40 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 m3-label-medium text-[#1e6b45] uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 text-[#1e6b45]" />
            <span>Vulnerability & Household Protection</span>
          </div>
          <h1 className="m3-headline-small text-[#191d19]">Family Safety & Exposure Defense</h1>
          <p className="m3-body-small text-[#727972] mt-0.5 max-w-xl">
            Tailor environmental safety rules specifically for children, senior citizens, and household members with respiratory or cardiovascular sensitivities.
          </p>
        </div>

        {/* Medical Disclaimer Card */}
        <div className="p-4 bg-[#ffdad6]/60 border border-[#ba1a1a]/30 rounded-[24px] text-xs text-[#410002] shrink-0 max-w-xs">
          <div className="font-bold flex items-center space-x-1.5 mb-1">
            <AlertTriangle className="w-4 h-4 text-[#ba1a1a]" />
            <span>Medical Disclaimer</span>
          </div>
          <p className="text-[11px] leading-relaxed opacity-90">
            AIRWISE is an informational decision-support platform, NOT a medical device. It does not diagnose diseases or prescribe clinical therapies.
          </p>
        </div>
      </div>

      {/* Household Profile Configurator */}
      <div className="bg-[#ffffff] rounded-[28px] p-6 border border-[#c2c9bf]/40 shadow-xs">
        <h2 className="m3-title-medium text-[#191d19] mb-4">Configure Household Profile</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Household Size */}
          <div>
            <label className="m3-label-medium text-[#424942] block mb-1.5">Total Household Members</label>
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
                className="w-24 p-3 bg-[#f1f5ed] border border-[#c2c9bf]/60 rounded-2xl font-black text-center text-sm text-[#191d19]"
              />
              <span className="text-xs text-[#506353]">People residing together</span>
            </div>
          </div>

          {/* Children & Elderly Toggles */}
          <div className="space-y-3">
            <label className="m3-label-medium text-[#424942] block">Vulnerable Demographics</label>
            
            <label className="flex items-center space-x-3 p-3 rounded-2xl border border-[#c2c9bf]/50 bg-[#f1f5ed] cursor-pointer hover:bg-[#ebf0e8] transition-colors">
              <input
                type="checkbox"
                checked={hasChildren}
                onChange={(e) => {
                  setHasChildren(e.target.checked);
                  onUpdateProfile({ ...userProfile, has_children: e.target.checked });
                }}
                className="rounded text-[#1e6b45] focus:ring-[#1e6b45] w-4 h-4"
              />
              <span className="text-xs font-bold text-[#191d19]">Children present (&lt;14 yrs)</span>
            </label>

            <label className="flex items-center space-x-3 p-3 rounded-2xl border border-[#c2c9bf]/50 bg-[#f1f5ed] cursor-pointer hover:bg-[#ebf0e8] transition-colors">
              <input
                type="checkbox"
                checked={hasElderly}
                onChange={(e) => {
                  setHasElderly(e.target.checked);
                  onUpdateProfile({ ...userProfile, has_elderly: e.target.checked });
                }}
                className="rounded text-[#1e6b45] focus:ring-[#1e6b45] w-4 h-4"
              />
              <span className="text-xs font-bold text-[#191d19]">Senior Citizens present (65+)</span>
            </label>
          </div>

          {/* Health Vulnerabilities */}
          <div>
            <label className="m3-label-medium text-[#424942] block mb-1.5">Diagnosed Sensitivities</label>
            <div className="flex space-x-2 mb-2.5">
              <input
                type="text"
                placeholder="e.g. Asthma, COPD, Hypertension..."
                value={newVulnerability}
                onChange={(e) => setNewVulnerability(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#f1f5ed] border border-[#c2c9bf]/60 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1e6b45] text-[#191d19]"
              />
              <button
                onClick={addVulnerability}
                className="px-4 py-2 bg-[#1e6b45] text-white rounded-full text-xs font-bold hover:bg-[#155335] shrink-0 shadow-xs"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {vulnerabilities.map((v, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#ffdad6] text-[#410002] text-[11px] font-bold"
                >
                  <span>{v}</span>
                  <button onClick={() => removeVulnerability(v)} className="hover:text-black">
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
        <div className="bg-[#ffffff] p-6 rounded-[28px] border border-[#c2c9bf]/40 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-rose-700 font-bold text-sm mb-2">
              <Baby className="w-5 h-5" />
              <span className="m3-title-small">Pediatric Defense</span>
            </div>
            <div className="text-xs text-[#424942] space-y-2 mb-4 leading-relaxed">
              <p>
                <strong>Why children are vulnerable:</strong> Children breathe 2–3 times faster relative to body mass, and their lung alveoli are actively developing until age 8.
              </p>
              <div className="p-3.5 bg-rose-50 rounded-[20px] border border-rose-100 text-rose-950 space-y-1">
                <strong>Action Protocol:</strong>
                <div>• Restrict outdoor school sports whenever AQI &gt; 150.</div>
                <div>• Use child-sized N95 masks (adult sizes create leakage gaps).</div>
                <div>• Avoid school transit in open auto-rickshaws during peak morning smog.</div>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-[#727972] font-semibold">Status: {hasChildren ? "Active in Household" : "Not configured"}</div>
        </div>

        {/* Elderly Guidance Card */}
        <div className="bg-[#ffffff] p-6 rounded-[28px] border border-[#c2c9bf]/40 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-indigo-700 font-bold text-sm mb-2">
              <Heart className="w-5 h-5" />
              <span className="m3-title-small">Senior Citizen Cardiac Protection</span>
            </div>
            <div className="text-xs text-[#424942] space-y-2 mb-4 leading-relaxed">
              <p>
                <strong>Cardiovascular risk:</strong> Fine PM2.5 crosses into pulmonary capillaries, triggering systemic endothelial inflammation, blood viscosity elevation, and arterial spasm.
              </p>
              <div className="p-3.5 bg-indigo-50 rounded-[20px] border border-indigo-100 text-indigo-950 space-y-1">
                <strong>Action Protocol:</strong>
                <div>• Cancel early morning walks (06:00 – 08:30 AM).</div>
                <div>• Maintain indoor temperature &gt;20°C to prevent cold-induced vasoconstriction.</div>
                <div>• Monitor blood pressure closely during acute smog episodes.</div>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-[#727972] font-semibold">Status: {hasElderly ? "Active in Household" : "Not configured"}</div>
        </div>

        {/* Respiratory & Asthmatic Guidance Card */}
        <div className="bg-[#ffffff] p-6 rounded-[28px] border border-[#c2c9bf]/40 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-amber-700 font-bold text-sm mb-2">
              <HeartPulse className="w-5 h-5" />
              <span className="m3-title-small">Respiratory & Asthmatic Action</span>
            </div>
            <div className="text-xs text-[#424942] space-y-2 mb-4 leading-relaxed">
              <p>
                <strong>Airway hyper-reactivity:</strong> Acidic sulfates and fine carbon particles cause rapid bronchospasm in asthmatic individuals.
              </p>
              <div className="p-3.5 bg-amber-50 rounded-[20px] border border-amber-100 text-amber-950 space-y-1">
                <strong>Action Protocol:</strong>
                <div>• Keep prescribed rescue inhalers readily accessible at all times.</div>
                <div>• Seal bedroom with HEPA filtration running 24/7.</div>
                <div>• Avoid indoor fragrance, frying fumes, and agarbatti completely.</div>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-[#727972] font-semibold">Status: {vulnerabilities.length > 0 ? "Active Vulnerabilities Tracked" : "None Tracked"}</div>
        </div>

      </div>

      {/* School & Outdoor Activity Decision Matrix */}
      <div className="bg-[#ffffff] rounded-[28px] p-6 border border-[#c2c9bf]/40 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#c2c9bf]/30 mb-4">
          <div className="flex items-center space-x-2">
            <School className="w-5 h-5 text-[#1e6b45]" />
            <h2 className="m3-title-medium text-[#191d19]">
              School & Recess Decision Matrix
            </h2>
          </div>
          <span className="text-xs bg-[#ebf0e8] text-[#191d19] font-bold px-3 py-1 rounded-full">
            Current AQI: {aqi} ({category})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#c2c9bf]/30 text-[#727972] uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">NAQI Range</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">School Recess & Sports</th>
                <th className="py-3 px-3">Commute Precautions</th>
                <th className="py-3 px-3">Recommended Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c2c9bf]/20">
              <tr className={aqi <= 100 ? "bg-[#d3e8d4]/40 font-bold" : ""}>
                <td className="py-3.5 px-3 text-[#1e6b45] font-black">0 – 100</td>
                <td className="py-3.5 px-3 font-semibold">Good / Satisfactory</td>
                <td className="py-3.5 px-3 text-[#424942]">Normal outdoor recess and PE sports allowed</td>
                <td className="py-3.5 px-3 text-[#727972]">Standard transit</td>
                <td className="py-3.5 px-3 text-[#1e6b45] font-semibold">Natural classroom cross-ventilation encouraged</td>
              </tr>
              <tr className={aqi >= 101 && aqi <= 200 ? "bg-amber-50 font-bold" : ""}>
                <td className="py-3.5 px-3 text-amber-700 font-black">101 – 200</td>
                <td className="py-3.5 px-3 font-semibold">Moderate</td>
                <td className="py-3.5 px-3 text-[#424942]">Reduce vigorous outdoor running for asthmatic students</td>
                <td className="py-3.5 px-3 text-[#727972]">Cloth mask optional</td>
                <td className="py-3.5 px-3 text-amber-900 font-semibold">Keep emergency inhalers available with teachers</td>
              </tr>
              <tr className={aqi >= 201 && aqi <= 300 ? "bg-orange-50 font-bold" : ""}>
                <td className="py-3.5 px-3 text-orange-700 font-black">201 – 300</td>
                <td className="py-3.5 px-3 font-semibold">Poor</td>
                <td className="py-3.5 px-3 text-orange-950 font-black">Move PE indoors; cancel playground recess</td>
                <td className="py-3.5 px-3 text-[#424942]">Child-sized N95 masks advised during transit</td>
                <td className="py-3.5 px-3 text-orange-950 font-semibold">Keep school classroom windows closed</td>
              </tr>
              <tr className={aqi >= 301 && aqi <= 400 ? "bg-[#ffdad6]/60 font-bold" : ""}>
                <td className="py-3.5 px-3 text-[#ba1a1a] font-black">301 – 400</td>
                <td className="py-3.5 px-3 font-semibold">Very Poor</td>
                <td className="py-3.5 px-3 text-[#410002] font-black">All outdoor activity suspended. Consider hybrid classes</td>
                <td className="py-3.5 px-3 text-[#410002]">Mandatory N95 respirator</td>
                <td className="py-3.5 px-3 text-[#ba1a1a] font-semibold">Operate HEPA purifiers or moist barriers</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
