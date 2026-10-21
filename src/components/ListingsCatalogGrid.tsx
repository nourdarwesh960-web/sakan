'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building } from 'lucide-react';
import { Listing } from '@/types/database';
import ListingCard from '@/components/ListingCard';
import { getLocalListings } from '@/lib/data-service';

interface ListingsCatalogGridProps {
  initialListings: Listing[];
  total: number;
}

export default function ListingsCatalogGrid({ initialListings }: ListingsCatalogGridProps) {
  const [listings, setListings] = useState<Listing[]>(initialListings);

  useEffect(() => {
    try {
      const local = getLocalListings();
      if (local && local.length > 0) {
        // Merge local published listings with server listings
        const combined = [...local.filter((l) => l.status === 'published'), ...initialListings];
        const unique = new Map<string, Listing>();
        for (const item of combined) {
          if (!unique.has(item.id)) {
            unique.set(item.id, item);
          }
        }
        setListings(Array.from(unique.values()));
      } else {
        setListings(initialListings);
      }
    } catch {
      setListings(initialListings);
    }
  }, [initialListings]);

  if (listings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-lg mx-auto space-y-4">
        <Building className="w-12 h-12 text-stone-300 mx-auto" />
        <h3 className="text-lg font-bold text-stone-800">لا توجد وحدات سكنية مطابقة حالياً</h3>
        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
          جرب تغيير المحافظة أو توسيع نطاق الميزانية، أو استخدم ميزة "دوّرلي على سكن" وسنقوم بتنبيهك عند توفر سكن جديد بالمواصفات التي تريدها.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/listings"
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl"
          >
            مسح الفلاتر
          </Link>
          <Link
            href="/wanted-requests"
            className="px-4 py-2 bg-[#0F2942] hover:bg-[#0A3A40] text-white text-xs font-bold rounded-xl"
          >
            تسجيل طلب في "دوّرلي على سكن"
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
