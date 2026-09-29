import { useState } from "react";
import { useApp } from "../context/AppContext";
import { ShieldAlert, CheckCircle2, X, Ban } from "lucide-react";
export const ReportUserModal = ({
  isOpen,
  onClose,
  reportedUserId,
  reportedUserName
}) => {
  const { submitReport, suspendUser } = useApp();
  const [reason, setReason] = useState("Unsafe Driving Behavior");
  const [details, setDetails] = useState("");
  const [alsoBlock, setAlsoBlock] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  if (!isOpen) return null;
  const reasons = [
    "Unsafe Driving Behavior",
    "Inappropriate Conduct / Harassment",
    "Late Arrival or No-Show",
    "Off-Platform Payment Request",
    "Vehicle Discrepancy"
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitReport(reportedUserId, reportedUserName, reason, details || reason);
      if (alsoBlock) {
        suspendUser(reportedUserId);
      }
      setIsDone(true);
      setTimeout(() => {
        setIsDone(false);
        onClose();
      }, 1400);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="fixed inset-0 z-50 bg-[#0d1820]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#112b54]/20 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl relative animate-in zoom-in-95 text-[#0d1820]">
        <button
    onClick={onClose}
    className="absolute top-4 right-4 text-[#7a7f87] hover:text-[#0d1820] p-1"
  >
          <X className="w-4 h-4" />
        </button>

        {isDone ? <div className="text-center py-6 space-y-2">
            <div className="w-12 h-12 bg-[#0d1820]/10 text-[#0d1820] rounded-full flex items-center justify-center mx-auto border border-[#0d1820]/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif italic text-lg font-medium text-[#0d1820]">
              Report Filed with Trust & Safety
            </h3>
            <p className="text-xs text-[#7a7f87]">
              {alsoBlock ? `${reportedUserName} is blocked from contacting you.` : "Our moderation team is reviewing this incident."}
            </p>
          </div> : <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-[#0d1820]/10 text-[#0d1820] flex items-center justify-center mx-auto border border-[#0d1820]/20">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-serif italic text-lg font-medium text-[#0d1820]">
                Report User<span className="text-[#112b54]">.</span>
              </h3>
              <p className="text-xs text-[#7a7f87]">
                Your safety is paramount. Incident reports are audited by CarPool Trust & Safety.
              </p>
            </div>

            <div>
              <label className="text-[11px] text-[#7a7f87] block mb-1">Reason for report</label>
              <select
    value={reason}
    onChange={(e) => setReason(e.target.value)}
    className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl px-3 py-2 text-xs text-[#0d1820] focus:outline-none focus:border-[#112b54]"
  >
                {reasons.map((r) => <option key={r} value={r}>
                    {r}
                  </option>)}
              </select>
            </div>

            <div>
              <label className="text-[11px] text-[#7a7f87] block mb-1">Incident details</label>
              <textarea
    rows={3}
    required
    value={details}
    onChange={(e) => setDetails(e.target.value)}
    placeholder="Describe what occurred during the trip..."
    className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl p-2.5 text-xs text-[#0d1820] focus:outline-none focus:border-[#112b54]"
  />
            </div>

            {
    /* Block User Checkbox */
  }
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#fcf9f2] border border-[#112b54]/10 text-xs text-[#0d1820] cursor-pointer">
              <input
    type="checkbox"
    checked={alsoBlock}
    onChange={(e) => setAlsoBlock(e.target.checked)}
    className="w-4 h-4 rounded text-[#112b54] focus:ring-0"
  />
              <div className="flex items-center gap-1.5">
                <Ban className="w-3.5 h-3.5 text-[#0d1820]" />
                <span>Block {reportedUserName} from future trips and chat</span>
              </div>
            </label>

            <button
    type="submit"
    disabled={isSubmitting}
    className="w-full py-2.5 rounded-xl bg-[#0d1820] hover:bg-[#112b54] text-white text-xs font-medium transition-all shadow-xs flex items-center justify-center gap-1.5"
  >
              {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span>Submit Report to Trust & Safety</span>}
            </button>
          </form>}
      </div>
    </div>;
};
