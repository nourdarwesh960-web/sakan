'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Phone, ArrowLeft, AlertCircle } from 'lucide-react';
import { normalizeEgyptianPhone } from '@/lib/utils';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { setStoredUser, AuthUser } from '@/lib/auth-service';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/listings';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        let userEmail = identifier.trim();

        // If user typed a phone number, normalize and map to user format
        if (!identifier.includes('@')) {
          const phoneResult = normalizeEgyptianPhone(identifier);
          if (phoneResult.isValid) {
            userEmail = `${phoneResult.normalized.replace('+', '')}@phone.sakan.eg`;
          }
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password,
        });

        if (error) {
          setFormError('بيانات الدخول غير صحيحة، أو أن الحساب غير مسجل بعد');
          setIsSubmitting(false);
          return;
        }

        if (data?.user) {
          const authUser: AuthUser = {
            id: data.user.id,
            full_name: data.user.user_metadata?.full_name || (identifier.includes('@') ? identifier.split('@')[0] : 'مستخدم سَكَن'),
            phone: data.user.user_metadata?.phone || (!identifier.includes('@') ? identifier : ''),
            email: data.user.email,
            role_preference: data.user.user_metadata?.role_preference || 'both',
          };
          setStoredUser(authUser);
          router.push(redirectUrl);
          return;
        }
      }

      // Local preview fallback
      const authUser: AuthUser = {
        id: `user-${Date.now()}`,
        full_name: identifier.includes('@') ? identifier.split('@')[0] : 'مستخدم سَكَن',
        phone: !identifier.includes('@') ? identifier : '',
        email: identifier.includes('@') ? identifier : undefined,
        role_preference: 'both',
      };
      setStoredUser(authUser);
      router.push(redirectUrl);
    } catch {
      setFormError('حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة مرة أخرى');
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
        <h2 className="text-2xl font-black text-[#0F2942]">تسجيل الدخول إلى سَكَن</h2>
        <p className="text-xs sm:text-sm text-stone-500">
          أدخل رقم هاتفك أو بريدك الإلكتروني للمتابعة
        </p>
      </div>

      {searchParams.get('redirect') && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>يجب تسجيل الدخول أولاً لتتمكن من إتمام هذه العملية.</span>
        </div>
      )}

      {formError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Phone or Email */}
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">
            رقم الهاتف أو البريد الإلكتروني
          </label>
          <div className="relative">
            <input
              type="text"
              required
              dir="ltr"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="01012345678 أو name@example.com"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 pl-9 text-sm text-right focus:ring-2 focus:ring-[#0F2942] focus:outline-none"
            />
            <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-stone-700 block">كلمة المرور</label>
            <Link href="/forgot-password" className="text-[11px] text-[#0F2942] hover:underline">
              نسيت كلمة المرور؟
            </Link>
          </div>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 pl-9 text-sm focus:ring-2 focus:ring-[#0F2942] focus:outline-none"
            />
            <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#0F2942] hover:bg-[#0A3A40] text-white font-bold rounded-xl shadow transition disabled:opacity-50 text-sm flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </form>

      <div className="text-center pt-4 border-t border-stone-100 text-xs text-stone-600">
        ليس لديك حساب بعد؟{' '}
        <Link
          href={`/signup${searchParams.get('redirect') ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
          className="font-bold text-[#0F2942] hover:underline"
        >
          إنشاء حساب جديد مجاناً
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-stone-400 text-xs">جاري التحميل...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
