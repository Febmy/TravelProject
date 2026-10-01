'use server';

import prisma from '@/lib/prisma';
import { TourFilterParams } from '@/types';
import { serializeToPlain } from '@/lib/serialize';

/**
 * Server Action: Ambil Daftar Paket Wisata dengan Filter Relasional & Rentang Harga
 */
export async function getToursAction(params?: TourFilterParams) {
  try {
    const { destinationId, minPrice, maxPrice, startDate, searchQuery } = params || {};

    const whereClause: any = {
      isActive: true,
    };

    if (destinationId) {
      whereClause.destinationId = destinationId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.price = {};
      if (minPrice !== undefined) whereClause.price.gte = minPrice;
      if (maxPrice !== undefined) whereClause.price.lte = maxPrice;
    }

    if (searchQuery) {
      whereClause.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
        { destination: { name: { contains: searchQuery, mode: 'insensitive' } } },
        { destination: { city: { contains: searchQuery, mode: 'insensitive' } } },
      ];
    }

    if (startDate) {
      whereClause.schedules = {
        some: {
          startDate: {
            gte: new Date(startDate),
          },
        },
      };
    }

    const packages = await prisma.package.findMany({
      where: whereClause,
      include: {
        destination: true,
        images: {
          orderBy: { isPrimary: 'desc' },
        },
        schedules: {
          where: {
            startDate: { gte: new Date() }
          },
          orderBy: { startDate: 'asc' },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const safePackages = packages.map((pkg: any) => ({
      ...pkg,
      price: pkg.price ? Number(pkg.price.toString()) : 0,
      mealPlanAddonPrice: pkg.mealPlanAddonPrice ? Number(pkg.mealPlanAddonPrice.toString()) : 0,
    }));

    return {
      success: true,
      data: serializeToPlain(safePackages),
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Gagal memuat katalog tur wisata.',
      data: [],
    };
  }
}

/**
 * Server Action: Ambil Detail Paket Wisata berdasarkan slug
 */
export async function getTourBySlugAction(slug: string) {
  try {
    const tour = await prisma.package.findUnique({
      where: { slug },
      include: {
        destination: true,
        images: true,
        schedules: {
          where: {
            startDate: { gte: new Date() }
          },
          orderBy: { startDate: 'asc' },
        },
      },
    });

    if (!tour) {
      return { success: false, error: 'Paket tur tidak ditemukan.' };
    }

    const safeTour = {
      ...tour,
      price: tour.price ? Number(tour.price.toString()) : 0,
      mealPlanAddonPrice: tour.mealPlanAddonPrice ? Number(tour.mealPlanAddonPrice.toString()) : 0,
    };

    return {
      success: true,
      data: serializeToPlain(safeTour),
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Gagal memuat rincian paket tur.',
    };
  }
}

/**
 * Server Action: Ambil Semua Destinasi Wisata Populer
 */
export async function getDestinationsAction() {
  try {
    const destinations = await prisma.destination.findMany({
      include: {
        _count: {
          select: { packages: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return {
      success: true,
      data: destinations,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Gagal memuat destinasi.',
      data: [],
    };
  }
}
