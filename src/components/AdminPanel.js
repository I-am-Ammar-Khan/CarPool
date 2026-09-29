import { useApp } from "../context/AppContext";
import {
  ArrowLeft
} from "lucide-react";
export const AdminPanel = () => {
  const {
    currentUser,
    rides,
    bookings,
    adminKycApprovals,
    handleAdminKycAction,
    setCurrentScreen,
    goBack
  } = useApp();
  const totalEscrow = bookings.reduce((acc, b) => acc + b.totalAmount, 0);
  const platformRevenue = Math.round(totalEscrow * 0.1);
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
            Platform Governance<span className="text-[#112b54]">.</span>
          </h2>
          <span className="text-[10px] text-[#7a7f87]">
            Admin: {currentUser.email}
          </span>
        </div>
        <div className="w-6" />
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-4">
        {
    /* Core Metrics */
  }
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs">
            <span className="text-[10px] text-[#7a7f87] uppercase tracking-wider block">
              Active Rides
            </span>
            <div className="font-serif italic text-2xl font-bold text-[#0d1820] mt-0.5">
              {rides.length}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs">
            <span className="text-[10px] text-[#7a7f87] uppercase tracking-wider block">
              10% Revenue
            </span>
            <div className="font-serif italic text-2xl font-bold text-[#0d1820] mt-0.5">
              ₹{platformRevenue}
            </div>
          </div>
        </div>

        {
    /* KYC Verification Queue */
  }
        <div className="p-4 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-[#112b54]/10">
            <span className="text-xs font-semibold text-[#0d1820]">
              Pending Aadhaar Approvals
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#fcf9f2] text-[#112b54] font-semibold border border-[#112b54]/15">
              {adminKycApprovals.length} pending
            </span>
          </div>

          {adminKycApprovals.length === 0 ? <div className="text-center py-6 text-xs text-[#7a7f87]">
              All submitted user identities are verified.
            </div> : <div className="space-y-3">
              {adminKycApprovals.map((req) => <div
    key={req.id}
    className="p-3 rounded-xl bg-[#fcf9f2] border border-[#112b54]/10 space-y-2 text-xs"
  >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#0d1820]">{req.userName}</span>
                    <span className="font-mono text-[11px] text-[#7a7f87]">
                      UID: {req.aadhaarNumberMasked}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#7a7f87]">
                    Phone: {req.phone} • Submitted: {req.submittedAt}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
    onClick={() => handleAdminKycAction(req.id, true)}
    className="py-1.5 rounded-lg bg-[#0d1820] text-white text-xs font-medium hover:bg-[#112b54] transition-colors"
  >
                      Approve KYC
                    </button>
                    <button
    onClick={() => handleAdminKycAction(req.id, false)}
    className="py-1.5 rounded-lg bg-white border border-[#0d1820]/30 text-[#0d1820] text-xs font-medium hover:bg-[#fcf9f2] transition-colors"
  >
                      Reject
                    </button>
                  </div>
                </div>)}
            </div>}
        </div>
      </div>
    </div>;
};
