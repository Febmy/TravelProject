'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Plane,
  Calendar,
  ShieldCheck,
  Star,
  Users,
  ArrowRight,
  Building,
  CheckCircle2,
  RotateCcw,
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  Clock,
  Banknote,
} from 'lucide-react';
import { figmaUmrahPackages, UmrahPackage, figmaAssets } from '@/lib/figma-data';
import { useRouter } from 'next/navigation';

interface UmrahListingViewProps {
  initialPackages?: any[];
}

export function UmrahListingView({ initialPackages = [] }: UmrahListingViewProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [selectedAirline, setSelectedAirline] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [maxBudget, setMaxBudget] = useState<number>(65000000);

  const durationOptions = [
    { id: 'all', label: 'Semua Durasi' },
    { id: '9', label: '9 Hari' },
    { id: '12', label: '12 Hari' },
    { id: '14', label: '14+ Hari' },
  ];

  const airlineOptions = [
    { id: 'all', label: 'Semua Maskapai' },
    { id: 'garuda', label: 'Garuda Indonesia' },
    { id: 'saudi', label: 'Saudia Airlines' },
    { id: 'turkish', label: 'Turkish Airlines' },
  ];

  const monthOptions = [
    { id: 'all', label: 'Semua Bulan' },
    { id: '03', label: 'Maret 2026' },
    { id: '04', label: 'April 2026 (Ramadhan)' },
    { id: '05', label: 'Mei 2026 (Syawal)' },
    { id: '12', label: 'Desember 2026 (Liburan)' },
  ];

  const filteredPackages = useMemo(() => {
    return initialPackages.filter((pkg) => {
      // 1. Text Search Match
      const matchesSearch =
        !searchQuery ||
        pkg.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pkg.includes &&
          pkg.includes.some((inc: string) => inc.toLowerCase().includes(searchQuery.toLowerCase())));

      // 2. Duration Match
      const durationStr = pkg.durationDays ? pkg.durationDays.toString() : '';
      const matchDuration =
        selectedDuration === 'all' ||
        (selectedDuration === '9' && durationStr === '9') ||
        (selectedDuration === '12' && durationStr === '12') ||
        (selectedDuration === '14' && Number(pkg.durationDays) >= 14);

      // 3. Airline Match
      const matchAirline =
        selectedAirline === 'all' ||
        (pkg.includes &&
          pkg.includes.some((inc: string) => inc.toLowerCase().includes(selectedAirline.toLowerCase())));

      // 4. Price Match
      const matchPrice = Number(pkg.price) <= maxBudget;

      return matchesSearch && matchDuration && matchAirline && matchPrice;
    });
  }, [searchQuery, selectedDuration, selectedAirline, maxBudget, initialPackages]);

  const isFiltered =
    searchQuery !== '' ||
    selectedDuration !== 'all' ||
    selectedAirline !== 'all' ||
    selectedMonth !== 'all' ||
    maxBudget !== 65000000;

  const handleReset = () => {
    setSearchQuery('');
    setSelectedDuration('all');
    setSelectedAirline('all');
    setSelectedMonth('all');
    setMaxBudget(65000000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      {/* 1. MODERN TRAVEL FILTER STRIPE */}
      <section className="sticky top-0 z-40 border-b border-[#EAE6E1] bg-white/95 backdrop-blur-md py-3.5 shadow-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Search Input */}
            <div className="flex items-center gap-2 rounded-2xl bg-[#FAF9F6] px-3.5 py-2 font-medium text-[#1C1A16] border border-[#EAE6E1] focus-within:border-[#0F766E] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0F766E]/15 transition shadow-2xs">
              <Search className="h-4 w-4 text-[#0F766E] shrink-0" />
              <input
                type="text"
                placeholder="Cari nama paket, program..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs font-semibold outline-none w-36 sm:w-48 text-[#1C1A16] placeholder:text-[#968A80]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="rounded-full p-0.5 text-[#968A80] hover:bg-[#EAE6E1] hover:text-[#1C1A16] transition"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Durasi Filter Pills */}
            <div className="flex items-center gap-1 rounded-2xl border border-[#EAE6E1] bg-[#FAF9F6] p-1 text-xs">
              <div className="flex items-center gap-1 px-2 text-[#968A80] font-semibold hidden md:flex">
                <Clock className="h-3.5 w-3.5 text-[#0F766E]" />
                <span className="text-[10px]">Durasi:</span>
              </div>
              {durationOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedDuration(opt.id)}
                  className={`rounded-xl px-2.5 py-1 text-xs font-bold transition ${
                    selectedDuration === opt.id
                      ? 'bg-[#0F766E] text-white shadow-xs'
                      : 'text-[#6B6E6E] hover:text-[#1C1A16] hover:bg-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Maskapai Selector */}
            <div className="flex items-center gap-1.5 rounded-2xl border border-[#EAE6E1] bg-white px-3 py-1.5 shadow-2xs hover:border-[#0F766E]/50 transition">
              <Plane className="h-3.5 w-3.5 text-[#0F766E]" />
              <span className="text-[10px] text-[#968A80] font-bold uppercase hidden lg:inline">Maskapai:</span>
              <select
                value={selectedAirline}
                onChange={(e) => setSelectedAirline(e.target.value)}
                className="bg-transparent font-bold text-xs text-[#1C1A16] outline-none cursor-pointer"
              >
                {airlineOptions.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Selector */}
            <div className="flex items-center gap-1.5 rounded-2xl border border-[#EAE6E1] bg-white px-3 py-1.5 shadow-2xs hover:border-[#0F766E]/50 transition">
              <Banknote className="h-3.5 w-3.5 text-[#0F766E]" />
              <span className="text-[10px] text-[#968A80] font-bold uppercase hidden lg:inline">Budget:</span>
              <select
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="bg-transparent font-bold text-xs text-[#1C1A16] outline-none cursor-pointer"
              >
                <option value={65000000}>Semua Budget (s/d 65 Juta)</option>
                <option value={50000000}>Hingga Rp 50 Juta</option>
                <option value={45000000}>Hingga Rp 45 Juta</option>
                <option value={40000000}>Hingga Rp 40 Juta</option>
                <option value={35000000}>Hingga Rp 35 Juta (Hemat)</option>
              </select>
            </div>

            {/* Reset Button */}
            {isFiltered && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] px-2.5 py-1.5 text-xs font-bold text-[#0F766E] hover:bg-[#CCFBF1] transition shadow-2xs"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Right Trust Badge */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DCFCE7] border border-[#BBF7D0] px-3 py-1 text-xs font-bold text-[#15803D] shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-[#16A34A]" />
              PPIU Resmi Kemenag No. 912/2021
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
