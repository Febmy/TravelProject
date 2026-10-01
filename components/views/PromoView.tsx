'use client';

import React, { useState } from 'react';
import { Tag, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import { figmaPromos, PromoCoupon } from '@/lib/figma-data';

interface PromoViewProps {
  setScreen: (screen: string) => void;
}

export function PromoView({ setScreen }: PromoViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Semua Promo' },
    { id: 'hotel', label: 'Hotel & Resort' },
    { id: 'umrah', label: 'Paket Umrah' },
  ];

  const filteredPromos =
    activeCategory === 'all'
      ? figmaPromos
      : figmaPromos.filter((p) => p.category === activeCategory || p.category === 'all');

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      {/* 1. HERO BANNER (Figma hero-banner) */}
      <section className="bg-gradient-to-r from-[#0F766E] to-[#0D5C56] py-16 text-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#CCFBF1] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            Penawaran Spesial Terbatas
          </span>
          <h1 className="mt-4 font-['Figtree'] text-3xl font-bold sm:text-4xl lg:text-5xl">
            Promo & Penawaran Spesial
          </h1>
          <p className="mt-3 text-sm sm:text-base text-white/80 max-w-xl mx-auto">
            Dapatkan diskon terbaik untuk hotel premium dan paket Umrah pilihan Anda.
          </p>

          {/* Coupon Input */}
          <div className="mt-8 flex rounded-2xl bg-white p-2 shadow-2xl max-w-md mx-auto text-[#1C1A16]">
            <input
              type="text"
              placeholder="Masukkan kode kupon Anda..."
              className="flex-1 px-4 py-2 text-sm outline-none bg-transparent"
            />
            <button className="rounded-xl bg-[#0F766E] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0D5C56]">
              Gunakan Kode
            </button>
          </div>
        </div>
      </section>

      {/* 2. PROMO CONTENT (Figma promo-content-section) */}
      <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Category Tabs */}
        <div className="flex gap-2 border-b border-[#EAE6E1] pb-4">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeCategory === c.id
                  ? 'bg-[#0F766E] text-white shadow-sm'
                  : 'bg-white border border-[#EAE6E1] text-[#6B6E6E] hover:bg-[#FAF9F6]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Promo Cards Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPromos.map((promo) => (
            <div
              key={promo.id}
              className="flex flex-col justify-between overflow-hidden rounded-3xl border border-[#EAE6E1] bg-white p-6 shadow-sm transition hover:shadow-lg hover:border-[#0F766E]/50"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-bold text-[#D97706]">
                    {promo.discount}
                  </span>
                  {promo.tag && (
                    <span className="text-[11px] font-semibold text-[#EF4444] animate-pulse">
                      ● {promo.tag}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 font-['Figtree'] text-lg font-bold text-[#1C1A16]">
                  {promo.title}
                </h3>
                <span className="mt-1 block text-xs text-[#968A80]">
                  Berlaku s.d. {promo.validUntil}
                </span>

                <p className="mt-3 text-xs leading-relaxed text-[#6B6E6E]">{promo.description}</p>
              </div>

              <div className="mt-6 border-t border-[#EAE6E1] pt-5">
                <div className="flex items-center justify-between rounded-xl border border-dashed border-[#0F766E] bg-[#F0FDFA] p-3">
                  <div>
                    <span className="text-[10px] uppercase text-[#968A80] block">Kode Promo</span>
                    <span className="font-mono text-sm font-bold text-[#0F766E]">{promo.code}</span>
                  </div>
                  <button
                    onClick={() => copyCode(promo.code)}
                    className="flex items-center gap-1 rounded-lg bg-[#0F766E] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#0D5C56]"
                  >
                    {copiedCode === promo.code ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => setScreen(promo.category === 'umrah' ? 'umrah' : 'hotels')}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 text-xs font-bold text-[#0F766E] hover:underline"
                >
                  <span>Gunakan promo sekarang</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
