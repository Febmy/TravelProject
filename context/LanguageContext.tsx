'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'id' | 'en';
export type Currency = 'IDR' | 'SAR';

interface LanguageContextType {
  lang: Language;
  currency: Currency;
  setLang: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
  t: (key: string) => string;
  formatCurrency: (amountInIdr: number) => string;
}

const translations: Record<Language, Record<string, string>> = {
  id: {
    nav_hotels: 'Hotel',
    nav_umrah: 'Umrah',
    nav_promo: 'Promo',
    nav_tracking: 'Cek Booking',
    nav_signin: 'Masuk',
    nav_profile: 'H. Ahmad Fauzi',
    footer_tagline: 'Platform Pemesanan Hotel Mewah & Paket Umrah Premium Terpercaya',
    hero_title: 'Jelajahi Kemewahan & Ibadah dengan Sempurna',
    hero_sub: 'Pilihan hotel bintang lima dan paket umrah VIP dengan fasilitas terbaik serta bimbingan ibadah terpercaya.',
    search_hotel_tab: 'Hotel Mewah',
    search_umrah_tab: 'Paket Umrah',
    btn_search: 'Cari Sekarang',
    verified_badge: 'Terakreditasi Kemenag RI & IATA',
  },
  en: {
    nav_hotels: 'Hotels',
    nav_umrah: 'Umrah Packages',
    nav_promo: 'Deals & Promos',
    nav_tracking: 'Track Booking',
    nav_signin: 'Sign In',
    nav_profile: 'H. Ahmad Fauzi',
    footer_tagline: 'Trusted Luxury Hospitality & VIP Umrah Booking Platform',
    hero_title: 'Experience Pure Luxury & Spiritual Serenity',
    hero_sub: 'Handpicked five-star hotels and VIP Umrah journeys with world-class amenities and certified guidance.',
    search_hotel_tab: 'Luxury Hotels',
    search_umrah_tab: 'Umrah Packages',
    btn_search: 'Search Now',
    verified_badge: 'Accredited by Ministry of Religious Affairs & IATA',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'id',
  currency: 'IDR',
  setLang: () => {},
  setCurrency: () => {},
  t: (key) => key,
  formatCurrency: (amount) => `Rp ${amount.toLocaleString('id-ID')}`,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('id');
  const [currency, setCurrencyState] = useState<Currency>('IDR');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('safara_lang') as Language;
      if (savedLang && (savedLang === 'id' || savedLang === 'en')) {
        setLangState(savedLang);
      }
      const savedCurr = localStorage.getItem('safara_curr') as Currency;
      if (savedCurr && (savedCurr === 'IDR' || savedCurr === 'SAR')) {
        setCurrencyState(savedCurr);
      }
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('safara_lang', newLang);
    }
  };

  const setCurrency = (newCurr: Currency) => {
    setCurrencyState(newCurr);
    if (typeof window !== 'undefined') {
      localStorage.setItem('safara_curr', newCurr);
    }
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations.id[key] || key;
  };

  const formatCurrency = (amountInIdr: number): string => {
    if (currency === 'SAR') {
      // 1 SAR ≈ 4,200 IDR
      const sar = Math.round(amountInIdr / 4200);
      return `SAR ${sar.toLocaleString('en-US')}`;
    }
    return `Rp ${amountInIdr.toLocaleString('id-ID')}`;
  };

  return (
    <LanguageContext.Provider value={{ lang, currency, setLang, setCurrency, t, formatCurrency }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
