'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  Search, 
  MapPin, 
  ShieldCheck, 
  CheckCheck, 
  ArrowLeft,
  Building 
} from 'lucide-react';
import { Conversation } from '@/types/database';
import { formatDateArabic } from '@/lib/utils';

export default function MessagesListPage() {
  const [conversations] = useState<Conversation[]>([]);

  const [searchQuery, setSearchQuery] = useState('');

  const filtered = conversations.filter((c) => {
    const name = c.provider?.full_name?.toLowerCase() || '';
    const title = c.listing?.title?.toLowerCase() || '';
    const q = searchQuery.toLowerCase();
    return name.includes(q) || title.includes(q);
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-[#0F2942]">المحادثات الخاصة</h1>
          <p className="text-xs sm:text-sm text-stone-500">
            تواصل مباشر وآمن مع أصحاب السكن والمستأجرين بدون وسطاء
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في المحادثات..."
            className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 pl-9 text-xs focus:ring-1 focus:ring-[#0F2942] focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 text-emerald-900 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>محادثاتك مشفرة ومحمية. لا تقم بتحويل أي عربون أو عمولة قبل المعاينة الفعلية للسكن.</span>
        </div>
        <Link href="/safety" className="font-bold underline text-emerald-800 shrink-0">
          إرشادات الأمان
        </Link>
      </div>

      {/* Conversations List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-3">
            <MessageSquare className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-sm font-bold text-stone-800">لا توجد محادثات نشطة</h3>
            <p className="text-xs text-stone-500">
              تصفح الإعلانات المتاحة واضغط على "تواصل في الشات الخاص" لبدء محادثة.
            </p>
            <Link
              href="/listings"
              className="inline-block mt-2 px-4 py-2 bg-[#0F2942] text-white text-xs font-bold rounded-xl"
            >
              تصفح السكن الآن
            </Link>
          </div>
        ) : (
          filtered.map((convo) => (
            <Link
              key={convo.id}
              href={`/messages/${convo.id}`}
              className="block bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 hover:border-[#0F2942] hover:shadow-sm transition group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-[#0F2942] text-white flex items-center justify-center font-bold text-base shrink-0">
                    {convo.provider?.full_name ? convo.provider.full_name[0] : 'س'}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-stone-900 text-sm group-hover:text-[#0A3A40] transition truncate">
                        {convo.provider?.full_name || 'صاحب السكن'}
                      </h3>
                      <span className="text-[10px] text-stone-400">
                        {formatDateArabic(convo.updated_at)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-stone-500">
                      <Building className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate max-w-xs">{convo.listing?.title}</span>
                    </div>

                    {convo.last_message && (
                      <p className="text-xs text-stone-600 truncate mt-0.5">
                        {convo.last_message.content}
                      </p>
                    )}
                  </div>
                </div>

                {convo.unread_count && convo.unread_count > 0 ? (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                    {convo.unread_count}
                  </span>
                ) : (
                  <ArrowLeft className="w-4 h-4 text-stone-300 group-hover:text-stone-700 transition shrink-0" />
                )}
              </div>
            </Link>
          ))
        )}
      </div>

    </div>
  );
}
