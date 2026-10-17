import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Bed, Bath, Sparkles, ShieldCheck } from 'lucide-react';
import { Listing } from '@/types/database';
import { formatCurrencyEGP, HOUSING_TYPE_LABELS, OCCUPANT_LABELS, GENDER_LABELS } from '@/lib/utils';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const primaryPhoto = listing.photos && listing.photos.length > 0 
    ? listing.photos[0].photo_url 
    : 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';

  return (
    <article className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md hover:border-stone-300 transition-all flex flex-col">
      {/* Photo Container */}
      <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={primaryPhoto}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Badges on top of photo */}
        <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 z-10">
          <span className="bg-[#0F2942]/90 backdrop-blur text-white text-xs px-2.5 py-1 rounded-lg font-medium shadow-sm">
            {HOUSING_TYPE_LABELS[listing.housing_type] || listing.housing_type}
          </span>
          {listing.furnished && (
            <span className="bg-amber-600/90 backdrop-blur text-white text-xs px-2 py-1 rounded-lg font-medium shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              مفروش
            </span>
          )}
        </div>

        <div className="absolute bottom-3 right-3 z-10">
          <span className="bg-emerald-950/80 backdrop-blur text-emerald-300 border border-emerald-400/30 text-[11px] px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            بدون عمولة سمسار
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Price */}
          <div className="flex items-baseline justify-between mb-1.5">
            <div className="text-xl font-black text-[#0F2942]">
              {formatCurrencyEGP(listing.monthly_rent)}
              <span className="text-xs font-normal text-stone-500 mr-1">/ شهر</span>
            </div>
            {listing.deposit > 0 ? (
              <span className="text-[11px] text-stone-500">
                تأمين: {formatCurrencyEGP(listing.deposit)}
              </span>
            ) : (
              <span className="text-[11px] text-emerald-600 font-medium">بدون تأمين</span>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-stone-500 mb-2">
            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="font-semibold text-stone-700">{listing.governorate}</span>
            <span>•</span>
            <span className="truncate">{listing.area}</span>
          </div>

          {/* Title */}
          <Link href={`/listings/${listing.id}`} className="block">
            <h3 className="font-bold text-stone-900 group-hover:text-[#0A3A40] transition text-sm sm:text-base line-clamp-2 leading-snug mb-3">
              {listing.title}
            </h3>
          </Link>
        </div>

        {/* Specs and Occupant Pill */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
          <div className="flex items-center gap-3">
            {listing.beds_count && (
              <span className="flex items-center gap-1" title="عدد الأسِرّة">
                <Bed className="w-3.5 h-3.5 text-stone-400" />
                {listing.beds_count} {listing.beds_count === 1 ? 'سرير' : 'أسِرّة'}
              </span>
            )}
            {listing.bathrooms_count && (
              <span className="flex items-center gap-1" title="عدد الحمامات">
                <Bath className="w-3.5 h-3.5 text-stone-400" />
                {listing.bathrooms_count}
              </span>
            )}
          </div>

          <div className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-medium">
            {GENDER_LABELS[listing.gender_preference] || OCCUPANT_LABELS[listing.eligible_occupants]}
          </div>
        </div>
      </div>
    </article>
  );
}
