'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleWishlistAction(userId: string, itemId: string, itemType: 'TOUR' | 'HOTEL') {
  if (!userId || !itemId) return { success: false, error: 'Data tidak valid' };

  try {
    const existing = await prisma.wishlist.findFirst({
      where: {
        userId,
        ...(itemType === 'TOUR' ? { packageId: itemId } : { hotelId: itemId })
      }
    });

    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } });
      revalidatePath('/'); // or specific paths
      return { success: true, action: 'removed' };
    } else {
      await prisma.wishlist.create({
        data: {
          userId,
          ...(itemType === 'TOUR' ? { packageId: itemId } : { hotelId: itemId })
        }
      });
      revalidatePath('/');
      return { success: true, action: 'added' };
    }
  } catch (error: any) {
    console.error('Toggle Wishlist Error:', error);
    return { success: false, error: 'Gagal mengubah wishlist' };
  }
}

export async function getUserWishlistAction(userId: string) {
  if (!userId) return { success: false, data: [] };
  
  try {
    const wishlists = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        package: {
          include: { images: true, destination: true }
        },
        hotel: {
          include: { images: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return { success: true, data: wishlists };
  } catch (error) {
    return { success: false, error: 'Gagal memuat wishlist', data: [] };
  }
}
