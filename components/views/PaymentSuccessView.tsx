'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Download,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building,
  Image as ImageIcon,
  AlertCircle,
  Eye,
  X,
} from 'lucide-react';
import { figmaAssets } from '@/lib/figma-data';

interface PaymentSuccessViewProps {
  bookingData: any;
  setScreen: (screen: string) => void;
}

export function PaymentSuccessView({ bookingData, setScreen }: PaymentSuccessViewProps) {
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);

  const code = bookingData?.bookingCode || 'SFR-2026-8941';
  const title = bookingData?.title || bookingData?.productName || 'The Alila Seminyak Resort';
  const isTour =
    bookingData?.itemType === 'TOUR' ||
    title.toLowerCase().includes('umrah') ||
    title.toLowerCase().includes('paket');

  const location =
    bookingData?.hotel?.location ||
    bookingData?.schedule?.package?.destination?.city ||
    (isTour ? 'Makkah & Madinah, Arab Saudi' : 'Seminyak, Bali, Indonesia');

  const detailSubtitle = isTour
    ? `Paket Perjalanan Ibadah · ${bookingData?.numParticipants || 1} Jamaah`
    : `${bookingData?.roomName || 'Deluxe Room'} · ${bookingData?.duration || '3 Malam'} · ${
        bookingData?.numParticipants || 2
      } Tamu`;

  const checkinLabel = isTour ? 'Jadwal Keberangkatan' : 'Check-in';
  const checkoutLabel = isTour ? 'Estimasi Kepulangan' : 'Check-out';

  const checkinVal = bookingData?.checkInDate
    ? new Date(bookingData.checkInDate).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : bookingData?.checkin || (isTour ? '14 Oktober 2026' : 'Kamis, 12 Maret 2026');

  const checkoutVal = bookingData?.checkOutDate
    ? new Date(bookingData.checkOutDate).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : bookingData?.checkout || (isTour ? '23 Oktober 2026' : 'Minggu, 15 Maret 2026');

  const imageSrc =
    bookingData?.hotel?.images?.[0]?.imageUrl ||
    bookingData?.schedule?.package?.images?.[0]?.imageUrl ||
    (isTour ? figmaAssets.kaabaImage : figmaAssets.alilaSeminyak);

  const proofImage =
    bookingData?.payment?.proofUrl ||
    bookingData?.proofUrl ||
    null;

  const isPending =
    bookingData?.status === 'PENDING' ||
    bookingData?.status === 'MENUNGGU VERIFIKASI' ||
    !bookingData?.status;

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-16">
      {/* Lightbox Modal for Transfer Receipt */}
      {isProofModalOpen && proofImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <span className="font-bold text-xs text-neutral-800">Bukti Transfer Bank</span>
              <button
                onClick={() => setIsProofModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-3 max-h-[75vh] overflow-y-auto rounded-2xl bg-neutral-50 flex items-center justify-center p-2">
              <img src={proofImage} alt="Bukti Transfer" className="max-h-[70vh] w-auto object-contain rounded-xl" />
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Success Card */}
        <div className="overflow-hidden rounded-3xl border border-[#EAE6E1] bg-white shadow-2xl">
          {/* Header Banner */}
          <div className="bg-[#0F766E] p-8 text-center text-white">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
              {isPending ? (
                <Clock className="h-10 w-10 text-[#CCFBF1]" />
              ) : (
                <CheckCircle2 className="h-10 w-10 text-[#CCFBF1]" />
              )}
            </div>
            <h1 className="mt-4 font-['Figtree'] text-2xl font-bold sm:text-3xl">
              {isPending ? 'Bukti Pembayaran Diterima!' : 'Pembayaran Berhasil!'}
            </h1>
            <p className="mt-1 text-sm text-[#CCFBF1] max-w-xl mx-auto leading-relaxed">
              {isPending
                ? 'Terima kasih! Bukti transfer Anda telah tersimpan di sistem. Tim finance Safara sedang memverifikasi mutasi rekening Anda.'
                : 'Pemesanan Anda telah tersimpan dan terkonfirmasi secara resmi di sistem database Safara.'}
            </p>
          </div>

          {/* Details Body */}
          <div className="p-8 space-y-8">
            {/* Booking Code Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#EAE6E1] bg-[#FAF9F6] p-4">
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#968A80]">
                  Kode Booking Resmi (Database)
                </span>
                <span className="font-mono text-xl font-bold text-[#0F766E]">{code}</span>
              </div>
              <span
                className={`rounded-full px-3.5 py-1 text-xs font-bold ${
                  isPending
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-[#DCFCE7] text-[#15803D]'
                }`}
              >
                ● {isPending ? 'Menunggu Verifikasi Admin' : 'TERKONFIRMASI'}
              </span>
            </div>

            {/* Proof of Payment & Bank Info Card */}
            {proofImage && (
              <div className="rounded-2xl border border-teal-200 bg-[#F0FDFA] p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      onClick={() => setIsProofModalOpen(true)}
                      className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden border border-teal-300 bg-white cursor-pointer group shadow-sm"
                    >
                      <img
                        src={proofImage}
                        alt="Bukti Transfer"
                        className="h-full w-full object-cover group-hover:scale-105 transition"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <Eye className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F766E] block">
                        Bukti Transfer Terkirim
                      </span>
                      <h4 className="font-bold text-sm text-[#1C1A16] mt-0.5">
                        {bookingData?.senderBank || 'Transfer Bank'} · a.n. {bookingData?.senderName || bookingData?.fullName || 'Pengirim'}
                      </h4>
                      <p className="text-xs text-[#6B6E6E] mt-0.5">
                        Tujuan: Rekening PT SAFARA GLOBAL TRAVEL
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsProofModalOpen(true)}
                    className="flex items-center gap-1 text-xs font-bold text-[#0F766E] hover:underline"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Lihat Bukti Foto</span>
                  </button>
                </div>
              </div>
            )}

            {/* Product Summary */}
            <div className="border-b border-[#EAE6E1] pb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#968A80]">
                Detail Reservasi
              </h2>
              <div className="mt-3 flex items-start gap-4">
                <img
                  src={imageSrc}
                  alt={title}
                  className="h-20 w-24 rounded-xl object-cover border border-[#EAE6E1]"
                />
                <div>
                  <h3 className="font-['Figtree'] text-base font-bold text-[#1C1A16]">
                    {title}
                  </h3>
                  <div className="mt-1 flex items-center gap-1 text-xs text-[#6B6E6E]">
                    <MapPin className="h-3.5 w-3.5 text-[#0F766E]" />
                    <span>{location}</span>
                  </div>
                  <div className="mt-2 text-xs font-medium text-[#0F766E]">
                    {detailSubtitle}
                  </div>
                </div>
              </div>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-b border-[#EAE6E1] pb-6 text-xs">
              <div className="rounded-xl border border-[#EAE6E1] bg-[#FAF9F6] p-3.5">
                <span className="text-[#968A80] block text-[11px] font-semibold">{checkinLabel}</span>
                <span className="font-bold text-[#1C1A16] text-sm mt-0.5 block">
                  {checkinVal}
                </span>
                <span className="text-[11px] text-[#968A80]">
                  {isTour ? 'Waktu kumpul terminal 3' : 'Mulai pukul 14:00'}
                </span>
              </div>
              <div className="rounded-xl border border-[#EAE6E1] bg-[#FAF9F6] p-3.5">
                <span className="text-[#968A80] block text-[11px] font-semibold">{checkoutLabel}</span>
                <span className="font-bold text-[#1C1A16] text-sm mt-0.5 block">
                  {checkoutVal}
                </span>
                <span className="text-[11px] text-[#968A80]">
                  {isTour ? 'Tiba di Bandara Soetta' : 'Maksimal pukul 12:00'}
                </span>
              </div>
            </div>

            {/* Verification Notice */}
            <div className="rounded-2xl border border-[#CCFBF1] bg-[#F0FDFA] p-4 text-xs text-[#0F766E] flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Estimasi Verifikasi: 10 - 30 Menit</span>
                <p className="mt-0.5 text-[11px] text-[#6B6E6E] leading-relaxed">
                  Setelah tim admin Safara memverifikasi mutasi transfer pada rekening, e-tiket dan voucher resmi akan langsung aktif secara otomatis dan dapat Anda unduh di halaman Invoice atau menu Profil Saya.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setScreen(`invoice?code=${code}`)}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0F766E] py-3.5 text-xs font-bold text-white shadow-md shadow-[#0F766E]/20 transition hover:bg-[#0D5C56]"
              >
                <FileText className="h-4 w-4" />
                <span>Lihat / Cetak Invoice</span>
              </button>
              <button
                onClick={() => setScreen(`tracking?code=${code}`)}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#0F766E] py-3.5 text-xs font-bold text-[#0F766E] transition hover:bg-[#F0FDFA]"
              >
                <Clock className="h-4 w-4" />
                <span>Lacak Status Booking</span>
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setScreen('/')}
                className="text-xs font-bold text-[#968A80] hover:text-[#1C1A16]"
              >
                ← Kembali ke Beranda Utama
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
