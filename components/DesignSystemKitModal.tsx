'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Palette, Type, Ruler, Layers, Sparkles } from 'lucide-react';
import { figmaTokens } from '@/lib/figma-tokens';

interface DesignSystemKitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DesignSystemKitModal({ isOpen, onClose }: DesignSystemKitModalProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing' | 'components'>('colors');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col rounded-3xl border border-[#EAE6E1] bg-white shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#EAE6E1] px-6 py-5 bg-[#FAF9F6]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F766E] text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Figtree'] text-lg font-bold text-[#1C1A16]">
                  Safara Design System Kit (v1.0.0)
                </h3>
                <span className="rounded-md bg-[#CCFBF1] px-2 py-0.5 text-[11px] font-bold text-[#0F766E]">
                  Node 2003:3001
                </span>
              </div>
              <p className="text-xs text-[#6B6E6E]">
                Ekstraksi token warna, typography, ukuran layout dari Figma File Y972VugHKmG7IGi5jqbRhj
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#968A80] transition hover:bg-[#EAE6E1] hover:text-[#1C1A16]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#EAE6E1] px-6 bg-[#FAF9F6]/50">
          <button
            onClick={() => setActiveTab('colors')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition ${
              activeTab === 'colors'
                ? 'border-[#0F766E] text-[#0F766E]'
                : 'border-transparent text-[#6B6E6E] hover:text-[#1C1A16]'
            }`}
          >
            <Palette className="h-4 w-4" />
            <span>1. Color Tokens</span>
          </button>
          <button
            onClick={() => setActiveTab('typography')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition ${
              activeTab === 'typography'
                ? 'border-[#0F766E] text-[#0F766E]'
                : 'border-transparent text-[#6B6E6E] hover:text-[#1C1A16]'
            }`}
          >
            <Type className="h-4 w-4" />
            <span>2. Typography Scale</span>
          </button>
          <button
            onClick={() => setActiveTab('spacing')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition ${
              activeTab === 'spacing'
                ? 'border-[#0F766E] text-[#0F766E]'
                : 'border-transparent text-[#6B6E6E] hover:text-[#1C1A16]'
            }`}
          >
            <Ruler className="h-4 w-4" />
            <span>3. Spacing & Radius</span>
          </button>
          <button
            onClick={() => setActiveTab('components')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition ${
              activeTab === 'components'
                ? 'border-[#0F766E] text-[#0F766E]'
                : 'border-transparent text-[#6B6E6E] hover:text-[#1C1A16]'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>4. Core Components</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: COLORS */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              {/* Primary Palette */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#968A80]">
                  Primary Palette (Brand Teal)
                </h4>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {[
                    { label: 'Primary Solid', hex: figmaTokens.colors.primary.solid, desc: 'Hero Brand Color' },
                    { label: 'Primary Hover', hex: figmaTokens.colors.primary.hover, desc: 'Interactions' },
                    { label: 'Primary Light', hex: figmaTokens.colors.primary.light, desc: 'Accent / Tags' },
                    { label: 'Primary Mint', hex: figmaTokens.colors.primary.mint, desc: 'Soft Tag Fill' },
                    { label: 'Primary Soft', hex: figmaTokens.colors.primary.soft, desc: 'Light Accent BG' },
                  ].map((c) => (
                    <div
                      key={c.label}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-[#EAE6E1] bg-white transition hover:shadow-md"
                    >
                      <div className="h-16 w-full" style={{ backgroundColor: c.hex }} />
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1C1A16]">{c.label}</span>
                          <button
                            onClick={() => copyToClipboard(c.hex)}
                            className="text-[#968A80] hover:text-[#0F766E]"
                            title="Salin HEX"
                          >
                            {copiedCode === c.hex ? <Check className="h-3.5 w-3.5 text-[#10B981]" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                        <span className="font-mono text-[11px] font-semibold text-[#0F766E]">{c.hex}</span>
                        <p className="mt-1 text-[10px] text-[#968A80]">{c.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Neutral Scale */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#968A80]">
                  Warm Neutral Scale
                </h4>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {[
                    { label: 'Neutral 50', hex: figmaTokens.colors.neutral[50], desc: 'Canvas / Paper' },
                    { label: 'Neutral 100', hex: figmaTokens.colors.neutral[100], desc: 'Table Headers / BG' },
                    { label: 'Neutral 200', hex: figmaTokens.colors.neutral[200], desc: 'Dividers / Borders' },
                    { label: 'Neutral 500', hex: figmaTokens.colors.neutral[500], desc: 'Muted Subtext' },
                    { label: 'Neutral 900', hex: figmaTokens.colors.neutral[900], desc: 'Dominant Body Text' },
                  ].map((c) => (
                    <div
                      key={c.label}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-[#EAE6E1] bg-white transition hover:shadow-md"
                    >
                      <div className="h-16 w-full border-b border-[#EAE6E1]" style={{ backgroundColor: c.hex }} />
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1C1A16]">{c.label}</span>
                          <button
                            onClick={() => copyToClipboard(c.hex)}
                            className="text-[#968A80] hover:text-[#0F766E]"
                          >
                            {copiedCode === c.hex ? <Check className="h-3.5 w-3.5 text-[#10B981]" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                        <span className="font-mono text-[11px] font-semibold text-[#1C1A16]">{c.hex}</span>
                        <p className="mt-1 text-[10px] text-[#968A80]">{c.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semantic Status Fills */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#968A80]">
                  Semantic Status Fills
                </h4>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: 'Success Green', hex: figmaTokens.colors.semantic.success.solid, light: figmaTokens.colors.semantic.success.light, desc: 'Confirmed state' },
                    { label: 'Warning Amber', hex: figmaTokens.colors.semantic.warning.solid, light: figmaTokens.colors.semantic.warning.light, desc: 'Pending alert' },
                    { label: 'Error Red', hex: figmaTokens.colors.semantic.error.solid, light: figmaTokens.colors.semantic.error.light, desc: 'Failure / Denied' },
                    { label: 'Info Blue', hex: figmaTokens.colors.semantic.info.solid, light: figmaTokens.colors.semantic.info.light, desc: 'System notification' },
                  ].map((c) => (
                    <div key={c.label} className="overflow-hidden rounded-2xl border border-[#EAE6E1] p-4 bg-white">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-white text-xs" style={{ backgroundColor: c.hex }}>
                          ✓
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#1C1A16]">{c.label}</p>
                          <span className="font-mono text-[11px] font-semibold text-[#0F766E]">{c.hex}</span>
                        </div>
                      </div>
                      <div className="mt-3 rounded-lg p-2 text-[11px] font-semibold" style={{ backgroundColor: c.light, color: c.hex }}>
                        Sample: {c.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TYPOGRAPHY */}
          {activeTab === 'typography' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#EAE6E1] bg-[#FAF9F6] p-4 text-xs">
                <span className="font-bold text-[#0F766E]">Font Family:</span>{' '}
                <span className="font-semibold text-[#1C1A16]">Figtree</span> (Google Font, geometric sans-serif loaded via Next.js)
              </div>
              <div className="divide-y divide-[#EAE6E1] rounded-2xl border border-[#EAE6E1] bg-white">
                {[
                  { name: 'Display Large', spec: '36px • Bold (700) • LH 43px', preview: 'Temukan Perjalanan Terbaik untuk Jiwa Anda', cls: 'text-4xl font-bold' },
                  { name: 'Heading 1', spec: '28px • Bold (700) • LH 34px', preview: 'Jelajahi Destinasi Favorit Indonesia', cls: 'text-3xl font-bold' },
                  { name: 'Heading 2', spec: '24px • SemiBold (600) • LH 29px', preview: 'Paket Umrah Eksklusif Syawal 9 Hari', cls: 'text-2xl font-semibold' },
                  { name: 'Heading 3', spec: '20px • SemiBold (600) • LH 24px', preview: 'The Alila Seminyak Resort Bali', cls: 'text-xl font-semibold' },
                  { name: 'Body Large', spec: '16px • Regular (400) • LH 24px', preview: 'Pilihan hotel kurasi terbaik dan paket ibadah umrah premium yang aman dan nyaman.', cls: 'text-base font-normal' },
                  { name: 'Body Base', spec: '14px • Regular / SemiBold (400/600) • LH 20px', preview: 'Safara bridges local heritage with modern luxury comfort.', cls: 'text-sm font-normal' },
                  { name: 'Caption', spec: '12px • Medium (500) • LH 16px', preview: '*Tarif sudah termasuk sarapan, PPN 10%, dan biaya layanan per malam.', cls: 'text-xs font-medium text-[#968A80]' },
                  { name: 'Overline', spec: '11px • Bold (700) • Uppercase', preview: 'PERJALANAN IBADAH PREMIUM', cls: 'text-[11px] font-bold uppercase tracking-wider text-[#0F766E]' },
                ].map((t) => (
                  <div key={t.name} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-baseline sm:justify-between">
                    <div className="w-48 shrink-0">
                      <p className="text-xs font-bold text-[#1C1A16]">{t.name}</p>
                      <p className="text-[11px] text-[#968A80] font-mono">{t.spec}</p>
                    </div>
                    <div className={`flex-1 text-[#1C1A16] ${t.cls}`}>{t.preview}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SPACING & RADIUS */}
          {activeTab === 'spacing' && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Spacing Scale */}
              <div className="rounded-2xl border border-[#EAE6E1] bg-white p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#968A80] mb-4">
                  3. Spacing Scale (Figtree layout)
                </h4>
                <div className="space-y-3">
                  {[
                    { token: 'Space 4', val: '4px', w: 'w-1' },
                    { token: 'Space 8', val: '8px', w: 'w-2' },
                    { token: 'Space 12', val: '12px', w: 'w-3' },
                    { token: 'Space 16', val: '16px', w: 'w-4' },
                    { token: 'Space 20', val: '20px', w: 'w-5' },
                    { token: 'Space 24', val: '24px', w: 'w-6' },
                    { token: 'Space 32', val: '32px', w: 'w-8' },
                    { token: 'Space 40', val: '40px', w: 'w-10' },
                    { token: 'Space 48', val: '48px', w: 'w-12' },
                    { token: 'Space 64', val: '64px', w: 'w-16' },
                  ].map((s) => (
                    <div key={s.token} className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#1C1A16] w-20">{s.token}</span>
                      <div className="flex-1 mx-4">
                        <div className="h-3 rounded bg-[#0F766E]" style={{ width: s.val }} />
                      </div>
                      <span className="font-mono text-[#968A80]">{s.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radius & Elevation */}
              <div className="rounded-2xl border border-[#EAE6E1] bg-white p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#968A80]">
                  Corner Radius & Layout Spec
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg border border-[#EAE6E1] p-3 text-center bg-[#FAF9F6]">
                    <span className="font-bold">rounded-lg (8px)</span>
                    <p className="text-[10px] text-[#968A80] mt-1">Button & Input controls</p>
                  </div>
                  <div className="rounded-xl border border-[#EAE6E1] p-3 text-center bg-[#FAF9F6]">
                    <span className="font-bold">rounded-xl (12px)</span>
                    <p className="text-[10px] text-[#968A80] mt-1">Select fields & Badges</p>
                  </div>
                  <div className="rounded-2xl border border-[#EAE6E1] p-3 text-center bg-[#FAF9F6]">
                    <span className="font-bold">rounded-2xl (16px)</span>
                    <p className="text-[10px] text-[#968A80] mt-1">Hotel Cards & Modals</p>
                  </div>
                  <div className="rounded-3xl border border-[#EAE6E1] p-3 text-center bg-[#FAF9F6]">
                    <span className="font-bold">rounded-3xl (24px)</span>
                    <p className="text-[10px] text-[#968A80] mt-1">Hero banners & Promos</p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-[#CCFBF1] bg-[#F0FDFA] p-3 text-xs text-[#0F766E]">
                  <span className="font-bold">Composite Hotel Card Spec:</span>
                  <ul className="mt-1 list-disc pl-4 space-y-0.5 text-[11px]">
                    <li>Aspect Ratio: 16:10 Image area</li>
                    <li>Outer Padding: 16px bottom block</li>
                    <li>Corner Radius: 16px (overflow: hidden)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CORE COMPONENTS */}
          {activeTab === 'components' && (
            <div className="space-y-6">
              {/* Buttons */}
              <div className="rounded-2xl border border-[#EAE6E1] bg-white p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#968A80] mb-4">
                  Button Hierarchy
                </h4>
                <div className="flex flex-wrap items-center gap-3">
                  <button className="rounded-xl bg-[#0F766E] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0D5C56]">
                    Primary Solid
                  </button>
                  <button className="rounded-xl border border-[#0F766E] px-5 py-2.5 text-xs font-bold text-[#0F766E] hover:bg-[#F0FDFA]">
                    Secondary Outlined
                  </button>
                  <button className="rounded-xl bg-[#CCFBF1] px-5 py-2.5 text-xs font-bold text-[#0F766E] hover:bg-[#99F6E4]">
                    Ghost Accent
                  </button>
                  <button className="rounded-xl bg-[#EF4444] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#DC2626]">
                    Destructive Action
                  </button>
                  <button disabled className="rounded-xl bg-[#EAE6E1] px-5 py-2.5 text-xs font-bold text-[#968A80] cursor-not-allowed">
                    Disabled State
                  </button>
                </div>
              </div>

              {/* Status Badges */}
              <div className="rounded-2xl border border-[#EAE6E1] bg-white p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#968A80] mb-4">
                  Status Badges
                </h4>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-bold text-[#15803D]">
                    ● Confirmed
                  </span>
                  <span className="rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-bold text-[#D97706]">
                    ● Pending
                  </span>
                  <span className="rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-bold text-[#1D4ED8]">
                    ● Processing
                  </span>
                  <span className="rounded-full bg-[#FEE2E2] px-3 py-1 text-xs font-bold text-[#B91C1C]">
                    ● Cancelled
                  </span>
                  <span className="rounded-full bg-[#CCFBF1] px-3 py-1 text-xs font-bold text-[#0F766E]">
                    ★ Populer / Terlaris
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-[#EAE6E1] px-6 py-4 bg-[#FAF9F6]">
          <span className="text-xs text-[#968A80]">
            Figma Token: <code className="rounded bg-[#EAE6E1] px-1 py-0.5 font-mono text-[#1C1A16]">figd_Q9xW...</code>
          </span>
          <button
            onClick={onClose}
            className="rounded-xl bg-[#0F766E] px-5 py-2 text-xs font-bold text-white hover:bg-[#0D5C56]"
          >
            Tutup Preview
          </button>
        </div>
      </div>
    </div>
  );
}
