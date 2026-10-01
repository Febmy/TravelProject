'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X, ExternalLink } from 'lucide-react';
import { getAdminWhatsAppAction } from '@/actions/admin';

export function WhatsAppFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [waNumber, setWaNumber] = useState('6281234567891');

  useEffect(() => {
    getAdminWhatsAppAction().then(res => setWaNumber(res.customerCareWhatsApp)).catch(console.error);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Quick Menu Popover */}
      {isOpen && (
        <div className="mb-3 w-72 rounded-2xl border border-[#EAE6E1] bg-white p-4 shadow-xl transition-all">
          <div className="flex items-center justify-between border-b border-[#EAE6E1] pb-3">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-[#25D366] animate-pulse" />
              <span className="text-xs font-bold text-[#1C1A16]">Customer Care Safara</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#968A80] hover:text-[#1C1A16]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-xs text-[#6B6E6E]">
            Halo! Ada yang bisa kami bantu seputar destinasi hotel atau jadwal paket Umrah?
          </p>
          <div className="mt-3 space-y-2">
            <a
              href={`https://wa.me/${waNumber}?text=Halo%20Safara,%20saya%20ingin%20tanya%20Paket%20Umrah%20Eksklusif`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl bg-[#FAF9F6] p-2.5 text-xs font-semibold text-[#1C1A16] transition hover:bg-[#F0FDFA] hover:text-[#0F766E]"
            >
              <span>Konsultasi Paket Umrah</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href={`https://wa.me/${waNumber}?text=Halo%20Safara,%20saya%20butuh%20bantuan%20booking%20hotel`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl bg-[#FAF9F6] p-2.5 text-xs font-semibold text-[#1C1A16] transition hover:bg-[#F0FDFA] hover:text-[#0F766E]"
            >
              <span>Bantuan Reservasi Hotel</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-[52px] items-center gap-2.5 rounded-full bg-[#25D366] px-5 text-sm font-bold text-white shadow-lg shadow-[#25D366]/30 transition hover:scale-105 active:scale-95"
        aria-label="Tanya Safara via WhatsApp"
      >
        <MessageCircle className="h-5 w-5 fill-white text-[#25D366]" />
        <span>Tanya Safara</span>
      </button>
    </div>
  );
}
