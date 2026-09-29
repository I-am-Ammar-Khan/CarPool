import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Clock,
  Star,
  CheckCircle2
} from "lucide-react";
import { ReviewModal } from "./ReviewModal";
export const HistoryScreen = () => {
  const { bookings, currentUser, rides, setSelectedRide, setCurrentScreen } = useApp();
  const [filter, setFilter] = useState("all");
  const [reviewBooking, setReviewBooking] = useState(null);
  const myTrips = bookings.filter((b) => {
    const isMe = b.passengerId === currentUser.id || b.driverId === currentUser.id;
    if (!isMe) return false;
    if (filter === "completed") return b.status === "completed";
    return true;
  });
  const totalSpent = bookings.filter((b) => b.passengerId === currentUser.id && b.status === "completed").reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalEarned = bookings.filter((b) => b.driverId === currentUser.id && b.status === "completed").reduce((acc, curr) => acc + (curr.totalAmount - Math.round(curr.totalAmount * 0.1)), 0);
  return <div className="min-h-screen bg-[#fcf9f2] text-[#0d1820] pb-28">
      {
    /* Header */
  }
      <div className="sticky top-0 z-30 bg-[#fcf9f2]/95 backdrop-blur-md px-4 py-3 border-b border-[#112b54]/10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h2 className="font-serif italic text-lg font-medium text-[#0d1820]">
            Activity & Trips<span className="text-[#112b54]">.</span>
          </h2>
          <div className="flex gap-1 bg-white p-1 rounded-xl border border-[#112b54]/15 text-xs">
            <button
    onClick={() => setFilter("all")}
    className={`px-2.5 py-0.5 rounded-lg font-medium transition-colors ${filter === "all" ? "bg-[#0d1820] text-white" : "text-[#7a7f87]"}`}
  >
              All
            </button>
            <button
    onClick={() => setFilter("completed")}
    className={`px-2.5 py-0.5 rounded-lg font-medium transition-colors ${filter === "completed" ? "bg-[#0d1820] text-white" : "text-[#7a7f87]"}`}
  >
              Completed
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-4">
        {
    /* Minimal Financial Summary */
  }
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs">
            <span className="text-[10px] text-[#7a7f87] uppercase tracking-wider block">
              Passenger Spent
            </span>
            <div className="font-serif italic text-2xl font-bold text-[#0d1820] mt-0.5">
              ₹{totalSpent}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs">
            <span className="text-[10px] text-[#7a7f87] uppercase tracking-wider block">
              Driver Earned
            </span>
            <div className="font-serif italic text-2xl font-bold text-[#0d1820] mt-0.5">
              ₹{totalEarned}
            </div>
          </div>
        </div>

        {
    /* Trips List */
  }
        {myTrips.length === 0 ? <div className="p-8 rounded-2xl bg-white border border-[#112b54]/15 text-center space-y-2 mt-4">
            <Clock className="w-8 h-8 text-[#7a7f87] mx-auto stroke-1" />
            <h3 className="font-serif italic text-base text-[#0d1820]">No trips recorded</h3>
            <p className="text-xs text-[#7a7f87]">
              Book a ride or offer empty seats to start your journey log.
            </p>
          </div> : <div className="space-y-2.5">
            {myTrips.map((b) => {
    const isDriver = currentUser.id === b.driverId;
    const counterpartName = isDriver ? b.passengerName : b.driverName;
    return <div
      key={b.id}
      className="p-3.5 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs space-y-2.5"
    >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#0d1820]">
                      {b.pickupLocation} → {b.dropoffLocation}
                    </span>
                    <span className="text-xs font-bold text-[#0d1820]">
                      ₹{b.totalAmount}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-[#7a7f87]">
                    <span>
                      {isDriver ? "Driving" : "Riding"} • with {counterpartName}
                    </span>
                    <span className="capitalize px-2 py-0.5 rounded-md bg-[#fcf9f2] text-[#112b54] font-medium border border-[#112b54]/10">
                      {b.status}
                    </span>
                  </div>

                  {b.status === "completed" && <div className="pt-2 border-t border-[#112b54]/10 flex justify-between items-center">
                      <span className="text-[10px] text-[#112b54] font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> SafePay Escrow Disbursed
                      </span>
                      <button
      onClick={() => setReviewBooking(b)}
      className="px-2.5 py-1 rounded-lg bg-[#0d1820] text-white text-[11px] font-medium hover:bg-[#112b54] flex items-center gap-1"
    >
                        <Star className="w-3 h-3" />
                        <span>Rate {counterpartName}</span>
                      </button>
                    </div>}
                </div>;
  })}
          </div>}
      </div>

      {reviewBooking && <ReviewModal
    isOpen={true}
    onClose={() => setReviewBooking(null)}
    rideId={reviewBooking.rideId}
    targetUserId={currentUser.id === reviewBooking.driverId ? reviewBooking.passengerId : reviewBooking.driverId}
    targetUserName={currentUser.id === reviewBooking.driverId ? reviewBooking.passengerName : reviewBooking.driverName}
    targetUserAvatar={currentUser.id === reviewBooking.driverId ? reviewBooking.passengerAvatar : reviewBooking.driverAvatar}
    isTargetDriver={currentUser.id !== reviewBooking.driverId}
  />}
    </div>;
};
