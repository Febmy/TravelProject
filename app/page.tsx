'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppFloating } from '@/components/WhatsAppFloating';
import { HomeView } from '@/components/views/HomeView';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-[#1C1A16] font-['Figtree',sans-serif]">
      {/* Main Customer Navigation */}
      <Navbar />

      {/* Main Home Content */}
      <main className="flex-1">
        <HomeView />
      </main>

      {/* Floating WhatsApp Quick Contact */}
      <WhatsAppFloating />

      {/* Customer Footer */}
      <Footer />
    </div>
  );
}
