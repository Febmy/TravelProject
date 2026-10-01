'use client';

import React, { useState, useMemo } from 'react';
import { Plane, Calendar, ShieldCheck, Star, Users, ArrowRight, Building, CheckCircle2, RotateCcw } from 'lucide-react';
import { figmaUmrahPackages, UmrahPackage, figmaAssets } from '@/lib/figma-data';

import { useRouter } from 'next/navigation';

interface UmrahListingViewProps {
  initialPackages?: any[];
}

export function UmrahListingView({ initialPackages = [] }: UmrahListingViewProps) {
  const router = useRouter();
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [selectedAirline, setSelectedAirline] = useState<string>('all');
  const [maxBudget, setMaxBudget] = useState<number>(60000000);

  const filteredPackages = useMemo(() => {
    return initialPackages.filter((pkg) => {
      const durationStr = pkg.durationDays ? pkg.durationDays.toString() : '';
      const matchDuration =
        selectedDuration === 'all' ||
        (selectedDuration === '9' && durationStr === '9') ||
        (selectedDuration === '12' && durationStr === '12');

      const matchAirline =
        selectedAirline === 'all' ||
        (pkg.includes && pkg.includes.some((inc: string) => inc.toLowerCase().includes(selectedAirline.toLowerCase())));

      const matchPrice = Number(pkg.price) <= maxBudget;

      return matchDuration && matchAirline && matchPrice;
    });
  }, [selectedDuration, selectedAirline, maxBudget, initialPackages]);

  const handleReset = () => {
    setSelectedDuration('all');
    setSelectedAirline('all');
    setMaxBudget(60000000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      {/* 1. FILTER STRIPE (Figma filter-stripe) */}
      <section className="border-b border-[#EAE6E1] bg-white py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Filter Durasi */}
            <div className="flex items-center gap-2 rounded-xl border border-[#EAE6E1] bg-[#FAF9F6] px-3 py-2">
              <Calendar className="h-4 w-4 text-[#0F766E]" />
              <div>
                <span className="block text-[10px] text-[#968A80]">Durasi Hari:</span>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="bg-transparent font-bold text-[#1C1A16] outline-none cursor-pointer"
                >
                  <option value="all">Semua Durasi</option>
                  <option value="9">9 Hari 8 Malam</option>
                  <option value="12">12 Hari 11 Malam</option>
                </select>
              </div>
            </div>

            {/* Filter Maskapai */}
            <div className="flex items-center gap-2 rounded-xl border border-[#EAE6E1] bg-[#FAF9F6] px-3 py-2">
              <Plane className="h-4 w-4 text-[#0F766E]" />
              <div>
                <span className="block text-[10px] text-[#968A80]">Maskapai:</span>
                <select
                  value={selectedAirline}
                  onChange={(e) => setSelectedAirline(e.target.value)}
                  className="bg-transparent font-bold text-[#1C1A16] outline-none cursor-pointer"
                >
                  <option value="all">Semua Maskapai</option>
                  <option value="garuda">Garuda Indonesia</option>
                  <option value="saudi">Saudi Airlines</option>
                  <option value="turkish">Turkish Airlines</option>
                </select>
              </div>
            </div>

            {/* Budget filter */}
            <div className="flex items-center gap-2 rounded-xl border border-[#EAE6E1] bg-[#FAF9F6] px-3 py-2">
              <span className="font-bold text-[#0F766E]">Rp</span>
              <div>
                <span className="block text-[10px] text-[#968A80]">Batas Budget:</span>
                <select
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="bg-transparent font-bold text-[#1C1A16] outline-none cursor-pointer"
                >
                  <option value={60000000}>Hingga Rp 60 Juta</option>
                  <option value={45000000}>Hingga Rp 45 Juta</option>
                  <option value={40000000}>Hingga Rp 40 Juta</option>
                </select>
              </div>
            </div>

            {(selectedDuration !== 'all' || selectedAirline !== 'all' || maxBudget !== 60000000) && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs font-semibold text-[#0F766E] hover:underline px-2"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-bold text-[#15803D]">
              ✓ PPIU Resmi Kemenag No. 912/2021
            </span>
          </div>
        </div>
      </section>

      {/* 2. LISTING MAIN (Figma listing-main) */}
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E]">
            Paket Perjalanan Ibadah
          </span>
          <h1 className="mt-1 font-['Figtree'] text-3xl font-bold tracking-tight text-[#1C1A16]">
            Paket Umrah Terbaik Safara
          </h1>
          <p className="mt-1 text-sm text-[#6B6E6E]">
            Menampilkan {filteredPackages.length} paket umrah bintang 5 terdekat, bimbingan asatidz sunnah, dan penerbangan direct.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="mt-8 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {filteredPackages.length === 0 && (
            <div className="col-span-full py-12 text-center text-[#6B6E6E]">
              Tidak ada paket umrah yang cocok dengan filter yang dipilih.
            </div>
          )}
          {filteredPackages.map((pkg) => {
            const imageUrl = pkg.images?.[0]?.imageUrl || pkg.image || figmaAssets.kaabaImage;
            const priceFormatted = new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 0,
            }).format(Number(pkg.price));
            const airlineStr = pkg.includes?.find((i: string) => i.toLowerCase().includes('airlines') || i.toLowerCase().includes('garuda') || i.toLowerCase().includes('saudia')) || 'Direct Flight';
            const makkahHotel = pkg.includes?.find((i: string) => i.toLowerCase().includes('makkah')) || 'Hotel Bintang 5';
            const madinahHotel = pkg.includes?.find((i: string) => i.toLowerCase().includes('madinah')) || 'Hotel Bintang 5';

            return (
              <div
                key={pkg.id}
                onClick={() => router.push(`/umrah/${pkg.slug || pkg.id}`)}
                className="group cursor-pointer overflow-hidden rounded-3xl border border-[#EAE6E1] bg-white shadow-sm transition hover:shadow-xl hover:border-[#0F766E]/50"
              >
                {/* Image */}
                <div className="relative h-56 w-full bg-[#EAE6E1] overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={pkg.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-3.5 left-3.5 rounded-full bg-[#0F766E] px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                    Umrah Premium
                  </span>
                  <span className="absolute top-3.5 right-3.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                    {pkg.durationDays} Hari
                  </span>
                </div>

                {/* Body */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-[#968A80]">
                    <Plane className="h-3.5 w-3.5 text-[#0F766E]" />
                    <span className="line-clamp-1">{airlineStr}</span>
                  </div>

                  <h3 className="mt-2 font-['Figtree'] text-lg font-bold text-[#1C1A16] group-hover:text-[#0F766E] transition line-clamp-2">
                    {pkg.title}
                  </h3>

                  <div className="mt-4 space-y-1.5 border-t border-[#EAE6E1] pt-3 text-xs text-[#6B6E6E]">
                    <div className="flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5 text-[#0F766E]" />
                      <span className="line-clamp-1">{makkahHotel}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5 text-[#0F766E]" />
                      <span className="line-clamp-1">{madinahHotel}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-baseline justify-between border-t border-[#EAE6E1] pt-4">
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-[#968A80]">
                        Harga mulai dari
                      </span>
                      <span className="font-['Figtree'] text-lg font-bold text-[#0F766E]">
                        {priceFormatted}
                      </span>
                    </div>

                    <button
                      className="flex items-center gap-1 rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0D5C56]"
                    >
                      <span>Lihat Detail</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
