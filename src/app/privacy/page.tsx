import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, Trash2 } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      
      <div className="space-y-2 border-b border-stone-200 pb-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          حماية البيانات والخصوصية
        </div>
        <h1 className="text-3xl font-black text-[#0F2942]">سياسة الخصوصية لمنصة سَكَن</h1>
        <p className="text-xs text-stone-500">آخر تحديث: أكتوبر 2026</p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 text-sm text-stone-700 leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900">١. مبدأ تقليل البيانات (Data Minimization)</h2>
          <p>
            تلتزم سَكَن بجمع الحد الأدنى من البيانات الضرورية فقط لتشغيل المنصة والتواصل بين الباحث عن سكن وصاحب السكن. نحن لا نطلب صورة بطاقة الرقم القومي افتراضياً، ولا نقوم بتخزين أي بيانات بطاقات ائتمانية أو تفاصيل مصرفية نظراً لعدم وجود دفع إلكتروني داخل المنصة.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900">٢. حماية أرقام الهواتف والعناوين الدقيقة</h2>
          <p>
            رقم هاتفك المحمول لا يظهر للعامة افتراضياً، ويكون التواصل حصرياً داخل المحادثات الخاصة المشفرة على المنصة. لا يتم الكشف عن رقم الهاتف إلا إذا قام صاحب السكن بتفعيل هذا الخيار برغبته الصريحة. كما أن العنوان التفصيلي الدقيق للوحدة يظل خاصاً ولا يظهر على الخريطة العامة.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900">٣. سرية المحادثات الخاصة</h2>
          <p>
            المحادثات الخاصة بين المستخدمين مشفرة ومحمية بسياسات الوصول على مستوى الصف (RLS). لا يملك مسؤولو المنصة إمكانية التجسس أو المراقبة الشاملة على رسائل المستخدمين، ويقتصر الاطلاع فقط على الرسائل المرفقة كدليل رسمي في بلاغات الشكاوى المعتمدة.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900">٤. حق حذف الحساب والبيانات</h2>
          <p>
            يحق لأي مستخدم في أي وقت طلب حذف حسابه نهائياً من خلال لوحة التحكم الخاصة به، وسيتم شطب كافة إعلاناته ورسائله وسجلاته بشكل لا رجعة فيه وفقاً لمعايير الأمان الدولية.
          </p>
        </section>

        <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span>سَكَن — جمهورية مصر العربية</span>
          <Link href="/contact" className="text-[#0F2942] font-bold hover:underline">
            تواصل مع مسؤول حماية البيانات
          </Link>
        </div>

      </div>

    </div>
  );
}
