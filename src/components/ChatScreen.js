import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  ArrowLeft,
  Send,
  Phone,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";
import { CallDriverModal } from "./CallDriverModal";
import { ReportUserModal } from "./ReportUserModal";
export const ChatScreen = () => {
  const {
    activeBooking,
    currentUser,
    messages,
    sendMessage,
    triggerSosAlert,
    setCurrentScreen,
    goBack
  } = useApp();
  const [inputVal, setInputVal] = useState("");
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  if (!activeBooking) {
    return <div className="min-h-screen bg-[#fcf9f2] text-[#0d1820] p-6 text-center">
        <p className="text-xs text-[#7a7f87]">No active trip chat selected.</p>
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
  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendMessage(inputVal.trim());
    setInputVal("");
  };
  const quickReplies = [
    "I have arrived at the pickup spot.",
    "Running 5 minutes late.",
    "Waiting near the main entrance.",
    "Car hazard lights are on."
  ];
  return <div className="min-h-screen bg-[#fcf9f2] text-[#0d1820] flex flex-col justify-between pb-20">
      {
    /* Sticky Minimal Header */
  }
      <div className="sticky top-0 z-30 bg-[#fcf9f2]/95 backdrop-blur-md px-4 py-3 border-b border-[#112b54]/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
    onClick={goBack}
    className="p-1 rounded-lg text-[#7a7f87] hover:text-[#0d1820]"
  >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <img
    src={counterpartAvatar}
    alt={counterpartName}
    className="w-8 h-8 rounded-full object-cover border border-[#112b54]/20"
  />
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-[#0d1820]">{counterpartName}</span>
              <ShieldCheck className="w-3 h-3 text-[#112b54]" />
            </div>
            <span className="text-[10px] text-[#7a7f87]">Aadhaar Verified</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
    onClick={() => setIsCallOpen(true)}
    className="p-1.5 rounded-lg text-[#0d1820] bg-white border border-[#112b54]/15 hover:bg-[#112b54] hover:text-white transition-colors"
    title="Encrypted voice call"
  >
            <Phone className="w-3.5 h-3.5" />
          </button>
          <button
    onClick={() => setIsReportOpen(true)}
    className="p-1.5 rounded-lg text-[#7a7f87] hover:text-[#0d1820] transition-colors"
    title="Report user"
  >
            <ShieldAlert className="w-3.5 h-3.5" />
          </button>
          <button
    onClick={triggerSosAlert}
    className="px-2 py-1 rounded-full text-[10px] font-semibold text-[#0d1820] bg-[#fcf9f2] border border-[#0d1820] hover:bg-[#0d1820] hover:text-white transition-colors"
  >
            SOS
          </button>
        </div>
      </div>

      {
    /* Messages */
  }
      <div className="flex-1 p-4 space-y-3 overflow-y-auto max-w-md mx-auto w-full">
        {messages.map((msg) => {
    const isMe = msg.senderId === currentUser.id;
    return <div
      key={msg.id}
      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
    >
              <div
      className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs shadow-xs leading-relaxed ${isMe ? "bg-[#0d1820] text-white rounded-br-xs" : "bg-white border border-[#112b54]/15 text-[#0d1820] rounded-bl-xs"}`}
    >
                {msg.text}
              </div>
              <span className="text-[9px] text-[#7a7f87] mt-0.5 px-1">{msg.timestamp}</span>
            </div>;
  })}
      </div>

      {
    /* Quick Replies & Input */
  }
      <div className="sticky bottom-14 bg-[#fcf9f2] border-t border-[#112b54]/10 p-3 max-w-md mx-auto w-full space-y-2">
        {
    /* Quick replies pills */
  }
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
          {quickReplies.map((reply, i) => <button
    key={i}
    onClick={() => sendMessage(reply)}
    className="px-2.5 py-1 rounded-full bg-white border border-[#112b54]/15 text-[#7a7f87] hover:text-[#0d1820] whitespace-nowrap"
  >
              {reply}
            </button>)}
        </div>

        {
    /* Form */
  }
        <form onSubmit={handleSend} className="flex gap-2">
          <input
    type="text"
    placeholder="Type message..."
    value={inputVal}
    onChange={(e) => setInputVal(e.target.value)}
    className="flex-1 bg-white border border-[#112b54]/15 rounded-xl px-3 py-2 text-xs text-[#0d1820] focus:outline-none focus:border-[#112b54]"
  />
          <button
    type="submit"
    className="w-9 h-9 rounded-xl bg-[#0d1820] text-white flex items-center justify-center hover:bg-[#112b54] transition-colors"
  >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
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
    </div>;
};
