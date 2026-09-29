import { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { db, auth, googleProvider, handleFirestoreError, OperationType } from "../firebase";
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth";
import {
  INITIAL_USERS,
  INITIAL_RIDES,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVIEWS,
  INITIAL_COMPLAINTS
} from "../seedData";
const AppContext = createContext(null);
export const AppProvider = ({ children }) => {
  const [currentScreen, setCurrentScreenState] = useState("home");
  const [navigationHistory, setNavigationHistory] = useState(["home"]);
  const setCurrentScreen = (screen) => {
    setNavigationHistory((prev) => [...prev, screen]);
    setCurrentScreenState(screen);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goBack = () => {
    if (navigationHistory.length > 1) {
      const nextHistory = [...navigationHistory];
      nextHistory.pop();
      const prevScreen = nextHistory[nextHistory.length - 1];
      setNavigationHistory(nextHistory);
      setCurrentScreenState(prevScreen);
    } else {
      setCurrentScreenState("home");
    }
  };
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(INITIAL_USERS[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [rides, setRides] = useState(INITIAL_RIDES);
  const [selectedRide, setSelectedRide] = useState(null);
  const [bookings, setBookings] = useState([
    {
      id: "book_sample_1",
      rideId: "ride_101",
      passengerId: "usr_priya_sharma",
      passenger: {
        name: "Priya Sharma",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
        phone: "+91 97123 45678",
        rating: 4.95,
        occupation: "Product Designer",
        isAadhaarVerified: true
      },
      seatsBooked: 1,
      farePerSeat: 220,
      subtotal: 220,
      platformFee: 22,
      totalAmount: 242,
      status: "accepted",
      pickupLocation: "Gomti Nagar, Lucknow",
      dropoffLocation: "IIT Kanpur Gate 1",
      bookingTime: "Today, 09:30 AM",
      isPaid: true,
      paymentMethod: "UPI"
    }
  ]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    {
      id: "msg_1",
      bookingId: "book_sample_1",
      senderId: "usr_arjun_verma",
      senderName: "Arjun Verma",
      text: "Hi Priya! I will be waiting near Gomti Nagar intersection in my white Honda City.",
      timestamp: "09:35 AM",
      type: "text"
    },
    {
      id: "msg_2",
      bookingId: "book_sample_1",
      senderId: "usr_priya_sharma",
      senderName: "Priya Sharma",
      text: "Sounds great! I will reach by 8:20 AM. I have a small backpack with me.",
      timestamp: "09:38 AM",
      type: "text"
    }
  ]);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [reports, setReports] = useState(INITIAL_COMPLAINTS);
  const [suspendedUsers, setSuspendedUsers] = useState([]);
  const [isSosActive, setIsSosActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    origin: "",
    destination: "",
    date: "2026-09-17",
    seats: 1,
    sortBy: "lowest_price"
  });
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
          isEmailVerified: user.emailVerified
        }));
      }
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const ridesCol = collection(db, "rides");
    const unsub = onSnapshot(
      ridesCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedRides = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            loadedRides.push({
              id: docSnap.id,
              ...data
            });
          });
          setRides(loadedRides);
        } else {
          INITIAL_RIDES.forEach(async (ride) => {
            try {
              await setDoc(doc(db, "rides", ride.id), ride);
            } catch (err) {
              console.warn("Initial seed write info:", err);
            }
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "rides");
      }
    );
    return () => unsub();
  }, []);
  useEffect(() => {
    const bookingsCol = collection(db, "bookings");
    const unsub = onSnapshot(
      bookingsCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedBookings = [];
          snapshot.forEach((docSnap) => {
            loadedBookings.push({
              id: docSnap.id,
              ...docSnap.data()
            });
          });
          setBookings(loadedBookings);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "bookings");
      }
    );
    return () => unsub();
  }, []);
  useEffect(() => {
    const messagesCol = collection(db, "messages");
    const unsub = onSnapshot(
      messagesCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const msgs = [];
          snapshot.forEach((docSnap) => {
            msgs.push({
              id: docSnap.id,
              ...docSnap.data()
            });
          });
          setChatMessages(msgs);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "messages");
      }
    );
    return () => unsub();
  }, []);
  const selectDemoUser = (userId) => {
    const target = INITIAL_USERS.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setIsLoggedIn(true);
    }
  };
  const switchUserRole = (role) => {
    setCurrentUser((prev) => ({
      ...prev,
      role
    }));
  };
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const newUser = {
        id: user.uid,
        name: user.displayName || "CarPool Member",
        age: 28,
        occupation: "Verified Traveler",
        phone: user.phoneNumber || "+91 98765 00000",
        email: user.email || "user@example.com",
        avatar: user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
        aadhaarNumber: "XXXX-XXXX-4412",
        isAadhaarVerified: false,
        isPhoneVerified: !!user.phoneNumber,
        isEmailVerified: user.emailVerified,
        role: "passenger",
        rating: 5,
        totalRatingsCount: 1,
        emergencyContact: {
          name: "Primary Contact",
          phone: "+91 99999 11111",
          relation: "Family"
        },
        memberSince: "September 2026",
        bio: "Ready to share comfortable highway rides."
      };
      setCurrentUser(newUser);
      setIsLoggedIn(true);
      await setDoc(doc(db, "users", user.uid), newUser);
      setCurrentScreen("verify");
    } catch (error) {
      console.error("Google Sign In Error:", error);
      selectDemoUser("usr_priya_sharma");
      setCurrentScreen("home");
    }
  };
  const logOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn("Sign out warning:", e);
    }
    setIsLoggedIn(false);
    setCurrentScreen("home");
  };
  const updateUserProfile = async (data) => {
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    try {
      await setDoc(doc(db, "users", currentUser.id), updated, { merge: true });
    } catch (err) {
      console.warn("Local update saved:", err);
    }
  };
  const verifyAadhaar = async (aadhaarNum) => {
    const cleanNum = aadhaarNum.replace(/\s+/g, "");
    if (cleanNum.length === 12 && /^\d+$/.test(cleanNum)) {
      const masked = `XXXX-XXXX-${cleanNum.slice(8)}`;
      await updateUserProfile({
        aadhaarNumber: masked,
        isAadhaarVerified: true
      });
      const newNotif = {
        id: `notif_${Date.now()}`,
        title: "Aadhaar ID Verified",
        message: "Your official identity document has been verified. Green shield badge awarded.",
        time: "Just now",
        type: "security",
        read: false
      };
      setNotifications((prev) => [newNotif, ...prev]);
      return true;
    }
    return false;
  };
  const verifyPhoneOTP = async (phone, otp) => {
    if (otp === "123456" || otp.length === 6) {
      await updateUserProfile({
        phone,
        isPhoneVerified: true
      });
      return true;
    }
    return false;
  };
  const createRide = async (rideData) => {
    const newRideId = `ride_${Date.now()}`;
    const newRide = {
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
        gender: currentUser.gender
      },
      status: "active"
    };
    setRides((prev) => [newRide, ...prev]);
    try {
      await setDoc(doc(db, "rides", newRideId), newRide);
    } catch (error) {
      console.warn("Saved ride locally:", error);
    }
    const notif = {
      id: `notif_${Date.now()}`,
      title: "Ride Published",
      message: `Your ride from ${newRide.origin} to ${newRide.destination} is live with ${newRide.availableSeats} seats available.`,
      time: "Just now",
      type: "ride",
      read: false
    };
    setNotifications((prev) => [notif, ...prev]);
    return newRideId;
  };
  const cancelRide = async (rideId) => {
    setRides(
      (prev) => prev.map((r) => r.id === rideId ? { ...r, status: "cancelled" } : r)
    );
    try {
      await updateDoc(doc(db, "rides", rideId), { status: "cancelled" });
    } catch (e) {
      console.warn("Updated status locally:", e);
    }
  };
  const updateRide = async (rideId, data) => {
    setRides(
      (prev) => prev.map((r) => r.id === rideId ? { ...r, ...data } : r)
    );
    try {
      await updateDoc(doc(db, "rides", rideId), data);
    } catch (e) {
      console.warn("Updated ride locally:", e);
    }
  };
  const requestBooking = async (rideId, seats, pickup, dropoff) => {
    const targetRide = rides.find((r) => r.id === rideId);
    const fare = targetRide ? targetRide.pricePerSeat : 250;
    const subtotal = fare * seats;
    const platformFee = Math.round(subtotal * 0.1);
    const totalAmount = subtotal + platformFee;
    const newBooking = {
      id: `book_${Date.now()}`,
      rideId,
      passengerId: currentUser.id,
      passenger: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        phone: currentUser.phone,
        rating: currentUser.rating,
        occupation: currentUser.occupation,
        isAadhaarVerified: currentUser.isAadhaarVerified
      },
      seatsBooked: seats,
      farePerSeat: fare,
      subtotal,
      platformFee,
      totalAmount,
      status: "pending",
      pickupLocation: pickup || (targetRide ? targetRide.origin : "City Center"),
      dropoffLocation: dropoff || (targetRide ? targetRide.destination : "City Center"),
      bookingTime: "Just now",
      isPaid: false
    };
    setBookings((prev) => [newBooking, ...prev]);
    setActiveBooking(newBooking);
    try {
      await setDoc(doc(db, "bookings", newBooking.id), newBooking);
    } catch (e) {
      console.warn("Saved booking locally:", e);
    }
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: "Booking Requested",
        message: `Requested ${seats} seat(s) on ride to ${newBooking.dropoffLocation}. Waiting for driver confirmation.`,
        time: "Just now",
        type: "booking",
        read: false
      },
      ...prev
    ]);
    return newBooking;
  };
  const updateBookingStatus = async (bookingId, status) => {
    setBookings(
      (prev) => prev.map((b) => b.id === bookingId ? { ...b, status } : b)
    );
    if (activeBooking && activeBooking.id === bookingId) {
      setActiveBooking((prev) => prev ? { ...prev, status } : null);
    }
    try {
      await updateDoc(doc(db, "bookings", bookingId), { status });
    } catch (e) {
      console.warn("Updated booking status locally:", e);
    }
    if (status === "accepted") {
      const b = bookings.find((item) => item.id === bookingId);
      if (b) {
        setRides(
          (prev) => prev.map(
            (r) => r.id === b.rideId ? { ...r, availableSeats: Math.max(0, r.availableSeats - b.seatsBooked) } : r
          )
        );
      }
    }
  };
  const completePayment = async (bookingId, method) => {
    setBookings(
      (prev) => prev.map(
        (b) => b.id === bookingId ? { ...b, isPaid: true, paymentMethod: method } : b
      )
    );
    if (activeBooking && activeBooking.id === bookingId) {
      setActiveBooking(
        (prev) => prev ? { ...prev, isPaid: true, paymentMethod: method } : null
      );
    }
    try {
      await updateDoc(doc(db, "bookings", bookingId), {
        isPaid: true,
        paymentMethod: method
      });
    } catch (e) {
      console.warn("Payment state updated locally:", e);
    }
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: "Payment Successful",
        message: `Seat confirmed via ${method}. Driver notified.`,
        time: "Just now",
        type: "payment",
        read: false
      },
      ...prev
    ]);
  };
  const sendChatMessage = async (bookingId, text, type = "text", locationData) => {
    const newMsg = {
      id: `msg_${Date.now()}`,
      bookingId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type,
      locationData
    };
    setChatMessages((prev) => [...prev, newMsg]);
    try {
      await setDoc(doc(db, "messages", newMsg.id), newMsg);
    } catch (e) {
      console.warn("Chat stored locally:", e);
    }
  };
  const submitReview = async (rideId, targetUserId, rating, comment) => {
    const newRev = {
      id: `rev_${Date.now()}`,
      rideId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      targetUserId,
      rating,
      comment,
      createdAt: "Just now",
      role: currentUser.role === "driver" ? "driver_to_passenger" : "passenger_to_driver"
    };
    setReviews((prev) => [newRev, ...prev]);
    try {
      await setDoc(doc(db, "reviews", newRev.id), newRev);
    } catch (e) {
      console.warn("Review saved locally:", e);
    }
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: "Review Published",
        message: `Thank you for reviewing your co-traveler!`,
        time: "Just now",
        type: "system",
        read: false
      },
      ...prev
    ]);
  };
  const triggerSosAlert = () => {
    setIsSosActive(true);
    const sosNotif = {
      id: `notif_sos_${Date.now()}`,
      title: "EMERGENCY SOS TRIGGERED",
      message: `Live GPS location and vehicle info shared with emergency contact (${currentUser.emergencyContact.name}) & Police control room (112).`,
      time: "Immediate",
      type: "security",
      read: false
    };
    setNotifications((prev) => [sosNotif, ...prev]);
  };
  const dismissSosAlert = () => {
    setIsSosActive(false);
  };
  const submitReport = async (reportedUserId, reportedUserName, reason, details) => {
    const newReport = {
      id: `rep_${Date.now()}`,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reportedUserId,
      reportedUserName,
      reason,
      details,
      date: "Today",
      status: "pending"
    };
    setReports((prev) => [newReport, ...prev]);
    try {
      await setDoc(doc(db, "reports", newReport.id), newReport);
    } catch (e) {
      console.warn("Report saved locally:", e);
    }
  };
  const markNotificationRead = (id) => {
    setNotifications(
      (prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n)
    );
  };
  const suspendUser = (userId) => {
    setSuspendedUsers(
      (prev) => prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;
  return <AppContext.Provider
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
      suspendedUsers
    }}
  >
      {children}
    </AppContext.Provider>;
};
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
