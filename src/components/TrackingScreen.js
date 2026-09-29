import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  ArrowLeft,
  ShieldCheck,
  Phone,
  MessageSquare,
  ShieldAlert,
  Star
} from "lucide-react";
import { CallDriverModal } from "./CallDriverModal";
import { ReportUserModal } from "./ReportUserModal";
import { ReviewModal } from "./ReviewModal";
export const TrackingScreen = () => {
  const {
    activeBooking,
    selectedRide,
    currentUser,
    triggerSosAlert,
    updateBookingStatus,
    setCurrentScreen,
    goBack
  } = useApp();
  const [progress, setProgress] = useState(45);
  const [speed, setSpeed] = useState(68);
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => prev < 95 ? prev + 1 : 95);
      setSpeed(65 + Math.floor(Math.random() * 8));
    }, 4e3);
    return () => clearInterval(timer);
  }, []);
  if (!activeBooking) {
    return <div className="min-h-screen bg-[#fcf9f2] text-[#0d1820] p-6 text-center">
        <p className="text-xs text-[#7a7f87]">No active trip to track.</p>
        <button
      onClick={() => setCurrentScreen("home")}
      className="mt-3 px-4 py-2 rounded-xl bg-[#0d1820] text-white text-xs"
    >
          Return Home
        </button>
      </div>;
  }
  const isDriver = currentUser.id === activeBooking.driverId;
  const counterpartName = isDriver ? activeBooking.passengerName : activeBooking.driverName;
  const counterpartAvatar = isDriver ? activeBooking.passengerAvatar : activeBooking.driverAvatar;
  const counterpartId = isDriver ? activeBooking.passengerId : activeBooking.driverId;
  const handleCompleteTrip = () => {
    updateBookingStatus(activeBooking.id, "completed");
    setIsReviewOpen(true);
  };
  const handleReviewClose = () => {
    setIsReviewOpen(false);
    setCurrentScreen("history");
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
        <div className="text-center">
          <h2 className="font-serif italic text-lg font-medium text-[#0d1820]">
            Live Journey<span className="text-[#112b54]">.</span>
          </h2>
          <span className="text-[10px] text-[#112b54] font-medium flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#112b54] animate-ping" />
            En Route
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
    onClick={() => setIsReportOpen(true)}
    title="Report concern"
    className="p-1 rounded-lg text-[#7a7f87] hover:text-[#0d1820]"
  >
            <ShieldAlert className="w-4 h-4" />
          </button>
          <button
    onClick={triggerSosAlert}
    className="px-2.5 py-1 rounded-full text-xs font-semibold text-[#0d1820] bg-[#fcf9f2] border border-[#0d1820] hover:bg-[#0d1820] hover:text-white transition-colors"
  >
            SOS
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-4">
        {
    /* Route Progress Visualizer */
  }
        <div className="p-4 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-[#0d1820]">{activeBooking.pickupLocation}</span>
            <span className="font-semibold text-[#0d1820]">{activeBooking.dropoffLocation}</span>
          </div>

          {
    /* Clean Progress Line */
  }
          <div className="relative w-full h-2 bg-[#fcf9f2] rounded-full overflow-hidden border border-[#112b54]/10">
            <div
    className="h-full bg-[#0d1820] rounded-full transition-all duration-700"
    style={{ width: `${progress}%` }}
  />
          </div>

          <div className="flex justify-between text-[11px] text-[#7a7f87]">
            <span>Passed Toll Plaza</span>
            <span>{100 - progress}% remaining</span>
          </div>
        </div>

        {
    /* Telemetry Stats */
  }
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-white border border-[#112b54]/15 text-center shadow-xs">
            <span className="text-[11px] text-[#7a7f87] uppercase tracking-wider block">
              Vehicle Speed
            </span>
            <div className="font-serif italic text-2xl font-bold text-[#0d1820] mt-0.5">
              {speed} <span className="text-xs font-sans font-normal text-[#7a7f87]">km/h</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#112b54]/15 text-center shadow-xs">
            <span className="text-[11px] text-[#7a7f87] uppercase tracking-wider block">
              Estimated ETA
            </span>
            <div className="font-serif italic text-2xl font-bold text-[#0d1820] mt-0.5">
              35 <span className="text-xs font-sans font-normal text-[#7a7f87]">mins</span>
            </div>
          </div>
        </div>

        {
    /* Travel Counterpart Card (Driver or Passenger) */
  }
        <div className="p-3.5 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
    src={counterpartAvatar}
    alt={counterpartName}
    className="w-10 h-10 rounded-full object-cover border border-[#112b54]/20"
  />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-[#0d1820]">{counterpartName}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#112b54]" />
              </div>
              <span className="text-[11px] text-[#7a7f87]">
                {isDriver ? "Passenger aboard" : "Driver en route"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
    onClick={() => setIsCallOpen(true)}
    className="px-2.5 py-1.5 rounded-xl bg-[#fcf9f2] hover:bg-[#112b54] text-[#0d1820] hover:text-white border border-[#112b54]/15 text-xs font-medium flex items-center gap-1 transition-colors"
  >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </button>
            <button
    onClick={() => setCurrentScreen("chat")}
    className="px-2.5 py-1.5 rounded-xl bg-[#fcf9f2] hover:bg-[#112b54] text-[#0d1820] hover:text-white border border-[#112b54]/15 text-xs font-medium flex items-center gap-1 transition-colors"
  >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>
          </div>
        </div>

        {
    /* Complete Journey & Rate */
  }
        <button
    onClick={handleCompleteTrip}
    className="w-full py-3 rounded-xl bg-[#0d1820] hover:bg-[#112b54] text-white text-xs font-medium transition-all shadow-xs flex items-center justify-center gap-1.5"
  >
          <Star className="w-3.5 h-3.5" />
          <span>Arrive & Submit Mutual Rating</span>
        </button>
      </div>

      {
    /* Modals */
  }
      <CallDriverModal
    isOpen={isCallOpen}
    onClose={() => setIsCallOpen(false)}
    driverName={counterpartName}
    driverAvatar={counterpartAvatar}
    driverPhone="+91 98201 44819"
  />

      <ReportUserModal
    isOpen={isReportOpen}
    onClose={() => setIsReportOpen(false)}
    reportedUserId={counterpartId}
    reportedUserName={counterpartName}
  />

      <ReviewModal
    isOpen={isReviewOpen}
    onClose={handleReviewClose}
    rideId={activeBooking.rideId}
    targetUserId={counterpartId}
    targetUserName={counterpartName}
    targetUserAvatar={counterpartAvatar}
    isTargetDriver={!isDriver}
  />
    </div>;
};
