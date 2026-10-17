'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  Ban, 
  RotateCcw,
  AlertCircle 
} from 'lucide-react';
import { Profile } from '@/types/database';
import { formatDateArabic } from '@/lib/utils';
import { logAdminAction } from '@/lib/data-service';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([
    {
      id: 'user-ahmed-1',
      full_name: 'أحمد محمود',
      phone: '+201012345678',
      phone_verified: true,
      role_preference: 'provider',
      bio: 'مهندس مقيم بالقاهرة، أوفر غرف هادئة ومجهزة للطلبة والموظفين الجادين.',
      is_suspended: false,
      created_at: '2026-10-14T10:00:00.000Z',
      updated_at: '2026-10-16T12:00:00.000Z',
    },
    {
      id: 'user-sara-2',
      full_name: 'سارة إبراهيم',
      phone: '+201123456789',
      phone_verified: true,
      role_preference: 'provider',
      bio: 'طبيبة مقيمة في الإسكندرية، شقق مفروشة للطالبات.',
      is_suspended: false,
      created_at: '2026-10-13T15:00:00.000Z',
      updated_at: '2026-10-16T12:00:00.000Z',
    },
    {
      id: 'user-broker-suspect',
      full_name: 'وسيط عقارات تجاري (مخالف)',
      phone: '+201299998888',
      phone_verified: false,
      role_preference: 'provider',
      bio: 'مكتب تسويق عقارات بالمعادي',
      is_suspended: true,
      suspension_reason: 'طلب عمولة سمسرة وممارسة الوساطة التجارية بالمخالفة لميثاق سَكَن.',
      created_at: '2026-10-12T08:00:00.000Z',
      updated_at: '2026-10-16T12:00:00.000Z',
    }
  ]);

  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [suspensionReason, setSuspensionReason] = useState('');

  const toggleSuspension = async (user: Profile) => {
    const nextStatus = !user.is_suspended;
    const reason = nextStatus ? (suspensionReason || 'مخالفة سياسة مكافحة السماسرة') : undefined;

    setUsers(
      users.map((u) => (u.id === user.id ? { ...u, is_suspended: nextStatus, suspension_reason: reason } : u))
    );

    await logAdminAction(
      nextStatus ? 'SUSPEND_USER' : 'RESTORE_USER',
      'user',
      user.id,
      { reason, userName: user.full_name }
    );

    setSelectedUser(null);
    setSuspensionReason('');
  };

  const filtered = users.filter((u) => 
    u.full_name.toLowerCase().includes(search.toLowerCase()) || 
    (u.phone && u.phone.includes(search))
  );

  return (
    <div className="space-y-6">
      
      {/* Title & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F2942]">إدارة المستخدمين والحسابات</h1>
          <p className="text-xs text-stone-500">
            البحث في الحسابات، فحص الشبهات، وإيقاف السماسرة المخالفين
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو الهاتف..."
            className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 pl-9 text-xs focus:ring-1 focus:ring-[#0F2942] focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold">
              <tr>
                <th className="p-3.5">المستخدم</th>
                <th className="p-3.5">الهاتف المسجل</th>
                <th className="p-3.5">الدور الأولي</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5">تاريخ الانضمام</th>
                <th className="p-3.5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-stone-50/60 transition">
                  <td className="p-3.5 font-bold text-stone-900">
                    <div>{u.full_name}</div>
                    {u.bio && <div className="text-[10px] text-stone-400 truncate max-w-xs">{u.bio}</div>}
                  </td>
                  <td className="p-3.5 text-stone-600" dir="ltr">{u.phone}</td>
                  <td className="p-3.5 text-stone-600">
                    {u.role_preference === 'provider' ? 'مؤجر' : u.role_preference === 'seeker' ? 'باحث عن سكن' : 'كلاهما'}
                  </td>
                  <td className="p-3.5">
                    {u.is_suspended ? (
                      <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                        <Ban className="w-3 h-3" />
                        حساب موقوف
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        نشط وموثق
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-stone-400">{formatDateArabic(u.created_at)}</td>
                  <td className="p-3.5 text-center">
                    {u.is_suspended ? (
                      <button
                        onClick={() => toggleSuspension(u)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-lg text-[11px] transition inline-flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        إلغاء الإيقاف
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold rounded-lg text-[11px] transition inline-flex items-center gap-1"
                      >
                        <Ban className="w-3 h-3" />
                        إيقاف الحساب
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suspension Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-black text-rose-700 text-base flex items-center gap-2">
              <Ban className="w-5 h-5" />
              إيقاف حساب: {selectedUser.full_name}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              سيؤدي هذا الإجراء إلى حجب إعلانات هذا المستخدم فوراً ومنعه من نشر إعلانات جديدة، مع تسجيل العملية في سجل التدقيق الإداري.
            </p>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">سبب الإيقاف الإداري:</label>
              <textarea
                rows={3}
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="اكتب سبب الإيقاف (مثال: طلب عمولة سمسرة مثبتة في البلاغ #...)"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs"
              >
                إلغاء
              </button>
              <button
                onClick={() => toggleSuspension(selectedUser)}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs"
              >
                تأكيد الإيقاف والتسجيل
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
