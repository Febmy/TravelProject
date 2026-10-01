'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppFloating } from '@/components/WhatsAppFloating';
import { ProfileView } from '@/components/views/ProfileView';

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-[#1C1A16] font-['Figtree',sans-serif]">
      <Navbar />
      <main className="flex-1">
        <ProfileView
          setScreen={(s) => {
            if (s === 'invoice') router.push('/invoice');
            else if (s === 'tracking') router.push('/tracking');
            else router.push(`/${s}`);
          }}
        />
      </main>
      <WhatsAppFloating />
      <Footer />
    </div>
  );
}
