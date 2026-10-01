'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppFloating } from '@/components/WhatsAppFloating';
import { RegisterView } from '@/components/views/RegisterView';

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-[#1C1A16] font-['Figtree',sans-serif]">
      <Navbar />
      <main className="flex-1">
        <RegisterView
          setScreen={(s) => {
            if (s === 'login') router.push('/login');
            else if (s === 'profile') router.push('/profile');
            else router.push(`/${s}`);
          }}
        />
      </main>
      <WhatsAppFloating />
      <Footer />
    </div>
  );
}
