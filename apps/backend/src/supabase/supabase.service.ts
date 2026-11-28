import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient | null = null;
  private url: string;
  private anonKey: string;
  private serviceKeyConfigured = false;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL') || '';
    const anonKey = this.configService.get<string>('SUPABASE_ANON_KEY') || '';
    const serviceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') || '';
    const effectiveKey = serviceRoleKey || anonKey;

    this.url = url;
    this.anonKey = anonKey || serviceRoleKey;
    this.serviceKeyConfigured = Boolean(serviceRoleKey);

    if (url && effectiveKey && !url.includes('placeholder') && !url.includes('your-project')) {
      this.client = createClient(url, effectiveKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
    }
  }

  getClient(): SupabaseClient | null {
    return this.client;
  }

  isServiceRole(): boolean {
    return this.serviceKeyConfigured;
  }

  createAnonClient(): SupabaseClient | null {
    if (!this.url || !this.anonKey || this.url.includes('placeholder') || this.url.includes('your-project')) {
      return null;
    }
    return createClient(this.url, this.anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  getClientForUser(sbToken?: string): SupabaseClient | null {
    if (this.serviceKeyConfigured && this.client) {
      return this.client;
    }
    if (sbToken && this.url && this.anonKey) {
      return createClient(this.url, this.anonKey, {
        auth: { autoRefreshToken: false, persistSession: false },
        global: { headers: { Authorization: `Bearer ${sbToken}` } },
      });
    }
    return this.client;
  }

  isConfigured(): boolean {
    return this.client !== null;
  }
}
