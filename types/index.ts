export type Role = 'USER' | 'ADMIN';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'EXPIRED' | 'FAILED';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  phoneNumber?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  city: string;
  country: string;
  description?: string | null;
  imageUrl?: string | null;
  packages?: Package[];
  createdAt: Date;
}

export interface PackageItineraryDay {
  day: number;
  title: string;
  description: string;
  activities?: string[];
}

export interface Package {
  id: string;
  destinationId: string;
  title: string;
  slug: string;
  description: string;
  durationDays: number;
  price: number | string;
  itinerary?: PackageItineraryDay[] | any;
  includes: string[];
  excludes: string[];
  rating: number;
  isActive: boolean;
  destination?: Destination;
  images?: PackageImage[];
  schedules?: PackageSchedule[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PackageImage {
  id: string;
  packageId: string;
  imageUrl: string;
  isPrimary: boolean;
}

export interface PackageSchedule {
  id: string;
  packageId: string;
  startDate: Date;
  endDate: Date;
  quota: number;
  bookedCount: number;
  package?: Package;
  bookings?: Booking[];
}

export interface Booking {
  id: string;
  bookingCode: string;
  userId?: string | null;
  itemType?: string;
  title?: string | null;
  scheduleId?: string | null;
  hotelId?: string | null;
  hotelRoomId?: string | null;
  guestName?: string | null;
  guestEmail?: string | null;
  guestPhone?: string | null;
  specialRequest?: string | null;
  checkInDate?: Date | null;
  checkOutDate?: Date | null;
  numParticipants: number;
  totalPrice: number | string;
  status: BookingStatus;
  user?: User | null;
  schedule?: PackageSchedule | null;
  hotel?: any | null;
  hotelRoom?: any | null;
  payment?: Payment | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  bookingId: string;
  paymentMethod?: string | null;
  amount: number | string;
  status: PaymentStatus;
  transactionId?: string | null;
  proofUrl?: string | null;
  senderBank?: string | null;
  senderName?: string | null;
  paidAt?: Date | null;
  booking?: Booking;
  createdAt: Date;
}

// DTOs for Server Actions
export interface CreateBookingDTO {
  userId?: string;
  itemType?: 'TOUR' | 'HOTEL';
  title?: string;
  scheduleId?: string;
  hotelId?: string;
  hotelRoomId?: string;
  numParticipants?: number;
  totalPrice?: number;
  paymentMethod?: string;
  proofUrl?: string;
  senderBank?: string;
  senderName?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequest?: string;
  checkInDate?: string;
  checkOutDate?: string;
}


export interface TourFilterParams {
  destinationId?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  minDuration?: number;
  maxDuration?: number;
  searchQuery?: string;
}

// Payment Gateway (Midtrans/Xendit) Webhook Payload
export interface PaymentWebhookPayload {
  order_id: string;          // e.g. bookingCode: TRV-2026-001
  transaction_id: string;    // Payment gateway transaction ref
  transaction_status: string; // 'settlement' | 'capture' | 'pending' | 'expire' | 'cancel'
  payment_type?: string;
  gross_amount: string;
  status_code?: string;
}
