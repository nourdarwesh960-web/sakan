'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthUser, getStoredUser, setStoredUser, clearStoredUser } from './auth-service';
import { createClient, isSupabaseConfigured } from './supabase/client';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = useCallback(() => {
    const stored = getStoredUser();
    setUser(stored);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();

    // Check Supabase Auth session only if real credentials are configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => {
          if (data?.user) {
            const profile: AuthUser = {
              id: data.user.id,
              full_name: data.user.user_metadata?.full_name || 'مستخدم سَكَن',
              phone: data.user.user_metadata?.phone || '',
              email: data.user.email,
              role_preference: data.user.user_metadata?.role_preference || 'both',
            };
            setStoredUser(profile);
            setUser(profile);
          }
        }).catch(() => {
          // Fallback to local stored
        });
      } catch {
        // Fallback
      }
    }

    const handler = () => refreshUser();
    window.addEventListener('sakan_auth_changed', handler);
    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener('sakan_auth_changed', handler);
      window.removeEventListener('storage', handler);
    };
  }, [refreshUser]);

  const loginUser = (newUser: AuthUser) => {
    setStoredUser(newUser);
    setUser(newUser);
  };

  const logoutUser = async () => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch {
        // Fallback
      }
    }
    clearStoredUser();
    setUser(null);
  };

  const updateProfile = (updates: Partial<AuthUser>) => {
    if (!user) return;
    const updated: AuthUser = { ...user, ...updates };
    setStoredUser(updated);
    setUser(updated);
  };

  return {
    user,
    isAuthenticated: user !== null,
    loading,
    loginUser,
    logoutUser,
    updateProfile,
    refreshUser,
  };
}
