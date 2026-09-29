import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Bell,
  User,
  Car,
  Luggage,
  AlertTriangle,
  Menu,
  X,
  Lock,
  Check
} from 'lucide-react';

interface NavbarProps {
  onOpenVerification?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenVerification }) => {
  const {
    currentScreen,
    setCurrentScreen,
    currentUser,
    switchUserRole,
    unreadNotifsCount,
    notifications,
    markNotificationRead,
    triggerSosAlert,
  } = useApp();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#fcf9f2]/90 backdrop-blur-md border-b border-[#112b54]/10 text-[#0d1820]">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* Editorial Logo */}
        <div
          id="nav-brand-logo"
          onClick={() => setCurrentScreen('home')}
          className="flex items-baseline gap-1.5 cursor-pointer group select-none"
        >
          <span className="font-serif italic text-2xl font-bold tracking-tight text-[#0d1820] group-hover:opacity-80 transition-opacity">
            CarPool<span className="text-[#112b54]">.</span>
          </span>
          <span className="text-[10px] text-[#7a7f87] font-medium tracking-tight hidden xs:inline">
            by Ammar Khan
          </span>
        </div>

        {/* Minimal Controls */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher Pill */}
          <div className="relative">
            <button
              id="role-switch-button"
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-[#112b54]/15 text-[#0d1820] hover:border-[#112b54]/40 transition-colors shadow-xs"
              title="Switch user role mode"
            >
              {currentUser.role === 'driver' && <Car className="w-3.5 h-3.5 text-[#112b54]" />}
              {currentUser.role === 'passenger' && <Luggage className="w-3.5 h-3.5 text-[#112b54]" />}
              {currentUser.role === 'admin' && <Lock className="w-3.5 h-3.5 text-[#112b54]" />}
              <span className="capitalize text-[11px] font-semibold">{currentUser.role}</span>
            </button>

            {/* Dropdown */}
            {showRoleMenu && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white border border-[#112b54]/15 rounded-2xl p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setShowRoleMenu(false)}
              >
                <div className="px-2.5 py-1 text-[10px] font-semibold text-[#7a7f87] uppercase tracking-wider">
                  Active Mode
                </div>
                <button
                  id="switch-to-passenger"
                  onClick={() => switchUserRole('passenger')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    currentUser.role === 'passenger'
                      ? 'bg-[#112b54] text-white font-medium'
                      : 'text-[#0d1820] hover:bg-[#fcf9f2]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Luggage className="w-3.5 h-3.5" />
                    <span>Passenger</span>
                  </div>
                  {currentUser.role === 'passenger' && <Check className="w-3 h-3" />}
                </button>
                <button
                  id="switch-to-driver"
                  onClick={() => switchUserRole('driver')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    currentUser.role === 'driver'
                      ? 'bg-[#112b54] text-white font-medium'
                      : 'text-[#0d1820] hover:bg-[#fcf9f2]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Car className="w-3.5 h-3.5" />
                    <span>Driver</span>
                  </div>
                  {currentUser.role === 'driver' && <Check className="w-3 h-3" />}
                </button>
                <button
                  id="switch-to-admin"
                  onClick={() => {
                    switchUserRole('admin');
                    setCurrentScreen('admin');
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    currentUser.role === 'admin'
                      ? 'bg-[#112b54] text-white font-medium'
                      : 'text-[#0d1820] hover:bg-[#fcf9f2]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </div>
                  {currentUser.role === 'admin' && <Check className="w-3 h-3" />}
                </button>
              </div>
            )}
          </div>

          {/* Discreet Notifications Bell */}
          <div className="relative">
            <button
              id="notifications-button"
              onClick={() => setShowNotifs(!showNotifs)}
              className="w-8 h-8 rounded-full bg-white border border-[#112b54]/15 text-[#0d1820] hover:border-[#112b54]/40 flex items-center justify-center transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5 text-[#0d1820]" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#112b54] rounded-full" />
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-[#112b54]/15 rounded-2xl p-2.5 shadow-xl z-50 text-xs animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#112b54]/10">
                  <span className="font-semibold text-[#0d1820] text-xs">Notifications</span>
                  <span className="text-[10px] text-[#7a7f87]">{notifications.length} alerts</span>
                </div>
                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2 rounded-xl border text-[11px] cursor-pointer transition-colors ${
                        n.read
                          ? 'bg-transparent border-transparent text-[#7a7f87]'
                          : 'bg-[#fcf9f2] border-[#112b54]/10 text-[#0d1820] font-medium'
                      }`}
                    >
                      <div className="font-semibold text-xs text-[#0d1820]">{n.title}</div>
                      <p className="text-[11px] text-[#7a7f87] mt-0.5">{n.message}</p>
                      <span className="text-[9px] text-[#7a7f87] mt-1 block">{n.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Discreet SOS Button */}
          <button
            id="emergency-sos-button"
            onClick={triggerSosAlert}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#0d1820] bg-[#fcf9f2] border border-[#0d1820] hover:bg-[#0d1820] hover:text-white transition-colors"
            title="Emergency SOS"
          >
            SOS
          </button>
        </div>
      </div>
    </header>
  );
};
