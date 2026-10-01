'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Plane, Building2, Bed, Image as ImageIcon } from 'lucide-react';

interface CreatePackageWizardProps {
  onClose: () => void;
  onSubmit: (payload: any) => void;
}

export function CreatePackageWizard({ onClose, onSubmit }: CreatePackageWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Umrah Reguler',
    duration_days: 9,
    departure_date: '',
    return_date: '',
    departure_city: 'Jakarta - Soekarno Hatta (CGK)',
    flight: {
      airline: '',
      seat_allotment: 45,
    },
    description: '',
    hotels: [
      { city: 'Makkah', name: '', stars: 5, nights: 5 },
      { city: 'Madinah', name: '', stars: 5, nights: 4 },
    ],
    meal_plan: {
      has_breakfast_option: true,
      breakfast_addon_price_per_pax: 1500000,
    },
    room_allocations: [
      { room_type: 'Quad', capacity_per_room: 4, room_count: 0, price_room_only: 0, price_with_breakfast: 0, total_pax_capacity: 0 },
      { room_type: 'Triple', capacity_per_room: 3, room_count: 0, price_room_only: 0, price_with_breakfast: 0, total_pax_capacity: 0 },
      { room_type: 'Double', capacity_per_room: 2, room_count: 0, price_room_only: 0, price_with_breakfast: 0, total_pax_capacity: 0 },
    ],
    total_seats: 45,
    allow_sharing_room: true,
    includes: ['Tiket PP', 'Visa', 'Muthawif', 'Handling', 'Hotel', 'Makan', 'Bus AC', 'Zamzam 5L'],
    excludes: ['Paspor', 'Buku Kuning', 'Pengeluaran Pribadi', 'Kelebihan Bagasi'],
    thumbnail_url: '',
    status: 'published'
  });

  // Calculate totals automatically when room allocation changes
  useEffect(() => {
    let calculatedTotalPax = 0;
    const newAllocations = formData.room_allocations.map(room => {
      const paxCapacity = room.capacity_per_room * room.room_count;
      calculatedTotalPax += paxCapacity;
      
      // Auto-calculate breakfast price if Add-on is selected
      const priceWithBreakfast = formData.meal_plan.has_breakfast_option 
        ? Number(room.price_room_only) + Number(formData.meal_plan.breakfast_addon_price_per_pax)
        : Number(room.price_room_only);

      return {
        ...room,
        price_with_breakfast: priceWithBreakfast,
        total_pax_capacity: paxCapacity
      };
    });

    setFormData(prev => ({
      ...prev,
      room_allocations: newAllocations,
      total_seats: calculatedTotalPax
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.room_allocations[0].room_count, 
    formData.room_allocations[1].room_count, 
    formData.room_allocations[2].room_count, 
    formData.room_allocations[0].price_room_only, 
    formData.room_allocations[1].price_room_only, 
    formData.room_allocations[2].price_room_only,
    formData.meal_plan.breakfast_addon_price_per_pax,
    formData.meal_plan.has_breakfast_option
  ]);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.total_seats > formData.flight.seat_allotment) {
      alert(`Peringatan: Total Kuota Jemaah (${formData.total_seats}) melebihi Batas Tiket Pesawat (${formData.flight.seat_allotment}). Harap sesuaikan alokasi kamar Anda.`);
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 font-bold">
              <Plane className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-['Figtree'] text-lg font-bold text-neutral-900">
                Tambah Paket Umrah & Wisata Baru
              </h3>
              <p className="text-xs text-neutral-500">Formulir konfigurasi inventaris & alokasi kamar</p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 transition rounded-full p-2 hover:bg-neutral-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wizard Progress */}
        <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100">
          <div className="flex items-center justify-between">
            {[
              { num: 1, title: 'Info Dasar', icon: Plane },
              { num: 2, title: 'Akomodasi', icon: Building2 },
              { num: 3, title: 'Kamar & Harga', icon: Bed },
              { num: 4, title: 'Publikasi', icon: ImageIcon },
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className={`flex flex-col items-center gap-2 ${step >= s.num ? 'text-teal-700' : 'text-neutral-400'}`}>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-xs ${step >= s.num ? 'bg-teal-700 text-white' : 'bg-neutral-200 text-neutral-500'}`}>
                    {step > s.num ? <Check className="h-4 w-4" /> : s.num}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{s.title}</span>
                </div>
                {idx < 3 && (
                  <div className={`h-1 flex-1 mx-4 rounded-full ${step > s.num ? 'bg-teal-700' : 'bg-neutral-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form id="wizard-form" onSubmit={handleSubmit} className="space-y-6 text-sm">
            
            {/* STEP 1: INFORMASI DASAR */}
            {step === 1 && (
              <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1.5">Nama / Judul Paket <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Contoh: Paket Umrah Reguler Bintang 5"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-neutral-900 outline-none focus:border-teal-600 focus:bg-white transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-700 font-bold mb-1.5">Kategori Paket</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-neutral-900 outline-none focus:border-teal-600 focus:bg-white transition"
                    >
                      <option value="Umrah Reguler">Umrah Reguler</option>
                      <option value="Umrah Plus">Umrah Plus</option>
                      <option value="Wisata Halal">Wisata Halal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-700 font-bold mb-1.5">Durasi (Hari)</label>
                    <input
                      type="number"
                      min={1}
                      value={formData.duration_days}
                      onChange={(e) => setFormData({ ...formData, duration_days: Number(e.target.value) })}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-neutral-900 outline-none focus:border-teal-600 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-700 font-bold mb-1.5">Tanggal Keberangkatan</label>
                    <input
                      type="date"
                      required
                      value={formData.departure_date}
                      onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-neutral-900 outline-none focus:border-teal-600 focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 font-bold mb-1.5">Tanggal Kepulangan</label>
                    <input
                      type="date"
                      required
                      value={formData.return_date}
                      onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-neutral-900 outline-none focus:border-teal-600 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-neutral-100 pt-5">
                  <div>
                    <label className="block text-neutral-700 font-bold mb-1.5">Kota / Embarkasi</label>
                    <input
                      type="text"
                      value={formData.departure_city}
                      onChange={(e) => setFormData({ ...formData, departure_city: e.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-neutral-900 outline-none focus:border-teal-600 focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 font-bold mb-1.5">Maskapai Penerbangan</label>
                    <input
                      type="text"
                      placeholder="Contoh: Saudia Airlines"
                      value={formData.flight.airline}
                      onChange={(e) => setFormData({ ...formData, flight: { ...formData.flight, airline: e.target.value } })}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-neutral-900 outline-none focus:border-teal-600 focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 font-bold mb-1.5 text-teal-700">Seat Quota (Tiket)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.flight.seat_allotment}
                      onChange={(e) => setFormData({ ...formData, flight: { ...formData.flight, seat_allotment: Number(e.target.value) } })}
                      className="w-full rounded-xl border border-teal-200 bg-teal-50 p-3 font-bold text-teal-900 outline-none focus:border-teal-600 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1.5">Deskripsi Singkat</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-neutral-900 outline-none focus:border-teal-600 focus:bg-white transition resize-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: AKOMODASI HOTEL & MAKAN */}
            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-6">
                  {/* Hotel Makkah */}
                  <div className="rounded-2xl border border-neutral-200 p-5 bg-neutral-50/50">
                    <h4 className="font-bold text-neutral-900 mb-4 border-b border-neutral-200 pb-2">Detail Hotel Makkah</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-neutral-700 text-xs font-bold mb-1.5">Nama Hotel</label>
                        <input
                          type="text"
                          value={formData.hotels[0].name}
                          onChange={(e) => {
                            const newHotels = [...formData.hotels];
                            newHotels[0].name = e.target.value;
                            setFormData({ ...formData, hotels: newHotels });
                          }}
                          placeholder="Contoh: Pullman Zamzam"
                          className="w-full rounded-lg border border-neutral-200 bg-white p-2.5 outline-none focus:border-teal-600 transition"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-neutral-700 text-xs font-bold mb-1.5">Bintang</label>
                          <select
                            value={formData.hotels[0].stars}
                            onChange={(e) => {
                              const newHotels = [...formData.hotels];
                              newHotels[0].stars = Number(e.target.value);
                              setFormData({ ...formData, hotels: newHotels });
                            }}
                            className="w-full rounded-lg border border-neutral-200 bg-white p-2.5 outline-none focus:border-teal-600 transition"
                          >
                            {[3, 4, 5].map(n => <option key={n} value={n}>{n} Bintang</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-neutral-700 text-xs font-bold mb-1.5">Durasi (Malam)</label>
                          <input
                            type="number"
                            min={1}
                            value={formData.hotels[0].nights}
                            onChange={(e) => {
                              const newHotels = [...formData.hotels];
                              newHotels[0].nights = Number(e.target.value);
                              setFormData({ ...formData, hotels: newHotels });
                            }}
                            className="w-full rounded-lg border border-neutral-200 bg-white p-2.5 outline-none focus:border-teal-600 transition"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hotel Madinah */}
                  <div className="rounded-2xl border border-neutral-200 p-5 bg-neutral-50/50">
                    <h4 className="font-bold text-neutral-900 mb-4 border-b border-neutral-200 pb-2">Detail Hotel Madinah</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-neutral-700 text-xs font-bold mb-1.5">Nama Hotel</label>
                        <input
                          type="text"
                          value={formData.hotels[1].name}
                          onChange={(e) => {
                            const newHotels = [...formData.hotels];
                            newHotels[1].name = e.target.value;
                            setFormData({ ...formData, hotels: newHotels });
                          }}
                          placeholder="Contoh: Dar Al Iman InterContinental"
                          className="w-full rounded-lg border border-neutral-200 bg-white p-2.5 outline-none focus:border-teal-600 transition"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-neutral-700 text-xs font-bold mb-1.5">Bintang</label>
                          <select
                            value={formData.hotels[1].stars}
                            onChange={(e) => {
                              const newHotels = [...formData.hotels];
                              newHotels[1].stars = Number(e.target.value);
                              setFormData({ ...formData, hotels: newHotels });
                            }}
                            className="w-full rounded-lg border border-neutral-200 bg-white p-2.5 outline-none focus:border-teal-600 transition"
                          >
                            {[3, 4, 5].map(n => <option key={n} value={n}>{n} Bintang</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-neutral-700 text-xs font-bold mb-1.5">Durasi (Malam)</label>
                          <input
                            type="number"
                            min={1}
                            value={formData.hotels[1].nights}
                            onChange={(e) => {
                              const newHotels = [...formData.hotels];
                              newHotels[1].nights = Number(e.target.value);
                              setFormData({ ...formData, hotels: newHotels });
                            }}
                            className="w-full rounded-lg border border-neutral-200 bg-white p-2.5 outline-none focus:border-teal-600 transition"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5 mt-6">
                  <h4 className="font-bold text-emerald-900 mb-4">Pengaturan Paket Sarapan (Meal Plan)</h4>
                  <div className="space-y-4">
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="mealplan"
                          checked={formData.meal_plan.has_breakfast_option === true}
                          onChange={() => setFormData({
                            ...formData, 
                            meal_plan: { ...formData.meal_plan, has_breakfast_option: true }
                          })}
                          className="accent-emerald-700 w-4 h-4"
                        />
                        <span className="text-neutral-800 font-medium">Harga Tambahan Tetap (Add-on)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="mealplan"
                          checked={formData.meal_plan.has_breakfast_option === false}
                          onChange={() => setFormData({
                            ...formData, 
                            meal_plan: { ...formData.meal_plan, has_breakfast_option: false }
                          })}
                          className="accent-emerald-700 w-4 h-4"
                        />
                        <span className="text-neutral-800 font-medium">Setting Manual per Tipe Kamar</span>
                      </label>
                    </div>

                    {formData.meal_plan.has_breakfast_option && (
                      <div className="pt-2">
                        <label className="block text-emerald-900 text-xs font-bold mb-1.5">Nilai Tambahan Sarapan (IDR per Pax)</label>
                        <input
                          type="number"
                          value={formData.meal_plan.breakfast_addon_price_per_pax}
                          onChange={(e) => setFormData({
                            ...formData, 
                            meal_plan: { ...formData.meal_plan, breakfast_addon_price_per_pax: Number(e.target.value) }
                          })}
                          className="w-1/2 max-w-sm rounded-lg border border-emerald-200 bg-white p-2.5 font-mono font-bold text-emerald-700 outline-none focus:border-emerald-600 transition"
                        />
                        <p className="text-[11px] text-emerald-600 mt-1">Sistem akan otomatis menghitung Harga With Breakfast di Langkah 3.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: ALOKASI KAMAR */}
            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <div>
                    <h3 className="font-bold text-neutral-900 text-base">Alokasi & Inventaris Kamar</h3>
                    <p className="text-xs text-neutral-500">Tentukan jumlah kamar fisik dan harga jual per pax (orang).</p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-center ${formData.total_seats > formData.flight.seat_allotment ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-teal-50 text-teal-800 border border-teal-100'}`}>
                    <span className="block text-[10px] font-bold uppercase tracking-wider">Total Kapasitas Jemaah</span>
                    <span className="font-mono text-lg font-bold">{formData.total_seats} / {formData.flight.seat_allotment} Seat</span>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-neutral-200">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-neutral-50 text-neutral-500">
                        <th className="p-3 font-bold">TIPE KAMAR</th>
                        <th className="p-3 font-bold w-32">JML KAMAR FISIK</th>
                        <th className="p-3 font-bold">HARGA / PAX (NO BFAST)</th>
                        <th className="p-3 font-bold">HARGA / PAX (W/ BFAST)</th>
                        <th className="p-3 font-bold text-center bg-neutral-100">SUBTOTAL PAX</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {formData.room_allocations.map((room, idx) => (
                        <tr key={room.room_type} className="hover:bg-neutral-50/50">
                          <td className="p-3">
                            <span className="font-bold text-neutral-900 block">{room.room_type}</span>
                            <span className="text-[10px] text-neutral-500">Kapasitas: {room.capacity_per_room} Pax</span>
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min={0}
                              value={room.room_count}
                              onChange={(e) => {
                                const newAlloc = [...formData.room_allocations];
                                newAlloc[idx].room_count = Number(e.target.value);
                                setFormData({ ...formData, room_allocations: newAlloc });
                              }}
                              className="w-full rounded-md border border-neutral-300 p-2 outline-none focus:border-teal-600"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min={0}
                              value={room.price_room_only}
                              onChange={(e) => {
                                const newAlloc = [...formData.room_allocations];
                                newAlloc[idx].price_room_only = Number(e.target.value);
                                setFormData({ ...formData, room_allocations: newAlloc });
                              }}
                              className="w-full rounded-md border border-neutral-300 p-2 font-mono text-neutral-700 outline-none focus:border-teal-600"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min={0}
                              readOnly={formData.meal_plan.has_breakfast_option}
                              value={room.price_with_breakfast}
                              onChange={(e) => {
                                if (!formData.meal_plan.has_breakfast_option) {
                                  const newAlloc = [...formData.room_allocations];
                                  newAlloc[idx].price_with_breakfast = Number(e.target.value);
                                  setFormData({ ...formData, room_allocations: newAlloc });
                                }
                              }}
                              className={`w-full rounded-md border border-neutral-300 p-2 font-mono outline-none focus:border-teal-600 ${formData.meal_plan.has_breakfast_option ? 'bg-neutral-100 text-neutral-500' : 'bg-white text-neutral-700'}`}
                            />
                          </td>
                          <td className="p-3 text-center bg-neutral-50 font-bold text-neutral-900 text-sm">
                            {room.total_pax_capacity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {formData.total_seats > formData.flight.seat_allotment && (
                  <div className="rounded-xl bg-red-50 p-4 border border-red-200">
                    <p className="text-sm font-bold text-red-800">⚠️ Peringatan Overbooking!</p>
                    <p className="text-xs text-red-600 mt-1">Kapasitas jemaah dari kamar ({formData.total_seats}) melebihi kuota kursi pesawat ({formData.flight.seat_allotment}). Pertimbangkan untuk mengurangi alokasi kamar.</p>
                  </div>
                )}

                <div className="flex items-center gap-3 mt-4">
                  <input
                    type="checkbox"
                    id="allowSharing"
                    checked={formData.allow_sharing_room}
                    onChange={(e) => setFormData({ ...formData, allow_sharing_room: e.target.checked })}
                    className="accent-teal-700 w-4 h-4 rounded"
                  />
                  <label htmlFor="allowSharing" className="font-medium text-neutral-700 cursor-pointer">
                    Menerima Jemaah Solo / Gabungan Kamar (Sharing Room Allowed)
                  </label>
                </div>
              </div>
            )}

            {/* STEP 4: PUBLIKASI & MEDIA */}
            {step === 4 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-neutral-700 font-bold mb-1.5">Fasilitas Termasuk (Includes)</label>
                    <textarea
                      rows={4}
                      value={formData.includes.join('\n')}
                      onChange={(e) => setFormData({ ...formData, includes: e.target.value.split('\n') })}
                      placeholder="Satu per baris..."
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-neutral-900 outline-none focus:border-teal-600 transition resize-none"
                    />
                    <p className="text-[10px] text-neutral-400 mt-1">Pisahkan per baris (Enter)</p>
                  </div>
                  <div>
                    <label className="block text-neutral-700 font-bold mb-1.5">Tidak Termasuk (Excludes)</label>
                    <textarea
                      rows={4}
                      value={formData.excludes.join('\n')}
                      onChange={(e) => setFormData({ ...formData, excludes: e.target.value.split('\n') })}
                      placeholder="Satu per baris..."
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-neutral-900 outline-none focus:border-teal-600 transition resize-none"
                    />
                    <p className="text-[10px] text-neutral-400 mt-1">Pisahkan per baris (Enter)</p>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1.5">URL Foto Thumbnail Utama</label>
                  <input
                    type="url"
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-neutral-900 outline-none focus:border-teal-600 transition"
                  />
                  {formData.thumbnail_url && (
                    <img src={formData.thumbnail_url} alt="Preview" className="mt-3 h-32 w-auto rounded-lg object-cover border border-neutral-200" />
                  )}
                </div>

                <div className="border-t border-neutral-100 pt-5">
                  <label className="block text-neutral-700 font-bold mb-3">Status Publikasi</label>
                  <div className="flex gap-4">
                    <label className="flex flex-1 items-center gap-3 rounded-xl border border-neutral-200 p-4 cursor-pointer hover:bg-neutral-50 transition">
                      <input
                        type="radio"
                        name="status"
                        checked={formData.status === 'published'}
                        onChange={() => setFormData({ ...formData, status: 'published' })}
                        className="accent-teal-700 w-4 h-4"
                      />
                      <div>
                        <span className="block font-bold text-neutral-900">Published</span>
                        <span className="block text-xs text-neutral-500">Terbuka untuk pemesanan umum</span>
                      </div>
                    </label>
                    <label className="flex flex-1 items-center gap-3 rounded-xl border border-neutral-200 p-4 cursor-pointer hover:bg-neutral-50 transition">
                      <input
                        type="radio"
                        name="status"
                        checked={formData.status === 'draft'}
                        onChange={() => setFormData({ ...formData, status: 'draft' })}
                        className="accent-neutral-500 w-4 h-4"
                      />
                      <div>
                        <span className="block font-bold text-neutral-900">Simpan sebagai Draft</span>
                        <span className="block text-xs text-neutral-500">Tidak terlihat oleh pelanggan</span>
                      </div>
                    </label>
                  </div>
                </div>

              </div>
            )}

          </form>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-neutral-100 bg-neutral-50 px-6 py-4 flex items-center justify-between rounded-b-3xl">
          <button
            type="button"
            onClick={handlePrev}
            disabled={step === 1}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition ${step === 1 ? 'text-neutral-300 cursor-not-allowed' : 'text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-100 shadow-sm'}`}
          >
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </button>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-bold text-neutral-600 hover:text-neutral-900 transition"
            >
              Batal
            </button>
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-700 text-white font-bold hover:bg-teal-800 shadow-sm transition"
              >
                Selanjutnya
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                form="wizard-form"
                className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-sm shadow-emerald-700/20 transition"
              >
                <Check className="h-4 w-4" />
                Simpan & Terbitkan
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
