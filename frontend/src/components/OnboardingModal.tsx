import React, { useState } from "react";
import {
  Wind,
  MapPin,
  ChevronRight,
  ChevronLeft,
  X
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
      <div className="bg-[#ffffff] rounded-[32px] max-w-lg w-full shadow-2xl border border-[#c2c9bf]/40 overflow-hidden flex flex-col">
        
        {/* M3 Modal Header */}
        <div className="p-6 bg-[#f1f5ed] border-b border-[#c2c9bf]/30 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#bbf3cd] text-[#002111] flex items-center justify-center shadow-xs">
              <Wind className="w-6 h-6 text-[#1e6b45]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="m3-title-medium text-[#191d19]">Welcome to NirvanAir</span>
                <span className="text-[10px] bg-[#d3e8d4] text-[#0e1f13] px-2.5 py-0.5 rounded-full font-bold">
                  Step {step}/4
                </span>
              </div>
              <p className="m3-body-small text-[#727972]">Hyperlocal air intelligence tailored to your home</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-[#ebf0e8] flex items-center justify-center text-[#424942]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* M3 Linear Progress Indicator */}
        <div className="w-full bg-[#ebf0e8] h-1.5">
          <div
            className="bg-[#1e6b45] h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 text-xs">
          
          {/* STEP 1: Location Discovery */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="m3-title-small text-[#191d19] mb-1">Where do you live?</h3>
                <p className="m3-body-small text-[#727972]">
                  NirvanAir uses hyperlocal atmospheric modeling and local monitoring stations to assess ground-level smog.
                </p>
              </div>

              <div className="space-y-2">
                <label className="m3-label-medium text-[#424942] block">Your City / Neighborhood</label>
                <div className="relative">
                  <input
                    type="text"
                    value={profile.location_name}
                    onChange={(e) => setProfile({ ...profile, location_name: e.target.value })}
                    className="w-full p-3 pl-10 bg-[#f1f5ed] border border-[#c2c9bf]/60 rounded-full font-bold text-[#191d19] focus:ring-2 focus:ring-[#1e6b45] text-xs"
                  />
                  <MapPin className="w-4 h-4 text-[#1e6b45] absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="p-4 bg-[#d3e8d4]/40 rounded-[22px] border border-[#d3e8d4] text-[#0e1f13]">
                <strong>Demonstration Hub:</strong> Defaults to Durgapur, West Bengal (industrial winter smog profile). You can switch to any global or Indian city anytime.
              </div>
            </div>
          )}

          {/* STEP 2: Household Members */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="m3-title-small text-[#191d19] mb-1">Who lives in your home?</h3>
                <p className="m3-body-small text-[#727972]">
                  Recommendations adapt heavily if children, senior citizens, or asthmatic individuals reside together.
                </p>
              </div>

              <div>
                <label className="m3-label-medium text-[#424942] block mb-1.5">Household Size</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={profile.household_size}
                  onChange={(e) => setProfile({ ...profile, household_size: Number(e.target.value) })}
                  className="w-24 p-3 bg-[#f1f5ed] border border-[#c2c9bf]/60 rounded-2xl font-black text-center text-sm text-[#191d19]"
                />
              </div>

              <div className="space-y-2.5 pt-2">
                <label className="m3-label-medium text-[#424942] block">Household Composition</label>
                
                <label className="flex items-center space-x-3 p-3.5 rounded-[20px] border border-[#c2c9bf]/40 bg-[#f1f5ed] cursor-pointer hover:bg-[#ebf0e8] transition-colors">
                  <input
                    type="checkbox"
                    checked={profile.has_children}
                    onChange={(e) => setProfile({ ...profile, has_children: e.target.checked })}
                    className="rounded text-[#1e6b45] focus:ring-[#1e6b45] w-4 h-4"
                  />
                  <span className="font-bold text-[#191d19]">Children / Toddlers present (Under 14)</span>
                </label>

                <label className="flex items-center space-x-3 p-3.5 rounded-[20px] border border-[#c2c9bf]/40 bg-[#f1f5ed] cursor-pointer hover:bg-[#ebf0e8] transition-colors">
                  <input
                    type="checkbox"
                    checked={profile.has_elderly}
                    onChange={(e) => setProfile({ ...profile, has_elderly: e.target.checked })}
                    className="rounded text-[#1e6b45] focus:ring-[#1e6b45] w-4 h-4"
                  />
                  <span className="font-bold text-[#191d19]">Senior Citizens present (65+)</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: Commute & Exercise */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="m3-title-small text-[#191d19] mb-1">Commuting & Exercise</h3>
                <p className="m3-body-small text-[#727972]">
                  Helps our AI Daily Planner schedule your outdoor movements around smog peaks.
                </p>
              </div>

              <div>
                <label className="m3-label-medium text-[#424942] block mb-1.5">Primary Commuting Method</label>
                <select
                  value={profile.commute_mode}
                  onChange={(e) => setProfile({ ...profile, commute_mode: e.target.value })}
                  className="w-full p-3 bg-[#f1f5ed] border border-[#c2c9bf]/60 rounded-2xl focus:ring-2 focus:ring-[#1e6b45] text-[#191d19]"
                >
                  <option value="two-wheeler">Open Motorcycle / Scooter (Two-Wheeler)</option>
                  <option value="car">Private Petrol / Diesel Car</option>
                  <option value="public_transit">Public Metro / Bus</option>
                  <option value="cycling_walking">Bicycle / Walking</option>
                </select>
              </div>

              <div>
                <label className="m3-label-medium text-[#424942] block mb-1.5">Exercise Habits</label>
                <select
                  value={profile.exercise_pref}
                  onChange={(e) => setProfile({ ...profile, exercise_pref: e.target.value })}
                  className="w-full p-3 bg-[#f1f5ed] border border-[#c2c9bf]/60 rounded-2xl focus:ring-2 focus:ring-[#1e6b45] text-[#191d19]"
                >
                  <option value="morning_outdoor">Outdoor Jogging / Running (Morning)</option>
                  <option value="evening_outdoor">Outdoor Walking (Evening)</option>
                  <option value="indoor_gym">Indoor Gym / Treadmill</option>
                  <option value="home_yoga">Home Yoga / Calisthenics</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 4: Budget & Purifier */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="m3-title-small text-[#191d19] mb-1">Affordability & Equipment</h3>
                <p className="m3-body-small text-[#727972]">
                  NirvanAir prioritizes zero-cost and affordable interventions rather than expecting every family to buy expensive machines.
                </p>
              </div>

              <div>
                <label className="m3-label-medium text-[#424942] block mb-2">Household Budget Preference</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["budget", "moderate", "premium"] as const).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setProfile({ ...profile, budget: b })}
                      className={`p-3.5 rounded-[20px] border text-center uppercase tracking-wider font-bold transition-all text-xs ${
                        profile.budget === b
                          ? "bg-[#1e6b45] text-white border-[#1e6b45] shadow-xs"
                          : "bg-[#f1f5ed] text-[#424942] border-[#c2c9bf]/50 hover:bg-[#ebf0e8]"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-3 p-3.5 rounded-[20px] border border-[#c2c9bf]/40 bg-[#f1f5ed] cursor-pointer hover:bg-[#ebf0e8] transition-colors">
                  <input
                    type="checkbox"
                    checked={profile.has_air_purifier}
                    onChange={(e) => setProfile({ ...profile, has_air_purifier: e.target.checked })}
                    className="rounded text-[#1e6b45] focus:ring-[#1e6b45] w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-[#191d19] block">I currently own an electric HEPA air purifier</span>
                    <span className="text-[#506353] text-[11px]">If unchecked, we'll provide DIY Corsi-Rosenthal & wet-barrier guides.</span>
                  </div>
                </label>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 bg-[#f1f5ed] border-t border-[#c2c9bf]/30 flex items-center justify-between">
          <div>
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-[#424942] font-bold hover:text-[#191d19] flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                onClick={handleSkip}
                className="text-[#727972] hover:text-[#191d19] font-semibold text-xs px-2"
              >
                Skip Setup
              </button>
            )}
          </div>

          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-[#1e6b45] hover:bg-[#155335] text-white rounded-full font-bold flex items-center space-x-1.5 shadow-xs transition-transform active:scale-95"
          >
            <span>{step === 4 ? "Complete Setup" : "Next Step"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
