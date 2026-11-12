import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.supabase = createClient(
      this.configService.get('SUPABASE_URL') || 'http://localhost:54321',
      this.configService.get('SUPABASE_ANON_KEY') || 'anon-key',
    );
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Try Supabase auth
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: data.user.id,
      email: data.user.email,
      role: data.user.user_metadata?.role || 'consumer',
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name,
        role: data.user.user_metadata?.role || 'consumer',
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name, role } = registerDto;

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
      },
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    const payload = {
      sub: data.user?.id,
      email: data.user?.email,
      role: role || 'consumer',
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name,
        role,
      },
    };
  }

  async validateUser(userId: string) {
    const { data } = await this.supabase.auth.admin.getUserById(userId);
    return data?.user || null;
  }
}
