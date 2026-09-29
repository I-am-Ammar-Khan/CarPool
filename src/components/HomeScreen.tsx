import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Car,
  Luggage,
  MapPin,
  Calendar,
  Users,
  Search,
  ArrowRight,
  ShieldCheck,
  Star,
  FileText
} from 'lucide-react';
import { Ride } from '../types';

interface HomeScreenProps {
  onOpenSpecs: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenSpecs }) => {
  const {
    setCurrentScreen,
    rides,
    setSelectedRide,
    searchQuery,
    setSearchQuery,
    currentUser,
    switchUserRole,
  } = useApp();

  const [fromInput, setFromInput] = useState(searchQuery.origin || '');
  const [toInput, setToInput] = useState(searchQuery.destination || '');
  const [dateInput, setDateInput] = useState(searchQuery.date || '2026-09-17');
  const [seatsInput, setSeatsInput] = useState(searchQuery.seats || 1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery((prev) => ({
      ...prev,
      origin: fromInput,
      destination: toInput,
      date: dateInput,
      seats: Number(seatsInput),
    }));
    setCurrentScreen('search_ride');
  };

  const activeAvailableRides = rides.filter(
    (r) => r.status === 'active' && r.availableSeats > 0
  );

  const handleSelectRide = (ride: Ride) => {
    setSelectedRide(ride);
    setCurrentScreen('ride_details');
  };

  return (
    <div className="min-h-screen bg-[#fcf9f2] text-[#0d1820] pb-24">
      {/* Editorial Hero matching User Image 1 */}
      <div className="px-5 pt-8 pb-6 border-b border-[#112b54]/10">
        <div className="max-w-md mx-auto">
          {/* Logo & Author Presentation */}
          <div className="mb-6">
            <h1 className="font-serif italic text-5xl sm:text-6xl font-normal tracking-tight text-[#0d1820] leading-none">
              CarPool<span className="text-[#112b54]">.</span>
            </h1>
            <p className="text-xs font-semibold text-[#7a7f87] tracking-tight mt-1.5 pl-0.5">
              Presented by Ammar Khan
            </p>
          </div>

          {/* Subtitle Statement */}
          <p className="font-serif italic text-2xl sm:text-3xl text-[#0d1820] font-normal leading-[1.25] tracking-tight max-w-sm">
            Turning empty car seats into shared, affordable journeys<span className="text-[#112b54]">.</span>
          </p>

          {/* Verification promise tag */}
          <div className="mt-4 flex items-center gap-2 text-xs text-[#7a7f87]">
            <ShieldCheck className="w-4 h-4 text-[#112b54]" />
            <span>100% Aadhaar-verified travelers</span>
            <span>•</span>
            <button
              onClick={onOpenSpecs}
              id="open-architecture-specs-btn"
              className="text-[#112b54] hover:underline"
            >
              Specs
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6 space-y-6">
        {/* Section Heading matching prompt: asking who are you a car owner or a passenger */}
        <div className="space-y-1 px-1">
          <h2
            id="home-role-inquiry-heading"
            className="font-serif italic text-2xl sm:text-3xl text-[#0d1820] font-semibold leading-tight tracking-tight"
          >
            <span className="text-[#112b54] font-normal">
            Who are you?{' '}
            </span>
          </h2>
          <p className="text-xs text-[#7a7f87]">
            Select your role to offer or find shared, verified rides.
          </p>
        </div>

        {/* Two Simple Choices: I'm Driving & I Need a Ride */}
        <div className="grid grid-cols-2 gap-3">
          <button
            id="home-action-driving"
            onClick={() => {
              switchUserRole('driver');
              setCurrentScreen('create_ride');
            }}
            className="p-4 rounded-2xl bg-white border border-[#112b54]/15 hover:border-[#112b54] transition-all text-left group shadow-xs hover:shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="text-2xl mb-2">🚗</div>
              <h3 className="font-serif italic text-lg text-[#0d1820] font-semibold leading-tight">
                I'm Driving
              </h3>
            </div>
            <p className="text-xs text-[#7a7f87] mt-1.5 font-normal">
              Offer a ride.
            </p>
          </button>

          <button
            id="home-action-passenger"
            onClick={() => {
              switchUserRole('passenger');
              setCurrentScreen('search_ride');
            }}
            className="p-4 rounded-2xl bg-white border border-[#112b54]/15 hover:border-[#112b54] transition-all text-left group shadow-xs hover:shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="text-2xl mb-2">🧳</div>
              <h3 className="font-serif italic text-lg text-[#0d1820] font-semibold leading-tight">
                I Need a Ride
              </h3>
            </div>
            <p className="text-xs text-[#7a7f87] mt-1.5 font-normal">
              Find a ride.
            </p>
          </button>
        </div>

        {/* Login & Verification Banner */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#112b54]/15 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#112b54]" />
            <div>
              <div className="text-xs font-semibold text-[#0d1820]">
                {currentUser.isAadhaarVerified && currentUser.isPhoneVerified
                  ? `Verified Traveler: ${currentUser.name}`
                  : 'Complete Your Login & KYC'}
              </div>
              <span className="text-[11px] text-[#7a7f87]">
                Aadhaar • Phone • Photo • Driver License
              </span>
            </div>
          </div>
          <button
            onClick={() => setCurrentScreen('auth')}
            className="px-3 py-1.5 rounded-xl bg-[#0d1820] text-white text-xs font-medium hover:bg-[#112b54] transition-colors"
          >
            Login / KYC
          </button>
        </div>

        {/* Minimalist Search Box */}
        <div className="p-4 rounded-2xl bg-white border border-[#112b54]/15 shadow-sm space-y-3">
          <form onSubmit={handleSearch} className="space-y-2.5">
            {/* From */}
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#7a7f87] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="home-search-from"
                type="text"
                placeholder="Leaving from (e.g. Lucknow)"
                value={fromInput}
                onChange={(e) => setFromInput(e.target.value)}
                className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#0d1820] placeholder-[#7a7f87] focus:outline-none focus:border-[#112b54] transition-colors"
              />
            </div>

            {/* To */}
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#112b54] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="home-search-to"
                type="text"
                placeholder="Going to (e.g. Kanpur)"
                value={toInput}
                onChange={(e) => setToInput(e.target.value)}
                className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#0d1820] placeholder-[#7a7f87] focus:outline-none focus:border-[#112b54] transition-colors"
              />
            </div>

            {/* Date & Seats Row */}
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-[#7a7f87] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="home-search-date"
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl pl-8 pr-2 py-2 text-xs text-[#0d1820] focus:outline-none focus:border-[#112b54]"
                />
              </div>

              <div className="relative">
                <Users className="w-3.5 h-3.5 text-[#7a7f87] absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  id="home-search-seats"
                  value={seatsInput}
                  onChange={(e) => setSeatsInput(Number(e.target.value))}
                  className="w-full bg-[#fcf9f2] border border-[#112b54]/15 rounded-xl pl-8 pr-2 py-2 text-xs text-[#0d1820] focus:outline-none focus:border-[#112b54]"
                >
                  <option value={1}>1 Seat</option>
                  <option value={2}>2 Seats</option>
                  <option value={3}>3 Seats</option>
                  <option value={4}>4 Seats</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="home-search-submit-btn"
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#0d1820] hover:bg-[#112b54] active:scale-[0.99] text-white font-medium text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Find Available Rides</span>
            </button>
          </form>
        </div>

        {/* Minimal Available Rides Section */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-serif italic text-lg text-[#0d1820] font-medium">
              Available Departures
            </h2>
            <button
              id="home-view-all-rides-btn"
              onClick={() => setCurrentScreen('search_ride')}
              className="text-xs text-[#112b54] hover:underline flex items-center gap-1 font-medium"
            >
              <span>View all ({activeAvailableRides.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {activeAvailableRides.slice(0, 3).map((ride) => (
              <div
                key={ride.id}
                id={`ride-card-${ride.id}`}
                onClick={() => handleSelectRide(ride)}
                className="p-3.5 rounded-2xl bg-white border border-[#112b54]/15 hover:border-[#112b54]/60 transition-all cursor-pointer group shadow-xs hover:shadow-sm"
              >
                {/* Header: Driver Info & Price */}
                <div className="flex items-center justify-between mb-2.5">
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
                        {ride.driver.isAadhaarVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-[#112b54]" title="Aadhaar Verified" />
                        )}
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

                {/* Route Information */}
                <div className="p-2.5 rounded-xl bg-[#fcf9f2] border border-[#112b54]/10 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-[#0d1820] flex items-center gap-1.5">
                      <span>{ride.origin}</span>
                      <span className="text-[#7a7f87]">→</span>
                      <span>{ride.destination}</span>
                    </div>
                    <div className="text-[10px] text-[#7a7f87] mt-0.5">
                      Departs {ride.departureTime} • {ride.date}
                    </div>
                  </div>

                  <span className="text-[11px] font-medium text-[#112b54] bg-white px-2 py-0.5 rounded-lg border border-[#112b54]/15">
                    {ride.availableSeats} seats left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
