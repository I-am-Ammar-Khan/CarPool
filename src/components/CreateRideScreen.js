import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Car,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Trash2
} from "lucide-react";
export const CreateRideScreen = () => {
  const { createRide, currentUser, setCurrentScreen, goBack } = useApp();
  const [origin, setOrigin] = useState("Lucknow");
  const [destination, setDestination] = useState("Kanpur");
  const [date, setDate] = useState("2026-09-17");
  const [departureTime, setDepartureTime] = useState("08:30 AM");
  const [availableSeats, setAvailableSeats] = useState(3);
  const [pricePerSeat, setPricePerSeat] = useState(220);
  const [notes, setNotes] = useState("AC on, sanitized car, luggage space available.");
  const [carModel, setCarModel] = useState(currentUser.car?.model || "Honda City ZX");
  const [carPlate, setCarPlate] = useState(currentUser.car?.plate || "UP 32 BK 4091");
  const [carColor, setCarColor] = useState(currentUser.car?.color || "Pearl White");
  const [carType, setCarType] = useState(
    currentUser.car?.carType || "Sedan"
  );
  const [carPhotoUrl, setCarPhotoUrl] = useState(
    currentUser.car?.photoUrl || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80"
  );
  const vehiclePhotoPresets = [
    { name: "Sedan", url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80" },
    { name: "SUV", url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80" },
    { name: "EV", url: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80" },
    { name: "Hatchback", url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=80" }
  ];
  const [intermediateStops, setIntermediateStops] = useState([
    { city: "Unnao Bypass", landmark: "Highway Toll", estimatedArrivalMinutes: 45 }
  ]);
  const [newStopCity, setNewStopCity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState(null);
  const handleAddStop = () => {
    if (!newStopCity.trim()) return;
    setIntermediateStops((prev) => [
      ...prev,
      { city: newStopCity.trim(), estimatedArrivalMinutes: 40 }
    ]);
    setNewStopCity("");
  };
  const handleRemoveStop = (idx) => {
    setIntermediateStops((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const rideId = await createRide({
        origin,
        destination,
        date,
        departureTime,
        totalSeats: availableSeats,
        availableSeats,
        pricePerSeat,
        notes,
        intermediateStops,
        amenities: ["Air Conditioning", "Luggage Space", "Music"],
        car: {
          model: carModel,
          plate: carPlate,
          color: carColor,
          carType,
          photoUrl: carPhotoUrl
        }
      });
      setSuccessId(rideId);
      setTimeout(() => {
        setCurrentScreen("home");
      }, 1400);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
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
          Offer a Ride<span className="text-[#112b54]">.</span>
        </h2>
        <div className="w-6" />
      </div>

      <div className="max-w-md mx-auto px-4 mt-4">
        {successId ? <div className="p-8 rounded-2xl bg-white border border-[#112b54]/20 text-center space-y-2.5 animate-in zoom-in-95 shadow-sm">
            <div className="w-12 h-12 bg-[#fcf9f2] text-[#112b54] rounded-full flex items-center justify-center mx-auto border border-[#112b54]/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif italic text-xl text-[#0d1820]">Ride Published!</h3>
            <p className="text-xs text-[#7a7f87]">
              Your journey from {origin} to {destination} is live and open for seat bookings.
            </p>
          </div> : <form onSubmit={handleSubmit} className="space-y-4">
            {
    /* Driver Identity */
  }
            <div className="p-3.5 rounded-2xl bg-white border border-[#112b54]/15 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <img
    src={currentUser.avatar}
    alt={currentUser.name}
    className="w-10 h-10 rounded-full object-cover border border-[#112b54]/20"
  />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-[#0d1820]">{currentUser.name}</span>
                    {currentUser.isAadhaarVerified && <ShieldCheck className="w-3.5 h-3.5 text-[#112b54]" />}
                  </div>
                  <span className="text-[11px] text-[#7a7f87]">{currentUser.occupation}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-[#0d1820]">★ {currentUser.rating}</span>
                <span className="text-[10px] text-[#7a7f87] block">{currentUser.totalRatingsCount} trips</span>
              </div>
            </div>

            {
    /* Route & Schedule */
  }
            <div className="p-4 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#112b54] block">
                Itinerary
              </span>

              <div className="space-y-2">
                <div>
                  <label className="text-[11px] text-[#7a7f87] block mb-1">Origin City</label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-[#7a7f87] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
    type="text"
    required
    value={origin}
    onChange={(e) => setOrigin(e.target.value)}
    placeholder="e.g. Lucknow"
    className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl pl-8 pr-3 py-2 text-xs text-[#0d1820] focus:outline-none focus:border-[#112b54]"
  />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-[#7a7f87] block mb-1">Destination City</label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-[#112b54] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
    type="text"
    required
    value={destination}
    onChange={(e) => setDestination(e.target.value)}
    placeholder="e.g. Kanpur"
    className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl pl-8 pr-3 py-2 text-xs text-[#0d1820] focus:outline-none focus:border-[#112b54]"
  />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[11px] text-[#7a7f87] block mb-1">Date</label>
                  <input
    type="date"
    required
    value={date}
    onChange={(e) => setDate(e.target.value)}
    className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl px-2.5 py-1.5 text-xs text-[#0d1820] focus:outline-none focus:border-[#112b54]"
  />
                </div>
                <div>
                  <label className="text-[11px] text-[#7a7f87] block mb-1">Time</label>
                  <input
    type="text"
    required
    value={departureTime}
    onChange={(e) => setDepartureTime(e.target.value)}
    placeholder="08:30 AM"
    className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl px-2.5 py-1.5 text-xs text-[#0d1820] focus:outline-none focus:border-[#112b54]"
  />
                </div>
              </div>

              {
    /* Intermediate stops minimal */
  }
              <div className="pt-2 border-t border-[#112b54]/10">
                <label className="text-[11px] text-[#7a7f87] block mb-1">Stops on Highway</label>
                {intermediateStops.map((stop, idx) => <div key={idx} className="flex items-center justify-between text-xs py-1 text-[#0d1820]">
                    <span>• {stop.city}</span>
                    <button
    type="button"
    onClick={() => handleRemoveStop(idx)}
    className="text-[#7a7f87] hover:text-[#0d1820]"
  >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>)}
                <div className="flex gap-2 mt-1.5">
                  <input
    type="text"
    placeholder="Add a stop (e.g. Unnao)"
    value={newStopCity}
    onChange={(e) => setNewStopCity(e.target.value)}
    className="flex-1 bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl px-2.5 py-1 text-xs text-[#0d1820]"
  />
                  <button
    type="button"
    onClick={handleAddStop}
    className="px-2.5 py-1 rounded-xl bg-white border border-[#112b54]/20 text-xs font-medium text-[#0d1820]"
  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {
    /* Seats & Price */
  }
            <div className="p-4 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#112b54] block">
                Capacity & Fare
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-[#7a7f87] block mb-1">Available Seats</label>
                  <select
    value={availableSeats}
    onChange={(e) => setAvailableSeats(Number(e.target.value))}
    className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl px-2.5 py-2 text-xs text-[#0d1820] focus:outline-none focus:border-[#112b54]"
  >
                    <option value={1}>1 Seat</option>
                    <option value={2}>2 Seats</option>
                    <option value={3}>3 Seats</option>
                    <option value={4}>4 Seats</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-[#7a7f87] block mb-1">Price Per Seat (₹)</label>
                  <input
    type="number"
    min={50}
    max={5e3}
    value={pricePerSeat}
    onChange={(e) => setPricePerSeat(Number(e.target.value))}
    className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl px-2.5 py-2 text-xs font-semibold text-[#0d1820] focus:outline-none focus:border-[#112b54]"
  />
                </div>
              </div>

              <div className="p-2 rounded-xl bg-[#fcf9f2] text-xs flex justify-between text-[#7a7f87]">
                <span>Estimated Trip Earnings:</span>
                <span className="font-semibold text-[#0d1820]">₹{availableSeats * pricePerSeat}</span>
              </div>
            </div>

            {
    /* Vehicle Details */
  }
            <div className="p-4 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#112b54] block">
                Vehicle Information
              </span>

              {
    /* Model & Number Plate */
  }
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#7a7f87] block mb-0.5">Model</label>
                  <input
    type="text"
    required
    placeholder="e.g. Honda City ZX"
    value={carModel}
    onChange={(e) => setCarModel(e.target.value)}
    className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl px-2.5 py-1.5 text-xs text-[#0d1820]"
  />
                </div>
                <div>
                  <label className="text-[10px] text-[#7a7f87] block mb-0.5">Number Plate</label>
                  <input
    type="text"
    required
    placeholder="e.g. UP 32 BK 4091"
    value={carPlate}
    onChange={(e) => setCarPlate(e.target.value)}
    className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl px-2.5 py-1.5 text-xs text-[#0d1820] uppercase font-mono"
  />
                </div>
              </div>

              {
    /* Vehicle Photo */
  }
              <div className="space-y-1.5 pt-1 border-t border-[#112b54]/10">
                <label className="text-[10px] text-[#7a7f87] block">Vehicle Photo</label>
                <div className="flex items-center gap-3">
                  <img
    src={carPhotoUrl}
    alt="Vehicle preview"
    className="w-16 h-12 rounded-xl object-cover border border-[#112b54]/20 shadow-xs"
  />
                  <div className="flex-1">
                    <span className="text-[10px] text-[#7a7f87] block mb-1">Select vehicle photo:</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {vehiclePhotoPresets.map((preset) => <button
    key={preset.name}
    type="button"
    onClick={() => {
      setCarPhotoUrl(preset.url);
      setCarType(preset.name);
    }}
    className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border transition-colors ${carPhotoUrl === preset.url ? "bg-[#112b54] text-white border-[#112b54]" : "bg-[#fcf9f2] border-[#112b54]/15 text-[#0d1820]"}`}
  >
                          {preset.name}
                        </button>)}
                    </div>
                  </div>
                </div>
              </div>

              <textarea
    rows={2}
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
    placeholder="Trip notes for passengers (e.g. AC on, quiet drive, luggage space)..."
    className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl p-2 text-xs text-[#0d1820] focus:outline-none focus:border-[#112b54]"
  />
            </div>

            {
    /* Submit */
  }
            <button
    id="create-ride-submit-btn"
    type="submit"
    disabled={isSubmitting}
    className="w-full py-3 rounded-xl bg-[#0d1820] hover:bg-[#112b54] active:scale-[0.99] text-white font-medium text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
  >
              {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>
                  <Car className="w-3.5 h-3.5" />
                  <span>Publish Ride & Offer Seats</span>
                </>}
            </button>
          </form>}
      </div>
    </div>;
};
