'use client';

import { NotificationItem, NotificationType } from '@/types/database';
import { isSupabaseConfigured, createClient } from './supabase/client';

const NOTIFICATIONS_STORAGE_KEY = 'sakan_user_notifications_v1';

// Default starter notifications to provide immediate value and clarity to users
const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'welcome-system-01',
    user_id: 'all',
    type: 'security',
    title: 'أهلاً بك في منصة سَكَن! 🎉',
    body: 'المنصة المباشرة الأولى في مصر للطلبة والموظفين المغتربين. تواصل مباشر مع أصحاب السكن بدون أي سماسرة وبدون مليم عمولة.',
    link: '/listings',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'safety-alert-02',
    user_id: 'all',
    type: 'security',
    title: 'ميثاق الأمان: تجنب الدفع قبل المعاينة 🛡️',
    body: 'لا تدفع أبداً أي رسوم معاينة أو حجز عبر فودافون كاش أو إنستاباي قبل رؤية الشقة على أرض الواقع ومقابلة صاحبها.',
    link: '/safety',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'feature-match-03',
    user_id: 'all',
    type: 'match',
    title: 'ميزة "دوّرلي على سكن" مفعلة 🎯',
    body: 'سجّل متطلبات السكن (المحافظة والميزانية) وسنقوم بإشعارك تلقائياً فور نزول سكن يطابق طلبك.',
    link: '/wanted-requests',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export function getStoredNotifications(userId?: string): NotificationItem[] {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATIONS;

  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
      return DEFAULT_NOTIFICATIONS;
    }
    const parsed: NotificationItem[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
      return DEFAULT_NOTIFICATIONS;
    }

    if (userId) {
      return parsed.filter((n) => n.user_id === userId || n.user_id === 'all');
    }
    return parsed;
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(items: NotificationItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('sakan_notifications_updated'));
  } catch (err) {
    console.error('Failed to save notifications:', err);
  }
}

export async function fetchUserNotifications(userId?: string): Promise<NotificationItem[]> {
  // If Supabase is configured and has notifications table, attempt fetch
  if (isSupabaseConfigured() && userId) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .or(`user_id.eq.${userId},user_id.eq.all`)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as NotificationItem[];
      }
    } catch {
      // Fallback to local
    }
  }

  return getStoredNotifications(userId);
}

export async function addNotification(item: {
  userId?: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  relatedListingId?: string;
  relatedRequestId?: string;
}): Promise<NotificationItem> {
  const newNotif: NotificationItem = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    user_id: item.userId || 'all',
    type: item.type,
    title: item.title,
    body: item.body,
    link: item.link,
    related_listing_id: item.relatedListingId,
    related_request_id: item.relatedRequestId,
    is_read: false,
    created_at: new Date().toISOString(),
  };

  // If Supabase configured, attempt insert
  if (isSupabaseConfigured() && item.userId) {
    try {
      const supabase = createClient();
      await supabase.from('notifications').insert([newNotif]);
    } catch {
      // Ignore and fallback
    }
  }

  // Update local storage
  const current = getStoredNotifications();
  const updated = [newNotif, ...current];
  saveStoredNotifications(updated);

  return newNotif;
}

export async function markNotificationAsRead(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    } catch {
      // Fallback
    }
  }

  const current = getStoredNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, is_read: true } : n));
  saveStoredNotifications(updated);
}

export async function markAllNotificationsAsRead(userId?: string): Promise<void> {
  if (isSupabaseConfigured() && userId) {
    try {
      const supabase = createClient();
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .or(`user_id.eq.${userId},user_id.eq.all`);
    } catch {
      // Fallback
    }
  }

  const current = getStoredNotifications();
  const updated = current.map((n) => ({ ...n, is_read: true }));
  saveStoredNotifications(updated);
}

export async function clearAllNotifications(): Promise<void> {
  saveStoredNotifications([]);
}
