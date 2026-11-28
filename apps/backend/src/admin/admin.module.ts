import { Body, Controller, Get, Injectable, Module, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AdminService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getAnalytics(sbToken?: string) {
    const client = this.supabaseService.getClientForUser(sbToken);
    if (!client) {
      return { source: 'offline-fallback', connected: false };
    }
    const [customers, farmers, products, orders] = await Promise.all([
      client.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
      client.from('farmers').select('id', { count: 'exact', head: true }),
      client.from('products').select('id, available_quantity, is_published'),
      client.from('customer_orders').select('id, total_amount, status'),
    ]);

    const orderRows = orders.data || [];
    const totalRevenue = orderRows.reduce((s, o) => s + Number(o.total_amount || 0), 0);
    const pendingOrders = orderRows.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
    const completedOrders = orderRows.filter(o => o.status === 'Delivered').length;
    const productRows = products.data || [];
    const lowStockAlerts = productRows.filter(p => Number(p.available_quantity || 0) <= 25).length;

    return {
      source: 'supabase',
      totalCustomers: customers.count || 0,
      totalFarmers: farmers.count || 0,
      totalProducts: productRows.length,
      totalOrders: orderRows.length,
      totalRevenue,
      pendingOrders,
      completedOrders,
      lowStockAlerts,
    };
  }

  async getAuditLogs(sbToken?: string) {
    const client = this.supabaseService.getClientForUser(sbToken);
    if (!client) return [];
    const { data } = await client.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100);
    return data || [];
  }

  async approveStockSubmission(id: string, body: any, adminUserId?: string, sbToken?: string) {
    const client = this.supabaseService.getClientForUser(sbToken);
    if (!client) return { id, status: body.decision };
    const { data, error } = await client.rpc('admin_approve_stock_submission', {
      p_submission_id: id,
      p_decision: body.decision,
      p_admin_notes: body.adminNotes || null,
      p_admin_id: adminUserId || null,
    });
    if (error) throw new Error(error.message);
    return data;
  }

  async updateSettings(key: string, value: any, sbToken?: string) {
    const client = this.supabaseService.getClientForUser(sbToken);
    if (!client) return { key, value };
    const { data, error } = await client
      .from('platform_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin', 'operations_admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('analytics')
  analytics(@Req() req: any) {
    return this.adminService.getAnalytics(req.user?.sbToken);
  }

  @Get('audit-logs')
  auditLogs(@Req() req: any) {
    return this.adminService.getAuditLogs(req.user?.sbToken);
  }

  @Post('stock-submissions/:id/approve')
  approveStock(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.adminService.approveStockSubmission(id, body, req.user?.userId, req.user?.sbToken);
  }

  @Put('settings/:key')
  updateSetting(@Param('key') key: string, @Body('value') value: any, @Req() req: any) {
    return this.adminService.updateSettings(key, value, req.user?.sbToken);
  }
}

@Module({
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
