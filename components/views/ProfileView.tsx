'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Award,
  ChevronRight,
  Clock,
  FileText,
  Heart,
  Settings,
  CheckCircle2,
  AlertCircle,
  Camera,
} from 'lucide-react';
import { figmaAssets } from '@/lib/figma-data';
import { useSession } from 'next-auth/react';
import { getUserBookingsAction } from '@/actions/booking';

interface ProfileViewProps {
  setScreen?: (screen: string) => void;
}

export function ProfileView({ setScreen }: ProfileViewProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'bookings' | 'saved' | 'settings'>('bookings');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [profileName, setProfileName] = useState('H. Ahmad Fauzi');
  const [profileEmail, setProfileEmail] = useState('ahmad.fauzi@gmail.com');
  const [profileImage, setProfileImage] = useState(figmaAssets.avatarAhmad);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (session?.user) {
      if (session.user.name) setProfileName(session.user.name);
      if (session.user.email) setProfileEmail(session.user.email);
      if (session.user.image) setProfileImage(session.user.image);
    }
    
    // Check local storage for any manual updates
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('safara_user_profile');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.name) setProfileName(parsed.name);
          if (parsed.email) setProfileEmail(parsed.email);
          if (parsed.image) setProfileImage(parsed.image);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [session]);

  useEffect(() => {
    const fetchUserBookings = async () => {
      setLoadingBookings(true);
      const email = session?.user?.email || profileEmail;
      const userId = (session?.user as any)?.id;

      try {
        const res = await getUserBookingsAction({ userId, email });
        if (res.success && res.data && res.data.length > 0) {
          setBookings(res.data);
          setLoadingBookings(false);
          return;
        }
      } catch (err) {
        console.error('Failed to load user bookings from database:', err);
      }

      // Fallback to local storage if user not yet has bookings in DB
      if (typeof window !== 'undefined') {
        try {
          const historyRaw = localStorage.getItem('safara_booking_history');
          if (historyRaw) {
            const parsed = JSON.parse(historyRaw);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setBookings(parsed);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
      setLoadingBookings(false);
    };

    fetchUserBookings();
  }, [session, profileEmail]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('safara_user_profile', JSON.stringify({ 
        name: profileName, 
        email: profileEmail,
        image: profileImage
      }));
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* User Card Header (Figma user-profile) */}
        <div className="overflow-hidden rounded-3xl border border-[#EAE6E1] bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-5">
              <img
                src={profileImage}
                alt={profileName}
                className="h-20 w-20 rounded-full object-cover border-2 border-[#0F766E]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-['Figtree'] text-2xl font-bold text-[#1C1A16]">
                    {profileName}
                  </h1>
                  <span className="rounded-full bg-[#FEF3C7] px-3 py-0.5 text-xs font-bold text-[#D97706]">
                    ★ Member Gold
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#6B6E6E]">{profileEmail} · +62 812-3456-7890</p>
                <span className="mt-2 inline-block text-[11px] text-[#968A80]">
                  Member aktif sejak 2026
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#CCFBF1] bg-[#F0FDFA] p-4 text-center sm:text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F766E]">
                Safara Poin
              </span>
              <div className="font-['Figtree'] text-2xl font-bold text-[#0F766E]">1.450 Poin</div>
              <span className="text-[10px] text-[#968A80]">Dapat ditukar voucher diskon</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 flex gap-6 border-t border-[#EAE6E1] pt-4 text-xs font-bold">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`pb-2 border-b-2 transition ${
                activeTab === 'bookings'
                  ? 'border-[#0F766E] text-[#0F766E]'
                  : 'border-transparent text-[#6B6E6E] hover:text-[#1C1A16]'
              }`}
            >
              Riwayat Pesanan ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`pb-2 border-b-2 transition ${
                activeTab === 'saved'
                  ? 'border-[#0F766E] text-[#0F766E]'
                  : 'border-transparent text-[#6B6E6E] hover:text-[#1C1A16]'
              }`}
            >
              Hotel Tersimpan
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-2 border-b-2 transition ${
                activeTab === 'settings'
                  ? 'border-[#0F766E] text-[#0F766E]'
                  : 'border-transparent text-[#6B6E6E] hover:text-[#1C1A16]'
              }`}
            >
              Pengaturan Akun
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {loadingBookings ? (
                <div className="rounded-3xl border border-[#EAE6E1] bg-white p-8 text-center text-sm font-semibold text-[#6B6E6E]">
                  Memuat data riwayat pesanan dari database...
                </div>
              ) : bookings.length === 0 ? (
                <div className="rounded-3xl border border-[#EAE6E1] bg-white p-12 text-center text-sm text-[#6B6E6E]">
                  <p className="font-bold text-base text-[#1C1A16] mb-1">Belum Ada Riwayat Pesanan</p>
                  <p className="text-xs mb-6">Mulai rencanakan liburan hotel atau ibadah Umrah Anda bersama Safara Travel.</p>
                  <Link
                    href="/hotels"
                    className="rounded-xl bg-[#0F766E] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#0D5C56] transition"
                  >
                    Jelajahi Paket & Hotel
                  </Link>
                </div>
              ) : (
                bookings.map((bk, i) => {
                  const productTitle = bk.title || bk.productName || bk.schedule?.package?.title || bk.hotel?.name || 'The Alila Seminyak Resort';
                  const isTour = bk.itemType === 'TOUR' || productTitle.toLowerCase().includes('umrah') || productTitle.toLowerCase().includes('paket');
                  const imageSrc = bk.hotel?.images?.[0]?.imageUrl || bk.schedule?.package?.images?.[0]?.imageUrl || (isTour ? figmaAssets.kaabaImage : figmaAssets.alilaSeminyak);
                  const displayTotal = bk.totalPrice ? Number(bk.totalPrice) : (bk.total ? Number(bk.total) : 14500000);
                  const checkinStr = bk.checkInDate ? new Date(bk.checkInDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : (bk.checkin || '12 Mar 2026');
                  const checkoutStr = bk.checkOutDate ? new Date(bk.checkOutDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : (bk.checkout || '15 Mar 2026');

                  return (
                    <div key={bk.id || i} className="rounded-3xl border border-[#EAE6E1] bg-white p-6 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#EAE6E1] pb-4">
                        <div>
                          <span className="text-xs text-[#968A80]">Kode Booking: </span>
                          <span className="font-mono font-bold text-[#0F766E]">{bk.bookingCode}</span>
                        </div>
                        <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-bold text-[#15803D]">
                          ● {bk.status || 'CONFIRMED'}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={imageSrc}
                            alt={productTitle}
                            className="h-16 w-20 rounded-xl object-cover border border-[#EAE6E1]"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-[#1C1A16]">
                              {productTitle}
                            </h4>
                            <p className="text-xs text-[#6B6E6E]">
                              {checkinStr} — {checkoutStr} · {bk.roomName || (isTour ? 'Paket Jamaah' : 'Deluxe Room')}
                            </p>
                            <span className="text-xs font-bold text-[#0F766E]">
                              Rp {displayTotal.toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Link
                            href={`/invoice?code=${bk.bookingCode}`}
                            className="rounded-xl border border-[#EAE6E1] px-4 py-2 text-xs font-bold text-[#1C1A16] hover:bg-[#FAF9F6] transition"
                          >
                            Invoice
                          </Link>
                          <Link
                            href={`/tracking?code=${bk.bookingCode}`}
                            className="rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white hover:bg-[#0D5C56] transition"
                          >
                            Lacak Booking
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="rounded-3xl border border-[#EAE6E1] bg-white p-8 text-center text-xs text-[#6B6E6E]">
              <Heart className="h-8 w-8 text-[#968A80] mx-auto mb-2" />
              <p className="font-bold text-[#1C1A16]">Belum ada hotel tersimpan</p>
              <p className="mt-1">
                Klik ikon hati pada halaman detail untuk menyimpan destinasi impian Anda.
              </p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="rounded-3xl border border-[#EAE6E1] bg-white p-6 shadow-sm space-y-4 text-xs">
              <h3 className="font-bold text-sm text-[#1C1A16]">Pengaturan Profil & Keamanan</h3>
              {saveSuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-emerald-800 font-semibold text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Profil berhasil diperbarui dan disimpan!</span>
                </div>
              )}
              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-[#968A80] mb-2 font-semibold">Foto Profil</label>
                  <div className="flex items-center gap-4">
                    <img 
                      src={profileImage} 
                      alt="Profile Preview" 
                      className="h-16 w-16 rounded-full object-cover border border-[#EAE6E1]" 
                    />
                    <label className="flex items-center gap-2 rounded-xl border border-[#EAE6E1] bg-white px-4 py-2 text-[#1C1A16] font-semibold cursor-pointer hover:bg-[#FAF9F6] transition">
                      <Camera className="h-4 w-4 text-[#0F766E]" />
                      <span>Ubah Foto</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 2 * 1024 * 1024) {
                            alert('Ukuran gambar maksimal 2MB');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setProfileImage(ev.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-[#968A80] mb-1 font-semibold">Nama Lengkap</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full rounded-xl border border-[#EAE6E1] p-3 text-[#1C1A16] outline-none focus:border-[#0F766E]"
                  />
                </div>
                <div>
                  <label className="block text-[#968A80] mb-1 font-semibold">Alamat Email</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full rounded-xl border border-[#EAE6E1] p-3 text-[#1C1A16] outline-none focus:border-[#0F766E]"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0F766E] px-6 py-2.5 font-bold text-white transition hover:bg-[#0D5C56]"
                >
                  Simpan Perubahan
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
