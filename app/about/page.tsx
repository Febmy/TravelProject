import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppFloating } from '@/components/WhatsAppFloating';
import { Compass, ShieldCheck, Award, Users, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Tentang Safara Travel — Layanan Luxury & Umrah Bintang 5',
  description:
    'Mengenal PT Safara Global Travel, platform kurasi hotel mewah dan perjalanan ibadah umrah premium terpercaya di Indonesia.',
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-[#1C1A16] font-['Figtree',sans-serif]">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#1C1A16] py-20 text-white">
          <div className="absolute inset-0 z-0 opacity-40">
            <img
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80"
              alt="Safara Travel Journey"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A16] via-[#1C1A16]/80 to-transparent" />
          </div>

          <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
            <span className="inline-block rounded-full bg-[#0F766E] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Profil Perusahaan
            </span>
            <h1 className="mt-4 font-['Figtree'] text-4xl font-bold tracking-tight sm:text-5xl">
              Dedikasi untuk <span className="text-[#80E4D2]">Kenyamanan Jiwa</span> & Kemewahan Wisata
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 leading-relaxed">
              Safara Travel lahir dari visi untuk memberikan standar baru dalam perjalanan ibadah Umrah dan
              hospitality mewah di Indonesia—mengutamakan ketenangan spiritual, transparansi, dan layanan
              personal bintang lima.
            </p>
          </div>
        </section>

        {/* Pillars / Values */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-3xl border border-[#EAE6E1] bg-white p-8 shadow-sm transition hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0FDFA] text-[#0F766E]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-['Figtree'] text-xl font-bold text-[#1C1A16]">
                Izin Resmi & Legalitas Sah
              </h3>
              <p className="mt-2 text-xs text-[#6B6E6E] leading-relaxed">
                Terdaftar resmi di Kementerian Agama RI dengan Izin PPIU No. 912/2021 dan akreditasi IATA, menjamin seluruh manifest penerbangan dan reservasi hotel valid.
              </p>
            </div>

            <div className="rounded-3xl border border-[#EAE6E1] bg-white p-8 shadow-sm transition hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0FDFA] text-[#0F766E]">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-['Figtree'] text-xl font-bold text-[#1C1A16]">
                Kurasi Fasilitas Bintang 5
              </h3>
              <p className="mt-2 text-xs text-[#6B6E6E] leading-relaxed">
                Kami hanya bermitra dengan jaringan hotel papan atas (The Ritz-Carlton, Alila, Oberoi, Swissotel) yang berjarak langsung ke pelataran ibadah maupun pantai privat.
              </p>
            </div>

            <div className="rounded-3xl border border-[#EAE6E1] bg-white p-8 shadow-sm transition hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0FDFA] text-[#0F766E]">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-['Figtree'] text-xl font-bold text-[#1C1A16]">
                Bimbingan Sesuai Sunnah
              </h3>
              <p className="mt-2 text-xs text-[#6B6E6E] leading-relaxed">
                Didampingi muthawwif dan asatidz berpengalaman yang mengedepankan kemudahan ibadah dan kehangatan kekeluargaan bagi setiap jamaah.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="border-t border-[#EAE6E1] bg-white py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                  Cerita Kami
                </span>
                <h2 className="mt-2 font-['Figtree'] text-3xl font-bold text-[#1C1A16]">
                  Menghadirkan Perjalanan Ibadah Tanpa Khawatir
                </h2>
                <p className="mt-4 text-sm text-[#6B6E6E] leading-relaxed">
                  Didirikan pada tahun 2021 di Jakarta, Safara Travel berawal dari keprihatinan atas ketidakpastian jadwal dan fasilitas yang sering dialami oleh para pelancong dan jamaah ibadah.
                </p>
                <p className="mt-3 text-sm text-[#6B6E6E] leading-relaxed">
                  Kami mengintegrasikan teknologi reservasi real-time langsung dengan sistem reservasi hotel dan maskapai, menghapus birokrasi berbelit, dan memastikan setiap rupiah yang Anda keluarkan bernilai ibadah dan ketenangan batin maksimal.
                </p>

                <div className="mt-6 space-y-2.5 text-xs font-semibold text-[#1C1A16]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0F766E]" />
                    <span>Garansi pasti berangkat dengan seat maskapai terikat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0F766E]" />
                    <span>Transparansi harga tanpa biaya tersembunyi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0F766E]" />
                    <span>Customer service 24 jam responsif via WhatsApp</span>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <Link
                    href="/hotels"
                    className="rounded-xl bg-[#0F766E] px-6 py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#0D5C56]"
                  >
                    Lihat Koleksi Hotel
                  </Link>
                  <Link
                    href="/umrah"
                    className="rounded-xl border border-[#EAE6E1] bg-[#FAF9F6] px-6 py-3 text-xs font-bold text-[#1C1A16] hover:bg-[#EAE6E1]"
                  >
                    Paket Umrah Eksklusif
                  </Link>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-[#EAE6E1] shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1000&q=80"
                  alt="Ka'bah Masjidil Haram"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <WhatsAppFloating />
      <Footer />
    </div>
  );
}
