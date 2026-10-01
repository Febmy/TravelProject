import React, { Suspense } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppFloating } from '@/components/WhatsAppFloating';
import { HotelSearchView } from '@/components/views/HotelSearchView';
import { getHotelsAction } from '@/actions/hotels';

export default async function HotelsPage() {
  const result = await getHotelsAction();
  const hotels = result.success ? result.data : [];

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-[#1C1A16] font-['Figtree',sans-serif]">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-20 text-center">Memuat daftar hotel...</div>}>
          <HotelSearchView initialHotels={hotels} />
        </Suspense>
      </main>
      <WhatsAppFloating />
      <Footer />
    </div>
  );
}
