'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Star,
  Check,
  Wifi,
  Sparkles,
  Coffee,
  Waves,
  ShieldCheck,
  ChevronLeft,
  Share2,
  Heart,
  ShoppingBag,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { HotelItem } from '@/lib/figma-data';

interface HotelDetailViewProps {
  hotel: HotelItem;
  setScreen: (screen: string) => void;
  setSelectedRoom: (room: any) => void;
}

export function HotelDetailView({ hotel, setScreen, setSelectedRoom }: HotelDetailViewProps) {
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);

  const selectedRoom = hotel.rooms[selectedRoomIndex] || hotel.rooms[0];
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const getCartItem = () => ({
    id: `hotel-${hotel.id}-${selectedRoom.name}-${Date.now()}`,
    type: 'HOTEL' as const,
    itemId: hotel.id, // Or selectedRoom.id if it existed
    title: `${hotel.name} - ${selectedRoom.name}`,
    image: hotel.image,
    price: selectedRoom.price * 3, // For 3 nights
    quantity: 1, // 1 room
    date: '12-15 Mar 2026',
  });

  const handleBooking = () => {
    setSelectedRoom(selectedRoom);
    setScreen('checkout');
  };

  const handleAddToCart = () => {
    addItem(getCartItem());
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-32">
      {/* Top Breadcrumb & Action Header */}
      <div className="border-b border-[#EAE6E1] bg-white py-3.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 text-xs text-[#6B6E6E]">
          <button
            onClick={() => setScreen('hotels')}
            className="flex items-center gap-1.5 font-bold text-[#0F766E] hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Kembali ke Pencarian</span>
          </button>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 hover:text-[#1C1A16]">
              <Share2 className="h-4 w-4" />
              <span>Bagikan</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-[#EF4444]">
              <Heart className="h-4 w-4" />
              <span>Simpan</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[#F0FDFA] px-2.5 py-0.5 text-xs font-bold text-[#0F766E]">
                Bintang 5 Luxury Resort
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-[#1C1A16]">
                <Star className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                <span>{hotel.rating}</span>
                <span className="text-[#968A80]">({hotel.reviewsCount} Ulasan)</span>
              </div>
            </div>
            <h1 className="mt-2 font-['Figtree'] text-3xl font-bold tracking-tight text-[#1C1A16] sm:text-4xl">
              {hotel.name}
            </h1>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#6B6E6E]">
              <MapPin className="h-4 w-4 text-[#0F766E]" />
              <span>{hotel.fullLocation}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-[#968A80]">Harga Mulai Dari</span>
            <div className="font-['Figtree'] text-2xl font-bold text-[#0F766E]">
              {hotel.priceFormatted}
            </div>
            <span className="text-[11px] text-[#968A80]">Termasuk Sarapan & Pajak</span>
          </div>
        </div>

        {/* Gallery Section (Figma gallery-section) */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2 overflow-hidden rounded-3xl border border-[#EAE6E1] bg-[#EAE6E1] shadow-sm">
            <img
              src={hotel.gallery[selectedImage] || hotel.image}
              alt={hotel.name}
              className="h-[420px] w-full object-cover transition duration-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
            {hotel.gallery.map((img, i) => (
              <div
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative h-[202px] cursor-pointer overflow-hidden rounded-2xl border-2 transition ${
                  selectedImage === i ? 'border-[#0F766E]' : 'border-transparent'
                }`}
              >
                <img src={img} alt={`Gallery ${i}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Details & Room Grid */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.8fr_1fr]">
          <div className="space-y-10">
            {/* About Hotel */}
            <div className="rounded-3xl border border-[#EAE6E1] bg-white p-7 shadow-sm">
              <h2 className="font-['Figtree'] text-xl font-bold text-[#1C1A16]">
                Tentang Akomodasi
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#6B6E6E]">
                {hotel.description}
              </p>

              {/* Fasilitas Unggulan */}
              <div className="mt-8 border-t border-[#EAE6E1] pt-6">
                <h3 className="font-['Figtree'] text-base font-bold text-[#1C1A16]">
                  Fasilitas Unggulan
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {hotel.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 rounded-xl bg-[#FAF9F6] border border-[#EAE6E1] p-3 text-xs font-semibold text-[#1C1A16]"
                    >
                      <Check className="h-4 w-4 text-[#0F766E]" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pilihan Kamar Tersedia */}
            <div className="rounded-3xl border border-[#EAE6E1] bg-white p-7 shadow-sm">
              <h2 className="font-['Figtree'] text-xl font-bold text-[#1C1A16]">
                Pilihan Kamar Tersedia
              </h2>
              <p className="mt-1 text-xs text-[#6B6E6E]">
                Semua tipe kamar mencakup jaminan pembatalan gratis dan sarapan harian.
              </p>

              <div className="mt-6 space-y-4">
                {hotel.rooms.map((room, idx) => (
                  <div
                    key={room.name}
                    onClick={() => setSelectedRoomIndex(idx)}
                    className={`cursor-pointer rounded-2xl border-2 p-5 transition ${
                      selectedRoomIndex === idx
                        ? 'border-[#0F766E] bg-[#F0FDFA]'
                        : 'border-[#EAE6E1] bg-white hover:border-[#0F766E]/40'
                    }`}
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                              selectedRoomIndex === idx
                                ? 'border-[#0F766E] bg-[#0F766E] text-white'
                                : 'border-[#968A80]'
                            }`}
                          >
                            {selectedRoomIndex === idx && <Check className="h-2.5 w-2.5" />}
                          </span>
                          <h4 className="font-['Figtree'] text-base font-bold text-[#1C1A16]">
                            {room.name}
                          </h4>
                        </div>
                        <p className="mt-2 text-xs text-[#6B6E6E]">{room.description}</p>
                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#968A80]">
                          <span>{room.bed}</span>
                          <span>•</span>
                          <span>{room.guests}</span>
                          <span>•</span>
                          <span className="text-[#0F766E] font-medium">{room.features}</span>
                        </div>
                      </div>

                      <div className="text-right sm:shrink-0">
                        <span className="text-[10px] uppercase tracking-wider text-[#968A80]">
                          Harga / Malam
                        </span>
                        <div className="font-['Figtree'] text-lg font-bold text-[#0F766E]">
                          {room.priceFormatted}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoomIndex(idx);
                            handleBooking();
                          }}
                          className={`mt-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                            selectedRoomIndex === idx
                              ? 'bg-[#0F766E] text-white shadow-sm'
                              : 'border border-[#0F766E] text-[#0F766E]'
                          }`}
                        >
                          Pilih Kamar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guest Reviews Breakdown (Figma) */}
            <div className="rounded-3xl border border-[#EAE6E1] bg-white p-7 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#EAE6E1] pb-6">
                <div>
                  <h3 className="font-['Figtree'] text-xl font-bold text-[#1C1A16]">
                    Ulasan Tamu Terverifikasi
                  </h3>
                  <p className="text-xs text-[#6B6E6E]">
                    Berdasarkan {hotel.reviewsCount} ulasan tamu yang telah menginap.
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-['Figtree'] text-3xl font-bold text-[#0F766E]">
                    {hotel.rating}
                  </div>
                  <span className="text-xs font-bold text-[#1C1A16]">{hotel.ratingText}</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 text-xs">
                {[
                  { label: 'Kebersihan', score: '9.8' },
                  { label: 'Pelayanan', score: '9.7' },
                  { label: 'Lokasi', score: '9.9' },
                  { label: 'Kenyamanan', score: '9.8' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-[#EAE6E1] bg-[#FAF9F6] p-3 text-center">
                    <span className="text-[#968A80] block text-[11px]">{s.label}</span>
                    <span className="font-['Figtree'] text-lg font-bold text-[#1C1A16] mt-0.5 block">
                      {s.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Summary Card */}
          <aside className="sticky top-28 h-fit space-y-5">
            <div className="rounded-3xl border border-[#EAE6E1] bg-white p-6 shadow-xl">
              <h3 className="font-['Figtree'] text-lg font-bold text-[#1C1A16]">
                Ringkasan Reservasi
              </h3>
              <div className="mt-4 space-y-3 text-xs">
                <div className="flex justify-between text-[#6B6E6E]">
                  <span>Durasi Menginap:</span>
                  <span className="font-bold text-[#1C1A16]">3 Malam (12-15 Mar 2026)</span>
                </div>
                <div className="flex justify-between text-[#6B6E6E]">
                  <span>Jumlah Tamu:</span>
                  <span className="font-bold text-[#1C1A16]">2 Tamu, 1 Kamar</span>
                </div>
                <div className="flex justify-between text-[#6B6E6E]">
                  <span>Tipe Kamar:</span>
                  <span className="font-bold text-[#0F766E]">{selectedRoom.name}</span>
                </div>
              </div>

              <div className="my-5 h-px bg-[#EAE6E1]" />

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#6B6E6E]">
                  <span>Tarif Kamar (3 Malam):</span>
                  <span>Rp {(selectedRoom.price * 3).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-[#6B6E6E]">
                  <span>Biaya Layanan & Pajak:</span>
                  <span className="text-[#10B981] font-semibold">Gratis</span>
                </div>
                <div className="flex items-baseline justify-between border-t border-[#EAE6E1] pt-3 text-sm font-bold text-[#1C1A16]">
                  <span>Total Tagihan:</span>
                  <span className="font-['Figtree'] text-xl text-[#0F766E]">
                    Rp {(selectedRoom.price * 3).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-[#0F766E] bg-white py-3.5 text-sm font-bold text-[#0F766E] transition hover:bg-[#F0FDFA]"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Tambah ke Keranjang
                </button>
                <button
                  onClick={handleBooking}
                  className="w-full rounded-2xl bg-[#0F766E] py-4 text-sm font-bold text-white shadow-md shadow-[#0F766E]/20 transition hover:bg-[#0D5C56]"
                >
                  Lanjutkan Pemesanan
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[#968A80]">
                <ShieldCheck className="h-4 w-4 text-[#10B981]" />
                <span>Pasti Dapat Kamar & Konfirmasi Instan</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Sticky Bottom Bar (Figma sticky-bottom-bar) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#EAE6E1] bg-white/95 px-4 py-3.5 shadow-lg backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={hotel.image}
              alt={hotel.name}
              className="hidden h-12 w-16 rounded-xl object-cover sm:block"
            />
            <div>
              <p className="font-bold text-xs text-[#1C1A16]">{hotel.name}</p>
              <p className="text-[11px] text-[#0F766E] font-medium">{selectedRoom.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <span className="block text-[10px] text-[#968A80] uppercase">Total untuk 3 Malam</span>
              <span className="font-['Figtree'] text-lg font-bold text-[#0F766E]">
                Rp {(selectedRoom.price * 3).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="rounded-xl border border-[#0F766E] bg-white px-4 py-3 text-xs font-bold text-[#0F766E] shadow-sm hover:bg-[#F0FDFA]"
              >
                <ShoppingBag className="h-4 w-4" />
              </button>
              <button
                onClick={handleBooking}
                className="rounded-xl bg-[#0F766E] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#0D5C56]"
              >
                Lanjutkan Pemesanan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
