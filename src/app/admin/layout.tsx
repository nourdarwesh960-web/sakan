'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  Flag, 
  ShieldCheck, 
  ScrollText, 
  ArrowRight,
  LogOut,
  Sliders
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { href: '/admin', label: 'نظرة عامة والمؤشرات', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/admin/listings', label: 'مراجعة وتدقيق الإعلانات', icon: <Building className="w-4 h-4" /> },
    { href: '/admin/complaints', label: 'إدارة الشكاوى والسماسرة', icon: <Flag className="w-4 h-4" /> },
    { href: '/admin/users', label: 'المستخدمين والحسابات', icon: <Users className="w-4 h-4" /> },
    { href: '/admin/audit-logs', label: 'سجل العمليات والرقابة (Audit)', icon: <ScrollText className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-stone-100/70">
      
      {/* Admin Top Bar */}
      <header className="bg-[#0F2942] text-white border-b border-stone-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-stone-300 hover:text-white flex items-center gap-1 text-xs">
            <ArrowRight className="w-4 h-4" />
            العودة للمنصة الرئيسية
          </Link>
          <span className="text-stone-500">|</span>
          <div className="flex items-center gap-2">
            <span className="font-black text-amber-400 text-sm">لوحة الإدارة والرقابة — سَكَن</span>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded font-bold">
              Super Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-stone-300">
          <span>المسؤول: مشرف النظام</span>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6">
        
        {/* Admin Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-white rounded-2xl border border-stone-200 p-4 space-y-1 shadow-xs shrink-0 self-start">
          <div className="px-3 py-2 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            أقسام لوحة التحكم
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  isActive
                    ? 'bg-[#0F2942] text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>

    </div>
  );
}
