'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, UserPlus, ShieldAlert, Lock } from 'lucide-react';
import { useAuth } from '@/lib/use-auth';

interface AuthGuardProps {
  children: React.ReactNode;
  fallbackMessage?: string;
  redirectUrl?: string;
}

export default function AuthGuard({
  children,
  fallbackMessage = 'يجب تسجيل الدخول أولاً لتتمكن من استخدام هذه الميزة وإتمام العملية.',
  redirectUrl = '/login',
}: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-stone-200 border-t-[#0F2942] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white border border-stone-200 rounded-3xl shadow-lg text-center space-y-5">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center">
          <Lock className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg sm:text-xl font-black text-[#0F2942]">تسجيل الدخول مطلوب</h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {fallbackMessage}
          </p>
        </div>

        <div className="bg-stone-50 border border-stone-100 p-3 sm:p-3.5 rounded-2xl text-[11px] text-stone-500 flex items-center gap-2 text-right">
          <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
          <span>لحماية المستخدمين ومكافحة السماسرة، يتطلب سَكَن تسجيل الدخول للتحقق من هوية المتواصلين والمعلنين.</span>
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <Link
            href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
            className="w-full py-2.5 sm:py-3 bg-[#0F2942] hover:bg-[#0A3A40] text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 shadow"
          >
            <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>تسجيل الدخول إلى حسابك</span>
          </Link>
          <Link
            href={`/signup?redirect=${encodeURIComponent(redirectUrl)}`}
            className="w-full py-2 sm:py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2"
          >
            <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>إنشاء حساب جديد مجاناً</span>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
