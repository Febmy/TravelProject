import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProfileView } from '@/components/views/ProfileView';

export const metadata = {
  title: 'Dashboard Pelanggan — Safara Travel',
  description: 'Kelola pemesanan, riwayat perjalanan, dan e-tiket Anda.',
};

export default function CustomerDashboardPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <Navbar />
      <ProfileView />
      <Footer />
    </main>
  );
}
