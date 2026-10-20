'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, X, LogIn, UserPlus, ShieldCheck } from 'lucide-react';

interface RequireAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  redirectUrl?: string;
}

export default function RequireAuthModal({
  isOpen,
  onClose,
  title = 'تسجيل الدخول مطلوب للمتابعة',
  description = 'لحماية خصوصيتك ومنع السماسرة والوسطاء، يجب تسجيل الدخول للتواصل المباشر مع أصحاب السكن أو نشر إعلانات وطلبات.',
  redirectUrl = '/listings',
}: RequireAuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition"
          title="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center mt-1 sm:mt-2">
          <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        <div className="space-y-1.5">
          <h3 className="font-bold text-stone-900 text-base">{title}</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200/80 p-2.5 rounded-xl text-[11px] text-emerald-800 flex items-center gap-1.5 text-right">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>منصة سَكَن مباشرة بالكامل وبدون أي عمولات أو وساطة.</span>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Link
            href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
            className="w-full py-2.5 bg-[#0F2942] hover:bg-[#0A3A40] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>تسجيل الدخول الآن</span>
          </Link>
          <Link
            href={`/signup?redirect=${encodeURIComponent(redirectUrl)}`}
            className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>حساب جديد في ثوانٍ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
