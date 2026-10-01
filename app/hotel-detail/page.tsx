'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HotelDetailRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/hotels/the-alila-seminyak');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#0F766E] border-t-transparent" />
        <p className="mt-3 text-sm font-semibold text-[#1C1A16]">Memuat detail hotel...</p>
      </div>
    </div>
  );
}
