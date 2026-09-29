import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { CreateRideScreen } from './components/CreateRideScreen';
import { SearchRideScreen } from './components/SearchRideScreen';
import { RideDetailModal } from './components/RideDetailModal';
import { BookingStatusModal } from './components/BookingStatusModal';
import { ChatScreen } from './components/ChatScreen';
import { PaymentScreen } from './components/PaymentScreen';
import { TrackingScreen } from './components/TrackingScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { AdminPanel } from './components/AdminPanel';
import { LoginScreen } from './components/LoginScreen';
import { AadhaarVerificationModal } from './components/AadhaarVerificationModal';
import { SpecsModal } from './components/SpecsModal';

const MainContent: React.FC = () => {
  const { currentScreen } = useApp();
  const [showSpecsModal, setShowSpecsModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onOpenSpecs={() => setShowSpecsModal(true)} />;
      case 'auth':
        return <LoginScreen />;
      case 'create_ride':
        return <CreateRideScreen />;
      case 'search_ride':
        return <SearchRideScreen />;
      case 'ride_details':
        return <RideDetailModal />;
      case 'booking_status':
        return <BookingStatusModal />;
      case 'chat':
        return <ChatScreen />;
      case 'payment':
        return <PaymentScreen />;
      case 'tracking':
        return <TrackingScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'profile':
        return (
          <ProfileScreen
            onOpenVerification={() => setShowVerificationModal(true)}
          />
        );
      case 'admin':
        return <AdminPanel />;
      default:
        return <HomeScreen onOpenSpecs={() => setShowSpecsModal(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f2] text-[#0d1820] flex flex-col justify-between selection:bg-[#112b54]/15 selection:text-[#0d1820]">
      {/* Top Navbar */}
      <Navbar onOpenVerification={() => setShowVerificationModal(true)} />

      {/* Main Content Viewport */}
      <main className="flex-1 w-full max-w-md mx-auto">
        {renderScreen()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Aadhaar KYC Modal */}
      <AadhaarVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
      />

      {/* System Specs Modal */}
      <SpecsModal
        isOpen={showSpecsModal}
        onClose={() => setShowSpecsModal(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
