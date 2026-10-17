import React from 'react';
import Link from 'next/link';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Building, 
  MapPin, 
  Bed, 
  Check, 
  RotateCcw
} from 'lucide-react';
import { getPublishedListings } from '@/lib/data-service';
import ListingCard from '@/components/ListingCard';
import { EGYPT_GOVERNORATES, HousingType, EligibleOccupants, GenderPreference } from '@/types/database';
import { HOUSING_TYPE_LABELS, OCCUPANT_LABELS, GENDER_LABELS, formatCurrencyEGP } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface ListingsPageProps {
  searchParams: Promise<{
    governorate?: string;
    area?: string;
    housing_type?: string;
    eligible_occupants?: string;
    gender_preference?: string;
    min_rent?: string;
    max_rent?: string;
    beds_count?: string;
    furnished?: string;
    sort_by?: 'newest' | 'price_asc' | 'price_desc';
    page?: string;
  }>;
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const minRent = params.min_rent ? parseInt(params.min_rent, 10) : undefined;
  const maxRent = params.max_rent ? parseInt(params.max_rent, 10) : undefined;
  const bedsCount = params.beds_count ? parseInt(params.beds_count, 10) : undefined;
  const furnished = params.furnished === 'true' ? true : params.furnished === 'false' ? false : undefined;

  const { listings, total } = await getPublishedListings({
    governorate: params.governorate,
    area: params.area,
    housing_type: params.housing_type,
    eligible_occupants: params.eligible_occupants,
    gender_preference: params.gender_preference,
    min_rent: minRent,
    max_rent: maxRent,
    beds_count: bedsCount,
    furnished,
    sort_by: params.sort_by || 'newest',
    page,
    limit: 12,
  });

  // Calculate active filter chips
  const activeChips: { key: string; label: string; removeUrl: string }[] = [];

  function makeUrlWithout(keyToRemove: string): string {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (k !== keyToRemove && v) sp.set(k, v);
    });
    return `/listings?${sp.toString()}`;
  }

  if (params.governorate) {
    activeChips.push({ key: 'governorate', label: `المحافظة: ${params.governorate}`, removeUrl: makeUrlWithout('governorate') });
  }
  if (params.area) {
    activeChips.push({ key: 'area', label: `المنطقة: ${params.area}`, removeUrl: makeUrlWithout('area') });
  }
  if (params.housing_type && HOUSING_TYPE_LABELS[params.housing_type]) {
    activeChips.push({ key: 'housing_type', label: HOUSING_TYPE_LABELS[params.housing_type], removeUrl: makeUrlWithout('housing_type') });
  }
  if (params.eligible_occupants && OCCUPANT_LABELS[params.eligible_occupants]) {
    activeChips.push({ key: 'eligible_occupants', label: OCCUPANT_LABELS[params.eligible_occupants], removeUrl: makeUrlWithout('eligible_occupants') });
  }
  if (params.gender_preference && GENDER_LABELS[params.gender_preference]) {
    activeChips.push({ key: 'gender_preference', label: GENDER_LABELS[params.gender_preference], removeUrl: makeUrlWithout('gender_preference') });
  }
  if (minRent) {
    activeChips.push({ key: 'min_rent', label: `أدنى سعر: ${formatCurrencyEGP(minRent)}`, removeUrl: makeUrlWithout('min_rent') });
  }
  if (maxRent) {
    activeChips.push({ key: 'max_rent', label: `أقصى سعر: ${formatCurrencyEGP(maxRent)}`, removeUrl: makeUrlWithout('max_rent') });
  }
  if (bedsCount) {
    activeChips.push({ key: 'beds_count', label: `${bedsCount}+ أسِرّة`, removeUrl: makeUrlWithout('beds_count') });
  }
  if (furnished !== undefined) {
    activeChips.push({ key: 'furnished', label: furnished ? 'مفروش' : 'غير مفروش', removeUrl: makeUrlWithout('furnished') });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F2942]">تصفح السكن في مصر</h1>
          <p className="text-sm text-stone-500 mt-1">
            تم العثور على <span className="font-bold text-stone-900">{total}</span> إعلان متاح بدون عمولات
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <label className="text-xs font-semibold text-stone-600">الترتيب حسب:</label>
          <form method="GET" action="/listings" className="inline-block">
            {/* Preserve other active filters */}
            {params.governorate && <input type="hidden" name="governorate" value={params.governorate} />}
            {params.area && <input type="hidden" name="area" value={params.area} />}
            {params.housing_type && <input type="hidden" name="housing_type" value={params.housing_type} />}
            {params.min_rent && <input type="hidden" name="min_rent" value={params.min_rent} />}
            {params.max_rent && <input type="hidden" name="max_rent" value={params.max_rent} />}
            <select
              name="sort_by"
              defaultValue={params.sort_by || 'newest'}
              // On change form submit via simple inline script or auto submit
              className="bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-medium text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#0F2942]"
            >
              <option value="newest">الأحدث نشرأً</option>
              <option value="price_asc">الأقل سعراً</option>
              <option value="price_desc">الأعلى سعراً</option>
            </select>
          </form>
        </div>
      </div>

      {/* Filter Bar / Form */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs">
        <form method="GET" action="/listings" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            
            {/* Governorate */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">المحافظة</label>
              <select
                name="governorate"
                defaultValue={params.governorate || ''}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-2 text-xs font-medium focus:ring-1 focus:ring-[#0F2942] focus:outline-none"
              >
                <option value="">جميع المحافظات</option>
                {EGYPT_GOVERNORATES.map((g) => (
                  <option key={g.id} value={g.nameAr}>
                    {g.nameAr}
                  </option>
                ))}
              </select>
            </div>

            {/* Area */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">المنطقة أو الحي</label>
              <input
                type="text"
                name="area"
                defaultValue={params.area || ''}
                placeholder="مثال: الدقي، سموحة"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-2 text-xs focus:ring-1 focus:ring-[#0F2942] focus:outline-none"
              />
            </div>

            {/* Housing Type */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">نوع السكن</label>
              <select
                name="housing_type"
                defaultValue={params.housing_type || ''}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-2 text-xs font-medium focus:ring-1 focus:ring-[#0F2942] focus:outline-none"
              >
                <option value="">جميع الأنواع</option>
                <option value="room">غرفة خاصة / مشتركة</option>
                <option value="shared_apartment">شقة مشتركة (طلبة/شباب)</option>
                <option value="studio">استوديو مستقل</option>
                <option value="full_apartment">شقة كاملة</option>
              </select>
            </div>

            {/* Max Budget */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">أقصى ميزانية (ج.م)</label>
              <input
                type="number"
                name="max_rent"
                defaultValue={params.max_rent || ''}
                placeholder="مثال: 3000"
                min="0"
                step="100"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-2 text-xs focus:ring-1 focus:ring-[#0F2942] focus:outline-none"
              />
            </div>

            {/* Gender / Neutral Occupancy */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">الفئة المسموح بها</label>
              <select
                name="gender_preference"
                defaultValue={params.gender_preference || ''}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-2 text-xs font-medium focus:ring-1 focus:ring-[#0F2942] focus:outline-none"
              >
                <option value="">الكل</option>
                <option value="male">شباب / طلبة</option>
                <option value="female">بنات / طالبات</option>
              </select>
            </div>

          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-stone-700">
                <input
                  type="checkbox"
                  name="furnished"
                  value="true"
                  defaultChecked={params.furnished === 'true'}
                  className="rounded text-[#0F2942] focus:ring-0"
                />
                مفروش فقط
              </label>

              <div className="flex items-center gap-1 text-stone-700">
                <span>الأسِرّة:</span>
                {[1, 2, 3].map((b) => (
                  <label key={b} className="flex items-center gap-0.5 cursor-pointer">
                    <input
                      type="radio"
                      name="beds_count"
                      value={b}
                      defaultChecked={params.beds_count === b.toString()}
                      className="text-[#0F2942] focus:ring-0"
                    />
                    <span>{b}+</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/listings"
                className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg hover:bg-stone-50 transition flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                إعادة ضبط
              </Link>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#0F2942] hover:bg-[#0A3A40] text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs"
              >
                <Search className="w-3.5 h-3.5" />
                تطبيق الفلاتر
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Active Filter Chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-stone-500 font-semibold">الفلاتر النشطة:</span>
          {activeChips.map((chip) => (
            <Link
              key={chip.key}
              href={chip.removeUrl}
              className="inline-flex items-center gap-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs px-2.5 py-1 rounded-full border border-stone-300 transition"
              title="إزالة الفلتر"
            >
              <span>{chip.label}</span>
              <X className="w-3 h-3 text-stone-500 hover:text-stone-800" />
            </Link>
          ))}
          <Link
            href="/listings"
            className="text-xs text-rose-600 hover:underline font-semibold mr-2"
          >
            مسح الكل
          </Link>
        </div>
      )}

      {/* Listings Grid */}
      {listings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-lg mx-auto space-y-4">
          <Building className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-lg font-bold text-stone-800">لا توجد وحدات مطابقة للبحث</h3>
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

    </div>
  );
}
