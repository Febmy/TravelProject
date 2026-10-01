'use client';

import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  Search,
  SlidersHorizontal,
  Star,
  Check,
  RotateCcw,
  ArrowUpDown,
  Building2,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface HotelSearchViewProps {
  initialHotels?: any[];
}

export function HotelSearchView({ initialHotels = [] }: HotelSearchViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || '');
  const [selectedArea, setSelectedArea] = useState<string>('Semua');
  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [selectedStar, setSelectedStar] = useState<number>(0);
  const [selectedFacility, setSelectedFacility] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating-desc'>('recommended');

  const facilities = [
    'Kolam Renang',
    'Pusat Kebugaran',
    'Sarapan',
    'Spa',
    'Akses Pantai',
  ];

  const areas = ['Semua', 'Seminyak', 'Ubud', 'Magelang'];

  const filteredHotels = useMemo(() => {
    return initialHotels
      .filter((hotel) => {
        const matchesQuery =
          !searchQuery ||
          hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hotel.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesArea =
          selectedArea === 'Semua' ||
          hotel.location.toLowerCase().includes(selectedArea.toLowerCase());

        const matchesPrice = Number(hotel.price) <= maxPrice;

        const matchesStar =
          selectedStar === 0 || Math.floor(hotel.rating || 5) >= selectedStar;

        const matchesFacility =
          !selectedFacility ||
          (hotel.amenities && hotel.amenities.some((a: string) =>
            a.toLowerCase().includes(selectedFacility.toLowerCase())
          ));

        return matchesQuery && matchesArea && matchesPrice && matchesStar && matchesFacility;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
        if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
        if (sortBy === 'rating-desc') return b.rating - a.rating;
        return 0;
      });
  }, [searchQuery, selectedArea, maxPrice, selectedStar, selectedFacility, sortBy, initialHotels]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedArea('Semua');
    setMaxPrice(10000000);
    setSelectedStar(0);
    setSelectedFacility('');
    setSortBy('recommended');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      {/* 1. SEARCH QUERY BAR (Figma search-query-bar) */}
      <section className="border-b border-[#EAE6E1] bg-white py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            {/* Live Search Input */}
            <div className="flex items-center gap-2 rounded-xl bg-[#FAF9F6] px-3.5 py-2 font-bold text-[#1C1A16] border border-[#EAE6E1] focus-within:border-[#0F766E] focus-within:bg-white transition">
              <Search className="h-4 w-4 text-[#0F766E]" />
              <input
                type="text"
                placeholder="Cari nama hotel atau kota..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs font-semibold outline-none w-48 sm:w-60"
              />
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-[#FAF9F6] px-3.5 py-2 text-[#6B6E6E] border border-[#EAE6E1] focus-within:border-[#0F766E] focus-within:bg-white transition">
              <Calendar className="h-4 w-4 shrink-0 text-[#0F766E]" />
              <input type="date" defaultValue="2026-03-12" className="bg-transparent text-xs font-semibold outline-none cursor-pointer text-[#1C1A16]" title="Check-in" />
              <span className="text-xs font-bold">-</span>
              <input type="date" defaultValue="2026-03-15" className="bg-transparent text-xs font-semibold outline-none cursor-pointer text-[#1C1A16]" title="Check-out" />
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-[#FAF9F6] px-3.5 py-2 text-[#6B6E6E] border border-[#EAE6E1] focus-within:border-[#0F766E] focus-within:bg-white transition">
              <Users className="h-4 w-4 shrink-0 text-[#0F766E]" />
              <div className="flex items-center text-xs font-semibold text-[#1C1A16]">
                <input type="number" min="1" defaultValue="2" className="w-8 bg-transparent outline-none text-center" title="Tamu" /> Tamu,
                <input type="number" min="1" defaultValue="1" className="w-9 bg-transparent outline-none text-center ml-1" title="Kamar" /> Kamar
              </div>
            </div>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#968A80]">Urutkan:</span>
            <div className="flex items-center gap-1.5 rounded-xl border border-[#EAE6E1] bg-white px-3 py-1.5 font-semibold text-[#1C1A16]">
              <ArrowUpDown className="h-3.5 w-3.5 text-[#0F766E]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-semibold outline-none cursor-pointer text-[#1C1A16]"
              >
                <option value="recommended">Rekomendasi Utama</option>
                <option value="price-asc">Harga Terendah</option>
                <option value="price-desc">Harga Tertinggi</option>
                <option value="rating-desc">Rating Tertinggi</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEARCH CONTENT (Figma search-content) */}
      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          {/* Left Sidebar: Filter Pencarian */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-[#EAE6E1] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#EAE6E1] pb-4">
                <div className="flex items-center gap-2 font-['Figtree'] font-bold text-sm text-[#1C1A16]">
                  <SlidersHorizontal className="h-4 w-4 text-[#0F766E]" />
                  <span>Filter Pencarian</span>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 text-xs font-semibold text-[#0F766E] hover:underline"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Price Range Slider */}
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1C1A16]">Harga Maks / Malam</span>
                  <span className="font-mono text-xs font-bold text-[#0F766E]">
                    Rp {maxPrice.toLocaleString('id-ID')}
                  </span>
                </div>
                <input
                  type="range"
                  min="4000000"
                  max="12000000"
                  step="500000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="mt-3 w-full accent-[#0F766E] cursor-pointer"
                />
                <div className="mt-1 flex justify-between text-[10px] text-[#968A80]">
                  <span>Rp 4.000.000</span>
                  <span>Rp 12.000.000+</span>
                </div>
              </div>

              {/* Star Rating Filter */}
              <div className="mt-6 border-t border-[#EAE6E1] pt-5">
                <span className="text-xs font-bold text-[#1C1A16]">Kelas Bintang Minimal</span>
                <div className="mt-3 flex gap-2">
                  {[0, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setSelectedStar(selectedStar === star ? 0 : star)}
                      className={`flex flex-1 items-center justify-center gap-1 rounded-xl border py-2 text-xs font-bold transition ${
                        selectedStar === star
                          ? 'border-[#0F766E] bg-[#F0FDFA] text-[#0F766E]'
                          : 'border-[#EAE6E1] bg-white text-[#6B6E6E] hover:border-[#0F766E]'
                      }`}
                    >
                      <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                      <span>{star === 0 ? 'Semua' : `${star} Bintang`}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Area Destinasi */}
              <div className="mt-6 border-t border-[#EAE6E1] pt-5">
                <span className="text-xs font-bold text-[#1C1A16]">Area Destinasi</span>
                <div className="mt-3 space-y-2">
                  {areas.map((a) => (
                    <label
                      key={a}
                      onClick={() => setSelectedArea(a)}
                      className="flex cursor-pointer items-center justify-between rounded-lg p-1.5 text-xs hover:bg-[#FAF9F6]"
                    >
                      <span className={selectedArea === a ? 'font-bold text-[#0F766E]' : 'text-[#6B6E6E]'}>
                        {a}
                      </span>
                      <input
                        type="radio"
                        name="area"
                        checked={selectedArea === a}
                        onChange={() => setSelectedArea(a)}
                        className="accent-[#0F766E]"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Fasilitas Hotel */}
              <div className="mt-6 border-t border-[#EAE6E1] pt-5">
                <span className="text-xs font-bold text-[#1C1A16]">Fasilitas Hotel</span>
                <div className="mt-3 space-y-2.5">
                  {facilities.map((f) => (
                    <label
                      key={f}
                      onClick={() => setSelectedFacility(selectedFacility === f ? '' : f)}
                      className="flex cursor-pointer items-center gap-2.5 text-xs text-[#6B6E6E]"
                    >
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded border transition ${
                          selectedFacility === f
                            ? 'border-[#0F766E] bg-[#0F766E] text-white'
                            : 'border-[#EAE6E1] bg-white'
                        }`}
                      >
                        {selectedFacility === f && <Check className="h-3 w-3" />}
                      </div>
                      <span>{f}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Results Grid */}
          <main>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-[#6B6E6E]">
                Menampilkan <strong className="text-[#1C1A16]">{filteredHotels.length} hotel premium</strong>{' '}
                yang sesuai kriteria
              </span>
            </div>

            {filteredHotels.length === 0 ? (
              <div className="rounded-3xl border border-[#EAE6E1] bg-white p-12 text-center shadow-sm">
                <Building2 className="h-10 w-10 text-[#968A80] mx-auto mb-3" />
                <h3 className="font-bold text-base text-[#1C1A16]">Tidak Ada Hotel yang Sesuai</h3>
                <p className="mt-1 text-xs text-[#6B6E6E]">
                  Coba sesuaikan range harga atau hapus filter untuk melihat pilihan properti lainnya.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-5 rounded-xl bg-[#0F766E] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0D5C56]"
                >
                  Reset Semua Filter
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredHotels.map((hotel: any) => (
                  <div
                    key={hotel.id}
                    onClick={() => router.push(`/hotels/${hotel.slug || hotel.id}`)}
                    className="group flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-[#EAE6E1] bg-white shadow-sm transition hover:shadow-lg hover:border-[#0F766E]/50 cursor-pointer"
                  >
                    {/* Thumb 16:10 */}
                    <div className="relative h-56 w-full sm:h-auto sm:w-72 shrink-0 bg-[#EAE6E1] overflow-hidden">
                      <img
                        src={hotel.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1542314831-c6a4d14d8387'}
                        alt={hotel.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 rounded-full bg-[#1C1A16]/80 px-2.5 py-1 text-[10px] font-semibold text-white">
                        {hotel.tag || 'Rekomendasi'}
                      </span>
                    </div>

                    {/* Body Content */}
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs font-semibold text-[#968A80]">
                              {hotel.location} · {hotel.tag || 'Hotel'}
                            </span>
                            <h3 className="mt-1 font-['Figtree'] text-xl font-bold text-[#1C1A16] group-hover:text-[#0F766E] transition">
                              {hotel.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1 rounded-xl bg-[#F0FDFA] px-2.5 py-1 text-xs font-bold text-[#0F766E]">
                            <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                            <span>{hotel.rating || 5.0}</span>
                          </div>
                        </div>

                        <p className="mt-2 text-xs leading-relaxed text-[#6B6E6E] line-clamp-2">
                          {hotel.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {(hotel.amenities || []).slice(0, 3).map((a: string) => (
                            <span
                              key={a}
                              className="rounded-md bg-[#FAF9F6] border border-[#EAE6E1] px-2 py-0.5 text-[10px] font-medium text-[#6B6E6E]"
                            >
                              ✓ {a}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 flex items-baseline justify-between border-t border-[#EAE6E1] pt-4">
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-[#968A80]">
                            Harga / malam mulai
                          </span>
                          <div className="flex items-baseline gap-1">
                            <span className="font-['Figtree'] text-lg font-bold text-[#0F766E]">
                              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(hotel.price || 0)}
                            </span>
                            <span className="text-[10px] text-[#968A80]">(Termasuk Pajak)</span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/hotels/${hotel.slug || hotel.id}`);
                          }}
                          className="rounded-xl bg-[#0F766E] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#0D5C56]"
                        >
                          Pesan Sekarang
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
