'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppFloating } from '@/components/WhatsAppFloating';
import { InvoiceView } from '@/components/views/InvoiceView';

export default function InvoicePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-[#1C1A16] font-['Figtree',sans-serif]">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-20 text-center text-sm font-semibold">Memuat rincian invoice...</div>}>
          <InvoiceView setScreen={(s) => router.push(`/${s}`)} />
        </Suspense>
      </main>
      <WhatsAppFloating />
      <Footer />
    </div>
  );
}
