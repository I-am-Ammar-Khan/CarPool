import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  X,
  Lock,
  ArrowRight,
  Smartphone
} from 'lucide-react';

interface AadhaarVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AadhaarVerificationModal: React.FC<AadhaarVerificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { verifyAadhaar } = useApp();

  const [step, setStep] = useState<'aadhaar' | 'otp' | 'success'>('aadhaar');
  const [aadhaarNumber, setAadhaarNumber] = useState('5421-9876-1234');
  const [otp, setOtp] = useState('4912');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 600);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(async () => {
      await verifyAadhaar(aadhaarNumber);
      setIsLoading(false);
      setStep('success');
      setTimeout(() => {
        onClose();
        setStep('aadhaar');
      }, 1500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d1820]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#112b54]/20 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl relative animate-in zoom-in-95 text-[#0d1820]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#7a7f87] hover:text-[#0d1820] p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'aadhaar' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-[#fcf9f2] border border-[#112b54]/20 text-[#112b54] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif italic text-lg font-medium text-[#0d1820]">
                Aadhaar Authentication<span className="text-[#112b54]">.</span>
              </h3>
              <p className="text-xs text-[#7a7f87]">
                Mandatory one-time verification to protect passengers and car owners.
              </p>
            </div>

            <div>
              <label className="text-[11px] text-[#7a7f87] block mb-1">
                12-digit Aadhaar Number
              </label>
              <input
                type="text"
                required
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value)}
                placeholder="5421-9876-1234"
                className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl px-3 py-2 text-xs font-mono tracking-wider text-[#0d1820] focus:outline-none focus:border-[#112b54]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-[#0d1820] hover:bg-[#112b54] text-white text-xs font-medium transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Request OTP via UIDAI</span>
              )}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-[#fcf9f2] border border-[#112b54]/20 text-[#112b54] flex items-center justify-center mx-auto">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="font-serif italic text-lg font-medium text-[#0d1820]">
                Enter 4-digit OTP<span className="text-[#112b54]">.</span>
              </h3>
              <p className="text-xs text-[#7a7f87]">
                Sent to your Aadhaar-linked mobile number.
              </p>
            </div>

            <input
              type="text"
              required
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-32 mx-auto block text-center bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl py-2 text-lg font-mono font-bold tracking-widest text-[#0d1820] focus:outline-none focus:border-[#112b54]"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-[#0d1820] hover:bg-[#112b54] text-white text-xs font-medium transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Verify & Complete KYC</span>
              )}
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center py-4 space-y-2 animate-in zoom-in-95">
            <div className="w-12 h-12 bg-[#112b54]/10 text-[#112b54] rounded-full flex items-center justify-center mx-auto border border-[#112b54]/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif italic text-lg font-medium text-[#0d1820]">
              Identity Verified!
            </h3>
            <p className="text-xs text-[#7a7f87]">
              Your Aadhaar badge is now live on your profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
