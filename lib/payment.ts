import crypto from 'crypto';
import { PaymentStatus, BookingStatus } from '@/types';

export const PAYMENT_CONFIG = {
  serverKey: process.env.PAYMENT_GATEWAY_SERVER_KEY || 'SB-Mid-server-demo-key-12345',
  clientKey: process.env.PAYMENT_GATEWAY_CLIENT_KEY || 'SB-Mid-client-demo-key-12345',
  isProduction: process.env.NODE_ENV === 'production',
  snapUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions',
};

export interface CreateSnapTransactionParams {
  bookingCode: string;
  grossAmount: number;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  itemDetails?: {
    id: string;
    price: number;
    quantity: number;
    name: string;
  }[];
}

/**
 * Buat Snap Token / Redirect URL pembayaran untuk Midtrans / Xendit
 */
export async function createPaymentTransaction(params: CreateSnapTransactionParams) {
  // Jika di mode demo / sandbox tanpa API live aktif, kembalikan mock session aman
  if (!process.env.PAYMENT_GATEWAY_SERVER_KEY || process.env.PAYMENT_GATEWAY_SERVER_KEY.includes('demo')) {
    return {
      token: `MOCK-SNAP-TOKEN-${params.bookingCode}-${Date.now()}`,
      redirectUrl: `https://app.sandbox.midtrans.com/snap/v2/vtweb/mock-${params.bookingCode}`,
      bookingCode: params.bookingCode,
    };
  }

  const authString = Buffer.from(`${PAYMENT_CONFIG.serverKey}:`).toString('base64');

  const payload = {
    transaction_details: {
      order_id: params.bookingCode,
      gross_amount: Math.round(params.grossAmount),
    },
    customer_details: {
      first_name: params.customer.name,
      email: params.customer.email,
      phone: params.customer.phone || '081234567890',
    },
    item_details: params.itemDetails,
  };

  const response = await fetch(PAYMENT_CONFIG.snapUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${authString}`,
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Payment Gateway Error: ${errorData?.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    token: data.token,
    redirectUrl: data.redirect_url,
    bookingCode: params.bookingCode,
  };
}

/**
 * Validasi SHA512 signature dari webhook Midtrans
 */
export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  receivedSignature: string
): boolean {
  const hash = crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${PAYMENT_CONFIG.serverKey}`)
    .digest('hex');

  return hash === receivedSignature;
}

/**
 * Petakan transaction_status dari payment gateway ke status lokal
 */
export function mapPaymentStatus(transactionStatus: string): {
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
} {
  switch (transactionStatus.toLowerCase()) {
    case 'capture':
    case 'settlement':
    case 'success':
      return { paymentStatus: 'SUCCESS', bookingStatus: 'CONFIRMED' };
    case 'pending':
      return { paymentStatus: 'PENDING', bookingStatus: 'PENDING' };
    case 'deny':
    case 'cancel':
      return { paymentStatus: 'FAILED', bookingStatus: 'CANCELLED' };
    case 'expire':
      return { paymentStatus: 'EXPIRED', bookingStatus: 'CANCELLED' };
    default:
      return { paymentStatus: 'PENDING', bookingStatus: 'PENDING' };
  }
}
