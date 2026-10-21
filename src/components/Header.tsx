'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  PlusCircle, 
  Bell, 
  MessageSquare, 
  ShieldCheck, 
  User, 
  Menu, 
  X,
  Compass,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/lib/use-auth';
import { getStoredNotifications } from '@/lib/notification-service';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logoutUser } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const updateCount = () => {
    try {
      const list = getStoredNotifications(user?.id);
      const count = list.filter((n) => !n.is_read).length;
      setUnreadCount(count);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    updateCount();

    const handleUpdate = () => updateCount();
    window.addEventListener('sakan_notifications_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    const interval = setInterval(updateCount, 5000);

    return () => {
      window.removeEventListener('sakan_notifications_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      clearInterval(interval);
    };
  }, [user?.id]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-[#0F2942] flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-xs group-hover:bg-[#0A3A40] transition">
                سَ
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-[#0F2942] group-hover:text-[#0A3A40] transition">
                  سَكَن
                </span>
                <span className="text-[8px] sm:text-[10px] text-amber-700 font-medium -mt-1">
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
                <Search className="w-3.5 h-3.5 text-stone-500" />
                تصفح السكن
              </Link>
              <Link 
                href="/wanted-requests" 
                className="px-3 py-2 rounded-lg hover:bg-stone-100 hover:text-[#0F2942] transition flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-[#0F2942]" />
                <span>دوّرلي على سكن</span>
              </Link>
              <Link 
                href="/safety" 
                className="px-3 py-2 rounded-lg hover:bg-stone-100 hover:text-[#0F2942] transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                حقك محفوظ
              </Link>
            </nav>
          </div>

          {/* Right Header Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link
              href={isAuthenticated ? "/messages" : "/login?redirect=/messages"}
              className="p-2 text-stone-600 hover:text-[#0F2942] hover:bg-stone-100 rounded-lg relative transition"
              title="المحادثات"
            >
              <MessageSquare className="w-4 h-4" />
            </Link>

            <Link
              href={isAuthenticated ? "/notifications" : "/login?redirect=/notifications"}
              className="p-2 text-stone-600 hover:text-[#0F2942] hover:bg-stone-100 rounded-lg relative transition"
              title="الإشعارات"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-amber-500 text-[#0F2942] text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-xs animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-[#0F2942]" />
                  <span>{user?.full_name || 'حسابي'}</span>
                </Link>
                <button
                  type="button"
                  onClick={logoutUser}
                  className="px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition font-semibold"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-bold text-stone-700 hover:text-[#0F2942] hover:bg-stone-100 rounded-lg transition"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/signup"
                  className="px-3 py-1.5 text-xs font-bold text-[#0F2942] bg-stone-100 hover:bg-stone-200 rounded-xl transition"
                >
                  إنشاء حساب
                </Link>
              </div>
            )}

            <Link
              href="/my-listings/new"
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#0F2942] hover:bg-[#0A3A40] rounded-xl shadow-xs flex items-center gap-1.5 transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              اعرض سكنك مجاناً
            </Link>
          </div>

          {/* Mobile Right Bar (Compact & Easy) */}
          <div className="flex md:hidden items-center gap-1.5">
            <Link
              href={isAuthenticated ? "/notifications" : "/login?redirect=/notifications"}
              className="p-1.5 text-stone-600 hover:text-[#0F2942] rounded-lg relative"
              title="الإشعارات"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 min-w-[14px] h-3.5 bg-amber-500 text-[#0F2942] text-[9px] font-black rounded-full flex items-center justify-center px-0.5 shadow-xs">
                  {unreadCount}
                </span>
              )}
            </Link>

            <Link
              href={isAuthenticated ? "/messages" : "/login?redirect=/messages"}
              className="p-1.5 text-stone-600 hover:text-[#0F2942] rounded-lg"
              title="المحادثات"
            >
              <MessageSquare className="w-4 h-4" />
            </Link>

            <Link
              href="/my-listings/new"
              className="px-2 py-1 text-[11px] font-bold text-white bg-[#0F2942] rounded-lg shadow-xs flex items-center gap-1"
            >
              <PlusCircle className="w-3 h-3" />
              <span>اعرض سكنك</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-stone-600 hover:text-stone-900 rounded-lg focus:outline-none"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-5 space-y-1">
          <Link
            href="/listings"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-800 hover:bg-stone-50 text-xs font-semibold"
          >
            <Search className="w-3.5 h-3.5 text-stone-500" />
            <span>تصفح السكن</span>
          </Link>
          <Link
            href="/wanted-requests"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-800 hover:bg-stone-50 text-xs font-semibold"
          >
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>دوّرلي على سكن</span>
          </Link>
          <Link
            href="/messages"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-800 hover:bg-stone-50 text-xs font-semibold"
          >
            <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
            <span>المحادثات الخاصة</span>
          </Link>
          <Link
            href="/notifications"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-stone-800 hover:bg-stone-50 text-xs font-semibold"
          >
            <span className="flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-stone-500" />
              <span>الإشعارات</span>
            </span>
            {unreadCount > 0 && (
              <span className="bg-amber-500 text-[#0F2942] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </Link>
          <Link
            href="/safety"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-800 hover:bg-stone-50 text-xs font-semibold"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>ميثاق الأمان وبدون عمولات</span>
          </Link>
          
          <div className="pt-2 border-t border-stone-100 flex flex-col gap-1.5">
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 bg-stone-50 rounded-xl text-stone-800 text-xs font-bold"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#0F2942]" />
                    <span>{user?.full_name || 'الملف الشخصي'}</span>
                  </span>
                  <span className="text-[10px] text-stone-400">تعديل</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logoutUser();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl transition"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-xs font-bold text-stone-700 bg-stone-100 rounded-xl"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-xs font-bold text-white bg-[#0F2942] rounded-xl"
                >
                  إنشاء حساب
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
