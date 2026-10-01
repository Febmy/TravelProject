'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitReviewAction(userId: string, itemId: string, itemType: 'TOUR' | 'HOTEL', rating: number, comment: string) {
  if (!userId || !itemId || rating < 1 || rating > 5) {
    return { success: false, error: 'Data review tidak valid.' };
  }

  try {
    // 1. Check if user actually booked and completed this item
    const hasBooked = await prisma.booking.findFirst({
      where: {
        userId,
        status: 'COMPLETED', // Only completed bookings can be reviewed
        ...(itemType === 'TOUR' 
          ? { schedule: { packageId: itemId } }
          : { hotelId: itemId }
        )
      }
    });

    if (!hasBooked) {
      return { success: false, error: 'Anda hanya bisa memberikan ulasan setelah menyelesaikan perjalanan/menginap.' };
    }

    // 2. Create the review
    await prisma.review.create({
      data: {
        userId,
        rating,
        comment,
        ...(itemType === 'TOUR' ? { packageId: itemId } : { hotelId: itemId })
      }
    });

    // 3. Update the average rating on the item
    const allReviews = await prisma.review.findMany({
      where: {
        ...(itemType === 'TOUR' ? { packageId: itemId } : { hotelId: itemId })
      },
      select: { rating: true }
    });

    const averageRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;

    if (itemType === 'TOUR') {
      await prisma.package.update({
        where: { id: itemId },
        data: { rating: averageRating }
      });
    } else {
      await prisma.hotel.update({
        where: { id: itemId },
        data: { rating: averageRating }
      });
    }

    revalidatePath('/');
    return { success: true, message: 'Ulasan berhasil ditambahkan!' };
  } catch (error: any) {
    console.error('Submit Review Error:', error);
    return { success: false, error: 'Gagal mengirim ulasan.' };
  }
}
