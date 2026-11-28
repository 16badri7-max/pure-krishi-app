import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { FarmersModule } from './farmers/farmers.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { HealthModule } from './health/health.module';
import { SupabaseModule } from './supabase/supabase.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ...(process.env.DATABASE_URL
      ? [
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              type: 'postgres',
              url: config.get('DATABASE_URL'),
              ssl: config.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
              entities: [__dirname + '/**/*.entity{.ts,.js}'],
              synchronize: config.get('NODE_ENV') !== 'production',
              logging: false,
            }),
          }),
        ]
      : []),
    SupabaseModule,
    AuthModule,
    FarmersModule,
    ProductsModule,
    OrdersModule,
    SubmissionsModule,
    AdminModule,
    HealthModule,
  ],
})
export class AppModule {}
