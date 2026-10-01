'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  Search,
  Star,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Plane,
  Building2,
  HeartHandshake,
} from 'lucide-react';
import {
  figmaAssets,
  figmaHotels,
  figmaUmrahPackages,
  figmaTestimonials,
  HotelItem,
  UmrahPackage,
} from '@/lib/figma-data';

import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';

const destinationOptions = [
  { value: 'Bali', label: 'Bali, Indonesia' },
  { value: 'Seminyak', label: 'Seminyak, Bali' },
  { value: 'Ubud', label: 'Ubud, Bali' },
  { value: 'Magelang', label: 'Magelang, Jawa Tengah' },
  { value: 'Jakarta', label: 'Jakarta, Indonesia' },
  { value: 'Makkah', label: 'Makkah, Arab Saudi' },
  { value: 'Madinah', label: 'Madinah, Arab Saudi' },
];

const guestOptions = [
  { value: '1 Tamu, 1 Kamar', label: '1 Tamu, 1 Kamar' },
  { value: '2 Tamu, 1 Kamar', label: '2 Tamu, 1 Kamar' },
  { value: '3 Tamu, 1 Kamar', label: '3 Tamu, 1 Kamar' },
  { value: '4 Tamu, 2 Kamar', label: '4 Tamu, 2 Kamar' },
  { value: 'Rombongan (>4)', label: 'Rombongan (>4 Tamu)' },
];

const customSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#1C1A16',
    cursor: 'pointer',
    padding: 0,
    minHeight: 'auto',
  }),
  valueContainer: (base: any) => ({
    ...base,
    padding: 0,
  }),
  input: (base: any) => ({
    ...base,
    margin: 0,
    padding: 0,
    color: '#1C1A16',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    padding: '0 4px',
    color: '#0F766E',
    '&:hover': {
      color: '#0D5C56'
    }
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    border: '1px solid #EAE6E1',
    zIndex: 50,
  }),
  option: (base: any, state: any) => ({
    ...base,
    fontSize: '0.875rem',
    fontWeight: state.isSelected ? '700' : '600',
    backgroundColor: state.isSelected ? '#F0FDFA' : state.isFocused ? '#FAF9F6' : 'white',
    color: state.isSelected ? '#0F766E' : '#1C1A16',
    cursor: 'pointer',
    padding: '10px 16px',
    '&:active': {
      backgroundColor: '#CCFBF1',
    }
  }),
  singleValue: (base: any) => ({
    ...base,
    color: '#1C1A16',
  }),
};

export function HomeView() {
  const router = useRouter();
  const [destination, setDestination] = useState('Bali');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(),
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  ]);
  const [startDate, endDate] = dateRange;
  const [guests, setGuests] = useState('2 Tamu, 1 Kamar');

  const handleSearch = () => {
    if (destination === 'Makkah' || destination === 'Madinah') {
      router.push(`/umrah?destination=${encodeURIComponent(destination)}`);
    } else {
      router.push(`/hotels?q=${encodeURIComponent(destination)}`);
    }
  };

  return (
    <div className="w-full bg-[#FAF9F6]">
      {/* 1. HERO SECTION (Figma hero-section) */}
      <section className="relative min-h-[580px] w-full overflow-hidden bg-[#1C1A16]">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={figmaAssets.heroBanner}
            alt="Safara Travel Hero Background"
            className="h-full w-full object-cover object-center opacity-70 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A16]/90 via-transparent to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-center px-4 pt-20 pb-28 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#CCFBF1] backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#14B8A6] animate-pulse" />
              Safara Curated Stays & Umrah
            </span>
            <h1 className="mt-5 font-['Figtree'] text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.15]">
              Temukan Perjalanan Terbaik untuk{' '}
              <span className="text-[#80E4D2]">Jiwa dan Pikiran Anda</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/85 sm:text-lg leading-relaxed">
              Pilihan hotel kurasi terbaik dan paket perjalanan ibadah Umrah premium yang aman dan
              nyaman sesuai bimbingan terpercaya.
            </p>
          </div>

          {/* Search Bar Widget (Figma search-bar-widget) */}
          <div className="mt-12 w-full max-w-5xl rounded-3xl border border-white/10 bg-white p-3 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-[1.3fr_auto_1.1fr_auto_1.1fr_auto]">
              {/* Field 1: Destinasi */}
              <div className="flex items-center gap-3.5 rounded-2xl p-3 hover:bg-[#FAF9F6] transition">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0FDFA] text-[#0F766E]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#968A80]">
                    Destinasi
                  </span>
                  <Select
                    instanceId="destination-select"
                    options={destinationOptions}
                    value={destinationOptions.find(o => o.value === destination) || { value: destination, label: destination }}
                    onChange={(option) => setDestination(option?.value || '')}
                    styles={customSelectStyles}
                    placeholder="Pilih Destinasi"
                    isSearchable={true}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="hidden h-10 self-center w-px bg-[#EAE6E1] md:block" />

              {/* Field 2: Tanggal */}
              <div className="flex items-center gap-3.5 rounded-2xl p-3 hover:bg-[#FAF9F6] transition">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0FDFA] text-[#0F766E]">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#968A80]">
                    Check-in & Check-out
                  </span>
                  <div className="flex items-center gap-2">
                    <DatePicker
                      selectsRange={true}
                      startDate={startDate || undefined}
                      endDate={endDate || undefined}
                      onChange={(update: [Date | null, Date | null]) => {
                        setDateRange(update);
                      }}
                      minDate={new Date()}
                      dateFormat="dd MMM yyyy"
                      placeholderText="Pilih tanggal"
                      className="w-full bg-transparent text-sm font-semibold text-[#1C1A16] outline-none cursor-pointer"
                      wrapperClassName="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden h-10 self-center w-px bg-[#EAE6E1] md:block" />

              {/* Field 3: Tamu */}
              <div className="flex items-center gap-3.5 rounded-2xl p-3 hover:bg-[#FAF9F6] transition">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0FDFA] text-[#0F766E]">
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#968A80]">
                    Tamu & Kamar
                  </span>
                  <Select
                    instanceId="guest-select"
                    options={guestOptions}
                    value={guestOptions.find(o => o.value === guests) || { value: guests, label: guests }}
                    onChange={(option) => setGuests(option?.value || '')}
                    styles={customSelectStyles}
                    placeholder="Pilih Jumlah Tamu"
                    isSearchable={false}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#0F766E] px-8 py-4 text-sm font-bold text-white shadow-md shadow-[#0F766E]/30 transition hover:bg-[#0D5C56] active:scale-95"
              >
                <Search className="h-4 w-4" />
                <span>Cari</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED HOTELS SECTION (Figma featured-section) */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E]">
              Pilihan Hotel Kurasi
            </span>
            <h2 className="mt-2 font-['Figtree'] text-3xl font-bold tracking-tight text-[#1C1A16]">
              Jelajahi Destinasi Favorit
            </h2>
            <p className="mt-1 text-sm text-[#6B6E6E]">
              Koleksi properti bintang 5 dengan reputasi pelayanan terbaik di Indonesia.
            </p>
          </div>
          <button
            onClick={() => router.push('/hotels')}
            className="group flex items-center gap-1.5 text-sm font-bold text-[#0F766E] transition hover:text-[#0D5C56]"
          >
            <span>Lihat semua hotel</span>
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </button>
        </div>

        {/* Hotel Cards Grid (Composite Hotel Card spec from Figma) */}
        <div className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {figmaHotels.map((hotel) => (
            <div
              key={hotel.id}
              onClick={() => router.push(`/hotels/${hotel.id}`)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-[#EAE6E1] bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#0F766E]/40"
            >
              {/* Image with 16:10 aspect ratio */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EAE6E1]">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                {hotel.tag && (
                  <span className="absolute top-3.5 left-3.5 rounded-full bg-[#1C1A16]/75 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                    {hotel.tag}
                  </span>
                )}
                <div className="absolute top-3.5 right-3.5 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-[#1C1A16] shadow-sm">
                  <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                  <span>{hotel.rating}</span>
                </div>
              </div>

              {/* Content Block (16px padding as specified in Figma DSK) */}
              <div className="p-5">
                <span className="text-xs font-semibold text-[#968A80]">{hotel.location}</span>
                <h3 className="mt-1 font-['Figtree'] text-lg font-bold text-[#1C1A16] group-hover:text-[#0F766E] transition line-clamp-1">
                  {hotel.name}
                </h3>
                <p className="mt-1.5 text-xs text-[#6B6E6E] line-clamp-2 leading-relaxed">
                  {hotel.description}
                </p>

                <div className="mt-5 flex items-baseline justify-between border-t border-[#EAE6E1] pt-4">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#968A80]">
                      Mulai dari
                    </span>
                    <span className="font-['Figtree'] text-base font-bold text-[#0F766E]">
                      {hotel.priceFormatted}
                    </span>
                  </div>
                  <span className="rounded-xl bg-[#F0FDFA] px-3 py-1.5 text-xs font-bold text-[#0F766E] group-hover:bg-[#0F766E] group-hover:text-white transition">
                    Pesan
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. UMRAH HIGHLIGHT SECTION (Figma umrah-highlight-section) */}
      <section className="border-y border-[#EAE6E1] bg-[#F4F3ED] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left Image: Kaaba */}
            <div className="relative overflow-hidden rounded-3xl border border-[#EAE6E1] shadow-2xl">
              <img
                src={figmaAssets.kaabaImage}
                alt="Ibadah Umrah Khusyuk Safara"
                className="h-[480px] w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="rounded-md bg-[#0F766E] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                  Garansi Seat Pasti
                </span>
                <h4 className="mt-2 text-xl font-bold">Fairmont Makkah Clock Tower & Oberoi Madinah</h4>
                <p className="mt-1 text-xs text-white/80">
                  Nol meter ke pelataran ibadah, memudahkan jemaah keluarga dan orang tua tercinta.
                </p>
              </div>
            </div>

            {/* Right Information */}
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E]">
                Perjalanan Ibadah Premium
              </span>
              <h2 className="mt-2 font-['Figtree'] text-3xl font-bold tracking-tight text-[#1C1A16] sm:text-4xl leading-tight">
                Ibadah Umrah Syahdu bersama Pembimbing Berpengalaman
              </h2>
              <p className="mt-4 text-sm text-[#6B6E6E] leading-relaxed">
                Safara Travel menghadirkan paket Umrah bintang 5 dengan jaminan akomodasi terdekat ke
                Masjidil Haram dan Masjid Nabawi. Rasakan kekhusyukan penuh dalam melangkah menuju
                Baitullah.
              </p>

              {/* Feature Points from Figma */}
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F766E] shadow-sm">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1C1A16]">Hotel Bintang 5 Terdekat</h4>
                    <p className="text-xs text-[#6B6E6E]">
                      Menginap di Fairmont Clock Tower (Makkah) & Oberoi (Madinah).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F766E] shadow-sm">
                    <Plane className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1C1A16]">Penerbangan Langsung</h4>
                    <p className="text-xs text-[#6B6E6E]">
                      Menggunakan maskapai premium Saudia / Garuda Indonesia tanpa transit.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F766E] shadow-sm">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1C1A16]">Muthawwif Terbaik</h4>
                    <p className="text-xs text-[#6B6E6E]">
                      Dibimbing oleh asatidz tepercaya sesuai sunnah Rasulullah SAW.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => router.push('/tours')}
                  className="rounded-xl bg-[#0F766E] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-[#0F766E]/20 transition hover:bg-[#0D5C56]"
                >
                  Lihat Paket Umrah
                </button>
                <a
                  href="https://wa.me/6281234567890?text=Halo%20Safara,%20saya%20tertarik%20konsultasi%20paket%20umrah"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-[#EAE6E1] bg-white px-6 py-3.5 text-sm font-bold text-[#1C1A16] transition hover:bg-[#FAF9F6]"
                >
                  Hubungi Konsultan
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TESTIMONIALS SECTION (Figma testimonials-section) */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E]">
            Ulasan Pengguna
          </span>
          <h2 className="mt-2 font-['Figtree'] text-3xl font-bold tracking-tight text-[#1C1A16]">
            Kata Mereka yang Telah Berangkat
          </h2>
          <p className="mt-1 text-sm text-[#6B6E6E]">
            Kepercayaan ribuan jemaah dan tamu adalah kehormatan tertinggi bagi Safara.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-3">
          {figmaTestimonials.map((t) => (
            <div
              key={t.id}
              className="flex flex-col justify-between rounded-2xl border border-[#EAE6E1] bg-white p-6 shadow-sm transition hover:shadow-lg"
            >
              <div>
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#6B6E6E] italic">
                  &ldquo;{t.comment}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3.5 border-t border-[#EAE6E1] pt-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-11 w-11 rounded-full object-cover border border-[#EAE6E1]"
                />
                <div>
                  <h4 className="text-sm font-bold text-[#1C1A16]">{t.name}</h4>
                  <span className="text-xs text-[#968A80]">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
