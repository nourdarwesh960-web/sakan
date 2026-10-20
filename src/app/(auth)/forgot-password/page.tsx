'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (resetError) {
          setError(resetError.message);
          setIsSubmitting(false);
          return;
        }
      }
      setSuccess(true);
    } catch {
      setSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-stone-200 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-[#0F2942]">استعادة كلمة المرور</h2>
          <p className="text-xs sm:text-sm text-stone-500">
            أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً آمناً لإعادة تعيين كلمة المرور
          </p>
        </div>

        {success ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <p className="text-sm font-bold">تم إرسال تعليمات الاستعادة إلى بريدك!</p>
            <p className="text-xs text-stone-600 leading-relaxed">
              يرجى مراجعة صندوق الوارد (أو مجلد الرسائل غير المرغوبة) والضغط على الرابط المرفق للمتابعة.
            </p>
            <Link
              href="/login"
              className="inline-block mt-2 px-4 py-2 bg-[#0F2942] text-white text-xs font-bold rounded-xl"
            >
              العودة لتسجيل الدخول
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 pl-9 text-sm text-right focus:ring-2 focus:ring-[#0F2942] focus:outline-none"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#0F2942] hover:bg-[#0A3A40] text-white font-bold rounded-xl shadow transition disabled:opacity-50 text-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link href="/login" className="text-xs text-stone-500 hover:text-stone-800">
            تذكرت كلمة المرور؟ <span className="font-bold underline">تسجيل الدخول</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
