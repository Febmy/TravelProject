'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppFloating } from '@/components/WhatsAppFloating';
import { Compass, Mail, ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-[#1C1A16] font-['Figtree',sans-serif]">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-md rounded-3xl border border-[#EAE6E1] bg-white p-8 shadow-xl">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F766E] text-white shadow-md shadow-[#0F766E]/20">
              <Compass className="h-6 w-6" />
            </div>
            <h1 className="mt-4 font-['Figtree'] text-2xl font-bold text-[#1C1A16]">
              Atur Ulang Kata Sandi
            </h1>
            <p className="mt-1.5 text-xs text-[#6B6E6E]">
              Masukkan alamat email Anda yang terdaftar. Kami akan mengirimkan tautan verifikasi untuk membuat kata sandi baru.
            </p>
          </div>

          {isSubmitted ? (
            <div className="mt-6 rounded-2xl border border-[#CCFBF1] bg-[#F0FDFA] p-5 text-center text-xs text-[#0F766E]">
              <CheckCircle2 className="mx-auto h-8 w-8 text-[#0F766E] mb-2" />
              <p className="font-bold text-sm">Tautan Terkirim!</p>
              <p className="mt-1 text-[#6B6E6E]">
                Instruksi pemulihan telah dikirim ke <span className="font-bold text-[#1C1A16]">{email}</span>. Silakan periksa kotak masuk atau spam email Anda.
              </p>
              <Link
                href="/login"
                className="mt-5 inline-block rounded-xl bg-[#0F766E] px-6 py-2.5 text-xs font-bold text-white transition hover:bg-[#0D5C56]"
              >
                Kembali ke Halaman Masuk
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1A16]">Alamat Email</label>
                <div className="mt-1.5 flex items-center rounded-xl border border-[#EAE6E1] bg-[#FAF9F6] px-3.5 py-3 focus-within:border-[#0F766E] focus-within:bg-white">
                  <Mail className="h-4 w-4 text-[#968A80] mr-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full bg-transparent text-sm text-[#1C1A16] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#0F766E] py-3 text-xs font-bold text-white shadow-md shadow-[#0F766E]/20 transition hover:bg-[#0D5C56]"
              >
                Kirim Tautan Pemulihan
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:underline"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Kembali ke Halaman Masuk</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      <WhatsAppFloating />
      <Footer />
    </div>
  );
}
