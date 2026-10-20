'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  Phone, 
  Mail, 
  Building, 
  Compass, 
  MessageSquare, 
  Flag, 
  ShieldCheck, 
  Trash2, 
  Save, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { EGYPT_GOVERNORATES } from '@/types/database';
import { useAuth } from '@/lib/use-auth';
import AuthGuard from '@/components/AuthGuard';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [rolePreference, setRolePreference] = useState<'seeker' | 'provider' | 'both'>('both');
  const [favGovernorate, setFavGovernorate] = useState('القاهرة');
  
  // Notification Preferences
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [statusAlerts, setStatusAlerts] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.full_name) setFullName(user.full_name);
      if (user.phone) setPhone(user.phone);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: fullName,
      phone: phone,
      email: email,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <AuthGuard fallbackMessage="يجب تسجيل الدخول لإدارة بياناتك وملفك الشخصي." redirectUrl="/profile">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xs">
        <div className="w-20 h-20 rounded-full bg-[#0F2942] text-white flex items-center justify-center font-black text-3xl shadow">
          {fullName ? fullName[0] : <User className="w-8 h-8" />}
        </div>
        <div className="text-center sm:text-right space-y-1 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-[#0F2942]">{fullName || 'الملف الشخصي للمستخدم'}</h1>
            <span className="bg-stone-100 text-stone-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {phone ? 'حساب نشط' : 'يرجى استكمال البيانات'}
            </span>
          </div>
          <p className="text-xs text-stone-500">
            رقم الهاتف: <span dir="ltr">{phone || 'لم يسجل بعد'}</span> • انضم في {new Date().getFullYear()}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/my-listings"
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition"
          >
            إعلاناتي
          </Link>
          <Link
            href="/wanted-requests"
            className="px-4 py-2 bg-[#0F2942] hover:bg-[#0A3A40] text-white text-xs font-bold rounded-xl transition"
          >
            طلبات السكن
          </Link>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>تم حفظ التعديلات وتحديث ملفك الشخصي بنجاح.</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5">
            <h2 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100">
              تعديل البيانات الأساسية
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">الاسم المعروض</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#0F2942] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">المحافظة المفضلة</label>
                <select
                  value={favGovernorate}
                  onChange={(e) => setFavGovernorate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#0F2942] focus:outline-none"
                >
                  {EGYPT_GOVERNORATES.map((g) => (
                    <option key={g.id} value={g.nameAr}>
                      {g.nameAr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">النبذة الشخصية</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="نبذة مختصرة تظهر لأصحاب السكن والمستأجرين عند التواصل..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#0F2942] focus:outline-none"
              />
            </div>

            {/* Notification Preferences */}
            <div className="pt-4 border-t border-stone-100 space-y-3">
              <h3 className="text-sm font-bold text-stone-800">تفضيلات الإشعارات والتنبيهات</h3>
              
              <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={matchAlerts}
                  onChange={(e) => setMatchAlerts(e.target.checked)}
                  className="rounded text-[#0F2942] focus:ring-0"
                />
                <span>تنبيهي فوراً عند توفر سكن يطابق طلباتي في "دوّرلي على سكن"</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={messageAlerts}
                  onChange={(e) => setMessageAlerts(e.target.checked)}
                  className="rounded text-[#0F2942] focus:ring-0"
                />
                <span>تنبيهي عند استلام رسائل جديدة في الشات الخاص</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={statusAlerts}
                  onChange={(e) => setStatusAlerts(e.target.checked)}
                  className="rounded text-[#0F2942] focus:ring-0"
                />
                <span>إشعارات تحديث حالة إعلاناتي وشكاوى الأمان</span>
              </label>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0F2942] hover:bg-[#0A3A40] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow transition"
              >
                <Save className="w-4 h-4" />
                حفظ التغييرات
              </button>
            </div>

          </form>

          {/* Account Deletion Area */}
          <div className="bg-rose-50/50 rounded-2xl border border-rose-200 p-6 space-y-3">
            <h3 className="text-sm font-bold text-rose-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              حذف الحساب والبيانات
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              وفقاً لميثاق خصوصية سَكَن، يحق لك في أي وقت طلب حذف حسابك نهائياً وحذف جميع إعلاناتك ورسائلك وسجلاتك الخاصة من خوادمنا.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              طلب حذف الحساب
            </button>
          </div>

        </div>

        {/* Shortcuts Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">سجلات نشاطك</h3>
            
            <Link
              href="/my-listings"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition border border-stone-100"
            >
              <div className="flex items-center gap-2.5 text-xs font-bold text-stone-800">
                <Building className="w-4 h-4 text-[#0F2942]" />
                إعلاناتي المنشورة
              </div>
              <span className="text-xs text-stone-400">إدارة</span>
            </Link>

            <Link
              href="/wanted-requests"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition border border-stone-100"
            >
              <div className="flex items-center gap-2.5 text-xs font-bold text-stone-800">
                <Compass className="w-4 h-4 text-amber-600" />
                طلبات "دوّرلي على سكن"
              </div>
              <span className="text-xs text-stone-400">متابعة</span>
            </Link>

            <Link
              href="/messages"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition border border-stone-100"
            >
              <div className="flex items-center gap-2.5 text-xs font-bold text-stone-800">
                <MessageSquare className="w-4 h-4 text-[#0A3A40]" />
                المحادثات الخاصة
              </div>
              <span className="text-xs text-stone-400">شات</span>
            </Link>

            <Link
              href="/complaints"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition border border-stone-100"
            >
              <div className="flex items-center gap-2.5 text-xs font-bold text-stone-800">
                <Flag className="w-4 h-4 text-rose-600" />
                الشكاوى والبلاغات
              </div>
              <span className="text-xs text-stone-400">سجل</span>
            </Link>
          </div>

          <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5 space-y-2 text-emerald-900">
            <h4 className="text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              خصوصيتك محمية
            </h4>
            <p className="text-[11px] leading-relaxed text-emerald-900/80">
              لا نقوم بمشاركة رقم هاتفك أو بريدك مع أي جهة خارجية أو معلنين، ولا نطلب بطاقة الرقم القومي افتراضياً.
            </p>
          </div>
        </div>

      </div>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-stone-900">هل أنت متأكد من حذف الحساب؟</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              هذا الإجراء نهائي ولا يمكن التراجع عنه. سيتم حذف جميع إعلاناتك، محادثاتك الخاصة، وطلبات السكن المحفوظة فوراً.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs transition"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  setDeleteConfirmed(true);
                  setShowDeleteModal(false);
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmed && (
        <div className="bg-amber-100 border border-amber-300 text-amber-900 p-4 rounded-2xl text-xs">
          تم استقبال طلب حذف الحساب بنجاح، وسيتم إتمام العملية وإلغاء الجلسة فوراً.
        </div>
      )}

    </div>
    </AuthGuard>
  );
}
