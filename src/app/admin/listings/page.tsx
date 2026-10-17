'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building, 
  Search, 
  CheckCircle2, 
  XCircle, 
  PauseCircle, 
  Eye, 
  MapPin, 
  AlertCircle 
} from 'lucide-react';
import { Listing } from '@/types/database';
import { formatCurrencyEGP, formatDateArabic, HOUSING_TYPE_LABELS, STATUS_LABELS } from '@/lib/utils';
import { logAdminAction } from '@/lib/data-service';

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [rejectingListing, setRejectingListing] = useState<Listing | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = async (listing: Listing) => {
    setListings(
      listings.map((l) => (l.id === listing.id ? { ...l, status: 'published', rejection_reason: undefined } : l))
    );
    await logAdminAction('APPROVE_LISTING', 'listing', listing.id, { title: listing.title });
  };

  const handleConfirmReject = async () => {
    if (!rejectingListing) return;

    setListings(
      listings.map((l) => (l.id === rejectingListing.id ? { 
        ...l, 
        status: 'rejected', 
        rejection_reason: rejectionReason || 'مخالفة معايير النشر وميثاق منع العمولات' 
      } : l))
    );

    await logAdminAction('REJECT_LISTING', 'listing', rejectingListing.id, { 
      title: rejectingListing.title,
      reason: rejectionReason 
    });

    setRejectingListing(null);
    setRejectionReason('');
  };

  const filtered = listings.filter((l) => {
    if (filterStatus === 'all') return true;
    return l.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Title & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F2942]">تدقيق وإشراف الإعلانات</h1>
          <p className="text-xs text-stone-500">
            مراجعة مطابقة الأسعار، التحقق من عدم وجود سماسرة، وإيقاف الإعلانات المخالفة
          </p>
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 text-xs font-semibold">
          {['all', 'published', 'rejected', 'paused'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterStatus === st ? 'bg-[#0F2942] text-white' : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              {st === 'all' ? 'الكل' : STATUS_LABELS[st]?.label || st}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Moderation Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold">
              <tr>
                <th className="p-3.5">عنوان الإعلان والموقع</th>
                <th className="p-3.5">النوع</th>
                <th className="p-3.5">الإيجار</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5">تاريخ النشر</th>
                <th className="p-3.5 text-center">الإجراءات والرقابة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-400 text-xs">
                    لا توجد إعلانات مطابقة للمراجعة حالياً
                  </td>
                </tr>
              ) : (
                filtered.map((l) => (
                <tr key={l.id} className="hover:bg-stone-50/60 transition">
                  <td className="p-3.5 font-bold text-stone-900">
                    <Link href={`/listings/${l.id}`} className="hover:text-[#0A3A40] block line-clamp-1">
                      {l.title}
                    </Link>
                    <div className="text-[11px] text-stone-500 font-normal">
                      {l.governorate} — {l.area}
                    </div>
                    {l.rejection_reason && (
                      <div className="text-[10px] text-rose-600 font-medium mt-1">
                        سبب الرفض: {l.rejection_reason}
                      </div>
                    )}
                  </td>
                  <td className="p-3.5 text-stone-600">
                    {HOUSING_TYPE_LABELS[l.housing_type]}
                  </td>
                  <td className="p-3.5 font-bold text-[#0F2942]">
                    {formatCurrencyEGP(l.monthly_rent)}
                  </td>
                  <td className="p-3.5">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${STATUS_LABELS[l.status]?.color || 'bg-stone-100'}`}>
                      {STATUS_LABELS[l.status]?.label || l.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-stone-400">
                    {formatDateArabic(l.created_at)}
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        href={`/listings/${l.id}`}
                        className="p-1 text-stone-500 hover:text-stone-800 transition"
                        title="معاينة الإعلان"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {l.status !== 'published' && (
                        <button
                          onClick={() => handleApprove(l)}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[11px] font-semibold transition flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          نشر
                        </button>
                      )}

                      {l.status !== 'rejected' && (
                        <button
                          onClick={() => setRejectingListing(l)}
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-[11px] font-semibold transition flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          رفض / حجب
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingListing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-black text-rose-700 text-base flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              حجب أو رفض الإعلان: {rejectingListing.title}
            </h3>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">سبب الرفض الموجه للمعلن:</label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="مثال: يمنع طلب أي عمولات سمسرة أو رسوم غير مبررة..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setRejectingListing(null)}
                className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmReject}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs"
              >
                تأكيد الحجب
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
