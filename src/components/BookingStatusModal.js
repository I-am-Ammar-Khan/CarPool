import { useApp } from "../context/AppContext";
import {
  ArrowLeft,
  MessageSquare,
  CreditCard,
  Navigation,
  ShieldCheck
} from "lucide-react";
export const BookingStatusModal = () => {
  const {
    activeBooking,
    currentUser,
    updateBookingStatus,
    setCurrentScreen,
    goBack
  } = useApp();
  if (!activeBooking) {
    return <div className="min-h-screen bg-[#fcf9f2] text-[#0d1820] p-6 text-center">
        <p className="text-xs text-[#7a7f87]">No active booking selected.</p>
        <button
      onClick={() => setCurrentScreen("home")}
      className="mt-3 px-4 py-2 rounded-xl bg-[#0d1820] text-white text-xs"
    >
          Return Home
        </button>
      </div>;
  }
  const isDriver = currentUser.id === activeBooking.driverId;
  const isPassenger = currentUser.id === activeBooking.passengerId;
  const getStatusBadge = () => {
    switch (activeBooking.status) {
      case "accepted":
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#112b54]/10 text-[#112b54] border border-[#112b54]/25">
            Accepted
          </span>;
      case "pending":
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fcf9f2] text-[#7a7f87] border border-[#7a7f87]/40">
            Awaiting Confirmation
          </span>;
      case "rejected":
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0d1820] text-white border border-[#0d1820]">
            Declined
          </span>;
      case "completed":
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#112b54] text-white border border-[#112b54]">
            Completed
          </span>;
      case "cancelled":
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fcf9f2] text-[#7a7f87] border border-[#7a7f87]/30">
            Cancelled
          </span>;
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
          Booking Status<span className="text-[#112b54]">.</span>
        </h2>
        <div className="w-6" />
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-4">
        {
    /* 4-Step Booking Process Stepper matching prompt */
  }
        <div className="p-4 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs space-y-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#112b54] block">
            4-Step Booking & Verification Flow
          </span>

          <div className="grid grid-cols-4 gap-1 text-center">
            {
    /* Step 1 */
  }
            <div className="space-y-1">
              <div className="w-6 h-6 mx-auto rounded-full bg-[#112b54] text-white flex items-center justify-center text-[10px] font-bold border border-[#112b54]">
                ✓
              </div>
              <div className="text-[10px] font-semibold text-[#0d1820]">1. Request</div>
              <p className="text-[9px] text-[#7a7f87]">Seat booked</p>
            </div>

            {
    /* Step 2 */
  }
            <div className="space-y-1">
              <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-[10px] font-bold ${["accepted", "completed"].includes(activeBooking.status) ? "bg-[#112b54] text-white border border-[#112b54]" : activeBooking.status === "pending" ? "bg-[#fcf9f2] text-[#112b54] border border-[#112b54] animate-pulse" : "bg-[#fcf9f2] text-[#7a7f87] border border-[#7a7f87]/30"}`}>
                {["accepted", "completed"].includes(activeBooking.status) ? "\u2713" : "2"}
              </div>
              <div className="text-[10px] font-semibold text-[#0d1820]">2. Accept</div>
              <p className="text-[9px] text-[#7a7f87]">
                {["accepted", "completed"].includes(activeBooking.status) ? "Driver accepted" : "Awaiting driver"}
              </p>
            </div>

            {
    /* Step 3 */
  }
            <div className="space-y-1">
              <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-[10px] font-bold ${activeBooking.status === "completed" ? "bg-[#112b54] text-white border border-[#112b54]" : activeBooking.status === "accepted" ? "bg-[#112b54] text-white" : "bg-[#fcf9f2] text-[#7a7f87] border border-[#7a7f87]/30"}`}>
                {activeBooking.status === "completed" ? "\u2713" : "3"}
              </div>
              <div className="text-[10px] font-semibold text-[#0d1820]">3. Escrow</div>
              <p className="text-[9px] text-[#7a7f87]">Platform fee</p>
            </div>

            {
    /* Step 4 */
  }
            <div className="space-y-1">
              <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-[10px] font-bold ${activeBooking.status === "completed" ? "bg-[#112b54] text-white border border-[#112b54]" : "bg-[#fcf9f2] text-[#7a7f87] border border-[#7a7f87]/30"}`}>
                {activeBooking.status === "completed" ? "\u2713" : "4"}
              </div>
              <div className="text-[10px] font-semibold text-[#0d1820]">4. Confirm</div>
              <p className="text-[9px] text-[#7a7f87]">Trip ready</p>
            </div>
          </div>
        </div>

        {
    /* Status Card */
  }
        <div className="p-4 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs text-center space-y-2">
          <div>{getStatusBadge()}</div>
          <div className="font-serif italic text-xl text-[#0d1820] font-medium pt-1">
            {activeBooking.pickupLocation} → {activeBooking.dropoffLocation}
          </div>
          <p className="text-xs text-[#7a7f87]">
            {activeBooking.seatsBooked} Seat(s) • Total ₹{activeBooking.totalAmount} (incl. 10% platform fee)
          </p>
        </div>

        {
    /* Counterpart Card */
  }
        <div className="p-4 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7a7f87] block mb-2">
            {isDriver ? "Passenger Details" : "Driver Details"}
          </span>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
    src={isDriver ? activeBooking.passengerAvatar : activeBooking.driverAvatar}
    alt="profile"
    className="w-10 h-10 rounded-full object-cover border border-[#112b54]/20"
  />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-[#0d1820]">
                    {isDriver ? activeBooking.passengerName : activeBooking.driverName}
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#112b54]" />
                </div>
                <span className="text-[11px] text-[#7a7f87]">
                  {activeBooking.driverPhone}
                </span>
              </div>
            </div>

            <button
    onClick={() => setCurrentScreen("chat")}
    className="p-2 rounded-xl bg-[#fcf9f2] border border-[#112b54]/15 text-[#112b54] hover:bg-[#112b54] hover:text-white transition-colors"
  >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>

        {
    /* Actions when Pending */
  }
        {activeBooking.status === "pending" && <div className="space-y-2">
            {isDriver ? <div className="grid grid-cols-2 gap-2.5">
                <button
    onClick={() => updateBookingStatus(activeBooking.id, "accepted")}
    className="py-2.5 rounded-xl bg-[#0d1820] hover:bg-[#112b54] text-white text-xs font-medium transition-all"
  >
                  Accept Booking
                </button>
                <button
    onClick={() => updateBookingStatus(activeBooking.id, "rejected")}
    className="py-2.5 rounded-xl bg-white border border-[#0d1820]/30 text-[#0d1820] hover:bg-[#fcf9f2] text-xs font-medium transition-all"
  >
                  Decline
                </button>
              </div> : <div className="p-3 bg-[#fcf9f2] rounded-xl border border-[#112b54]/15 flex items-center justify-between">
                <span className="text-xs text-[#7a7f87]">Waiting for driver acceptance...</span>
                <button
    onClick={() => updateBookingStatus(activeBooking.id, "accepted")}
    className="px-3 py-1.5 rounded-lg bg-[#112b54] text-white text-xs font-medium hover:bg-[#0d1820] transition-colors"
  >
                  Simulate Driver Accept
                </button>
              </div>}
          </div>}

        {
    /* Actions for Passenger */
  }
        {isPassenger && activeBooking.status === "accepted" && <div className="space-y-2.5">
            <button
    onClick={() => setCurrentScreen("payment")}
    className="w-full py-3 rounded-xl bg-[#0d1820] hover:bg-[#112b54] text-white text-xs font-medium flex items-center justify-center gap-2 shadow-xs transition-all"
  >
              <CreditCard className="w-4 h-4" />
              <span>Complete Payment (₹{activeBooking.totalAmount})</span>
            </button>

            <button
    onClick={() => setCurrentScreen("tracking")}
    className="w-full py-2.5 rounded-xl bg-white border border-[#112b54]/20 text-[#0d1820] hover:bg-[#fcf9f2] text-xs font-medium flex items-center justify-center gap-2 transition-all"
  >
              <Navigation className="w-4 h-4 text-[#112b54]" />
              <span>Live Highway Tracking</span>
            </button>
          </div>}

        {
    /* Cancel Button */
  }
        {["pending", "accepted"].includes(activeBooking.status) && <button
    onClick={() => updateBookingStatus(activeBooking.id, "cancelled")}
    className="w-full py-2 rounded-xl text-xs text-[#7a7f87] hover:text-[#0d1820] transition-colors"
  >
            Cancel this booking
          </button>}
      </div>
    </div>;
};
