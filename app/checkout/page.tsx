'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppFloating } from '@/components/WhatsAppFloating';
import { BookingCheckoutView } from '@/components/views/BookingCheckoutView';
import { figmaHotels } from '@/lib/figma-data';
import { LogIn, UserPlus, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
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
        {status === 'loading' ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#0F766E] border-t-transparent mb-4" />
            <p className="text-sm font-medium text-[#6B6E6E]">Memeriksa status akun Anda...</p>
          </div>
        ) : !session ? (
          <div className="mx-auto max-w-xl px-4 py-16 sm:py-20 text-center">
            <div className="rounded-3xl border border-[#EAE6E1] bg-white p-8 sm:p-10 shadow-xl">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E] border border-teal-100 mb-5">
                <Lock className="h-8 w-8" />
              </div>
              
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200/80 px-3 py-1 text-[11px] font-bold text-[#0F766E]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Login Diperlukan Sebelum Memesan
              </span>

              <h1 className="mt-3 font-['Figtree'] text-2xl font-bold text-[#1C1A16]">
                Masuk atau Buat Akun Terlebih Dahulu
              </h1>
              
              <p className="mt-2 text-xs sm:text-sm text-[#6B6E6E] leading-relaxed">
                Untuk menjamin keamanan pemesanan, verifikasi jemaah, serta penyimpanan e-tiket dan invoice resmi, Anda harus memiliki akun di Safara Travel.
              </p>

              {/* Order item preview */}
              {checkoutItem && (
                <div className="mt-6 rounded-2xl bg-[#FAF9F6] border border-[#EAE6E1] p-4 text-left flex items-center justify-between">
                  <div className="truncate pr-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F766E] block">
                      {checkoutItem.type === 'HOTEL' ? 'RESERVASI HOTEL' : 'PAKET UMRAH'}
                    </span>
                    <span className="font-bold text-sm text-[#1C1A16] block truncate">
                      {checkoutItem.name || checkoutItem.title}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-sm text-[#0F766E] shrink-0">
                    Rp {Number(checkoutItem.price || 0).toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/login?callbackUrl=/checkout"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] py-3.5 px-4 text-xs font-bold text-white shadow-md shadow-teal-900/10 hover:bg-[#0D655E] transition active:scale-95"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Masuk ke Akun</span>
                </Link>
                <Link
                  href="/register?callbackUrl=/checkout"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[#EAE6E1] bg-white py-3.5 px-4 text-xs font-bold text-[#1C1A16] hover:bg-[#FAF9F6] transition active:scale-95"
                >
                  <UserPlus className="h-4 w-4 text-[#0F766E]" />
                  <span>Daftar Akun Baru</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
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
        )}
      </main>
      <WhatsAppFloating />
      <Footer />
    </div>
  );
}
