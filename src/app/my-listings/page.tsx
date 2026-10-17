'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building, 
  PlusCircle, 
  PauseCircle, 
  PlayCircle, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  ShieldCheck 
} from 'lucide-react';
import { Listing } from '@/types/database';
import { formatCurrencyEGP, formatDateArabic, HOUSING_TYPE_LABELS, STATUS_LABELS } from '@/lib/utils';

import { getMyListings } from '@/lib/data-service';

export default function MyListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        const data = await getMyListings();
        setListings(data);
      } catch {
        setListings([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleStatus = (id: string) => {
    setListings(
      listings.map((l) => {
        if (l.id === id) {
          const nextStatus = l.status === 'published' ? 'paused' : 'published';
          return { ...l, status: nextStatus };
        }
        return l;
      })
    );
  };

  const markAsRented = (id: string) => {
    setListings(
      listings.map((l) => {
        if (l.id === id) {
          return { ...l, status: 'rented' };
        }
        return l;
      })
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-[#0F2942]">إعلاناتي المعروضة</h1>
          <p className="text-xs sm:text-sm text-stone-500">
            إدارة وتحديث حالة إعلانات السكن الخاصة بك والتواصل مع المستأجرين
          </p>
        </div>

        <Link
          href="/my-listings/new"
          className="px-4 py-2.5 bg-[#0F2942] hover:bg-[#0A3A40] text-white text-xs sm:text-sm font-bold rounded-xl shadow transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          نشر إعلان سكن جديد
        </Link>
      </div>

      {/* Listings List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-stone-400 text-sm">جاري تحميل إعلاناتك...</div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-4">
            <Building className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-800">ليس لديك أي إعلانات منشورة بعد</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              انشر وحدتك السكنية الآن لتصل إلى آلاف الطلبة والموظفين الباحثين عن سكن في مصر مباشرة وبدون أي عمولات.
            </p>
            <Link
              href="/my-listings/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F2942] hover:bg-[#0A3A40] text-white font-bold rounded-xl text-xs shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>نشر أول إعلان الآن</span>
            </Link>
          </div>
        ) : (
          listings.map((listing) => (
          <div
            key={listing.id}
            className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xs"
          >
            {/* Info */}
            <div className="flex items-center gap-4">
              <div className="w-24 h-20 rounded-xl bg-stone-100 overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={listing.photos?.[0]?.photo_url || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80'}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[11px] px-2 py-0.5 rounded-md font-bold ${STATUS_LABELS[listing.status]?.color || 'bg-stone-100'}`}>
                    {STATUS_LABELS[listing.status]?.label || listing.status}
                  </span>
                  <span className="text-xs text-stone-400 font-medium">
                    {HOUSING_TYPE_LABELS[listing.housing_type]}
                  </span>
                </div>

                <Link href={`/listings/${listing.id}`} className="font-bold text-stone-900 text-sm sm:text-base hover:text-[#0A3A40] line-clamp-1">
                  {listing.title}
                </Link>

                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{listing.governorate}، {listing.area}</span>
                  <span>•</span>
                  <span className="font-bold text-[#0F2942]">{formatCurrencyEGP(listing.monthly_rent)}/شهر</span>
                  <span>•</span>
                  <span>{listing.views_count} مشاهدة</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
              <Link
                href={`/listings/${listing.id}`}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                معاينة
              </Link>

              {listing.status === 'published' ? (
                <button
                  onClick={() => toggleStatus(listing.id)}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-lg transition flex items-center gap-1"
                >
                  <PauseCircle className="w-3.5 h-3.5" />
                  إيقاف مؤقت
                </button>
              ) : listing.status === 'paused' ? (
                <button
                  onClick={() => toggleStatus(listing.id)}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg transition flex items-center gap-1"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  إعادة تفعيل
                </button>
              ) : null}

              {listing.status !== 'rented' && (
                <button
                  onClick={() => markAsRented(listing.id)}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-semibold rounded-lg transition"
                >
                  تم التأجير
                </button>
              )}
            </div>

          </div>
        )))}
      </div>

    </div>
  );
}
