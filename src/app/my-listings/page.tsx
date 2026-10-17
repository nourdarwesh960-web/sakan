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
  Sparkles,
  ShieldCheck 
} from 'lucide-react';
import { Listing } from '@/types/database';
import { formatCurrencyEGP, formatDateArabic, HOUSING_TYPE_LABELS, STATUS_LABELS } from '@/lib/utils';

export default function MyListingsPage() {
  // Demo provider listings
  const [listings, setListings] = useState<Listing[]>([
    {
      id: 'listing-cairo-1',
      owner_id: 'user-ahmed-1',
      title: 'غرفة سنجل هادئة ومفروشة بالكامل قرب مترو الدقي',
      description: 'غرفة ممتازة للطلبة أو الموظفين، في شقة راقية وهادئة جداً.',
      governorate: 'الجيزة',
      area: 'الدقي',
      housing_type: 'room',
      eligible_occupants: 'both',
      gender_preference: 'male',
      monthly_rent: 2800,
      deposit: 2800,
      utilities_cost: 0,
      furnished: true,
      available_from: '2026-10-15',
      amenities: ['واي فاي سريع', 'مكيف هواء'],
      status: 'published',
      show_phone_publicly: false,
      views_count: 142,
      created_at: '2026-10-15T12:00:00.000Z',
      updated_at: '2026-10-16T12:00:00.000Z',
      photos: [
        { id: 'p1', listing_id: 'listing-cairo-1', photo_url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80', order_index: 0, created_at: '' }
      ]
    },
    {
      id: 'listing-cairo-3',
      owner_id: 'user-ahmed-1',
      title: 'سكن شباب مشترك بجوار جامعة القاهرة ومحطة المترو',
      description: 'سرير متاح في غرفة ثنائية واسعة ونظيفة جداً.',
      governorate: 'الجيزة',
      area: 'بين السرايات',
      housing_type: 'shared_apartment',
      eligible_occupants: 'students',
      gender_preference: 'male',
      monthly_rent: 1400,
      deposit: 1000,
      utilities_cost: 150,
      furnished: true,
      available_from: '2026-10-10',
      amenities: ['واي فاي', 'غسالة'],
      status: 'published',
      show_phone_publicly: false,
      views_count: 310,
      created_at: '2026-10-13T10:00:00.000Z',
      updated_at: '2026-10-16T12:00:00.000Z',
      photos: [
        { id: 'p4', listing_id: 'listing-cairo-3', photo_url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80', order_index: 0, created_at: '' }
      ]
    }
  ]);

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
        {listings.map((listing) => (
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
        ))}
      </div>

    </div>
  );
}
