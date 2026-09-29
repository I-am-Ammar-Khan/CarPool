import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  ShieldCheck,
  Phone,
  ArrowRight,
  Mail
} from "lucide-react";
import { OnboardingModal } from "./OnboardingModal";
export const ProfileScreen = ({ onOpenVerification }) => {
  const {
    currentUser,
    switchUserRole,
    setCurrentScreen,
    DEMO_USERS,
    loginAsDemoUser
  } = useApp();
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  return <div className="min-h-screen bg-[#fcf9f2] text-[#0d1820] pb-28">
      {
    /* Header */
  }
      <div className="sticky top-0 z-30 bg-[#fcf9f2]/95 backdrop-blur-md px-4 py-3 border-b border-[#112b54]/10 flex items-center justify-between">
        <h2 className="font-serif italic text-lg font-medium text-[#0d1820]">
          Profile & Security<span className="text-[#112b54]">.</span>
        </h2>
        <button
    onClick={() => setShowOnboardingModal(true)}
    className="text-xs text-[#112b54] font-semibold hover:underline flex items-center gap-1"
  >
          <span>Edit Profile</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-4">
        {
    /* User Card */
  }
        <div className="p-4 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
    src={currentUser.avatar}
    alt={currentUser.name}
    className="w-12 h-12 rounded-full object-cover border border-[#112b54]/20"
  />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-[#0d1820]">{currentUser.name}</span>
                {currentUser.isAadhaarVerified && <ShieldCheck className="w-4 h-4 text-[#112b54]" title="Aadhaar Verified" />}
              </div>
              <span className="text-xs text-[#7a7f87]">{currentUser.occupation}</span>
              <div className="text-[11px] text-[#7a7f87] mt-0.5">
                {currentUser.phone} • {currentUser.email}
              </div>
            </div>
          </div>

          <button
    onClick={() => setShowOnboardingModal(true)}
    className="px-2.5 py-1 rounded-xl bg-[#fcf9f2] border border-[#112b54]/15 text-[11px] font-medium text-[#0d1820]"
  >
            Review KYC
          </button>
        </div>

        {
    /* Verification Checkpoints */
  }
        <div className="p-4 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs space-y-2.5">
          <span className="text-[10px] text-[#7a7f87] uppercase tracking-wider block font-semibold">
            One-Time Onboarding Status
          </span>

          <div className="space-y-1.5 text-xs">
            <div className="p-2 rounded-xl bg-[#fcf9f2] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#112b54]" />
                <span className="text-[#0d1820]">UIDAI Aadhaar Verified</span>
              </div>
              <span className="font-mono text-[11px] text-[#7a7f87]">
                {currentUser.aadhaarNumberMasked || "XXXX-XXXX-1234"}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-[#fcf9f2] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#112b54]" />
                <span className="text-[#0d1820]">Phone Verified (OTP)</span>
              </div>
              <span className="font-mono text-[11px] text-[#7a7f87]">
                {currentUser.phone}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-[#fcf9f2] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#112b54]" />
                <span className="text-[#0d1820]">Email Verified</span>
              </div>
              <span className="text-[11px] text-[#7a7f87] truncate max-w-[140px]">
                {currentUser.email}
              </span>
            </div>
          </div>
        </div>

        {
    /* Emergency Contact */
  }
        <div className="p-4 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs space-y-1">
          <span className="text-[10px] text-[#7a7f87] uppercase tracking-wider block">
            Emergency SOS Contact
          </span>
          <div className="text-xs font-semibold text-[#0d1820]">
            {currentUser.emergencyContact.name} ({currentUser.emergencyContact.relationship})
          </div>
          <div className="text-[11px] text-[#7a7f87]">
            {currentUser.emergencyContact.phone}
          </div>
        </div>

        {
    /* Vehicle (Driver) */
  }
        {currentUser.car && <div className="p-4 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs space-y-1">
            <span className="text-[10px] text-[#7a7f87] uppercase tracking-wider block">
              Registered Car
            </span>
            <div className="text-xs font-semibold text-[#0d1820]">
              {currentUser.car.model} • {currentUser.car.color}
            </div>
            <div className="font-mono text-[11px] text-[#7a7f87]">
              {currentUser.car.plate} ({currentUser.car.carType})
            </div>
          </div>}

        {
    /* Demo Persona Switcher */
  }
        <div className="p-4 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs space-y-2.5">
          <span className="text-[10px] font-semibold text-[#112b54] uppercase tracking-wider block">
            Switch Demo Account
          </span>
          <div className="space-y-1.5">
            {DEMO_USERS.map((u) => <button
    key={u.id}
    onClick={() => loginAsDemoUser(u.id)}
    className={`w-full p-2 rounded-xl text-xs flex items-center justify-between transition-colors border ${currentUser.id === u.id ? "bg-[#112b54] text-white border-[#112b54]" : "bg-[#fcf9f2] border-[#112b54]/10 text-[#0d1820] hover:bg-white"}`}
  >
                <div className="flex items-center gap-2">
                  <img
    src={u.avatar}
    alt={u.name}
    className="w-6 h-6 rounded-full object-cover"
  />
                  <span className="font-medium">{u.name}</span>
                </div>
                <span className="text-[10px] capitalize opacity-80">{u.role}</span>
              </button>)}
          </div>
        </div>
      </div>

      <OnboardingModal
    isOpen={showOnboardingModal}
    onClose={() => setShowOnboardingModal(false)}
  />
    </div>;
};
