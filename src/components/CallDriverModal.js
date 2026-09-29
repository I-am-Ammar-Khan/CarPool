import { useState, useEffect } from "react";
import { PhoneOff, Mic, MicOff, Volume2, ShieldCheck, X } from "lucide-react";
export const CallDriverModal = ({
  isOpen,
  onClose,
  driverName,
  driverAvatar,
  driverPhone
}) => {
  const [callStatus, setCallStatus] = useState("connecting");
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  useEffect(() => {
    if (!isOpen) {
      setCallStatus("connecting");
      setDuration(0);
      return;
    }
    const connectTimer = setTimeout(() => {
      setCallStatus("connected");
    }, 1800);
    return () => clearTimeout(connectTimer);
  }, [isOpen]);
  useEffect(() => {
    let interval;
    if (isOpen && callStatus === "connected") {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1e3);
    }
    return () => clearInterval(interval);
  }, [isOpen, callStatus]);
  if (!isOpen) return null;
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };
  const handleEndCall = () => {
    setCallStatus("ended");
    setTimeout(() => {
      onClose();
    }, 600);
  };
  return <div className="fixed inset-0 z-50 bg-[#0d1820]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#112b54]/20 rounded-3xl p-6 max-w-xs w-full text-center space-y-5 shadow-2xl relative animate-in zoom-in-95 text-[#0d1820]">
        <button
    onClick={onClose}
    className="absolute top-4 right-4 text-[#7a7f87] hover:text-[#0d1820] p-1"
  >
          <X className="w-4 h-4" />
        </button>

        {
    /* Driver Profile */
  }
        <div className="space-y-2 pt-2">
          <div className="relative w-20 h-20 mx-auto">
            <img
    src={driverAvatar}
    alt={driverName}
    className="w-20 h-20 rounded-full object-cover border-2 border-[#112b54]/20"
  />
            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#112b54]" />
            </div>
          </div>

          <div>
            <h3 className="font-serif italic text-xl font-medium text-[#0d1820]">
              {driverName}
            </h3>
            <p className="text-xs text-[#7a7f87] mt-0.5">
              {callStatus === "connecting" && "Connecting encrypted call..."}
              {callStatus === "connected" && formatTime(duration)}
              {callStatus === "ended" && "Call ended"}
            </p>
            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-[#fcf9f2] text-[#112b54] font-mono rounded-full border border-[#112b54]/15">
              Masked Virtual Number: +91 80 4719 3201
            </span>
          </div>
        </div>

        {
    /* Controls */
  }
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
    onClick={() => setIsMuted(!isMuted)}
    className={`w-11 h-11 rounded-full flex items-center justify-center border transition-colors ${isMuted ? "bg-[#0d1820] border-[#0d1820] text-white" : "bg-[#fcf9f2] border-[#112b54]/15 text-[#0d1820]"}`}
    title="Mute microphone"
  >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
    onClick={handleEndCall}
    className="w-14 h-14 rounded-full bg-[#0d1820] hover:bg-[#112b54] text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
    title="End call"
  >
            <PhoneOff className="w-6 h-6" />
          </button>

          <button
    onClick={() => setIsSpeaker(!isSpeaker)}
    className={`w-11 h-11 rounded-full flex items-center justify-center border transition-colors ${isSpeaker ? "bg-[#112b54] text-white border-[#112b54]" : "bg-[#fcf9f2] border-[#112b54]/15 text-[#0d1820]"}`}
    title="Toggle speaker"
  >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[10px] text-[#7a7f87] leading-relaxed">
          Number masking protects personal phone numbers. Both parties stay private and secure.
        </p>
      </div>
    </div>;
};
