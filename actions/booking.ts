'use server';

import prisma from '@/lib/prisma';
import { CreateBookingDTO } from '@/types';
import { bookingSchema } from '@/lib/validations';
import { createPaymentTransaction } from '@/lib/payment';
import { sendBookingEmail } from '@/lib/email';

function serializeBooking(b: any) {
  if (!b) return null;
  return {
    ...b,
    totalPrice: b.totalPrice ? Number(b.totalPrice.toString()) : 0,
    payment: b.payment
      ? {
          ...b.payment,
          amount: b.payment.amount ? Number(b.payment.amount.toString()) : 0,
        }
      : null,
    hotel: b.hotel
      ? {
          ...b.hotel,
          price: b.hotel.price ? Number(b.hotel.price.toString()) : 0,
        }
      : null,
    hotelRoom: b.hotelRoom
      ? {
          ...b.hotelRoom,
          pricePerNight: b.hotelRoom.pricePerNight
            ? Number(b.hotelRoom.pricePerNight.toString())
            : 0,
        }
      : null,
    schedule: b.schedule
      ? {
          ...b.schedule,
          package: b.schedule.package
            ? {
                ...b.schedule.package,
                price: b.schedule.package.price
                  ? Number(b.schedule.package.price.toString())
                  : 0,
              }
            : null,
        }
      : null,
  };
}

/**
 * Server Action: Submit Booking (Tour/Umrah atau Hotel) ke Database PostgreSQL
 */
export async function createBookingAction(input: CreateBookingDTO) {
  // Validate input using Zod
  const validationResult = bookingSchema.safeParse(input);
  if (!validationResult.success) {
    return { 
      success: false, 
      error: (validationResult.error as any).errors[0].message 
    };
  }

  const {
    userId,
    itemType,
    title,
    scheduleId,
    hotelId,
    hotelRoomId,
    numParticipants,
    totalPrice,
    paymentMethod,
    proofUrl,
    senderBank,
    senderName,
    guestName,
    guestEmail,
    guestPhone,
    specialRequest,
    checkInDate,
    checkOutDate,
  } = validationResult.data;

  try {
    let finalScheduleId: string | null = null;
    let finalHotelId: string | null = null;
    let finalRoomId: string | null = null;
    let finalUserId: string | null = null;
    let finalTitle = title || (itemType === 'HOTEL' ? 'Reservasi Hotel' : 'Paket Perjalanan');
    let calculatedPrice = totalPrice ? Number(totalPrice) : 0;

    // 0. Verifikasi keberadaan userId jika diberikan
    if (userId) {
      const userExists = await prisma.user.findUnique({ where: { id: userId } });
      if (userExists) {
        finalUserId = userExists.id;
      }
    }

    // 1. Jika tipe TOUR / UMRAH dan ada scheduleId
    if (itemType === 'TOUR' && scheduleId) {
      const schedule = await prisma.packageSchedule.findUnique({
        where: { id: scheduleId },
        include: { package: true },
      });

      if (schedule) {
        finalScheduleId = schedule.id;
        const remainingQuota = schedule.quota - schedule.bookedCount;
        if (schedule.bookedCount + numParticipants > schedule.quota) {
          return {
            success: false,
            error: `Sisa kuota hanya tersedia untuk ${remainingQuota} peserta. Permintaan melebihi batas kuota.`,
          };
        }

        finalTitle = schedule.package.title;
        if (!calculatedPrice) {
          calculatedPrice = Number(schedule.package.price) * numParticipants;
        }

        // Increment booked count
        await prisma.packageSchedule.update({
          where: { id: schedule.id },
          data: {
            bookedCount: { increment: numParticipants },
          },
        });
      }
    } else if (itemType === 'HOTEL' || hotelId || hotelRoomId) {
      // 2. Jika reservasi Hotel
      if (hotelRoomId) {
        const room = await prisma.hotelRoom.findUnique({
          where: { id: hotelRoomId },
          include: { hotel: true },
        });
        if (room) {
          finalRoomId = room.id;
          finalHotelId = room.hotelId;
          finalTitle = `${room.hotel.name} - ${room.name}`;
          if (!calculatedPrice) {
            calculatedPrice = Number(room.pricePerNight) * (numParticipants || 1);
          }
        }
      }

      if (!finalHotelId && hotelId) {
        // Cari hotel berdasarkan id, slug, atau nama
        const hotel = await prisma.hotel.findFirst({
          where: {
            OR: [
              { id: hotelId },
              { slug: hotelId },
              { name: { contains: hotelId, mode: 'insensitive' } },
            ],
          },
        });

        if (hotel) {
          finalHotelId = hotel.id;
          finalTitle = hotel.name;
          if (!calculatedPrice) {
            calculatedPrice = Number(hotel.price);
          }
        } else {
          // Fallback ke hotel pertama di DB jika slug/id tidak cocok agar foreign key selalu valid
          const fallbackHotel = await prisma.hotel.findFirst();
          if (fallbackHotel) {
            finalHotelId = fallbackHotel.id;
          }
        }
      }
    }

    // 3. Generate kode booking unik (Format: SFR-2026-XXXXX)
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const bookingCode = `SFR-2026-${randomSuffix}`;

    // 4. ATOMIC SINGLE-QUERY NESTED WRITE
    // Menghindari PgBouncer interactive transaction timeout (P2028) dan connection reset
    const newBooking = await prisma.booking.create({
      data: {
        bookingCode,
        userId: finalUserId,
        itemType,
        title: finalTitle,
        scheduleId: finalScheduleId,
        hotelId: finalHotelId,
        hotelRoomId: finalRoomId,
        guestName,
        guestEmail,
        guestPhone: guestPhone || '',
        specialRequest: specialRequest || null,
        checkInDate: checkInDate ? new Date(checkInDate) : null,
        checkOutDate: checkOutDate ? new Date(checkOutDate) : null,
        numParticipants,
        totalPrice: calculatedPrice,
        status: 'PENDING',
        payment: {
          create: {
            paymentMethod,
            amount: calculatedPrice,
            status: 'PENDING',
            transactionId: `TXN-${bookingCode}`,
            proofUrl: proofUrl || null,
            senderBank: senderBank || null,
            senderName: senderName || null,
          },
        },
      },
      include: {
        payment: true,
      },
    });

    // Send PENDING Email (Don't wait for it to finish)
    if (guestEmail) {
      sendBookingEmail(
        guestEmail,
        bookingCode,
        finalTitle,
        guestName,
        calculatedPrice,
        'PENDING'
      ).catch((err) => console.error('Error sending PENDING email:', err));
    }

    return {
      success: true,
      data: {
        bookingCode: newBooking.bookingCode,
        bookingId: newBooking.id,
        totalPrice: calculatedPrice,
        status: newBooking.status,
        title: finalTitle,
        guestName,
        guestEmail,
        guestPhone,
        checkInDate,
        checkOutDate,
        paymentMethod,
        proofUrl,
      },
    };
  } catch (error: any) {
    console.error('createBookingAction error:', error);
    try {
      const fs = await import('fs');
      fs.writeFileSync(
        'create_booking_error.log',
        `${new Date().toISOString()}\nError Name: ${error?.name}\nError Code: ${error?.code}\nError Message: ${error?.message}\nMeta: ${JSON.stringify(error?.meta)}\nStack: ${error?.stack}\n`
      );
    } catch (e) {}

    let safeMessage = 'Terjadi kesalahan sistem saat memproses pemesanan. Silakan periksa kembali data Anda.';
    if (error?.message?.includes('Body exceeded') || error?.message?.includes('too large')) {
      safeMessage = 'Ukuran file foto bukti transfer terlalu besar. Harap pilih foto struk yang lebih kecil (maksimal 5MB).';
    } else if (error?.code === 'P2003') {
      safeMessage = 'Data hotel atau jadwal tidak valid di sistem database.';
    } else if (error?.code === 'P2002') {
      safeMessage = 'Kode booking duplikat, silakan klik tombol sekali lagi.';
    } else if (error?.code === 'P2028' || error?.message?.includes('timeout') || error?.message?.includes('ConnectionReset')) {
      safeMessage = 'Koneksi ke database sedang sibuk. Silakan coba klik tombol kembali dalam beberapa detik.';
    } else if (typeof error?.message === 'string' && !error.message.includes('data:image') && error.message.length < 150) {
      safeMessage = error.message;
    }
    return {
      success: false,
      error: safeMessage,
    };
  }
}

/**
 * Server Action: Unggah / Perbarui Bukti Transfer Pembayaran oleh User
 */
export async function uploadPaymentProofAction(
  bookingCode: string,
  proofUrl: string,
  senderBank?: string,
  senderName?: string
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { bookingCode: bookingCode.trim().toUpperCase() },
      include: { payment: true },
    });

    if (!booking) {
      return { success: false, error: 'Pesanan tidak ditemukan.' };
    }

    const updatedPayment = await prisma.payment.upsert({
      where: { bookingId: booking.id },
      create: {
        bookingId: booking.id,
        amount: booking.totalPrice,
        status: 'PENDING',
        proofUrl,
        senderBank: senderBank || null,
        senderName: senderName || null,
      },
      update: {
        proofUrl,
        senderBank: senderBank || undefined,
        senderName: senderName || undefined,
        status: 'PENDING',
      },
    });

    return {
      success: true,
      data: {
        bookingCode: booking.bookingCode,
        proofUrl: updatedPayment.proofUrl,
        senderBank: updatedPayment.senderBank,
        senderName: updatedPayment.senderName,
      },
    };
  } catch (err: any) {
    console.error('uploadPaymentProofAction error:', err);
    return { success: false, error: err.message || 'Gagal menyimpan bukti transfer.' };
  }
}

/**
 * Server Action: Lacak Status Booking dari Database berdasarkan bookingCode
 */
export async function trackBookingAction(bookingCode: string) {
  if (!bookingCode) {
    return { success: false, error: 'Kode booking wajib dimasukkan.' };
  }

  try {
    const cleanCode = bookingCode.trim().toUpperCase();
    const booking = await prisma.booking.findUnique({
      where: { bookingCode: cleanCode },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
        schedule: {
          include: {
            package: {
              include: {
                destination: true,
                images: true,
              },
            },
          },
        },
        hotel: {
          include: {
            images: true,
          },
        },
        hotelRoom: true,
        payment: true,
      },
    });

    if (!booking) {
      return { success: false, error: `Nomor booking "${cleanCode}" tidak ditemukan di sistem database.` };
    }

    return {
      success: true,
      data: serializeBooking(booking),
    };
  } catch (error: any) {
    console.error('trackBookingAction error:', error);
    return {
      success: false,
      error: error?.message || 'Gagal memuat detail reservasi dari database.',
    };
  }
}

/**
 * Server Action: Ambil Riwayat Booking User dari Database
 */
export async function getUserBookingsAction(userIdentifier: { userId?: string; email?: string }) {
  try {
    const whereOr: any[] = [];
    if (userIdentifier.userId) {
      whereOr.push({ userId: userIdentifier.userId });
    }
    if (userIdentifier.email) {
      whereOr.push({ guestEmail: { equals: userIdentifier.email, mode: 'insensitive' } });
      whereOr.push({ user: { email: { equals: userIdentifier.email, mode: 'insensitive' } } });
    }

    if (whereOr.length === 0) {
      return { success: true, data: [] };
    }

    const bookings = await prisma.booking.findMany({
      where: { OR: whereOr },
      include: {
        hotel: { include: { images: true } },
        hotelRoom: true,
        schedule: { include: { package: { include: { images: true } } } },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: bookings.map(serializeBooking),
    };
  } catch (error: any) {
    console.error('getUserBookingsAction error:', error);
    return {
      success: false,
      error: error?.message || 'Gagal memuat riwayat booking dari database.',
      data: [],
    };
  }
}

/**
 * Server Action: Verifikasi atau Konfirmasi Booking oleh Admin
 */
export async function verifyBookingAction(
  bookingId: string,
  supplierBookingCode?: string,
  supplierVoucherUrl?: string
) {
  try {
    const updated = await prisma.$transaction(async (tx: any) => {
      const b = await tx.booking.update({
        where: { id: bookingId },
        data: { 
          status: 'CONFIRMED',
          ...(supplierBookingCode && { supplierBookingCode }),
          ...(supplierVoucherUrl && { supplierVoucherUrl }),
        },
      });

      await tx.payment.upsert({
        where: { bookingId },
        create: {
          bookingId,
          amount: b.totalPrice,
          status: 'SUCCESS',
          paidAt: new Date(),
        },
        update: {
          status: 'SUCCESS',
          paidAt: new Date(),
        },
      });

      return b;
    });

    // Send CONFIRMED / E-Ticket Email
    if (updated.guestEmail && updated.guestName && updated.title) {
      sendBookingEmail(
        updated.guestEmail,
        updated.bookingCode,
        updated.title,
        updated.guestName,
        Number(updated.totalPrice),
        'CONFIRMED'
      ).catch((err) => console.error('Error sending CONFIRMED email:', err));
    }

    return { success: true, data: serializeBooking(updated) };
  } catch (error: any) {
    console.error('verifyBookingAction error:', error);
    return { success: false, error: error?.message || 'Gagal mengonfirmasi booking.' };
  }
}

/**
 * Fetch Public Bank Accounts for Checkout
 */
export async function getPublicBankAccountsAction() {
  try {
    const accounts = await prisma.bankAccount.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' }
    });
    return { success: true, data: JSON.parse(JSON.stringify(accounts)) };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
