import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Smartphone,
  CreditCard,
  Building
} from 'lucide-react';

export const PaymentScreen: React.FC = () => {
  const {
    activeBooking,
    processPayment,
    setCurrentScreen,
    goBack,
  } = useApp();

  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  if (!activeBooking) {
    return (
      <div className="min-h-screen bg-[#fcf9f2] text-[#0d1820] p-6 text-center">
        <p className="text-xs text-[#7a7f87]">No booking for payment.</p>
        <button
          onClick={() => setCurrentScreen('home')}
          className="mt-3 px-4 py-2 rounded-xl bg-[#0d1820] text-white text-xs"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      await processPayment(activeBooking.id, method);
      setIsPaid(true);
      setTimeout(() => {
        setCurrentScreen('tracking');
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const baseFare = activeBooking.totalAmount - Math.round(activeBooking.totalAmount * 0.1 / 1.1);
  const fee = activeBooking.totalAmount - baseFare;

  return (
    <div className="min-h-screen bg-[#fcf9f2] text-[#0d1820] pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#fcf9f2]/95 backdrop-blur-md px-4 py-3 border-b border-[#112b54]/10 flex items-center justify-between">
        <button
          onClick={goBack}
          className="p-1 rounded-lg text-[#7a7f87] hover:text-[#0d1820]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-serif italic text-lg font-medium text-[#0d1820]">
          SafePay Escrow<span className="text-[#112b54]">.</span>
        </h2>
        <div className="w-6" />
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-4">
        {isPaid ? (
          <div className="p-8 rounded-2xl bg-white border border-[#112b54]/20 text-center space-y-2.5 animate-in zoom-in-95 shadow-sm">
            <div className="w-12 h-12 bg-[#fcf9f2] text-[#112b54] rounded-full flex items-center justify-center mx-auto border border-[#112b54]/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif italic text-xl text-[#0d1820]">Payment Secured!</h3>
            <p className="text-xs text-[#7a7f87]">
              ₹{activeBooking.totalAmount} is held securely in escrow and released to the driver upon trip completion.
            </p>
          </div>
        ) : (
          <>
            {/* Amount Summary */}
            <div className="p-4 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs space-y-3">
              <div className="text-center space-y-1">
                <span className="text-[11px] text-[#7a7f87] uppercase tracking-wider">
                  Total Payable
                </span>
                <div className="font-serif italic text-3xl font-bold text-[#0d1820]">
                  ₹{activeBooking.totalAmount}
                </div>
                <p className="text-[11px] text-[#7a7f87]">
                  {activeBooking.pickupLocation} → {activeBooking.dropoffLocation}
                </p>
              </div>

              {/* Platform Fee Breakdown */}
              <div className="p-2.5 rounded-xl bg-[#fcf9f2] border border-[#112b54]/10 text-xs space-y-1.5">
                <div className="flex justify-between text-[#7a7f87]">
                  <span>Ride Base Fare ({activeBooking.seatsBooked} seat):</span>
                  <span className="font-medium text-[#0d1820]">₹{baseFare}</span>
                </div>
                <div className="flex justify-between text-[#7a7f87]">
                  <span className="flex items-center gap-1">
                    <span>CarPool Platform Fee</span>
                    <span className="text-[9px] px-1 py-0.2 bg-[#112b54]/10 text-[#112b54] rounded">10%</span>
                  </span>
                  <span className="font-medium text-[#0d1820]">₹{fee}</span>
                </div>
                <div className="border-t border-[#112b54]/15 pt-1.5 flex justify-between font-semibold text-[#0d1820]">
                  <span>Total (Secured in Escrow)</span>
                  <span>₹{activeBooking.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Methods */}
            <div className="p-4 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs space-y-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#112b54] block">
                Payment Method
              </span>

              {[
                { id: 'upi', label: 'Instant UPI (Google Pay, PhonePe)', icon: Smartphone },
                { id: 'card', label: 'Credit or Debit Card', icon: CreditCard },
                { id: 'netbanking', label: 'Net Banking', icon: Building },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id as any)}
                    className={`w-full p-2.5 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                      method === m.id
                        ? 'bg-[#112b54] text-white border-[#112b54]'
                        : 'bg-[#fcf9f2] border-[#112b54]/15 text-[#0d1820]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{m.label}</span>
                    </div>
                  </button>
                );
              })}

              {method === 'upi' && (
                <div className="pt-2">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="Enter UPI ID (e.g. mobile@upi)"
                    className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl px-3 py-2 text-xs text-[#0d1820]"
                  />
                </div>
              )}
            </div>

            {/* Escrow Guarantee */}
            <div className="p-3 rounded-xl bg-white border border-[#112b54]/10 flex items-start gap-2.5 text-xs text-[#7a7f87]">
              <Lock className="w-4 h-4 text-[#112b54] shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Escrow Guarantee: Your money stays safe with CarPool and is only paid out to the driver once your trip starts safely.
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-[#0d1820] hover:bg-[#112b54] text-white text-xs font-medium shadow-sm flex items-center justify-center gap-1.5 transition-all"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Pay ₹{activeBooking.totalAmount}</span>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
