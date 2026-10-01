'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppFloating } from '@/components/WhatsAppFloating';
import { LoginView } from '@/components/views/LoginView';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-[#1C1A16] font-['Figtree',sans-serif]">
      <Navbar />
      <main className="flex-1">
        <LoginView
          setScreen={(s) => {
            if (s === 'register') router.push('/register');
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
