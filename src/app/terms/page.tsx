import React from 'react';
import Link from 'next/link';
import { FileText, ShieldAlert } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      
      <div className="space-y-2 border-b border-stone-200 pb-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg">
          <FileText className="w-4 h-4 text-amber-600" />
          شروط وقواعد الاستخدام
        </div>
        <h1 className="text-3xl font-black text-[#0F2942]">شروط الاستخدام وميثاق منع العمولات</h1>
        <p className="text-xs text-stone-500">آخر تحديث: أكتوبر 2026</p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 text-sm text-stone-700 leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900">١. طبيعة منصة سَكَن</h2>
          <p>
            سَكَن هي منصة رقمية مجتمعية مباشرة تهدف إلى ربط الباحثين عن سكن (الطلبة والموظفين المغتربين) بأصحاب العقارات والشقق في مصر. سَكَن ليست وسيطاً عقارياً، ولا مكتب سمسرة، ولا تتقاضى أي نسبة أو عمولة من مبالغ الإيجار.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900">٢. الحظر القاطع للعمولات والسمسرة التجارية</h2>
          <p>
            يُحظر تماماً على أي مستخدم استغلال المنصة لطلب عمولات وساطة، أو فرض رسوم معاينة، أو ممارسة السمسرة العقارية التجارية غير المصرح بها. أي مستخدم يثبت بالدليل القاطع طلبه لعمولة من مستأجر، يتم إيقاف حسابه وحجب إعلاناته نهائياً.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900">٣. عدم تقديم خدمات الضمان المالي أو الدفع</h2>
          <p>
            المنصة لا تقدم خدمات دفع إلكتروني أو حفظ أموال التأمين (Escrow). كافة المعاملات المالية وكتابة عقود الإيجار تقع على عاتق الطرفين مباشرة، وننصح دائماً بالمعاينة الشخصية قبل دفع أي مبالغ.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900">٤. صحة البيانات المنشورة</h2>
          <p>
            يتعهد المعلن بصحة صور ومواصفات السكن وأسعاره، وعدم نشر إعلانات مضللة أو غير حقيقية، وتحتفظ إدارة سَكَن بالحق في حذف أي إعلان يخالف معايير الجودة وميثاق الأمان.
          </p>
        </section>

      </div>

    </div>
  );
}
