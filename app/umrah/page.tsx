import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppFloating } from '@/components/WhatsAppFloating';
import { UmrahListingView } from '@/components/views/UmrahListingView';
import { getToursAction } from '@/actions/tours';

export default async function UmrahPage() {
  const result = await getToursAction();
  let packages = result.data || [];

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-[#1C1A16] font-['Figtree',sans-serif]">
      <Navbar />
      <main className="flex-1">
        <UmrahListingView
          initialPackages={packages}
        />
      </main>
      <WhatsAppFloating />
      <Footer />
    </div>
  );
}
