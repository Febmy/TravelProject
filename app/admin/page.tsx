import React from 'react';
import { redirect } from 'next/navigation';
import { AdminOverviewView } from '@/components/views/AdminOverviewView';
import { getAdminDashboardData } from '@/actions/admin';
import { serializeToPlain } from '@/lib/serialize';

// Force dynamic execution on each request
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const result = await getAdminDashboardData();
  
  if (!result.success) {
    if (result.error === 'Unauthorized') {
      redirect('/login?callbackUrl=/admin');
    }

    return (
      <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 max-w-md w-full">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">⚠️</div>
          <h2 className="text-xl font-bold text-neutral-800 mb-2">Koneksi Database Terkendala</h2>
          <p className="text-neutral-500 text-sm mb-6 leading-relaxed">
            {result.error || 'Gagal memuat data dari database. Silakan muat ulang halaman.'}
          </p>
          <a href="/admin" className="inline-block w-full py-3 bg-[#007026] text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition shadow-md shadow-emerald-700/20">
            Muat Ulang Halaman
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5]">
      <AdminOverviewView initialData={serializeToPlain(result.data)} />
    </div>
  );
}
