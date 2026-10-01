'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Moon,
  X,
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

// Date helpers
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

export function HomeView() {
  const router = useRouter();

  // Filters start empty for natural user guidance
  const [destination, setDestination] = useState<string>('');
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => new Date(2026, 2, 1));
  const [selectingStep, setSelectingStep] = useState<'checkIn' | 'checkOut'>('checkIn');
  const [isDateOpen, setIsDateOpen] = useState<boolean>(false);
  const [guideMessage, setGuideMessage] = useState<string | null>(null);

  // Modern Guests & Rooms States
  const [adults, setAdults] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [rooms, setRooms] = useState<number>(1);
  const [isGuestsOpen, setIsGuestsOpen] = useState<boolean>(false);

  // Popover Click Outside
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

  const totalNights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const days = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  }, [checkIn, checkOut]);

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
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
      setCheckOut(null);
      setSelectingStep('checkOut');
    } else {
      if (checkIn && date > checkIn) {
        setCheckOut(date);
        setSelectingStep('checkIn');
      } else {
        setCheckIn(date);
        setCheckOut(null);
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

  const handleSearch = () => {
    if (!destination) {
      setGuideMessage('Silakan pilih destinasi perjalanan terlebih dahulu');
      setTimeout(() => setGuideMessage(null), 3500);
      return;
    }
    if (!checkIn || !checkOut) {
      setGuideMessage('Silakan tentukan tanggal check-in & check-out');
      setIsDateOpen(true);
      setTimeout(() => setGuideMessage(null), 3500);
      return;
    }
    if (destination === 'Makkah' || destination === 'Madinah') {
      router.push(`/umrah?destination=${encodeURIComponent(destination)}`);
    } else {
      router.push(`/hotels?q=${encodeURIComponent(destination)}`);
    }
  };

  return (
    <div className="w-full bg-[#FAF9F6]">
      {/* 1. HERO SECTION (Overflow visible so popover cards are NEVER clipped) */}
      <section className="relative min-h-[580px] w-full bg-[#1C1A16] z-30">
        {/* Background Image with Gradient Overlay (Safely clipped inside) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={figmaAssets.heroBanner}
            alt="Safara Travel Hero Background"
            className="h-full w-full object-cover object-center opacity-70 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A16]/90 via-transparent to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-center px-4 pt-20 pb-36 sm:pb-44 sm:px-6 lg:px-8">
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

          {/* Interactive Guide Message Banner (if triggered) */}
          {guideMessage && (
            <div className="mt-6 flex items-center gap-2 rounded-2xl bg-[#0F766E]/90 text-white px-4 py-2.5 text-xs font-bold shadow-lg backdrop-blur-md max-w-md animate-in fade-in slide-in-from-top-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white text-[11px]">
                ℹ
              </span>
              <span>{guideMessage}</span>
            </div>
          )}

          {/* Modern Search Bar Widget */}
          <div className="mt-8 w-full max-w-5xl rounded-3xl border border-white/15 bg-white p-3 shadow-2xl backdrop-blur-xl relative z-30">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-[1.3fr_auto_1.4fr_auto_1.2fr_auto]">
              {/* Field 1: Destinasi (Guided & Initially Empty) */}
              <div className="flex items-center gap-3.5 rounded-2xl p-3 hover:bg-[#FAF9F6] transition">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0FDFA] text-[#0F766E]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#968A80]">
                    Destinasi
                  </span>
                  <Select
                    instanceId="destination-select"
                    options={destinationOptions}
                    value={destinationOptions.find((o) => o.value === destination) || null}
                    onChange={(option) => setDestination(option?.value || '')}
                    styles={customSelectStyles}
                    placeholder="Mau ke mana? (Pilih destinasi)"
                    isSearchable={true}
                    isClearable={true}
                    className="w-full text-xs font-bold text-[#1C1A16]"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="hidden h-10 self-center w-px bg-[#EAE6E1] md:block" />

              {/* Field 2: Interactive Date Range Calendar Popover */}
              <div className="relative" ref={datePickerRef}>
                <div
                  onClick={() => {
                    setIsDateOpen(!isDateOpen);
                    setIsGuestsOpen(false);
                  }}
                  className={`flex items-center gap-3.5 rounded-2xl p-3 transition cursor-pointer ${
                    !checkIn ? 'hover:bg-[#FAF9F6] bg-transparent' : 'hover:bg-[#FAF9F6]'
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0FDFA] text-[#0F766E]">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-[#968A80]">
                        Tanggal Menginap
                      </span>
                      {checkIn && checkOut && (
                        <span className="rounded-full bg-[#E6F4F1] px-1.5 py-0.2 text-[9px] font-bold text-[#0F766E] flex items-center gap-0.5">
                          <Moon className="h-2.5 w-2.5" />
                          {totalNights} Mlm
                        </span>
                      )}
                    </div>
                    {checkIn && checkOut ? (
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs font-bold text-[#1C1A16] truncate">
                        <span>{formatShortDate(checkIn)}</span>
                        <span className="text-[#968A80] font-normal">→</span>
                        <span>{formatShortDate(checkOut)}</span>
                      </div>
                    ) : checkIn ? (
                      <div className="mt-0.5 text-xs font-bold text-[#0F766E] truncate">
                        {formatShortDate(checkIn)} → <span className="font-normal text-[#968A80]">Pilih check-out</span>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-[#968A80] block mt-0.5">
                        Pilih tanggal menginap
                      </span>
                    )}
                  </div>
                </div>

                {/* Popover Calendar (Never clipped) */}
                {isDateOpen && (
                  <div className="absolute top-full left-0 mt-3 z-50 w-[340px] sm:w-[380px] rounded-3xl border border-[#EAE6E1] bg-white p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                    {/* Presets */}
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

                    {/* Month Nav */}
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
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#EAE6E1] text-[#6B6E6E] hover:bg-[#FAF9F6] transition"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Weekday headers */}
                    <div className="mt-3 grid grid-cols-7 text-center text-[10px] font-bold text-[#968A80]">
                      {indonesianDays.map((d) => (
                        <div key={d} className="py-1">
                          {d}
                        </div>
                      ))}
                    </div>

                    {/* Days */}
                    <div className="mt-1 grid grid-cols-7 gap-y-1">
                      {calendarDays.map((date, idx) => {
                        if (!date) return <div key={`empty-${idx}`} className="h-9 w-9" />;

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

                    {/* Footer */}
                    <div className="mt-4 flex items-center justify-between border-t border-[#EAE6E1] pt-3.5">
                      <div className="text-xs">
                        <span className="block text-[10px] text-[#968A80]">Total menginap:</span>
                        <span className="font-bold text-[#0F766E] flex items-center gap-1">
                          <Moon className="h-3 w-3" />
                          {totalNights > 0 ? `${totalNights} Malam` : 'Tentukan tanggal'}
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

              {/* Divider */}
              <div className="hidden h-10 self-center w-px bg-[#EAE6E1] md:block" />

              {/* Field 3: Interactive Guests & Rooms Popover */}
              <div className="relative" ref={guestsPickerRef}>
                <div
                  onClick={() => {
                    setIsGuestsOpen(!isGuestsOpen);
                    setIsDateOpen(false);
                  }}
                  className="flex items-center gap-3.5 rounded-2xl p-3 hover:bg-[#FAF9F6] transition cursor-pointer"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0FDFA] text-[#0F766E]">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#968A80]">
                      Tamu & Kamar
                    </span>
                    <div className="mt-0.5 flex items-center justify-between text-xs font-bold text-[#1C1A16]">
                      <span className="truncate">
                        {adults + childrenCount} Tamu, {rooms} Kamar
                      </span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 text-[#968A80] transition-transform duration-200 ${
                          isGuestsOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Popover Card */}
                {isGuestsOpen && (
                  <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-3 z-50 w-72 sm:w-80 rounded-3xl border border-[#EAE6E1] bg-white p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
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

              {/* Action Button */}
              <button
                type="button"
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
