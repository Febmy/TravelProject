'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCartStore } from '@/store/cartStore';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function CartPage() {
  const router = useRouter();
  const { lang, currency } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(lang === 'id' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(currency === 'SAR' ? price / 4200 : price);
  };

  const handleCheckout = () => {
    if (items.length > 0) {
      const summaryItem = {
        name: items.length === 1 ? items[0].title : `Pesanan Keranjang (${items.length} Item)`,
        title: items.length === 1 ? items[0].title : `Pesanan Keranjang (${items.length} Item)`,
        price: getTotal(),
        type: items[0].type,
        hotelId: (items[0] as any).hotelId,
        scheduleId: (items[0] as any).scheduleId,
        departureDate: items[0].date,
        quantity: items.reduce((acc, curr) => acc + curr.quantity, 0),
        items: items,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('safara_checkout_item', JSON.stringify(summaryItem));
      }
    }
    router.push('/checkout');
  };

  if (!isMounted) {
    return null; // Avoid hydration errors
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-[#1C1A16] font-['Figtree',sans-serif]">
      <Navbar />
      
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-8 text-[#0F766E]">Keranjang Pesanan</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-[#EAE6E1] shadow-sm">
            <div className="bg-[#F0FDFA] p-6 rounded-full mb-6">
              <ShoppingBag className="h-12 w-12 text-[#0F766E]" />
            </div>
            <h2 className="text-xl font-bold mb-2">Keranjang Anda Kosong</h2>
            <p className="text-[#6B6E6E] mb-8 text-center max-w-md">
              Anda belum menambahkan paket wisata atau hotel ke dalam keranjang. Mari temukan liburan impian Anda.
            </p>
            <div className="flex gap-4">
              <Link href="/umrah" className="bg-[#0F766E] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0D655E] transition">
                Jelajahi Paket
              </Link>
              <Link href="/hotels" className="bg-white border border-[#EAE6E1] text-[#1C1A16] px-6 py-3 rounded-xl font-semibold hover:bg-[#FAF9F6] transition">
                Cari Hotel
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-6 bg-white p-4 sm:p-6 rounded-3xl border border-[#EAE6E1] shadow-sm">
                  <div className="w-full sm:w-40 h-32 bg-[#EAE6E1] rounded-2xl overflow-hidden shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#968A80]">
                        No Image
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F766E] bg-[#F0FDFA] px-2 py-1 rounded-lg">
                            {item.type}
                          </span>
                          <h3 className="text-lg font-bold mt-2 leading-tight">{item.title}</h3>
                          {item.date && <p className="text-sm text-[#6B6E6E] mt-1">{item.date}</p>}
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition"
                          title="Hapus"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end mt-4">
                      <div className="font-bold text-lg text-[#0F766E]">
                        {formatPrice(item.price)}
                      </div>
                      
                      <div className="flex items-center gap-3 bg-[#FAF9F6] rounded-xl p-1 border border-[#EAE6E1]">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 hover:bg-white rounded-lg transition"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-6 text-center font-semibold text-sm">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-white rounded-lg transition"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-3xl border border-[#EAE6E1] shadow-sm sticky top-28">
                <h3 className="text-lg font-bold mb-6 pb-4 border-b border-[#EAE6E1]">Ringkasan Pesanan</h3>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-[#6B6E6E] truncate pr-4 flex-1">
                        {item.title} (x{item.quantity})
                      </span>
                      <span className="font-semibold text-right">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-[#EAE6E1] pt-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl text-[#0F766E]">
                      {formatPrice(getTotal())}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-[#1C1A16] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#33312E] transition"
                >
                  Lanjut ke Pembayaran
                  <ArrowRight className="h-5 w-5" />
                </button>
                <p className="text-center text-xs text-[#968A80] mt-4">
                  *Harga dapat berubah sesuai ketersediaan.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
