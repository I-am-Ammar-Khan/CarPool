export type ScreenType =
  | 'splash'
  | 'auth'
  | 'verify'
  | 'home'
  | 'create_ride'
  | 'search_ride'
  | 'ride_details'
  | 'booking_status'
  | 'chat'
  | 'payment'
  | 'tracking'
  | 'profile'
  | 'history'
  | 'admin';

export type UserRole = 'driver' | 'passenger' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  occupation: string;
  phone: string;
  email: string;
  avatar: string;
  aadhaarNumber: string;
  isAadhaarVerified: boolean;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  role: UserRole;
  rating: number;
  totalRatingsCount: number;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  drivingLicense?: {
    licenseNumber: string;
    isVerified: boolean;
    photoUrl?: string;
  };
  car?: {
    model: string;
    plate: string;
    color: string;
    totalSeats: number;
    photoUrl: string;
    carType: 'Hatchback' | 'Sedan' | 'SUV' | 'EV';
  };
  memberSince: string;
  bio?: string;
  gender?: 'Male' | 'Female' | 'Other';
}

export interface RideStop {
  city: string;
  landmark?: string;
  estimatedArrivalMinutes?: number;
}

export interface Ride {
  id: string;
  driverId: string;
  driver: {
    name: string;
    avatar: string;
    rating: number;
    totalRatingsCount: number;
    isAadhaarVerified: boolean;
    occupation: string;
    phone: string;
    gender?: 'Male' | 'Female' | 'Other';
  };
  car: {
    model: string;
    plate: string;
    color: string;
    carType: 'Hatchback' | 'Sedan' | 'SUV' | 'EV';
    photoUrl: string;
  };
  origin: string;
  destination: string;
  intermediateStops: RideStop[];
  date: string; // YYYY-MM-DD
  departureTime: string; // HH:MM AM/PM
  totalSeats: number;
  availableSeats: number;
  pricePerSeat: number;
  notes?: string;
  status: 'active' | 'in_progress' | 'completed' | 'cancelled';
  amenities?: string[];
}

export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  rideId: string;
  passengerId: string;
  passenger: {
    name: string;
    avatar: string;
    phone: string;
    rating: number;
    occupation: string;
    isAadhaarVerified: boolean;
  };
  seatsBooked: number;
  farePerSeat: number;
  subtotal: number;
  platformFee: number;
  totalAmount: number;
  status: BookingStatus;
  pickupLocation: string;
  dropoffLocation: string;
  bookingTime: string;
  paymentMethod?: 'UPI' | 'Card' | 'NetBanking' | 'Wallet';
  isPaid: boolean;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  type?: 'text' | 'location' | 'system' | 'pickup_pin';
  locationData?: {
    address: string;
    lat: number;
    lng: number;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'booking' | 'payment' | 'ride' | 'security' | 'system';
  read: boolean;
  targetId?: string;
}

export interface Review {
  id: string;
  rideId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  targetUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
  role: 'passenger_to_driver' | 'driver_to_passenger';
}

export interface ComplaintReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedUserId: string;
  reportedUserName: string;
  reason: string;
  details: string;
  date: string;
  status: 'pending' | 'resolved' | 'dismissed';
}
