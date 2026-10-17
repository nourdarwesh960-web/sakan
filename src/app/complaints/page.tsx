'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, Flag, PlusCircle, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Complaint } from '@/types/database';
import { formatDateArabic } from '@/lib/utils';

export default function ComplaintsHistoryPage() {
  const [complaints] = useState<Complaint[]>([
    {
      id: 'comp-1',
      reporter_id: 'user-current',
      category: 'brokerage_commission',
      description: 'المعلن طلب مبلغ 500 جنيه رسوم معاينة مسبقة قبل رؤية الشقة في الدقي.',
      status: 'under_review',
      created_at: '2026-10-15T14:00:00.000Z',
      updated_at: '2026-10-16T10:00:00.000Z',
    }
  ]);

  const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    submitted: { label: 'تم الاستلام', color: 'bg-stone-100 text-stone-700', icon: <Clock className="w-3.5 h-3.5" /> },
    under_review: { label: 'قيد الفحص والمراجعة', color: 'bg-amber-100 text-amber-800', icon: <Clock className="w-3.5 h-3.5 text-amber-600" /> },
    awaiting_info: { label: 'بانتظار معلومات إضافية', color: 'bg-blue-100 text-blue-800', icon: <AlertCircle className="w-3.5 h-3.5 text-blue-600" /> },
    resolved: { label: 'تم اتخاذ الإجراء والحل', color: 'bg-emerald-100 text-emerald-800', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> },
    rejected: { label: 'مرفوض لعدم كفاية الأدلة', color: 'bg-rose-100 text-rose-800', icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> },
    escalated: { label: 'مُصعد للإدارة القانونية', color: 'bg-purple-100 text-purple-800', icon: <AlertCircle className="w-3.5 h-3.5 text-purple-600" /> },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-[#0F2942]">سجل الشكاوى والبلاغات</h1>
          <p className="text-xs sm:text-sm text-stone-500">
            متابعة البلاغات المقدمة من طرفك وإجراءات فريق التحقق
          </p>
        </div>

        <Link
          href="/complaints/new"
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          تقديم بلاغ جديد
        </Link>
      </div>

      {complaints.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-3">
          <ShieldAlert className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-sm font-bold text-stone-800">ليس لديك أي بلاغات مسجلة</h3>
          <p className="text-xs text-stone-500">
            إذا واجهت أي طلب لعمولة سمسار أو طلب تحويل أموال مسبقة، لا تتردد في الإبلاغ لحماية المجتمع.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => {
            const statusConfig = STATUS_MAP[c.status] || STATUS_MAP.submitted;
            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-800 text-sm">
                      {c.category === 'brokerage_commission' ? 'طلب عمولة سمسار' : c.category}
                    </span>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${statusConfig.color}`}>
                      {statusConfig.icon}
                      {statusConfig.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400">
                    {formatDateArabic(c.created_at)}
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-100">
                  {c.description}
                </p>

                {c.resolution_notes && (
                  <div className="bg-emerald-50 text-emerald-900 p-3 rounded-xl text-xs border border-emerald-200">
                    <span className="font-bold block mb-1">قرار فريق المراجعة:</span>
                    {c.resolution_notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
