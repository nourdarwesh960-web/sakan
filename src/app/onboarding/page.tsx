'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Key, 
  Check, 
  CheckCircle2, 
  ArrowLeft, 
  Search, 
  PlusCircle, 
  Compass, 
  ShieldCheck 
} from 'lucide-react';

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<'seeker' | 'provider'>('seeker');
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  const toggleStep = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) {
      setCompletedSteps(completedSteps.filter((s) => s !== stepNumber));
    } else {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      
      {/* Welcome Banner */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-black text-[#0F2942]">أهلاً بك في منصة سَكَن!</h1>
        <p className="text-stone-600 text-sm max-w-lg mx-auto leading-relaxed">
          خطوة واحدة تفصلك عن تجربة سكن مباشرة ومريحة في مصر. اختر تفضيلك الأولي وسنساعدك في إنجاز الباقي.
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Seeker Card */}
        <button
          onClick={() => setSelectedRole('seeker')}
          className={`p-6 rounded-2xl border text-right transition flex flex-col justify-between ${
            selectedRole === 'seeker'
              ? 'border-[#0F2942] bg-[#0F2942]/5 ring-2 ring-[#0F2942]'
              : 'border-stone-200 bg-white hover:border-stone-300'
          }`}
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F2942] text-white flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-stone-900">بدور على سكن</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              طالب جامعي أو موظف مغترب أبحث عن غرفة، سرير في سكن شباب/بنات، أو استوديو مستقل بدون دفع عمولات لسماسرة.
            </p>
          </div>
          <span className="mt-4 text-xs font-bold text-[#0F2942] inline-flex items-center gap-1.5">
            {selectedRole === 'seeker' && <Check className="w-3.5 h-3.5" />}
            {selectedRole === 'seeker' ? 'تم الاختيار' : 'تحديد هذا الخيار'}
          </span>
        </button>

        {/* Provider Card */}
        <button
          onClick={() => setSelectedRole('provider')}
          className={`p-6 rounded-2xl border text-right transition flex flex-col justify-between ${
            selectedRole === 'provider'
              ? 'border-[#0F2942] bg-[#0F2942]/5 ring-2 ring-[#0F2942]'
              : 'border-stone-200 bg-white hover:border-stone-300'
          }`}
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A3A40] text-white flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-stone-900">عايز أعرض سكن</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              صاحب شقة أو غرفة أو سرير متاح، وأريد تأجيره لطلبة أو موظفين جادين ومحترمين مباشرة وبدون وسيط.
            </p>
          </div>
          <span className="mt-4 text-xs font-bold text-[#0F2942] inline-flex items-center gap-1.5">
            {selectedRole === 'provider' && <Check className="w-3.5 h-3.5" />}
            {selectedRole === 'provider' ? 'تم الاختيار' : 'تحديد هذا الخيار'}
          </span>
        </button>

      </div>

      {/* Onboarding Checklist */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h3 className="font-bold text-stone-900 text-base">قائمة البدء السريع</h3>
            <p className="text-xs text-stone-500">أكمل الخطوات التالية لتحقيق أقصى استفادة من حسابك</p>
          </div>
          <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            {completedSteps.length} من 4 مكتملة
          </div>
        </div>

        <div className="space-y-4">
          
          {/* Step 1 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50">
            <input
              type="checkbox"
              checked={completedSteps.includes(1)}
              onChange={() => toggleStep(1)}
              className="mt-1 rounded text-[#0F2942] focus:ring-0 cursor-pointer"
            />
            <div className="flex-1">
              <h4 className="font-bold text-stone-800 text-sm">إنشاء الحساب الأساسي</h4>
              <p className="text-xs text-stone-500">تم تسجيل بياناتك وتأكيدها بنجاح.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50">
            <input
              type="checkbox"
              checked={completedSteps.includes(2)}
              onChange={() => toggleStep(2)}
              className="mt-1 rounded text-[#0F2942] focus:ring-0 cursor-pointer"
            />
            <div className="flex-1">
              <h4 className="font-bold text-stone-800 text-sm">إكمال النبذة وتفضيلات السكن</h4>
              <p className="text-xs text-stone-500">أضف نبذة قصيرة ومحافظتك المفضلة لتسهيل التواصل.</p>
              <Link href="/profile" className="text-xs font-bold text-[#0F2942] hover:underline inline-block mt-1">
                تعديل الملف الشخصي
              </Link>
            </div>
          </div>

          {/* Step 3 - Role specific */}
          {selectedRole === 'seeker' ? (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50">
              <input
                type="checkbox"
                checked={completedSteps.includes(3)}
                onChange={() => toggleStep(3)}
                className="mt-1 rounded text-[#0F2942] focus:ring-0 cursor-pointer"
              />
              <div className="flex-1">
                <h4 className="font-bold text-stone-800 text-sm">حفظ طلب سكن في "دوّرلي على سكن"</h4>
                <p className="text-xs text-stone-500">احفظ مواصفات سكنك وسنرسل لك تنبيهاً فور نشره.</p>
                <Link href="/wanted-requests" className="text-xs font-bold text-amber-700 hover:underline inline-block mt-1">
                  تسجيل طلب سكن الآن
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50">
              <input
                type="checkbox"
                checked={completedSteps.includes(3)}
                onChange={() => toggleStep(3)}
                className="mt-1 rounded text-[#0F2942] focus:ring-0 cursor-pointer"
              />
              <div className="flex-1">
                <h4 className="font-bold text-stone-800 text-sm">نشر أول إعلان سكن</h4>
                <p className="text-xs text-stone-500">أضف تفاصيل وحدتك وصورها لتصل لآلاف الطلبة والموظفين.</p>
                <Link href="/my-listings/new" className="text-xs font-bold text-[#0F2942] hover:underline inline-block mt-1">
                  نشر إعلان سكن
                </Link>
              </div>
            </div>
          )}

          {/* Step 4 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50">
            <input
              type="checkbox"
              checked={completedSteps.includes(4)}
              onChange={() => toggleStep(4)}
              className="mt-1 rounded text-[#0F2942] focus:ring-0 cursor-pointer"
            />
            <div className="flex-1">
              <h4 className="font-bold text-stone-800 text-sm">الاطلاع على ميثاق الأمان ومنع العمولات</h4>
              <p className="text-xs text-stone-500">قواعد المعاينة الآمنة وكيف تضمن حقك دون دفع أي رسوم سمسار.</p>
              <Link href="/safety" className="text-xs font-bold text-emerald-700 hover:underline inline-block mt-1">
                قراءة إرشادات الأمان
              </Link>
            </div>
          </div>

        </div>

        {/* Completion Action */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <Link
            href="/listings"
            className="text-xs text-stone-500 hover:text-stone-800 font-medium"
          >
            تخطي والمتابعة لاحقاً
          </Link>
          <Link
            href={selectedRole === 'provider' ? '/my-listings/new' : '/listings'}
            className="px-6 py-2.5 bg-[#0F2942] hover:bg-[#0A3A40] text-white font-bold rounded-xl text-sm flex items-center gap-1.5 shadow transition"
          >
            <span>ابدأ الآن</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

      </div>

    </div>
  );
}
