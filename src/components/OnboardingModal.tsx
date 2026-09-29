import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  X,
  Phone,
  Mail,
  User,
  Camera,
  Briefcase,
  Calendar,
  Lock,
  ArrowRight
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile, verifyAadhaar } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Personal Profile, 2: Verification (Aadhaar/Phone/Email), 3: Success
  const [name, setName] = useState(currentUser.name || 'Ammar Khan');
  const [age, setAge] = useState(currentUser.age || 26);
  const [occupation, setOccupation] = useState(currentUser.occupation || 'Software Architect');
  const [phone, setPhone] = useState(currentUser.phone || '+91 98201 44819');
  const [email, setEmail] = useState(currentUser.email || 'ammarkhan101101@gmail.com');
  const [avatar, setAvatar] = useState(currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80');
  const [aadhaarNumber, setAadhaarNumber] = useState('5421-9876-1234');
  const [phoneOtp, setPhoneOtp] = useState('8319');
  const [isPhoneVerified, setIsPhoneVerified] = useState(currentUser.isPhoneVerified ?? true);
  const [isEmailVerified, setIsEmailVerified] = useState(currentUser.isEmailVerified ?? true);
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(currentUser.isAadhaarVerified ?? true);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  ];

  const handleNextToVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleCompleteOnboarding = async () => {
    setIsProcessing(true);
    try {
      await updateUserProfile({
        name,
        age: Number(age),
        occupation,
        phone,
        email,
        avatar,
        isPhoneVerified: true,
        isEmailVerified: true,
        isAadhaarVerified: true,
        aadhaarNumber: aadhaarNumber.replace(/(\d{4})-(\d{4})-(\d{4})/, 'XXXX-XXXX-$3'),
      });
      setIsAadhaarVerified(true);
      setIsPhoneVerified(true);
      setIsEmailVerified(true);
      setStep(3);
      setTimeout(() => {
        onClose();
        setStep(1);
      }, 1600);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d1820]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#112b54]/20 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl relative animate-in zoom-in-95 text-[#0d1820] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#7a7f87] hover:text-[#0d1820] p-1"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step 1: Profile Details */}
        {step === 1 && (
          <form onSubmit={handleNextToVerification} className="space-y-4">
            <div className="text-center space-y-1 pt-1">
              <span className="text-[10px] font-semibold text-[#112b54] uppercase tracking-wider">
                Sign Up Once • Step 1 of 2
              </span>
              <h3 className="font-serif italic text-xl font-medium text-[#0d1820]">
                User Profile<span className="text-[#112b54]">.</span>
              </h3>
              <p className="text-xs text-[#7a7f87]">
                Every member completes one-time identity verification.
              </p>
            </div>

            {/* Profile Avatar Selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-[#7a7f87] block text-center">Profile Photo</label>
              <div className="flex items-center justify-center gap-2">
                {sampleAvatars.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="avatar option"
                    onClick={() => setAvatar(url)}
                    className={`w-11 h-11 rounded-full object-cover cursor-pointer transition-transform ${
                      avatar === url
                        ? 'ring-2 ring-[#112b54] scale-105'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Name & Age */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="text-[11px] text-[#7a7f87] block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-[#7a7f87] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl pl-8 pr-2.5 py-2 text-xs text-[#0d1820] focus:outline-none focus:border-[#112b54]"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-[#7a7f87] block mb-1">Age</label>
                <input
                  type="number"
                  required
                  min={18}
                  max={90}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl px-2.5 py-2 text-xs text-[#0d1820] focus:outline-none focus:border-[#112b54]"
                />
              </div>
            </div>

            {/* Occupation */}
            <div>
              <label className="text-[11px] text-[#7a7f87] block mb-1">Occupation</label>
              <div className="relative">
                <Briefcase className="w-3.5 h-3.5 text-[#7a7f87] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. Software Engineer, Doctor, Student"
                  className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl pl-8 pr-2.5 py-2 text-xs text-[#0d1820] focus:outline-none focus:border-[#112b54]"
                />
              </div>
            </div>

            {/* Phone & Email */}
            <div className="space-y-2">
              <div>
                <label className="text-[11px] text-[#7a7f87] block mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-[#7a7f87] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl pl-8 pr-2.5 py-2 text-xs text-[#0d1820] focus:outline-none focus:border-[#112b54]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#7a7f87] block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-[#7a7f87] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl pl-8 pr-2.5 py-2 text-xs text-[#0d1820] focus:outline-none focus:border-[#112b54]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#0d1820] hover:bg-[#112b54] text-white text-xs font-medium transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Continue to Verification</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Step 2: Verification Checklist */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center space-y-1 pt-1">
              <span className="text-[10px] font-semibold text-[#112b54] uppercase tracking-wider">
                Sign Up Once • Step 2 of 2
              </span>
              <h3 className="font-serif italic text-xl font-medium text-[#0d1820]">
                Verification Hub<span className="text-[#112b54]">.</span>
              </h3>
              <p className="text-xs text-[#7a7f87]">
                UIDAI Aadhaar, Phone OTP, and Email verification.
              </p>
            </div>

            {/* Verification Checklist */}
            <div className="space-y-2.5">
              {/* Aadhaar UIDAI */}
              <div className="p-3 rounded-2xl bg-[#fcf9f2] border border-[#112b54]/15 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#112b54]" />
                    <span className="font-semibold text-[#0d1820]">Aadhaar Verification</span>
                  </div>
                  <span className="text-[10px] text-[#112b54] bg-[#112b54]/10 font-semibold px-2 py-0.5 rounded-full border border-[#112b54]/20">
                    UIDAI Verified
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#7a7f87]">
                  <span>12-digit Aadhaar UID:</span>
                  <span className="font-mono text-[#0d1820]">XXXX-XXXX-1234</span>
                </div>
              </div>

              {/* Phone Verification */}
              <div className="p-3 rounded-2xl bg-[#fcf9f2] border border-[#112b54]/15 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#112b54]" />
                    <span className="font-semibold text-[#0d1820]">Phone Verification</span>
                  </div>
                  <span className="text-[10px] text-[#112b54] bg-[#112b54]/10 font-semibold px-2 py-0.5 rounded-full border border-[#112b54]/20">
                    OTP Verified
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#7a7f87]">
                  <span>Linked Phone:</span>
                  <span className="font-mono text-[#0d1820]">{phone}</span>
                </div>
              </div>

              {/* Email Verification */}
              <div className="p-3 rounded-2xl bg-[#fcf9f2] border border-[#112b54]/15 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#112b54]" />
                    <span className="font-semibold text-[#0d1820]">Email Verification</span>
                  </div>
                  <span className="text-[10px] text-[#112b54] bg-[#112b54]/10 font-semibold px-2 py-0.5 rounded-full border border-[#112b54]/20">
                    Confirmed
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#7a7f87]">
                  <span>Work / Personal Email:</span>
                  <span className="text-[#0d1820] truncate max-w-[160px]">{email}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-2.5 rounded-xl bg-white border border-[#112b54]/20 text-xs font-medium text-[#0d1820] hover:bg-[#fcf9f2]"
              >
                Back to Edit
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleCompleteOnboarding}
                className="py-2.5 rounded-xl bg-[#0d1820] hover:bg-[#112b54] text-white text-xs font-medium transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Confirm & Complete</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center py-6 space-y-2">
            <div className="w-12 h-12 bg-[#112b54]/10 text-[#112b54] rounded-full flex items-center justify-center mx-auto border border-[#112b54]/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif italic text-xl font-medium text-[#0d1820]">
              Verified Member!
            </h3>
            <p className="text-xs text-[#7a7f87]">
              Your account is fully activated with Aadhaar badge, phone verification, and emergency safety routing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
