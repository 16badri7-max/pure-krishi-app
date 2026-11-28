import { createClient, Session } from '@supabase/supabase-js';
import type { UserProfile, UserRole } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const centralBackendUrl = import.meta.env.VITE_API_URL || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export async function getSupabaseSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

export async function fetchUserProfileFromSupabase(userId: string): Promise<UserProfile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, name, phone, avatar_url, organization, location, role, status, created_at')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    email: data.email,
    name: data.name,
    phone: data.phone ?? undefined,
    avatar: data.avatar_url ?? undefined,
    organization: data.organization ?? undefined,
    location: data.location ?? undefined,
    role: data.role as UserRole,
    status: (data.status as UserProfile['status']) || 'active',
    createdAt: data.created_at,
  };
}

export async function signOutSupabase(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

if (!isSupabaseConfigured) {
  console.info(
    '🌱 Pure Krishi is currently operating in offline-first mode with full persistent repository support. To connect to your Supabase PostgreSQL instance, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}
