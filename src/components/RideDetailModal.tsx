import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Car,
  CheckCircle2,
  Share2,
  Phone,
  ShieldAlert,
  CreditCard,
  Lock,
  Sparkles
} from 'lucide-react';
import { CallDriverModal } from './CallDriverModal';
import { ReportUserModal } from './ReportUserModal';

export const RideDetailModal: React.FC = () => {
  const {
    selectedRide,
    setCurrentScreen,
    requestBooking,
    setActiveBooking,
    goBack,
  } = useApp();

  const [seatsToBook, setSeatsToBook] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  if (!selectedRide) {
    return null;
  }

  const basePrice = selectedRide.pricePerSeat * seatsToBook;
  const platformFee = Math.round(basePrice * 0.1);
  const totalAmount = basePrice + platformFee;

  const handleBookNow = async () => {
    setIsBooking(true);
    try {
      const newBooking = await requestBooking(
        selectedRide.id,
        seatsToBook,
        selectedRide.origin,
        selectedRide.destination
      );
      setActiveBooking(newBooking);
      setBookingCompleted(true);
      setTimeout(() => {
        setCurrentScreen('booking_status');
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setIsBooking(false);
    }
  };

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
          Ride Details<span className="text-[#112b54]">.</span>
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsReportOpen(true)}
            title="Report driver"
            className="p-1 rounded-lg text-[#7a7f87] hover:text-[#0d1820]"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `CarPool Ride: ${selectedRide.origin} to ${selectedRide.destination}`,
                  text: `Join ${selectedRide.driver.name} for ₹${selectedRide.pricePerSeat} on ${selectedRide.date}`,
                  url: window.location.href,
                });
              }
            }}
            className="p-1 rounded-lg text-[#7a7f87] hover:text-[#0d1820]"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-4">
        {bookingCompleted ? (
          <div className="p-8 rounded-2xl bg-white border border-[#112b54]/20 text-center space-y-2 animate-in zoom-in-95 shadow-sm">
            <div className="w-12 h-12 bg-[#fcf9f2] text-[#112b54] rounded-full flex items-center justify-center mx-auto border border-[#112b54]/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif italic text-xl text-[#0d1820]">Booking Requested!</h3>
            <p className="text-xs text-[#7a7f87]">
              Driver {selectedRide.driver.name} has been notified.
            </p>
          </div>
        ) : (
          <>
            {/* Route & Timing */}
            <div className="p-4 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#0d1820]">
                  {selectedRide.date} • {selectedRide.departureTime}
                </span>
                <span className="text-[#7a7f87]">
                  {selectedRide.availableSeats} seats remaining
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#fcf9f2] border border-[#112b54]/10 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#7a7f87]" />
                  <span className="font-semibold text-[#0d1820]">{selectedRide.origin}</span>
                </div>
                <div className="w-0.5 h-3 bg-[#112b54]/20 ml-1" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#112b54]" />
                  <span className="font-semibold text-[#0d1820]">{selectedRide.destination}</span>
                </div>
              </div>

              {selectedRide.intermediateStops && selectedRide.intermediateStops.length > 0 && (
                <div className="text-[11px] text-[#7a7f87] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#112b54]" />
                  <span>Via: {selectedRide.intermediateStops.map((s) => s.city).join(', ')}</span>
                </div>
              )}
            </div>

            {/* Driver Profile */}
            <div className="p-4 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedRide.driver.avatar}
                    alt={selectedRide.driver.name}
                    className="w-11 h-11 rounded-full object-cover border border-[#112b54]/20"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-[#0d1820]">{selectedRide.driver.name}</span>
                      {selectedRide.driver.isAadhaarVerified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-[#112b54]" title="Aadhaar Verified" />
                      )}
                    </div>
                    <span className="text-[11px] text-[#7a7f87]">{selectedRide.driver.occupation}</span>
                    <div className="text-[10px] text-[#7a7f87] mt-0.5">
                      ★ {selectedRide.driver.rating} • {selectedRide.driver.totalRatingsCount} ratings
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCallOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#fcf9f2] hover:bg-[#112b54] text-[#0d1820] hover:text-white border border-[#112b54]/15 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call Driver</span>
                </button>
              </div>

              {/* Vehicle Information */}
              <div className="p-3 rounded-xl bg-[#fcf9f2] border border-[#112b54]/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  {selectedRide.car.photoUrl ? (
                    <img
                      src={selectedRide.car.photoUrl}
                      alt={selectedRide.car.model}
                      className="w-12 h-9 rounded-lg object-cover border border-[#112b54]/15"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-white border border-[#112b54]/15 flex items-center justify-center">
                      <Car className="w-4 h-4 text-[#112b54]" />
                    </div>
                  )}
                  <div>
                    <span className="font-semibold text-[#0d1820] block">{selectedRide.car.model}</span>
                    <span className="text-[10px] text-[#7a7f87]">{selectedRide.car.color} • {selectedRide.car.carType || 'Sedan'}</span>
                  </div>
                </div>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-white border border-[#112b54]/15 text-[#0d1820]">
                  {selectedRide.car.plate}
                </span>
              </div>
            </div>

            {/* Seat selection & Fare */}
            <div className="p-4 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#112b54] block">
                Fare Breakdown & Escrow
              </span>

              {/* Seat Selector */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#fcf9f2]">
                <span className="text-xs text-[#0d1820] font-medium">Select Seats</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4]
                    .filter((n) => n <= selectedRide.availableSeats)
                    .map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setSeatsToBook(num)}
                        className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                          seatsToBook === num
                            ? 'bg-[#0d1820] text-white'
                            : 'bg-white text-[#7a7f87] border border-[#112b54]/15'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-[#7a7f87] block">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'upi', label: 'UPI / GPay' },
                    { id: 'card', label: 'Cards' },
                    { id: 'netbanking', label: 'Net Banking' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                        paymentMethod === m.id
                          ? 'bg-[#112b54] text-white border-[#112b54]'
                          : 'bg-[#fcf9f2] border-[#112b54]/15 text-[#0d1820]'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Math */}
              <div className="space-y-1.5 text-xs text-[#7a7f87] pt-1">
                <div className="flex justify-between">
                  <span>Seats ({seatsToBook} × ₹{selectedRide.pricePerSeat})</span>
                  <span className="text-[#0d1820] font-medium">₹{basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>CarPool Service Fee (10%)</span>
                  <span className="text-[#0d1820] font-medium">₹{platformFee}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#0d1820] pt-2 border-t border-[#112b54]/10">
                  <span>Total Payable</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              {/* SafePay Escrow Notice */}
              <div className="p-2.5 rounded-xl bg-[#fcf9f2] border border-[#112b54]/10 flex items-start gap-2 text-[11px] text-[#7a7f87]">
                <Lock className="w-3.5 h-3.5 text-[#112b54] shrink-0 mt-0.5" />
                <span>
                  <strong>SafePay Escrow:</strong> Payment is held safely in escrow and only released to {selectedRide.driver.name} after you arrive at your destination.
                </span>
              </div>
            </div>

            {/* CTA */}
            <button
              id="book-seat-now-btn"
              onClick={handleBookNow}
              disabled={isBooking}
              className="w-full py-3 rounded-xl bg-[#0d1820] hover:bg-[#112b54] active:scale-[0.99] text-white font-medium text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
            >
              {isBooking ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Request {seatsToBook} Seat(s) • ₹{totalAmount}</span>
              )}
            </button>
          </>
        )}
      </div>

      {/* Modals */}
      <CallDriverModal
        isOpen={isCallOpen}
        onClose={() => setIsCallOpen(false)}
        driverName={selectedRide.driver.name}
        driverAvatar={selectedRide.driver.avatar}
        driverPhone={selectedRide.driver.phone}
      />

      <ReportUserModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        reportedUserId={selectedRide.driverId}
        reportedUserName={selectedRide.driver.name}
      />
    </div>
  );
};
