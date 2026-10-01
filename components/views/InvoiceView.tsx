'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  Download,
  Printer,
  Compass,
  CheckCircle2,
  ShieldCheck,
  QrCode,
} from 'lucide-react';
import { figmaInvoiceData } from '@/lib/figma-data';
import { trackBookingAction } from '@/actions/booking';

interface InvoiceViewProps {
  setScreen?: (screen: string) => void;
}

export function InvoiceView({ setScreen }: InvoiceViewProps) {
  const searchParams = useSearchParams();
  const inv = figmaInvoiceData;
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    const codeParam = searchParams.get('code');
    if (codeParam) {
      trackBookingAction(codeParam).then((res) => {
        if (res.success && res.data) {
          setBookingData(res.data);
          return;
        }
      });
    }

    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('safara_latest_booking');
        if (saved) {
          setBookingData(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to parse safara_latest_booking:', e);
      }
    }
  }, [searchParams]);

  const handlePrint = () => {
    window.print();
  };

  const bookingCode = bookingData?.bookingCode || inv.bookingCode;
  const invoiceNo = bookingCode ? `INV-2026-${bookingCode.replace('SFR-2026-', '')}` : inv.invoiceNo;
  const customerName = bookingData?.guestName || bookingData?.fullName || bookingData?.user?.name || inv.customer.name;
  const customerEmail = bookingData?.guestEmail || bookingData?.email || bookingData?.user?.email || inv.customer.email;
  const customerPhone = bookingData?.guestPhone || bookingData?.phone || bookingData?.user?.phoneNumber || inv.customer.phone;
  
  const productName = bookingData?.title || 
                      bookingData?.productName || 
                      bookingData?.schedule?.package?.title || 
                      bookingData?.hotel?.name || 
                      inv.item.product;
                      
  const roomName = bookingData?.roomName || 
                   bookingData?.hotelRoom?.name || 
                   (bookingData?.itemType === 'TOUR' ? 'Paket Komplit Bintang 5' : 'Deluxe Ocean View');

  const checkin = bookingData?.checkInDate
    ? new Date(bookingData.checkInDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : (bookingData?.checkin || inv.item.checkin);

  const checkout = bookingData?.checkOutDate
    ? new Date(bookingData.checkOutDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : (bookingData?.checkout || inv.item.checkout);

  const duration = bookingData?.duration || (bookingData?.itemType === 'TOUR' ? '9 Hari' : inv.item.duration);
  
  const rawTotal = bookingData?.totalPrice ? Number(bookingData.totalPrice) : (bookingData?.total ? Number(bookingData.total) : inv.item.total);
  const discount = bookingData?.discount !== undefined ? bookingData.discount : 0;
  const tax = Math.round(rawTotal * 0.1);
  const subtotal = rawTotal - tax + discount;
  const total = rawTotal;

  const paidAt = bookingData?.payment?.paidAt 
    ? new Date(bookingData.payment.paidAt).toLocaleString('id-ID')
    : (bookingData?.paidAt || inv.payment.paidAt);

  const paymentMethodLabel = bookingData?.payment?.paymentMethod || bookingData?.paymentMethod || inv.payment.method;

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-10">
      {/* 1. ACTION HEADER (Figma action-header) */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 mb-6 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href={`/tracking?code=${bookingCode}`}
            className="flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Kembali ke Detail Booking</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl border border-[#EAE6E1] bg-white px-4 py-2 text-xs font-bold text-[#1C1A16] shadow-sm hover:bg-[#FAF9F6] transition"
            >
              <Printer className="h-4 w-4 text-[#0F766E]" />
              <span>Cetak Invoice</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0D5C56] transition"
            >
              <Download className="h-4 w-4" />
              <span>Unduh PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. INVOICE DOCUMENT */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-3xl border border-[#EAE6E1] bg-white p-8 sm:p-12 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 border-b border-[#EAE6E1] pb-8">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F766E] text-white">
                  <Compass className="h-5 w-5" />
                </div>
                <span className="font-['Figtree'] text-2xl font-bold tracking-tight text-[#1C1A16]">
                  Safara<span className="text-[#0F766E]"> Travel</span>
                </span>
              </div>
              <p className="mt-3 text-xs text-[#6B6E6E] max-w-xs leading-relaxed">
                {inv.company.name}
                <br />
                {inv.company.address}
                <br />
                NPWP: {inv.company.npwp}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="font-['Figtree'] text-3xl font-light tracking-widest text-[#1C1A16]">
                INVOICE
              </span>
              <div className="mt-2">
                <span className="inline-block rounded-full bg-[#DCFCE7] px-3.5 py-1 text-xs font-bold text-[#15803D]">
                  ● {bookingData?.status || 'LUNAS / DIKONFIRMASI'}
                </span>
              </div>
            </div>
          </div>

          {/* Info Columns */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 border-b border-[#EAE6E1] pb-8 text-xs">
            <div>
              <span className="font-bold uppercase tracking-wider text-[#968A80]">
                Tagihan Kepada:
              </span>
              <h4 className="mt-2 text-sm font-bold text-[#1C1A16]">{customerName}</h4>
              <p className="mt-1 text-[#6B6E6E] leading-relaxed">
                {customerEmail}
                <br />
                {customerPhone}
                <br />
                Indonesia
              </p>
            </div>

            <div className="space-y-2 sm:text-right">
              <div>
                <span className="text-[#968A80]">No. Invoice: </span>
                <span className="font-mono font-bold text-[#1C1A16]">{invoiceNo}</span>
              </div>
              <div>
                <span className="text-[#968A80]">Kode Booking: </span>
                <span className="font-mono font-bold text-[#0F766E]">{bookingCode}</span>
              </div>
              <div>
                <span className="text-[#968A80]">Tanggal Pembayaran: </span>
                <span className="font-semibold text-[#1C1A16]">{paidAt}</span>
              </div>
              <div>
                <span className="text-[#968A80]">Metode: </span>
                <span className="font-semibold text-[#1C1A16]">{paymentMethodLabel}</span>
              </div>
            </div>
          </div>

          {/* Item Table */}
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EAE6E1] bg-[#FAF9F6] text-[#968A80] uppercase tracking-wider">
                  <th className="py-3 px-4 font-bold">Deskripsi Produk</th>
                  <th className="py-3 px-4 font-bold">Durasi / Tamu</th>
                  <th className="py-3 px-4 text-right font-bold">Tarif</th>
                  <th className="py-3 px-4 text-right font-bold">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE6E1]">
                <tr>
                  <td className="py-4 px-4">
                    <p className="font-bold text-sm text-[#1C1A16]">{productName}</p>
                    <p className="text-[11px] text-[#6B6E6E]">{roomName}</p>
                    <p className="text-[11px] text-[#968A80]">
                      Periode: {checkin} — {checkout}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-[#6B6E6E]">
                    {duration}
                    <br />
                    {bookingData?.numParticipants || 2} Tamu / Peserta
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-semibold text-[#1C1A16]">
                    Rp {Math.round(subtotal).toLocaleString('id-ID')}
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-[#1C1A16]">
                    Rp {Math.round(subtotal).toLocaleString('id-ID')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-6 flex justify-end border-t border-[#EAE6E1] pt-6">
            <div className="w-full max-w-xs space-y-2 text-xs">
              <div className="flex justify-between text-[#6B6E6E]">
                <span>Subtotal:</span>
                <span className="font-mono">Rp {Math.round(subtotal).toLocaleString('id-ID')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#15803D] font-semibold">
                  <span>Diskon Kupon Promo:</span>
                  <span className="font-mono">- Rp {discount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between text-[#6B6E6E]">
                <span>PPN 10%:</span>
                <span className="font-mono">Rp {tax.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-[#6B6E6E]">
                <span>Biaya Layanan:</span>
                <span className="text-[#10B981] font-semibold">Gratis</span>
              </div>
              <div className="flex justify-between border-t border-[#EAE6E1] pt-3 text-sm font-bold text-[#1C1A16]">
                <span>Total Lunas:</span>
                <span className="font-['Figtree'] text-xl text-[#0F766E]">
                  Rp {total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Notice & Stamp */}
          <div className="mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 rounded-2xl border border-[#CCFBF1] bg-[#F0FDFA] p-5 text-xs text-[#0F766E]">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 shrink-0" />
              <div>
                <span className="font-bold">Faktur Pembayaran Sah & Terverifikasi Database</span>
                <p className="mt-0.5 text-[11px] text-[#6B6E6E]">
                  Dokumen ini merupakan bukti reservasi resmi yang dikeluarkan secara digital oleh PT
                  Safara Global Travel dari basis data sistem PostgreSQL.
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-[#0F766E] bg-white px-3 py-1.5 text-center font-mono text-[11px] font-bold">
              VERIFIED BY SAFARA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
