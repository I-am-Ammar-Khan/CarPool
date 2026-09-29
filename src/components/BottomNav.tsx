import React from 'react';
import { useApp } from '../context/AppContext';
import { Compass, Search, Plus, Clock, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen } = useApp();

  const navItems = [
    { id: 'home', label: 'Explore', icon: Compass },
    { id: 'search_ride', label: 'Search', icon: Search },
    { id: 'create_ride', label: 'Offer', icon: Plus, isAction: true },
    { id: 'history', label: 'Activity', icon: Clock },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#fcf9f2]/95 backdrop-blur-md border-t border-[#112b54]/10 pb-safe">
      <div className="max-w-md mx-auto px-4 h-15 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          if (item.isAction) {
            return (
              <button
                key={item.id}
                id={`bottom-nav-${item.id}`}
                onClick={() => setCurrentScreen('create_ride')}
                className="flex flex-col items-center justify-center -mt-3 group"
              >
                <div className="w-10 h-10 rounded-full bg-[#0d1820] text-[#fcf9f2] flex items-center justify-center shadow-md hover:bg-[#112b54] active:scale-95 transition-all">
                  <Plus className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[10px] font-medium text-[#0d1820] mt-1">
                  Offer
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => setCurrentScreen(item.id as any)}
              className={`flex flex-col items-center justify-center py-1 px-3 min-w-[52px] min-h-[44px] rounded-xl transition-colors relative ${
                isActive ? 'text-[#0d1820]' : 'text-[#7a7f87] hover:text-[#0d1820]'
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'}`} />
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'font-bold text-[#0d1820]' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-[#112b54] rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
