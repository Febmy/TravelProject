'use server';

import prisma from '@/lib/prisma';
import { serializeToPlain } from '@/lib/serialize';

export async function getHotelsAction(filters?: { location?: string, minPrice?: number, maxPrice?: number }) {
  try {
    const where: any = {};
    if (filters?.location) {
      where.location = { contains: filters.location, mode: 'insensitive' };
    }
    if (filters?.minPrice || filters?.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }

    const hotels = await prisma.hotel.findMany({
      where,
      include: {
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const safeHotels = hotels.map((h: any) => ({
      ...h,
      price: h.price ? Number(h.price.toString()) : 0,
    }));

    return { success: true, data: serializeToPlain(safeHotels) };
  } catch (error: any) {
    console.error('getHotelsAction error:', error);
    return { success: false, error: error.message };
  }
}

export async function getHotelBySlugAction(slug: string) {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { slug },
      include: {
        images: true,
        rooms: true,
      },
    });

    if (!hotel) return { success: false, error: 'Hotel not found' };

    const safeHotel = {
      ...hotel,
      price: hotel.price ? Number(hotel.price.toString()) : 0,
      rooms: hotel.rooms?.map((r: any) => ({
        ...r,
        pricePerNight: r.pricePerNight ? Number(r.pricePerNight.toString()) : 0,
      }))
    };

    return { success: true, data: serializeToPlain(safeHotel) };
  } catch (error: any) {
    console.error('getHotelBySlugAction error:', error);
    return { success: false, error: error.message };
  }
}
