'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, User, Sparkles, Menu, X, LogIn, LogOut, Globe, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/store/cartStore';

interface NavbarProps {
  openDsk?: () => void;
}

export function Navbar({ openDsk }: NavbarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, currency, setLang, setCurrency, t } = useLanguage();
  
  // Hydration-safe cart state
  const [isMounted, setIsMounted] = useState(false);
  const cartItems = useCartStore((state) => state.items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EAE6E1] bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-3 text-left transition hover:opacity-90"
            aria-label="Safara Travel"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F766E] text-white shadow-sm shadow-[#0F766E]/20">
              <Compass className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-['Figtree'] text-xl font-bold tracking-tight text-[#1C1A16]">
                Safara<span className="text-[#0F766E]"> Travel</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-[#968A80]">
                Luxury & Umrah
              </span>
            </div>
          </Link>
        </div>

        {/* Customer Nav Links */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/hotels"
            className={`text-[15px] font-medium transition ${
              isActive('/hotels')
                ? 'font-semibold text-[#0F766E]'
                : 'text-[#6B6E6E] hover:text-[#0F766E]'
            }`}
          >
            {t('nav_hotels')}
          </Link>
          <Link
            href="/umrah"
            className={`text-[15px] font-medium transition ${
              isActive('/umrah')
                ? 'font-semibold text-[#0F766E]'
                : 'text-[#6B6E6E] hover:text-[#0F766E]'
            }`}
          >
            {t('nav_umrah')}
          </Link>
          <Link
            href="/promo"
            className={`text-[15px] font-medium transition ${
              isActive('/promo')
                ? 'font-semibold text-[#0F766E]'
                : 'text-[#6B6E6E] hover:text-[#0F766E]'
            }`}
          >
            {t('nav_promo')}
          </Link>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3">


          {/* Pesanan / Cart */}
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 rounded-xl border border-[#EAE6E1] bg-white p-2 text-xs font-bold text-[#1C1A16] hover:bg-[#FAF9F6] transition shadow-sm"
            title="Keranjang Saya"
          >
            <div className="relative">
              <ShoppingBag className="h-4 w-4 text-[#0F766E]" />
              {isMounted && cartItems.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] text-white font-bold">
                  {cartItems.length}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Keranjang</span>
          </Link>

          {/* Masuk / Login button or User Profile */}
          {!session ? (
            <Link
              href="/login"
              className="hidden rounded-xl border border-[#EAE6E1] bg-white px-3.5 py-2 text-xs font-bold text-[#1C1A16] hover:bg-[#FAF9F6] sm:flex sm:items-center sm:gap-1.5"
            >
              <LogIn className="h-3.5 w-3.5 text-[#0F766E]" />
              <span>{t('nav_signin')}</span>
            </Link>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              {(session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN') && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 rounded-xl border border-[#0F766E]/20 bg-[#F0FDFA] px-3.5 py-2 text-xs font-bold text-[#0F766E] hover:bg-[#CCFBF1] transition"
                  title="Admin Dashboard"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>{session.user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}</span>
                </Link>
              )}
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-xl bg-[#F5F3EF] px-3.5 py-2 text-sm font-medium text-[#1C1A16] transition hover:bg-[#EAE6E1]"
                title="Lihat Profil Saya"
              >
                <User className="h-4 w-4 text-[#0F766E]" />
                <span className="font-semibold text-xs sm:text-sm">{session.user.name?.split(' ')[0] || 'User'}</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-1.5 rounded-xl border border-[#EAE6E1] bg-white px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                title="Keluar"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-[#EAE6E1] p-2 text-[#1C1A16] hover:bg-[#FAF9F6] md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-[#EAE6E1] bg-white px-4 py-4 space-y-3 md:hidden animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between border-b border-[#EAE6E1] pb-3 text-xs font-bold">
            <span className="text-[#6B6E6E]">Bahasa & Mata Uang:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
                className="rounded-lg bg-[#FAF9F6] border border-[#EAE6E1] px-2.5 py-1 text-[#0F766E]"
              >
                {lang.toUpperCase()}
              </button>
              <button
                onClick={() => setCurrency(currency === 'IDR' ? 'SAR' : 'IDR')}
                className="rounded-lg bg-[#FAF9F6] border border-[#EAE6E1] px-2.5 py-1 text-[#0F766E]"
              >
                {currency}
              </button>
            </div>
          </div>

          <Link
            href="/hotels"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#1C1A16]"
          >
            {t('nav_hotels')}
          </Link>
          <Link
            href="/umrah"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#1C1A16]"
          >
            {t('nav_umrah')}
          </Link>
          <Link
            href="/promo"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#1C1A16]"
          >
            {t('nav_promo')}
          </Link>
          {!session ? (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-[#0F766E]"
            >
              {t('nav_signin')} / Buat Akun
            </Link>
          ) : (
            <div className="border-t border-[#EAE6E1] pt-3 mt-3">
              {(session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN') && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-sm font-semibold text-[#0F766E]"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {session.user.role === 'SUPER_ADMIN' ? 'Super Admin Dashboard' : 'Admin Dashboard'}
                </Link>
              )}
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-sm font-semibold text-[#1C1A16]"
              >
                <User className="h-4 w-4 text-[#0F766E]" />
                Profil Saya ({session.user.name?.split(' ')[0] || 'User'})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="flex items-center gap-2 py-2 text-sm font-semibold text-red-600 w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
