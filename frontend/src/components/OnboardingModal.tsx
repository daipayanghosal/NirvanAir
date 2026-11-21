import React, { useState } from "react";
import {
  Wind,
  MapPin,
  Users,
  Car,
  Activity,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  X,
  Sparkles
} from "lucide-react";
import { UserProfile } from "../types";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onComplete: (profile: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onComplete
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({ ...userProfile });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(profile);
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSkip = () => {
    onComplete(userProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 bg-[#163323] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#849974] to-[#406850] flex items-center justify-center">
              <Wind className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight">Welcome to AIRWISE</span>
                <span className="text-[10px] bg-[#244b35] text-[#b6d4be] px-1.5 py-0.5 rounded font-mono">
                  Step {step}/4
                </span>
              </div>
              <p className="text-xs text-[#b0c8b6]">Hyperlocal air intelligence tailored to your home</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-gray-100 h-1.5">
          <div
            className="bg-[#163323] h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 text-xs">
          
          {/* STEP 1: Location Discovery */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 tracking-tight mb-1">Where do you live?</h3>
                <p className="text-gray-500">
                  AIRWISE uses hyperlocal atmospheric modeling and local monitoring stations to assess ground-level smog.
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-gray-700 block">Your Primary City / Neighborhood</label>
                <div className="relative">
                  <input
                    type="text"
                    value={profile.location_name}
                    onChange={(e) => setProfile({ ...profile, location_name: e.target.value })}
                    className="w-full p-2.5 pl-9 bg-gray-50 border border-gray-300 rounded-xl font-medium text-gray-900 focus:ring-2 focus:ring-[#163323]"
                  />
                  <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-950">
                <strong>Demonstration Hub:</strong> Defaults to Durgapur, West Bengal (industrial winter smog profile). You can switch to any global or Indian city anytime.
              </div>
            </div>
          )}

          {/* STEP 2: Household Members & Vulnerabilities */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 tracking-tight mb-1">Who lives in your home?</h3>
                <p className="text-gray-500">
                  Recommendations adapt heavily if children, senior citizens, or asthmatic individuals reside together.
                </p>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Household Size</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={profile.household_size}
                  onChange={(e) => setProfile({ ...profile, household_size: Number(e.target.value) })}
                  className="w-24 p-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-center text-sm"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="font-semibold text-gray-700 block">Household Composition</label>
                
                <label className="flex items-center space-x-2.5 p-2.5 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={profile.has_children}
                    onChange={(e) => setProfile({ ...profile, has_children: e.target.checked })}
                    className="rounded text-[#163323] focus:ring-[#163323]"
                  />
                  <span className="font-medium text-gray-800">Children / Toddlers present (Under 14)</span>
                </label>

                <label className="flex items-center space-x-2.5 p-2.5 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={profile.has_elderly}
                    onChange={(e) => setProfile({ ...profile, has_elderly: e.target.checked })}
                    className="rounded text-[#163323] focus:ring-[#163323]"
                  />
                  <span className="font-medium text-gray-800">Senior Citizens present (65+)</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: Commute & Daily Routine */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 tracking-tight mb-1">How do you commute and exercise?</h3>
                <p className="text-gray-500">
                  Helps our AI Daily Planner schedule your outdoor movements around smog peaks.
                </p>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Primary Commuting Method</label>
                <select
                  value={profile.commute_mode}
                  onChange={(e) => setProfile({ ...profile, commute_mode: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#163323]"
                >
                  <option value="two-wheeler">Open Motorcycle / Scooter (Two-Wheeler)</option>
                  <option value="car">Private Petrol / Diesel Car</option>
                  <option value="public_transit">Public Metro / Bus</option>
                  <option value="cycling_walking">Bicycle / Walking</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Exercise Habits</label>
                <select
                  value={profile.exercise_pref}
                  onChange={(e) => setProfile({ ...profile, exercise_pref: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#163323]"
                >
                  <option value="morning_outdoor">Outdoor Jogging / Running (Morning)</option>
                  <option value="evening_outdoor">Outdoor Walking (Evening)</option>
                  <option value="indoor_gym">Indoor Gym / Treadmill</option>
                  <option value="home_yoga">Home Yoga / Calisthenics</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 4: Budget & Air Purifier Setup */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 tracking-tight mb-1">Affordability & Equipment</h3>
                <p className="text-gray-500">
                  AIRWISE prioritizes zero-cost and affordable interventions rather than expecting every family to buy expensive machines.
                </p>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1.5">Household Budget Preference</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["budget", "moderate", "premium"] as const).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setProfile({ ...profile, budget: b })}
                      className={`p-3 rounded-xl border text-center uppercase tracking-wider font-bold transition-all ${
                        profile.budget === b
                          ? "bg-[#163323] text-white border-[#163323]"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2.5 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={profile.has_air_purifier}
                    onChange={(e) => setProfile({ ...profile, has_air_purifier: e.target.checked })}
                    className="rounded text-[#163323] focus:ring-[#163323]"
                  />
                  <div>
                    <span className="font-semibold text-gray-900 block">I currently own an electric HEPA air purifier</span>
                    <span className="text-gray-500 text-[11px]">If unchecked, we'll provide DIY Corsi-Rosenthal & wet-barrier guides.</span>
                  </div>
                </label>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div>
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="px-3 py-1.5 text-gray-600 font-semibold hover:text-gray-900 flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                onClick={handleSkip}
                className="text-gray-400 hover:text-gray-600 font-medium text-xs px-2"
              >
                Skip / Use Defaults
              </button>
            )}
          </div>

          <button
            onClick={handleNext}
            className="px-5 py-2 bg-[#163323] hover:bg-[#204933] text-white rounded-xl font-bold flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <span>{step === 4 ? "Complete Setup" : "Next Step"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
