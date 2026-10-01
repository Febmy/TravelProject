'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppFloating } from '@/components/WhatsAppFloating';
import { HotelDetailView } from '@/components/views/HotelDetailView';
import { figmaHotels } from '@/lib/figma-data';
import { getHotelBySlugAction } from '@/actions/hotels';

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params?.id as string;
  const [hotelData, setHotelData] = useState<any>(null);

  useEffect(() => {
    async function loadHotel() {
      if (hotelId) {
        try {
          const res = await getHotelBySlugAction(hotelId);
          if (res.success && res.data) {
            // Map DB hotel into component shape
            const dbH = res.data;
            const mapped = {
              id: dbH.slug || dbH.id,
              dbId: dbH.id,
              name: dbH.name,
              location: dbH.location,
              fullLocation: dbH.location + ', Indonesia',
              pricePerNight: dbH.price || 4500000,
              priceFormatted: `Rp ${(dbH.price || 4500000).toLocaleString('id-ID')} / malam`,
              rating: dbH.rating || 4.9,
              reviewsCount: 320,
              ratingText: 'Sangat Luar Biasa',
              tag: dbH.tag || 'Favorit Wisatawan',
              image: dbH.images?.[0]?.imageUrl || figmaHotels[0].image,
              gallery: dbH.images?.map((img: any) => img.imageUrl) || figmaHotels[0].gallery,
              description: dbH.description,
              amenities: dbH.amenities || figmaHotels[0].amenities,
              rooms: dbH.rooms?.length > 0 ? dbH.rooms.map((r: any) => ({
                id: r.id,
                name: r.name,
                description: `Kapasitas ${r.capacity} Tamu. Kenyamanan standar bintang 5 Safara.`,
                bed: '1 King Bed Super / 2 Twin Beds',
                guests: `${r.capacity} Dewasa`,
                features: 'Sarapan Gratis · WiFi Cepat · Bathtub Mewah',
                price: r.pricePerNight,
                priceFormatted: `Rp ${Number(r.pricePerNight).toLocaleString('id-ID')}`,
              })) : figmaHotels[0].rooms,
            };
            setHotelData(mapped);
            return;
          }
        } catch (e) {
          console.error('Error fetching hotel from DB:', e);
        }
      }

      // Fallback to static figma hotels
      const cleanId = (hotelId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const fallback =
        figmaHotels.find(
          (h) =>
            h.id === hotelId ||
            h.id.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanId ||
            h.name.toLowerCase().includes((hotelId || '').toLowerCase().replace(/-/g, ' '))
        ) || figmaHotels[0];
      setHotelData(fallback);
    }

    loadHotel();
  }, [hotelId]);

  if (!hotelData) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center font-semibold text-sm">
        Memuat detail hotel...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-[#1C1A16] font-['Figtree',sans-serif]">
      <Navbar />
      <main className="flex-1">
        <HotelDetailView
          hotel={hotelData}
          setScreen={(s) => {
            if (s === 'hotels') router.push('/hotels');
            else if (s === 'checkout') router.push('/checkout');
            else if (s === 'home') router.push('/');
            else router.push(`/${s}`);
          }}
          setSelectedRoom={(room) => {
            if (typeof window !== 'undefined') {
              localStorage.setItem(
                'safara_checkout_item',
                JSON.stringify({
                  hotelId: hotelData.dbId || undefined,
                  hotelRoomId: room.id || undefined,
                  name: hotelData.name,
                  roomName: room.name,
                  price: room.price * 3,
                  type: 'HOTEL',
                })
              );
            }
            router.push('/checkout');
          }}
        />
      </main>
      <WhatsAppFloating />
      <Footer />
    </div>
  );
}
