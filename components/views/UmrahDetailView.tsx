'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Calendar,
  Plane,
  Building,
  ShieldCheck,
  CheckCircle2,
  Users,
  MapPin,
  Clock,
  Share2,
  ShoppingBag,
} from 'lucide-react';
import { figmaAssets } from '@/lib/figma-data';
import { useCartStore } from '@/store/cartStore';
import { getAdminWhatsAppAction } from '@/actions/admin';

interface UmrahDetailViewProps {
  pkg: any;
  setScreen?: (screen: string) => void;
  setSelectedPackageForCheckout?: (item: any) => void;
}

export function UmrahDetailView({ pkg, setScreen, setSelectedPackageForCheckout }: UmrahDetailViewProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [waNumber, setWaNumber] = useState('6281234567890');

  useEffect(() => {
    getAdminWhatsAppAction().then(res => setWaNumber(res.adminWhatsApp)).catch(console.error);
  }, []);

  const handleBooking = () => {
    const text = encodeURIComponent(`Halo Safara Travel, saya tertarik untuk mendaftar paket Umrah: *${pkg.title}*. Mohon informasinya.`);
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
  };

  const imageUrl = pkg.images?.[0]?.imageUrl || pkg.image || figmaAssets.kaabaImage;
  const priceFormatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(pkg.price));
  const airlineStr = pkg.includes?.find((i: string) => i.toLowerCase().includes('airlines') || i.toLowerCase().includes('garuda') || i.toLowerCase().includes('saudia')) || 'Direct Flight';
  const makkahHotel = pkg.includes?.find((i: string) => i.toLowerCase().includes('makkah')) || 'Fairmont Makkah Clock Royal Tower';
  const madinahHotel = pkg.includes?.find((i: string) => i.toLowerCase().includes('madinah')) || 'The Oberoi Madinah';
  const seatsLeft = pkg.schedules?.[0] ? pkg.schedules[0].quota - pkg.schedules[0].bookedCount : 20;

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-32">
      {/* Top Breadcrumb */}
      <div className="border-b border-[#EAE6E1] bg-white py-3.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 text-xs text-[#6B6E6E]">
          <button
            onClick={() => router.push('/tours')}
            className="flex items-center gap-1.5 font-bold text-[#0F766E] hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Kembali ke Daftar Paket</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-[11px] font-bold text-[#D97706]">
              ● Sisa {seatsLeft} Kursi Tersedia
            </span>
          </div>
        </div>
      </div>

      {/* Hero Banner (Figma hero-banner) */}
      <div className="relative min-h-[360px] bg-[#1C1A16] overflow-hidden">
        <img
          src={imageUrl}
          alt={pkg.title}
          className="absolute inset-0 h-full w-full object-cover opacity-60 filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A16] via-[#1C1A16]/50 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8 text-white">
          <span className="inline-block rounded-md bg-[#0F766E] px-3 py-1 text-xs font-bold uppercase tracking-wider">
            Umrah Premium
          </span>
          <h1 className="mt-3 font-['Figtree'] text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl max-w-4xl leading-tight">
            {pkg.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-white/80 leading-relaxed">
            {pkg.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-md">
              <Calendar className="h-4 w-4 text-[#CCFBF1]" />
              <span>Keberangkatan: {pkg.schedules?.[0]?.startDate ? new Date(pkg.schedules[0].startDate).toLocaleDateString() : 'TBA'}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-md">
              <Plane className="h-4 w-4 text-[#CCFBF1]" />
              <span>{airlineStr}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-md">
              <Clock className="h-4 w-4 text-[#CCFBF1]" />
              <span>{pkg.durationDays} Hari</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.8fr_1fr]">
          <div className="space-y-10">
            {/* Fasilitas Premium Termasuk */}
            <div className="rounded-3xl border border-[#EAE6E1] bg-white p-7 shadow-sm">
              <h2 className="font-['Figtree'] text-xl font-bold text-[#1C1A16]">
                Fasilitas Premium Termasuk
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    title: 'Akomodasi Bintang 5',
                    sub: 'Fairmont Clock Tower & The Oberoi Madinah',
                  },
                  {
                    title: 'Penerbangan Langsung',
                    sub: 'Saudi Airlines / Garuda Indonesia (Direct Flight)',
                  },
                  {
                    title: 'Visa Umrah & Asuransi',
                    sub: 'Pengurusan visa resmi & asuransi perjalanan komprehensif',
                  },
                  {
                    title: 'Bimbingan Sesuai Sunnah',
                    sub: 'Dibimbing oleh Asatidz lulusan Madinah University',
                  },
                  {
                    title: 'Transportasi VIP Haramain',
                    sub: 'Bus eksekutif full AC dan Kereta Cepat Haramain',
                  },
                  {
                    title: 'Handling & Perlengkapan',
                    sub: 'Koper fiber, kain ihram / mukena eksklusif, tas paspor',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-2xl border border-[#EAE6E1] bg-[#FAF9F6] p-4"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[#0F766E] mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-[#1C1A16]">{item.title}</h4>
                      <p className="mt-0.5 text-[11px] text-[#6B6E6E]">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Akomodasi Hotel Premium */}
            <div className="rounded-3xl border border-[#EAE6E1] bg-white p-7 shadow-sm">
              <h2 className="font-['Figtree'] text-xl font-bold text-[#1C1A16]">
                Akomodasi Hotel Premium
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#EAE6E1] p-5 bg-[#FAF9F6]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F766E]">
                    Makkah Al-Mukarramah
                  </span>
                  <h3 className="mt-1 font-['Figtree'] text-base font-bold text-[#1C1A16]">
                    {makkahHotel}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#6B6E6E]">
                    Terletak strategis dekat halaman utama Masjidil Haram. Akses lift langsung memudahkan ibadah keluarga.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#EAE6E1] p-5 bg-[#FAF9F6]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F766E]">
                    Madinah Al-Munawwarah
                  </span>
                  <h3 className="mt-1 font-['Figtree'] text-base font-bold text-[#1C1A16]">
                    {madinahHotel}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#6B6E6E]">
                    Akses terdekat ke pelataran Masjid Nabawi. Menyuguhkan layanan eksklusif bintang 5 standar dunia.
                  </p>
                </div>
              </div>
            </div>

            {/* Itinerary */}
            {pkg.itinerary && pkg.itinerary.length > 0 && (
              <div className="rounded-3xl border border-[#EAE6E1] bg-white p-7 shadow-sm">
                <h2 className="font-['Figtree'] text-xl font-bold text-[#1C1A16]">
                  Rencana Perjalanan (Itinerary)
                </h2>
                <div className="mt-6 space-y-6">
                  {pkg.itinerary.map((step: any, idx: number) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F766E] text-xs font-bold text-white">
                          {idx + 1}
                        </div>
                        {idx !== pkg.itinerary.length - 1 && (
                          <div className="mt-2 h-full w-0.5 bg-[#EAE6E1]" />
                        )}
                      </div>
                      <div className="pb-4">
                        <span className="text-xs font-bold text-[#0F766E]">{step.day}</span>
                        <h4 className="font-bold text-sm text-[#1C1A16]">{step.title}</h4>
                        <p className="mt-1.5 text-xs text-[#6B6E6E] leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Syarat & Ketentuan */}
            {pkg.terms && pkg.terms.length > 0 && (
              <div className="rounded-3xl border border-[#EAE6E1] bg-white p-7 shadow-sm">
                <h3 className="font-['Figtree'] text-base font-bold text-[#1C1A16]">
                  Syarat & Ketentuan Pendaftaran
                </h3>
                <ul className="mt-4 space-y-2 text-xs text-[#6B6E6E] leading-relaxed">
                  {pkg.terms.map((term: string, i: number) => (
                    <li key={i}>{term}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sticky Booking Card */}
          <aside className="sticky top-28 h-fit space-y-5">
            <div className="rounded-3xl border border-[#EAE6E1] bg-white p-6 shadow-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#968A80]">
                Total Biaya Paket
              </span>
              <div className="mt-1 font-['Figtree'] text-3xl font-bold text-[#0F766E]">
                {priceFormatted}
              </div>
              <span className="text-xs text-[#968A80]">
                Harga nett (Quad-Room sharing bed bintang 5)
              </span>

              <div className="my-6 space-y-3 border-y border-[#EAE6E1] py-5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6B6E6E]">Jadwal Penerbangan:</span>
                  <span className="font-bold text-[#1C1A16]">{pkg.schedules?.[0]?.startDate ? new Date(pkg.schedules[0].startDate).toLocaleDateString() : 'TBA'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6E6E]">Maskapai:</span>
                  <span className="font-bold text-[#1C1A16]">{airlineStr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6E6E]">Sisa Seat:</span>
                  <span className="font-bold text-[#D97706]">Sisa {seatsLeft} Kursi</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">

                <button
                  onClick={handleBooking}
                  className="w-full rounded-2xl bg-[#0F766E] py-4 text-sm font-bold text-white shadow-md shadow-[#0F766E]/20 transition hover:bg-[#0D5C56]"
                >
                  Daftar Paket Umrah Sekarang
                </button>
              </div>

              <p className="mt-4 text-center text-[11px] text-[#968A80]">
                Uang Muka (DP) Rp 10.000.000 / pax dibayarkan setelah pengisian data.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
