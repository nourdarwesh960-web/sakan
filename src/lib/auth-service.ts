'use client';

export interface AuthUser {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  role_preference: 'seeker' | 'provider' | 'both';
}

const STORAGE_KEY = 'sakan_auth_user';
const COOKIE_KEY = 'sakan_auth_session';

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    // Set a lightweight session cookie for middleware / server awareness
    document.cookie = `${COOKIE_KEY}=${encodeURIComponent(user.id)}; path=/; max-age=2592000; SameSite=Lax`;
    window.dispatchEvent(new Event('sakan_auth_changed'));
  } catch {
    // Ignore storage errors
  }
}

export function clearStoredUser(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    document.cookie = `${COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`;
    window.dispatchEvent(new Event('sakan_auth_changed'));
  } catch {
    // Ignore
  }
}

export function isUserAuthenticated(): boolean {
  return getStoredUser() !== null;
}
