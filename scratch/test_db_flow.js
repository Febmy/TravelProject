const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testFlow() {
  console.log('--- Testing Database Booking Flow ---');
  
  // 1. Create a test booking
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const bookingCode = `SFR-TEST-${randomSuffix}`;

  const hotel = await prisma.hotel.findFirst();
  const room = await prisma.hotelRoom.findFirst();

  const newBooking = await prisma.booking.create({
    data: {
      bookingCode,
      itemType: 'HOTEL',
      title: `${hotel.name} - ${room.name}`,
      hotelId: hotel.id,
      hotelRoomId: room.id,
      guestName: 'Budi Santoso',
      guestEmail: 'budi@example.com',
      guestPhone: '08123456789',
      numParticipants: 2,
      totalPrice: 13500000,
      status: 'CONFIRMED',
      checkInDate: new Date('2026-10-15T00:00:00Z'),
      checkOutDate: new Date('2026-10-18T00:00:00Z'),
      payment: {
        create: {
          paymentMethod: 'BCA Virtual Account',
          amount: 13500000,
          status: 'SUCCESS',
          paidAt: new Date(),
        }
      }
    },
    include: {
      hotel: true,
      hotelRoom: true,
      payment: true,
    }
  });

  console.log('Created Booking in DB:', {
    id: newBooking.id,
    code: newBooking.bookingCode,
    title: newBooking.title,
    status: newBooking.status,
    paymentStatus: newBooking.payment?.status,
  });

  // 2. Query booking
  const found = await prisma.booking.findUnique({
    where: { bookingCode },
    include: { hotel: true, payment: true },
  });
  console.log('Query result by bookingCode:', found ? 'FOUND' : 'NOT FOUND');

  // 3. Clean up test record
  await prisma.payment.deleteMany({ where: { bookingId: newBooking.id } });
  await prisma.booking.delete({ where: { id: newBooking.id } });
  console.log('Cleaned up test booking.');

  console.log('--- Database Booking Flow Test Passed! ---');
}

testFlow()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
