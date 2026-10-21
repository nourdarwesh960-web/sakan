'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  CheckCheck, 
  Compass, 
  MessageSquare, 
  Building, 
  ShieldAlert, 
  ShieldCheck, 
  ArrowLeft,
  Trash2,
  Plus
} from 'lucide-react';
import { NotificationItem, NotificationType } from '@/types/database';
import { formatDateArabic } from '@/lib/utils';
import AuthGuard from '@/components/AuthGuard';
import { useAuth } from '@/lib/use-auth';
import { 
  fetchUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  clearAllNotifications,
  addNotification 
} from '@/lib/notification-service';

export default function NotificationsCenterPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    try {
      const data = await fetchUserNotifications(user?.id);
      setNotifications(data);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadNotifications();

    const handler = () => {
      loadNotifications();
    };

    window.addEventListener('sakan_notifications_updated', handler);
    return () => {
      window.removeEventListener('sakan_notifications_updated', handler);
    };
  }, [loadNotifications]);

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead(user?.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const handleMarkOneRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const handleClearAll = async () => {
    if (confirm('هل أنت متأكد من مسح جميع الإشعارات؟')) {
      await clearAllNotifications();
      setNotifications([]);
    }
  };

  const handleCreateTestNotification = async () => {
    await addNotification({
      userId: user?.id,
      type: 'match',
      title: 'سكن جديد يطابق مواصفاتك! 🔔',
      body: 'تم إضافة غرفة جديدة في منطقة الدقي بسعر 2,500 ج.م شهرياً شاملة الفواتير.',
      link: '/listings',
    });
    await loadNotifications();
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'match':
        return <Compass className="w-4 h-4 text-amber-600" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-[#0F2942]" />;
      case 'listing_status':
        return <Building className="w-4 h-4 text-emerald-600" />;
      case 'complaint_status':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case 'security':
        return <ShieldCheck className="w-4 h-4 text-blue-600" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <AuthGuard fallbackMessage="يجب تسجيل الدخول لعرض إشعارات حسابك ومتابعة التنبيهات." redirectUrl="/notifications">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#0F2942]">مركز الإشعارات</h1>
            {unreadCount > 0 && (
              <span className="bg-amber-500 text-[#0F2942] text-[11px] font-bold px-2 py-0.5 rounded-full">
                {unreadCount} جديد
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            تنبيهات السكن المطابق، الرسائل الخاصة، ومستجدات حسابك
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-2.5 sm:px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>تحديد الكل كمقروء</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
              title="مسح الكل"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleCreateTestNotification}
            className="px-2.5 sm:px-3 py-1.5 bg-[#0F2942] hover:bg-[#0A3A40] text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-xs"
            title="تجربة استلام إشعار جديد"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إشعار تجريبي</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-stone-400 text-xs">
            جاري تحميل الإشعارات...
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-3">
            <Bell className="w-8 h-8 text-stone-300 mx-auto" />
            <h3 className="text-sm font-bold text-stone-800">صندوق الإشعارات فارغ</h3>
            <p className="text-xs text-stone-500">
              سنخبرك فور حدوث أي نشاط في طلباتك أو استلام رسائل جديدة.
            </p>
            <button
              onClick={handleCreateTestNotification}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إرسال إشعار تجريبي الآن</span>
            </button>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleMarkOneRead(notif.id)}
              className={`p-3.5 sm:p-4 rounded-2xl border transition flex items-start gap-3 sm:gap-4 cursor-pointer ${
                notif.is_read
                  ? 'bg-white border-stone-200 hover:border-stone-300'
                  : 'bg-amber-50/50 border-amber-200 shadow-xs hover:border-amber-300'
              }`}
            >
              <div className="p-2 rounded-xl bg-white border border-stone-100 shadow-xs shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`text-xs sm:text-sm font-bold ${notif.is_read ? 'text-stone-800' : 'text-[#0F2942]'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-[10px] text-stone-400 shrink-0">
                    {formatDateArabic(notif.created_at)}
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {notif.body}
                </p>

                {notif.link && (
                  <div className="pt-1">
                    <Link
                      href={notif.link}
                      className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#0F2942] hover:underline"
                    >
                      <span>عرض التفاصيل</span>
                      <ArrowLeft className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>

              {!notif.is_read && (
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-2"></span>
              )}
            </div>
          ))
        )}
      </div>

    </div>
    </AuthGuard>
  );
}
