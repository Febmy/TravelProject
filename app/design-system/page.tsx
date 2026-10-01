'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, ArrowLeft, Palette, Type, Ruler, Layers, Copy, Check } from 'lucide-react';
import { figmaTokens } from '@/lib/figma-tokens';

export default function DesignSystemPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="flex min-h-screen bg-[#FAF9F6] text-[#1C1A16] font-['Figtree',sans-serif]">
      {/* Figma Frame: sidebar (Node 2003:3002 [260x3700]) */}
      <aside className="w-64 shrink-0 border-r border-[#EAE6E1] bg-white p-6 sticky top-0 h-screen flex flex-col justify-between">
        <div>
          {/* Brand block */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F766E] text-white">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-[#1C1A16]">Safara Travel</span>
              <span className="block text-[11px] text-[#968A80]">Design System v1.0.0</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="mt-8 space-y-2 text-xs font-semibold text-[#6B6E6E]">
            <a
              href="#colors"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 hover:bg-[#FAF9F6] hover:text-[#0F766E]"
            >
              <Palette className="h-4 w-4" />
              <span>1. Color Tokens</span>
            </a>
            <a
              href="#typography"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 hover:bg-[#FAF9F6] hover:text-[#0F766E]"
            >
              <Type className="h-4 w-4" />
              <span>2. Typography Scale</span>
            </a>
            <a
              href="#spacing"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 hover:bg-[#FAF9F6] hover:text-[#0F766E]"
            >
              <Ruler className="h-4 w-4" />
              <span>3. Spacing Scale</span>
            </a>
            <a
              href="#components"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 hover:bg-[#FAF9F6] hover:text-[#0F766E]"
            >
              <Layers className="h-4 w-4" />
              <span>4. Core Components</span>
            </a>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-[#EAE6E1] pt-4 text-[11px] text-[#968A80] space-y-2">
          <p>Updated Oct 2024</p>
          <p>Designed for travel & hospitality</p>
          <Link
            href="/"
            className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Website</span>
          </Link>
        </div>
      </aside>

      {/* Figma Frame: main-document (Node 2003:3018 [1180x3700]) */}
      <main className="flex-1 p-8 sm:p-12 max-w-5xl space-y-16">
        {/* Doc Header */}
        <div>
          <span className="rounded-md bg-[#CCFBF1] px-2.5 py-1 text-xs font-bold text-[#0F766E]">
            Figma Node 2003:3001
          </span>
          <h1 className="mt-3 font-['Figtree'] text-4xl font-bold tracking-tight text-[#1C1A16]">
            Safara System Documentation
          </h1>
          <p className="mt-3 text-sm text-[#6B6E6E] leading-relaxed max-w-2xl">
            A centralized reference for all design system assets, functional layout parameters,
            typographic weight variations, visual scales, and component guidelines for the Safara travel
            platform.
          </p>
          <div className="mt-8 h-px bg-[#EAE6E1]" />
        </div>

        {/* 1. Colors */}
        <section id="colors" className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">01. Colors</span>
            <h2 className="mt-1 font-['Figtree'] text-2xl font-bold text-[#1C1A16]">Color Tokens</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {[
              { label: 'Primary Solid', hex: figmaTokens.colors.primary.solid, desc: 'Hero Brand Color' },
              { label: 'Primary Hover', hex: figmaTokens.colors.primary.hover, desc: 'Interactions' },
              { label: 'Primary Light', hex: figmaTokens.colors.primary.light, desc: 'Secondary / Accent' },
              { label: 'Primary Mint', hex: figmaTokens.colors.primary.mint, desc: 'Soft Tag Fill' },
              { label: 'Primary Soft', hex: figmaTokens.colors.primary.soft, desc: 'Light Accent Area' },
            ].map((c) => (
              <div
                key={c.label}
                className="overflow-hidden rounded-2xl border border-[#EAE6E1] bg-white shadow-sm"
              >
                <div className="h-20 w-full" style={{ backgroundColor: c.hex }} />
                <div className="p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1C1A16]">{c.label}</span>
                    <button onClick={() => copy(c.hex)} className="text-[#968A80] hover:text-[#0F766E]">
                      {copied === c.hex ? <Check className="h-3 w-3 text-[#10B981]" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#0F766E]">{c.hex}</span>
                  <p className="mt-1 text-[10px] text-[#968A80]">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Neutrals */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 pt-2">
            {[
              { label: 'Neutral 50', hex: figmaTokens.colors.neutral[50], desc: 'Canvas / Paper' },
              { label: 'Neutral 100', hex: figmaTokens.colors.neutral[100], desc: 'Table headers' },
              { label: 'Neutral 200', hex: figmaTokens.colors.neutral[200], desc: 'Dividers / Borders' },
              { label: 'Neutral 500', hex: figmaTokens.colors.neutral[500], desc: 'Muted Subtext' },
              { label: 'Neutral 900', hex: figmaTokens.colors.neutral[900], desc: 'Dominant Body Text' },
            ].map((c) => (
              <div
                key={c.label}
                className="overflow-hidden rounded-2xl border border-[#EAE6E1] bg-white shadow-sm"
              >
                <div className="h-20 w-full border-b border-[#EAE6E1]" style={{ backgroundColor: c.hex }} />
                <div className="p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1C1A16]">{c.label}</span>
                    <button onClick={() => copy(c.hex)} className="text-[#968A80] hover:text-[#0F766E]">
                      {copied === c.hex ? <Check className="h-3 w-3 text-[#10B981]" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#1C1A16]">{c.hex}</span>
                  <p className="mt-1 text-[10px] text-[#968A80]">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Typography */}
        <section id="typography" className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">02. Typography</span>
            <h2 className="mt-1 font-['Figtree'] text-2xl font-bold text-[#1C1A16]">Typography Scale</h2>
          </div>

          <div className="rounded-3xl border border-[#EAE6E1] bg-white divide-y divide-[#EAE6E1] overflow-hidden">
            {[
              { name: 'Display Large', spec: '36px • Bold (700)', preview: 'Find Your Oasis', cls: 'text-4xl font-bold' },
              { name: 'Heading 1', spec: '28px • Bold (700)', preview: 'Explore Destinations', cls: 'text-3xl font-bold' },
              { name: 'Heading 2', spec: '24px • SemiBold (600)', preview: 'Morocco & Bali Collection', cls: 'text-2xl font-semibold' },
              { name: 'Heading 3', spec: '20px • SemiBold (600)', preview: 'Boutique Hotel Booking', cls: 'text-xl font-semibold' },
              { name: 'Body Large', spec: '16px • Regular (400)', preview: 'Elegant, curated safaris and stays in untouched regions.', cls: 'text-base' },
              { name: 'Body Base', spec: '14px • Regular (400)', preview: 'Safara bridges local heritage with modern luxury comfort.', cls: 'text-sm' },
              { name: 'Caption', spec: '12px • Medium (500)', preview: '*Rates subject to seasonal availability.', cls: 'text-xs text-[#968A80]' },
              { name: 'Overline', spec: '11px • Bold (700)', preview: 'FEATURED EXCURSION', cls: 'text-[11px] font-bold uppercase tracking-wider text-[#0F766E]' },
            ].map((t) => (
              <div key={t.name} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between p-6 gap-3">
                <div className="w-56 shrink-0">
                  <span className="font-bold text-xs text-[#1C1A16] block">{t.name}</span>
                  <span className="font-mono text-[11px] text-[#968A80]">{t.spec}</span>
                </div>
                <div className={`flex-1 text-[#1C1A16] ${t.cls}`}>{t.preview}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Spacing */}
        <section id="spacing" className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">03. Layout</span>
            <h2 className="mt-1 font-['Figtree'] text-2xl font-bold text-[#1C1A16]">Spacing Scale</h2>
          </div>

          <div className="rounded-3xl border border-[#EAE6E1] bg-white p-6 space-y-3">
            {[4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80].map((px) => (
              <div key={px} className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1C1A16] w-24">Space {px}</span>
                <div className="flex-1 mx-4">
                  <div className="h-3 rounded-full bg-[#0F766E]" style={{ width: `${px}px` }} />
                </div>
                <span className="font-mono text-[#968A80]">{px}px</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
