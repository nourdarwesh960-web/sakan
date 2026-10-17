'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  CheckCheck, 
  Compass, 
  MessageSquare, 
  Building, 
  ShieldAlert, 
  ShieldCheck, 
  ArrowLeft 
} from 'lucide-react';
import { NotificationItem, NotificationType } from '@/types/database';
import { formatDateArabic } from '@/lib/utils';

export default function NotificationsCenterPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
  };

  const markOneRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'match':
        return <Compass className="w-5 h-5 text-amber-600" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-[#0F2942]" />;
      case 'listing_status':
        return <Building className="w-5 h-5 text-emerald-600" />;
      case 'complaint_status':
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      case 'security':
        return <ShieldCheck className="w-5 h-5 text-blue-600" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-[#0F2942]">مركز الإشعارات</h1>
          <p className="text-xs sm:text-sm text-stone-500">
            تنبيهات السكن المطابق، الرسائل الخاصة، ومستجدات حسابك
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            تحديد الكل كمقروء
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-3">
            <Bell className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-sm font-bold text-stone-800">صندوق الإشعارات فارغ</h3>
            <p className="text-xs text-stone-500">
              سنخبرك فور حدوث أي نشاط في طلباتك أو استلام رسائل جديدة.
            </p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markOneRead(notif.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition flex items-start gap-4 ${
                notif.is_read
                  ? 'bg-white border-stone-200'
                  : 'bg-amber-50/40 border-amber-200 shadow-xs'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-white border border-stone-100 shadow-xs shrink-0">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-stone-900 text-sm">
                    {notif.title}
                  </h3>
                  <span className="text-[10px] text-stone-400">
                    {formatDateArabic(notif.created_at)}
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {notif.body}
                </p>

                {notif.link && (
                  <Link
                    href={notif.link}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0F2942] hover:underline pt-1"
                  >
                    عرض التفاصيل
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
