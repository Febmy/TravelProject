import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppFloating } from '@/components/WhatsAppFloating';
import { FileText, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Syarat & Ketentuan — Safara Travel',
  description: 'Ketentuan layanan pemesanan hotel dan paket ibadah Umrah di platform Safara Travel.',
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-[#1C1A16] font-['Figtree',sans-serif]">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl border border-[#EAE6E1] bg-white p-8 sm:p-12 shadow-sm">
            <div className="flex items-center gap-3 text-[#0F766E]">
              <FileText className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-widest">Ketentuan Layanan</span>
            </div>
            <h1 className="mt-3 font-['Figtree'] text-3xl font-bold tracking-tight text-[#1C1A16] sm:text-4xl">
              Syarat & Ketentuan Penggunaan
            </h1>
            <p className="mt-2 text-xs text-[#968A80]">
              Terakhir diperbarui: 15 Maret 2026 · Berlaku untuk seluruh transaksi di platform Safara Travel
            </p>

            <div className="mt-8 space-y-8 text-sm leading-relaxed text-[#6B6E6E]">
              {/* Section 1 */}
              <div>
                <h2 className="font-['Figtree'] text-lg font-bold text-[#1C1A16]">
                  1. Definisi & Ketentuan Umum
                </h2>
                <p className="mt-2">
                  Platform Safara Travel dikelola dan dioperasikan secara resmi oleh PT Safara Global Travel. Setiap pengguna yang mengakses, memesan kamar hotel, maupun mendaftar paket ibadah Umrah melalui aplikasi atau situs web ini dianggap telah membaca, memahami, dan menyetujui seluruh ketentuan yang tercantum.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="font-['Figtree'] text-lg font-bold text-[#1C1A16]">
                  2. Ketentuan Reservasi Hotel
                </h2>
                <ul className="mt-2 list-disc pl-5 space-y-1.5">
                  <li>Waktu check-in standar di properti rekanan adalah pukul 14:00 waktu setempat, dan check-out maksimal pukul 12:00 waktu setempat.</li>
                  <li>Tamu wajib menunjukkan kartu identitas asli (KTP / Paspor) yang sesuai dengan nama pemesan pada voucher digital saat proses registrasi resepsionis.</li>
                  <li>Permintaan khusus (seperti ranjang tambahan, kamar bebas rokok, atau early check-in) tergantung ketersediaan pihak hotel dan mungkin dikenakan biaya tambahan.</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="font-['Figtree'] text-lg font-bold text-[#1C1A16]">
                  3. Ketentuan Pendaftaran Paket Umrah
                </h2>
                <ul className="mt-2 list-disc pl-5 space-y-1.5">
                  <li>Paspor calon jamaah wajib memiliki masa berlaku minimal 8 (delapan) bulan terhitung sejak tanggal jadwal keberangkatan.</li>
                  <li>Uang muka (Down Payment) sebesar Rp 10.000.000 per jamaah dibayarkan saat reservasi sebagai komitmen pemesanan seat penerbangan dan kamar hotel di Tanah Suci.</li>
                  <li>Pelunasan biaya paket wajib diselesaikan paling lambat 45 (empat puluh lima) hari kalender sebelum jadwal keberangkatan.</li>
                  <li>Pengurusan visa dan dokumen ibadah mengikuti regulasi dan persetujuan Kementerian Haji dan Umrah Kerajaan Arab Saudi.</li>
                </ul>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="font-['Figtree'] text-lg font-bold text-[#1C1A16]">
                  4. Pembayaran & Pembatalan (Refund)
                </h2>
                <p className="mt-2">
                  Pembayaran diproses melalui kanal resmi (Virtual Account BCA/Mandiri, Kartu Kredit, QRIS). Setiap transaksi yang berhasil akan langsung menerbitkan nomor reservasi resmi serta faktur pembayaran digital (E-Invoice).
                </p>
                <div className="mt-3 rounded-2xl border border-[#CCFBF1] bg-[#F0FDFA] p-4 text-xs text-[#0F766E]">
                  <span className="font-bold">Ketentuan Pengembalian Dana:</span>
                  <p className="mt-1 text-[#6B6E6E]">
                    Pengajuan pembatalan hotel sebelum batas bebas denda akan diproses 100% (dikurangi biaya administrasi gateway). Pembatalan paket Umrah tunduk pada kebijakan penalti maskapai dan pihak akomodasi Saudi.
                  </p>
                </div>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className="font-['Figtree'] text-lg font-bold text-[#1C1A16]">
                  5. Bantuan & Layanan Pelanggan
                </h2>
                <p className="mt-2">
                  Jika Anda memiliki pertanyaan seputar syarat dan ketentuan ini, hubungi tim concierge kami melalui WhatsApp di <span className="font-bold text-[#0F766E]">+62 812-3456-7890</span> atau email ke <span className="font-bold text-[#0F766E]">layanan@safaratravel.com</span>.
                </p>
              </div>
            </div>

            <div className="mt-10 border-t border-[#EAE6E1] pt-6 flex justify-between items-center text-xs">
              <Link href="/" className="font-bold text-[#0F766E] hover:underline">
                ← Kembali ke Beranda
              </Link>
              <Link href="/privacy" className="text-[#6B6E6E] hover:text-[#1C1A16]">
                Lihat Kebijakan Privasi →
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
