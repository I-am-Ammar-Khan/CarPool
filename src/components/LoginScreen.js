import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  ShieldCheck,
  CheckCircle2,
  Phone,
  User,
  CreditCard,
  ArrowLeft,
  ArrowRight,
  Car,
  Luggage
} from "lucide-react";
export const LoginScreen = () => {
  const {
    currentUser,
    updateUserProfile,
    setCurrentScreen,
    goBack,
    selectDemoUser
  } = useApp();
  const [selectedRole, setSelectedRole] = useState(currentUser.role === "admin" ? "driver" : currentUser.role);
  const [name, setName] = useState(currentUser.name || "Ammar Khan");
  const [phone, setPhone] = useState(currentUser.phone || "+91 98201 44819");
  const [isPhoneVerified, setIsPhoneVerified] = useState(currentUser.isPhoneVerified ?? true);
  const [phoneOtp, setPhoneOtp] = useState("8319");
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("8319");
  const [aadhaarNumber, setAadhaarNumber] = useState("5421-9876-1234");
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(currentUser.isAadhaarVerified ?? true);
  const [avatar, setAvatar] = useState(currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80");
  const [dlNumber, setDlNumber] = useState(currentUser.drivingLicense?.licenseNumber || "UP32-2018-0094812");
  const [isDlVerified, setIsDlVerified] = useState(currentUser.drivingLicense?.isVerified ?? true);
  const [dlPhoto, setDlPhoto] = useState(currentUser.drivingLicense?.photoUrl || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&auto=format&fit=crop&q=80");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const sampleAvatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80"
  ];
  const handleSendOtp = () => {
    setOtpSent(true);
  };
  const handleVerifyOtp = () => {
    if (otpInput.length === 4) {
      setIsPhoneVerified(true);
    }
  };
  const handleVerifyAadhaar = () => {
    if (aadhaarNumber.replace(/\D/g, "").length >= 12) {
      setIsAadhaarVerified(true);
    }
  };
  const handleVerifyDl = () => {
    if (dlNumber.trim().length >= 8) {
      setIsDlVerified(true);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateUserProfile({
        name: name.trim() || "User",
        phone,
        isPhoneVerified: true,
        isAadhaarVerified: true,
        aadhaarNumber: aadhaarNumber.replace(/(\d{4})-(\d{4})-(\d{4})/, "XXXX-XXXX-$3"),
        avatar,
        role: selectedRole,
        drivingLicense: selectedRole === "driver" ? {
          licenseNumber: dlNumber,
          isVerified: isDlVerified,
          photoUrl: dlPhoto
        } : currentUser.drivingLicense
      });
      setSaveSuccess(true);
      setTimeout(() => {
        if (selectedRole === "driver") {
          setCurrentScreen("create_ride");
        } else {
          setCurrentScreen("search_ride");
        }
      }, 1e3);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="min-h-screen bg-[#fcf9f2] text-[#0d1820] pb-28">
      {
    /* Header */
  }
      <div className="sticky top-0 z-30 bg-[#fcf9f2]/95 backdrop-blur-md px-4 py-3 border-b border-[#112b54]/10 flex items-center justify-between">
        <button
    onClick={goBack}
    className="p-1 rounded-lg text-[#7a7f87] hover:text-[#0d1820]"
  >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-serif italic text-lg font-medium text-[#0d1820]">
          Login & Verification<span className="text-[#112b54]">.</span>
        </h2>
        <div className="w-6" />
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-4">
        {
    /* Intro */
  }
        <div className="px-1 space-y-1">
          <h3 className="font-serif italic text-2xl text-[#0d1820] font-medium leading-tight">
            User Verification<span className="text-[#112b54]">.</span>
          </h3>
          <p className="text-xs text-[#7a7f87]">
            Universal login & trust check for car owners and passengers.
          </p>
        </div>

        {
    /* Role Selection Tabs */
  }
        <div className="grid grid-cols-2 gap-2 p-1 bg-white rounded-2xl border border-[#112b54]/15 shadow-xs">
          <button
    type="button"
    id="login-role-driver"
    onClick={() => setSelectedRole("driver")}
    className={`py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all ${selectedRole === "driver" ? "bg-[#0d1820] text-white shadow-xs font-semibold" : "text-[#7a7f87] hover:text-[#0d1820]"}`}
  >
            <Car className="w-3.5 h-3.5" />
            <span>I'm a Car Owner</span>
          </button>
          <button
    type="button"
    id="login-role-passenger"
    onClick={() => setSelectedRole("passenger")}
    className={`py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all ${selectedRole === "passenger" ? "bg-[#0d1820] text-white shadow-xs font-semibold" : "text-[#7a7f87] hover:text-[#0d1820]"}`}
  >
            <Luggage className="w-3.5 h-3.5" />
            <span>I'm a Passenger</span>
          </button>
        </div>

        {
    /* Demo Quick Switch */
  }
        <div className="p-3 rounded-2xl bg-white border border-[#112b54]/10 flex items-center justify-between text-xs">
          <span className="text-[11px] text-[#7a7f87]">Quick test profiles:</span>
          <div className="flex gap-1.5">
            <button
    type="button"
    onClick={() => {
      selectDemoUser("usr_arjun_verma");
      setName("Arjun Verma");
      setPhone("+91 98765 43210");
      setSelectedRole("driver");
      setIsAadhaarVerified(true);
      setIsPhoneVerified(true);
      setIsDlVerified(true);
    }}
    className="px-2 py-1 rounded-lg bg-[#fcf9f2] border border-[#112b54]/15 text-[10px] font-medium text-[#0d1820] hover:bg-[#112b54] hover:text-white transition-colors"
  >
              🚗 Driver (Arjun)
            </button>
            <button
    type="button"
    onClick={() => {
      selectDemoUser("usr_priya_sharma");
      setName("Priya Sharma");
      setPhone("+91 97123 45678");
      setSelectedRole("passenger");
      setIsAadhaarVerified(true);
      setIsPhoneVerified(true);
    }}
    className="px-2 py-1 rounded-lg bg-[#fcf9f2] border border-[#112b54]/15 text-[10px] font-medium text-[#0d1820] hover:bg-[#112b54] hover:text-white transition-colors"
  >
              🧳 Passenger (Priya)
            </button>
          </div>
        </div>

        {saveSuccess ? <div className="p-6 rounded-2xl bg-white border border-[#112b54]/20 text-center space-y-2 animate-in zoom-in-95 shadow-sm">
            <div className="w-10 h-10 bg-[#fcf9f2] text-[#112b54] rounded-full flex items-center justify-center mx-auto border border-[#112b54]/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="font-serif italic text-lg text-[#0d1820]">Identity Confirmed!</h4>
            <p className="text-xs text-[#7a7f87]">
              Redirecting to {selectedRole === "driver" ? "Offer a Ride" : "Find a Ride"}...
            </p>
          </div> : <form onSubmit={handleSubmit} className="space-y-4">
            {
    /* 1. Name */
  }
            <div className="p-4 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#112b54] block">
                1. Full Legal Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#7a7f87] absolute left-3 top-3" />
                <input
    type="text"
    required
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Enter full name as per Government ID"
    className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl pl-9 pr-3 py-2 text-xs text-[#0d1820] focus:outline-none focus:border-[#112b54]"
  />
              </div>
            </div>

            {
    /* 2. Phone Verification */
  }
            <div className="p-4 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#112b54] block">
                  2. Phone Verification
                </label>
                {isPhoneVerified && <span className="text-[11px] text-[#112b54] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>}
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Phone className="w-4 h-4 text-[#7a7f87] absolute left-3 top-2.5" />
                  <input
    type="tel"
    required
    value={phone}
    onChange={(e) => {
      setPhone(e.target.value);
      setIsPhoneVerified(false);
    }}
    placeholder="+91 98201 44819"
    className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl pl-9 pr-3 py-2 text-xs text-[#0d1820] focus:outline-none focus:border-[#112b54]"
  />
                </div>
                {!isPhoneVerified && <button
    type="button"
    onClick={handleSendOtp}
    className="px-3 py-2 rounded-xl bg-[#0d1820] text-white text-xs font-medium hover:bg-[#112b54] transition-colors"
  >
                    {otpSent ? "Resend" : "Send OTP"}
                  </button>}
              </div>

              {otpSent && !isPhoneVerified && <div className="p-2.5 bg-[#fcf9f2] rounded-xl border border-[#112b54]/15 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#7a7f87]">Enter OTP:</span>
                    <input
    type="text"
    maxLength={4}
    value={otpInput}
    onChange={(e) => setOtpInput(e.target.value)}
    className="w-20 bg-white border border-[#112b54]/20 rounded-lg px-2 py-1 text-xs text-center font-mono font-bold tracking-widest text-[#0d1820]"
  />
                  </div>
                  <button
    type="button"
    onClick={handleVerifyOtp}
    className="px-2.5 py-1 rounded-lg bg-[#112b54] text-white text-xs font-medium"
  >
                    Confirm OTP
                  </button>
                </div>}
            </div>

            {
    /* 3. Aadhaar Verification */
  }
            <div className="p-4 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#112b54] block">
                  3. Aadhaar Verification
                </label>
                {isAadhaarVerified && <span className="text-[11px] text-[#112b54] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> UIDAI Verified
                  </span>}
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <ShieldCheck className="w-4 h-4 text-[#7a7f87] absolute left-3 top-2.5" />
                  <input
    type="text"
    required
    value={aadhaarNumber}
    onChange={(e) => {
      setAadhaarNumber(e.target.value);
      setIsAadhaarVerified(false);
    }}
    placeholder="5421-9876-1234"
    className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-[#0d1820] focus:outline-none focus:border-[#112b54]"
  />
                </div>
                {!isAadhaarVerified && <button
    type="button"
    onClick={handleVerifyAadhaar}
    className="px-3 py-2 rounded-xl bg-[#0d1820] text-white text-xs font-medium hover:bg-[#112b54] transition-colors"
  >
                    Verify UID
                  </button>}
              </div>

              <p className="text-[11px] text-[#7a7f87]">
                UIDAI 12-digit e-KYC creates verified trust across all passengers and drivers.
              </p>
            </div>

            {
    /* 4. Profile Photo */
  }
            <div className="p-4 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs space-y-2.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#112b54] block">
                4. Profile Photo
              </label>

              <div className="flex items-center gap-3">
                <img
    src={avatar}
    alt={name}
    className="w-14 h-14 rounded-full object-cover border-2 border-[#112b54]/20 shadow-xs"
  />
                <div className="flex-1 space-y-1.5">
                  <span className="text-xs text-[#7a7f87] block">Select official avatar:</span>
                  <div className="flex gap-2">
                    {sampleAvatars.map((url, i) => <button
    key={i}
    type="button"
    onClick={() => setAvatar(url)}
    className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all ${avatar === url ? "border-[#112b54] scale-110" : "border-transparent opacity-60 hover:opacity-100"}`}
  >
                        <img src={url} alt="option" className="w-full h-full object-cover" />
                      </button>)}
                  </div>
                </div>
              </div>
            </div>

            {
    /* 5. Driving License (Driver-specific) */
  }
            {selectedRole === "driver" && <div className="p-4 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#112b54] block">
                    5. Driving License (Driver Required)
                  </label>
                  {isDlVerified && <span className="text-[11px] text-[#112b54] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> RTO Verified
                    </span>}
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <CreditCard className="w-4 h-4 text-[#7a7f87] absolute left-3 top-2.5" />
                    <input
    type="text"
    required
    value={dlNumber}
    onChange={(e) => {
      setDlNumber(e.target.value);
      setIsDlVerified(false);
    }}
    placeholder="UP32-2018-0094812"
    className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl pl-9 pr-3 py-2 text-xs font-mono uppercase text-[#0d1820] focus:outline-none focus:border-[#112b54]"
  />
                  </div>
                  {!isDlVerified && <button
    type="button"
    onClick={handleVerifyDl}
    className="px-3 py-2 rounded-xl bg-[#0d1820] text-white text-xs font-medium hover:bg-[#112b54] transition-colors"
  >
                      Verify DL
                    </button>}
                </div>

                <div className="p-2 bg-[#fcf9f2] rounded-xl flex items-center justify-between text-xs">
                  <span className="text-[#7a7f87] text-[11px]">DL Document preview:</span>
                  <span className="text-[10px] font-medium text-[#112b54]">Verified Commercial / LMV</span>
                </div>
              </div>}

            {
    /* Submit / Proceed */
  }
            <button
    id="login-submit-btn"
    type="submit"
    disabled={isSubmitting}
    className="w-full py-3.5 rounded-xl bg-[#0d1820] hover:bg-[#112b54] text-white text-xs font-semibold shadow-sm flex items-center justify-center gap-2 transition-all"
  >
              {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>
                  <span>Save Profile & Continue as {selectedRole === "driver" ? "Car Owner" : "Passenger"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>}
            </button>
          </form>}
      </div>
    </div>;
};
