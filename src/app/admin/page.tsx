import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  Building, 
  Flag, 
  Compass, 
  MessageSquare, 
  ShieldCheck, 
  AlertTriangle,
  ArrowLeft,
  Clock
} from 'lucide-react';
import { getAdminMetrics, getComplaints, getPublishedListings } from '@/lib/data-service';
export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const metrics = await getAdminMetrics();
  const openComplaints = await getComplaints({ status: 'submitted' });
  const pendingListings = await getPublishedListings({ limit: 4 });

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div>
        <h1 className="text-2xl font-black text-[#0F2942]">نظرة عامة ومؤشرات المنصة</h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          متابعة النشاط الحي، تدقيق الإعلانات، وحماية المستخدمين من السماسرة والاحتيال
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold">الحسابات المسجلة</span>
            <Users className="w-4 h-4 text-[#0F2942]" />
          </div>
          <div className="text-3xl font-black text-stone-900">{metrics.totalUsers}</div>
          <p className="text-[11px] text-stone-400">طلبة ومؤجرين موثقين</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold">الإعلانات النشطة</span>
            <Building className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-700">{metrics.activeListings}</div>
          <p className="text-[11px] text-stone-400">متاحة ومطابقة للشروط</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold">بلاغات الشكاوى المفتوحة</span>
            <Flag className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-600">{metrics.openComplaints}</div>
          <p className="text-[11px] text-rose-500 font-medium">تتطلب فحصاً فورياً</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold">طلبات "دوّرلي على سكن"</span>
            <Compass className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-amber-600">{metrics.wantedRequestsCount}</div>
          <p className="text-[11px] text-stone-400">بانتظار المطابقة</p>
        </div>

      </div>

      {/* Action Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Complaints Alert Queue */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Flag className="w-4 h-4 text-rose-600" />
              أحدث بلاغات السماسرة والمخالفات
            </h3>
            <Link href="/admin/complaints" className="text-xs font-bold text-[#0F2942] hover:underline">
              عرض الطابور بالكامل
            </Link>
          </div>

          {openComplaints.length === 0 ? (
            <p className="text-xs text-stone-500 text-center py-6">لا توجد بلاغات معلقة حالياً</p>
          ) : (
            <div className="space-y-3">
              {openComplaints.slice(0, 3).map((comp) => (
                <div key={comp.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-rose-700">{comp.category === 'brokerage_commission' ? 'طلب عمولة سمسار' : comp.category}</span>
                    <span className="text-[10px] text-stone-400">جديد</span>
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-1">{comp.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Listings Moderation Queue */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Building className="w-4 h-4 text-[#0F2942]" />
              إعلانات السكن المنشورة حديثاً
            </h3>
            <Link href="/admin/listings" className="text-xs font-bold text-[#0F2942] hover:underline">
              إدارة الإعلانات
            </Link>
          </div>

          <div className="space-y-3">
            {pendingListings.listings.slice(0, 3).map((listing) => (
              <div key={listing.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-stone-900 text-xs line-clamp-1">{listing.title}</h4>
                  <p className="text-[11px] text-stone-500">{listing.governorate} — {listing.area}</p>
                </div>
                <Link
                  href={`/listings/${listing.id}`}
                  className="px-2.5 py-1 bg-white border border-stone-200 hover:bg-stone-100 rounded-lg text-[11px] font-semibold shrink-0"
                >
                  معاينة
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
