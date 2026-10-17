'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Table, 
  Download, 
  Search, 
  Filter, 
  ShieldCheck, 
  Users, 
  Building, 
  Flag, 
  Compass, 
  ScrollText, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Lock,
  Unlock,
  RefreshCw,
  Eye,
  FileSpreadsheet
} from 'lucide-react';
import { 
  formatCurrencyEGP, 
  formatDateArabic, 
  HOUSING_TYPE_LABELS, 
  STATUS_LABELS 
} from '@/lib/utils';
import { EGYPT_GOVERNORATES } from '@/types/database';

type ActiveTab = 'users' | 'listings' | 'complaints' | 'wanted' | 'audit';

// Initial Mock Data for Master Sheet
interface SheetUser {
  id: string;
  name: string;
  phone: string;
  role: string;
  is_suspended: boolean;
  suspension_reason: string | null;
  created_at: string;
  listings_count: number;
  complaints_against: number;
}

interface SheetListing {
  id: string;
  title: string;
  owner_name: string;
  owner_phone: string;
  governorate: string;
  area: string;
  housing_type: string;
  monthly_rent: number;
  deposit: number;
  status: 'published' | 'paused' | 'rented' | 'rejected';
  views: number;
  created_at: string;
}

interface SheetComplaint {
  id: string;
  category: string;
  status: 'submitted' | 'under_review' | 'resolved' | 'rejected';
  reporter_name: string;
  accused_name: string;
  accused_phone: string;
  description: string;
  evidence_url: string;
  created_at: string;
}

interface SheetWanted {
  id: string;
  seeker_name: string;
  seeker_phone: string;
  governorate: string;
  area: string;
  housing_type: string;
  budget_max: number;
  is_active: boolean;
  created_at: string;
}

interface SheetAudit {
  id: string;
  created_at: string;
  actor: string;
  action: string;
  target: string;
  details: string;
}

export default function MasterAdminSheetPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [govFilter, setGovFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Operational State
  const [users, setUsers] = useState<SheetUser[]>([
    {
      id: 'usr-101',
      name: 'أحمد محمود إبراهيم',
      phone: '+201012345678',
      role: 'مضيف سكن (Provider)',
      is_suspended: false,
      suspension_reason: null,
      created_at: '2026-10-14 10:30',
      listings_count: 2,
      complaints_against: 0,
    },
    {
      id: 'usr-102',
      name: 'كريم عبد العزيز سليم',
      phone: '+201123456789',
      role: 'مضيف سكن (مشتبه سمسار)',
      is_suspended: false,
      suspension_reason: null,
      created_at: '2026-10-15 14:15',
      listings_count: 4,
      complaints_against: 2,
    },
    {
      id: 'usr-103',
      name: 'سارة مصطفى كمال',
      phone: '+201234567890',
      role: 'طالبة باحثة (Seeker)',
      is_suspended: false,
      suspension_reason: null,
      created_at: '2026-10-15 18:00',
      listings_count: 0,
      complaints_against: 0,
    },
    {
      id: 'usr-104',
      name: 'مكتب الأهرام للخدمات العقارية',
      phone: '+201509876543',
      role: 'سمسار محظور',
      is_suspended: true,
      suspension_reason: 'طلب عمولة سمسرة من طلبة ومخالفة ميثاق الأمان',
      created_at: '2026-10-13 09:10',
      listings_count: 6,
      complaints_against: 5,
    },
    {
      id: 'usr-105',
      name: 'محمود عبد الفتاح رضوان',
      phone: '+201099887766',
      role: 'مضيف سكن (Provider)',
      is_suspended: false,
      suspension_reason: null,
      created_at: '2026-10-16 11:20',
      listings_count: 1,
      complaints_against: 0,
    },
  ]);

  const [listings, setListings] = useState<SheetListing[]>([
    {
      id: 'lst-201',
      title: 'غرفة سنجل هادئة ومفروشة بالكامل قرب مترو الدقي',
      owner_name: 'أحمد محمود إبراهيم',
      owner_phone: '+201012345678',
      governorate: 'الجيزة',
      area: 'الدقي',
      housing_type: 'room',
      monthly_rent: 2800,
      deposit: 2800,
      status: 'published',
      views: 142,
      created_at: '2026-10-15',
    },
    {
      id: 'lst-202',
      title: 'استوديو مستقل مفروش قرب جامعة الإسكندرية',
      owner_name: 'إبراهيم علي خليل',
      owner_phone: '+201201020304',
      governorate: 'الإسكندرية',
      area: 'الشاطبي',
      housing_type: 'studio',
      monthly_rent: 4200,
      deposit: 4200,
      status: 'published',
      views: 98,
      created_at: '2026-10-15',
    },
    {
      id: 'lst-203',
      title: 'سكن شباب مشترك بجوار جامعة القاهرة',
      owner_name: 'أحمد محمود إبراهيم',
      owner_phone: '+201012345678',
      governorate: 'الجيزة',
      area: 'بين السرايات',
      housing_type: 'shared_apartment',
      monthly_rent: 1400,
      deposit: 1000,
      status: 'published',
      views: 310,
      created_at: '2026-10-13',
    },
    {
      id: 'lst-204',
      title: 'شقة مفروشة ٣ غرف مدينة نصر الحي السابع',
      owner_name: 'كريم عبد العزيز سليم',
      owner_phone: '+201123456789',
      governorate: 'القاهرة',
      area: 'مدينة نصر',
      housing_type: 'full_apartment',
      monthly_rent: 8500,
      deposit: 8500,
      status: 'rejected',
      views: 45,
      created_at: '2026-10-16',
    },
    {
      id: 'lst-205',
      title: 'غرفة ماستر مكيفة بالمعادي قرب محطة المترو',
      owner_name: 'محمود عبد الفتاح رضوان',
      owner_phone: '+201099887766',
      governorate: 'القاهرة',
      area: 'المعادي',
      housing_type: 'room',
      monthly_rent: 3200,
      deposit: 3000,
      status: 'paused',
      views: 65,
      created_at: '2026-10-16',
    },
  ]);

  const [complaints, setComplaints] = useState<SheetComplaint[]>([
    {
      id: 'cmp-301',
      category: 'عمولة سمسرة (مخالفة ميثاق)',
      status: 'submitted',
      reporter_name: 'سارة مصطفى كمال',
      accused_name: 'كريم عبد العزيز سليم',
      accused_phone: '+201123456789',
      description: 'أصر في الشات على طلب عمولة 2000 ج.م إضافية قبل معاينة الشقة في مدينة نصر',
      evidence_url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      created_at: '2026-10-16 15:40',
    },
    {
      id: 'cmp-302',
      category: 'طلب عربون معاينة مسبق',
      status: 'resolved',
      reporter_name: 'عمر خالد حسن',
      accused_name: 'مكتب الأهرام للخدمات العقارية',
      accused_phone: '+201509876543',
      description: 'طلب تحويل 500 ج.م على فودافون كاش كرسوم معاينة للشقة',
      evidence_url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      created_at: '2026-10-13 11:00',
    },
  ]);

  const [wantedRequests, setWantedRequests] = useState<SheetWanted[]>([
    {
      id: 'wnt-401',
      seeker_name: 'سارة مصطفى كمال',
      seeker_phone: '+201234567890',
      governorate: 'الجيزة',
      area: 'الدقي أو المهندسين',
      housing_type: 'room',
      budget_max: 3000,
      is_active: true,
      created_at: '2026-10-15',
    },
    {
      id: 'wnt-402',
      seeker_name: 'محمد أشرف طارق',
      seeker_phone: '+201009988112',
      governorate: 'القاهرة',
      area: 'العباسية قرب عين شمس',
      housing_type: 'shared_apartment',
      budget_max: 1800,
      is_active: true,
      created_at: '2026-10-16',
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<SheetAudit[]>([
    {
      id: 'aud-501',
      created_at: '2026-10-16 16:00:22',
      actor: 'Super Admin (المالك)',
      action: 'LISTING_STATUS_OVERRIDE',
      target: 'lst-204',
      details: 'رفض إعلان مدينة نصر لاشتباه السمسرة',
    },
    {
      id: 'aud-502',
      created_at: '2026-10-14 12:15:00',
      actor: 'Super Admin (المالك)',
      action: 'USER_SUSPENDED',
      target: 'usr-104',
      details: 'حظر حساب مكتب الأهرام وسحب 6 إعلانات',
    },
  ]);

  // KPIs
  const totalRentManaged = useMemo(() => {
    return listings
      .filter((l) => l.status === 'published')
      .reduce((sum, l) => sum + l.monthly_rent, 0);
  }, [listings]);

  const pendingComplaintsCount = useMemo(() => {
    return complaints.filter((c) => c.status === 'submitted' || c.status === 'under_review').length;
  }, [complaints]);

  const bannedUsersCount = useMemo(() => {
    return users.filter((u) => u.is_suspended).length;
  }, [users]);

  // Actions
  const toggleUserBan = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextState = !u.is_suspended;
          const reason = nextState ? 'قرار إداري مباشر من مالك المنصة' : null;

          // Also add audit
          setAuditLogs((a) => [
            {
              id: `aud-${Date.now()}`,
              created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
              actor: 'Super Admin (المالك)',
              action: nextState ? 'USER_SUSPENDED_MANUAL' : 'USER_RESTORED_MANUAL',
              target: u.id,
              details: nextState ? `تجميد حساب ${u.name}` : `إلغاء حظر حساب ${u.name}`,
            },
            ...a,
          ]);

          return { ...u, is_suspended: nextState, suspension_reason: reason };
        }
        return u;
      })
    );
  };

  const changeListingStatus = (listingId: string, nextStatus: SheetListing['status']) => {
    setListings((prev) =>
      prev.map((l) => {
        if (l.id === listingId) {
          setAuditLogs((a) => [
            {
              id: `aud-${Date.now()}`,
              created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
              actor: 'Super Admin (المالك)',
              action: 'LISTING_STATUS_CHANGE',
              target: l.id,
              details: `تعديل حالة الإعلان ${l.title} إلى ${nextStatus}`,
            },
            ...a,
          ]);
          return { ...l, status: nextStatus };
        }
        return l;
      })
    );
  };

  const resolveComplaintAndBan = (complaintId: string) => {
    const comp = complaints.find((c) => c.id === complaintId);
    if (!comp) return;

    setComplaints((prev) =>
      prev.map((c) => (c.id === complaintId ? { ...c, status: 'resolved' } : c))
    );

    // Auto-ban accused user if found
    setUsers((prev) =>
      prev.map((u) => {
        if (u.name === comp.accused_name || u.phone === comp.accused_phone) {
          return {
            ...u,
            is_suspended: true,
            suspension_reason: `ثبوت مخالفة في البلاغ رقم ${complaintId}`,
          };
        }
        return u;
      })
    );

    setAuditLogs((a) => [
      {
        id: `aud-${Date.now()}`,
        created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
        actor: 'Super Admin (المالك)',
        action: 'COMPLAINT_RESOLVED_BAN_TRIGGERED',
        target: complaintId,
        details: `حل الشكوى وحظر المشكو في حقه ${comp.accused_name}`,
      },
      ...a,
    ]);
  };

  // One-Click CSV Export Function (With UTF-8 BOM for Arabic Excel Support)
  const exportCurrentTabToCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = `sakan_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`;

    if (activeTab === 'users') {
      headers = ['كود المستخدم', 'الاسم', 'رقم الهاتف', 'الرتبة', 'الحالة', 'سبب الحظر', 'تاريخ التسجيل', 'الإعلانات', 'البلاغات'];
      rows = users.map((u) => [
        u.id,
        u.name,
        u.phone,
        u.role,
        u.is_suspended ? 'محظور' : 'نشط',
        u.suspension_reason || '-',
        u.created_at,
        u.listings_count.toString(),
        u.complaints_against.toString(),
      ]);
    } else if (activeTab === 'listings') {
      headers = ['كود الإعلان', 'العنوان', 'اسم صاحب الإعلان', 'هاتف المالك', 'المحافظة', 'المنطقة', 'النوع', 'الإيجار الشهري', 'التأمين', 'الحالة', 'المشاهدات'];
      rows = listings.map((l) => [
        l.id,
        l.title,
        l.owner_name,
        l.owner_phone,
        l.governorate,
        l.area,
        HOUSING_TYPE_LABELS[l.housing_type] || l.housing_type,
        l.monthly_rent.toString(),
        l.deposit.toString(),
        STATUS_LABELS[l.status]?.label || l.status,
        l.views.toString(),
      ]);
    } else if (activeTab === 'complaints') {
      headers = ['كود الشكوى', 'التصنيف', 'الحالة', 'الشاكي', 'المشكو في حقه', 'هاتف المشكو فيه', 'تفاصيل الشكوى', 'تاريخ التقديم'];
      rows = complaints.map((c) => [
        c.id,
        c.category,
        c.status,
        c.reporter_name,
        c.accused_name,
        c.accused_phone,
        `"${c.description.replace(/"/g, '""')}"`,
        c.created_at,
      ]);
    } else if (activeTab === 'wanted') {
      headers = ['كود الطلب', 'اسم الطالب', 'الهاتف', 'المحافظة', 'المنطقة', 'النوع', 'الميزانية', 'الحالة'];
      rows = wantedRequests.map((w) => [
        w.id,
        w.seeker_name,
        w.seeker_phone,
        w.governorate,
        w.area,
        w.housing_type,
        w.budget_max.toString(),
        w.is_active ? 'نشط' : 'موقوف',
      ]);
    } else if (activeTab === 'audit') {
      headers = ['كود العملية', 'التوقيت', 'المسؤول', 'نوع الإجراء', 'الكيان المتأثر', 'التفاصيل'];
      rows = auditLogs.map((a) => [
        a.id,
        a.created_at,
        a.actor,
        a.action,
        a.target,
        `"${a.details.replace(/"/g, '""')}"`,
      ]);
    }

    const csvContent =
      '\uFEFF' + // UTF-8 BOM
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & KPIs */}
      <div className="bg-[#0F2942] text-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2.5 py-1 rounded-lg font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>مساحة المالك الخاصة (Executive Master Sheet)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">شيت الرقابة والتحكم الشامل</h1>
            <p className="text-xs sm:text-sm text-stone-300">
              تحكم كامل في كافة مدخلات النظام: المستخدمين، الإعلانات، الشكاوى، طلبات السكن، وسجل العمليات الفوري
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={exportCurrentTabToCSV}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow flex items-center justify-center gap-2 transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>تصدير هذا الشيت إلى Excel / CSV</span>
            </button>
          </div>
        </div>

        {/* 5 High-Impact Platform KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-white/10 text-xs">
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1">
            <span className="text-stone-300 block">إجمالي المستخدمين</span>
            <div className="text-xl sm:text-2xl font-black text-white">{users.length}</div>
          </div>
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1">
            <span className="text-stone-300 block">الإعلانات النشطة</span>
            <div className="text-xl sm:text-2xl font-black text-white">
              {listings.filter((l) => l.status === 'published').length}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1">
            <span className="text-stone-300 block">البلاغات المعلقة</span>
            <div className="text-xl sm:text-2xl font-black text-amber-400">{pendingComplaintsCount}</div>
          </div>
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1">
            <span className="text-stone-300 block">الحسابات المجمدة</span>
            <div className="text-xl sm:text-2xl font-black text-rose-400">{bannedUsersCount}</div>
          </div>
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1 col-span-2 sm:col-span-1">
            <span className="text-stone-300 block">القيمة الإيجارية المُدارة</span>
            <div className="text-lg sm:text-xl font-black text-emerald-400">
              {formatCurrencyEGP(totalRentManaged)}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-2xl border border-stone-200 p-2 flex flex-wrap items-center gap-2 shadow-xs">
        {[
          { id: 'users', label: 'المستخدمين والحسابات', count: users.length, icon: <Users className="w-4 h-4" /> },
          { id: 'listings', label: 'الإعلانات والوحدات', count: listings.length, icon: <Building className="w-4 h-4" /> },
          { id: 'complaints', label: 'البلاغات والسماسرة', count: complaints.length, icon: <Flag className="w-4 h-4" /> },
          { id: 'wanted', label: 'طلبات دوّرلي على سكن', count: wantedRequests.length, icon: <Compass className="w-4 h-4" /> },
          { id: 'audit', label: 'سجل العمليات والرقابة', count: auditLogs.length, icon: <ScrollText className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ActiveTab)}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === tab.id
                ? 'bg-[#0F2942] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Sheet Content Area */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        
        {/* Search & Actions Bar */}
        <div className="p-4 border-b border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث فوري بالاسم، رقم الموبايل، الكود، المحافظة..."
              className="w-full bg-white border border-stone-300 rounded-xl pr-9 pl-3 py-2 text-xs sm:text-sm focus:ring-1 focus:ring-[#0F2942] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={govFilter}
              onChange={(e) => setGovFilter(e.target.value)}
              className="bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700"
            >
              <option value="ALL">جميع المحافظات</option>
              {EGYPT_GOVERNORATES.map((g) => (
                <option key={g.id} value={g.nameAr}>
                  {g.nameAr}
                </option>
              ))}
            </select>

            <button
              onClick={exportCurrentTabToCSV}
              className="px-3 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              title="تصدير كـ CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير CSV</span>
            </button>
          </div>
        </div>

        {/* Data Grid Table */}
        <div className="overflow-x-auto">

          {/* TAB 1: USERS */}
          {activeTab === 'users' && (
            <table className="w-full text-right text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase">
                <tr>
                  <th className="p-3.5">الكود</th>
                  <th className="p-3.5">الاسم الكامل</th>
                  <th className="p-3.5">رقم الهاتف (مصر)</th>
                  <th className="p-3.5">الرتبة</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5">الإعلانات</th>
                  <th className="p-3.5">الشكاوى</th>
                  <th className="p-3.5 text-center">إجراءات المالك الفورية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users
                  .filter((u) => {
                    const matchQ =
                      u.name.includes(searchQuery) ||
                      u.phone.includes(searchQuery) ||
                      u.id.includes(searchQuery);
                    return matchQ;
                  })
                  .map((u) => (
                    <tr key={u.id} className="hover:bg-stone-50/70 transition">
                      <td className="p-3.5 font-mono text-stone-500">{u.id}</td>
                      <td className="p-3.5 font-bold text-stone-900">{u.name}</td>
                      <td className="p-3.5 font-mono text-stone-700" dir="ltr">{u.phone}</td>
                      <td className="p-3.5 text-stone-600">{u.role}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          u.is_suspended ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {u.is_suspended ? 'محظور / مجمد' : 'نشط'}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-stone-900">{u.listings_count}</td>
                      <td className="p-3.5 font-bold text-amber-700">{u.complaints_against}</td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => toggleUserBan(u.id)}
                          className={`px-3 py-1 rounded-lg font-bold text-xs transition inline-flex items-center gap-1 ${
                            u.is_suspended
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          }`}
                        >
                          {u.is_suspended ? (
                            <>
                              <Unlock className="w-3 h-3" />
                              <span>إلغاء الحظر</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3" />
                              <span>تجميد الحساب</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {/* TAB 2: LISTINGS */}
          {activeTab === 'listings' && (
            <table className="w-full text-right text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase">
                <tr>
                  <th className="p-3.5">الكود</th>
                  <th className="p-3.5">عنوان الإعلان</th>
                  <th className="p-3.5">صاحب السكن</th>
                  <th className="p-3.5">الموقع</th>
                  <th className="p-3.5">النوع</th>
                  <th className="p-3.5">الإيجار</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5">المشاهدات</th>
                  <th className="p-3.5 text-center">أوامر التحكم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {listings
                  .filter((l) => {
                    const matchQ =
                      l.title.includes(searchQuery) ||
                      l.owner_name.includes(searchQuery) ||
                      l.area.includes(searchQuery);
                    const matchGov = govFilter === 'ALL' || l.governorate === govFilter;
                    return matchQ && matchGov;
                  })
                  .map((l) => (
                    <tr key={l.id} className="hover:bg-stone-50/70 transition">
                      <td className="p-3.5 font-mono text-stone-500">{l.id}</td>
                      <td className="p-3.5 font-bold text-stone-900 max-w-xs truncate">
                        <Link href={`/listings/${l.id}`} className="hover:text-amber-700">
                          {l.title}
                        </Link>
                      </td>
                      <td className="p-3.5">
                        <div className="font-medium text-stone-900">{l.owner_name}</div>
                        <div className="text-[10px] text-stone-400 font-mono" dir="ltr">{l.owner_phone}</div>
                      </td>
                      <td className="p-3.5 text-stone-600">{l.governorate}، {l.area}</td>
                      <td className="p-3.5 text-stone-500">{HOUSING_TYPE_LABELS[l.housing_type] || l.housing_type}</td>
                      <td className="p-3.5 font-bold text-[#0F2942]">{formatCurrencyEGP(l.monthly_rent)}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          STATUS_LABELS[l.status]?.color || 'bg-stone-100 text-stone-600'
                        }`}>
                          {STATUS_LABELS[l.status]?.label || l.status}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono">{l.views}</td>
                      <td className="p-3.5 text-center">
                        <div className="inline-flex items-center gap-1">
                          {l.status !== 'published' && (
                            <button
                              onClick={() => changeListingStatus(l.id, 'published')}
                              className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[11px] font-bold"
                              title="نشر فوري"
                            >
                              نشر
                            </button>
                          )}
                          {l.status === 'published' && (
                            <button
                              onClick={() => changeListingStatus(l.id, 'paused')}
                              className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-[11px] font-bold"
                              title="إيقاف مؤقت"
                            >
                              إيقاف
                            </button>
                          )}
                          {l.status !== 'rejected' && (
                            <button
                              onClick={() => changeListingStatus(l.id, 'rejected')}
                              className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded text-[11px] font-bold"
                              title="رفض الإعلان"
                            >
                              رفض
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {/* TAB 3: COMPLAINTS */}
          {activeTab === 'complaints' && (
            <table className="w-full text-right text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase">
                <tr>
                  <th className="p-3.5">الكود</th>
                  <th className="p-3.5">نوع المخالفة</th>
                  <th className="p-3.5">الشاكي</th>
                  <th className="p-3.5">المشكو في حقه</th>
                  <th className="p-3.5">التفاصيل والأدلة</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5 text-center">قرار المالك الحاسم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {complaints
                  .filter((c) => {
                    return (
                      c.reporter_name.includes(searchQuery) ||
                      c.accused_name.includes(searchQuery) ||
                      c.description.includes(searchQuery)
                    );
                  })
                  .map((c) => (
                    <tr key={c.id} className="hover:bg-stone-50/70 transition">
                      <td className="p-3.5 font-mono text-stone-500">{c.id}</td>
                      <td className="p-3.5 font-bold text-rose-700">{c.category}</td>
                      <td className="p-3.5 text-stone-800">{c.reporter_name}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-stone-900">{c.accused_name}</div>
                        <div className="text-[10px] text-stone-400 font-mono" dir="ltr">{c.accused_phone}</div>
                      </td>
                      <td className="p-3.5 max-w-sm">
                        <p className="text-stone-600 line-clamp-2">{c.description}</p>
                        {c.evidence_url && (
                          <a
                            href={c.evidence_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-[#0F2942] underline hover:text-amber-700 block mt-1"
                          >
                            معاينة مرفق الشات والدليل
                          </a>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          c.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.status === 'rejected'
                            ? 'bg-stone-100 text-stone-600'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {c.status === 'resolved' ? 'تم الحل وحظر السمسار' : c.status === 'rejected' ? 'مرفوض' : 'قيد الفحص'}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        {c.status !== 'resolved' ? (
                          <button
                            onClick={() => resolveComplaintAndBan(c.id)}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition"
                          >
                            ثبوت المخالفة وحظر السمسار
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-bold text-[11px]">تم التنفيذ بنجاح</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {/* TAB 4: WANTED REQUESTS */}
          {activeTab === 'wanted' && (
            <table className="w-full text-right text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase">
                <tr>
                  <th className="p-3.5">الكود</th>
                  <th className="p-3.5">اسم الباحث</th>
                  <th className="p-3.5">الموبايل</th>
                  <th className="p-3.5">المحافظة والمنطقة</th>
                  <th className="p-3.5">نوع السكن</th>
                  <th className="p-3.5">أقصى ميزانية</th>
                  <th className="p-3.5">حالة التنبيهات</th>
                  <th className="p-3.5">تاريخ الطلب</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {wantedRequests.map((w) => (
                  <tr key={w.id} className="hover:bg-stone-50/70 transition">
                    <td className="p-3.5 font-mono text-stone-500">{w.id}</td>
                    <td className="p-3.5 font-bold text-stone-900">{w.seeker_name}</td>
                    <td className="p-3.5 font-mono text-stone-700" dir="ltr">{w.seeker_phone}</td>
                    <td className="p-3.5 text-stone-600">{w.governorate} — {w.area}</td>
                    <td className="p-3.5 text-stone-500">{HOUSING_TYPE_LABELS[w.housing_type] || w.housing_type}</td>
                    <td className="p-3.5 font-bold text-[#0F2942]">{formatCurrencyEGP(w.budget_max)}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        w.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {w.is_active ? 'تنبيه فوري نشط' : 'موقوف'}
                      </span>
                    </td>
                    <td className="p-3.5 text-stone-400">{w.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* TAB 5: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <table className="w-full text-right text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase">
                <tr>
                  <th className="p-3.5">الكود</th>
                  <th className="p-3.5">التوقيت الفعلي</th>
                  <th className="p-3.5">المسؤول</th>
                  <th className="p-3.5">نوع الإجراء</th>
                  <th className="p-3.5">الكيان المتأثر</th>
                  <th className="p-3.5">التفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {auditLogs.map((a) => (
                  <tr key={a.id} className="hover:bg-stone-50/70 transition">
                    <td className="p-3.5 font-mono text-stone-500">{a.id}</td>
                    <td className="p-3.5 font-mono text-stone-600" dir="ltr">{a.created_at}</td>
                    <td className="p-3.5 font-bold text-stone-900">{a.actor}</td>
                    <td className="p-3.5">
                      <span className="bg-stone-100 text-stone-800 font-mono px-2 py-0.5 rounded text-[11px]">
                        {a.action}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-stone-500">{a.target}</td>
                    <td className="p-3.5 text-stone-700">{a.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>

        {/* Footer info */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 text-xs text-stone-500 flex items-center justify-between">
          <span>سَكَن — جميع البيانات مشفرة ومحمية بسياسات RLS ومتاحة بصلاحيات المالك فقط</span>
          <span>توقيت الخادم: القاهرة (GMT+2)</span>
        </div>

      </div>

    </div>
  );
}
