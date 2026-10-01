'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { figmaAssets } from '@/lib/figma-data';

import { signIn } from 'next-auth/react';

interface LoginViewProps {
  setScreen: (screen: string) => void;
}

export function LoginView({ setScreen }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        return;
      }

      setScreen('profile');
    } catch (err) {
      setError('Terjadi kesalahan saat mencoba masuk.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF9F6] py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-[#EAE6E1] bg-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Form */}
            <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E]">
                  Safara Membership
                </span>
                <h1 className="mt-2 font-['Figtree'] text-3xl font-bold text-[#1C1A16]">
                  Masuk ke Akun Anda
                </h1>
                <p className="mt-1 text-sm text-[#6B6E6E]">
                  Selamat datang kembali! Silakan masuk untuk melanjutkan.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  {error && (
                    <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                      {error}
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-bold text-[#1C1A16]">
                      Alamat Email *
                    </label>
                    <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-[#EAE6E1] bg-[#FAF9F6] px-3.5 py-3 focus-within:border-[#0F766E] focus-within:bg-white transition">
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

                  <div>
                    <label className="block text-xs font-bold text-[#1C1A16]">
                      Kata Sandi *
                    </label>
                    <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-[#EAE6E1] bg-[#FAF9F6] px-3.5 py-3 focus-within:border-[#0F766E] focus-within:bg-white transition">
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

                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-[#6B6E6E]">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded accent-[#0F766E]"
                        disabled={loading}
                      />
                      <span>Ingat saya</span>
                    </label>
                    <Link href="/forgot-password" className="font-semibold text-[#0F766E] hover:underline">
                      Lupa Kata Sandi?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-[#0F766E] py-3.5 text-sm font-bold text-white shadow-md shadow-[#0F766E]/20 transition hover:bg-[#0D5C56] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Memproses...' : 'Masuk'}
                  </button>
                </form>

                {/* Social Login */}
                <div className="mt-8 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#EAE6E1]" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-3 text-[#968A80]">atau masuk dengan</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 rounded-xl border border-[#EAE6E1] py-2.5 text-xs font-bold text-[#1C1A16] hover:bg-[#FAF9F6]">
                      <span>Google</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-xl border border-[#EAE6E1] py-2.5 text-xs font-bold text-[#1C1A16] hover:bg-[#FAF9F6]">
                      <span>Apple</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center text-xs text-[#6B6E6E] border-t border-[#EAE6E1] pt-4">
                <span>Belum punya akun? </span>
                <Link
                  href="/register"
                  className="font-bold text-[#0F766E] hover:underline"
                >
                  Daftar Sekarang
                </Link>
              </div>
            </div>

            {/* Right: Hero Image with Badge */}
            <div className="relative hidden lg:block overflow-hidden bg-[#1C1A16]">
              <img
                src={figmaAssets.loginBg}
                alt="Safara Travel Experience"
                className="h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-10 left-10 right-10 text-white">
                <div className="rounded-2xl border border-white/20 bg-black/40 p-6 backdrop-blur-md">
                  <h3 className="font-['Figtree'] text-lg font-bold">
                    &ldquo;Ketenangan Jiwa Dalam Perjalanan Terbaik&rdquo;
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/80">
                    Komitmen kami menyajikan layanan akomodasi paling dekat, terpercaya, dan ternyaman
                    untuk perjalanan ibadah maupun liburan premium Anda.
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
