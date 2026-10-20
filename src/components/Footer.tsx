import React from 'react';
import Link from 'next/link';
import { ShieldCheck, HeartHandshake, PhoneCall, HelpCircle, MapPin } from 'lucide-react';
import { EGYPT_GOVERNORATES } from '@/types/database';

export default function Footer() {
  const topGovernorates = EGYPT_GOVERNORATES.slice(0, 8);

  return (
    <footer className="bg-[#0F2942] text-white border-t border-stone-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-700/60">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-[#0F2942] font-black text-xl shadow">
                سَ
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                سَكَن
              </span>
            </div>
            <p className="text-stone-300 text-sm leading-relaxed">
              منصة السكن المباشر الأولى في مصر للطلبة والشباب المغتربين. نوصل الباحث عن سكن بصاحب السكن مباشرة، بدون سماسرة وبدون عمولات.
            </p>
          </div>

          {/* Governorates */}
          <div>
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              أشهر المحافظات
            </h3>
            <ul className="space-y-2 text-sm text-stone-300">
              {topGovernorates.map((gov) => (
                <li key={gov.id}>
                  <Link 
                    href={`/listings?governorate=${encodeURIComponent(gov.nameAr)}`}
                    className="hover:text-amber-400 transition"
                  >
                    سكن في {gov.nameAr}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust and Safety */}
          <div>
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4" />
              الأمان ومكافحة السماسرة
            </h3>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>
                <Link href="/safety" className="hover:text-amber-400 transition">
                  ميثاق منع العمولات
                </Link>
              </li>
              <li>
                <Link href="/safety#verification" className="hover:text-amber-400 transition">
                  إرشادات المعاينة الآمنة
                </Link>
              </li>
              <li>
                <Link href="/complaints/new" className="hover:text-rose-400 text-rose-300 transition flex items-center gap-1">
                  الإبلاغ عن سمسار أو احتيال
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-amber-400 transition">
                  سياسة الخصوصية وحماية البيانات
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-400 transition">
                  شروط الاستخدام
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Support */}
          <div>
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              المساعدة والتواصل
            </h3>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>
                <Link href="/#faq" className="hover:text-amber-400 transition">
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link href="/wanted-requests" className="hover:text-amber-400 transition">
                  خدمة "دوّرلي على سكن"
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition">
                  مركز خدمة المستخدمين
                </Link>
              </li>
              <li className="pt-1">
                <a 
                  href="tel:01062127372" 
                  className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold text-xs" 
                  dir="ltr"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>01062127372</span>
                </a>
              </li>
              <li className="pt-1 text-xs text-stone-400 leading-normal">
                مواعيد الدعم: يومياً من ٩ ص إلى ١٠ م بتوقيت القاهرة
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>
            جميع الحقوق محفوظة منصة سَكَن © 2026 — جمهورية مصر العربية.
          </p>
          <div className="text-center md:text-left text-stone-400">
            جميع الأسعار بالجنيه المصري (EGP). سَكَن منصة وساطة مجتمعية مباشرة ولا تقدم خدمات دفع إلكتروني أو حفظ أموال.
          </div>
        </div>

      </div>
    </footer>
  );
}
