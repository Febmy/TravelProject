const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log('--- Starting Database Seeding ---');

  // 1. Destination for Umrah
  let saudi = await prisma.destination.findUnique({ where: { slug: 'arab-saudi' } });
  if (!saudi) {
    saudi = await prisma.destination.create({
      data: {
        name: 'Makkah & Madinah',
        slug: 'arab-saudi',
        city: 'Makkah',
        country: 'Arab Saudi',
        description: 'Kota suci umat Islam dengan pusat ibadah Masjidil Haram dan Masjid Nabawi.',
        imageUrl: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=85',
      },
    });
    console.log('Created Destination: Makkah & Madinah');
  }

  // 2. Packages (Umrah)
  const packagesData = [
    {
      title: 'Paket Umrah Eksklusif Syawal 9 Hari Terdekat Masjidil Haram',
      slug: 'umrah-syawal-9hari',
      description: 'Menginap di Fairmont Clock Tower Makkah & Oberoi Madinah dengan bimbingan asatidz tepercaya sesuai sunnah. Rasakan pengalaman ibadah khusyuk di pelataran Kaaba tanpa lelah jarak.',
      durationDays: 9,
      price: 44200000,
      destinationId: saudi.id,
      includes: [
        'Akomodasi Bintang 5: Fairmont Makkah & Oberoi Madinah',
        'Penerbangan Langsung Saudi Airlines / Garuda Indonesia tanpa transit',
        'Visa Umrah, Asuransi Perjalanan & Manasik Lengkap',
        'Bimbingan Muthawwif Asatidz berpengalaman sesuai Sunnah',
        'Perlengkapan Umrah Eksklusif & City Tour Kota Suci'
      ],
      excludes: [
        'Pengeluaran pribadi & kelebihan bagasi',
        'Pembuatan paspor',
        'Biaya vaksin meningitis mandiri'
      ],
      rating: 5.0,
      images: [
        'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85'
      ],
      schedules: [
        {
          startDate: new Date('2026-10-14T00:00:00Z'),
          endDate: new Date('2026-10-23T00:00:00Z'),
          quota: 45,
          bookedCount: 39,
        }
      ]
    },
    {
      title: 'Umrah Premium Bintang 5 Musim Gugur',
      slug: 'umrah-musim-gugur',
      description: 'Paket Umrah berkelas dengan harga terjangkau di musim gugur yang sejuk, hotel bintang 5 nol meter dari pelataran masjid.',
      durationDays: 9,
      price: 39500000,
      destinationId: saudi.id,
      includes: [
        'Hotel Bintang 5 Nol Meter (Swissotel & Pullman)',
        'Penerbangan Saudi Airlines Langsung',
        'Free Tiket Kereta Cepat Haramain',
        'Fullboard Buffet Hotel'
      ],
      excludes: [
        'Pengeluaran pribadi',
        'Paspor'
      ],
      rating: 4.9,
      images: [
        'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=900&q=85'
      ],
      schedules: [
        {
          startDate: new Date('2026-09-22T00:00:00Z'),
          endDate: new Date('2026-10-01T00:00:00Z'),
          quota: 40,
          bookedCount: 28,
        }
      ]
    },
    {
      title: 'Umrah Akbar Akhir Tahun Plus Turki 12 Hari',
      slug: 'umrah-turki-akbar',
      description: 'Perpaduan ibadah umrah khusyuk bintang 5 dan ziarah jejak peradaban Islam di Istanbul, Blue Mosque, Hagia Sophia, dan Bosphorus Cruise.',
      durationDays: 12,
      price: 52800000,
      destinationId: saudi.id,
      includes: [
        'Istanbul City Tour & Bosphorus Cruise',
        'Raffles Makkah Palace View Kaaba & Dar Al Taqwa Madinah',
        'Penerbangan Turkish Airlines',
        'Private VIP Bus & Muthawwif Berpengalaman'
      ],
      excludes: [
        'Pengeluaran pribadi & tipping'
      ],
      rating: 4.98,
      images: [
        'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=85'
      ],
      schedules: [
        {
          startDate: new Date('2026-11-05T00:00:00Z'),
          endDate: new Date('2026-11-17T00:00:00Z'),
          quota: 35,
          bookedCount: 31,
        }
      ]
    }
  ];

  for (const pkg of packagesData) {
    const existing = await prisma.package.findUnique({ where: { slug: pkg.slug } });
    if (!existing) {
      const created = await prisma.package.create({
        data: {
          title: pkg.title,
          slug: pkg.slug,
          description: pkg.description,
          durationDays: pkg.durationDays,
          price: pkg.price,
          destinationId: pkg.destinationId,
          includes: pkg.includes,
          excludes: pkg.excludes,
          rating: pkg.rating,
          images: {
            create: pkg.images.map((img, idx) => ({
              imageUrl: img,
              isPrimary: idx === 0,
            })),
          },
          schedules: {
            create: pkg.schedules.map((sch) => ({
              startDate: sch.startDate,
              endDate: sch.endDate,
              quota: sch.quota,
              bookedCount: sch.bookedCount,
            })),
          },
        },
      });
      console.log(`Created Package: ${created.title}`);
    } else {
      console.log(`Package exists: ${existing.title}`);
    }
  }

  // 3. Populate Hotel Rooms for existing hotels
  const hotels = await prisma.hotel.findMany({ include: { rooms: true } });
  console.log(`Found ${hotels.length} hotels in database.`);

  const hotelRoomsMap = {
    'the-alila-seminyak': [
      { name: 'Deluxe Ocean View Room', capacity: 2, pricePerNight: 4500000 },
      { name: 'Alila Signature Terrace Suite', capacity: 3, pricePerNight: 6800000 }
    ],
    'mandapa-ritz-carlton': [
      { name: 'Reserve Suite Rainforest View', capacity: 2, pricePerNight: 8200000 },
      { name: 'One-Bedroom River Front Pool Villa', capacity: 2, pricePerNight: 14500000 }
    ],
    'amanjiwo-borobudur': [
      { name: 'Borobudur View Suite', capacity: 2, pricePerNight: 9500000 },
      { name: 'Garden Pool Suite', capacity: 2, pricePerNight: 12000000 }
    ]
  };

  for (const h of hotels) {
    if (h.rooms.length === 0) {
      const roomsToCreate = hotelRoomsMap[h.slug] || [
        { name: 'Deluxe Premier Room', capacity: 2, pricePerNight: Number(h.price) }
      ];

      for (const r of roomsToCreate) {
        await prisma.hotelRoom.create({
          data: {
            hotelId: h.id,
            name: r.name,
            capacity: r.capacity,
            pricePerNight: r.pricePerNight,
          }
        });
      }
      console.log(`Created ${roomsToCreate.length} rooms for hotel ${h.name}`);
    } else {
      console.log(`Hotel ${h.name} already has ${h.rooms.length} rooms`);
    }
  }

  console.log('--- Database Seeding Complete ---');
}

seed()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
