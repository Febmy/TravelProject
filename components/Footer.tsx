'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Mail, Phone, MapPin, ShieldCheck, Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#EAE6E1] bg-white pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F766E] text-white">
                <Compass className="h-5 w-5" />
              </div>
              <span className="font-['Figtree'] text-xl font-bold tracking-tight text-[#1C1A16]">
                Safara<span className="text-[#0F766E]"> Travel</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#6B6E6E]">
              Platform pemesanan hotel premium dan paket Umrah tepercaya di Indonesia. Menghadirkan
              kenyamanan perjalanan ibadah dan liburan keluarga Anda dengan standar terbaik.
            </p>
            <div className="mt-5 space-y-2 text-xs text-[#6B6E6E]">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#0F766E]" />
                <span>Jl. Sudirman No. 45, Senayan, Jakarta Selatan 12190</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#0F766E]" />
                <span>+62 21-5544-7890 / 0812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#0F766E]" />
                <span>layanan@safaratravel.com</span>
              </div>
            </div>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1C1A16]">Layanan</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-[#6B6E6E]">
              <li>
                <Link href="/hotels" className="transition hover:text-[#0F766E]">
                  Pemesanan Hotel
                </Link>
              </li>
              <li>
                <Link href="/umrah" className="transition hover:text-[#0F766E]">
                  Paket Umrah Premium
                </Link>
              </li>
              <li>
                <Link href="/promo" className="transition hover:text-[#0F766E]">
                  Promo Eksklusif
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="transition hover:text-[#0F766E]">
                  Cek Reservasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1C1A16]">
              Perusahaan
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-[#6B6E6E]">
              <li>
                <Link href="/about" className="transition hover:text-[#0F766E]">
                  Tentang Safara
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition hover:text-[#0F766E]">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition hover:text-[#0F766E]">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/design-system" className="transition hover:text-[#0F766E]">
                  Dokumentasi Design System
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#968A80] hover:text-[#0F766E]"
                >
                  <Lock className="h-3 w-3" />
                  <span>Portal Staf Internal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Keamanan & Legalitas */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1C1A16]">
              Izin Resmi
            </h4>
            <p className="mt-4 text-xs leading-relaxed text-[#6B6E6E]">
              Terdaftar resmi di Kementerian Agama RI (Izin PPIU No. 912/2021) dan bersertifikasi IATA
              untuk penerbangan internasional.
            </p>
            <div className="mt-4 rounded-xl border border-[#EAE6E1] bg-[#FAF9F6] p-3">
              <span className="text-xs font-semibold text-[#0F766E]">Jaminan 100% Aman</span>
              <p className="mt-1 text-[11px] text-[#968A80]">
                Pemesanan terlindungi oleh sistem enkripsi bank dan garansi seat pasti berangkat.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-[#EAE6E1]" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-[#6B6E6E] sm:flex-row">
          <p>© 2026 Safara Travel. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-[#968A80]">Metode Pembayaran:</span>
            {['BCA', 'Mandiri', 'BNI', 'BRI', 'Visa', 'Mastercard', 'QRIS'].map((p) => (
              <span
                key={p}
                className="rounded-md border border-[#EAE6E1] bg-[#FAF9F6] px-2 py-0.5 font-mono text-[10px] font-bold text-[#1C1A16]"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
