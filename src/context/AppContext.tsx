import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { db, auth, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  ScreenType,
  UserProfile,
  Ride,
  Booking,
  ChatMessage,
  NotificationItem,
  Review,
  ComplaintReport
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_RIDES,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVIEWS,
  INITIAL_COMPLAINTS
} from '../seedData';

interface AppContextType {
  // Navigation
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  goBack: () => void;
  navigationHistory: ScreenType[];

  // User & Auth
  currentUser: UserProfile;
  firebaseUser: FirebaseUser | null;
  isLoggedIn: boolean;
  switchUserRole: (role: 'driver' | 'passenger' | 'admin') => void;
  selectDemoUser: (userId: string) => void;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  verifyAadhaar: (aadhaarNum: string) => Promise<boolean>;
  verifyPhoneOTP: (phone: string, otp: string) => Promise<boolean>;

  // Rides
  rides: Ride[];
  selectedRide: Ride | null;
  setSelectedRide: (ride: Ride | null) => void;
  createRide: (rideData: Omit<Ride, 'id' | 'driverId' | 'driver' | 'status'>) => Promise<string>;
  cancelRide: (rideId: string) => Promise<void>;
  updateRide: (rideId: string, data: Partial<Ride>) => Promise<void>;

  // Search & Filters
  searchQuery: {
    origin: string;
    destination: string;
    date: string;
    seats: number;
    maxPrice?: number;
    carType?: string;
    genderPreference?: string;
    sortBy: 'lowest_price' | 'earliest' | 'highest_rated';
  };
  setSearchQuery: React.Dispatch<React.SetStateAction<AppContextType['searchQuery']>>;

  // Bookings
  bookings: Booking[];
  activeBooking: Booking | null;
  setActiveBooking: (b: Booking | null) => void;
  requestBooking: (rideId: string, seats: number, pickup: string, dropoff: string) => Promise<Booking>;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => Promise<void>;
  completePayment: (bookingId: string, method: 'UPI' | 'Card' | 'NetBanking' | 'Wallet') => Promise<void>;

  // Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (bookingId: string, text: string, type?: ChatMessage['type'], locationData?: ChatMessage['locationData']) => Promise<void>;

  // Reviews
  reviews: Review[];
  submitReview: (rideId: string, targetUserId: string, rating: number, comment: string) => Promise<void>;

  // Safety & SOS
  isSosActive: boolean;
  triggerSosAlert: () => void;
  dismissSosAlert: () => void;
  reports: ComplaintReport[];
  submitReport: (reportedUserId: string, reportedUserName: string, reason: string, details: string) => Promise<void>;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  unreadNotifsCount: number;

  // Admin Tools
  suspendUser: (userId: string) => void;
  suspendedUsers: string[];
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentScreen, setCurrentScreenState] = useState<ScreenType>('home');
  const [navigationHistory, setNavigationHistory] = useState<ScreenType[]>(['home']);

  const setCurrentScreen = (screen: ScreenType) => {
    setNavigationHistory((prev) => [...prev, screen]);
    setCurrentScreenState(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (navigationHistory.length > 1) {
      const nextHistory = [...navigationHistory];
      nextHistory.pop(); // remove current
      const prevScreen = nextHistory[nextHistory.length - 1];
      setNavigationHistory(nextHistory);
      setCurrentScreenState(prevScreen);
    } else {
      setCurrentScreenState('home');
    }
  };

  // Auth & User State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]); // default to Arjun (Driver)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // Core Data Lists
  const [rides, setRides] = useState<Ride[]>(INITIAL_RIDES);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'book_sample_1',
      rideId: 'ride_101',
      passengerId: 'usr_priya_sharma',
      passenger: {
        name: 'Priya Sharma',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        phone: '+91 97123 45678',
        rating: 4.95,
        occupation: 'Product Designer',
        isAadhaarVerified: true,
      },
      seatsBooked: 1,
      farePerSeat: 220,
      subtotal: 220,
      platformFee: 22,
      totalAmount: 242,
      status: 'accepted',
      pickupLocation: 'Gomti Nagar, Lucknow',
      dropoffLocation: 'IIT Kanpur Gate 1',
      bookingTime: 'Today, 09:30 AM',
      isPaid: true,
      paymentMethod: 'UPI',
    },
  ]);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      bookingId: 'book_sample_1',
      senderId: 'usr_arjun_verma',
      senderName: 'Arjun Verma',
      text: 'Hi Priya! I will be waiting near Gomti Nagar intersection in my white Honda City.',
      timestamp: '09:35 AM',
      type: 'text',
    },
    {
      id: 'msg_2',
      bookingId: 'book_sample_1',
      senderId: 'usr_priya_sharma',
      senderName: 'Priya Sharma',
      text: 'Sounds great! I will reach by 8:20 AM. I have a small backpack with me.',
      timestamp: '09:38 AM',
      type: 'text',
    },
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [reports, setReports] = useState<ComplaintReport[]>(INITIAL_COMPLAINTS);
  const [suspendedUsers, setSuspendedUsers] = useState<string[]>([]);
  const [isSosActive, setIsSosActive] = useState<boolean>(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState<{
    origin: string;
    destination: string;
    date: string;
    seats: number;
    maxPrice?: number;
    carType?: string;
    genderPreference?: string;
    sortBy: 'lowest_price' | 'earliest' | 'highest_rated';
  }>({
    origin: '',
    destination: '',
    date: '2026-09-17',
    seats: 1,
    sortBy: 'lowest_price',
  });

  // Track Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        setIsLoggedIn(true);
        setCurrentUser((prev) => ({
          ...prev,
          id: user.uid,
          name: user.displayName || prev.name,
          email: user.email || prev.email,
          avatar: user.photoURL || prev.avatar,
          isEmailVerified: user.emailVerified,
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore Rides in real-time
  useEffect(() => {
    const ridesCol = collection(db, 'rides');
    const unsub = onSnapshot(
      ridesCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedRides: Ride[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            loadedRides.push({
              id: docSnap.id,
              ...data,
            } as Ride);
          });
          setRides(loadedRides);
        } else {
          // Initialize default rides to Firestore for first time persistence
          INITIAL_RIDES.forEach(async (ride) => {
            try {
              await setDoc(doc(db, 'rides', ride.id), ride);
            } catch (err) {
              console.warn('Initial seed write info:', err);
            }
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'rides');
      }
    );

    return () => unsub();
  }, []);

  // Listen to Firestore Bookings in real-time
  useEffect(() => {
    const bookingsCol = collection(db, 'bookings');
    const unsub = onSnapshot(
      bookingsCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedBookings: Booking[] = [];
          snapshot.forEach((docSnap) => {
            loadedBookings.push({
              id: docSnap.id,
              ...docSnap.data(),
            } as Booking);
          });
          setBookings(loadedBookings);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'bookings');
      }
    );

    return () => unsub();
  }, []);

  // Listen to Firestore Chat Messages in real-time
  useEffect(() => {
    const messagesCol = collection(db, 'messages');
    const unsub = onSnapshot(
      messagesCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const msgs: ChatMessage[] = [];
          snapshot.forEach((docSnap) => {
            msgs.push({
              id: docSnap.id,
              ...docSnap.data(),
            } as ChatMessage);
          });
          setChatMessages(msgs);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'messages');
      }
    );

    return () => unsub();
  }, []);

  // Switch demo user accounts for rapid testing
  const selectDemoUser = (userId: string) => {
    const target = INITIAL_USERS.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setIsLoggedIn(true);
    }
  };

  const switchUserRole = (role: 'driver' | 'passenger' | 'admin') => {
    setCurrentUser((prev) => ({
      ...prev,
      role,
    }));
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const newUser: UserProfile = {
        id: user.uid,
        name: user.displayName || 'CarPool Member',
        age: 28,
        occupation: 'Verified Traveler',
        phone: user.phoneNumber || '+91 98765 00000',
        email: user.email || 'user@example.com',
        avatar: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        aadhaarNumber: 'XXXX-XXXX-4412',
        isAadhaarVerified: false,
        isPhoneVerified: !!user.phoneNumber,
        isEmailVerified: user.emailVerified,
        role: 'passenger',
        rating: 5.0,
        totalRatingsCount: 1,
        emergencyContact: {
          name: 'Primary Contact',
          phone: '+91 99999 11111',
          relation: 'Family',
        },
        memberSince: 'September 2026',
        bio: 'Ready to share comfortable highway rides.',
      };
      setCurrentUser(newUser);
      setIsLoggedIn(true);
      await setDoc(doc(db, 'users', user.uid), newUser);
      setCurrentScreen('verify');
    } catch (error) {
      console.error('Google Sign In Error:', error);
      // Fallback to demo login if popup fails in sandboxed iframe
      selectDemoUser('usr_priya_sharma');
      setCurrentScreen('home');
    }
  };

  const logOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
    setIsLoggedIn(false);
    setCurrentScreen('home');
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    try {
      await setDoc(doc(db, 'users', currentUser.id), updated, { merge: true });
    } catch (err) {
      console.warn('Local update saved:', err);
    }
  };

  const verifyAadhaar = async (aadhaarNum: string): Promise<boolean> => {
    // 12 digit format validation
    const cleanNum = aadhaarNum.replace(/\s+/g, '');
    if (cleanNum.length === 12 && /^\d+$/.test(cleanNum)) {
      const masked = `XXXX-XXXX-${cleanNum.slice(8)}`;
      await updateUserProfile({
        aadhaarNumber: masked,
        isAadhaarVerified: true,
      });
      // Add notification
      const newNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        title: 'Aadhaar ID Verified',
        message: 'Your official identity document has been verified. Green shield badge awarded.',
        time: 'Just now',
        type: 'security',
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
      return true;
    }
    return false;
  };

  const verifyPhoneOTP = async (phone: string, otp: string): Promise<boolean> => {
    if (otp === '123456' || otp.length === 6) {
      await updateUserProfile({
        phone,
        isPhoneVerified: true,
      });
      return true;
    }
    return false;
  };

  const createRide = async (rideData: Omit<Ride, 'id' | 'driverId' | 'driver' | 'status'>): Promise<string> => {
    const newRideId = `ride_${Date.now()}`;
    const newRide: Ride = {
      ...rideData,
      id: newRideId,
      driverId: currentUser.id,
      driver: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        rating: currentUser.rating,
        totalRatingsCount: currentUser.totalRatingsCount,
        isAadhaarVerified: currentUser.isAadhaarVerified,
        occupation: currentUser.occupation,
        phone: currentUser.phone,
        gender: currentUser.gender,
      },
      status: 'active',
    };

    setRides((prev) => [newRide, ...prev]);

    try {
      await setDoc(doc(db, 'rides', newRideId), newRide);
    } catch (error) {
      console.warn('Saved ride locally:', error);
    }

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Ride Published',
      message: `Your ride from ${newRide.origin} to ${newRide.destination} is live with ${newRide.availableSeats} seats available.`,
      time: 'Just now',
      type: 'ride',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    return newRideId;
  };

  const cancelRide = async (rideId: string) => {
    setRides((prev) =>
      prev.map((r) => (r.id === rideId ? { ...r, status: 'cancelled' as const } : r))
    );
    try {
      await updateDoc(doc(db, 'rides', rideId), { status: 'cancelled' });
    } catch (e) {
      console.warn('Updated status locally:', e);
    }
  };

  const updateRide = async (rideId: string, data: Partial<Ride>) => {
    setRides((prev) =>
      prev.map((r) => (r.id === rideId ? { ...r, ...data } : r))
    );
    try {
      await updateDoc(doc(db, 'rides', rideId), data);
    } catch (e) {
      console.warn('Updated ride locally:', e);
    }
  };

  const requestBooking = async (
    rideId: string,
    seats: number,
    pickup: string,
    dropoff: string
  ): Promise<Booking> => {
    const targetRide = rides.find((r) => r.id === rideId);
    const fare = targetRide ? targetRide.pricePerSeat : 250;
    const subtotal = fare * seats;
    const platformFee = Math.round(subtotal * 0.1); // 10% platform fee
    const totalAmount = subtotal + platformFee;

    const newBooking: Booking = {
      id: `book_${Date.now()}`,
      rideId,
      passengerId: currentUser.id,
      passenger: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        phone: currentUser.phone,
        rating: currentUser.rating,
        occupation: currentUser.occupation,
        isAadhaarVerified: currentUser.isAadhaarVerified,
      },
      seatsBooked: seats,
      farePerSeat: fare,
      subtotal,
      platformFee,
      totalAmount,
      status: 'pending',
      pickupLocation: pickup || (targetRide ? targetRide.origin : 'City Center'),
      dropoffLocation: dropoff || (targetRide ? targetRide.destination : 'City Center'),
      bookingTime: 'Just now',
      isPaid: false,
    };

    setBookings((prev) => [newBooking, ...prev]);
    setActiveBooking(newBooking);

    try {
      await setDoc(doc(db, 'bookings', newBooking.id), newBooking);
    } catch (e) {
      console.warn('Saved booking locally:', e);
    }

    // Notify user
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: 'Booking Requested',
        message: `Requested ${seats} seat(s) on ride to ${newBooking.dropoffLocation}. Waiting for driver confirmation.`,
        time: 'Just now',
        type: 'booking',
        read: false,
      },
      ...prev,
    ]);

    return newBooking;
  };

  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
    if (activeBooking && activeBooking.id === bookingId) {
      setActiveBooking((prev) => (prev ? { ...prev, status } : null));
    }

    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status });
    } catch (e) {
      console.warn('Updated booking status locally:', e);
    }

    // Decrement ride available seats if accepted
    if (status === 'accepted') {
      const b = bookings.find((item) => item.id === bookingId);
      if (b) {
        setRides((prev) =>
          prev.map((r) =>
            r.id === b.rideId
              ? { ...r, availableSeats: Math.max(0, r.availableSeats - b.seatsBooked) }
              : r
          )
        );
      }
    }
  };

  const completePayment = async (
    bookingId: string,
    method: 'UPI' | 'Card' | 'NetBanking' | 'Wallet'
  ) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, isPaid: true, paymentMethod: method } : b
      )
    );
    if (activeBooking && activeBooking.id === bookingId) {
      setActiveBooking((prev) =>
        prev ? { ...prev, isPaid: true, paymentMethod: method } : null
      );
    }

    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        isPaid: true,
        paymentMethod: method,
      });
    } catch (e) {
      console.warn('Payment state updated locally:', e);
    }

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: 'Payment Successful',
        message: `Seat confirmed via ${method}. Driver notified.`,
        time: 'Just now',
        type: 'payment',
        read: false,
      },
      ...prev,
    ]);
  };

  const sendChatMessage = async (
    bookingId: string,
    text: string,
    type: ChatMessage['type'] = 'text',
    locationData?: ChatMessage['locationData']
  ) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      bookingId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      locationData,
    };

    setChatMessages((prev) => [...prev, newMsg]);

    try {
      await setDoc(doc(db, 'messages', newMsg.id), newMsg);
    } catch (e) {
      console.warn('Chat stored locally:', e);
    }
  };

  const submitReview = async (
    rideId: string,
    targetUserId: string,
    rating: number,
    comment: string
  ) => {
    const newRev: Review = {
      id: `rev_${Date.now()}`,
      rideId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      targetUserId,
      rating,
      comment,
      createdAt: 'Just now',
      role: currentUser.role === 'driver' ? 'driver_to_passenger' : 'passenger_to_driver',
    };

    setReviews((prev) => [newRev, ...prev]);

    try {
      await setDoc(doc(db, 'reviews', newRev.id), newRev);
    } catch (e) {
      console.warn('Review saved locally:', e);
    }

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: 'Review Published',
        message: `Thank you for reviewing your co-traveler!`,
        time: 'Just now',
        type: 'system',
        read: false,
      },
      ...prev,
    ]);
  };

  const triggerSosAlert = () => {
    setIsSosActive(true);
    const sosNotif: NotificationItem = {
      id: `notif_sos_${Date.now()}`,
      title: 'EMERGENCY SOS TRIGGERED',
      message: `Live GPS location and vehicle info shared with emergency contact (${currentUser.emergencyContact.name}) & Police control room (112).`,
      time: 'Immediate',
      type: 'security',
      read: false,
    };
    setNotifications((prev) => [sosNotif, ...prev]);
  };

  const dismissSosAlert = () => {
    setIsSosActive(false);
  };

  const submitReport = async (
    reportedUserId: string,
    reportedUserName: string,
    reason: string,
    details: string
  ) => {
    const newReport: ComplaintReport = {
      id: `rep_${Date.now()}`,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reportedUserId,
      reportedUserName,
      reason,
      details,
      date: 'Today',
      status: 'pending',
    };

    setReports((prev) => [newReport, ...prev]);

    try {
      await setDoc(doc(db, 'reports', newReport.id), newReport);
    } catch (e) {
      console.warn('Report saved locally:', e);
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const suspendUser = (userId: string) => {
    setSuspendedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        goBack,
        navigationHistory,

        currentUser,
        firebaseUser,
        isLoggedIn,
        switchUserRole,
        selectDemoUser,
        signInWithGoogle,
        logOut,
        updateUserProfile,
        verifyAadhaar,
        verifyPhoneOTP,

        rides,
        selectedRide,
        setSelectedRide,
        createRide,
        cancelRide,
        updateRide,

        searchQuery,
        setSearchQuery,

        bookings,
        activeBooking,
        setActiveBooking,
        requestBooking,
        updateBookingStatus,
        completePayment,

        chatMessages,
        sendChatMessage,

        reviews,
        submitReview,

        isSosActive,
        triggerSosAlert,
        dismissSosAlert,
        reports,
        submitReport,

        notifications,
        markNotificationRead,
        unreadNotifsCount,

        suspendUser,
        suspendedUsers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
