import { Injectable, UnauthorizedException, ForbiddenException, ServiceUnavailableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './auth.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private supabaseService: SupabaseService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const anonClient = this.supabaseService.createAnonClient();
    if (!anonClient) {
      throw new ServiceUnavailableException('Supabase Auth is not configured on this backend.');
    }

    const { data, error } = await anonClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const sbToken = data.session?.access_token;
    const profileClient = this.supabaseService.getClientForUser(sbToken);
    const { data: profile } = profileClient
      ? await profileClient
          .from('profiles')
          .select('role, name, status')
          .eq('id', data.user.id)
          .maybeSingle()
      : { data: null };

    if (profile?.status === 'suspended') {
      throw new ForbiddenException('Account suspended. Contact Pure Krishi Admin.');
    }

    const authoritativeRole = profile?.role || (data.user.user_metadata?.role === 'farmer' ? 'farmer' : 'customer');
    const payload = {
      sub: data.user.id,
      email: data.user.email,
      role: authoritativeRole,
      sbToken,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || data.user.user_metadata?.name,
        role: authoritativeRole,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name, role } = registerDto;
    const anonClient = this.supabaseService.createAnonClient();
    if (!anonClient) {
      throw new ServiceUnavailableException('Supabase Auth is not configured on this backend.');
    }

    // Security rule: Public registration NEVER grants admin roles
    const safeRole = role === 'farmer' ? 'farmer' : 'customer';

    const { data, error } = await anonClient.auth.signUp({
      email,
      password,
      options: {
        data: { name, role: safeRole },
      },
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    const sbToken = data.session?.access_token;
    const payload = {
      sub: data.user?.id,
      email: data.user?.email,
      role: safeRole,
      sbToken,
    };

    return {
      access_token: this.jwtService.sign(payload),
      requiresEmailConfirmation: !data.session,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name,
        role: safeRole,
      },
    };
  }

  async validateUser(userId: string) {
    const client = this.supabaseService.getClient();
    if (!client) return null;
    if (this.supabaseService.isServiceRole()) {
      const { data } = await client.auth.admin.getUserById(userId);
      return data?.user || null;
    }
    const { data } = await client.from('profiles').select('id, email, name, role, status').eq('id', userId).maybeSingle();
    return data || null;
  }
}
