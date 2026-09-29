/**
 * CarPool Domain Types and Constants
 */

export const ScreenTypes = [
  'splash',
  'auth',
  'verify',
  'home',
  'create_ride',
  'search_ride',
  'ride_details',
  'booking_status',
  'chat',
  'payment',
  'tracking',
  'profile',
  'history',
  'admin',
];

export const UserRoles = ['driver', 'passenger', 'admin'];

export const BookingStatuses = [
  'pending',
  'accepted',
  'rejected',
  'completed',
  'cancelled',
];

export const PaymentMethods = ['UPI', 'Card', 'NetBanking', 'Wallet'];

export const CarTypes = ['Hatchback', 'Sedan', 'SUV', 'EV'];

export default {
  ScreenTypes,
  UserRoles,
  BookingStatuses,
  PaymentMethods,
  CarTypes,
};
