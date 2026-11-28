import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  centralBackendUrl,
  fetchUserProfileFromSupabase,
  getSupabaseSession,
  isSupabaseConfigured,
  signOutSupabase,
  supabase,
} from './supabase';
import { setBackendToken } from './centralApi';
import { store } from '../services/store';
import type { UserProfile, UserRole } from '../types';

const SESSION_STORAGE_KEY = 'pure_krishi_auth_session_v1';
const LOCAL_ADMIN_PROVISION_KEY = 'pure_krishi_local_admin_cred_v1';

interface LocalAdminRecord {
  email: string;
  name: string;
  salt: string;
  passwordHash: string;
  role: 'super_admin' | 'operations_admin';
  provisionedAt: string;
}

export interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authMode: 'supabase' | 'backend' | 'offline';
  hasProvisionedLocalAdmin: boolean;
  loginWithEmailPassword: (email: string, password: string, expectedRoleGroup?: 'admin' | 'farmer' | 'customer') => Promise<UserProfile>;
  registerPublicAccount: (params: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: 'customer' | 'farmer';
    location?: string;
    village?: string;
    district?: string;
    state?: string;
    totalAcres?: number;
    farmingPractices?: string;
  }) => Promise<UserProfile>;
  loginWithOtpDemoOrSupabase: (params: {
    phone: string;
    name?: string;
    role: 'customer' | 'farmer';
    location?: string;
  }) => Promise<UserProfile>;
  provisionLocalAdminAccount: (params: { email: string; name: string; password: string }) => Promise<UserProfile>;
  switchDemoPortalRole: (role: Exclude<UserRole, 'super_admin' | 'operations_admin'>) => UserProfile;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function sha256Hex(input: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  // Deterministic fallback only if crypto.subtle unavailable in non-HTTPS test env
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

function readLocalAdminRecord(): LocalAdminRecord | null {
  try {
    const raw = localStorage.getItem(LOCAL_ADMIN_PROVISION_KEY);
    return raw ? (JSON.parse(raw) as LocalAdminRecord) : null;
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as UserProfile;
        store.setCurrentUser(parsed);
        return parsed;
      }
    } catch {
      // ignore invalid session
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(isSupabaseConfigured && Boolean(supabase));
  const [hasProvisionedLocalAdmin, setHasProvisionedLocalAdmin] = useState<boolean>(() => Boolean(readLocalAdminRecord()));

  const authMode: AuthContextValue['authMode'] = centralBackendUrl
    ? 'backend'
    : isSupabaseConfigured
    ? 'supabase'
    : 'offline';

  const commitSession = (profile: UserProfile | null) => {
    setUser(profile);
    try {
      if (profile) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(profile));
        store.setCurrentUser(profile);
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch {
      // ignore storage errors
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    let mounted = true;
    getSupabaseSession()
      .then(async session => {
        if (!mounted) return;
        if (session?.user) {
          const profile = await fetchUserProfileFromSupabase(session.user.id);
          if (profile && mounted) commitSession(profile);
        }
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        const profile = await fetchUserProfileFromSupabase(session.user.id);
        if (profile && mounted) commitSession(profile);
      } else if (_event === 'SIGNED_OUT') {
        commitSession(null);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const loginWithEmailPassword: AuthContextValue['loginWithEmailPassword'] = async (
    email,
    password,
    expectedRoleGroup
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      throw new Error('Email and password are required.');
    }

    if (centralBackendUrl) {
      const res = await fetch(`${centralBackendUrl.replace(/\/$/, '')}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      if (!res.ok) {
        throw new Error('Invalid email or password.');
      }
      const data = await res.json();
      const role = (data.user?.role || 'customer') as UserRole;
      if (expectedRoleGroup === 'admin' && role !== 'super_admin' && role !== 'operations_admin') {
        throw new Error('Access denied: This account does not have Administrator authorization.');
      }
      setBackendToken(data.access_token);
      const profile: UserProfile = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name || cleanEmail.split('@')[0],
        role,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      commitSession(profile);
      return profile;
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
      if (error || !data.user) {
        throw new Error(error?.message || 'Authentication failed.');
      }
      const dbProfile = await fetchUserProfileFromSupabase(data.user.id);
      const fallbackRole: UserRole =
        data.user.user_metadata?.role === 'farmer' ? 'farmer' : 'customer';
      const profile: UserProfile = dbProfile || {
        id: data.user.id,
        email: data.user.email || cleanEmail,
        name: data.user.user_metadata?.name || cleanEmail.split('@')[0],
        role: fallbackRole,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      if (expectedRoleGroup === 'admin' && profile.role !== 'super_admin' && profile.role !== 'operations_admin') {
        await supabase.auth.signOut();
        throw new Error('Access denied: Only authorized Admin accounts in Supabase profiles can access the Admin Centre.');
      }
      commitSession(profile);
      return profile;
    }

    // Offline-first authenticated verification (no hardcoded admin passwords)
    if (expectedRoleGroup === 'admin') {
      const envAdminHash = import.meta.env.VITE_ADMIN_PASS_HASH as string | undefined;
      const envAdminEmail = (import.meta.env.VITE_ADMIN_EMAIL as string | undefined)?.toLowerCase();
      if (envAdminHash && envAdminEmail) {
        const candidate = await sha256Hex(password);
        if (cleanEmail === envAdminEmail && candidate === envAdminHash) {
          const adminProfile: UserProfile = {
            id: 'usr-admin-1',
            email: cleanEmail,
            name: 'Authorized Administrator',
            role: 'super_admin',
            organization: 'Pure Krishi HQ',
            location: 'Bengaluru, Karnataka',
            status: 'active',
            createdAt: new Date().toISOString(),
          };
          commitSession(adminProfile);
          return adminProfile;
        }
      }

      const provisioned = readLocalAdminRecord();
      if (!provisioned) {
        throw new Error('No Admin account has been provisioned in offline mode yet. Complete Authorized Admin Provisioning or connect Supabase Auth.');
      }
      const computed = await sha256Hex(`${provisioned.salt}:${password}`);
      if (provisioned.email.toLowerCase() !== cleanEmail || computed !== provisioned.passwordHash) {
        throw new Error('Invalid administrator email or passphrase.');
      }
      const adminProfile: UserProfile = {
        id: 'usr-admin-1',
        email: provisioned.email,
        name: provisioned.name,
        role: provisioned.role,
        organization: 'Pure Krishi HQ',
        location: 'Bengaluru, Karnataka',
        status: 'active',
        createdAt: provisioned.provisionedAt,
      };
      commitSession(adminProfile);
      return adminProfile;
    }

    // Offline farmer / customer lookup by email
    const matchingFarmer = store.getState().farmers.find(f => f.email.toLowerCase() === cleanEmail);
    if (expectedRoleGroup === 'farmer' || matchingFarmer) {
      const f = matchingFarmer || store.getState().farmers[0];
      const profile: UserProfile = {
        id: f.id,
        email: cleanEmail,
        name: f.name,
        phone: f.phone,
        role: 'farmer',
        location: `${f.village}, ${f.district}, ${f.state}`,
        status: 'active',
        createdAt: f.createdAt,
      };
      commitSession(profile);
      return profile;
    }

    const existingCustomer = store.getState().customerAccounts.find(c => c.email.toLowerCase() === cleanEmail);
    const custProfile: UserProfile = {
      id: existingCustomer?.id || `usr-cust-${Date.now().toString().slice(-4)}`,
      email: cleanEmail,
      name: existingCustomer?.name || cleanEmail.split('@')[0],
      phone: existingCustomer?.phone || '+91 98200 44556',
      location: existingCustomer?.location || 'Mumbai, Maharashtra',
      role: 'customer',
      status: 'active',
      createdAt: existingCustomer?.joinedAt || new Date().toISOString(),
    };
    commitSession(custProfile);
    return custProfile;
  };

  const registerPublicAccount: AuthContextValue['registerPublicAccount'] = async params => {
    // STRICT SECURITY: Public registration NEVER grants admin roles
    const safeRole: 'customer' | 'farmer' = params.role === 'farmer' ? 'farmer' : 'customer';
    const cleanEmail = params.email.trim().toLowerCase();

    if (centralBackendUrl) {
      const res = await fetch(`${centralBackendUrl.replace(/\/$/, '')}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: params.name.trim(),
          email: cleanEmail,
          password: params.password,
          role: safeRole,
        }),
      });
      if (!res.ok) {
        throw new Error('Registration failed on backend server.');
      }
      const data = await res.json();
      setBackendToken(data.access_token);
    } else if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: params.password,
        options: {
          data: {
            name: params.name.trim(),
            phone: params.phone || '',
            role: safeRole,
          },
        },
      });
      if (error) throw new Error(error.message);
    }

    if (safeRole === 'farmer') {
      const newFarmer = store.addFarmer({
        name: params.name.trim(),
        phone: params.phone || '+91 90000 00000',
        email: cleanEmail,
        village: params.village || 'Dindori',
        district: params.district || 'Nashik',
        state: params.state || 'Maharashtra',
        totalAcres: params.totalAcres || 4,
        farmingPractices: params.farmingPractices || 'Certified Organic (NPOP)',
        mainCrops: ['Vegetables'],
        farms: [],
      });
      const profile: UserProfile = {
        id: newFarmer.id,
        email: cleanEmail,
        name: newFarmer.name,
        phone: newFarmer.phone,
        role: 'farmer',
        location: `${newFarmer.village}, ${newFarmer.district}, ${newFarmer.state}`,
        status: 'active',
        createdAt: newFarmer.createdAt,
      };
      commitSession(profile);
      return profile;
    }

    const custProfile: UserProfile = {
      id: `usr-cust-${Date.now().toString().slice(-4)}`,
      email: cleanEmail,
      name: params.name.trim(),
      phone: params.phone || '+91 98200 44556',
      location: params.location || 'Mumbai, Maharashtra',
      role: 'customer',
      organization: 'Individual Consumer',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    commitSession(custProfile);
    return custProfile;
  };

  const loginWithOtpDemoOrSupabase: AuthContextValue['loginWithOtpDemoOrSupabase'] = async ({
    phone,
    name,
    role,
    location,
  }) => {
    const safeRole: 'customer' | 'farmer' = role === 'farmer' ? 'farmer' : 'customer';
    if (safeRole === 'farmer') {
      const existing = store.getState().farmers.find(f => f.phone.replace(/\D/g, '').endsWith(phone.slice(-10)));
      const farmer =
        existing ||
        store.addFarmer({
          name: name?.trim() || 'Partner Farmer',
          phone: `+91 ${phone}`,
          email: `farmer.${phone.slice(-4)}@purekrishi.in`,
          village: 'Dindori',
          district: 'Nashik',
          state: 'Maharashtra',
          totalAcres: 5,
          farmingPractices: 'Certified Organic (NPOP)',
          mainCrops: ['Vegetables', 'Fruits'],
          farms: [],
        });
      const profile: UserProfile = {
        id: farmer.id,
        email: farmer.email,
        name: farmer.name,
        phone: farmer.phone,
        role: 'farmer',
        location: `${farmer.village}, ${farmer.district}, ${farmer.state}`,
        status: 'active',
        createdAt: farmer.createdAt,
      };
      commitSession(profile);
      return profile;
    }

    const profile: UserProfile = {
      id: `usr-cust-${phone.slice(-4)}`,
      email: `customer.${phone.slice(-4)}@purekrishi.in`,
      name: name?.trim() || 'Pure Krishi Customer',
      phone: `+91 ${phone}`,
      location: location || 'Mumbai, Maharashtra',
      role: 'customer',
      organization: 'Individual Consumer',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    commitSession(profile);
    return profile;
  };

  const provisionLocalAdminAccount: AuthContextValue['provisionLocalAdminAccount'] = async ({
    email,
    name,
    password,
  }) => {
    if (isSupabaseConfigured || centralBackendUrl) {
      throw new Error('Local provisioning is disabled when Supabase or Backend Auth is active. Create Admin users securely in Supabase Dashboard.');
    }
    if (readLocalAdminRecord()) {
      throw new Error('An offline Admin account is already provisioned on this workspace. Sign in using your existing credentials.');
    }
    if (password.length < 8) {
      throw new Error('Admin passphrase must be at least 8 characters long.');
    }
    const salt = Math.random().toString(36).slice(2, 14);
    const passwordHash = await sha256Hex(`${salt}:${password}`);
    const record: LocalAdminRecord = {
      email: email.trim().toLowerCase(),
      name: name.trim() || 'Super Administrator',
      salt,
      passwordHash,
      role: 'super_admin',
      provisionedAt: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_ADMIN_PROVISION_KEY, JSON.stringify(record));
    setHasProvisionedLocalAdmin(true);

    const profile: UserProfile = {
      id: 'usr-admin-1',
      email: record.email,
      name: record.name,
      role: 'super_admin',
      organization: 'Pure Krishi HQ',
      location: 'Bengaluru, Karnataka',
      status: 'active',
      createdAt: record.provisionedAt,
    };
    commitSession(profile);
    return profile;
  };

  const switchDemoPortalRole: AuthContextValue['switchDemoPortalRole'] = role => {
    store.switchRole(role);
    const nextUser = store.getState().currentUser;
    commitSession(nextUser);
    return nextUser;
  };

  const logout = async () => {
    setBackendToken(null);
    await signOutSupabase();
    commitSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        authMode,
        hasProvisionedLocalAdmin,
        loginWithEmailPassword,
        registerPublicAccount,
        loginWithOtpDemoOrSupabase,
        provisionLocalAdminAccount,
        switchDemoPortalRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
