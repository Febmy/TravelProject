'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppFloating } from '@/components/WhatsAppFloating';
import { PaymentSuccessView } from '@/components/views/PaymentSuccessView';
import { trackBookingAction } from '@/actions/booking';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    const codeParam = searchParams.get('code');

    if (codeParam) {
      trackBookingAction(codeParam).then((res) => {
        if (res.success && res.data) {
          setBookingData(res.data);
          return;
        }
      });
    }

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('safara_latest_booking');
      if (saved) {
        try {
          setBookingData(JSON.parse(saved));
        } catch (e) {
          // ignore
        }
      }
    }
  }, [searchParams]);

  return (
    <PaymentSuccessView
      bookingData={bookingData}
      setScreen={(s) => {
        if (s === 'home' || s === '/') router.push('/');
        else if (s.startsWith('/')) router.push(s);
        else router.push(`/${s}`);
      }}
    />
  );
}

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-[#1C1A16] font-['Figtree',sans-serif]">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-20 text-center">Memuat konfirmasi pesanan...</div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <WhatsAppFloating />
      <Footer />
    </div>
  );
}
