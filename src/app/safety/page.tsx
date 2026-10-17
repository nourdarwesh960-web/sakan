import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Check, 
  X, 
  Eye, 
  FileText, 
  DollarSign, 
  Flag,
  ArrowLeft 
} from 'lucide-react';

export default function SafetyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>ميثاق الأمان وحماية المستأجر</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0F2942]">
          سكنك أقرب. وحقك محفوظ.
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          دليلك الشامل للمعاينة الآمنة، وتجنب السماسرة، وحماية نفسك من أي احتيال أثناء البحث عن سكن في مصر.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <h2 className="text-lg font-bold text-stone-900">ما نضمنه لك في سَكَن:</h2>
          <ul className="space-y-3 text-xs sm:text-sm text-stone-600">
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>بدون أي عمولات:</strong> المنصة مجانية ١٠٠٪ ولا نتقاضى أي نسبة من الإيجار.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>تواصل مباشر:</strong> التحدث مباشرة مع صاحب السكن أو المؤجر الفعلي.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>شفافية الأسعار:</strong> لا توجد رسوم خفية أو مصاريف معاينة غير معلنة.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>رقابة صارمة:</strong> حظر فوري لأي سمسار يطلب عمولة أو يحاول استغلال الطلبة.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
            <XCircle className="w-6 h-6 text-rose-600" />
          </div>
          <h2 className="text-lg font-bold text-stone-900">ممنوعات لا تتهاون فيها أبداً:</h2>
          <ul className="space-y-3 text-xs sm:text-sm text-stone-600">
            <li className="flex items-start gap-2.5">
              <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span><strong>لا تحول عربون مسبق:</strong> إياك وتحويل أي مبالغ عبر المحافظ الإلكترونية أو إنستاباي قبل المعاينة.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span><strong>لا تدفع رسوم معاينة:</strong> المعاينة حق مشروع لك بدون دفع أي جنيه لصاحب الشقة.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span><strong>لا تقبل بدفع عمولة:</strong> إذا طلب منك المعلن عمولة سمسرة، فهو منتهك لقواعد سَكَن.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span><strong>لا تسلم أموال بدون عقد:</strong> لا تدفع الإيجار أو التأمين إلا بعد استلام نسخة عقد الإيجار الموقع.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Inspection Checklist */}
      <section id="verification" className="bg-stone-50 rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-black text-[#0F2942] flex items-center gap-2">
          <Eye className="w-5 h-5 text-[#0A3A40]" />
          قائمة المعاينة الآمنة على أرض الواقع
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2">
            <span className="font-bold text-stone-900 block text-sm">١. أوراق الملكية والهوية</span>
            <p className="text-stone-600 leading-relaxed">
              تأكد من هوية الشخص المقابل ومطابقة عقد ملكيته للشقة أو توكيله الرسمي قبل توقيع أي عقد.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2">
            <span className="font-bold text-stone-900 block text-sm">٢. فحص المرافق والأجهزة</span>
            <p className="text-stone-600 leading-relaxed">
              جرّب صنابير المياه، سخان الحمام، مفاتيح الكهرباء، والتكييف للتأكد من سلامتها قبل الاتفاق.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2">
            <span className="font-bold text-stone-900 block text-sm">٣. توثيق التأمين في العقد</span>
            <p className="text-stone-600 leading-relaxed">
              اكتب قيمة مبلغ التأمين المسترد كتابة واضحة في بند مستقل داخل عقد الإيجار وتاريخ استرداده.
            </p>
          </div>
        </div>
      </section>

      {/* Reporting Action */}
      <div className="bg-[#0F2942] text-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2 max-w-xl text-center md:text-right">
          <h3 className="text-xl font-bold flex items-center justify-center md:justify-start gap-2">
            <Flag className="w-5 h-5 text-amber-400" />
            واجهت سمساراً أو محاولة استغلال؟
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            ساعدنا في إبقاء سَكَن نظيفاً وآمناً للجميع. أرسل لنا لقطة الشاشة أو رقم الإعلان وسيتولى فريقنا التحقق فوراً.
          </p>
        </div>
        <Link
          href="/complaints/new"
          className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow transition shrink-0"
        >
          الإبلاغ عن سمسار الآن
        </Link>
      </div>

    </div>
  );
}
