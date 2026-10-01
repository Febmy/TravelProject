import { PrismaClient } from '@prisma/client';
import { figmaHotels } from '../lib/figma-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding hotels...');
  for (const h of figmaHotels) {
    const existing = await prisma.hotel.findUnique({ where: { slug: h.id } });
    if (!existing) {
      await prisma.hotel.create({
        data: {
          name: h.name,
          slug: h.id,
          location: h.location,
          description: h.description,
          rating: h.rating,
          price: h.pricePerNight,
          tag: h.tag,
          amenities: h.amenities,
          images: {
            create: [
              {
                imageUrl: h.image,
                isPrimary: true,
              }
            ]
          }
        }
      });
      console.log(`Created hotel: ${h.name}`);
    } else {
      console.log(`Hotel already exists: ${h.name}`);
    }
  }
  console.log('Seeding hotels completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
