'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppFloating } from '@/components/WhatsAppFloating';
import { UmrahDetailView } from '@/components/views/UmrahDetailView';
import { figmaUmrahPackages } from '@/lib/figma-data';
import { getTourBySlugAction } from '@/actions/tours';

export default function UmrahDetailPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params?.id as string;
  const [pkgData, setPkgData] = useState<any>(null);

  useEffect(() => {
    async function loadTour() {
      if (packageId) {
        try {
          const res = await getTourBySlugAction(packageId);
          if (res.success && res.data) {
            const dbT = res.data;
            const mapped = {
              id: dbT.slug || dbT.id,
              dbId: dbT.id,
              scheduleId: dbT.schedules?.[0]?.id,
              title: dbT.title,
              tag: 'Paket Terverifikasi',
              duration: `${dbT.durationDays} Hari`,
              departureDate: dbT.schedules?.[0]?.startDate ? new Date(dbT.schedules[0].startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '14 Oktober 2026',
              airline: 'Garuda Indonesia / Saudi Airlines Direct',
              makkahHotel: 'Fairmont Makkah Clock Royal Tower',
              madinahHotel: 'The Oberoi Madinah',
              rating: dbT.rating || 5.0,
              price: dbT.price || 44200000,
              priceFormatted: `Rp ${(dbT.price || 44200000).toLocaleString('id-ID')} / pax`,
              seatsLeft: dbT.schedules?.[0] ? (dbT.schedules[0].quota - dbT.schedules[0].bookedCount) : 6,
              image: dbT.images?.[0]?.imageUrl || figmaUmrahPackages[0].image,
              description: dbT.description,
              highlights: dbT.includes?.length > 0 ? dbT.includes : figmaUmrahPackages[0].highlights,
              itinerary: figmaUmrahPackages[0].itinerary,
              terms: figmaUmrahPackages[0].terms,
            };
            setPkgData(mapped);
            return;
          }
        } catch (e) {
          console.error('Error fetching tour from DB:', e);
        }
      }

      // Fallback
      const cleanId = (packageId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const fallback =
        figmaUmrahPackages.find(
          (p) =>
            p.id === packageId ||
            p.id.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanId ||
            p.title.toLowerCase().includes((packageId || '').toLowerCase().replace(/-/g, ' '))
        ) || figmaUmrahPackages[0];
      setPkgData(fallback);
    }

    loadTour();
  }, [packageId]);

  if (!pkgData) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center font-semibold text-sm">
        Memuat rincian paket umrah...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-[#1C1A16] font-['Figtree',sans-serif]">
      <Navbar />
      <main className="flex-1">
        <UmrahDetailView
          pkg={pkgData}
          setScreen={(s) => {
            if (s === 'umrah') router.push('/umrah');
            else if (s === 'checkout') router.push('/checkout');
            else if (s === 'home') router.push('/');
            else router.push(`/${s}`);
          }}
          setSelectedPackageForCheckout={(item) => {
            if (typeof window !== 'undefined') {
              localStorage.setItem('safara_checkout_item', JSON.stringify({
                ...item,
                scheduleId: pkgData.scheduleId || undefined,
                type: 'TOUR',
              }));
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
