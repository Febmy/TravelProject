'use client';

import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Building2, Bed, Image as ImageIcon } from 'lucide-react';

interface CreateHotelWizardProps {
  onClose: () => void;
  onSubmit: (payload: any) => void;
}

export function CreateHotelWizard({ onClose, onSubmit }: CreateHotelWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    stars: 5,
    description: '',
    rooms: [
      { room_type: 'Standard Room', capacity: 2, price_per_night: 1500000, total_rooms: 10 },
    ],
    amenities: ['WiFi Gratis', 'Sarapan', 'AC', 'Layanan Kamar 24 Jam'],
    thumbnail_url: '',
    status: 'published'
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addRoom = () => {
    setFormData({
      ...formData,
      rooms: [
        ...formData.rooms,
        { room_type: '', capacity: 2, price_per_night: 0, total_rooms: 0 }
      ]
    });
  };

  const removeRoom = (index: number) => {
    const newRooms = formData.rooms.filter((_, idx) => idx !== index);
    setFormData({ ...formData, rooms: newRooms });
  };

  const updateRoom = (index: number, field: string, value: any) => {
    const newRooms = [...formData.rooms];
    newRooms[index] = { ...newRooms[index], [field]: value };
    setFormData({ ...formData, rooms: newRooms });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 font-bold">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-['Figtree'] text-lg font-bold text-neutral-900">
                Tambah Hotel & Resort Baru
              </h3>
              <p className="text-xs text-neutral-500">Konfigurasi informasi, kamar, dan fasilitas hotel</p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 transition rounded-full p-2 hover:bg-neutral-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wizard Progress */}
        <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100">
          <div className="flex items-center justify-between px-10">
            {[
              { num: 1, title: 'Info Dasar', icon: Building2 },
              { num: 2, title: 'Tipe Kamar & Harga', icon: Bed },
              { num: 3, title: 'Fasilitas & Publikasi', icon: ImageIcon },
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className={`flex flex-col items-center gap-2 ${step >= s.num ? 'text-teal-700' : 'text-neutral-400'}`}>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-xs ${step >= s.num ? 'bg-teal-700 text-white' : 'bg-neutral-200 text-neutral-500'}`}>
                    {step > s.num ? <Check className="h-4 w-4" /> : s.num}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{s.title}</span>
                </div>
                {idx < 2 && (
                  <div className={`h-1 flex-1 mx-4 rounded-full ${step > s.num ? 'bg-teal-700' : 'bg-neutral-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form id="hotel-wizard-form" onSubmit={handleSubmit} className="space-y-6 text-sm">
            
            {/* STEP 1: INFORMASI DASAR */}
            {step === 1 && (
              <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1.5">Nama Hotel <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Hilton Makkah Convention Hotel"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-neutral-900 outline-none focus:border-teal-600 focus:bg-white transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-700 font-bold mb-1.5">Bintang</label>
                    <select
                      value={formData.stars}
                      onChange={(e) => setFormData({ ...formData, stars: Number(e.target.value) })}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-neutral-900 outline-none focus:border-teal-600 focus:bg-white transition"
                    >
                      {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Bintang</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-700 font-bold mb-1.5">Lokasi / Alamat</label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Contoh: Makkah, Saudi Arabia"
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-neutral-900 outline-none focus:border-teal-600 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1.5">Deskripsi Singkat</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-neutral-900 outline-none focus:border-teal-600 focus:bg-white transition resize-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: KAMAR & HARGA */}
            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <div>
                    <h3 className="font-bold text-neutral-900 text-base">Konfigurasi Kamar</h3>
                    <p className="text-xs text-neutral-500">Tentukan tipe kamar, kapasitas, dan harga per malam.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addRoom}
                    className="px-4 py-2 bg-teal-50 text-teal-700 font-bold text-xs rounded-lg hover:bg-teal-100 transition"
                  >
                    + Tambah Tipe Kamar
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.rooms.map((room, idx) => (
                    <div key={idx} className="relative rounded-xl border border-neutral-200 p-4 bg-neutral-50/50">
                      {formData.rooms.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRoom(idx)}
                          className="absolute top-4 right-4 text-neutral-400 hover:text-red-500 transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 mb-4 pr-8">
                        <div>
                          <label className="block text-neutral-700 text-xs font-bold mb-1.5">Nama Tipe Kamar</label>
                          <input
                            type="text"
                            required
                            value={room.room_type}
                            onChange={(e) => updateRoom(idx, 'room_type', e.target.value)}
                            placeholder="Contoh: Standard Double Room"
                            className="w-full rounded-lg border border-neutral-200 bg-white p-2.5 outline-none focus:border-teal-600 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-700 text-xs font-bold mb-1.5">Kapasitas (Orang)</label>
                          <input
                            type="number"
                            required
                            min={1}
                            value={room.capacity}
                            onChange={(e) => updateRoom(idx, 'capacity', Number(e.target.value))}
                            className="w-full rounded-lg border border-neutral-200 bg-white p-2.5 outline-none focus:border-teal-600 transition"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pr-8">
                        <div>
                          <label className="block text-neutral-700 text-xs font-bold mb-1.5">Ketersediaan Fisik Kamar</label>
                          <input
                            type="number"
                            required
                            min={1}
                            value={room.total_rooms}
                            onChange={(e) => updateRoom(idx, 'total_rooms', Number(e.target.value))}
                            className="w-full rounded-lg border border-neutral-200 bg-white p-2.5 outline-none focus:border-teal-600 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-700 text-xs font-bold mb-1.5">Harga / Malam (IDR)</label>
                          <input
                            type="number"
                            required
                            min={0}
                            value={room.price_per_night}
                            onChange={(e) => updateRoom(idx, 'price_per_night', Number(e.target.value))}
                            className="w-full rounded-lg border border-neutral-200 bg-white p-2.5 font-mono text-teal-700 font-bold outline-none focus:border-teal-600 transition"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: FASILITAS & PUBLIKASI */}
            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                
                <div>
                  <label className="block text-neutral-700 font-bold mb-1.5">Fasilitas Hotel (Amenities)</label>
                  <textarea
                    rows={4}
                    value={formData.amenities.join('\n')}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value.split('\n') })}
                    placeholder="Satu per baris..."
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-neutral-900 outline-none focus:border-teal-600 transition resize-none"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">Pisahkan per baris (Enter)</p>
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
                        <span className="block text-xs text-neutral-500">Ditampilkan di website dan bisa dipesan</span>
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
            {step < 3 ? (
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
                form="hotel-wizard-form"
                className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-sm shadow-emerald-700/20 transition"
              >
                <Check className="h-4 w-4" />
                Simpan & Terbitkan Hotel
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
