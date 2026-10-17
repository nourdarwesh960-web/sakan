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

  // Operational State - Clean and free of any fake data
  const [users, setUsers] = useState<SheetUser[]>([]);
  const [listings, setListings] = useState<SheetListing[]>([]);
  const [complaints, setComplaints] = useState<SheetComplaint[]>([]);
  const [wantedRequests, setWantedRequests] = useState<SheetWanted[]>([]);
  const [auditLogs, setAuditLogs] = useState<SheetAudit[]>([]);

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
                {users.filter((u) => {
                  const matchQ =
                    u.name.includes(searchQuery) ||
                    u.phone.includes(searchQuery) ||
                    u.id.includes(searchQuery);
                  return matchQ;
                }).length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-stone-400">
                      لا يوجد مستخدمون مسجلون حالياً في النظام
                    </td>
                  </tr>
                ) : (
                  users
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
                    ))
                )}
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
                {listings.filter((l) => {
                  const matchQ =
                    l.title.includes(searchQuery) ||
                    l.owner_name.includes(searchQuery) ||
                    l.area.includes(searchQuery);
                  const matchGov = govFilter === 'ALL' || l.governorate === govFilter;
                  return matchQ && matchGov;
                }).length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-stone-400">
                      لا توجد وحدات سكنية معروضة حالياً
                    </td>
                  </tr>
                ) : (
                  listings
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
                    ))
                )}
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
                {complaints.filter((c) => {
                  return (
                    c.reporter_name.includes(searchQuery) ||
                    c.accused_name.includes(searchQuery) ||
                    c.description.includes(searchQuery)
                  );
                }).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-stone-400">
                      سجل البلاغات والشكاوى نظيف تماماً
                    </td>
                  </tr>
                ) : (
                  complaints
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
                    ))
                )}
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
                {wantedRequests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-stone-400">
                      لا توجد طلبات سكن مسجلة حالياً
                    </td>
                  </tr>
                ) : (
                  wantedRequests.map((w) => (
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
                  ))
                )}
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
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-stone-400">
                      لا توجد عمليات رقابية مسجلة حالياً
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((a) => (
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
                  ))
                )}
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
