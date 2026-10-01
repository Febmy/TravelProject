'use client';

import React, { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import {
  Compass,
  LayoutDashboard,
  Package,
  CalendarCheck,
  CreditCard,
  Users,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  TrendingUp,
  Download,
  X,
  FileText,
  Building,
  Plane,
  Eye,
  Settings,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Filter,
  ArrowUpRight,
  Phone,
  Mail,
  Menu,
  ShieldCheck,
  ShieldAlert,
  Shield,
  UserPlus,
  EyeOff,
  Tag,
  AlertTriangle,
  UploadCloud,
  Image as ImageIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { verifyBookingAction } from '@/actions/booking';
import {
  updatePackageAction,
  updateHotelAction,
  cancelBookingAction,
  createPackageAction,
  createHotelAction,
  createPromoAction,
  deletePromoAction,
  togglePromoAction,
  updateUserRoleAction,
  deleteUserAction,
  createUserBySuperAdminAction,
  updateSystemSettingAction,
  saveBankAccountsAction
} from '@/actions/admin';
import { CreatePackageWizard } from '@/components/views/CreatePackageWizard';
import { CreateHotelWizard } from '@/components/views/CreateHotelWizard';

interface AdminOverviewViewProps {
  initialData: any;
}

export function AdminOverviewView({ initialData }: AdminOverviewViewProps) {
  const router = useRouter();

  // Navigation state
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  const [productTypeFilter, setProductTypeFilter] = useState<'ALL' | 'TOUR' | 'HOTEL'>('ALL');
  const [productTab, setProductTab] = useState<'PACKAGE' | 'HOTEL'>('PACKAGE');

  // Real Database Data States
  const [bookings, setBookings] = useState<any[]>(initialData?.bookings || []);
  const [packages, setPackages] = useState<any[]>(initialData?.packages || []);
  const [hotels, setHotels] = useState<any[]>(initialData?.hotels || []);
  const [users, setUsers] = useState<any[]>(initialData?.users || []);
  const [promos, setPromos] = useState<any[]>(initialData?.promos || []);
  const [auditLogs, setAuditLogs] = useState<any[]>(initialData?.auditLogs || []);
  const [systemSetting, setSystemSetting] = useState<any>(initialData?.systemSetting || null);
  const [bankAccounts, setBankAccounts] = useState<any[]>(initialData?.bankAccounts || []);
  const [stats, setStats] = useState<any>(initialData?.stats || {});
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Current User & Super Admin Authorization Check
  const { data: clientSession } = useSession();
  const currentUser = initialData?.currentUser || null;

  // Cek apakah akun aktif berstatus Super Admin dari server data, database user list, atau client session
  const activeEmail = currentUser?.email || clientSession?.user?.email;
  const userRecordInList = users.find((u) => u.email === activeEmail);
  const isSuperAdmin =
    currentUser?.role === 'SUPER_ADMIN' ||
    userRecordInList?.role === 'SUPER_ADMIN' ||
    clientSession?.user?.role === 'SUPER_ADMIN';

  // Modal Ubah Peran (Khusus Super Admin)
  const [selectedUserForRole, setSelectedUserForRole] = useState<{
    id: string;
    name: string;
    email: string;
    currentRole: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
    newRole: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  } | null>(null);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // Create User Modal (Super Admin only)
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);
  const [newUserForm, setNewUserForm] = useState<{
    name: string;
    email: string;
    password: string;
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
    phoneNumber: string;
  }>({
    name: '',
    email: '',
    password: '',
    role: 'USER',
    phoneNumber: '',
  });

  // Promo State
  const [isCreatePromoOpen, setIsCreatePromoOpen] = useState(false);
  const [newPromo, setNewPromo] = useState({ code: '', campaign: '', type: 'PERCENTAGE', amount: 0, isActive: true });


  // Selected Booking Drawer
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [verifySupplierCode, setVerifySupplierCode] = useState('');
  const [verifySupplierVoucher, setVerifySupplierVoucher] = useState('');

  // Proof of Payment Lightbox Modal
  const [previewProofUrl, setPreviewProofUrl] = useState<string | null>(null);

  // Selected Product for Edit
  const [selectedProductEdit, setSelectedProductEdit] = useState<any>(packages[0] || null);
  const [isEditSaved, setIsEditSaved] = useState(false);
  const [isEditingLoading, setIsEditingLoading] = useState(false);

  // Create New Package Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreatingLoading, setIsCreatingLoading] = useState(false);
  const [newPackageForm, setNewPackageForm] = useState({
    title: '',
    durationDays: 9,
    price: 29500000,
    description: 'Paket Umrah Reguler Bintang 5 dengan bimbingan ibadah intensif dan fasilitas terbaik.',
    imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
    quota: 45,
  });

  const [newHotelForm, setNewHotelForm] = useState({
    name: '',
    location: '',
    price: 1500000,
    description: 'Hotel nyaman dengan fasilitas lengkap.',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    roomsCount: 10,
  });

  // Action status notification banner
  const [actionNotification, setActionNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setActionNotification({ type, message });
    setTimeout(() => setActionNotification(null), 4000);
  };

  // Helper formatting
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // 1. Handle Verify Booking
  const handleVerifyBooking = async (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId || b.rawId === bookingId
          ? { ...b, status: 'CONFIRMED', payment: { ...b.payment, status: 'SUCCESS' } }
          : b
      )
    );
    if (selectedBooking && (selectedBooking.id === bookingId || selectedBooking.rawId === bookingId)) {
      setSelectedBooking((prev: any) => ({
        ...prev,
        status: 'CONFIRMED',
        payment: { ...prev.payment, status: 'SUCCESS' },
      }));
    }
    setStats((prev: any) => ({
      ...prev,
      activeBookingsCount: Math.max(0, (prev.activeBookingsCount || 1) - 1),
      confirmedBookingsCount: (prev.confirmedBookingsCount || 0) + 1,
    }));

    try {
      const res = await verifyBookingAction(bookingId, verifySupplierCode, verifySupplierVoucher);
      if (res.success) {
        setVerifySupplierCode('');
        setVerifySupplierVoucher('');
        showNotification('success', `Booking #${res.data?.bookingCode || bookingId.slice(0, 8)} berhasil diverifikasi & dikonfirmasi!`);
      } else {
        showNotification('error', res.error || 'Gagal memverifikasi booking.');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Kesalahan jaringan saat verifikasi.');
    }
  };

  // 2. Handle Cancel Booking
  const handleCancelBooking = async (bookingId: string) => {
    const confirmCancel = window.confirm('Apakah Anda yakin ingin membatalkan booking ini?');
    if (!confirmCancel) return;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId || b.rawId === bookingId
          ? { ...b, status: 'CANCELLED', payment: { ...b.payment, status: 'FAILED' } }
          : b
      )
    );
    if (selectedBooking && (selectedBooking.id === bookingId || selectedBooking.rawId === bookingId)) {
      setSelectedBooking((prev: any) => ({
        ...prev,
        status: 'CANCELLED',
        payment: { ...prev.payment, status: 'FAILED' },
      }));
    }

    try {
      const res = await cancelBookingAction(bookingId, 'Dibatalkan oleh Admin');
      if (res.success) {
        showNotification('success', 'Booking berhasil dibatalkan.');
      } else {
        showNotification('error', res.error || 'Gagal membatalkan booking.');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Kesalahan jaringan saat membatalkan.');
    }
  };

  // 3. Handle Update Product Edit
  const handleSaveProductEdit = async () => {
    if (!selectedProductEdit) return;
    setIsEditingLoading(true);
    try {
      if (productTab === 'PACKAGE') {
        const res = await updatePackageAction(selectedProductEdit.id, {
          title: selectedProductEdit.title,
          price: Number(selectedProductEdit.price),
          description: selectedProductEdit.description,
        });
        if (res.success) {
          setIsEditSaved(true);
          setTimeout(() => setIsEditSaved(false), 3000);
          showNotification('success', 'Perubahan paket berhasil disimpan ke database!');
          setPackages((prev) =>
            prev.map((p) => (p.id === selectedProductEdit.id ? { ...p, ...res.data } : p))
          );
        } else {
          showNotification('error', res.error || 'Gagal memperbarui paket.');
        }
      } else {
        const res = await updateHotelAction(selectedProductEdit.id, {
          name: selectedProductEdit.name,
          price: Number(selectedProductEdit.price),
          location: selectedProductEdit.location,
        });
        if (res.success) {
          setIsEditSaved(true);
          setTimeout(() => setIsEditSaved(false), 3000);
          showNotification('success', 'Perubahan hotel berhasil disimpan ke database!');
          setHotels((prev) =>
            prev.map((h) => (h.id === selectedProductEdit.id ? { ...h, ...res.data } : h))
          );
        } else {
          showNotification('error', res.error || 'Gagal memperbarui hotel.');
        }
      }
    } catch (e: any) {
      showNotification('error', e.message || 'Gagal menyimpan perubahan.');
    } finally {
      setIsEditingLoading(false);
    }
  };

  // 4. Handle Create New Product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingLoading(true);
    
    try {
      if (productTab === 'PACKAGE') {
        if (!newPackageForm.title || !newPackageForm.price) {
          alert('Judul dan harga paket wajib diisi.');
          setIsCreatingLoading(false);
          return;
        }
        
        const res = await createPackageAction(newPackageForm);
        if (res.success && res.data) {
          setPackages((prev) => [res.data, ...prev]);
          setIsCreateModalOpen(false);
          showNotification('success', `Paket "${res.data.title}" berhasil dibuat dan live di website!`);
          setNewPackageForm({
            title: '',
            durationDays: 9,
            price: 29500000,
            description: '',
            imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
            quota: 45,
          });
        } else {
          showNotification('error', res.error || 'Gagal membuat paket baru.');
        }
      } else {
        if (!newHotelForm.name || !newHotelForm.price) {
          alert('Nama dan harga hotel wajib diisi.');
          setIsCreatingLoading(false);
          return;
        }
        
        const res = await createHotelAction(newHotelForm);
        if (res.success && res.data) {
          setHotels((prev) => [res.data, ...prev]);
          setIsCreateModalOpen(false);
          showNotification('success', `Hotel "${res.data.name}" berhasil dibuat dan live di website!`);
          setNewHotelForm({
            name: '',
            location: '',
            price: 1500000,
            description: '',
            imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
            roomsCount: 10,
          });
        } else {
          showNotification('error', res.error || 'Gagal membuat hotel baru.');
        }
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Kesalahan saat menyimpan.');
    } finally {
      setIsCreatingLoading(false);
    }
  };

  const handleWizardSubmit = async (payload: any) => {
    setIsCreatingLoading(true);
    try {
      const res = await createPackageAction(payload);
      if (res.success && res.data) {
        setPackages((prev) => [res.data, ...prev]);
        setIsCreateModalOpen(false);
        showNotification('success', `Paket "${res.data.title}" berhasil disimpan ke database!`);
      } else {
        showNotification('error', res.error || 'Gagal menyimpan paket.');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Terjadi kesalahan saat menyimpan.');
    } finally {
      setIsCreatingLoading(false);
    }
  };

  const handleHotelWizardSubmit = async (payload: any) => {
    setIsCreatingLoading(true);
    try {
      const res = await createHotelAction(payload);
      if (res.success && res.data) {
        setHotels((prev) => [res.data, ...prev]);
        setIsCreateModalOpen(false);
        showNotification('success', `Hotel "${res.data.name}" berhasil disimpan ke database!`);
      } else {
        showNotification('error', res.error || 'Gagal menyimpan hotel.');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Terjadi kesalahan saat menyimpan.');
    } finally {
      setIsCreatingLoading(false);
    }
  };

  const handleCreatePromo = async () => {
    if (!newPromo.code || !newPromo.campaign || newPromo.amount <= 0) {
      showNotification('error', 'Semua kolom promo wajib diisi dengan benar');
      return;
    }
    try {
      const res = await createPromoAction(newPromo);
      if (res.success && res.data) {
        setPromos((prev) => [res.data, ...prev]);
        setIsCreatePromoOpen(false);
        setNewPromo({ code: '', campaign: '', type: 'PERCENTAGE', amount: 0, isActive: true });
        showNotification('success', 'Promo berhasil dibuat!');
      } else {
        showNotification('error', res.error || 'Gagal membuat promo');
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleDeletePromo = async (id: string) => {
    if (confirm('Yakin ingin menghapus promo ini?')) {
      const res = await deletePromoAction(id);
      if (res.success) {
        setPromos((prev) => prev.filter(p => p.id !== id));
        showNotification('success', 'Promo berhasil dihapus');
      } else {
        showNotification('error', 'Gagal menghapus promo');
      }
    }
  };

  const handleTogglePromo = async (id: string, currentStatus: boolean) => {
    const res = await togglePromoAction(id, !currentStatus);
    if (res.success && res.data) {
      setPromos((prev) => prev.map(p => p.id === id ? res.data : p));
      showNotification('success', 'Status promo diperbarui');
    } else {
      showNotification('error', 'Gagal update status promo');
    }
  };

  const handleOpenChangeRoleModal = (u: any) => {
    if (!isSuperAdmin) {
      showNotification('error', 'Akses ditolak: Hanya Super Admin yang berhak mengubah peran akun pengguna.');
      return;
    }
    setSelectedUserForRole({
      id: u.id,
      name: u.name,
      email: u.email,
      currentRole: u.role,
      newRole: u.role,
    });
  };

  const handleSaveUserRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForRole) return;
    if (!isSuperAdmin) {
      showNotification('error', 'Akses ditolak: Hanya Super Admin yang berhak mengubah peran akun pengguna.');
      return;
    }

    if (selectedUserForRole.currentRole === selectedUserForRole.newRole) {
      setSelectedUserForRole(null);
      return;
    }

    setIsUpdatingRole(true);
    try {
      const res = await updateUserRoleAction(selectedUserForRole.id, selectedUserForRole.newRole);
      if (res.success && res.data) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUserForRole.id ? { ...u, role: selectedUserForRole.newRole } : u
          )
        );
        showNotification(
          'success',
          `Peran ${selectedUserForRole.name} berhasil diubah menjadi ${selectedUserForRole.newRole}!`
        );
        setSelectedUserForRole(null);
      } else {
        showNotification('error', res.error || 'Gagal mengubah peran pengguna');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Terjadi kesalahan sistem');
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const handleDeleteUser = async (id: string, targetRole?: string) => {
    if (targetRole === 'SUPER_ADMIN' && !isSuperAdmin) {
      showNotification('error', 'Hanya Super Admin yang berhak menghapus akun Super Admin.');
      return;
    }
    if (confirm('PERINGATAN: Menghapus user akan menghapus semua data booking, review, dan wishlist mereka! Yakin ingin melanjutkan?')) {
      const res = await deleteUserAction(id);
      if (res.success) {
        setUsers((prev) => prev.filter(u => u.id !== id));
        showNotification('success', 'User berhasil dihapus beserta semua datanya');
      } else {
        showNotification('error', res.error || 'Gagal menghapus user');
      }
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      showNotification('error', 'Akses ditolak: Hanya Super Admin yang berhak mendaftarkan pengguna baru.');
      return;
    }
    if (!newUserForm.name.trim() || !newUserForm.email.trim() || !newUserForm.password) {
      showNotification('error', 'Nama lengkap, email, dan kata sandi wajib diisi.');
      return;
    }
    if (newUserForm.password.length < 6) {
      showNotification('error', 'Kata sandi minimal harus 6 karakter.');
      return;
    }

    setIsCreatingUser(true);
    try {
      const res = await createUserBySuperAdminAction(newUserForm);
      if (res.success && res.data) {
        const addedUser = res.data;
        setUsers((prev) => [
          {
            id: addedUser.id,
            name: addedUser.name,
            email: addedUser.email,
            role: addedUser.role,
            phoneNumber: addedUser.phoneNumber || '-',
            createdAt: addedUser.createdAt ? new Date(addedUser.createdAt).toISOString() : new Date().toISOString(),
            tripsCount: 0,
            totalSpend: 0,
          },
          ...prev,
        ]);
        setStats((prev: any) => ({
          ...prev,
          totalUsers: (prev?.totalUsers || 0) + 1,
        }));
        showNotification('success', `Pengguna ${addedUser.name} berhasil didaftarkan sebagai ${addedUser.role}!`);
        setIsCreateUserModalOpen(false);
        setNewUserForm({
          name: '',
          email: '',
          password: '',
          role: 'USER',
          phoneNumber: '',
        });
      } else {
        showNotification('error', res.error || 'Gagal mendaftarkan pengguna');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Terjadi kesalahan sistem');
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!systemSetting) return;
    setIsSavingSettings(true);
    try {
      const res = await updateSystemSettingAction(systemSetting);
      const resBanks = await saveBankAccountsAction(bankAccounts);
      if (res.success && res.data && resBanks.success) {
        setSystemSetting(res.data);
        if (resBanks.data) setBankAccounts(resBanks.data);
        alert('Pengaturan sistem dan rekening bank berhasil disimpan.');
      } else {
        alert(res.error || resBanks.error || 'Gagal menyimpan pengaturan');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSavingSettings(false);
      router.refresh();
    }
  };

  const addBankAccount = () => {
    setBankAccounts([...bankAccounts, {
      id: Math.random().toString(), // temporary id
      bankName: 'Bank Baru',
      accountNumber: '',
      accountName: '',
      color: '#0F766E',
      logoText: 'BANK'
    }]);
  };

  const updateBankAccount = (index: number, field: string, value: string) => {
    const updated = [...bankAccounts];
    updated[index] = { ...updated[index], [field]: value };
    setBankAccounts(updated);
  };

  const handleBankLogoUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      updateBankAccount(index, 'logoUrl', event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeBankAccount = (index: number) => {
    const updated = [...bankAccounts];
    updated.splice(index, 1);
    setBankAccounts(updated);
  };

  // 5. Export CSV
  const handleExportCSV = () => {
    if (bookings.length === 0) {
      alert('Tidak ada data transaksi untuk diekspor.');
      return;
    }
    const headers = ['Kode Booking', 'Tamu', 'Email', 'No Telepon', 'Tipe Item', 'Nama Produk', 'Total Bayar (IDR)', 'Status Reservasi', 'Metode Bayar', 'Bukti Ada', 'Tanggal'];
    const rows = bookings.map((b) => [
      b.bookingCode || b.id,
      `"${b.guestName || b.user?.name || 'Tamu'}"`,
      b.guestEmail || b.user?.email || '',
      b.guestPhone || b.user?.phoneNumber || '',
      b.itemType || 'TOUR',
      `"${b.title || b.schedule?.package?.title || b.hotel?.name || 'Reservasi'}"`,
      b.totalPrice,
      b.status,
      b.payment?.paymentMethod || 'MANUAL_TRANSFER',
      b.payment?.proofUrl ? 'YA' : 'TIDAK',
      new Date(b.createdAt).toLocaleDateString('id-ID'),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Safara_Bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Bookings for Table
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (bookingStatusFilter !== 'ALL' && b.status !== bookingStatusFilter) {
        return false;
      }
      if (productTypeFilter !== 'ALL' && b.itemType !== productTypeFilter) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const code = (b.bookingCode || b.id || '').toLowerCase();
        const guest = (b.guestName || b.user?.name || '').toLowerCase();
        const email = (b.guestEmail || b.user?.email || '').toLowerCase();
        const prod = (b.title || b.schedule?.package?.title || b.hotel?.name || '').toLowerCase();
        return code.includes(query) || guest.includes(query) || email.includes(query) || prod.includes(query);
      }
      return true;
    });
  }, [bookings, bookingStatusFilter, productTypeFilter, searchQuery]);

  // Pending Verifications Queue
  const pendingQueue = useMemo(() => {
    return bookings.filter((b) => b.status === 'PENDING');
  }, [bookings]);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-[#1E293B] antialiased">
      {/* GLOBAL TOAST NOTIFICATION */}
      {actionNotification && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-4 duration-200">
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold backdrop-blur-md ${
              actionNotification.type === 'success'
                ? 'bg-emerald-900/90 text-emerald-100 border-emerald-700'
                : 'bg-rose-900/90 text-rose-100 border-rose-700'
            }`}
          >
            {actionNotification.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
            )}
            <span>{actionNotification.message}</span>
          </div>
        </div>
      )}

      {/* PROOF RECEIPT LIGHTBOX MODAL */}
      {previewProofUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <span className="font-bold text-xs text-neutral-800">Bukti Transfer Rekening</span>
              <button
                onClick={() => setPreviewProofUrl(null)}
                className="text-neutral-400 hover:text-neutral-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-3 max-h-[75vh] overflow-y-auto rounded-2xl bg-neutral-50 flex items-center justify-center p-2">
              <img src={previewProofUrl} alt="Bukti Transfer" className="max-h-[70vh] w-auto object-contain rounded-xl" />
            </div>
          </div>
        </div>
      )}

      {/* CREATE PRODUCT MODAL */}
      {isCreateModalOpen && productTab === 'PACKAGE' && (
        <CreatePackageWizard 
          onClose={() => setIsCreateModalOpen(false)} 
          onSubmit={handleWizardSubmit} 
        />
      )}

      {isCreateModalOpen && productTab === 'HOTEL' && (
        <CreateHotelWizard 
          onClose={() => setIsCreateModalOpen(false)} 
          onSubmit={handleHotelWizardSubmit} 
        />
      )}

      {/* 1. SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white border-r border-neutral-200 p-5 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-0 max-lg:-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-800 text-white shadow-sm">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <span className="font-['Figtree'] text-lg font-bold tracking-tight text-neutral-900">
                  Safara<span className="text-teal-700"> Admin</span>
                </span>
                <span className="block text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
                  Backoffice Suite
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden text-neutral-400 hover:text-neutral-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="mt-8 space-y-6">
            <div>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Menu Utama
              </span>
              <nav className="mt-2 space-y-1">
                {[
                  { label: 'Dashboard', icon: LayoutDashboard },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setActiveMenu(item.label);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                      activeMenu === item.label
                        ? 'bg-teal-700 text-white shadow-sm shadow-teal-700/20'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Operasional Reservasi
              </span>
              <nav className="mt-2 space-y-1">
                {[
                  { label: 'Manajemen Booking', icon: CalendarCheck, badge: bookings.length },
                  {
                    label: 'Verifikasi Pembayaran',
                    icon: CreditCard,
                    badge: pendingQueue.length,
                    badgeAlert: pendingQueue.length > 0,
                  },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setActiveMenu(item.label);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                      activeMenu === item.label
                        ? 'bg-teal-700 text-white shadow-sm shadow-teal-700/20'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          activeMenu === item.label
                            ? 'bg-white/20 text-white'
                            : item.badgeAlert
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Katalog & Inventaris
              </span>
              <nav className="mt-2 space-y-1">
                {[
                  { label: 'Manajemen Produk', icon: Package },
                  { label: 'Manajemen Promo', icon: Tag },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setActiveMenu(item.label);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                      activeMenu === item.label
                        ? 'bg-teal-700 text-white shadow-sm shadow-teal-700/20'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Pengguna & Laporan
              </span>
              <nav className="mt-2 space-y-1">
                {[
                  { label: 'Manajemen Pelanggan', icon: Users, badge: users.length },
                  { label: 'Laporan & Analisis', icon: TrendingUp },
                  { label: 'Pengaturan Sistem', icon: Settings },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setActiveMenu(item.label);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                      activeMenu === item.label
                        ? 'bg-teal-700 text-white shadow-sm shadow-teal-700/20'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          activeMenu === item.label
                            ? 'bg-white/20 text-white'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-neutral-100 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-800 text-white font-bold text-xs shadow-sm">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-neutral-900 truncate">Administrator</p>
              <span className="text-[10px] text-teal-700 font-semibold">Super Admin Portal</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push('/')}
              className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-neutral-200 bg-neutral-50 py-2 text-[11px] font-bold text-neutral-700 transition hover:bg-neutral-100"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Web Publik</span>
            </button>
            <button
              onClick={() => {
                import('next-auth/react').then(({ signOut }) => signOut({ callbackUrl: '/' }));
              }}
              className="flex-1 rounded-xl bg-rose-50 py-2 text-[11px] font-bold text-rose-700 transition hover:bg-rose-100"
            >
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white/90 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden text-neutral-600 hover:text-neutral-900 p-1"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-teal-700">
                <span>Safara Admin</span>
                <span>/</span>
                <span className="text-neutral-500 font-medium">{activeMenu}</span>
              </div>
              <h1 className="font-['Figtree'] text-xl sm:text-2xl font-bold text-neutral-900">
                {activeMenu}
              </h1>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Search */}
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-xs">
              <Search className="h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Cari booking, nama, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 bg-transparent text-neutral-800 outline-none placeholder:text-neutral-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-neutral-400 hover:text-neutral-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Online Status Pill */}
            <div className="hidden md:flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Database Terhubung</span>
            </div>

            {/* Tambah Produk Quick Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-800 transition"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Tambah Produk</span>
            </button>
          </div>
        </header>

        {/* Page Container */}
        <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
          {/* ============================================================== */}
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {/* ============================================================== */}
          {activeMenu === 'Dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* 4 Metric KPI Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    label: 'Total Pendapatan (GMV)',
                    value: formatIDR(stats?.totalRevenue || 0),
                    desc: 'Realisasi pembayaran terverifikasi',
                    icon: TrendingUp,
                    accent: 'text-teal-700 bg-teal-50',
                  },
                  {
                    label: 'Total Reservasi',
                    value: (stats?.totalBookings || bookings.length).toString(),
                    desc: `${stats?.confirmedBookingsCount || 0} Terkonfirmasi`,
                    icon: CalendarCheck,
                    accent: 'text-blue-700 bg-blue-50',
                  },
                  {
                    label: 'Perlu Verifikasi',
                    value: pendingQueue.length.toString(),
                    desc: 'Menunggu cek bukti transfer',
                    icon: AlertTriangle,
                    accent: pendingQueue.length > 0 ? 'text-amber-700 bg-amber-50' : 'text-neutral-600 bg-neutral-100',
                    alert: pendingQueue.length > 0,
                    onClick: () => setActiveMenu('Verifikasi Pembayaran'),
                  },
                  {
                    label: 'Jemaah & Pelanggan',
                    value: (stats?.totalUsers || users.length).toString(),
                    desc: 'Akun terdaftar di sistem',
                    icon: Users,
                    accent: 'text-purple-700 bg-purple-50',
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    onClick={stat.onClick}
                    className={`rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md ${
                      stat.onClick ? 'cursor-pointer hover:border-teal-600' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        {stat.label}
                      </span>
                      <div className={`p-2.5 rounded-xl ${stat.accent}`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="mt-4 font-['Figtree'] text-2xl sm:text-3xl font-bold text-neutral-900">
                      {stat.value}
                    </div>
                    <div
                      className={`mt-2 flex items-center gap-1.5 text-xs font-semibold ${
                        stat.alert ? 'text-amber-700' : 'text-neutral-500'
                      }`}
                    >
                      {stat.alert && <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />}
                      <span>{stat.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts & Category Split */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.8fr_1fr]">
                {/* Revenue Weekly Bar Chart */}
                <div className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-5">
                    <div>
                      <h3 className="font-['Figtree'] text-base font-bold text-neutral-900">
                        Tren Pendapatan Mingguan
                      </h3>
                      <p className="text-xs text-neutral-500">Volume transaksi booking 7 hari terakhir</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-neutral-400">Realisasi: </span>
                      <span className="font-['Figtree'] text-base font-bold text-teal-700">
                        {formatIDR(stats?.totalRevenue || 0)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 flex h-52 items-end justify-between gap-3 pt-6 px-2">
                    {[
                      { day: 'Sen', amount: 'Rp 4.5M', height: 45 },
                      { day: 'Sel', amount: 'Rp 6.2M', height: 62 },
                      { day: 'Rab', amount: 'Rp 3.1M', height: 31 },
                      { day: 'Kam', amount: 'Rp 8.4M', height: 84 },
                      { day: 'Jum', amount: 'Rp 12.5M', height: 95 },
                      { day: 'Sab', amount: 'Rp 14.2M', height: 100 },
                      { day: 'Min', amount: 'Rp 11.0M', height: 88 },
                    ].map((d) => (
                      <div key={d.day} className="flex flex-1 flex-col items-center gap-2 group">
                        <div className="text-[10px] font-bold text-teal-700 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                          {d.amount}
                        </div>
                        <div
                          className="w-full rounded-xl bg-teal-700 transition-all group-hover:bg-teal-800"
                          style={{ height: `${d.height}%` }}
                        />
                        <span className="text-xs font-bold text-neutral-500">{d.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Split */}
                <div className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-['Figtree'] text-base font-bold text-neutral-900">
                      Distribusi Kategori
                    </h3>
                    <p className="text-xs text-neutral-500">Komposisi paket perjalanan vs reservasi hotel</p>
                    <div className="mt-6 space-y-5 text-xs">
                      <div>
                        <div className="flex justify-between font-bold">
                          <span>Paket Umrah & Wisata Halal</span>
                          <span className="text-teal-700">65%</span>
                        </div>
                        <div className="mt-1.5 h-2.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                          <div className="h-full rounded-full bg-teal-700" style={{ width: '65%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between font-bold">
                          <span>Hotel & Resort Mewah</span>
                          <span className="text-teal-500">35%</span>
                        </div>
                        <div className="mt-1.5 h-2.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                          <div className="h-full rounded-full bg-teal-500" style={{ width: '35%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/60 p-4 text-xs text-teal-900">
                    <span className="font-bold flex items-center gap-1.5 text-teal-800 mb-1">
                      <ShieldCheck className="h-4 w-4" /> Insight Safara:
                    </span>
                    <p className="text-[11px] text-teal-700 leading-relaxed">
                      Jemaah yang mengunggah bukti transfer terverifikasi rata-rata disetujui dalam 15 menit.
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Bookings Table on Dashboard */}
              <div className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-['Figtree'] text-lg font-bold text-neutral-900">
                      Reservasi Terbaru
                    </h3>
                    <p className="text-xs text-neutral-500">Pemesanan yang baru saja masuk ke sistem</p>
                  </div>
                  <button
                    onClick={() => setActiveMenu('Manajemen Booking')}
                    className="flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800"
                  >
                    <span>Lihat Semua ({bookings.length})</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-100 bg-neutral-50/80 text-neutral-400 uppercase tracking-wider">
                        <th className="py-3 px-4 font-bold">KODE & TAMU</th>
                        <th className="py-3 px-4 font-bold">PRODUK</th>
                        <th className="py-3 px-4 font-bold">STATUS</th>
                        <th className="py-3 px-4 text-center font-bold">BUKTI TRANSFER</th>
                        <th className="py-3 px-4 text-right font-bold">TOTAL BIAYA</th>
                        <th className="py-3 px-4 text-center font-bold">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {bookings.slice(0, 5).map((row) => (
                        <tr key={row.id} className="hover:bg-neutral-50/80 transition">
                          <td className="py-4 px-4">
                            <p className="font-bold text-sm text-neutral-900">
                              {row.guestName || row.user?.name || 'Tamu Safara'}
                            </p>
                            <span className="font-mono text-[11px] text-teal-700 font-semibold">
                              #{row.bookingCode || row.id.slice(0, 8).toUpperCase()}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-semibold text-neutral-800 line-clamp-1">
                              {row.title || row.schedule?.package?.title || row.hotel?.name || 'Paket Safara'}
                            </p>
                            <span className="text-[11px] text-neutral-400">
                              {formatDate(row.createdAt)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold border ${
                                row.status === 'CONFIRMED'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : row.status === 'PENDING'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              {row.status === 'CONFIRMED' ? 'Terkonfirmasi' : row.status === 'PENDING' ? 'Menunggu' : 'Batal'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            {row.payment?.proofUrl ? (
                              <button
                                type="button"
                                onClick={() => setPreviewProofUrl(row.payment.proofUrl)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 text-[11px] font-bold hover:bg-teal-100"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>Lihat Bukti</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-neutral-400 italic">Belum ada</span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right font-mono font-bold text-sm text-neutral-900">
                            {formatIDR(Number(row.totalPrice))}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => {
                                setSelectedBooking(row);
                                setActiveMenu('Manajemen Booking');
                              }}
                              className="rounded-xl border border-neutral-200 px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition"
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* System Audit Log on Dashboard */}
              <div className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-['Figtree'] text-lg font-bold text-neutral-900">
                      Aktivitas Sistem (Audit Log)
                    </h3>
                    <p className="text-xs text-neutral-500">Log aktivitas semua akun admin dan karyawan</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {auditLogs.slice(0, 8).map((log: any) => (
                    <div key={log.id} className="flex items-center justify-between border-b border-neutral-50 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${
                          log.action.includes('DELETE') ? 'bg-rose-100 text-rose-600' :
                          log.action.includes('UPDATE') ? 'bg-blue-100 text-blue-600' :
                          'bg-emerald-100 text-emerald-600'
                        }`}>
                          {log.action.includes('DELETE') ? <XCircle className="h-4 w-4" /> :
                           log.action.includes('UPDATE') ? <RefreshCw className="h-4 w-4" /> :
                           <CheckCircle2 className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-900">
                            {log.details || `Aktivitas pada ${log.entityType}`}
                          </p>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            Oleh: <span className="font-semibold text-neutral-700">{log.userName || 'Sistem'}</span> (Aksi: {log.action})
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-mono text-neutral-400">{formatDate(log.createdAt)}</span>
                        <span className="text-[10px] font-bold text-neutral-400 mt-1 uppercase">ID: {log.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  ))}
                  {auditLogs.length === 0 && (
                    <div className="py-4 text-center text-xs text-neutral-400">Belum ada log aktivitas sistem tercatat.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: MANAJEMEN BOOKING */}
          {/* ============================================================== */}
          {activeMenu === 'Manajemen Booking' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0">
                  {[
                    { label: 'Semua', value: 'ALL', count: bookings.length },
                    { label: 'Menunggu', value: 'PENDING', count: pendingQueue.length },
                    {
                      label: 'Terkonfirmasi',
                      value: 'CONFIRMED',
                      count: bookings.filter((b) => b.status === 'CONFIRMED').length,
                    },
                    {
                      label: 'Dibatalkan',
                      value: 'CANCELLED',
                      count: bookings.filter((b) => b.status === 'CANCELLED').length,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setBookingStatusFilter(tab.value as any)}
                      className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                        bookingStatusFilter === tab.value
                          ? 'bg-teal-700 text-white shadow-sm'
                          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                          bookingStatusFilter === tab.value ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-600'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2.5">
                  <select
                    value={productTypeFilter}
                    onChange={(e) => setProductTypeFilter(e.target.value as any)}
                    className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-bold text-neutral-700 outline-none"
                  >
                    <option value="ALL">Semua Kategori</option>
                    <option value="TOUR">Paket Umrah/Tour</option>
                    <option value="HOTEL">Hotel & Resort</option>
                  </select>

                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 shadow-sm transition"
                  >
                    <Download className="h-4 w-4" />
                    <span>Ekspor CSV</span>
                  </button>
                </div>
              </div>

              {/* Main Content: Table + Slideover Drawer */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.7fr_1.3fr]">
                {/* Bookings Table */}
                <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-['Figtree'] text-base font-bold text-neutral-900">
                      Daftar Reservasi Masuk ({filteredBookings.length})
                    </h3>
                    <span className="text-xs text-neutral-400">Pilih baris untuk melihat detail</span>
                  </div>

                  <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="sticky top-0 bg-neutral-50 border-b border-neutral-200 text-neutral-400 uppercase tracking-wider">
                        <tr>
                          <th className="py-3 px-3 font-bold">KODE & TAMU</th>
                          <th className="py-3 px-3 font-bold">PRODUK</th>
                          <th className="py-3 px-3 font-bold">STATUS</th>
                          <th className="py-3 px-3 text-right font-bold">BIAYA</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {filteredBookings.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-12 text-center text-neutral-400">
                              Tidak ada reservasi yang sesuai dengan filter.
                            </td>
                          </tr>
                        ) : (
                          filteredBookings.map((b) => (
                            <tr
                              key={b.id}
                              onClick={() => setSelectedBooking(b)}
                              className={`cursor-pointer transition ${
                                selectedBooking?.id === b.id
                                  ? 'bg-teal-50/70 border-l-4 border-teal-700'
                                  : 'hover:bg-neutral-50'
                              }`}
                            >
                              <td className="py-3.5 px-3">
                                <p className="font-bold text-neutral-900">
                                  {b.guestName || b.user?.name || 'Tamu Safara'}
                                </p>
                                <span className="font-mono text-[11px] font-semibold text-teal-700">
                                  #{b.bookingCode || b.id.slice(0, 8).toUpperCase()}
                                </span>
                              </td>
                              <td className="py-3.5 px-3">
                                <p className="font-medium text-neutral-800 line-clamp-1">
                                  {b.title || b.schedule?.package?.title || b.hotel?.name || 'Reservasi'}
                                </p>
                                <span className="text-[10px] text-neutral-400">
                                  {formatDate(b.createdAt)}
                                </span>
                              </td>
                              <td className="py-3.5 px-3">
                                <span
                                  className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                    b.status === 'CONFIRMED'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : b.status === 'PENDING'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {b.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-3 text-right font-mono font-bold text-neutral-900">
                                {formatIDR(Number(b.totalPrice))}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Detail Booking Drawer Card */}
                <div className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm flex flex-col justify-between">
                  {selectedBooking ? (
                    <div className="space-y-6">
                      <div className="border-b border-neutral-100 pb-4">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-teal-700">
                            #{selectedBooking.bookingCode || selectedBooking.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              selectedBooking.status === 'CONFIRMED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : selectedBooking.status === 'PENDING'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            ● {selectedBooking.status}
                          </span>
                        </div>
                        <h3 className="mt-2 font-['Figtree'] text-xl font-bold text-neutral-900">
                          {selectedBooking.guestName || selectedBooking.user?.name || 'Tamu'}
                        </h3>
                        <p className="text-xs text-neutral-500">
                          Dipesan pada {formatDate(selectedBooking.createdAt)}
                        </p>
                      </div>

                      {/* Bukti Transfer Box */}
                      {selectedBooking.payment?.proofUrl ? (
                        <div className="rounded-2xl border border-teal-200 bg-[#F0FDFA] p-3.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block mb-2">
                            Bukti Transfer Pengguna:
                          </span>
                          <div className="flex items-center gap-3">
                            <div
                              onClick={() => setPreviewProofUrl(selectedBooking.payment.proofUrl)}
                              className="h-14 w-14 shrink-0 rounded-xl overflow-hidden border border-teal-200 bg-white cursor-pointer group"
                            >
                              <img
                                src={selectedBooking.payment.proofUrl}
                                alt="Struk Transfer"
                                className="h-full w-full object-cover group-hover:scale-105 transition"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-bold text-neutral-800 block truncate">
                                {selectedBooking.payment.senderBank || 'Transfer Bank'}
                              </span>
                              <span className="text-[11px] text-neutral-500 block truncate">
                                a.n. {selectedBooking.payment.senderName || selectedBooking.guestName}
                              </span>
                              <button
                                type="button"
                                onClick={() => setPreviewProofUrl(selectedBooking.payment.proofUrl)}
                                className="text-[11px] text-teal-700 font-bold hover:underline mt-0.5 inline-block"
                              >
                                Perbesar Foto Bukti →
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                          ⚠️ Belum ada bukti transfer yang diunggah oleh pemesan.
                        </div>
                      )}

                      {/* Customer Info Box */}
                      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4 space-y-2.5 text-xs">
                        <div className="flex items-center gap-2 text-neutral-600">
                          <Mail className="h-4 w-4 text-neutral-400" />
                          <span>{selectedBooking.guestEmail || selectedBooking.user?.email || '-'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-600">
                          <Phone className="h-4 w-4 text-neutral-400" />
                          <span>{selectedBooking.guestPhone || selectedBooking.user?.phoneNumber || '-'}</span>
                        </div>
                        {selectedBooking.specialRequest && (
                          <div className="mt-2 pt-2 border-t border-neutral-200 text-neutral-600">
                            <span className="font-bold block text-neutral-700">Permintaan Khusus:</span>
                            <p className="italic">{selectedBooking.specialRequest}</p>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="space-y-2.5 text-xs border-y border-neutral-100 py-4">
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Produk:</span>
                          <span className="font-bold text-neutral-900 text-right">
                            {selectedBooking.title || selectedBooking.schedule?.package?.title || selectedBooking.hotel?.name || '-'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Metode Bayar:</span>
                          <span className="font-semibold text-neutral-800">
                            {selectedBooking.payment?.paymentMethod || 'Manual Transfer'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-neutral-100">
                          <span className="text-neutral-700 font-bold">Total Pembayaran:</span>
                          <span className="font-mono text-base font-bold text-teal-700">
                            {formatIDR(Number(selectedBooking.totalPrice))}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2.5 pt-2">
                        {selectedBooking.status === 'PENDING' && (
                          <div className="space-y-3">
                            {!systemSetting?.supplierApiActive && !systemSetting?.useSafaraCodeOnly && selectedBooking.itemType === 'HOTEL' && (
                              <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 space-y-3">
                                <div>
                                  <span className="font-bold text-rose-900 text-xs flex items-center gap-1.5 mb-1">
                                    <AlertTriangle className="h-3.5 w-3.5" />
                                    Booking Hotel Manual Diperlukan
                                  </span>
                                  <p className="text-[11px] text-rose-700 leading-snug">
                                    Integrasi API otomatis sedang dinonaktifkan. Pastikan Anda telah memesan hotel ini secara manual sebelum memverifikasi.
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <div>
                                    <label className="text-[10px] font-bold text-rose-900 uppercase tracking-wider block mb-1">Kode Voucher / Konfirmasi Hotel (Opsional)</label>
                                    <input 
                                      type="text" 
                                      placeholder="Misal: H-89921 / Agoda-1234"
                                      className="w-full text-xs p-2 rounded-lg border border-rose-200 outline-none focus:border-rose-400"
                                      value={verifySupplierCode}
                                      onChange={(e) => setVerifySupplierCode(e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold text-rose-900 uppercase tracking-wider block mb-1">Upload File Voucher Asli (Opsional)</label>
                                    <label className="flex items-center gap-2 w-full text-xs p-2 rounded-lg border border-rose-200 bg-white cursor-pointer hover:bg-rose-50 transition text-rose-700">
                                      <UploadCloud className="h-4 w-4" />
                                      <span className="truncate">{verifySupplierVoucher ? 'File Dipilih (Siap Upload)' : 'Pilih File (PDF/Gambar)...'}</span>
                                      <input 
                                        type="file" 
                                        accept=".pdf,image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (!file) return;
                                          if (file.size > 2 * 1024 * 1024) {
                                            alert('Maksimal 2MB!');
                                            return;
                                          }
                                          const reader = new FileReader();
                                          reader.onload = (ev) => {
                                            setVerifySupplierVoucher(ev.target?.result as string);
                                          };
                                          reader.readAsDataURL(file);
                                        }}
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            )}
                            <button
                              onClick={() => handleVerifyBooking(selectedBooking.id)}
                              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-teal-700 py-3 font-bold text-white shadow-md shadow-teal-700/20 hover:bg-teal-800 transition"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Verifikasi & Setujui Booking</span>
                            </button>
                          </div>
                        )}

                        <div className="flex gap-2">
                          {selectedBooking.status !== 'PENDING' && selectedBooking.status !== 'CANCELLED' && (
                            <>
                              <a
                                href={`/invoice?code=${selectedBooking.bookingCode || selectedBooking.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition"
                              >
                                <FileText className="h-3.5 w-3.5" />
                                <span>Cetak Invoice</span>
                              </a>

                              {selectedBooking.guestPhone && (
                                <a
                                  href={`https://wa.me/${selectedBooking.guestPhone.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(
                                    selectedBooking.guestName || 'Bpk/Ibu'
                                  )},%20kami%20dari%20Safara%20Travel%20terkait%20pesanan%20${selectedBooking.bookingCode}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition"
                                >
                                  Kirim WA
                                </a>
                              )}
                            </>
                          )}

                          {selectedBooking.status !== 'CANCELLED' && (
                            <button
                              onClick={() => handleCancelBooking(selectedBooking.id)}
                              className="flex-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
                            >
                              Batalkan
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-16 text-center text-neutral-400">
                      <CalendarCheck className="h-12 w-12 text-neutral-300 mb-3" />
                      <p className="font-bold text-neutral-600">Pilih salah satu reservasi</p>
                      <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                        Klik pada baris tabel di samping untuk memeriksa bukti transfer, data tamu, atau menyetujui reservasi.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: VERIFIKASI PEMBAYARAN (FINANCE QUEUE) */}
          {/* ============================================================== */}
          {activeMenu === 'Verifikasi Pembayaran' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-5 mb-6">
                  <div>
                    <h3 className="font-['Figtree'] text-lg font-bold text-neutral-900">
                      Antrean Verifikasi Pembayaran Masuk
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Periksa mutasi transfer rekening bank & setujui reservasi untuk menerbitkan tiket
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-50 border border-amber-200 px-3.5 py-1 text-xs font-bold text-amber-800">
                    ● {pendingQueue.length} Menunggu Tindakan
                  </span>
                </div>

                {pendingQueue.length === 0 ? (
                  <div className="py-16 text-center">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                    <h4 className="font-bold text-neutral-800 text-base">Semua Pembayaran Telah Diverifikasi</h4>
                    <p className="text-xs text-neutral-500 mt-1">
                      Tidak ada antrean pembayaran pending yang memerlukan persetujuan saat ini.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingQueue.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 rounded-2xl border border-neutral-200 p-5 bg-neutral-50/50 hover:bg-white hover:shadow-md transition"
                      >
                        <div className="flex items-start gap-4">
                          {/* Bukti Transfer Thumbnail */}
                          {item.payment?.proofUrl ? (
                            <div
                              onClick={() => setPreviewProofUrl(item.payment.proofUrl)}
                              className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden border border-teal-200 bg-white cursor-pointer group shadow-sm"
                            >
                              <img
                                src={item.payment.proofUrl}
                                alt="Bukti Transfer"
                                className="h-full w-full object-cover group-hover:scale-105 transition"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                <Eye className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 font-bold text-xs">
                              No Pic
                            </div>
                          )}

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-teal-700">
                                #{item.bookingCode || item.id.slice(0, 8).toUpperCase()}
                              </span>
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                                Menunggu Verifikasi
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-neutral-900">
                              {item.guestName || item.user?.name || 'Tamu Safara'}
                            </h4>
                            <p className="text-xs text-neutral-500">
                              {item.title || item.schedule?.package?.title || item.hotel?.name || 'Paket Safara'} ·{' '}
                              {formatDate(item.createdAt)}
                            </p>
                            {item.payment?.senderName && (
                              <p className="text-[11px] text-teal-700 font-medium">
                                Pengirim: {item.payment.senderName} ({item.payment.senderBank || 'Transfer Bank'})
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-200">
                          <div className="text-left md:text-right">
                            <span className="text-[10px] text-neutral-400 block font-bold uppercase">
                              Nilai Transfer
                            </span>
                            <span className="font-mono text-base font-bold text-neutral-900">
                              {formatIDR(Number(item.totalPrice))}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.payment?.proofUrl && (
                              <button
                                type="button"
                                onClick={() => setPreviewProofUrl(item.payment.proofUrl)}
                                className="rounded-xl border border-neutral-200 px-3 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition"
                              >
                                Lihat Bukti
                              </button>
                            )}
                            <button
                              onClick={() => handleVerifyBooking(item.id)}
                              className="flex items-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-teal-700/20 hover:bg-teal-800 transition"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Setujui Pembayaran</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: MANAJEMEN PRODUK */}
          {/* ============================================================== */}
          {activeMenu === 'Manajemen Produk' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-2xl">
                  <button
                    onClick={() => {
                      setProductTab('PACKAGE');
                      setSelectedProductEdit(packages[0] || null);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                      productTab === 'PACKAGE' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600'
                    }`}
                  >
                    <Plane className="h-4 w-4" />
                    <span>Paket Umrah & Wisata ({packages.length})</span>
                  </button>
                  <button
                    onClick={() => {
                      setProductTab('HOTEL');
                      setSelectedProductEdit(hotels[0] || null);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                      productTab === 'HOTEL' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600'
                    }`}
                  >
                    <Building className="h-4 w-4" />
                    <span>Hotel & Resort ({hotels.length})</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-800 transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Produk</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.7fr_1.3fr]">
                <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm space-y-3">
                  <h3 className="font-['Figtree'] text-base font-bold text-neutral-900 mb-2">
                    {productTab === 'PACKAGE' ? 'Katalog Paket Wisata' : 'Daftar Hotel Terdaftar'}
                  </h3>

                  <div className="space-y-3 max-h-[580px] overflow-y-auto">
                    {productTab === 'PACKAGE'
                      ? packages.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => setSelectedProductEdit(p)}
                            className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition ${
                              selectedProductEdit?.id === p.id
                                ? 'border-teal-700 bg-teal-50/50'
                                : 'border-neutral-200 bg-white hover:bg-neutral-50'
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <img
                                src={p.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=400&q=80'}
                                alt={p.title}
                                className="h-12 w-16 rounded-xl object-cover"
                              />
                              <div>
                                <h4 className="font-bold text-xs text-neutral-900 line-clamp-1">{p.title}</h4>
                                <span className="text-[11px] text-neutral-500 font-medium">{p.durationDays} Hari</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-mono text-xs font-bold text-teal-700">
                                {formatIDR(Number(p.price))}
                              </span>
                              <span className="block text-[10px] font-bold text-emerald-700">Aktif di Web</span>
                            </div>
                          </div>
                        ))
                      : hotels.map((h) => (
                          <div
                            key={h.id}
                            onClick={() => setSelectedProductEdit(h)}
                            className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition ${
                              selectedProductEdit?.id === h.id
                                ? 'border-teal-700 bg-teal-50/50'
                                : 'border-neutral-200 bg-white hover:bg-neutral-50'
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <img
                                src={h.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'}
                                alt={h.name}
                                className="h-12 w-16 rounded-xl object-cover"
                              />
                              <div>
                                <h4 className="font-bold text-xs text-neutral-900 line-clamp-1">{h.name}</h4>
                                <span className="text-[11px] text-neutral-500 font-medium">{h.location}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-mono text-xs font-bold text-teal-700">
                                {formatIDR(Number(h.price))}
                              </span>
                              <span className="block text-[10px] font-bold text-emerald-700">
                                {h.rooms?.length || 0} Tipe Kamar
                              </span>
                            </div>
                          </div>
                        ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm">
                  {selectedProductEdit ? (
                    <div className="space-y-5 text-xs">
                      <div className="border-b border-neutral-100 pb-4">
                        {isEditSaved && (
                          <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 animate-in fade-in">
                            ✓ Perubahan tersimpan ke database
                          </span>
                        )}
                        <h3 className="mt-2 font-['Figtree'] text-lg font-bold text-neutral-900">
                          Edit Detail Produk
                        </h3>
                        <p className="text-xs text-neutral-500">
                          Perubahan langsung aktif dan terlihat oleh pelanggan di website
                        </p>
                      </div>

                      <div>
                        <label className="block text-neutral-700 font-bold mb-1.5">Nama Produk</label>
                        <input
                          type="text"
                          value={selectedProductEdit.title || selectedProductEdit.name || ''}
                          onChange={(e) =>
                            setSelectedProductEdit({
                              ...selectedProductEdit,
                              title: e.target.value,
                              name: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-neutral-900 outline-none focus:border-teal-600 focus:bg-white transition"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-700 font-bold mb-1.5">
                          {productTab === 'PACKAGE' ? 'Deskripsi Ringkas' : 'Lokasi / Alamat Hotel'}
                        </label>
                        <textarea
                          rows={3}
                          value={selectedProductEdit.description || selectedProductEdit.location || ''}
                          onChange={(e) =>
                            setSelectedProductEdit({
                              ...selectedProductEdit,
                              description: e.target.value,
                              location: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-neutral-900 outline-none focus:border-teal-600 focus:bg-white transition resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-700 font-bold mb-1.5">Tarif / Harga Dasar (IDR)</label>
                        <input
                          type="number"
                          value={selectedProductEdit.price || ''}
                          onChange={(e) =>
                            setSelectedProductEdit({
                              ...selectedProductEdit,
                              price: Number(e.target.value),
                            })
                          }
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 font-mono font-bold text-teal-700 outline-none focus:border-teal-600 focus:bg-white transition"
                        />
                      </div>

                      <button
                        onClick={handleSaveProductEdit}
                        disabled={isEditingLoading}
                        className="w-full rounded-2xl bg-teal-700 py-3.5 font-bold text-white shadow-md shadow-teal-700/20 hover:bg-teal-800 disabled:opacity-50 transition"
                      >
                        {isEditingLoading ? 'Menyimpan ke Database...' : 'Simpan Perubahan ke Database'}
                      </button>
                    </div>
                  ) : (
                    <div className="py-16 text-center text-neutral-400">
                      Pilih produk di samping untuk mengedit detail.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: MANAJEMEN PELANGGAN */}
          {/* ============================================================== */}
          {activeMenu === 'Manajemen Pelanggan' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5 mb-6">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-['Figtree'] text-lg font-bold text-neutral-900">
                        Basis Data Pelanggan & Jemaah Terdaftar
                      </h3>
                      {isSuperAdmin && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold text-rose-700">
                          <Shield className="h-3 w-3 text-rose-600" />
                          Super Admin Mode
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Total {users.length} akun jemaah tersinkronisasi dari database PostgreSQL
                    </p>
                  </div>

                  <div>
                    {isSuperAdmin ? (
                      <button
                        id="btn-tambah-pengguna"
                        onClick={() => setIsCreateUserModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-[#0F766E] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-900/10 hover:bg-[#0D655E] transition active:scale-95 cursor-pointer"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Tambah Pengguna Baru</span>
                      </button>
                    ) : (
                      <div
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium"
                        title="Hanya Super Admin yang berhak mendaftarkan akun baru"
                      >
                        <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
                        <span>Tambah Pengguna (Khusus Super Admin)</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-100 bg-neutral-50 text-neutral-400 uppercase tracking-wider">
                        <th className="py-3 px-4 font-bold">NAMA & EMAIL</th>
                        <th className="py-3 px-4 font-bold">NO. TELEPON</th>
                        <th className="py-3 px-4 font-bold">PERAN</th>
                        <th className="py-3 px-4 text-center font-bold">TRIP SELESAI</th>
                        <th className="py-3 px-4 text-right font-bold">LIFETIME VALUE (SPEND)</th>
                        <th className="py-3 px-4 text-center font-bold">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-neutral-50 transition">
                          <td className="py-4 px-4">
                            <p className="font-bold text-sm text-neutral-900">{u.name}</p>
                            <span className="text-[11px] text-neutral-500">{u.email}</span>
                          </td>
                          <td className="py-4 px-4 font-mono text-neutral-700">{u.phoneNumber}</td>
                          <td className="py-4 px-4">
                            <button
                              type="button"
                              onClick={() => isSuperAdmin && handleOpenChangeRoleModal(u)}
                              disabled={!isSuperAdmin}
                              className={`group inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition ${
                                u.role === 'SUPER_ADMIN'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : u.role === 'ADMIN'
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                  : 'bg-neutral-100 text-neutral-700'
                              } ${isSuperAdmin ? 'hover:ring-2 hover:ring-teal-500/40 cursor-pointer' : 'cursor-default'}`}
                              title={isSuperAdmin ? 'Klik untuk mengubah peran pengguna ini' : undefined}
                            >
                              <span>{u.role === 'SUPER_ADMIN' ? 'SUPER ADMIN' : u.role}</span>
                              {isSuperAdmin && (
                                <ShieldCheck className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                              )}
                            </button>
                          </td>
                          <td className="py-4 px-4 text-center font-bold text-neutral-800">{u.tripsCount || 0}</td>
                          <td className="py-4 px-4 text-right font-mono font-bold text-teal-700 text-sm">
                            {formatIDR(u.totalSpend || 0)}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {u.phoneNumber && u.phoneNumber !== '-' ? (
                                <a
                                  href={`https://wa.me/${u.phoneNumber.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-xl border border-neutral-200 px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
                                >
                                  WA
                                </a>
                              ) : (
                                <span className="text-neutral-400 w-8">-</span>
                              )}
                              <button
                                onClick={() => handleOpenChangeRoleModal(u)}
                                disabled={!isSuperAdmin}
                                className={`rounded-xl border px-2.5 py-1.5 text-xs font-bold transition flex items-center gap-1 ${
                                  isSuperAdmin
                                    ? 'border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 cursor-pointer shadow-sm'
                                    : 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed opacity-50'
                                }`}
                                title={isSuperAdmin ? 'Ubah Peran (Role)' : 'Hanya Super Admin yang dapat mengubah peran'}
                              >
                                <ShieldCheck className="h-3.5 w-3.5" />
                                <span className="text-[11px] font-semibold">Ubah Role</span>
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id, u.role)}
                                disabled={u.role === 'SUPER_ADMIN' && !isSuperAdmin}
                                className={`rounded-xl border px-2 py-1.5 text-xs font-bold transition ${
                                  u.role === 'SUPER_ADMIN' && !isSuperAdmin
                                    ? 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed opacity-50'
                                    : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer'
                                }`}
                                title={u.role === 'SUPER_ADMIN' && !isSuperAdmin ? 'Hanya Super Admin yang dapat menghapus Super Admin' : 'Hapus Akun'}
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 6: LAPORAN & ANALISIS */}
          {/* ============================================================== */}
          {activeMenu === 'Laporan & Analisis' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    TOTAL GROSS REVENUE
                  </span>
                  <div className="mt-2 font-['Figtree'] text-2xl font-bold text-neutral-900">
                    {formatIDR(stats?.totalRevenue || 0)}
                  </div>
                  <span className="text-xs font-bold text-emerald-700">+14,2% vs bulan sebelumnya</span>
                </div>

                <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    RESERVASI SUKSES
                  </span>
                  <div className="mt-2 font-['Figtree'] text-2xl font-bold text-neutral-900">
                    {stats?.confirmedBookingsCount || 0} Transaksi
                  </div>
                  <span className="text-xs font-bold text-emerald-700">Tingkat konversi 92%</span>
                </div>

                <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    RATA-RATA ORDER VALUE (AOV)
                  </span>
                  <div className="mt-2 font-['Figtree'] text-2xl font-bold text-neutral-900">
                    {formatIDR(
                      stats?.confirmedBookingsCount
                        ? (stats?.totalRevenue || 0) / stats.confirmedBookingsCount
                        : 29500000
                    )}
                  </div>
                  <span className="text-xs font-bold text-neutral-500">Per transaksi berhasil</span>
                </div>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-['Figtree'] text-lg font-bold text-neutral-900">
                      Rekapitulasi Keuangan
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Data transaksi telah disinkronkan dengan database Supabase
                    </p>
                  </div>
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-800 transition"
                  >
                    <Download className="h-4 w-4" />
                    <span>Unduh Laporan Transaksi (CSV)</span>
                  </button>
                </div>
              </div>

              {/* Aktivitas Terkini / Audit Log */}
              <div className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-5 mb-6">
                  <div>
                    <h3 className="font-['Figtree'] text-base font-bold text-neutral-900">
                      Log Aktivitas (Audit Log)
                    </h3>
                    <p className="text-xs text-neutral-500">Rekam jejak transaksi yang masuk secara real-time</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {bookings.slice(0, 10).map((booking: any) => (
                    <div key={booking.id} className="flex items-center justify-between border-b border-neutral-50 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${
                          booking.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-600' :
                          booking.status === 'CANCELLED' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                          {booking.status === 'CONFIRMED' ? <CheckCircle2 className="h-4 w-4" /> :
                           booking.status === 'CANCELLED' ? <XCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-900">
                            {booking.status === 'CONFIRMED' ? 'Pembayaran Dikonfirmasi' :
                             booking.status === 'CANCELLED' ? 'Reservasi Dibatalkan' : 'Reservasi Baru Masuk'}
                          </p>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            <span className="font-bold text-neutral-700">{booking.guestName || booking.user?.name || 'Tamu'}</span> untuk {booking.title || booking.hotel?.name || 'Paket'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-mono text-neutral-400">{formatDate(booking.createdAt)}</span>
                        <span className="text-[10px] font-bold text-neutral-400 mt-1 uppercase">#{booking.bookingCode || booking.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  ))}
                  {bookings.length === 0 && (
                    <div className="py-4 text-center text-xs text-neutral-400">Belum ada log aktivitas tercatat.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 7: MANAJEMEN PROMO */}
          {/* ============================================================== */}
          {activeMenu === 'Manajemen Promo' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-['Figtree'] text-lg font-bold text-neutral-900 mb-2">
                      Voucher & Kupon Promo Aktif
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Kelola kode promo diskon untuk kampanye umrah dan liburan
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCreatePromoOpen(!isCreatePromoOpen)}
                    className="flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-teal-800 transition"
                  >
                    {isCreatePromoOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    <span>{isCreatePromoOpen ? 'Tutup Form' : 'Tambah Promo Baru'}</span>
                  </button>
                </div>

                {isCreatePromoOpen && (
                  <div className="mb-6 p-5 bg-neutral-50 rounded-2xl border border-neutral-100 flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">Kode Voucher</label>
                      <input
                        type="text"
                        placeholder="Contoh: SAFARA20"
                        value={newPromo.code}
                        onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                        className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-teal-700 font-mono"
                      />
                    </div>
                    <div className="flex-1 w-full space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">Nama Kampanye</label>
                      <input
                        type="text"
                        placeholder="Contoh: Diskon Awal Tahun"
                        value={newPromo.campaign}
                        onChange={(e) => setNewPromo({ ...newPromo, campaign: e.target.value })}
                        className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-teal-700"
                      />
                    </div>
                    <div className="w-full md:w-32 space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">Tipe</label>
                      <select
                        value={newPromo.type}
                        onChange={(e) => setNewPromo({ ...newPromo, type: e.target.value })}
                        className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-teal-700"
                      >
                        <option value="PERCENTAGE">Persen (%)</option>
                        <option value="FIXED">Nominal (Rp)</option>
                      </select>
                    </div>
                    <div className="flex-1 w-full space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">Nilai Diskon</label>
                      <input
                        type="number"
                        placeholder="10 atau 1500000"
                        value={newPromo.amount || ''}
                        onChange={(e) => setNewPromo({ ...newPromo, amount: Number(e.target.value) })}
                        className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-teal-700"
                      />
                    </div>
                    <button
                      onClick={handleCreatePromo}
                      className="w-full md:w-auto rounded-xl bg-teal-700 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-800 transition"
                    >
                      Simpan
                    </button>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-100 bg-neutral-50 text-neutral-400 uppercase tracking-wider">
                        <th className="py-3 px-4 font-bold">KODE VOUCHER</th>
                        <th className="py-3 px-4 font-bold">KAMPANYE</th>
                        <th className="py-3 px-4 font-bold">DISKON</th>
                        <th className="py-3 px-4 font-bold">STATUS</th>
                        <th className="py-3 px-4 font-bold text-right">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {promos.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-neutral-400">
                            Belum ada promo yang dibuat.
                          </td>
                        </tr>
                      ) : (
                        promos.map((promo) => (
                          <tr key={promo.id} className="hover:bg-neutral-50 transition">
                            <td className="py-4 px-4 font-mono font-bold text-teal-700">{promo.code}</td>
                            <td className="py-4 px-4 font-semibold text-neutral-800">{promo.campaign}</td>
                            <td className="py-4 px-4">
                              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                                {promo.type === 'PERCENTAGE' ? `${promo.amount}%` : formatIDR(promo.amount)}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <button
                                onClick={() => handleTogglePromo(promo.id, promo.isActive)}
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                  promo.isActive ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
                                }`}
                              >
                                ● {promo.isActive ? 'Aktif' : 'Nonaktif'}
                              </button>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => handleDeletePromo(promo.id)}
                                className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition"
                                title="Hapus Promo"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 8: PENGATURAN SISTEM */}
          {/* ============================================================== */}
          {activeMenu === 'Pengaturan Sistem' && (
            <div className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm max-w-2xl space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-neutral-100 pb-4">
                <h3 className="font-['Figtree'] text-lg font-bold text-neutral-900">
                  Pengaturan Platform Safara
                </h3>
                <p className="text-xs text-neutral-500">Konfigurasi operasional dan integrasi rekening</p>
              </div>

              {systemSetting ? (
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  {/* Payment Gateway vs Manual Transfer */}
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                    <div>
                      <span className="font-bold text-neutral-900 block text-sm">Payment Gateway Otomatis</span>
                      <p className="text-neutral-500 text-[11px] mt-0.5">
                        Jika diaktifkan, pembayaran menggunakan Midtrans/Xendit. Jika dinonaktifkan, pembayaran manual via rekening perusahaan.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={systemSetting.paymentGatewayActive}
                        onChange={(e) => setSystemSetting({ ...systemSetting, paymentGatewayActive: e.target.checked })}
                      />
                      <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-700"></div>
                    </label>
                  </div>

                  {/* Supplier API Integrations */}
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                    <div>
                      <span className="font-bold text-neutral-900 block text-sm">Integrasi API Hotel (Otomatis)</span>
                      <span className="text-[11px] text-neutral-500 block mt-0.5 max-w-sm">Jika aktif, sistem mem-booking hotel langsung via API. Jika mati, sistem mewajibkan admin mengunggah/menginput kode voucher hotel manual saat verifikasi.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={systemSetting.supplierApiActive} 
                        onChange={(e) => setSystemSetting({ ...systemSetting, supplierApiActive: e.target.checked })}
                      />
                      <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-700"></div>
                    </label>
                  </div>

                  {/* Use Safara Code Only */}
                  {!systemSetting.supplierApiActive && (
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                      <div>
                        <span className="font-bold text-neutral-900 block text-sm">Gunakan Kode Safara Saja (Untuk Hotel Manual)</span>
                        <span className="text-[11px] text-neutral-500 block mt-0.5 max-w-sm">Jika aktif, admin tidak akan ditanya untuk memasukkan kode booking/voucher hotel saat memverifikasi pesanan hotel manual. Tamu hanya akan menerima E-Ticket resmi Safara.</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={systemSetting.useSafaraCodeOnly} 
                          onChange={(e) => setSystemSetting({ ...systemSetting, useSafaraCodeOnly: e.target.checked })}
                        />
                        <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-700"></div>
                      </label>
                    </div>
                  )}

                  {/* Admin WhatsApp Number */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-100 pb-4 gap-4">
                    <div>
                      <span className="font-bold text-neutral-900 block text-sm">Nomor WhatsApp Admin (Umrah & Booking)</span>
                      <span className="text-[11px] text-neutral-500 block mt-0.5 max-w-sm">Nomor ini digunakan untuk tombol "Daftar Paket Umrah Sekarang" dan notifikasi booking. Format: 628...</span>
                    </div>
                    <input
                      type="text"
                      className="rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-teal-700 focus:ring-teal-700 w-full sm:w-auto"
                      placeholder="628..."
                      value={systemSetting.adminWhatsApp || ''}
                      onChange={(e) => setSystemSetting({ ...systemSetting, adminWhatsApp: e.target.value })}
                    />
                  </div>

                  {/* Customer Care WhatsApp Number */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-100 pb-4 gap-4">
                    <div>
                      <span className="font-bold text-neutral-900 block text-sm">Nomor WhatsApp Customer Care</span>
                      <span className="text-[11px] text-neutral-500 block mt-0.5 max-w-sm">Nomor ini digunakan untuk tombol chat "Customer Care Safara" (Floating Widget). Format: 628...</span>
                    </div>
                    <input
                      type="text"
                      className="rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-teal-700 focus:ring-teal-700 w-full sm:w-auto"
                      placeholder="628..."
                      value={systemSetting.customerCareWhatsApp || ''}
                      onChange={(e) => setSystemSetting({ ...systemSetting, customerCareWhatsApp: e.target.value })}
                    />
                  </div>

                  {/* Manual Bank Account Details */}
                  {!systemSetting.paymentGatewayActive && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-neutral-900">Daftar Rekening Pembayaran Manual</h4>
                        <button type="button" onClick={addBankAccount} className="flex items-center gap-1 rounded-lg bg-teal-50 px-2 py-1 text-[11px] font-bold text-teal-700 hover:bg-teal-100 transition">
                          <Plus className="h-3.5 w-3.5" /> Tambah Rekening
                        </button>
                      </div>
                      
                      {bankAccounts.map((bank, index) => (
                        <div key={bank.id || index} className="relative space-y-4 rounded-2xl bg-neutral-50 p-4 border border-neutral-200">
                          <button type="button" onClick={() => removeBankAccount(index)} className="absolute top-3 right-3 text-neutral-400 hover:text-rose-600 transition">
                            <X className="h-4 w-4" />
                          </button>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pr-6">
                            <div>
                              <label className="block text-neutral-600 mb-1 font-semibold">Nama Bank (misal: BCA, BSI)</label>
                              <input 
                                type="text" 
                                className="w-full rounded-xl border-neutral-200 px-3 py-2 focus:border-teal-700 focus:ring-teal-700" 
                                value={bank.bankName}
                                onChange={(e) => updateBankAccount(index, 'bankName', e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-neutral-600 mb-1 font-semibold">Nomor Rekening</label>
                              <input 
                                type="text" 
                                className="w-full rounded-xl border-neutral-200 px-3 py-2 focus:border-teal-700 focus:ring-teal-700" 
                                value={bank.accountNumber}
                                onChange={(e) => updateBankAccount(index, 'accountNumber', e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-neutral-600 mb-1 font-semibold">Nama Pemilik Rekening</label>
                              <input 
                                type="text" 
                                className="w-full rounded-xl border-neutral-200 px-3 py-2 focus:border-teal-700 focus:ring-teal-700" 
                                value={bank.accountName}
                                onChange={(e) => updateBankAccount(index, 'accountName', e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-neutral-600 mb-1 font-semibold">Teks Label (Opsional)</label>
                              <input 
                                type="text" 
                                className="w-full rounded-xl border-neutral-200 px-3 py-2 focus:border-teal-700 focus:ring-teal-700" 
                                value={bank.badge || ''}
                                placeholder="Contoh: Paling Direkomendasikan"
                                onChange={(e) => updateBankAccount(index, 'badge', e.target.value)}
                              />
                            </div>
                            <div className="col-span-1 sm:col-span-2">
                              <label className="block text-neutral-600 mb-1 font-semibold">Logo Bank (Opsional)</label>
                              <div className="flex items-center gap-4">
                                {bank.logoUrl ? (
                                  <div className="h-10 w-auto min-w-10 rounded overflow-hidden border border-neutral-200 bg-white p-1">
                                    <img src={bank.logoUrl} alt="Logo" className="h-full w-auto object-contain" />
                                  </div>
                                ) : (
                                  <div className="flex h-10 w-16 items-center justify-center rounded border border-dashed border-neutral-300 bg-neutral-100 text-neutral-400">
                                    <ImageIcon className="h-4 w-4" />
                                  </div>
                                )}
                                <label className="cursor-pointer rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition">
                                  Pilih Gambar
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleBankLogoUpload(index, e)} />
                                </label>
                                {bank.logoUrl && (
                                  <button type="button" onClick={() => updateBankAccount(index, 'logoUrl', '')} className="text-xs font-bold text-rose-600 hover:underline">
                                    Hapus
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* WA Notification */}
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                    <div>
                      <span className="font-bold text-neutral-900 block text-sm">Notifikasi WhatsApp Otomatis</span>
                      <p className="text-neutral-500 text-[11px] mt-0.5">
                        Kirim invoice, e-tiket, dan kode reservasi secara otomatis via WhatsApp Gateway
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={systemSetting.waNotificationActive}
                        onChange={(e) => setSystemSetting({ ...systemSetting, waNotificationActive: e.target.checked })}
                      />
                      <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-700"></div>
                    </label>
                  </div>
                  
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSavingSettings}
                      className="w-full rounded-xl bg-teal-700 px-4 py-3 text-xs font-bold text-white shadow-sm hover:bg-teal-800 disabled:opacity-50 transition"
                    >
                      {isSavingSettings ? 'Menyimpan...' : 'Simpan Pengaturan'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-8 text-center text-xs text-neutral-500">Memuat pengaturan sistem...</div>
              )}
            </div>
          )}
          {/* Modal Tambah Pengguna Baru (Khusus Super Admin) */}
          {isCreateUserModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-neutral-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                {/* Close button */}
                <button
                  type="button"
                  onClick={() => !isCreatingUser && setIsCreateUserModalOpen(false)}
                  className="absolute top-6 right-6 rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 border border-teal-100">
                    <UserPlus className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-['Figtree'] text-lg font-bold text-neutral-900">
                        Tambah Pengguna Baru
                      </h3>
                      <span className="rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                        Super Admin
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500">
                      Daftarkan akun jemaah, admin, atau super admin langsung ke sistem
                    </p>
                  </div>
                </div>

                <form onSubmit={handleCreateUser} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="cth. Muhammad Farhan"
                      value={newUserForm.name}
                      onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-teal-600 focus:bg-white transition"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                      Alamat Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="cth. farhan@gmail.com"
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-teal-600 focus:bg-white transition"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                      Kata Sandi / Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showNewUserPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        placeholder="Minimal 6 karakter"
                        value={newUserForm.password}
                        onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 pr-10 text-xs text-neutral-900 outline-none focus:border-teal-600 focus:bg-white transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewUserPassword(!showNewUserPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                      >
                        {showNewUserPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-1 block">
                      Pengguna dapat mengubah kata sandi ini sewaktu-waktu melalui halaman profil.
                    </span>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                      Nomor WhatsApp / Telepon (Opsional)
                    </label>
                    <input
                      type="tel"
                      placeholder="cth. 081234567890"
                      value={newUserForm.phoneNumber}
                      onChange={(e) => setNewUserForm({ ...newUserForm, phoneNumber: e.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-teal-600 focus:bg-white transition"
                    />
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-2">
                      Peran Akun (Hak Akses) <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        {
                          role: 'USER' as const,
                          title: 'User / Jemaah',
                          desc: 'Pemesanan paket & hotel',
                          activeColor: 'border-teal-600 bg-teal-50/70 text-teal-900 ring-2 ring-teal-600/20',
                        },
                        {
                          role: 'ADMIN' as const,
                          title: 'Admin',
                          desc: 'Kelola order & paket wisata',
                          activeColor: 'border-purple-600 bg-purple-50/70 text-purple-900 ring-2 ring-purple-600/20',
                        },
                        {
                          role: 'SUPER_ADMIN' as const,
                          title: 'Super Admin',
                          desc: 'Hak akses penuh & user',
                          activeColor: 'border-rose-600 bg-rose-50/70 text-rose-900 ring-2 ring-rose-600/20',
                        },
                      ].map((item) => {
                        const isSelected = newUserForm.role === item.role;
                        return (
                          <button
                            type="button"
                            key={item.role}
                            onClick={() => setNewUserForm({ ...newUserForm, role: item.role })}
                            className={`flex flex-col text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                              isSelected
                                ? item.activeColor
                                : 'bg-neutral-50/50 border-neutral-200 hover:border-neutral-300'
                            }`}
                          >
                            <span className="font-bold text-xs">{item.title}</span>
                            <span className="text-[10px] text-neutral-500 mt-1 leading-snug">{item.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Auto-verified badge note */}
                  <div className="rounded-2xl bg-teal-50/80 border border-teal-100 p-3 text-[11px] text-teal-900 flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>
                      Akun yang dibuat melalui Super Admin akan langsung <strong>Terverifikasi</strong> (Verified) dan dapat segera login tanpa verifikasi email manual.
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                    <button
                      type="button"
                      disabled={isCreatingUser}
                      onClick={() => setIsCreateUserModalOpen(false)}
                      className="rounded-xl border border-neutral-200 px-4 py-2.5 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isCreatingUser}
                      className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-teal-800 transition disabled:opacity-50 shadow-md shadow-teal-700/20 cursor-pointer"
                    >
                      {isCreatingUser ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          <span>Mendaftarkan...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-3.5 w-3.5" />
                          <span>Daftarkan Pengguna</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal Ubah Peran Pengguna (Khusus Super Admin) */}
          {selectedUserForRole && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-neutral-100 animate-in zoom-in-95 duration-200">
                <button
                  type="button"
                  onClick={() => !isUpdatingRole && setSelectedUserForRole(null)}
                  className="absolute top-6 right-6 rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-3.5 mb-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 border border-teal-100">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-['Figtree'] text-base font-bold text-neutral-900">
                      Ubah Peran Pengguna
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Sesuaikan tingkat hak akses untuk akun ini
                    </p>
                  </div>
                </div>

                {/* Target User Info */}
                <div className="rounded-2xl bg-neutral-50 border border-neutral-200/80 p-3.5 mb-5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-neutral-900">{selectedUserForRole.name}</p>
                    <p className="text-[11px] text-neutral-500 font-mono">{selectedUserForRole.email}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      selectedUserForRole.currentRole === 'SUPER_ADMIN'
                        ? 'bg-rose-100 text-rose-800'
                        : selectedUserForRole.currentRole === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    Saat ini: {selectedUserForRole.currentRole}
                  </span>
                </div>

                <form onSubmit={handleSaveUserRole} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-2">
                      Pilih Peran Baru:
                    </label>
                    <div className="space-y-2">
                      {[
                        {
                          role: 'USER' as const,
                          title: 'User / Jemaah',
                          desc: 'Akses pemesanan paket umrah, hotel, dan riwayat transaksi pribadi.',
                          activeColor: 'border-teal-600 bg-teal-50/70 text-teal-900 ring-2 ring-teal-600/20',
                        },
                        {
                          role: 'ADMIN' as const,
                          title: 'Admin Operasional',
                          desc: 'Akses dashboard admin untuk memproses booking, verifikasi pesanan, dan update produk.',
                          activeColor: 'border-purple-600 bg-purple-50/70 text-purple-900 ring-2 ring-purple-600/20',
                        },
                        {
                          role: 'SUPER_ADMIN' as const,
                          title: 'Super Admin',
                          desc: 'Akses penuh tanpa batas: kelola seluruh sistem, mendaftarkan akun baru, dan mengubah peran pengguna lain.',
                          activeColor: 'border-rose-600 bg-rose-50/70 text-rose-900 ring-2 ring-rose-600/20',
                        },
                      ].map((item) => {
                        const isSelected = selectedUserForRole.newRole === item.role;
                        return (
                          <button
                            type="button"
                            key={item.role}
                            onClick={() =>
                              setSelectedUserForRole({
                                ...selectedUserForRole,
                                newRole: item.role,
                              })
                            }
                            className={`w-full flex items-start gap-3 text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                              isSelected
                                ? item.activeColor
                                : 'bg-white border-neutral-200 hover:border-neutral-300'
                            }`}
                          >
                            <div className="mt-0.5">
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  isSelected
                                    ? 'border-teal-600 bg-teal-600'
                                    : 'border-neutral-300 bg-white'
                                }`}
                              >
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                            </div>
                            <div className="flex-1">
                              <span className="font-bold text-xs block text-neutral-900">{item.title}</span>
                              <span className="text-[11px] text-neutral-500 leading-relaxed block mt-0.5">{item.desc}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                    <button
                      type="button"
                      disabled={isUpdatingRole}
                      onClick={() => setSelectedUserForRole(null)}
                      className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdatingRole || selectedUserForRole.currentRole === selectedUserForRole.newRole}
                      className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-2 text-xs font-bold text-white hover:bg-teal-800 transition disabled:opacity-50 shadow-md shadow-teal-700/20 cursor-pointer"
                    >
                      {isUpdatingRole ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <span>Simpan Perubahan Peran</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
