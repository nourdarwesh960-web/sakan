'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Flag, 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Paperclip, 
  FileText, 
  User, 
  Building 
} from 'lucide-react';
import { Complaint, ComplaintStatus } from '@/types/database';
import { formatDateArabic } from '@/lib/utils';
import { logAdminAction } from '@/lib/data-service';

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: 'comp-101',
      reporter_id: 'user-seeker-1',
      reported_user_id: 'user-broker-suspect',
      listing_id: 'listing-suspect-broker',
      category: 'brokerage_commission',
      description: 'المعلن أصر في رسائل الشات على دفع عمولة شهر كامل (8000 ج.م) وأرسل رقم محفظة فودافون كاش لتحويل عربون المعاينة.',
      status: 'submitted',
      created_at: '2026-10-16T10:00:00.000Z',
      updated_at: '2026-10-16T12:00:00.000Z',
      evidence: [
        {
          id: 'ev-1',
          complaint_id: 'comp-101',
          file_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
          file_type: 'image/jpeg',
          created_at: '2026-10-16T10:00:00.000Z',
        }
      ]
    },
    {
      id: 'comp-102',
      reporter_id: 'user-seeker-2',
      reported_user_id: 'user-provider-unverified',
      category: 'fake_listing',
      description: 'الصور المعروضة في الإعلان غير مطابقة للشقة على الطبيعة عند المعاينة.',
      status: 'under_review',
      created_at: '2026-10-15T09:00:00.000Z',
      updated_at: '2026-10-16T12:00:00.000Z',
    }
  ]);

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [internalNote, setInternalNote] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');

  const updateStatus = async (status: ComplaintStatus) => {
    if (!selectedComplaint) return;

    setComplaints(
      complaints.map((c) => (c.id === selectedComplaint.id ? { 
        ...c, 
        status, 
        resolution_notes: resolutionNote || undefined,
        updated_at: new Date().toISOString() 
      } : c))
    );

    await logAdminAction(
      `COMPLAINT_${status.toUpperCase()}`,
      'complaint',
      selectedComplaint.id,
      { status, note: resolutionNote }
    );

    setSelectedComplaint(null);
    setResolutionNote('');
    setInternalNote('');
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F2942]">طابور فحص الشكاوى والبلاغات</h1>
          <p className="text-xs text-stone-500">
            مراجعة بلاغات السماسرة، فحص الأدلة المرفوعة، والبت في القرارات
          </p>
        </div>
      </div>

      {/* Complaints List */}
      <div className="grid grid-cols-1 gap-4">
        {complaints.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-rose-100 text-rose-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {c.category === 'brokerage_commission' ? 'طلب عمولة سمسار' : c.category}
                </span>
                <span className="text-xs text-stone-400">
                  بلاغ #{c.id} • {formatDateArabic(c.created_at)}
                </span>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700">
                الحالة: {c.status}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-100">
              {c.description}
            </p>

            {/* Evidence Preview if attached */}
            {c.evidence && c.evidence.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-stone-600 flex items-center gap-1">
                  <Paperclip className="w-3.5 h-3.5" />
                  الأدلة ولقطات الشاشة المرفقة ({c.evidence.length})
                </span>
                <div className="flex gap-2">
                  {c.evidence.map((ev) => (
                    <a
                      key={ev.id}
                      href={ev.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs text-[#0F2942] underline hover:text-amber-600"
                    >
                      معاينة لقطة الشاشة (مرفق رسمي)
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <div className="text-xs text-stone-500">
                المبلغ ضده: <span className="font-mono text-stone-700">{c.reported_user_id || 'غير محدد'}</span>
              </div>

              <button
                onClick={() => setSelectedComplaint(c)}
                className="px-4 py-2 bg-[#0F2942] hover:bg-[#0A3A40] text-white text-xs font-bold rounded-xl transition"
              >
                فحص واتخاذ قرار
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Decision Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-black text-stone-900 text-base">
                قرار المراجعة للبلاغ #{selectedComplaint.id}
              </h3>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  ملاحظات داخلية للموظفين (Staff Only):
                </label>
                <textarea
                  rows={2}
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="ملاحظات سرية لفريق الرقابة فقط لا تظهر للمستخدم..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  نص القرار الموجه لأطراف الشكوى:
                </label>
                <textarea
                  rows={2}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="تم التحقق من الأدلة وتبين مخالفة ميثاق منع السماسرة وتم إيقاف الإعلان والحساب..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => updateStatus('resolved')}
                  className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition"
                >
                  ثبوت المخالفة وحلها
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus('rejected')}
                  className="py-2.5 bg-stone-700 hover:bg-stone-800 text-white font-bold rounded-xl text-xs transition"
                >
                  رفض لعدم الكفاية
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus('escalated')}
                  className="py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition"
                >
                  تصعيد للشؤون القانونية
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
