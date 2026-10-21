'use client';

import { AuthUser } from './auth-service';
import { normalizeEgyptianPhone } from './utils';

export interface RegisteredAccount extends AuthUser {
  passwordHash: string;
  createdAt: string;
}

const REGISTRY_STORAGE_KEY = 'sakan_registered_accounts_v1';

// Simple fast hashing for client storage safety
function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash)}_${password.length}`;
}

export function getRegisteredAccounts(): RegisteredAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REGISTRY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function registerAccount(user: AuthUser, plainPassword: string): RegisteredAccount {
  const accounts = getRegisteredAccounts();
  const phoneNormalized = user.phone ? normalizeEgyptianPhone(user.phone).normalized : '';

  const newAccount: RegisteredAccount = {
    ...user,
    phone: phoneNormalized || user.phone,
    passwordHash: hashPassword(plainPassword),
    createdAt: new Date().toISOString(),
  };

  // Remove existing with same phone or email if any
  const filtered = accounts.filter(
    (acc) =>
      (!phoneNormalized || acc.phone !== phoneNormalized) &&
      (!user.email || acc.email?.toLowerCase() !== user.email.toLowerCase())
  );

  filtered.unshift(newAccount);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(filtered));
    } catch (err) {
      console.error('Failed to save account to registry:', err);
    }
  }

  return newAccount;
}

export function authenticateFromRegistry(
  identifier: string,
  plainPassword: string
): AuthUser | null {
  const accounts = getRegisteredAccounts();
  const trimmed = identifier.trim();
  const phoneResult = normalizeEgyptianPhone(trimmed);
  const normalizedPhone = phoneResult.isValid ? phoneResult.normalized : trimmed;
  const isEmail = trimmed.includes('@');
  const targetHash = hashPassword(plainPassword);

  const matched = accounts.find((acc) => {
    let matchId = false;
    if (isEmail) {
      matchId = acc.email?.toLowerCase() === trimmed.toLowerCase();
    } else {
      matchId = acc.phone === normalizedPhone || acc.phone.includes(trimmed);
    }
    return matchId && acc.passwordHash === targetHash;
  });

  if (!matched) return null;

  return {
    id: matched.id,
    full_name: matched.full_name,
    phone: matched.phone,
    email: matched.email,
    role_preference: matched.role_preference,
  };
}
