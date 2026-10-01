'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Building,
  CheckCircle2,
  Lock,
  ArrowRight,
  ChevronLeft,
  Copy,
  Check,
  Upload,
  AlertTriangle,
  AlertCircle,
  Camera,
  Image as ImageIcon,
  X,
  FileText,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createBookingAction, getPublicBankAccountsAction } from '@/actions/booking';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store/cartStore';

interface BookingCheckoutViewProps {
  item: any;
  setScreen: (screen: string) => void;
  onPaymentSuccess: (bookingData: any) => void;
}

// Rekening Bank Resmi PT Safara Global Travel
export const travelBankAccounts = [
  {
    id: 'BCA',
    bankName: 'Bank Central Asia (BCA)',
    accountNumber: '8410998823',
    accountName: 'PT SAFARA GLOBAL TRAVEL',
    badge: 'Paling Direkomendasikan',
    code: '014',
    logoText: 'BCA',
    color: '#005CAA',
    lightBg: '#EFF6FF',
  },
  {
    id: 'MANDIRI',
    bankName: 'Bank Mandiri',
    accountNumber: '1370029988120',
    accountName: 'PT SAFARA GLOBAL TRAVEL',
    badge: 'm-Banking Livin',
    code: '008',
    logoText: 'MANDIRI',
    color: '#003D79',
    lightBg: '#F0F9FF',
  },
  {
    id: 'BSI',
    bankName: 'Bank Syariah Indonesia (BSI)',
    accountNumber: '7199008811',
    accountName: 'PT SAFARA GLOBAL TRAVEL',
    badge: 'Syariah Khusus Umrah',
    code: '451',
    logoText: 'BSI',
    color: '#00A39D',
    lightBg: '#F0FDFA',
  },
  {
    id: 'BNI',
    bankName: 'Bank Negara Indonesia (BNI)',
    accountNumber: '0988771234',
    accountName: 'PT SAFARA GLOBAL TRAVEL',
    badge: 'Transfer ATM / Mobile',
    code: '009',
    logoText: 'BNI',
    color: '#F15A24',
    lightBg: '#FFF7ED',
  },
];

export function BookingCheckoutView({
  item,
  setScreen,
  onPaymentSuccess,
}: BookingCheckoutViewProps) {
  const router = useRouter();
  const { data: session } = useSession();

  // Wizard Steps: 1 = Data Tamu, 2 = Pembayaran Rekening & Bukti Transfer
  const [step, setStep] = useState<1 | 2>(1);

  // Form State: Data Tamu (Diambil dari akun yang sedang login)
  const [fullName, setFullName] = useState(session?.user?.name || '');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [phone, setPhone] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');

  // Selected Travel Bank
  const [banks, setBanks] = useState<any[]>(travelBankAccounts);
  const [selectedBankId, setSelectedBankId] = useState<string>('BCA');
  
  useEffect(() => {
    // Fetch dynamic banks
    getPublicBankAccountsAction().then(res => {
      if (res.success && res.data && res.data.length > 0) {
        setBanks(res.data);
        setSelectedBankId(res.data[0].id);
      }
    });
  }, []);

  const selectedBank = banks.find((b) => b.id === selectedBankId) || banks[0];

  // Upload Bukti Transfer State
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [senderName, setSenderName] = useState('');
  const [senderBank, setSenderBank] = useState('');

  // Copy Feedback
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  // Voucher state
  const [voucherCode, setVoucherCode] = useState('SAFARAHEMAT15');
  const [discountApplied, setDiscountApplied] = useState(true);
  const [voucherError, setVoucherError] = useState<string | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      if (session.user.name && !fullName) {
        setFullName(session.user.name);
        setSenderName(session.user.name);
      }
      if (session.user.email && !email) {
        setEmail(session.user.email);
      }
    }
  }, [session]);

  // Dynamic voucher logic
  let discountAmount = 0;
  if (discountApplied) {
    if (voucherCode.toUpperCase() === 'SAFARAHEMAT15') {
      discountAmount = Math.round(item?.price ? item.price * 0.15 : 500000);
    } else if (voucherCode.toUpperCase() === 'UMRAHBERKAH25') {
      discountAmount = 2500000;
    } else if (voucherCode.toUpperCase() === 'FIRSTSAFARA') {
      discountAmount = 500000;
    } else {
      discountAmount = 500000;
    }
  }

  const basePrice = item?.price || 13500000;
  const tax = Math.round((basePrice - discountAmount) * 0.1);
  const total = basePrice - discountAmount + tax;

  const handleApplyVoucher = () => {
    if (discountApplied) {
      setDiscountApplied(false);
      setVoucherError(null);
      return;
    }
    const code = voucherCode.trim().toUpperCase();
    if (['SAFARAHEMAT15', 'UMRAHBERKAH25', 'FIRSTSAFARA'].includes(code)) {
      setDiscountApplied(true);
      setVoucherError(null);
    } else {
      setVoucherError('Kode promo tidak ditemukan atau kedaluwarsa.');
      setDiscountApplied(false);
    }
  };

  const handleCopy = (text: string, type: 'account' | 'amount') => {
    navigator.clipboard.writeText(text);
    if (type === 'account') {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2500);
    } else {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2500);
    }
  };

  // Handle Proof File Upload with automatic smart client-side compression
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('Ukuran file maksimal 15MB.');
      return;
    }

    setProofFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1200;
        const maxHeight = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setProofPreview(compressedDataUrl);
        } else {
          setProofPreview(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

async function compressDataUrl(dataUrl: string, maxDim = 1000, quality = 0.75): Promise<string> {
  if (typeof window === 'undefined' || !dataUrl.startsWith('data:image')) return dataUrl;
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      if (w > h) {
        if (w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        }
      } else {
        if (h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

  // Submit Booking & Payment to PostgreSQL
  const handlePay = async () => {
    if (!fullName || !email || !phone) {
      alert('Mohon lengkapi data pemesan (Nama, Email, dan No. Telepon).');
      setStep(1);
      return;
    }

    if (!session?.user) {
      setSubmitError('Anda harus masuk (login) atau mendaftar akun terlebih dahulu untuk memesan.');
      alert('Silakan login terlebih dahulu untuk melanjutkan pemesanan.');
      router.push('/login?callbackUrl=/checkout');
      return;
    }

    if (!proofPreview) {
      alert('Wajib mengunggah bukti transfer bank sebelum menyelesaikan pesanan.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const isHotel = item?.type === 'HOTEL' || (!item?.departureDate && !item?.scheduleId);

    try {
      let finalProof = proofPreview;
      if (proofPreview && proofPreview.length > 200000) {
        try {
          finalProof = await compressDataUrl(proofPreview, 1000, 0.75);
        } catch (e) {
          // fallback
        }
      }

      const res = await createBookingAction({
        userId: (session?.user as any)?.id || undefined,
        itemType: isHotel ? 'HOTEL' : 'TOUR',
        title: item?.name || item?.title || (isHotel ? 'Reservasi Hotel' : 'Paket Umrah'),
        scheduleId: item?.scheduleId || undefined,
        hotelId: item?.hotelId || item?.id || undefined,
        hotelRoomId: item?.hotelRoomId || undefined,
        numParticipants: item?.quantity || 1,
        totalPrice: total,
        paymentMethod: `TRANSFER_${selectedBank.id}`,
        proofUrl: finalProof,
        senderBank: senderBank || selectedBank.bankName,
        senderName: senderName || fullName,
        guestName: fullName,
        guestEmail: email,
        guestPhone: phone,
        specialRequest,
        checkInDate: item?.departureDate || item?.checkin || undefined,
        checkOutDate: item?.checkout || undefined,
      });

      setIsSubmitting(false);

      if (!res.success || !res.data) {
        setSubmitError(res.error || 'Gagal menyimpan transaksi ke database.');
        return;
      }

      // Clear Zustand cart upon successful order
      useCartStore.getState().clearCart();

      const bookingPayload = {
        ...res.data,
        fullName,
        email,
        phone,
        specialRequest,
        basePrice,
        discount: discountAmount,
        tax,
        total,
        paymentMethod: `Transfer Bank ${selectedBank.bankName}`,
        destinationBank: selectedBank,
        proofUrl: proofPreview,
        senderBank: senderBank || selectedBank.bankName,
        senderName: senderName || fullName,
        productName: res.data.title || item?.name || 'Reservasi Safara',
        roomName: item?.roomName || (isHotel ? 'Deluxe Room' : 'Paket All-In'),
        checkin: item?.departureDate ? item.departureDate : '12 Maret 2026',
        checkout: item?.departureDate ? '21 Maret 2026' : '15 Maret 2026',
        duration: item?.duration || (isHotel ? '3 Malam' : '9 Hari'),
        paidAt: 'Menunggu Verifikasi Admin',
        status: 'MENUNGGU VERIFIKASI',
      };

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('safara_latest_booking', JSON.stringify(bookingPayload));
          const historyRaw = localStorage.getItem('safara_booking_history');
          const history = historyRaw ? JSON.parse(historyRaw) : [];
          history.unshift(bookingPayload);
          localStorage.setItem('safara_booking_history', JSON.stringify(history));
        } catch (err) {
          console.error('Failed to save booking to localStorage:', err);
        }
      }

      onPaymentSuccess(bookingPayload);
      setScreen(`success?code=${res.data.bookingCode}`);
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmitError(err?.message || 'Terjadi kesalahan sistem saat proses checkout.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      {/* 1. STEPPER SECTION */}
      <section className="border-b border-[#EAE6E1] bg-white py-6 shadow-sm">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex items-center justify-between">
            {/* Step 1 */}
            <div
              onClick={() => setStep(1)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition ${
                  step === 1 ? 'bg-[#0F766E] text-white shadow-sm' : 'bg-emerald-100 text-[#0F766E]'
                }`}
              >
                {step === 2 ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <div>
                <span className="block text-[11px] text-[#968A80] uppercase tracking-wider font-semibold">
                  Langkah 1
                </span>
                <span className="text-xs font-bold text-[#1C1A16]">Data Tamu & Kontak</span>
              </div>
            </div>

            <div
              className={`h-0.5 flex-1 mx-4 transition ${step >= 2 ? 'bg-[#0F766E]' : 'bg-[#EAE6E1]'}`}
            />

            {/* Step 2 */}
            <div
              onClick={() => {
                if (fullName && email && phone) setStep(2);
              }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition ${
                  step === 2
                    ? 'bg-[#0F766E] text-white shadow-sm'
                    : 'bg-[#FAF9F6] border border-[#EAE6E1] text-[#968A80]'
                }`}
              >
                2
              </div>
              <div>
                <span className="block text-[11px] text-[#968A80] uppercase tracking-wider font-semibold">
                  Langkah 2
                </span>
                <span className="text-xs font-bold text-[#1C1A16]">Rekening & Bukti Transfer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CHECKOUT CONTENT */}
      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start w-full">
          {/* Main Left Form Area */}
          <div className="space-y-8 lg:col-span-7 w-full min-w-0">
            {/* ============================================================== */}
            {/* STEP 1: DATA TAMU */}
            {/* ============================================================== */}
            {step === 1 && (
              <div className="rounded-3xl border border-[#EAE6E1] bg-white p-7 shadow-sm animate-in fade-in duration-200">
                <div className="border-b border-[#EAE6E1] pb-4 mb-6">
                  <h2 className="font-['Figtree'] text-xl font-bold text-[#1C1A16]">
                    Informasi Kontak & Tamu Utama
                  </h2>
                  <p className="mt-1 text-xs text-[#6B6E6E]">
                    E-tiket, bukti reservasi, dan jadwal akan dikirimkan ke kontak ini.
                  </p>
                </div>

                {session?.user && (
                  <div className="mb-6 rounded-2xl bg-teal-50/80 border border-teal-200/80 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F766E] text-white font-bold text-sm shadow-sm">
                        {session.user.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#1C1A16]">{session.user.name}</span>
                          <span className="rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5">
                            Akun Terverifikasi
                          </span>
                        </div>
                        <span className="text-[11px] text-[#6B6E6E]">{session.user.email}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#0F766E] font-medium hidden sm:inline">
                      Data otomatis terisi
                    </span>
                  </div>
                )}

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#1C1A16] mb-1.5">
                      Nama Lengkap (Sesuai KTP / Paspor) *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (!senderName) setSenderName(e.target.value);
                      }}
                      className="w-full rounded-xl border border-[#EAE6E1] bg-[#FAF9F6] px-4 py-3 text-sm text-[#1C1A16] outline-none focus:border-[#0F766E] focus:bg-white transition"
                      placeholder="Contoh: H. Ahmad Fauzi"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block font-bold text-[#1C1A16] mb-1.5">Alamat Email *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-[#EAE6E1] bg-[#FAF9F6] px-4 py-3 text-sm text-[#1C1A16] outline-none focus:border-[#0F766E] focus:bg-white transition"
                        placeholder="nama@email.com"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#1C1A16] mb-1.5">
                        Nomor WhatsApp Aktif *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-[#EAE6E1] bg-[#FAF9F6] px-4 py-3 text-sm text-[#1C1A16] outline-none focus:border-[#0F766E] focus:bg-white transition"
                        placeholder="081234567890"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#1C1A16] mb-1.5">
                      Permintaan Khusus (Opsional)
                    </label>
                    <input
                      type="text"
                      value={specialRequest}
                      onChange={(e) => setSpecialRequest(e.target.value)}
                      className="w-full rounded-xl border border-[#EAE6E1] bg-[#FAF9F6] px-4 py-3 text-sm text-[#1C1A16] outline-none focus:border-[#0F766E] focus:bg-white transition"
                      placeholder="Contoh: Kamar bebas rokok, ranjang besar, kursi roda, dll."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 2: REKENING TRAVEL & UNGGAH BUKTI TRANSFER */}
            {/* ============================================================== */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Back to Step 1 Button */}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:underline"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Ubah Data Kontak & Tamu</span>
                </button>

                {/* 1. Pilih Rekening Bank Travel */}
                <div className="rounded-3xl border border-[#EAE6E1] bg-white p-7 shadow-sm">
                  <div className="border-b border-[#EAE6E1] pb-4 mb-5">
                    <h2 className="font-['Figtree'] text-xl font-bold text-[#1C1A16]">
                      1. Pilih Rekening Bank Resmi Safara
                    </h2>
                    <p className="mt-1 text-xs text-[#6B6E6E]">
                      Silakan pilih salah satu rekening tujuan transfer resmi PT Safara Global Travel.
                    </p>
                  </div>

                  {/* Bank Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {banks.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBankId(b.id)}
                        className={`cursor-pointer rounded-2xl border-2 p-4 transition ${
                          selectedBankId === b.id
                            ? 'border-[#0F766E] bg-[#F0FDFA]'
                            : 'border-[#EAE6E1] bg-white hover:border-[#0F766E]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          {b.logoUrl ? (
                            <img src={b.logoUrl} alt={b.bankName} className="h-6 w-auto object-contain" />
                          ) : (
                            <span
                              className="font-bold text-xs px-2.5 py-1 rounded-lg text-white"
                              style={{ backgroundColor: b.color }}
                            >
                              {b.logoText}
                            </span>
                          )}
                          {b.badge && (
                            <span className="text-[10px] font-bold text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded-full">
                              {b.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-[#1C1A16] mt-2.5">{b.bankName}</h4>
                        <p className="font-mono text-xs font-bold text-[#0F766E] mt-1 tracking-wider">
                          {b.accountNumber}
                        </p>
                        <span className="text-[10px] text-[#968A80] block mt-0.5">
                          a.n. {b.accountName}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Active Selected Bank Account Display Box */}
                  <div className="mt-6 rounded-2xl border border-teal-200 bg-[#F0FDFA] p-5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F766E] block mb-1">
                      Rekening Transfer Terpilih:
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        {selectedBank.logoUrl ? (
                          <img src={selectedBank.logoUrl} alt={selectedBank.bankName} className="h-5 w-auto object-contain mb-2" />
                        ) : selectedBank.logoText ? (
                          <span
                            className="inline-block font-bold text-[10px] px-2 py-0.5 rounded text-white mb-2"
                            style={{ backgroundColor: selectedBank.color }}
                          >
                            {selectedBank.logoText}
                          </span>
                        ) : null}
                        <span className="text-xs text-[#6B6E6E] font-medium block">{selectedBank.bankName}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-2xl font-bold text-[#1C1A16] tracking-wider">
                            {selectedBank.accountNumber}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-[#1C1A16] block mt-0.5">
                          Atas Nama: <strong className="text-[#0F766E]">{selectedBank.accountName}</strong>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopy(selectedBank.accountNumber, 'account')}
                        className={`flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition shadow-sm ${
                          copiedAccount
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#0F766E] text-white hover:bg-[#0D5C56]'
                        }`}
                      >
                        {copiedAccount ? (
                          <>
                            <Check className="h-4 w-4" />
                            <span>Nomor Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            <span>Salin No. Rekening</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="mt-4 pt-3 border-t border-teal-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="text-[#6B6E6E]">Jumlah yang Harus Ditransfer: </span>
                        <strong className="font-mono text-sm text-[#0F766E]">
                          Rp {total.toLocaleString('id-ID')}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(total.toString(), 'amount')}
                        className="text-[11px] font-bold text-[#0F766E] hover:underline"
                      >
                        {copiedAmount ? '✓ Nominal Tersalin' : 'Salin Nominal'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. REMINDER BANNER SANGAT JELAS (CRUCIAL REQUIREMENT) */}
                <div className="rounded-3xl border-2 border-amber-300 bg-amber-50/80 p-6 shadow-sm">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md">
                      <Camera className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <span className="inline-block rounded-md bg-amber-200/80 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-900">
                        PERHATIAN PENTING
                      </span>
                      <h3 className="font-['Figtree'] text-base font-bold text-amber-950">
                        Wajib Ambil Bukti / Screenshot Struk Transfer!
                      </h3>
                      <p className="text-xs text-amber-900/90 leading-relaxed">
                        Setelah Anda melakukan pembayaran via <strong>m-Banking, i-Banking, atau ATM</strong>, harap segera{' '}
                        <strong>ambil tangkapan layar (screenshot)</strong> atau simpan struk transfer Anda, kemudian{' '}
                        <strong>unggah pada formulir di bawah ini</strong>. Bukti transfer digunakan oleh tim keuangan
                        Safara untuk memverifikasi pesanan Anda secara resmi.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. FORM UNGGAH BUKTI PEMBAYARAN */}
                <div className="rounded-3xl border border-[#EAE6E1] bg-white p-7 shadow-sm">
                  <div className="border-b border-[#EAE6E1] pb-4 mb-5">
                    <h2 className="font-['Figtree'] text-xl font-bold text-[#1C1A16]">
                      2. Unggah Bukti Transfer Anda
                    </h2>
                    <p className="mt-1 text-xs text-[#6B6E6E]">
                      Format yang didukung: JPG, PNG, WEBP, atau PDF (Maksimal 5MB).
                    </p>
                  </div>

                  <div className="space-y-5 text-xs">
                    {/* Upload Dropzone */}
                    {!proofPreview ? (
                      <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#0F766E]/50 bg-[#F0FDFA]/50 p-8 text-center cursor-pointer hover:bg-[#F0FDFA] transition">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F766E] text-white shadow-sm mb-3">
                          <Upload className="h-6 w-6" />
                        </div>
                        <span className="font-bold text-sm text-[#1C1A16]">
                          Klik untuk Memilih Foto Bukti Transfer
                        </span>
                        <p className="text-xs text-[#6B6E6E] mt-1">
                          Atau seret dan lepas file struk / screenshot transfer ke sini
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      /* Preview Box */
                      <div className="rounded-2xl border border-teal-200 bg-[#F0FDFA] p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-bold text-xs text-[#0F766E] flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            Bukti Transfer Berhasil Dipilih
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setProofFile(null);
                              setProofPreview(null);
                            }}
                            className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Ganti File</span>
                          </button>
                        </div>
                        <div className="overflow-hidden rounded-xl border border-teal-100 bg-white max-h-64 flex items-center justify-center">
                          <img
                            src={proofPreview}
                            alt="Bukti Transfer"
                            className="max-h-64 w-auto object-contain p-2"
                          />
                        </div>
                        <p className="text-[11px] text-teal-800 mt-2 font-medium">
                          File: {proofFile?.name || 'bukti-transfer.jpg'} (
                          {proofFile ? (proofFile.size / 1024).toFixed(0) + ' KB' : 'Siap dikirim'}
                          )
                        </p>
                      </div>
                    )}

                    {/* Sender Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block font-bold text-[#1C1A16] mb-1.5">
                          Nama Pemilik Rekening Pengirim *
                        </label>
                        <input
                          type="text"
                          required
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          className="w-full rounded-xl border border-[#EAE6E1] bg-[#FAF9F6] px-4 py-3 text-xs text-[#1C1A16] outline-none focus:border-[#0F766E] focus:bg-white transition"
                          placeholder="Nama di rekening Anda (Contoh: Ahmad Fauzi)"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#1C1A16] mb-1.5">
                          Bank Pengirim yang Anda Gunakan *
                        </label>
                        <input
                          type="text"
                          required
                          value={senderBank}
                          onChange={(e) => setSenderBank(e.target.value)}
                          className="w-full rounded-xl border border-[#EAE6E1] bg-[#FAF9F6] px-4 py-3 text-xs text-[#1C1A16] outline-none focus:border-[#0F766E] focus:bg-white transition"
                          placeholder="Contoh: BCA / Mandiri / BSI / BRI / Lainnya"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Summary Sidebar */}
          <aside className="sticky top-28 h-fit space-y-5 lg:col-span-5 w-full min-w-0">
            <div className="rounded-3xl border border-[#EAE6E1] bg-white p-6 shadow-xl w-full min-w-0">
              <h3 className="font-['Figtree'] text-lg font-bold text-[#1C1A16]">
                Rincian Tagihan
              </h3>

              {/* Product Info */}
              <div className="mt-4 rounded-2xl border border-[#EAE6E1] bg-[#FAF9F6] p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F766E]">
                  Reservasi Terpilih
                </span>
                <h4 className="mt-1 font-bold text-sm text-[#1C1A16]">
                  {item?.name || item?.title || 'The Alila Seminyak Resort'}
                </h4>
                <p className="mt-0.5 text-xs text-[#6B6E6E]">
                  {item?.duration || (item?.type === 'HOTEL' ? '3 Malam' : '9 Hari')} ·{' '}
                  {item?.quantity || 1} Tamu / Jamaah
                </p>
              </div>

              {/* Voucher Code */}
              <div className="mt-5">
                <span className="text-xs font-bold text-[#1C1A16]">Kode Kupon Promo</span>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="flex-1 rounded-xl border border-[#EAE6E1] bg-[#FAF9F6] px-3 py-2 text-xs font-mono font-bold uppercase text-[#0F766E] outline-none min-w-0"
                    placeholder="SAFARAHEMAT15"
                  />
                  <button
                    onClick={handleApplyVoucher}
                    className="rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0D5C56] shrink-0"
                  >
                    {discountApplied ? 'Hapus' : 'Pakai'}
                  </button>
                </div>
                {voucherError && (
                  <p className="mt-1 text-[11px] font-semibold text-rose-500">{voucherError}</p>
                )}
                {discountApplied && (
                  <p className="mt-1 text-[11px] font-semibold text-emerald-600">
                    Promo diskon berhasil diterapkan!
                  </p>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="my-5 space-y-2.5 border-y border-[#EAE6E1] py-4 text-xs">
                <div className="flex items-center justify-between text-[#6B6E6E] w-full min-w-0">
                  <span className="truncate mr-2">Subtotal Biaya:</span>
                  <span className="font-semibold text-right shrink-0">
                    Rp {basePrice.toLocaleString('id-ID')}
                  </span>
                </div>
                {discountApplied && (
                  <div className="flex items-center justify-between text-[#15803D] font-semibold w-full min-w-0">
                    <span className="truncate mr-2">Diskon Promo ({voucherCode.toUpperCase()}):</span>
                    <span className="text-right shrink-0">
                      - Rp {discountAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[#6B6E6E] w-full min-w-0">
                  <span className="truncate mr-2">PPN (10%):</span>
                  <span className="font-semibold text-right shrink-0">
                    Rp {tax.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#6B6E6E] w-full min-w-0">
                  <span className="truncate mr-2">Biaya Verifikasi:</span>
                  <span className="text-[#10B981] font-semibold text-right shrink-0">Gratis</span>
                </div>
                <div className="flex items-baseline justify-between border-t border-[#EAE6E1] pt-3 text-sm font-bold text-[#1C1A16] w-full min-w-0">
                  <span className="mr-2">Total Tagihan Transfer:</span>
                  <span className="font-['Figtree'] text-xl text-[#0F766E] font-extrabold text-right shrink-0">
                    Rp {total.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Pay / Confirm Button */}
              {step === 1 ? (
                <button
                  onClick={() => {
                    if (!fullName || !email || !phone) {
                      alert('Mohon lengkapi Nama, Email, dan Nomor WhatsApp.');
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full rounded-2xl bg-[#0F766E] py-4 px-4 text-sm font-bold text-white shadow-md shadow-[#0F766E]/20 transition hover:bg-[#0D5C56] flex items-center justify-center gap-2"
                >
                  <span>Lanjut ke Rekening Pembayaran</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handlePay}
                  disabled={isSubmitting || !proofPreview}
                  className={`w-full rounded-2xl py-4 px-4 text-sm font-bold text-white shadow-md transition flex items-center justify-center gap-2 ${
                    proofPreview
                      ? 'bg-[#0F766E] shadow-[#0F766E]/20 hover:bg-[#0D5C56]'
                      : 'bg-neutral-300 cursor-not-allowed shadow-none'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Mengunggah & Menyimpan...</span>
                    </>
                  ) : proofPreview ? (
                    <span>Saya Sudah Transfer & Kirim Bukti</span>
                  ) : (
                    <span>Unggah Bukti Transfer Dahulu</span>
                  )}
                </button>
              )}

              {submitError && (
                <div className="mt-3 flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700 w-full break-words">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                  <span className="flex-1 leading-snug">{submitError}</span>
                </div>
              )}

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[#968A80]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#0F766E]" />
                <span>Verifikasi Manual Resmi oleh PT Safara Global Travel</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
