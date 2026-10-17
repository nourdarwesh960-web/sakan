import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes an Egyptian mobile phone number into E.164 format (+201xxxxxxxxx).
 * Supports inputs like: 01012345678, 201012345678, +201012345678, 1012345678.
 */
export function normalizeEgyptianPhone(input: string): { isValid: boolean; normalized: string; error?: string } {
  if (!input) {
    return { isValid: false, normalized: '', error: 'رقم الهاتف مطلوب' };
  }

  // Remove spaces, dashes, parentheses
  let cleaned = input.replace(/[\s\-\(\)]/g, '').trim();

  // Convert Arabic/Persian digits to western digits if entered
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  for (let i = 0; i < 10; i++) {
    cleaned = cleaned.replace(new RegExp(arabicDigits[i], 'g'), i.toString());
  }

  // If starts with +20, strip it to check the 10-digit base
  if (cleaned.startsWith('+20')) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith('0020')) {
    cleaned = cleaned.substring(4);
  } else if (cleaned.startsWith('20')) {
    cleaned = cleaned.substring(2);
  }

  // If starts with 0 (e.g. 01012345678), remove leading 0
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  // Must now be exactly 10 digits and start with 10, 11, 12, or 15 (Vodafone, Etisalat, Orange, WE)
  const isValidEgyptian = /^1[0125]\d{8}$/.test(cleaned);

  if (!isValidEgyptian) {
    return {
      isValid: false,
      normalized: '',
      error: 'يرجى إدخال رقم هاتف مصري صحيح (مثال: 01012345678)',
    };
  }

  return {
    isValid: true,
    normalized: `+20${cleaned}`,
  };
}

/**
 * Formats an amount into Egyptian Pounds (EGP / ج.م)
 */
export function formatCurrencyEGP(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0 ج.م';
  }
  return `${amount.toLocaleString('ar-EG')} ج.م`;
}

/**
 * Safely masks a phone number for public listings unless explicitly revealed
 */
export function maskPhoneNumber(phone?: string): string {
  if (!phone) return '';
  if (phone.length < 8) return '****';
  return phone.substring(0, 4) + '****' + phone.substring(phone.length - 3);
}

/**
 * Formats ISO date into localized Egyptian Arabic string
 */
export function formatDateArabic(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Labels mapping for housing types in Arabic
 */
export const HOUSING_TYPE_LABELS: Record<string, string> = {
  room: 'غرفة خاصة / مشتركة',
  shared_apartment: 'شقة مشتركة (سكن طلبة/شباب)',
  full_apartment: 'شقة كاملة (عائلات/مستقل)',
  studio: 'استوديو مستقل',
};

export const OCCUPANT_LABELS: Record<string, string> = {
  students: 'طلبة فقط',
  workers: 'شباب / عمال وموظفين',
  both: 'طلبة أو موظفين',
};

export const GENDER_LABELS: Record<string, string> = {
  any: 'متاح للجميع',
  male: 'شباب فقط',
  female: 'بنات / طالبات فقط',
};

export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: 'مسودة', color: 'bg-stone-100 text-stone-700' },
  pending: { label: 'قيد المراجعة', color: 'bg-amber-100 text-amber-800' },
  published: { label: 'متاح ومعروض', color: 'bg-emerald-100 text-emerald-800' },
  paused: { label: 'موقوف مؤقتاً', color: 'bg-blue-100 text-blue-800' },
  rejected: { label: 'مرفوض', color: 'bg-rose-100 text-rose-800' },
  removed: { label: 'محذوف', color: 'bg-stone-200 text-stone-600' },
  rented: { label: 'تم التأجير', color: 'bg-purple-100 text-purple-800' },
};
