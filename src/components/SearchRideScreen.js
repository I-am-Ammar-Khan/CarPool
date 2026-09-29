import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import {
  SlidersHorizontal,
  MapPin,
  ShieldCheck,
  X,
  ArrowLeft,
  Calendar,
  Clock
} from "lucide-react";
export const SearchRideScreen = () => {
  const {
    rides,
    searchQuery,
    setSearchQuery,
    setSelectedRide,
    setCurrentScreen,
    goBack
  } = useApp();
  const [showFilters, setShowFilters] = useState(false);
  const filteredRides = useMemo(() => {
    return rides.filter((ride) => {
      if (ride.status !== "active" || ride.availableSeats <= 0) {
        return false;
      }
      if (ride.availableSeats < (searchQuery.seats || 1)) {
        return false;
      }
      if (searchQuery.origin && !ride.origin.toLowerCase().includes(searchQuery.origin.toLowerCase()) && !ride.intermediateStops.some(
        (s) => s.city.toLowerCase().includes(searchQuery.origin.toLowerCase())
      )) {
        return false;
      }
      if (searchQuery.destination && !ride.destination.toLowerCase().includes(searchQuery.destination.toLowerCase()) && !ride.intermediateStops.some(
        (s) => s.city.toLowerCase().includes(searchQuery.destination.toLowerCase())
      )) {
        return false;
      }
      if (searchQuery.carType && ride.car.carType !== searchQuery.carType) {
        return false;
      }
      if (searchQuery.genderPreference && searchQuery.genderPreference !== "any" && ride.driver.gender !== searchQuery.genderPreference) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (searchQuery.sortBy === "lowest_price") {
        return a.pricePerSeat - b.pricePerSeat;
      }
      if (searchQuery.sortBy === "highest_rated") {
        return b.driver.rating - a.driver.rating;
      }
      if (searchQuery.sortBy === "earliest") {
        return a.departureTime.localeCompare(b.departureTime);
      }
      return 0;
    });
  }, [rides, searchQuery]);
  const handleSelectRide = (ride) => {
    setSelectedRide(ride);
    setCurrentScreen("ride_details");
  };
  const clearFilters = () => {
    setSearchQuery({
      origin: "",
      destination: "",
      date: "2026-09-17",
      seats: 1,
      sortBy: "lowest_price",
      carType: void 0,
      genderPreference: void 0,
      maxPrice: void 0
    });
  };
  return <div className="min-h-screen bg-[#fcf9f2] text-[#0d1820] pb-28">
      {
    /* Header */
  }
      <div className="sticky top-0 z-30 bg-[#fcf9f2]/95 backdrop-blur-md px-4 py-3 border-b border-[#112b54]/10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <button
    onClick={goBack}
    className="p-1 rounded-lg text-[#7a7f87] hover:text-[#0d1820]"
  >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="font-serif italic text-lg font-medium text-[#0d1820]">
                Available Rides<span className="text-[#112b54]">.</span>
              </h2>
            </div>

            <button
    id="toggle-filters-btn"
    onClick={() => setShowFilters(!showFilters)}
    className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-colors ${showFilters || searchQuery.carType || searchQuery.genderPreference ? "bg-[#112b54] text-white border-[#112b54]" : "bg-white border-[#112b54]/20 text-[#7a7f87] hover:text-[#0d1820]"}`}
  >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Filters</span>
            </button>
          </div>

          {
    /* Quick Route & Date/Time Inputs matching prompt: From, To, Date & Time */
  }
          <div className="space-y-1.5 bg-white p-2 rounded-2xl border border-[#112b54]/15 text-xs shadow-xs">
            <div className="grid grid-cols-2 gap-1.5">
              <div className="flex items-center gap-1.5 px-2 py-1.5 bg-[#fcf9f2] rounded-xl border border-[#112b54]/10">
                <MapPin className="w-3.5 h-3.5 text-[#7a7f87] shrink-0" />
                <input
    id="search-input-origin"
    type="text"
    placeholder="From (e.g. Lucknow)"
    value={searchQuery.origin}
    onChange={(e) => setSearchQuery((prev) => ({ ...prev, origin: e.target.value }))}
    className="w-full bg-transparent text-[#0d1820] placeholder-[#7a7f87] focus:outline-none text-xs"
  />
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1.5 bg-[#fcf9f2] rounded-xl border border-[#112b54]/10">
                <MapPin className="w-3.5 h-3.5 text-[#112b54] shrink-0" />
                <input
    id="search-input-destination"
    type="text"
    placeholder="To (e.g. Kanpur)"
    value={searchQuery.destination}
    onChange={(e) => setSearchQuery((prev) => ({ ...prev, destination: e.target.value }))}
    className="w-full bg-transparent text-[#0d1820] placeholder-[#7a7f87] focus:outline-none text-xs"
  />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <div className="flex items-center gap-1.5 px-2 py-1.5 bg-[#fcf9f2] rounded-xl border border-[#112b54]/10">
                <Calendar className="w-3.5 h-3.5 text-[#7a7f87] shrink-0" />
                <input
    id="search-input-date"
    type="date"
    value={searchQuery.date || "2026-09-17"}
    onChange={(e) => setSearchQuery((prev) => ({ ...prev, date: e.target.value }))}
    className="w-full bg-transparent text-[#0d1820] focus:outline-none text-[11px]"
  />
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1.5 bg-[#fcf9f2] rounded-xl border border-[#112b54]/10">
                <Clock className="w-3.5 h-3.5 text-[#7a7f87] shrink-0" />
                <select
    id="search-input-time"
    value={searchQuery.sortBy || "lowest_price"}
    onChange={(e) => setSearchQuery((prev) => ({ ...prev, sortBy: e.target.value }))}
    className="w-full bg-transparent text-[#0d1820] focus:outline-none text-[11px]"
  >
                  <option value="lowest_price">Any Time (Lowest Fare)</option>
                  <option value="earliest">Morning Departures</option>
                  <option value="highest_rated">Top-Rated Drivers</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-3">
        {
    /* Minimal Filters Panel */
  }
        {showFilters && <div className="p-3.5 rounded-2xl bg-white border border-[#112b54]/15 mb-3 space-y-3 shadow-sm animate-in fade-in">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#112b54]/10">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#112b54]">
                Filter by
              </span>
              <button
    onClick={clearFilters}
    className="text-[11px] text-[#7a7f87] hover:text-[#0d1820] flex items-center gap-0.5"
  >
                <X className="w-3 h-3" /> Reset
              </button>
            </div>

            {
    /* Sort */
  }
            <div>
              <label className="text-[11px] text-[#7a7f87] block mb-1">Sort</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
    { id: "lowest_price", label: "Lowest Price" },
    { id: "earliest", label: "Earliest" },
    { id: "highest_rated", label: "Top Rated" }
  ].map((sort) => <button
    key={sort.id}
    onClick={() => setSearchQuery((prev) => ({ ...prev, sortBy: sort.id }))}
    className={`py-1 px-1.5 rounded-lg text-xs font-medium border text-center transition-colors ${searchQuery.sortBy === sort.id ? "bg-[#112b54] text-white border-[#112b54]" : "bg-[#fcf9f2] border-[#112b54]/15 text-[#7a7f87]"}`}
  >
                    {sort.label}
                  </button>)}
              </div>
            </div>

            {
    /* Car Type */
  }
            <div>
              <label className="text-[11px] text-[#7a7f87] block mb-1">Vehicle Type</label>
              <div className="flex flex-wrap gap-1.5">
                {["Sedan", "SUV", "Hatchback", "EV"].map((type) => <button
    key={type}
    onClick={() => setSearchQuery((prev) => ({
      ...prev,
      carType: prev.carType === type ? void 0 : type
    }))}
    className={`px-2.5 py-0.5 rounded-full text-xs border transition-colors ${searchQuery.carType === type ? "bg-[#112b54] text-white border-[#112b54]" : "bg-[#fcf9f2] border-[#112b54]/15 text-[#7a7f87]"}`}
  >
                    {type}
                  </button>)}
              </div>
            </div>
          </div>}

        {
    /* Results Counter */
  }
        <div className="flex items-center justify-between mb-2 text-xs text-[#7a7f87] px-1">
          <span>{filteredRides.length} rides found</span>
          <span>Aadhaar verified drivers</span>
        </div>

        {
    /* Rides List */
  }
        {filteredRides.length === 0 ? <div className="p-8 rounded-2xl bg-white border border-[#112b54]/15 text-center space-y-2 mt-4">
            <h3 className="font-serif italic text-base text-[#0d1820]">No rides match this route</h3>
            <p className="text-xs text-[#7a7f87]">
              Try searching broader corridors like Lucknow, Kanpur, or Mumbai.
            </p>
            <button
    onClick={clearFilters}
    className="mt-2 px-3 py-1.5 rounded-xl bg-[#0d1820] text-white text-xs font-medium"
  >
              Reset Filters
            </button>
          </div> : <div className="space-y-2.5">
            {filteredRides.map((ride) => <div
    key={ride.id}
    id={`search-ride-item-${ride.id}`}
    onClick={() => handleSelectRide(ride)}
    className="p-3.5 rounded-2xl bg-white border border-[#112b54]/15 hover:border-[#112b54]/50 transition-all cursor-pointer group shadow-xs hover:shadow-sm"
  >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <img
    src={ride.driver.avatar}
    alt={ride.driver.name}
    className="w-9 h-9 rounded-full object-cover border border-[#112b54]/20"
  />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-[#0d1820]">
                          {ride.driver.name}
                        </span>
                        {ride.driver.isAadhaarVerified && <ShieldCheck className="w-3.5 h-3.5 text-[#112b54]" />}
                        <span className="text-[10px] text-[#7a7f87]">
                          ★ {ride.driver.rating}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#7a7f87]">
                        {ride.car.model}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-[#0d1820]">
                      ₹{ride.pricePerSeat}
                    </div>
                    <span className="text-[10px] text-[#7a7f87]">per seat</span>
                  </div>
                </div>

                {
    /* Route */
  }
                <div className="p-2.5 rounded-xl bg-[#fcf9f2] border border-[#112b54]/10 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-[#0d1820]">
                      {ride.origin} → {ride.destination}
                    </div>
                    <div className="text-[10px] text-[#7a7f87] mt-0.5">
                      Departs {ride.departureTime} • {ride.date}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-medium text-[#112b54] bg-white px-2 py-0.5 rounded-lg border border-[#112b54]/15">
                      {ride.availableSeats} seats left
                    </span>
                  </div>
                </div>
              </div>)}
          </div>}
      </div>
    </div>;
};
