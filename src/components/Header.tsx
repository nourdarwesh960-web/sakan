'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home, 
  Search, 
  PlusCircle, 
  Bell, 
  MessageSquare, 
  ShieldCheck, 
  User, 
  Menu, 
  X,
  Compass,
  Bookmark
} from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-[#0F2942] flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:bg-[#0A3A40] transition">
                سَ
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-[#0F2942] group-hover:text-[#0A3A40] transition">
                  سَكَن
                </span>
                <span className="text-[10px] text-amber-700 font-medium -mt-1">
                  بدون عمولات سماسرة
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-stone-700">
              <Link 
                href="/listings" 
                className="px-3 py-2 rounded-lg hover:bg-stone-100 hover:text-[#0F2942] transition flex items-center gap-1.5"
              >
                <Search className="w-4 h-4 text-stone-500" />
                تصفح السكن
              </Link>
              <Link 
                href="/wanted-requests" 
                className="px-3 py-2 rounded-lg hover:bg-stone-100 hover:text-[#0F2942] transition flex items-center gap-1.5"
              >
                <Compass className="w-4 h-4 text-[#0F2942]" />
                <span>دوّرلي على سكن</span>
              </Link>
              <Link 
                href="/safety" 
                className="px-3 py-2 rounded-lg hover:bg-stone-100 hover:text-[#0F2942] transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                حقك محفوظ
              </Link>
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/messages"
              className="p-2 text-stone-600 hover:text-[#0F2942] hover:bg-stone-100 rounded-lg relative transition"
              title="المحادثات"
            >
              <MessageSquare className="w-5 h-5" />
            </Link>

            <Link
              href="/notifications"
              className="p-2 text-stone-600 hover:text-[#0F2942] hover:bg-stone-100 rounded-lg relative transition"
              title="الإشعارات"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
            </Link>

            <Link
              href="/login"
              className="px-3 py-2 text-sm font-medium text-stone-700 hover:text-[#0F2942] hover:bg-stone-100 rounded-lg transition"
            >
              تسجيل الدخول
            </Link>

            <Link
              href="/my-listings/new"
              className="px-4 py-2 text-sm font-semibold text-white bg-[#0F2942] hover:bg-[#0A3A40] rounded-xl shadow-sm flex items-center gap-1.5 transition"
            >
              <PlusCircle className="w-4 h-4" />
              اعرض سكنك مجاناً
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/my-listings/new"
              className="px-2.5 py-1.5 text-xs font-semibold text-white bg-[#0F2942] rounded-lg shadow-sm"
            >
              اعرض سكنك
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 rounded-lg focus:outline-none"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            href="/listings"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-800 hover:bg-stone-100 text-sm font-medium"
          >
            <Search className="w-4 h-4 text-stone-500" />
            تصفح السكن
          </Link>
          <Link
            href="/wanted-requests"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-800 hover:bg-stone-100 text-sm font-medium"
          >
            <Compass className="w-4 h-4 text-amber-600" />
            دوّرلي على سكن
          </Link>
          <Link
            href="/messages"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-800 hover:bg-stone-100 text-sm font-medium"
          >
            <MessageSquare className="w-4 h-4 text-stone-500" />
            المحادثات الخاصة
          </Link>
          <Link
            href="/notifications"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-800 hover:bg-stone-100 text-sm font-medium"
          >
            <Bell className="w-4 h-4 text-stone-500" />
            الإشعارات
          </Link>
          <Link
            href="/safety"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-800 hover:bg-stone-100 text-sm font-medium"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            ميثاق الأمان وبدون عمولات
          </Link>
          <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2 text-sm font-medium text-stone-700 bg-stone-50 rounded-lg"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2 text-sm font-semibold text-white bg-[#0F2942] rounded-lg"
            >
              إنشاء حساب جديد
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
