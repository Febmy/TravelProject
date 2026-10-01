'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  FileText,
  ArrowRight,
  AlertCircle,
  Eye,
  X,
  Upload,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { figmaAssets } from '@/lib/figma-data';
import { trackBookingAction, uploadPaymentProofAction } from '@/actions/booking';

interface BookingTrackingViewProps {
  setScreen?: (screen: string) => void;
}

export function BookingTrackingView({ setScreen }: BookingTrackingViewProps) {
  const searchParams = useSearchParams();
  const [bookingCode, setBookingCode] = useState('SFR-2026-8941');
  const [isSearched, setIsSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [matchedBooking, setMatchedBooking] = useState<any>(null);

  // Lightbox Modal for receipt
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);

  // Late / Re-upload proof state
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newProofPreview, setNewProofPreview] = useState<string | null>(null);
  const [newSenderBank, setNewSenderBank] = useState('');
  const [newSenderName, setNewSenderName] = useState('');
  const [uploadMessage, setUploadMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const performSearch = async (codeToSearch: string) => {
    const cleanCode = codeToSearch.trim().toUpperCase();
    if (!cleanCode) return;

    setLoading(true);
    setSearchError(null);
    setIsSearched(true);
    setUploadMessage(null);

    try {
      // 1. Prioritaskan pencarian langsung ke database PostgreSQL
      const dbResult = await trackBookingAction(cleanCode);
      if (dbResult.success && dbResult.data) {
        setMatchedBooking(dbResult.data);
        setLoading(false);
        return;
      }

      // 2. Fallback pencarian riwayat lokal jika belum terindeks
      if (typeof window !== 'undefined') {
        const historyRaw = localStorage.getItem('safara_booking_history');
        const history = historyRaw ? JSON.parse(historyRaw) : [];
        const found = history.find(
          (b: any) => b.bookingCode?.toUpperCase() === cleanCode
        );

        if (found) {
          setMatchedBooking(found);
          setLoading(false);
          return;
        }

        const latest = localStorage.getItem('safara_latest_booking');
        const latestParsed = latest ? JSON.parse(latest) : null;
        if (latestParsed?.bookingCode?.toUpperCase() === cleanCode) {
          setMatchedBooking(latestParsed);
          setLoading(false);
          return;
        }
      }

      setMatchedBooking(null);
      setSearchError(`Nomor booking "${cleanCode}" tidak ditemukan di sistem database.`);
    } catch (err: any) {
      setSearchError('Terjadi gangguan saat menghubungi database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const codeParam = searchParams.get('code');
    if (codeParam) {
      setBookingCode(codeParam);
      performSearch(codeParam);
    } else {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('safara_latest_booking');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed?.bookingCode) {
              setBookingCode(parsed.bookingCode);
              performSearch(parsed.bookingCode);
              return;
            }
          } catch (e) {
            // ignore
          }
        }
      }
    }
  }, [searchParams]);

  const handleSearch = () => {
    performSearch(bookingCode);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProofPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadProof = async () => {
    if (!newProofPreview) {
      alert('Silakan pilih foto / file struk bukti transfer terlebih dahulu.');
      return;
    }

    setIsUploading(true);
    setUploadMessage(null);

    const activeCode = matchedBooking?.bookingCode || bookingCode;
    const res = await uploadPaymentProofAction(
      activeCode,
      newProofPreview,
      newSenderBank || undefined,
      newSenderName || undefined
    );

    setIsUploading(false);

    if (res.success) {
      setUploadMessage({ text: 'Bukti transfer berhasil diunggah! Sedang menunggu verifikasi admin.', isError: false });
      setShowUploadForm(false);
      // Refresh data
      performSearch(activeCode);
    } else {
      setUploadMessage({ text: res.error || 'Gagal mengunggah bukti transfer.', isError: true });
    }
  };

  const productTitle =
    matchedBooking?.title ||
    matchedBooking?.productName ||
    matchedBooking?.schedule?.package?.title ||
    matchedBooking?.hotel?.name ||
    'Paket Safara Travel';

  const isTour =
    matchedBooking?.itemType === 'TOUR' ||
    productTitle.toLowerCase().includes('umrah') ||
    productTitle.toLowerCase().includes('paket');

  const imageSrc =
    matchedBooking?.hotel?.images?.[0]?.imageUrl ||
    matchedBooking?.schedule?.package?.images?.[0]?.imageUrl ||
    (isTour ? figmaAssets.kaabaImage : figmaAssets.alilaSeminyak);

  const formattedTotal = matchedBooking?.totalPrice
    ? Number(matchedBooking.totalPrice).toLocaleString('id-ID')
    : matchedBooking?.total
    ? Number(matchedBooking.total).toLocaleString('id-ID')
    : '0';

  const checkinDateFormatted = matchedBooking?.checkInDate
    ? new Date(matchedBooking.checkInDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : matchedBooking?.checkin || 'Sesuai Jadwal';

  const checkoutDateFormatted = matchedBooking?.checkOutDate
    ? new Date(matchedBooking.checkOutDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : matchedBooking?.checkout || 'Selesai Program';

  const proofImage =
    matchedBooking?.payment?.proofUrl ||
    matchedBooking?.proofUrl ||
    null;

  const isPending =
    matchedBooking?.status === 'PENDING' ||
    matchedBooking?.status === 'MENUNGGU VERIFIKASI' ||
    (matchedBooking?.status !== 'CONFIRMED' && matchedBooking?.status !== 'CANCELLED');

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-16">
      {/* Lightbox Modal for Receipt */}
      {isProofModalOpen && proofImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <span className="font-bold text-xs text-neutral-800">Bukti Transfer Rekening</span>
              <button
                onClick={() => setIsProofModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-800 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-3 max-h-[75vh] overflow-y-auto rounded-2xl bg-neutral-50 flex items-center justify-center p-2">
              <img
                src={proofImage}
                alt="Bukti Transfer"
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Title */}
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E]">
            Layanan Pelacakan Real-Time Database
          </span>
          <h1 className="mt-2 font-['Figtree'] text-3xl font-bold tracking-tight text-[#1C1A16] sm:text-4xl">
            Lacak Status Pemesanan Anda
          </h1>
          <p className="mt-2 text-sm text-[#6B6E6E] max-w-xl mx-auto">
            Pantau proses verifikasi pembayaran transfer manual dan konfirmasi kuota ibadah/kamar secara transparan.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-8 flex rounded-2xl border border-[#EAE6E1] bg-white p-2 shadow-lg max-w-xl mx-auto">
          <input
            type="text"
            value={bookingCode}
            onChange={(e) => setBookingCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Contoh: SFR-2026-8941"
            className="flex-1 px-4 py-2 text-sm font-mono font-bold uppercase text-[#1C1A16] outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl bg-[#0F766E] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0D5C56] disabled:opacity-50 transition"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span>Cari Booking</span>
          </button>
        </div>

        {searchError && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-800 max-w-xl mx-auto">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}

        {/* Tracking Timeline Container */}
        {isSearched && matchedBooking && (
          <div className="mt-12 rounded-3xl border border-[#EAE6E1] bg-white p-8 shadow-xl space-y-8 animate-in fade-in duration-300">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EAE6E1] pb-6">
              <div>
                <span className="text-xs font-bold text-[#968A80]">Kode Booking Terverifikasi</span>
                <p className="font-mono text-xl font-bold text-[#0F766E]">
                  {matchedBooking.bookingCode || bookingCode}
                </p>
                <p className="text-xs text-[#6B6E6E] mt-0.5">
                  Pemesan: {matchedBooking.guestName || matchedBooking.fullName || matchedBooking.user?.name || 'Tamu Terhormat'}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`rounded-full px-3.5 py-1 text-xs font-bold ${
                    isPending
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-[#DCFCE7] text-[#15803D]'
                  }`}
                >
                  ● {isPending ? 'Menunggu Verifikasi Pembayaran' : 'Terkonfirmasi (Lunas)'}
                </span>
                <p className="mt-1 text-[11px] text-[#968A80]">
                  Terdaftar di Database PostgreSQL
                </p>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#1C1A16] mb-6">
                Progres Reservasi Sistem
              </h2>

              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: 'Pemesanan Berhasil Terdaftar',
                    time: matchedBooking.createdAt
                      ? new Date(matchedBooking.createdAt).toLocaleString('id-ID')
                      : 'Terdaftar di Sistem',
                    desc: 'Reservasi resmi tercatat secara aman di basis data Safara Travel.',
                    completed: true,
                  },
                  {
                    step: 2,
                    title: isPending ? 'Verifikasi Bukti Transfer Bank' : 'Pembayaran Terverifikasi (Lunas)',
                    time: isPending
                      ? 'Sedang Ditinjau Tim Finance'
                      : (matchedBooking.payment?.paidAt
                          ? new Date(matchedBooking.payment.paidAt).toLocaleString('id-ID')
                          : 'Terkonfirmasi Lunas'),
                    desc: isPending
                      ? (proofImage
                          ? 'Bukti transfer Anda sudah diterima sistem dan sedang dicocokkan dengan mutasi rekening PT SAFARA GLOBAL TRAVEL.'
                          : 'Bukti transfer belum diunggah. Silakan unggah bukti transfer agar pesanan dapat diverifikasi.')
                      : `Pembayaran sebesar Rp ${formattedTotal} sukses divalidasi oleh finance Safara.`,
                    completed: !isPending,
                    active: isPending,
                  },
                  {
                    step: 3,
                    title: isTour ? 'Konfirmasi Maskapai & Hotel Suci' : 'Konfirmasi Properti Penginapan',
                    time: isPending ? 'Menunggu Pembayaran Lunas' : 'Terkonfirmasi Otomatis',
                    desc: `Pihak ${productTitle} memvalidasi kuota dan kamar untuk pemesan setelah pembayaran disetujui.`,
                    completed: !isPending,
                  },
                  {
                    step: 4,
                    title: 'Voucher Digital & E-Tiket Aktif',
                    time: isPending ? 'Segera Terbit' : 'Siap Digunakan',
                    desc: `Dokumen resmi diterbitkan untuk email ${
                      matchedBooking.guestEmail || matchedBooking.email || matchedBooking.user?.email || 'pemesan'
                    }.`,
                    completed: !isPending,
                  },
                  {
                    step: 5,
                    title: isTour ? 'Keberangkatan & Bimbingan Ibadah' : 'Check-in di Properti',
                    time: `${checkinDateFormatted}`,
                    desc: `Cukup tunjukkan KTP/Paspor dan kode booking ${
                      matchedBooking.bookingCode || bookingCode
                    } kepada petugas Safara.`,
                    completed: false,
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          item.completed
                            ? 'bg-[#0F766E] text-white'
                            : item.active
                            ? 'border-2 border-amber-500 bg-amber-50 text-amber-700 animate-pulse'
                            : 'border-2 border-[#EAE6E1] bg-[#FAF9F6] text-[#968A80]'
                        }`}
                      >
                        {item.completed ? '✓' : item.step}
                      </div>
                      {idx !== 4 && (
                        <div
                          className={`mt-2 h-12 w-0.5 ${
                            item.completed ? 'bg-[#0F766E]' : 'bg-[#EAE6E1]'
                          }`}
                        />
                      )}
                    </div>
                    <div className="pb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#1C1A16]">{item.title}</h4>
                        {item.active && (
                          <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                            Proses Saat Ini
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#968A80] block mt-0.5">{item.time}</span>
                      <p className="mt-1 text-xs text-[#6B6E6E]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Proof of Payment Box & Late Upload Option */}
            <div className="rounded-2xl border border-teal-200 bg-[#F0FDFA] p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  {proofImage ? (
                    <div
                      onClick={() => setIsProofModalOpen(true)}
                      className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden border border-teal-300 bg-white cursor-pointer group shadow-sm"
                    >
                      <img
                        src={proofImage}
                        alt="Bukti Transfer"
                        className="h-full w-full object-cover group-hover:scale-105 transition"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <Eye className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="h-16 w-16 shrink-0 rounded-xl border border-amber-300 bg-amber-50 flex items-center justify-center text-amber-600">
                      <Upload className="h-6 w-6" />
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                      Status Bukti Transfer Rekening
                    </span>
                    <h4 className="font-bold text-sm text-teal-950">
                      {proofImage ? 'Bukti Pembayaran Terunggah' : 'Belum Ada Bukti Pembayaran'}
                    </h4>
                    <p className="text-xs text-teal-700 mt-0.5">
                      {matchedBooking?.payment?.senderBank || matchedBooking?.senderBank
                        ? `Bank Pengirim: ${matchedBooking.payment?.senderBank || matchedBooking.senderBank} a.n ${
                            matchedBooking.payment?.senderName || matchedBooking.senderName || '-'
                          }`
                        : 'Transfer Manual Rekening Travel'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {proofImage && (
                    <button
                      onClick={() => setIsProofModalOpen(true)}
                      className="flex items-center gap-1.5 rounded-xl border border-teal-300 bg-white px-3.5 py-2 text-xs font-bold text-teal-800 hover:bg-teal-50 transition shadow-sm"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Perbesar Struk</span>
                    </button>
                  )}

                  {isPending && (
                    <button
                      onClick={() => setShowUploadForm(!showUploadForm)}
                      className="flex items-center gap-1.5 rounded-xl bg-teal-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-teal-800 transition shadow-sm"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>{proofImage ? 'Ganti Bukti' : 'Unggah Bukti'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Upload Notification Message */}
              {uploadMessage && (
                <div
                  className={`mt-4 p-3 rounded-xl text-xs font-medium ${
                    uploadMessage.isError
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {uploadMessage.text}
                </div>
              )}

              {/* Inline Upload Form when expanded */}
              {showUploadForm && (
                <div className="mt-4 pt-4 border-t border-teal-200 space-y-3">
                  <p className="text-xs font-semibold text-teal-900">
                    Pilih foto atau screenshot struk transfer bank Anda:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-teal-800 block mb-1">
                        Bank Pengirim (Opsional)
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: BCA / Mandiri / BSI"
                        value={newSenderBank}
                        onChange={(e) => setNewSenderBank(e.target.value)}
                        className="w-full rounded-xl border border-teal-200 bg-white px-3 py-2 text-xs text-neutral-800 outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-teal-800 block mb-1">
                        Nama Pemilik Rekening Pengirim (Opsional)
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Ahmad Fulan"
                        value={newSenderName}
                        onChange={(e) => setNewSenderName(e.target.value)}
                        className="w-full rounded-xl border border-teal-200 bg-white px-3 py-2 text-xs text-neutral-800 outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-xs text-teal-900 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-800 file:text-white hover:file:bg-teal-900 cursor-pointer"
                    />
                  </div>

                  {newProofPreview && (
                    <div className="mt-2 flex items-center gap-3">
                      <img
                        src={newProofPreview}
                        alt="Preview Struk Baru"
                        className="h-16 w-20 rounded-lg object-cover border border-teal-300"
                      />
                      <button
                        onClick={handleUploadProof}
                        disabled={isUploading}
                        className="rounded-xl bg-teal-800 px-4 py-2 text-xs font-bold text-white hover:bg-teal-900 disabled:opacity-50 transition"
                      >
                        {isUploading ? 'Menyimpan...' : 'Kirim Bukti Transfer'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Product Snapshot */}
            <div className="rounded-2xl border border-[#EAE6E1] bg-[#FAF9F6] p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={imageSrc}
                    alt={productTitle}
                    className="h-16 w-20 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-[#1C1A16]">{productTitle}</h4>
                    <p className="text-xs text-[#6B6E6E]">
                      {checkinDateFormatted} — {checkoutDateFormatted} ·{' '}
                      {matchedBooking.roomName || (isTour ? 'Paket Komplit' : 'Deluxe Room')}
                    </p>
                    <span className="text-xs font-bold text-[#0F766E]">
                      Total: Rp {formattedTotal}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/invoice?code=${matchedBooking.bookingCode || bookingCode}`}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-white border border-[#EAE6E1] px-4 py-2.5 text-xs font-bold text-[#1C1A16] hover:bg-[#F5F3EF] shadow-sm transition"
                  >
                    <FileText className="h-4 w-4 text-[#0F766E]" />
                    <span>Lihat Invoice</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
