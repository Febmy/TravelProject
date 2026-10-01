import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppFloating } from '@/components/WhatsAppFloating';
import { ShieldCheck, Lock, Eye } from 'lucide-react';

export const metadata = {
  title: 'Kebijakan Privasi — Safara Travel',
  description: 'Komitmen perlindungan data pribadi dan privasi pengguna di platform Safara Travel.',
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-[#1C1A16] font-['Figtree',sans-serif]">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl border border-[#EAE6E1] bg-white p-8 sm:p-12 shadow-sm">
            <div className="flex items-center gap-3 text-[#0F766E]">
              <Lock className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-widest">Privasi & Keamanan</span>
            </div>
            <h1 className="mt-3 font-['Figtree'] text-3xl font-bold tracking-tight text-[#1C1A16] sm:text-4xl">
              Kebijakan Privasi Data Pengguna
            </h1>
            <p className="mt-2 text-xs text-[#968A80]">
              Terakhir diperbarui: 15 Maret 2026 · Standar Perlindungan Data Pribadi (UU PDP No. 27/2022)
            </p>

            <div className="mt-8 space-y-8 text-sm leading-relaxed text-[#6B6E6E]">
              {/* 1 */}
              <div>
                <h2 className="font-['Figtree'] text-lg font-bold text-[#1C1A16]">
                  1. Data yang Kami Kumpulkan
                </h2>
                <p className="mt-2">
                  Untuk memproses reservasi hotel dan pendaftaran paket Umrah, kami mengumpulkan informasi yang Anda berikan secara sukarela:
                </p>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>Nama lengkap sesuai KTP / Paspor.</li>
                  <li>Alamat email dan nomor telepon (WhatsApp) aktif untuk pengiriman voucher dan konfirmasi.</li>
                  <li>Detail dokumen perjalanan (nomor paspor, tanggal kedaluwarsa) untuk manifest penerbangan dan pengurusan visa Umrah.</li>
                  <li>Informasi transaksi dan riwayat reservasi.</li>
                </ul>
              </div>

              {/* 2 */}
              <div>
                <h2 className="font-['Figtree'] text-lg font-bold text-[#1C1A16]">
                  2. Penggunaan Data Pribadi
                </h2>
                <p className="mt-2">
                  Data pribadi Anda digunakan semata-mata untuk:
                </p>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>Menerbitkan voucher hotel resmi dan e-tiket penerbangan.</li>
                  <li>Memproses visa dan izin keberangkatan ke Kementerian Haji & Umrah Kerajaan Arab Saudi.</li>
                  <li>Mengirimkan faktur pembayaran, notifikasi jadwal, dan pembaruan penting terkait pesanan Anda.</li>
                </ul>
              </div>

              {/* 3 */}
              <div>
                <h2 className="font-['Figtree'] text-lg font-bold text-[#1C1A16]">
                  3. Keamanan Data & Enkripsi
                </h2>
                <p className="mt-2">
                  Seluruh data yang ditransmisikan melalui Safara Travel dilindungi oleh enkripsi Transport Layer Security (TLS 1.3) dan 256-bit encryption berstandar perbankan internasional. Kami tidak pernah membagikan atau menjual data pribadi Anda kepada pihak ketiga untuk kepentingan periklanan komersial.
                </p>
              </div>

              {/* 4 */}
              <div>
                <h2 className="font-['Figtree'] text-lg font-bold text-[#1C1A16]">
                  4. Hak Pengguna
                </h2>
                <p className="mt-2">
                  Anda berhak memperbarui, mengoreksi, atau meminta penghapusan akun dan data pribadi Anda dari database kami kapan saja melalui menu Pengaturan Akun di portal profil pengguna atau dengan menghubungi tim privasi kami.
                </p>
              </div>
            </div>

            <div className="mt-10 border-t border-[#EAE6E1] pt-6 flex justify-between items-center text-xs">
              <Link href="/" className="font-bold text-[#0F766E] hover:underline">
                ← Kembali ke Beranda
              </Link>
              <Link href="/terms" className="text-[#6B6E6E] hover:text-[#1C1A16]">
                Lihat Syarat & Ketentuan →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <WhatsAppFloating />
      <Footer />
    </div>
  );
}
