import React from 'react';
import Link from 'next/link';
import { Home, Search, Building } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 p-8 text-center space-y-5 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-stone-100 text-[#0F2942] flex items-center justify-center mx-auto font-black text-2xl">
          ٤٠٤
        </div>
        
        <div className="space-y-1">
          <h1 className="text-xl font-black text-stone-900">الصفحة المطلوبة غير موجودة</h1>
          <p className="text-xs text-stone-500 leading-relaxed">
            ربما تم نقل الصفحة أو حذف الإعلان المطلوب، أو أن الرابط غير صحيح.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Link
            href="/"
            className="flex-1 py-2.5 bg-[#0F2942] hover:bg-[#0A3A40] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            الصفحة الرئيسية
          </Link>
          <Link
            href="/listings"
            className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            تصفح السكن
          </Link>
        </div>
      </div>
    </div>
  );
}
