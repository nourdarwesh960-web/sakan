'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ShieldAlert, 
  Flag, 
  CheckCircle2, 
  AlertCircle, 
  Paperclip, 
  ArrowLeft,
  ShieldCheck,
  Info
} from 'lucide-react';
import { ComplaintCategory } from '@/types/database';
import { submitComplaint, generateUUID } from '@/lib/data-service';
import { useAuth } from '@/lib/use-auth';
import AuthGuard from '@/components/AuthGuard';

function ComplaintForm() {
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const listingId = searchParams.get('listing_id') || undefined;
  const conversationId = searchParams.get('conversation_id') || undefined;
  const reportedUserId = searchParams.get('reported_user_id') || undefined;

  const [category, setCategory] = useState<ComplaintCategory>('brokerage_commission');
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const CATEGORIES: { id: ComplaintCategory; title: string; desc: string }[] = [
    {
      id: 'brokerage_commission',
      title: 'طلب عمولة سمسار أو وسيط',
      desc: 'المعلن طلب نسبة من الإيجار أو عمولة سمسرة بالمخالفة لميثاق سَكَن.',
    },
    {
      id: 'fraud_payment',
      title: 'طلب تحويل أموال مسبقة أو احتيال',
      desc: 'طلب تحويل عربون أو رسوم معاينة عبر فودافون كاش أو إنستاباي قبل المعاينة.',
    },
    {
      id: 'fake_listing',
      title: 'إعلان وهمي أو غير حقيقي',
      desc: 'الصور غير مطابقة للواقع، أو السكن غير موجود أو تم تأجيره.',
    },
    {
      id: 'incorrect_price',
      title: 'سعر غير حقيقي أو مفاجئ',
      desc: 'السعر المطلوب على أرض الواقع يختلف تماماً عن السعر المكتوب في الإعلان.',
    },
    {
      id: 'harassment',
      title: 'مضايقات أو سلوك مسيء',
      desc: 'رسائل غير لائقة أو انتهاك لخصوصية المستخدم داخل الشات.',
    },
    {
      id: 'other',
      title: 'مخالفة أو قلق أمني آخر',
      desc: 'أي مخاوف أخرى تتعلق بالأمان أو مصداقية السكن.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!description.trim() || description.trim().length < 15) {
      setFormError('يرجى كتابة تفاصيل واضحة لا تقل عن 15 حرفاً لمساعدة فريق التحقق');
      return;
    }

    setIsSubmitting(true);

    try {
      await submitComplaint({
        reporter_id: user?.id,
        category,
        description: description.trim(),
        listing_id: listingId,
        conversation_id: conversationId,
        reported_user_id: reportedUserId,
        evidence: evidenceUrl ? [{
          id: generateUUID(),
          complaint_id: '',
          file_url: evidenceUrl,
          file_type: 'image/jpeg',
          created_at: new Date().toISOString(),
        }] : [],
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/complaints');
      }, 1500);
    } catch {
      setFormError('حدث خطأ أثناء إرسال البلاغ، يرجى المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-lg">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          مركز الأمان ومكافحة المخالفات
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0F2942]">تقديم بلاغ أو شكوى</h1>
        <p className="text-xs sm:text-sm text-stone-500">
          نأخذ بلاغات السماسرة والاحتيال بمنتهى الجدية ويتم مراجعتها من قِبل فريق الإشراف المختص.
        </p>
      </div>

      {/* Educational Notice */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-2 text-xs text-stone-600">
        <h3 className="font-bold text-stone-900 flex items-center gap-1.5 text-sm">
          <Info className="w-4 h-4 text-amber-600" />
          إرشادات التحقق العادل في سَكَن:
        </h3>
        <ul className="list-disc list-inside space-y-1 text-stone-600">
          <li>منصة سَكَن لا تتقاضى أي عمولة وتمنع دخول السماسرة والوسطاء التجاريين تماماً.</li>
          <li>تقديم البلاغ لا يعني التعليق التلقائي للحساب المبلغ عنه؛ بل يخضع لفحص دقيق لضمان العدالة للطرفين.</li>
          <li>إرفاق لقطة شاشة لطلب التحويل أو طلب العمولة يساعد فريقنا في اتخاذ إجراء فوري وحاسم.</li>
        </ul>
      </div>

      {formError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>تم استلام بلاغك بنجاح وسيباشر فريق الإشراف مراجعته فوراً.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
        
        {/* Category Selection */}
        <div>
          <label className="text-xs font-bold text-stone-800 block mb-2">نوع المخالفة أو البلاغ:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`p-3.5 rounded-2xl border text-right transition flex flex-col justify-between ${
                  category === cat.id
                    ? 'border-rose-600 bg-rose-50/50 ring-1 ring-rose-600'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                }`}
              >
                <div className="font-bold text-stone-900 text-xs sm:text-sm">{cat.title}</div>
                <div className="text-[11px] text-stone-500 mt-1 leading-normal">{cat.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-bold text-stone-800 block mb-1">
            تفاصيل الواقعة بدقة
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="اشرح ما حدث بالضبط: هل تم طلب عمولة؟ كم المبلغ المطلوب؟ ما هي طريقة التواصل؟"
            className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-sm focus:ring-1 focus:ring-rose-600 focus:outline-none"
          />
        </div>

        {/* Evidence Link / Attachment */}
        <div>
          <label className="text-xs font-bold text-stone-800 block mb-1">
            رابط لقطة شاشة أو دليل <span className="font-normal text-stone-400">(اختياري ولكن يُفضل بشدة)</span>
          </label>
          <div className="relative">
            <input
              type="url"
              dir="ltr"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              placeholder="https://example.com/screenshot.jpg"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 pl-9 text-xs text-right focus:outline-none"
            />
            <Paperclip className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          </div>
          <p className="text-[10px] text-stone-400 mt-1">
            الأدلة تبقى سرية تماماً ومحمية ولا تظهر للعامة أو للطرف المشكو في حقه.
          </p>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <Link
            href="/"
            className="text-xs text-stone-500 hover:text-stone-800 font-semibold"
          >
            إلغاء
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow transition disabled:opacity-50 flex items-center gap-1.5"
          >
            {isSubmitting ? 'جاري إرسال البلاغ...' : 'إرسال البلاغ للمراجعة'}
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
}

export default function NewComplaintPage() {
  return (
    <AuthGuard fallbackMessage="يجب تسجيل الدخول لتقديم بلاغ رسمي والتحقق من هوية صاحب البلاغ." redirectUrl="/complaints/new">
      <React.Suspense fallback={<div className="p-12 text-center text-xs text-stone-500">جاري تحميل نموذج البلاغ...</div>}>
        <ComplaintForm />
      </React.Suspense>
    </AuthGuard>
  );
}
