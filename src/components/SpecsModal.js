import { useState } from "react";
import {
  X,
  Smartphone,
  Globe,
  Database,
  Terminal,
  Activity,
  Copy,
  Sparkles
} from "lucide-react";
export const SpecsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("design");
  const [copiedSection, setCopiedSection] = useState(null);
  if (!isOpen) return null;
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 1500);
  };
  return <div className="fixed inset-0 z-50 bg-[#0d1820]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-[#112b54]/20 rounded-3xl p-5 sm:p-6 max-w-2xl w-full max-h-[90vh] flex flex-col justify-between shadow-2xl relative animate-in zoom-in-95 text-[#0d1820]">
        {
    /* Header */
  }
        <div className="flex items-center justify-between pb-3 border-b border-[#112b54]/10">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif italic text-xl font-medium text-[#0d1820]">
                CarPool Production System Design<span className="text-[#112b54]">.</span>
              </h3>
              <span className="text-[10px] bg-[#fcf9f2] text-[#112b54] font-semibold px-2 py-0.5 rounded-full border border-[#112b54]/15">
                v2.4 Spec
              </span>
            </div>
            <span className="text-xs text-[#7a7f87]">
              Presented by Ammar Khan • Complete Architecture for Android, iOS & Web
            </span>
          </div>
          <button
    onClick={onClose}
    className="p-1.5 rounded-xl text-[#7a7f87] hover:text-[#0d1820] hover:bg-[#fcf9f2]"
  >
            <X className="w-5 h-5" />
          </button>
        </div>

        {
    /* Navigation Tabs */
  }
        <div className="flex items-center gap-1.5 py-3 overflow-x-auto border-b border-[#112b54]/10 no-scrollbar">
          {[
    { id: "design", label: "Design System & UI", icon: Sparkles },
    { id: "flows", label: "User Flows & Logic", icon: Activity },
    { id: "database", label: "Database Schema", icon: Database },
    { id: "api", label: "API Architecture", icon: Terminal },
    { id: "mobile", label: "Mobile (Android/iOS)", icon: Smartphone },
    { id: "web", label: "Web & Production", icon: Globe }
  ].map((tab) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    return <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors border ${isActive ? "bg-[#112b54] text-white border-[#112b54]" : "bg-[#fcf9f2] border-[#112b54]/10 text-[#7a7f87] hover:text-[#0d1820]"}`}
    >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>;
  })}
        </div>

        {
    /* Tab Content */
  }
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs text-[#7a7f87] pr-1">
          {
    /* TAB 1: DESIGN SYSTEM */
  }
          {activeTab === "design" && <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#fcf9f2] border border-[#112b54]/15 space-y-2">
                <span className="text-[10px] font-semibold text-[#112b54] uppercase tracking-wider block">
                  Aesthetic Philosophy: Airbnb × Apple × BlaBlaCar
                </span>
                <p className="text-xs text-[#0d1820] leading-relaxed">
                  Engineered with large typography, generous whitespace, razor-thin borders, and zero visual clutter. Strictly prohibits gradients, arbitrary glassmorphism, or noisy cards.
                </p>
              </div>

              {
    /* Exact Colors */
  }
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#0d1820] block">Color Token Architecture</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <div className="p-2.5 rounded-xl border border-[#112b54]/15 bg-white space-y-1">
                    <div className="w-full h-8 rounded-lg bg-[#112b54]" />
                    <span className="text-[11px] font-semibold text-[#0d1820] block">Primary</span>
                    <span className="text-[10px] font-mono text-[#7a7f87]">#112b54</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-[#112b54]/15 bg-white space-y-1">
                    <div className="w-full h-8 rounded-lg bg-[#0d1820]" />
                    <span className="text-[11px] font-semibold text-[#0d1820] block">Supporting</span>
                    <span className="text-[10px] font-mono text-[#7a7f87]">#0d1820</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-[#112b54]/15 bg-white space-y-1">
                    <div className="w-full h-8 rounded-lg bg-[#fcf9f2] border border-black/10" />
                    <span className="text-[11px] font-semibold text-[#0d1820] block">Background</span>
                    <span className="text-[10px] font-mono text-[#7a7f87]">#fcf9f2</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-[#112b54]/15 bg-white space-y-1">
                    <div className="w-full h-8 rounded-lg bg-[#0d1820]" />
                    <span className="text-[11px] font-semibold text-[#0d1820] block">Text</span>
                    <span className="text-[10px] font-mono text-[#7a7f87]">#0d1820</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-[#112b54]/15 bg-white space-y-1">
                    <div className="w-full h-8 rounded-lg bg-[#7a7f87]" />
                    <span className="text-[11px] font-semibold text-[#0d1820] block">Neutral</span>
                    <span className="text-[10px] font-mono text-[#7a7f87]">#7a7f87</span>
                  </div>
                </div>
              </div>

              {
    /* Typography */
  }
              <div className="p-3.5 rounded-2xl bg-white border border-[#112b54]/15 space-y-2">
                <span className="text-xs font-semibold text-[#0d1820] block">Typography Hierarchy</span>
                <div className="space-y-2">
                  <div className="p-2 rounded-xl bg-[#fcf9f2] flex items-baseline justify-between">
                    <span className="font-serif italic text-lg text-[#0d1820]">Playfair Display Italic</span>
                    <span className="text-[10px] text-[#7a7f87]">Headings, Wordmarks, Screen Titles</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#fcf9f2] flex items-baseline justify-between">
                    <span className="font-sans font-medium text-xs text-[#0d1820]">Inter Sans</span>
                    <span className="text-[10px] text-[#7a7f87]">Body text, Labels, Controls, Inputs, Badges</span>
                  </div>
                </div>
              </div>
            </div>}

          {
    /* TAB 2: USER FLOWS */
  }
          {activeTab === "flows" && <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-white border border-[#112b54]/15 space-y-2">
                <span className="text-xs font-semibold text-[#0d1820] block">
                  1. Onboarding & Verification Flow ("Sign Up Once")
                </span>
                <div className="space-y-1.5 text-[11px] text-[#0d1820]">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#fcf9f2] text-[#112b54] flex items-center justify-center font-bold text-[10px]">1</span>
                    <span>User inputs Name, Age, Occupation, and selects Profile Photo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#fcf9f2] text-[#112b54] flex items-center justify-center font-bold text-[10px]">2</span>
                    <span>UIDAI Aadhaar 12-digit input triggers UIDAI OTP endpoint</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#fcf9f2] text-[#112b54] flex items-center justify-center font-bold text-[10px]">3</span>
                    <span>SMS Phone OTP & Email verification completed; profile receives permanent verified badge</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#112b54]/15 space-y-2">
                <span className="text-xs font-semibold text-[#0d1820] block">
                  2. Driver Journey (Offer a Ride)
                </span>
                <p className="text-[11px] leading-relaxed">
                  Driver provides Origin, Destination, Date, Time, Available Seats, Price Per Seat, and Vehicle details (Model, Plate, Photo). Published ride instantly becomes queryable in the active ride pool.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#112b54]/15 space-y-2">
                <span className="text-xs font-semibold text-[#0d1820] block">
                  3. Passenger Journey (Search → SafePay Escrow → Journey)
                </span>
                <p className="text-[11px] leading-relaxed">
                  Passenger queries corridor and seats. Matching active rides display driver rating and verified credentials. Passenger submits booking request; driver accepts; passenger pays via UPI/Card; payment sits in SafePay Escrow until trip completes.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#112b54]/15 space-y-2">
                <span className="text-xs font-semibold text-[#0d1820] block">
                  4. Post-Journey Trust & Ratings
                </span>
                <p className="text-[11px] leading-relaxed">
                  Upon trip termination, both passenger and driver submit mutual 5-star ratings and tag feedback. SafePay Escrow automatically releases 90% to driver and retains 10% platform fee.
                </p>
              </div>
            </div>}

          {
    /* TAB 3: DATABASE SCHEMA */
  }
          {activeTab === "database" && <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#0d1820] text-[#fcf9f2] font-mono text-[11px] space-y-2 overflow-x-auto">
                <div className="flex items-center justify-between text-[#7a7f87]">
                  <span>// Cloud Firestore Production Schemas</span>
                  <button
    onClick={() => handleCopy(
      `// Cloud Firestore Collections Schema:
users/{userId} -> { id, name, age, occupation, phone, email, avatar, isAadhaarVerified, aadhaarNumberMasked, rating, emergencyContact, car }
rides/{rideId} -> { id, driverId, driver, car, origin, destination, intermediateStops, date, departureTime, totalSeats, availableSeats, pricePerSeat, status }
bookings/{bookingId} -> { id, rideId, driverId, passengerId, seatsBooked, subtotal, platformFee, totalAmount, status, paymentMethod, isPaid }
messages/{msgId} -> { id, bookingId, senderId, text, timestamp, type, locationData }
reviews/{reviewId} -> { id, rideId, authorId, targetUserId, rating, comment, role }
reports/{reportId} -> { id, reporterId, reportedUserId, reason, details, status }`,
      "schema"
    )}
    className="text-xs text-white hover:text-[#fcf9f2]/80 flex items-center gap-1"
  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedSection === "schema" ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <pre className="text-xs font-mono text-[#fcf9f2]/90 leading-relaxed whitespace-pre">
{`collections:
  users:
    userId: string
    name: string
    age: number
    occupation: string
    phone: string (E.164)
    email: string
    avatar: string (URL)
    isAadhaarVerified: boolean
    aadhaarNumberMasked: string ("XXXX-XXXX-1234")
    emergencyContact: { name: string, phone: string, relation: string }
    car?: { model: string, plate: string, color: string, carType: string }
    rating: number (1.00 - 5.00)
    totalRatingsCount: number

  rides:
    rideId: string
    driverId: string
    origin: string
    destination: string
    intermediateStops: array<{ city: string, landmark?: string }>
    date: string (ISO 8601)
    departureTime: string ("08:30 AM")
    totalSeats: number
    availableSeats: number
    pricePerSeat: number (INR)
    status: 'active' | 'in_progress' | 'completed' | 'cancelled'

  bookings:
    bookingId: string
    rideId: string
    driverId: string
    passengerId: string
    seatsBooked: number
    totalAmount: number
    platformFee: number (10%)
    status: 'pending' | 'accepted' | 'rejected' | 'completed'
    isPaid: boolean
    escrowStatus: 'held' | 'released' | 'refunded'`}
                </pre>
              </div>
            </div>}

          {
    /* TAB 4: API ARCHITECTURE */
  }
          {activeTab === "api" && <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-white border border-[#112b54]/15 space-y-2">
                <span className="text-xs font-semibold text-[#0d1820] block">
                  REST & WebSocket Endpoints
                </span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="p-2 rounded-xl bg-[#fcf9f2] flex items-center justify-between">
                    <span className="text-[#112b54] font-bold">POST</span>
                    <span className="text-[#0d1820]">/api/v1/auth/uidai/verify-otp</span>
                    <span className="text-[10px] text-[#7a7f87]">UIDAI KYC OTP verify</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#fcf9f2] flex items-center justify-between">
                    <span className="text-[#112b54] font-bold">GET</span>
                    <span className="text-[#0d1820]">/api/v1/rides/search?origin=&to=&date=</span>
                    <span className="text-[10px] text-[#7a7f87]">Geo Corridor Match</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#fcf9f2] flex items-center justify-between">
                    <span className="text-[#112b54] font-bold">POST</span>
                    <span className="text-[#0d1820]">/api/v1/rides/create</span>
                    <span className="text-[10px] text-[#7a7f87]">Driver route publish</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#fcf9f2] flex items-center justify-between">
                    <span className="text-[#112b54] font-bold">POST</span>
                    <span className="text-[#0d1820]">/api/v1/bookings/request</span>
                    <span className="text-[10px] text-[#7a7f87]">Passenger seat hold</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#fcf9f2] flex items-center justify-between">
                    <span className="text-[#112b54] font-bold">WSS</span>
                    <span className="text-[#0d1820]">/ws/v1/rides/{"{id}"}/telemetry</span>
                    <span className="text-[10px] text-[#7a7f87]">Live GPS & Speed HUD</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#fcf9f2] flex items-center justify-between border border-[#112b54]/20">
                    <span className="text-[#0d1820] font-bold">POST</span>
                    <span className="text-[#0d1820]">/api/v1/safety/emergency-sos</span>
                    <span className="text-[10px] text-[#7a7f87]">Dispatch to 112 & SMS</span>
                  </div>
                </div>
              </div>
            </div>}

          {
    /* TAB 5: MOBILE ARCHITECTURE */
  }
          {activeTab === "mobile" && <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-white border border-[#112b54]/15 space-y-2">
                <span className="text-xs font-semibold text-[#0d1820] flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#112b54]" /> Android (Kotlin & Jetpack Compose)
                </span>
                <p className="text-[11px] leading-relaxed">
                  Clean Architecture with MVI/MVVM pattern. UI built in declarative Jetpack Compose using Material 3 with customized `#112b54` color tokens. Foreground Service runs a persistent LocationCallback during active trips for live highway telemetry. EncryptedSharedPreferences protects local biometric tokens.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#112b54]/15 space-y-2">
                <span className="text-xs font-semibold text-[#0d1820] flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#112b54]" /> iOS (Swift & SwiftUI)
                </span>
                <p className="text-[11px] leading-relaxed">
                  Swift 6 strict concurrency with Actors and Composable Architecture. Dynamic Island & Live Activities display real-time highway distance, remaining ETA, and driver car details on the Lock Screen. CoreLocation background modes manage battery-optimized geo-fenced pickup triggers.
                </p>
              </div>
            </div>}

          {
    /* TAB 6: WEB ARCHITECTURE */
  }
          {activeTab === "web" && <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-white border border-[#112b54]/15 space-y-2">
                <span className="text-xs font-semibold text-[#0d1820] flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[#112b54]" /> Web Engine & Cloud Run Production
                </span>
                <p className="text-[11px] leading-relaxed">
                  Single-page React 18 + Vite engine styled with Tailwind CSS utility classes and modern Inter + Playfair Display typography. Server proxy endpoints prevent client credential exposure. Cloud Firestore real-time listeners (`onSnapshot`) push instant booking states and chats without polling lag.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#fcf9f2] border border-[#112b54]/15 space-y-1">
                <span className="text-xs font-semibold text-[#0d1820]">Regulatory & Security Compliance</span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-[#7a7f87]">
                  <li>UIDAI e-KYC circular compliance: Aadhaar number never stored unmasked.</li>
                  <li>RBI Payment Aggregator guideline compliance: SafePay Escrow auto-reconciliation.</li>
                  <li>Emergency SOS dispatch conforms to Indian National ERSS 112 API standards.</li>
                </ul>
              </div>
            </div>}
        </div>

        {
    /* Footer */
  }
        <div className="pt-3 border-t border-[#112b54]/10 flex justify-end">
          <button
    onClick={onClose}
    className="px-5 py-2.5 rounded-xl bg-[#0d1820] hover:bg-[#112b54] text-white text-xs font-medium transition-all shadow-xs"
  >
            Close Architecture Console
          </button>
        </div>
      </div>
    </div>;
};
