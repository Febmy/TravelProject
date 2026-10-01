'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, Phone, CheckCircle2, ShieldCheck } from 'lucide-react';
import { figmaAssets } from '@/lib/figma-data';

import { signIn } from 'next-auth/react';

interface RegisterViewProps {
  setScreen: (screen: string) => void;
}

export function RegisterView({ setScreen }: RegisterViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Kata sandi tidak cocok.');
      return;
    }
    if (!agree) {
      setError('Anda harus menyetujui Syarat & Ketentuan.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          email,
          phone,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Gagal mendaftar.');
        setLoading(false);
        return;
      }

      // Automatically sign in after successful registration
      const signInRes = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        setError('Pendaftaran berhasil, tetapi gagal masuk otomatis. Silakan login.');
        setLoading(false);
        return;
      }

      if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        setScreen('profile');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghubungi server.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF9F6] py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-[#EAE6E1] bg-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Form */}
            <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E]">
                  Pendaftaran Baru
                </span>
                <h1 className="mt-2 font-['Figtree'] text-3xl font-bold text-[#1C1A16]">
                  Buat Akun Baru
                </h1>
                <p className="mt-1 text-sm text-[#6B6E6E]">
                  Bergabung dengan Safara Travel untuk kemudahan pemesanan akomodasi dan paket perjalanan terbaik.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {error && (
                    <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                      {error}
                    </div>
                  )}
                  {/* Nama Lengkap */}
                  <div>
                    <label className="block text-xs font-bold text-[#1C1A16]">
                      Nama Lengkap *
                    </label>
                    <div className="mt-1 flex items-center gap-2 rounded-xl border border-[#EAE6E1] bg-[#FAF9F6] px-3.5 py-2.5 focus-within:border-[#0F766E] focus-within:bg-white transition">
                      <User className="h-4 w-4 text-[#968A80]" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Masukkan nama lengkap Anda"
                        className="w-full bg-transparent text-sm text-[#1C1A16] outline-none"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-[#1C1A16]">
                      Alamat Email *
                    </label>
                    <div className="mt-1 flex items-center gap-2 rounded-xl border border-[#EAE6E1] bg-[#FAF9F6] px-3.5 py-2.5 focus-within:border-[#0F766E] focus-within:bg-white transition">
                      <Mail className="h-4 w-4 text-[#968A80]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full bg-transparent text-sm text-[#1C1A16] outline-none"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Nomor Telepon WhatsApp with +62 prefix */}
                  <div>
                    <label className="block text-xs font-bold text-[#1C1A16]">
                      Nomor Telepon (WhatsApp) *
                    </label>
                    <div className="mt-1 flex items-center rounded-xl border border-[#EAE6E1] bg-[#FAF9F6] focus-within:border-[#0F766E] focus-within:bg-white transition overflow-hidden">
                      <span className="bg-[#EAE6E1] px-3 py-2.5 text-xs font-bold text-[#1C1A16]">
                        +62
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="8123456789"
                        className="w-full bg-transparent px-3 py-2.5 text-sm text-[#1C1A16] outline-none"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Password with Strength indicator from Figma */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-[#1C1A16]">
                        Kata Sandi *
                      </label>
                      <span className="rounded-md bg-[#DCFCE7] px-2 py-0.5 text-[10px] font-bold text-[#15803D]">
                        ✓ Sangat Kuat
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 rounded-xl border border-[#EAE6E1] bg-[#FAF9F6] px-3.5 py-2.5 focus-within:border-[#0F766E] focus-within:bg-white transition">
                      <Lock className="h-4 w-4 text-[#968A80]" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent text-sm text-[#1C1A16] outline-none"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Konfirmasi Kata Sandi */}
                  <div>
                    <label className="block text-xs font-bold text-[#1C1A16]">
                      Konfirmasi Kata Sandi *
                    </label>
                    <div className="mt-1 flex items-center gap-2 rounded-xl border border-[#EAE6E1] bg-[#FAF9F6] px-3.5 py-2.5 focus-within:border-[#0F766E] focus-within:bg-white transition">
                      <Lock className="h-4 w-4 text-[#968A80]" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent text-sm text-[#1C1A16] outline-none"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Agreement Checkbox */}
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#6B6E6E] pt-1">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      className="mt-0.5 rounded accent-[#0F766E]"
                      required
                      disabled={loading}
                    />
                    <span>
                      Saya menyetujui{' '}
                      <Link href="/terms" target="_blank" className="text-[#0F766E] font-semibold hover:underline">
                        Syarat & Ketentuan
                      </Link>{' '}
                      serta{' '}
                      <Link href="/privacy" target="_blank" className="text-[#0F766E] font-semibold hover:underline">
                        Kebijakan Privasi
                      </Link>{' '}
                      dari Safara Travel.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-[#0F766E] py-3.5 text-sm font-bold text-white shadow-md shadow-[#0F766E]/20 transition hover:bg-[#0D5C56] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Memproses...' : 'Daftar Sekarang'}
                  </button>
                </form>

                {/* Social register */}
                <div className="mt-6 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#EAE6E1]" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-3 text-[#968A80]">atau daftar dengan</span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 rounded-xl border border-[#EAE6E1] py-2 text-xs font-bold text-[#1C1A16] hover:bg-[#FAF9F6]">
                      <span>Google</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-xl border border-[#EAE6E1] py-2 text-xs font-bold text-[#1C1A16] hover:bg-[#FAF9F6]">
                      <span>Apple</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center text-xs text-[#6B6E6E] border-t border-[#EAE6E1] pt-3">
                <span>Sudah punya akun? </span>
                <Link
                  href={callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/login'}
                  className="font-bold text-[#0F766E] hover:underline"
                >
                  Masuk
                </Link>
              </div>
            </div>

            {/* Right: Hero Image with Badge */}
            <div className="relative hidden lg:block overflow-hidden bg-[#1C1A16]">
              <img
                src={figmaAssets.registerBg}
                alt="Mitra Ibadah Safara Travel"
                className="h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-10 left-10 right-10 text-white">
                <div className="rounded-2xl border border-white/20 bg-black/40 p-6 backdrop-blur-md">
                  <h3 className="font-['Figtree'] text-lg font-bold">
                    Mitra Ibadah & Perjalanan Tepercaya
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/80">
                    Dapatkan prioritas pelayanan booking hotel eksklusif, jaminan pembatalan fleksibel,
                    dan panduan lengkap Umrah dalam satu genggaman tangan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
