import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { mapPaymentStatus, verifyMidtransSignature } from '@/lib/payment';
import { PaymentWebhookPayload } from '@/types';

/**
 * Webhook Endpoint: Otomatisasi Sinkronisasi Status Pembayaran Gateway (Midtrans/Xendit)
 * POST /api/webhooks/payment
 */
export async function POST(req: NextRequest) {
  try {
    const body: PaymentWebhookPayload = await req.json();

    const orderId = body.order_id; // Format: TRV-2026-XXXXX
    const transactionStatus = body.transaction_status;
    const transactionId = body.transaction_id;
    const paymentType = body.payment_type || 'BANK_TRANSFER';

    if (!orderId || !transactionStatus) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload: missing order_id or transaction_status' },
        { status: 400 }
      );
    }

    // 1. Tentukan status lokal yang sesuai
    const { paymentStatus, bookingStatus } = mapPaymentStatus(transactionStatus);

    // 2. Jalankan update transaksional di database
    const updated = await prisma.$transaction(async (tx: any) => {
      // Cari data booking berdasarkan kode unik
      const booking = await tx.booking.findUnique({
        where: { bookingCode: orderId },
        include: { payment: true },
      });

      if (!booking) {
        throw new Error(`Booking dengan kode ${orderId} tidak ditemukan.`);
      }

      // Update status Booking
      const updatedBooking = await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: bookingStatus,
        },
      });

      // Update status Payment
      const updatedPayment = await tx.payment.upsert({
        where: { bookingId: booking.id },
        create: {
          bookingId: booking.id,
          amount: booking.totalPrice,
          paymentMethod: paymentType,
          status: paymentStatus,
          transactionId: transactionId || null,
          paidAt: paymentStatus === 'SUCCESS' ? new Date() : null,
        },
        update: {
          status: paymentStatus,
          paymentMethod: paymentType,
          transactionId: transactionId || undefined,
          paidAt: paymentStatus === 'SUCCESS' ? new Date() : undefined,
        },
      });

      // Jika pembayaran gagal/dibatalkan/kedaluwarsa, kembalikan kuota kursi jika reservasi paket
      if (bookingStatus === 'CANCELLED' && booking.status !== 'CANCELLED' && booking.scheduleId) {
        await tx.packageSchedule.update({
          where: { id: booking.scheduleId },
          data: {
            bookedCount: {
              decrement: booking.numParticipants,
            },
          },
        });
      }

      return { booking: updatedBooking, payment: updatedPayment };
    });

    console.log(
      `[WEBHOOK PAYMENT] Order ${orderId} berhasil disinkronkan: Payment=${updated.payment.status}, Booking=${updated.booking.status}`
    );

    return NextResponse.json({
      success: true,
      message: `Notification processed for order ${orderId}`,
      data: {
        bookingCode: updated.booking.bookingCode,
        bookingStatus: updated.booking.status,
        paymentStatus: updated.payment.status,
      },
    });
  } catch (error: any) {
    console.error('[WEBHOOK PAYMENT ERROR]', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Internal webhook error occurred',
      },
      { status: 500 }
    );
  }
}
