'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppFloating } from '@/components/WhatsAppFloating';
import { BookingCheckoutView } from '@/components/views/BookingCheckoutView';
import { figmaHotels } from '@/lib/figma-data';

export default function CheckoutPage() {
  const router = useRouter();
  const [checkoutItem, setCheckoutItem] = useState<any>(figmaHotels[0]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('safara_checkout_item');
      if (saved) {
        try {
          setCheckoutItem(JSON.parse(saved));
        } catch (e) {
          // ignore
        }
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-[#1C1A16] font-['Figtree',sans-serif]">
      <Navbar />
      <main className="flex-1">
        <BookingCheckoutView
          item={checkoutItem}
          setScreen={(s) => {
            if (s === 'success') router.push('/success');
            else router.push(`/${s}`);
          }}
          onPaymentSuccess={(data) => {
            if (typeof window !== 'undefined') {
              localStorage.setItem('safara_latest_booking', JSON.stringify(data));
            }
            if (data?.bookingCode) {
              router.push(`/success?code=${data.bookingCode}`);
            } else {
              router.push('/success');
            }
          }}
        />
      </main>
      <WhatsAppFloating />
      <Footer />
    </div>
  );
}
