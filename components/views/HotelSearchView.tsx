'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  X,
  Moon,
  Sparkles,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface HotelSearchViewProps {
  initialHotels?: any[];
}

// Helpers for modern Indonesian date formatting
const indonesianDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const indonesianMonths = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];
const indonesianMonthsShort = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

function formatShortDate(date: Date) {
  if (!date) return '';
  return `${indonesianDays[date.getDay()]}, ${date.getDate()} ${indonesianMonthsShort[date.getMonth()]}`;
}

function isSameDay(d1: Date | null, d2: Date | null) {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function isDateInRange(target: Date, start: Date | null, end: Date | null) {
  if (!target || !start || !end) return false;
  const t = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  return t > s && t < e;
}

export function HotelSearchView({ initialHotels = [] }: HotelSearchViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Adaptive Price Bounds from database
  const priceBounds = useMemo(() => {
    if (!initialHotels || initialHotels.length === 0) {
      return { min: 500000, max: 15000000, step: 250000 };
    }
    const prices = initialHotels.map((h) => Number(h.price) || 0).filter((p) => p > 0);
    if (prices.length === 0) {
      return { min: 500000, max: 15000000, step: 250000 };
    }
    const minRaw = Math.min(...prices);
    const maxRaw = Math.max(...prices);
    const min = Math.max(0, Math.floor(minRaw / 500000) * 500000);
    const max = Math.max(min + 1000000, Math.ceil(maxRaw / 1000000) * 1000000);
    const step = max - min > 10000000 ? 500000 : 250000;
    return { min, max, step };
  }, [initialHotels]);

  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || '');
  const [selectedArea, setSelectedArea] = useState<string>('Semua');
  const [maxPrice, setMaxPrice] = useState<number>(() => priceBounds.max);
  const [selectedStar, setSelectedStar] = useState<number>(0);
  const [selectedFacility, setSelectedFacility] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating-desc'>('recommended');

  // Modern Date Range Picker States
  const [checkIn, setCheckIn] = useState<Date>(() => new Date(2026, 2, 12));
  const [checkOut, setCheckOut] = useState<Date>(() => new Date(2026, 2, 15));
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => new Date(2026, 2, 1));
  const [selectingStep, setSelectingStep] = useState<'checkIn' | 'checkOut'>('checkIn');
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [isDateOpen, setIsDateOpen] = useState<boolean>(false);

  // Modern Guests & Rooms Stepper States
  const [adults, setAdults] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [rooms, setRooms] = useState<number>(1);
  const [isGuestsOpen, setIsGuestsOpen] = useState<boolean>(false);

  // Popover Click Outside Handlers
  const datePickerRef = useRef<HTMLDivElement>(null);
  const guestsPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDateOpen(false);
      }
      if (guestsPickerRef.current && !guestsPickerRef.current.contains(event.target as Node)) {
        setIsGuestsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync maxPrice when priceBounds update
  React.useEffect(() => {
    setMaxPrice(priceBounds.max);
  }, [priceBounds.max]);

  // Total calculated nights
  const totalNights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const days = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  }, [checkIn, checkOut]);

  // Calendar days grid calculation
  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  }, [calendarMonth]);

  const handleSelectDate = (date: Date) => {
    if (selectingStep === 'checkIn') {
      setCheckIn(date);
      if (checkOut <= date) {
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        setCheckOut(nextDay);
      }
      setSelectingStep('checkOut');
    } else {
      if (date > checkIn) {
        setCheckOut(date);
        setSelectingStep('checkIn');
      } else {
        setCheckIn(date);
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        setCheckOut(nextDay);
        setSelectingStep('checkOut');
      }
    }
  };

  const setPreset = (type: 'tonight' | 'tomorrow' | 'weekend' | 'week') => {
    const base = new Date(2026, 2, 12);
    if (type === 'tonight') {
      const ci = new Date(base);
      const co = new Date(base);
      co.setDate(ci.getDate() + 1);
      setCheckIn(ci);
      setCheckOut(co);
    } else if (type === 'tomorrow') {
      const ci = new Date(base);
      ci.setDate(ci.getDate() + 1);
      const co = new Date(ci);
      co.setDate(ci.getDate() + 1);
      setCheckIn(ci);
      setCheckOut(co);
    } else if (type === 'weekend') {
      const ci = new Date(base);
      const day = ci.getDay();
      const diffToFriday = (5 - day + 7) % 7 || 7;
      ci.setDate(ci.getDate() + diffToFriday);
      const co = new Date(ci);
      co.setDate(ci.getDate() + 2);
      setCheckIn(ci);
      setCheckOut(co);
    } else if (type === 'week') {
      const ci = new Date(base);
      const co = new Date(base);
      co.setDate(ci.getDate() + 7);
      setCheckIn(ci);
      setCheckOut(co);
    }
    setSelectingStep('checkIn');
  };

  // 2. Dynamic Areas Extracted from Hotels (Supports Makkah, Madinah, Bali, etc.)
  const areas = useMemo(() => {
    const areaMap = new Map<string, number>();
    initialHotels.forEach((hotel) => {
      if (hotel.location) {
        const rawArea = hotel.location.split(/[,·-]/)[0]?.trim();
        if (rawArea) {
          const capitalized = rawArea
            .split(' ')
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ');
          areaMap.set(capitalized, (areaMap.get(capitalized) || 0) + 1);
        }
      }
    });

    const sortedAreas = Array.from(areaMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);

    return ['Semua', ...sortedAreas];
  }, [initialHotels]);

  // 3. Dynamic Facilities Extracted from Hotels
  const facilities = useMemo(() => {
    const facilityCount = new Map<string, number>();
    initialHotels.forEach((h) => {
      if (Array.isArray(h.amenities)) {
        h.amenities.forEach((amenity: string) => {
          const trimmed = typeof amenity === 'string' ? amenity.trim() : '';
          if (trimmed) {
            facilityCount.set(trimmed, (facilityCount.get(trimmed) || 0) + 1);
          }
        });
      }
    });

    const sorted = Array.from(facilityCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);

    const fallbacks = [
      'WiFi Gratis',
      'Sarapan',
      'Dekat Masjidil Haram',
      'Shuttle Bus',
      'Kolam Renang',
      'Pusat Kebugaran',
      'Spa',
    ];

    return Array.from(new Set([...sorted, ...fallbacks])).slice(0, 8);
  }, [initialHotels]);

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

        const matchesPrice =
          maxPrice >= priceBounds.max || Number(hotel.price) <= maxPrice;

        const rating = Number(hotel.rating || 5);
        const matchesStar =
          selectedStar === 0 ||
          (selectedStar === 5 ? rating >= 4.8 : rating >= selectedStar);

        const matchesFacility =
          !selectedFacility ||
          (hotel.amenities &&
            hotel.amenities.some((a: string) =>
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
  }, [searchQuery, selectedArea, maxPrice, priceBounds.max, selectedStar, selectedFacility, sortBy, initialHotels]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedArea('Semua');
    setMaxPrice(priceBounds.max);
    setSelectedStar(0);
    setSelectedFacility('');
    setSortBy('recommended');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      {/* 1. MODERN TRAVEL SEARCH QUERY BAR */}
      <section className="sticky top-0 z-40 border-b border-[#EAE6E1] bg-white/95 backdrop-blur-md py-3.5 shadow-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm">
            {/* Live Search Input */}
            <div className="flex items-center gap-2 rounded-2xl bg-[#FAF9F6] px-3.5 py-2 font-medium text-[#1C1A16] border border-[#EAE6E1] focus-within:border-[#0F766E] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0F766E]/15 transition shadow-2xs">
              <Search className="h-4 w-4 text-[#0F766E] shrink-0" />
              <input
                type="text"
                placeholder="Cari hotel, kota, landmark..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs font-semibold outline-none w-44 sm:w-56 text-[#1C1A16] placeholder:text-[#968A80]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="rounded-full p-0.5 text-[#968A80] hover:bg-[#EAE6E1] hover:text-[#1C1A16] transition"
                  title="Hapus pencarian"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Interactive Modern Date Range Popover */}
            <div className="relative" ref={datePickerRef}>
              <button
                type="button"
                onClick={() => {
                  setIsDateOpen(!isDateOpen);
                  setIsGuestsOpen(false);
                }}
                className={`flex items-center gap-2.5 rounded-2xl px-3.5 py-1.5 text-xs font-semibold border transition shadow-2xs ${
                  isDateOpen
                    ? 'border-[#0F766E] bg-white ring-2 ring-[#0F766E]/20 text-[#1C1A16]'
                    : 'border-[#EAE6E1] bg-[#FAF9F6] hover:bg-white hover:border-[#0F766E]/60 text-[#1C1A16]'
                }`}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#F0FDFA] text-[#0F766E]">
                  <Calendar className="h-3.5 w-3.5" />
                </div>
                <div className="flex items-center gap-2 text-left">
                  <div>
                    <span className="block text-[9px] text-[#968A80] uppercase tracking-wider font-bold">Check-in</span>
                    <span className="font-bold text-[#1C1A16] text-xs">{formatShortDate(checkIn)}</span>
                  </div>
                  <div className="flex flex-col items-center px-1">
                    <span className="rounded-full bg-[#E6F4F1] px-2 py-0.5 text-[9px] font-bold text-[#0F766E] flex items-center gap-0.5">
                      <Moon className="h-2.5 w-2.5" />
                      {totalNights} Mlm
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-[#968A80] uppercase tracking-wider font-bold">Check-out</span>
                    <span className="font-bold text-[#1C1A16] text-xs">{formatShortDate(checkOut)}</span>
                  </div>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-[#968A80] transition-transform duration-200 ${isDateOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Modern Travel Calendar Popover */}
              {isDateOpen && (
                <div className="absolute top-full left-0 mt-2 z-50 w-[340px] sm:w-[380px] rounded-3xl border border-[#EAE6E1] bg-white p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                  {/* Quick Preset Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-3 border-b border-[#EAE6E1]">
                    {[
                      { id: 'tonight', label: 'Malam Ini (1 Mlm)' },
                      { id: 'tomorrow', label: 'Besok (1 Mlm)' },
                      { id: 'weekend', label: 'Akhir Pekan' },
                      { id: 'week', label: '1 Minggu' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPreset(p.id as any)}
                        className="shrink-0 rounded-full bg-[#FAF9F6] border border-[#EAE6E1] px-2.5 py-1 text-[10px] font-bold text-[#6B6E6E] hover:border-[#0F766E] hover:text-[#0F766E] hover:bg-[#F0FDFA] transition"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {/* Calendar Header with Navigation */}
                  <div className="mt-3.5 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#1C1A16]">
                        {indonesianMonths[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                      </h4>
                      <p className="text-[10px] text-[#968A80]">
                        {selectingStep === 'checkIn' ? 'Pilih tanggal Check-in' : 'Pilih tanggal Check-out'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#EAE6E1] text-[#6B6E6E] hover:bg-[#FAF9F6] transition"
                        title="Bulan sebelumnya"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#EAE6E1] text-[#6B6E6E] hover:bg-[#FAF9F6] transition"
                        title="Bulan berikutnya"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Day of Week Headers */}
                  <div className="mt-3 grid grid-cols-7 text-center text-[10px] font-bold text-[#968A80]">
                    {indonesianDays.map((d) => (
                      <div key={d} className="py-1">
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="mt-1 grid grid-cols-7 gap-y-1">
                    {calendarDays.map((date, idx) => {
                      if (!date) {
                        return <div key={`empty-${idx}`} className="h-9 w-9" />;
                      }

                      const isStart = isSameDay(date, checkIn);
                      const isEnd = isSameDay(date, checkOut);
                      const inRange = isDateInRange(date, checkIn, checkOut);

                      return (
                        <div
                          key={date.toISOString()}
                          className={`relative flex items-center justify-center h-9 ${
                            inRange ? 'bg-[#F0FDFA]' : ''
                          } ${isStart ? 'rounded-l-2xl bg-gradient-to-r from-transparent to-[#F0FDFA]' : ''} ${
                            isEnd ? 'rounded-r-2xl bg-gradient-to-l from-transparent to-[#F0FDFA]' : ''
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleSelectDate(date)}
                            onMouseEnter={() => setHoverDate(date)}
                            className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-semibold transition ${
                              isStart || isEnd
                                ? 'bg-[#0F766E] text-white font-bold shadow-sm ring-2 ring-[#0F766E]/30 scale-105'
                                : inRange
                                ? 'text-[#0F766E] font-bold hover:bg-[#CCFBF1]'
                                : 'text-[#1C1A16] hover:bg-[#F3F4F6]'
                            }`}
                          >
                            {date.getDate()}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer Action */}
                  <div className="mt-4 flex items-center justify-between border-t border-[#EAE6E1] pt-3.5">
                    <div className="text-xs">
                      <span className="block text-[10px] text-[#968A80]">Durasi menginap:</span>
                      <span className="font-bold text-[#0F766E] flex items-center gap-1">
                        <Moon className="h-3 w-3" />
                        {totalNights} Malam
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsDateOpen(false)}
                      className="rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0D5C56] transition"
                    >
                      Terapkan Tanggal
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Modern Guests & Room Popover */}
            <div className="relative" ref={guestsPickerRef}>
              <button
                type="button"
                onClick={() => {
                  setIsGuestsOpen(!isGuestsOpen);
                  setIsDateOpen(false);
                }}
                className={`flex items-center gap-2.5 rounded-2xl px-3.5 py-1.5 text-xs font-semibold border transition shadow-2xs ${
                  isGuestsOpen
                    ? 'border-[#0F766E] bg-white ring-2 ring-[#0F766E]/20 text-[#1C1A16]'
                    : 'border-[#EAE6E1] bg-[#FAF9F6] hover:bg-white hover:border-[#0F766E]/60 text-[#1C1A16]'
                }`}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#F0FDFA] text-[#0F766E]">
                  <Users className="h-3.5 w-3.5" />
                </div>
                <div className="text-left">
                  <span className="block text-[9px] text-[#968A80] uppercase tracking-wider font-bold">Tamu & Kamar</span>
                  <span className="font-bold text-[#1C1A16] text-xs">
                    {adults + childrenCount} Tamu, {rooms} Kamar
                  </span>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-[#968A80] transition-transform duration-200 ${isGuestsOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Guests & Room Popover Card */}
              {isGuestsOpen && (
                <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2 z-50 w-72 sm:w-80 rounded-3xl border border-[#EAE6E1] bg-white p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="border-b border-[#EAE6E1] pb-3">
                    <h4 className="font-bold text-sm text-[#1C1A16]">Kamar & Jumlah Tamu</h4>
                    <p className="text-[10px] text-[#968A80]">Sesuaikan kebutuhan reservasi Anda</p>
                  </div>

                  <div className="mt-3.5 space-y-4">
                    {/* Dewasa */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-xs font-bold text-[#1C1A16]">Dewasa</span>
                        <span className="text-[10px] text-[#968A80]">Usia 18 tahun ke atas</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          disabled={adults <= 1}
                          onClick={() => setAdults(adults - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#EAE6E1] text-[#1C1A16] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#0F766E] transition"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center font-bold text-xs text-[#1C1A16]">{adults}</span>
                        <button
                          type="button"
                          disabled={adults >= 16}
                          onClick={() => setAdults(adults + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#EAE6E1] text-[#1C1A16] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#0F766E] transition"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Anak-anak */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-xs font-bold text-[#1C1A16]">Anak-anak</span>
                        <span className="text-[10px] text-[#968A80]">Usia 0 - 17 tahun</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          disabled={childrenCount <= 0}
                          onClick={() => setChildrenCount(childrenCount - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#EAE6E1] text-[#1C1A16] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#0F766E] transition"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center font-bold text-xs text-[#1C1A16]">{childrenCount}</span>
                        <button
                          type="button"
                          disabled={childrenCount >= 10}
                          onClick={() => setChildrenCount(childrenCount + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#EAE6E1] text-[#1C1A16] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#0F766E] transition"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Jumlah Kamar */}
                    <div className="flex items-center justify-between border-t border-[#EAE6E1] pt-3">
                      <div>
                        <span className="block text-xs font-bold text-[#1C1A16]">Jumlah Kamar</span>
                        <span className="text-[10px] text-[#968A80]">Total kamar hotel</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          disabled={rooms <= 1}
                          onClick={() => setRooms(rooms - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#EAE6E1] text-[#1C1A16] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#0F766E] transition"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center font-bold text-xs text-[#1C1A16]">{rooms}</span>
                        <button
                          type="button"
                          disabled={rooms >= 8}
                          onClick={() => setRooms(rooms + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#EAE6E1] text-[#1C1A16] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#0F766E] transition"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Selesai Button */}
                  <button
                    type="button"
                    onClick={() => setIsGuestsOpen(false)}
                    className="mt-5 w-full rounded-xl bg-[#0F766E] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0D5C56] transition"
                  >
                    Selesai
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#968A80] font-medium hidden sm:inline">Urutkan:</span>
            <div className="flex items-center gap-1.5 rounded-2xl border border-[#EAE6E1] bg-white px-3 py-1.5 font-semibold text-[#1C1A16] shadow-2xs hover:border-[#0F766E]/50 transition">
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

              {/* Price Range Slider (Adaptive Bounds) */}
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1C1A16]">Harga Maks / Malam</span>
                  <span className="font-mono text-xs font-bold text-[#0F766E]">
                    Rp {maxPrice.toLocaleString('id-ID')}
                    {maxPrice >= priceBounds.max ? '+' : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min={priceBounds.min}
                  max={priceBounds.max}
                  step={priceBounds.step}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="mt-3 w-full accent-[#0F766E] cursor-pointer"
                />
                <div className="mt-1 flex justify-between text-[10px] text-[#968A80]">
                  <span>Rp {priceBounds.min.toLocaleString('id-ID')}</span>
                  <span>Rp {priceBounds.max.toLocaleString('id-ID')}+</span>
                </div>
              </div>

              {/* Star Rating Filter (Complete Options) */}
              <div className="mt-6 border-t border-[#EAE6E1] pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1C1A16]">Kelas Bintang Minimal</span>
                  {selectedStar > 0 && (
                    <button
                      onClick={() => setSelectedStar(0)}
                      className="text-[10px] text-[#0F766E] hover:underline font-semibold"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    { star: 0, label: 'Semua' },
                    { star: 3, label: '3 Bintang+' },
                    { star: 4, label: '4 Bintang+' },
                    { star: 5, label: '5 Bintang' },
                  ].map((item) => (
                    <button
                      key={item.star}
                      type="button"
                      onClick={() => setSelectedStar(selectedStar === item.star ? 0 : item.star)}
                      className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 px-2 text-xs font-bold transition ${
                        selectedStar === item.star
                          ? 'border-[#0F766E] bg-[#F0FDFA] text-[#0F766E] shadow-xs'
                          : 'border-[#EAE6E1] bg-white text-[#6B6E6E] hover:border-[#0F766E]'
                      }`}
                    >
                      <Star
                        className={`h-3.5 w-3.5 ${
                          item.star === 0
                            ? 'text-[#968A80]'
                            : selectedStar === item.star
                            ? 'fill-[#0F766E] text-[#0F766E]'
                            : 'fill-[#F59E0B] text-[#F59E0B]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Area Destinasi (Dynamic from DB) */}
              <div className="mt-6 border-t border-[#EAE6E1] pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1C1A16]">Area Destinasi</span>
                  <span className="text-[10px] font-semibold text-[#0F766E] bg-[#F0FDFA] px-2 py-0.5 rounded-full border border-[#CCFBF1]">
                    {areas.length > 1 ? `${areas.length - 1} Area` : 'Semua'}
                  </span>
                </div>
                <div className="mt-3 max-h-52 overflow-y-auto pr-1 space-y-1">
                  {areas.map((a) => {
                    const count =
                      a === 'Semua'
                        ? initialHotels.length
                        : initialHotels.filter((h) =>
                            h.location?.toLowerCase().includes(a.toLowerCase())
                          ).length;

                    return (
                      <label
                        key={a}
                        onClick={() => setSelectedArea(a)}
                        className={`flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 text-xs transition ${
                          selectedArea === a
                            ? 'bg-[#F0FDFA] font-bold text-[#0F766E]'
                            : 'text-[#6B6E6E] hover:bg-[#FAF9F6]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="truncate">{a}</span>
                          <span
                            className={`rounded-full px-1.5 py-0.2 text-[9px] font-semibold ${
                              selectedArea === a
                                ? 'bg-[#CCFBF1] text-[#0F766E]'
                                : 'bg-[#F3F4F6] text-[#9CA3AF]'
                            }`}
                          >
                            {count}
                          </span>
                        </div>
                        <input
                          type="radio"
                          name="area"
                          checked={selectedArea === a}
                          onChange={() => setSelectedArea(a)}
                          className="accent-[#0F766E] cursor-pointer ml-2"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Fasilitas Hotel (Dynamic from DB) */}
              <div className="mt-6 border-t border-[#EAE6E1] pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1C1A16]">Fasilitas Hotel</span>
                  {selectedFacility && (
                    <button
                      onClick={() => setSelectedFacility('')}
                      className="text-[10px] text-[#0F766E] hover:underline font-semibold"
                    >
                      Hapus
                    </button>
                  )}
                </div>
                <div className="mt-3 space-y-2">
                  {facilities.map((f) => (
                    <label
                      key={f}
                      onClick={() => setSelectedFacility(selectedFacility === f ? '' : f)}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1.5 text-xs transition ${
                        selectedFacility === f
                          ? 'bg-[#F0FDFA] text-[#0F766E] font-semibold'
                          : 'text-[#6B6E6E] hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <div
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                          selectedFacility === f
                            ? 'border-[#0F766E] bg-[#0F766E] text-white'
                            : 'border-[#EAE6E1] bg-white'
                        }`}
                      >
                        {selectedFacility === f && <Check className="h-3 w-3" />}
                      </div>
                      <span className="truncate">{f}</span>
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
