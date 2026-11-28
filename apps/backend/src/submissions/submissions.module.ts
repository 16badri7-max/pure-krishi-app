import { Body, Controller, Get, Injectable, Module, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class SubmissionsService {
  private submissions: any[] = [];

  constructor(private readonly supabaseService: SupabaseService) {}

  async list(user: { userId: string; role: string; sbToken?: string }) {
    const client = this.supabaseService.getClientForUser(user.sbToken);
    if (client) {
      let query = client
        .from('farmer_product_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (user.role !== 'super_admin' && user.role !== 'operations_admin') {
        query = query.eq('submitted_by', user.userId);
      }
      const { data, error } = await query;
      if (!error && data) return data;
    }

    if (user.role === 'super_admin' || user.role === 'operations_admin') {
      return this.submissions;
    }
    return this.submissions.filter(s => s.submittedBy === user.userId);
  }

  async create(body: any, user: { userId: string; sbToken?: string }) {
    const client = this.supabaseService.getClientForUser(user.sbToken);
    if (client) {
      const { data, error } = await client
        .from('farmer_product_submissions')
        .insert({
          farmer_id: body.farmerId || null,
          submitted_by: user.userId,
          farmer_name: body.farmerName || 'Farmer',
          submission_type: body.submissionType || 'new_product',
          target_product_id: body.targetProductId || null,
          product_name: body.productName,
          category: body.category,
          description: body.description || '',
          images: body.images || [],
          proposed_price: Number(body.proposedPrice || 0),
          unit: body.unit || 'kg',
          proposed_quantity: Number(body.proposedQuantity || 0),
          harvest_date: body.harvestDate || null,
          organic_certified: body.organicCertified !== false,
          farming_notes: body.farmingNotes || '',
          status: 'pending',
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    }

    const created = {
      ...body,
      id: `sub-${Date.now()}`,
      submittedBy: user.userId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.submissions.unshift(created);
    return created;
  }

  async review(id: string, body: any, adminUserId?: string, sbToken?: string) {
    const client = this.supabaseService.getClientForUser(sbToken);
    if (client) {
      const { data, error } = await client.rpc('admin_review_product_submission', {
        p_submission_id: id,
        p_decision: body.decision,
        p_admin_notes: body.adminNotes || null,
        p_override_price: body.overridePrice ?? null,
        p_override_quantity: body.overrideQuantity ?? null,
        p_override_title: body.overrideName ?? null,
        p_override_description: body.overrideDescription ?? null,
        p_admin_id: adminUserId || null,
      });
      if (error) throw new Error(error.message);
      return data;
    }

    const sub = this.submissions.find(s => s.id === id);
    if (sub) {
      sub.status = body.decision;
      sub.adminNotes = body.adminNotes;
    }
    return sub;
  }
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get()
  list(@Req() req: any) {
    return this.submissionsService.list(req.user);
  }

  @Roles('farmer', 'super_admin', 'operations_admin')
  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.submissionsService.create(body, req.user);
  }

  @Roles('super_admin', 'operations_admin')
  @Post(':id/review')
  review(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.submissionsService.review(id, body, req.user?.userId, req.user?.sbToken);
  }
}

@Module({
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
