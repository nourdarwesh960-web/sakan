'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Calendar, 
  ShieldCheck, 
  MessageSquare, 
  Phone, 
  Flag, 
  User, 
  CheckCircle2, 
  ArrowRight,
  Info,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { Listing } from '@/types/database';
import ListingCard from '@/components/ListingCard';
import ListingContactCard from '@/components/ListingContactCard';
import { 
  formatCurrencyEGP, 
  formatDateArabic, 
  HOUSING_TYPE_LABELS, 
  OCCUPANT_LABELS, 
  GENDER_LABELS 
} from '@/lib/utils';
import { getLocalListings } from '@/lib/data-service';

interface ListingDetailClientProps {
  id: string;
  initialListing: Listing | null;
  relatedListings?: Listing[];
}

export default function ListingDetailClient({
  id,
  initialListing,
  relatedListings = [],
}: ListingDetailClientProps) {
  const [listing, setListing] = useState<Listing | null>(initialListing);
  const [loading, setLoading] = useState(!initialListing);

  useEffect(() => {
    if (!listing) {
      const local = getLocalListings();
      const found = local.find((l) => l.id === id);
      if (found) {
        setListing(found);
      }
      setLoading(false);
    }
  }, [id, listing]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-[#0F2942] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-stone-500">جاري تحميل تفاصيل السكن...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-[#0F2942]">الإعلان غير متوفر حالياً</h2>
        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
          قد يكون تم تأجير هذا السكن أو إزالته بواسطة صاحبه، أو الرابط غير صحيح.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
          <Link
            href="/listings"
            className="px-5 py-2.5 bg-[#0F2942] hover:bg-[#0A3A40] text-white font-bold rounded-xl text-xs transition"
          >
            تصفح كل السكن المتاح
          </Link>
          <Link
            href="/"
            className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs transition"
          >
            الصفحة الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const primaryPhoto = listing.photos && listing.photos.length > 0 
    ? listing.photos[0].photo_url 
    : 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <Link href="/" className="hover:text-stone-900">الرئيسية</Link>
        <span>/</span>
        <Link href="/listings" className="hover:text-stone-900">تصفح السكن</Link>
        <span>/</span>
        <Link href={`/listings?governorate=${encodeURIComponent(listing.governorate)}`} className="hover:text-stone-900">
          {listing.governorate}
        </Link>
        <span>/</span>
        <span className="text-stone-800 font-medium truncate max-w-xs">{listing.title}</span>
      </nav>

      {/* Main Header & Title */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#0F2942] text-white text-xs px-2.5 py-1 rounded-lg font-bold">
              {HOUSING_TYPE_LABELS[listing.housing_type] || listing.housing_type}
            </span>
            {listing.furnished && (
              <span className="bg-stone-100 text-stone-800 text-xs px-2.5 py-1 rounded-lg font-bold">
                مفروش
              </span>
            )}
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              مباشر بدون عمولة سمسار
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#0F2942] leading-tight">
            {listing.title}
          </h1>

          <div className="flex items-center gap-2 text-sm text-stone-600">
            <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
            <span className="font-bold text-stone-800">{listing.governorate}</span>
            <span>—</span>
            <span>{listing.area}</span>
            <span className="text-stone-400">•</span>
            <span className="text-xs text-stone-400">تاريخ النشر: {formatDateArabic(listing.created_at)}</span>
          </div>
        </div>

        {/* Pricing Card Header */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 text-left shrink-0">
          <div className="text-xs text-stone-500 font-semibold mb-1">الإيجار الشهري المطلوب</div>
          <div className="text-3xl font-black text-[#0F2942]">
            {formatCurrencyEGP(listing.monthly_rent)}
            <span className="text-xs font-normal text-stone-500 mr-1.5">/ شهر</span>
          </div>
          <div className="text-xs text-stone-500 mt-2 flex items-center justify-between gap-4">
            <span>التأمين:</span>
            <span className="font-bold text-stone-700">
              {listing.deposit > 0 ? formatCurrencyEGP(listing.deposit) : 'بدون تأمين'}
            </span>
          </div>
          {listing.utilities_cost > 0 ? (
            <div className="text-xs text-stone-500 mt-1 flex items-center justify-between gap-4">
              <span>الفواتير والخدمات:</span>
              <span className="font-bold text-stone-700">تقريباً {formatCurrencyEGP(listing.utilities_cost)}</span>
            </div>
          ) : (
            <div className="text-xs text-emerald-600 font-medium mt-1">
              شامل فواتير المياه والكهرباء والإنترنت
            </div>
          )}
        </div>
      </div>

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-2xl overflow-hidden border border-stone-200">
        <div className="md:col-span-2 aspect-[16/10] bg-stone-100 relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={primaryPhoto}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
          {listing.photos && listing.photos.length > 1 ? (
            listing.photos.slice(1, 3).map((p, i) => (
              <div key={i} className="aspect-[16/10] bg-stone-100 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.photo_url}
                  alt={`${listing.title} - صورة ${i + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            <div className="aspect-[16/10] bg-stone-50 flex flex-col items-center justify-center text-stone-400 p-4 text-center">
              <Info className="w-8 h-8 mb-1" />
              <span className="text-xs">المزيد من الصور متاح عبر الشات الخاص</span>
            </div>
          )}
        </div>
      </div>

      {/* Content & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details & Specs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Key Specifications Grid */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <h3 className="text-base font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100">
              المواصفات الأساسية
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="bg-stone-50 p-3 rounded-xl">
                <span className="text-xs text-stone-500 block">نوع السكن</span>
                <span className="font-bold text-stone-800">{HOUSING_TYPE_LABELS[listing.housing_type]}</span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl">
                <span className="text-xs text-stone-500 block">الفئة المسموح بها</span>
                <span className="font-bold text-stone-800">{GENDER_LABELS[listing.gender_preference]}</span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl">
                <span className="text-xs text-stone-500 block">طبيعة الشاغلين</span>
                <span className="font-bold text-stone-800">{OCCUPANT_LABELS[listing.eligible_occupants]}</span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl">
                <span className="text-xs text-stone-500 block">متاح بدءاً من</span>
                <span className="font-bold text-stone-800">{formatDateArabic(listing.available_from)}</span>
              </div>
              {listing.beds_count && (
                <div className="bg-stone-50 p-3 rounded-xl">
                  <span className="text-xs text-stone-500 block">عدد الأسِرّة</span>
                  <span className="font-bold text-stone-800">{listing.beds_count} أسِرّة</span>
                </div>
              )}
              {listing.rooms_count && (
                <div className="bg-stone-50 p-3 rounded-xl">
                  <span className="text-xs text-stone-500 block">عدد الغرف</span>
                  <span className="font-bold text-stone-800">{listing.rooms_count} غرف</span>
                </div>
              )}
              {listing.bathrooms_count && (
                <div className="bg-stone-50 p-3 rounded-xl">
                  <span className="text-xs text-stone-500 block">عدد الحمامات</span>
                  <span className="font-bold text-stone-800">{listing.bathrooms_count}</span>
                </div>
              )}
              {listing.room_occupancy_type && (
                <div className="bg-stone-50 p-3 rounded-xl">
                  <span className="text-xs text-stone-500 block">طبيعة الغرفة</span>
                  <span className="font-bold text-stone-800">
                    {listing.room_occupancy_type === 'private' ? 'خاصة منفردة' : 'مشتركة'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <h3 className="text-base font-bold text-stone-900 mb-3 pb-2 border-b border-stone-100">
              الوصف والشروط
            </h3>
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Amenities & Services */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <h3 className="text-base font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100">
                المرافق والخدمات المتوفرة
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {listing.amenities.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 bg-stone-50 border border-stone-200 text-stone-800 text-xs sm:text-sm px-3 py-1.5 rounded-xl font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Safety Notice */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              تنبيه أمان هام لمستأجري سَكَن:
            </div>
            <p className="text-xs leading-relaxed text-amber-900/90">
              لا تقم بتحويل أي مبالغ مالية كعربون أو رسوم معاينة عبر أي محفظة إلكترونية قبل معاينة السكن بنفسك على الطبيعة ومطابقة أوراق الملكية وهوية المؤجر. سَكَن لا تتقاضى أي عمولة وتمنع الوسطاء السماسرة.
            </p>
          </div>

        </div>

        {/* Right Column: Provider & Actions Card */}
        <div className="space-y-6">
          <ListingContactCard listing={listing} />
        </div>

      </div>

      {/* Related Listings */}
      {relatedListings && relatedListings.length > 0 && (
        <div className="pt-12 border-t border-stone-200 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#0F2942]">سكن مشابه في {listing.governorate}</h2>
            <Link
              href={`/listings?governorate=${encodeURIComponent(listing.governorate)}`}
              className="text-xs font-bold text-[#0F2942] hover:underline"
            >
              عرض المزيد
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedListings.map((rel) => (
              <ListingCard key={rel.id} listing={rel} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
