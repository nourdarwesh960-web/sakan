'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Phone, Lock, User, Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { normalizeEgyptianPhone } from '@/lib/utils';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { setStoredUser, AuthUser } from '@/lib/auth-service';
import { registerAccount } from '@/lib/user-registry';

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rolePreference, setRolePreference] = useState<'seeker' | 'provider' | 'both'>('seeker');
  
  const [phoneError, setPhoneError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handlePhoneBlur = () => {
    if (!phone) return;
    const result = normalizeEgyptianPhone(phone);
    if (!result.isValid) {
      setPhoneError(result.error || 'رقم هاتف غير صحيح');
    } else {
      setPhoneError('');
      setPhone(result.normalized);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setPhoneError('');

    // Validate phone
    const phoneResult = normalizeEgyptianPhone(phone);
    if (!phoneResult.isValid) {
      setPhoneError(phoneResult.error || 'رقم هاتف غير صحيح');
      return;
    }

    if (password.length < 8) {
      setFormError('كلمة المرور يجب أن لا تقل عن 8 خانات');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const userIdentifier = email || `${phoneResult.normalized.replace('+', '')}@phone.sakan.eg`;
        
        const { data, error } = await supabase.auth.signUp({
          email: userIdentifier,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phoneResult.normalized,
              role_preference: rolePreference,
            },
          },
        });

        if (error) {
          setFormError(error.message);
          setIsSubmitting(false);
          return;
        }

        if (data?.user) {
          const authUser: AuthUser = {
            id: data.user?.id || `user-${Date.now()}`,
            full_name: fullName.trim(),
            phone: phoneResult.normalized,
            email: email || undefined,
            role_preference: rolePreference,
          };
          registerAccount(authUser, password);
          setStoredUser(authUser);

          setSuccessMessage('تم إنشاء الحساب بنجاح! جاري تحويلك...');
          setTimeout(() => {
            router.push(redirectUrl || '/onboarding');
          }, 1000);
          return;
        }
      }

      // Local persistent fallback
      const authUser: AuthUser = {
        id: `user-${Date.now()}`,
        full_name: fullName.trim(),
        phone: phoneResult.normalized,
        email: email || undefined,
        role_preference: rolePreference,
      };
      registerAccount(authUser, password);
      setStoredUser(authUser);

      setSuccessMessage('تم إنشاء الحساب بنجاح!');
      setTimeout(() => {
        router.push(redirectUrl || '/onboarding');
      }, 1000);
    } catch {
      setFormError('حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xl">
      {/* Brand and Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#0F2942] text-white font-bold text-2xl shadow-sm mb-2">
          سَ
        </div>
        <h2 className="text-2xl font-black text-[#0F2942]">إنشاء حساب جديد في سَكَن</h2>
        <p className="text-xs sm:text-sm text-stone-500">
          انضم لمنصة السكن المباشر الأولى في مصر بدون أي عمولات
        </p>
      </div>

      {redirectUrl && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>أنشئ حسابك الآن للمتابعة وإتمام العملية مباشرة.</span>
        </div>
      )}

      {formError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">الاسم بالكامل</label>
          <div className="relative">
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="مثال: يوسف أحمد"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 pl-9 text-sm focus:ring-2 focus:ring-[#0F2942] focus:outline-none"
            />
            <User className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
          </div>
        </div>

        {/* Egyptian Phone Number */}
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">
            رقم الهاتف المصري
          </label>
          <div className="relative">
            <input
              type="tel"
              required
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={handlePhoneBlur}
              placeholder="01012345678"
              className={`w-full bg-stone-50 border rounded-xl px-3 py-2.5 pl-9 text-sm text-right focus:outline-none focus:ring-2 ${
                phoneError ? 'border-rose-400 focus:ring-rose-500' : 'border-stone-300 focus:ring-[#0F2942]'
              }`}
            />
            <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
          </div>
          {phoneError ? (
            <p className="text-[11px] text-rose-600 mt-1">{phoneError}</p>
          ) : (
            <p className="text-[10px] text-stone-400 mt-1">يُقبل أرقام فودافون، أورنج، اتصالات، أو وي</p>
          )}
        </div>

        {/* Optional Email */}
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">
            البريد الإلكتروني <span className="text-stone-400 font-normal">(اختياري)</span>
          </label>
          <div className="relative">
            <input
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 pl-9 text-sm text-right focus:ring-2 focus:ring-[#0F2942] focus:outline-none"
            />
            <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
          </div>
        </div>

        {/* Initial Role Preference */}
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1.5">أنا هنا لـ:</label>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <button
              type="button"
              onClick={() => setRolePreference('seeker')}
              className={`py-2 px-1 rounded-xl border font-bold transition ${
                rolePreference === 'seeker'
                  ? 'bg-[#0F2942] text-white border-[#0F2942]'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              بدور على سكن
            </button>
            <button
              type="button"
              onClick={() => setRolePreference('provider')}
              className={`py-2 px-1 rounded-xl border font-bold transition ${
                rolePreference === 'provider'
                  ? 'bg-[#0F2942] text-white border-[#0F2942]'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              عايز أعرض سكن
            </button>
            <button
              type="button"
              onClick={() => setRolePreference('both')}
              className={`py-2 px-1 rounded-xl border font-bold transition ${
                rolePreference === 'both'
                  ? 'bg-[#0F2942] text-white border-[#0F2942]'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              الاثنين معاً
            </button>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">كلمة المرور</label>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="٨ خانات على الأقل"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 pl-9 text-sm focus:ring-2 focus:ring-[#0F2942] focus:outline-none"
            />
            <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
          </div>
        </div>

        {/* Submit CTA */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#0F2942] hover:bg-[#0A3A40] text-white font-bold rounded-xl shadow transition disabled:opacity-50 text-sm flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب مجاناً'}
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Terms notice */}
        <p className="text-[11px] text-stone-400 text-center leading-relaxed">
          بإنشاء حساب، فإنك توافق على <Link href="/terms" className="underline hover:text-stone-700">شروط الاستخدام</Link> و <Link href="/privacy" className="underline hover:text-stone-700">سياسة الخصوصية</Link> وميثاق منع العمولات.
        </p>
      </form>

      <div className="text-center pt-4 border-t border-stone-100 text-xs text-stone-600">
        لديك حساب بالفعل؟{' '}
        <Link
          href={`/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
          className="font-bold text-[#0F2942] hover:underline"
        >
          تسجيل الدخول
        </Link>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-stone-400 text-xs">جاري التحميل...</div>}>
        <SignUpForm />
      </Suspense>
    </div>
  );
}
