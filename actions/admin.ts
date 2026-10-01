'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getAdminDashboardData() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // 1. Fetch Packages (Umrah & Tour Products)
    const packages = await prisma.package.findMany({
      include: {
        destination: true,
        images: true,
        schedules: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    // 2. Fetch Hotels
    const hotels = await prisma.hotel.findMany({
      include: {
        images: true,
        rooms: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    // Fetch Promos
    const promos = await prisma.promo.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // 3. Fetch Bookings from PostgreSQL
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        hotel: true,
        hotelRoom: true,
        schedule: {
          include: { package: true }
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    // 4. Fetch Registered Users with their bookings summary
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phoneNumber: true,
        createdAt: true,
        bookings: {
          select: {
            id: true,
            totalPrice: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 5. Fetch Audit Logs
    const auditLogs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // 6. Fetch System Settings
    let systemSetting = await prisma.systemSetting.findFirst();
    if (!systemSetting) {
      systemSetting = await prisma.systemSetting.create({
        data: {
          id: 'safara-settings',
        }
      });
    }

    // 6.5 Fetch Bank Accounts
    let bankAccounts = await prisma.bankAccount.findMany({
      orderBy: { createdAt: 'asc' }
    });

    if (bankAccounts.length === 0) {
      // Seed default banks
      await prisma.bankAccount.createMany({
        data: [
          {
            bankName: 'Bank Central Asia (BCA)',
            accountNumber: '8410998823',
            accountName: 'PT SAFARA GLOBAL TRAVEL',
            code: '014',
            logoText: 'BCA',
            badge: 'Paling Direkomendasikan',
            color: '#005E6A',
            lightBg: '#F0F9FF'
          },
          {
            bankName: 'Bank Mandiri',
            accountNumber: '1370029988120',
            accountName: 'PT SAFARA GLOBAL TRAVEL',
            code: '008',
            logoText: 'MANDIRI',
            badge: 'm-Banking Livin',
            color: '#003D79',
            lightBg: '#F0F9FF'
          },
          {
            bankName: 'Bank Syariah Indonesia (BSI)',
            accountNumber: '7199008811',
            accountName: 'PT SAFARA GLOBAL TRAVEL',
            code: '451',
            logoText: 'BSI',
            badge: 'Syariah Khusus Umrah',
            color: '#00A39D',
            lightBg: '#F0FDFA'
          },
          {
            bankName: 'Bank Negara Indonesia (BNI)',
            accountNumber: '0988771234',
            accountName: 'PT SAFARA GLOBAL TRAVEL',
            code: '009',
            logoText: 'BNI',
            badge: 'Transfer ATM / Mobile',
            color: '#F15A24',
            lightBg: '#FFF7ED'
          }
        ]
      });
      bankAccounts = await prisma.bankAccount.findMany({
        orderBy: { createdAt: 'asc' }
      });
    }

    // 7. Calculate Stats
    const totalRevenue = bookings.reduce((acc, curr) => {
      if (curr.status === 'CONFIRMED' || (curr as any).status === 'PAID') {
        return acc + Number(curr.totalPrice);
      }
      return acc;
    }, 0);

    const pendingBookings = bookings.filter(b => b.status === 'PENDING');
    const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED');
    const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED');

    const weeklyRevenue = [
      { day: 'Sen', amount: 'Rp 4.5B', height: 45 },
      { day: 'Sel', amount: 'Rp 6.2B', height: 62 },
      { day: 'Rab', amount: 'Rp 3.1B', height: 31 },
      { day: 'Kam', amount: 'Rp 8.4B', height: 84 },
      { day: 'Jum', amount: 'Rp 12.5B', height: 95 },
      { day: 'Sab', amount: 'Rp 14.2B', height: 100 },
      { day: 'Min', amount: 'Rp 11.0B', height: 88 },
    ];

    const safePackages = packages.map(p => ({
      ...p,
      price: p.price ? Number(p.price.toString()) : 0,
      quotaTotal: p.schedules.reduce((acc, s) => acc + s.quota, 0),
      bookedTotal: p.schedules.reduce((acc, s) => acc + s.bookedCount, 0),
    }));

    const safeHotels = hotels.map(h => ({
      ...h,
      price: h.price ? Number(h.price.toString()) : 0,
      rooms: h.rooms.map(r => ({
        ...r,
        pricePerNight: r.pricePerNight ? Number(r.pricePerNight.toString()) : 0,
      })),
    }));

    const safeBookings = bookings.map(b => ({
      ...b,
      totalPrice: b.totalPrice ? Number(b.totalPrice.toString()) : 0,
      payment: b.payment ? {
        ...b.payment,
        amount: b.payment.amount ? Number(b.payment.amount.toString()) : 0,
      } : null,
      hotel: b.hotel ? {
        ...b.hotel,
        price: b.hotel.price ? Number(b.hotel.price.toString()) : 0,
      } : null,
      hotelRoom: b.hotelRoom ? {
        ...b.hotelRoom,
        pricePerNight: b.hotelRoom.pricePerNight ? Number(b.hotelRoom.pricePerNight.toString()) : 0,
      } : null,
      schedule: b.schedule ? {
        ...b.schedule,
        package: b.schedule.package ? {
          ...b.schedule.package,
          price: b.schedule.package.price ? Number(b.schedule.package.price.toString()) : 0,
        } : null,
      } : null,
    }));

    const safeUsers = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      phoneNumber: u.phoneNumber || '-',
      createdAt: u.createdAt.toISOString(),
      tripsCount: u.bookings.filter(b => b.status === 'CONFIRMED').length,
      totalSpend: u.bookings.reduce((sum, b) => b.status === 'CONFIRMED' ? sum + Number(b.totalPrice) : sum, 0),
    }));

    return {
      success: true,
      data: {
        packages: safePackages,
        hotels: safeHotels,
        bookings: safeBookings,
        users: safeUsers,
        promos: JSON.parse(JSON.stringify(promos)),
        auditLogs: JSON.parse(JSON.stringify(auditLogs)),
        systemSetting,
        bankAccounts: JSON.parse(JSON.stringify(bankAccounts)),
        stats: {
          totalRevenue,
          activeBookingsCount: pendingBookings.length,
          confirmedBookingsCount: confirmedBookings.length,
          cancelledBookingsCount: cancelledBookings.length,
          totalPackages: safePackages.length + safeHotels.length,
          totalBookings: safeBookings.length,
          totalUsers: safeUsers.length,
        },
        weeklyRevenue
      }
    };
  } catch (error: any) {
    console.error('Admin data fetch error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Server Action: Update Package Detail oleh Admin
 */
export async function updatePackageAction(packageId: string, data: { title?: string; price?: number; description?: string }) {
  try {
    const updated = await prisma.package.update({
      where: { id: packageId },
      data: {
        title: data.title,
        price: data.price,
        description: data.description,
      }
    });
    return { success: true, data: { ...updated, price: Number(updated.price) } };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Server Action: Update Hotel Detail oleh Admin
 */
export async function updateHotelAction(hotelId: string, data: { name?: string; price?: number; location?: string }) {
  try {
    const updated = await prisma.hotel.update({
      where: { id: hotelId },
      data: {
        name: data.name,
        price: data.price,
        location: data.location,
      }
    });
    return { success: true, data: { ...updated, price: Number(updated.price) } };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Server Action: Batalkan Booking oleh Admin
 */
export async function cancelBookingAction(bookingId: string, reason?: string) {
  try {
    const updated = await prisma.$transaction(async (tx) => {
      const b = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CANCELLED',
          specialRequest: reason ? `[DIBATALKAN ADMIN]: ${reason}` : undefined,
        },
      });

      await tx.payment.upsert({
        where: { bookingId },
        create: {
          bookingId,
          amount: b.totalPrice,
          status: 'FAILED',
        },
        update: {
          status: 'FAILED',
        },
      });

      return b;
    });

    return { success: true, data: { ...updated, totalPrice: Number(updated.totalPrice) } };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Server Action: Tambah Paket Wisata / Umrah Baru oleh Admin
 */
export async function createPackageAction(data: any) {
  try {
    // Cari atau gunakan destination pertama
    const firstDest = await prisma.destination.findFirst();
    let destId = firstDest?.id;
    if (!destId) {
      const newDest = await prisma.destination.create({
        data: {
          name: 'Arab Saudi',
          slug: 'arab-saudi',
          city: 'Makkah',
          country: 'Saudi Arabia',
        }
      });
      destId = newDest.id;
    }

    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    // Calculate base price from the cheapest room
    const basePrice = data.room_allocations && data.room_allocations.length > 0
      ? Math.min(...data.room_allocations.map((r: any) => Number(r.price_room_only)))
      : 25000000;

    const newPkg = await prisma.package.create({
      data: {
        destinationId: destId,
        title: data.title,
        slug,
        category: data.category,
        description: data.description,
        durationDays: data.duration_days,
        departureCity: data.departure_city,
        flightAirline: data.flight?.airline,
        flightSeatAllotment: data.flight?.seat_allotment,
        price: basePrice,
        hotels: data.hotels,
        includes: data.includes,
        excludes: data.excludes,
        allowSharingRoom: data.allow_sharing_room,
        mealPlanBreakfast: data.meal_plan?.has_breakfast_option,
        mealPlanAddonPrice: data.meal_plan?.breakfast_addon_price_per_pax,
        status: data.status,
        images: data.thumbnail_url ? {
          create: [{ imageUrl: data.thumbnail_url, isPrimary: true }]
        } : undefined,
        schedules: {
          create: [{
            startDate: new Date(data.departure_date || Date.now()),
            endDate: new Date(data.return_date || Date.now()),
            quota: data.total_seats,
            bookedCount: 0,
          }]
        },
        rooms: {
          create: data.room_allocations?.map((r: any) => ({
            roomType: r.room_type,
            capacityPerRoom: r.capacity_per_room,
            roomCount: r.room_count,
            priceRoomOnly: r.price_room_only,
            priceWithBreakfast: r.price_with_breakfast,
            totalPaxCapacity: r.total_pax_capacity
          })) || []
        }
      },
      include: {
        destination: true,
        images: true,
        schedules: true,
        rooms: true,
      }
    });

    // Serialization to remove Prisma Decimal objects
    const serializedPkg = JSON.parse(JSON.stringify(newPkg));
    return { success: true, data: { ...serializedPkg, price: Number(serializedPkg.price) } };
  } catch (err: any) {
    console.error('createPackageAction error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Server Action: Tambah Hotel Baru oleh Admin
 */
export async function createHotelAction(data: any) {
  try {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const basePrice = data.rooms && data.rooms.length > 0
      ? Math.min(...data.rooms.map((r: any) => Number(r.price_per_night)))
      : 1500000;

    const newHotel = await prisma.hotel.create({
      data: {
        name: data.name,
        slug,
        location: data.location,
        description: data.description,
        price: basePrice,
        rating: data.stars,
        amenities: data.amenities,
        status: data.status,
        images: data.thumbnail_url ? {
          create: [{ imageUrl: data.thumbnail_url, isPrimary: true }]
        } : undefined,
        rooms: {
          create: data.rooms?.map((r: any) => ({
            name: r.room_type,
            capacity: r.capacity,
            totalRooms: r.total_rooms,
            pricePerNight: r.price_per_night,
          })) || []
        }
      },
      include: {
        images: true,
        rooms: true,
      }
    });

    // Serialization to remove Prisma Decimal objects
    const serializedHotel = JSON.parse(JSON.stringify(newHotel));
    return { success: true, data: { ...serializedHotel, price: Number(serializedHotel.price) } };
  } catch (err: any) {
    console.error('createHotelAction error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Server Action: Tambah Promo Baru
 */
export async function createPromoAction(data: { code: string; campaign: string; type: string; amount: number; isActive: boolean }) {
  try {
    const promo = await prisma.promo.create({
      data: {
        code: data.code.toUpperCase(),
        campaign: data.campaign,
        type: data.type,
        amount: data.amount,
        isActive: data.isActive,
      }
    });
    return { success: true, data: JSON.parse(JSON.stringify(promo)) };
  } catch (err: any) {
    console.error('createPromo error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Server Action: Hapus Promo
 */
export async function deletePromoAction(id: string) {
  try {
    await prisma.promo.delete({ where: { id } });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Server Action: Toggle Status Promo
 */
export async function togglePromoAction(id: string, isActive: boolean) {
  try {
    const promo = await prisma.promo.update({
      where: { id },
      data: { isActive }
    });
    return { success: true, data: JSON.parse(JSON.stringify(promo)) };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Server Action: Update User Role (Admin / User)
 */
export async function updateUserRoleAction(id: string, role: 'ADMIN' | 'USER') {
  try {
    const session = await getServerSession(authOptions);
    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phoneNumber: true,
        createdAt: true,
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: session?.user?.id || 'SYSTEM',
        userName: session?.user?.name || 'Sistem',
        action: 'UPDATE_ROLE',
        entityType: 'USER',
        entityId: id,
        details: `Mengubah peran ${user.name} menjadi ${role}`
      }
    });

    return { success: true, data: user };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Server Action: Hapus Pengguna
 */
export async function deleteUserAction(id: string) {
  try {
    const session = await getServerSession(authOptions);
    const deletedUser = await prisma.user.findUnique({ where: { id } });
    
    await prisma.user.delete({ where: { id } });

    if (deletedUser) {
      await prisma.auditLog.create({
        data: {
          userId: session?.user?.id || 'SYSTEM',
          userName: session?.user?.name || 'Sistem',
          action: 'DELETE',
          entityType: 'USER',
          entityId: id,
          details: `Menghapus akun user ${deletedUser.name}`
        }
      });
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Server Action: Update System Settings
 */
export async function updateSystemSettingAction(data: {
  paymentGatewayActive: boolean;
  waNotificationActive: boolean;
  supplierApiActive: boolean;
  useSafaraCodeOnly: boolean;
  adminWhatsApp: string;
  customerCareWhatsApp: string;
}) {
  try {
    const session = await getServerSession(authOptions);
    const setting = await prisma.systemSetting.upsert({
      where: { id: 'safara-settings' },
      update: data,
      create: {
        id: 'safara-settings',
        ...data,
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: session?.user?.id || 'SYSTEM',
        userName: session?.user?.name || 'Sistem',
        action: 'UPDATE_SETTINGS',
        entityType: 'SETTING',
        entityId: 'safara-settings',
        details: 'Memperbarui pengaturan platform'
      }
    });

    return { success: true, data: setting };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Server Action: Save Bank Accounts (Bulk Replace)
 */
export async function saveBankAccountsAction(accounts: any[]) {
  try {
    const session = await getServerSession(authOptions);
    
    // Simple approach: delete all and insert all, or update existing.
    // We'll delete all and re-create.
    await prisma.bankAccount.deleteMany();
    
    if (accounts.length > 0) {
      await prisma.bankAccount.createMany({
        data: accounts.map(a => ({
          bankName: a.bankName,
          accountNumber: a.accountNumber,
          accountName: a.accountName,
          code: a.code || null,
          logoText: a.logoText || a.bankName.substring(0,3),
          logoUrl: a.logoUrl || null,
          badge: a.badge || null,
          color: a.color || '#0F766E',
          lightBg: a.lightBg || '#F0FDFA',
          isActive: a.isActive !== undefined ? a.isActive : true,
        }))
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: session?.user?.id || 'SYSTEM',
        userName: session?.user?.name || 'Sistem',
        action: 'UPDATE_BANKS',
        entityType: 'SETTING',
        entityId: 'safara-banks',
        details: 'Memperbarui daftar rekening bank tujuan'
      }
    });

    const newAccounts = await prisma.bankAccount.findMany({ orderBy: { createdAt: 'desc' }});
    return { success: true, data: newAccounts };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getAdminWhatsAppAction() {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { id: 'safara-settings' },
    });
    return {
      adminWhatsApp: setting?.adminWhatsApp || '6281234567890',
      customerCareWhatsApp: setting?.customerCareWhatsApp || '6281234567891'
    };
  } catch (error) {
    console.error('Failed to get admin WhatsApp:', error);
    return {
      adminWhatsApp: '6281234567890',
      customerCareWhatsApp: '6281234567891'
    };
  }
}
