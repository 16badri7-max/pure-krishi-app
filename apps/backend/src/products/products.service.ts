import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ProductsService {
  private fallbackProducts = [
    {
      id: 'prd-01',
      name: 'Certified Organic Heirloom Tomatoes',
      category: 'Vegetables',
      price: 48,
      sellingPrice: 48,
      unit: '1 kg pack',
      availableQuantity: 450,
      farmerName: 'Ramesh Patil',
      farmerLocation: 'Dindori, Nashik, Maharashtra',
      approvalStatus: 'approved',
      isPublished: true,
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'prd-04',
      name: 'Traditional Sona Masoori Unpolished Rice',
      category: 'Grains',
      price: 88,
      sellingPrice: 88,
      unit: '1 kg pack',
      availableQuantity: 1200,
      farmerName: 'Srinivasa Rao',
      farmerLocation: 'Tenali, Guntur, Andhra Pradesh',
      approvalStatus: 'approved',
      isPublished: true,
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'prd-05',
      name: 'Natural Turmeric Powder (5.2% Curcumin)',
      category: 'Spices',
      price: 140,
      sellingPrice: 140,
      unit: '250 g jar',
      availableQuantity: 340,
      farmerName: 'Srinivasa Rao',
      farmerLocation: 'Tenali, Guntur, Andhra Pradesh',
      approvalStatus: 'approved',
      isPublished: true,
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    },
  ];

  constructor(private readonly supabaseService: SupabaseService) {}

  private mapProductRow(row: Record<string, any>) {
    return {
      id: String(row.id),
      name: String(row.name || ''),
      category: row.category || 'Vegetables',
      price: Number(row.price ?? 0),
      sellingPrice: Number(row.selling_price ?? row.price ?? 0),
      mrp: row.mrp != null ? Number(row.mrp) : undefined,
      unit: String(row.unit || 'kg'),
      availableQuantity: Number(row.available_quantity ?? 0),
      farmerId: row.farmer_id ? String(row.farmer_id) : undefined,
      farmerName: String(row.farmer_name || 'Pure Krishi Partner Farmer'),
      farmerLocation: String(row.farmer_location || 'India'),
      farmName: String(row.farm_name || 'Verified Organic Farm'),
      harvestBatchId: String(row.harvest_batch_id || 'BAT-VERIFIED'),
      verificationBadge: String(row.verification_badge || 'NPOP Organic Certified'),
      imageUrl: String(
        row.image_url ||
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
      ),
      description: String(row.description || ''),
      nutritionalBenefits: Array.isArray(row.nutritional_benefits) ? row.nutritional_benefits : [],
      approvalStatus: row.approval_status || 'approved',
      isPublished: row.is_published !== false,
      isActive: row.is_active !== false,
      lowStockThreshold: Number(row.low_stock_threshold ?? 25),
      updatedAt: row.updated_at ? String(row.updated_at) : undefined,
      isLockedForCustomers: Boolean(row.is_locked_for_customers),
      lockedByBuyerName: row.locked_by_buyer_name ? String(row.locked_by_buyer_name) : undefined,
      lockedReason: row.locked_reason ? String(row.locked_reason) : undefined,
      lockedQuantityKg: row.locked_quantity_kg != null ? Number(row.locked_quantity_kg) : undefined,
    };
  }

  async findAllApproved(category?: string) {
    const client = this.supabaseService.getClient();
    if (client) {
      let query = client
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('is_published', true)
        .eq('approval_status', 'approved');
      if (category && category !== 'all') query = query.eq('category', category);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error && data) return data.map(r => this.mapProductRow(r));
    }

    const active = this.fallbackProducts.filter(
      p => p.isActive && p.isPublished && p.approvalStatus === 'approved'
    );
    if (category && category !== 'all') return active.filter(p => p.category === category);
    return active;
  }

  async findAllAdmin(sbToken?: string) {
    const client = this.supabaseService.getClientForUser(sbToken);
    if (client) {
      const { data, error } = await client.from('products').select('*').order('created_at', { ascending: false });
      if (!error && data) return data.map(r => this.mapProductRow(r));
    }
    return this.fallbackProducts;
  }

  async findOne(id: string) {
    const client = this.supabaseService.getClient();
    if (client) {
      const { data } = await client.from('products').select('*').eq('id', id).maybeSingle();
      if (data) return this.mapProductRow(data);
    }
    return this.fallbackProducts.find(p => p.id === id);
  }

  async createAsAdmin(payload: any, adminUserId: string, sbToken?: string) {
    const client = this.supabaseService.getClientForUser(sbToken);
    if (client) {
      const { data, error } = await client
        .from('products')
        .insert({
          name: payload.name,
          category: payload.category,
          price: payload.price,
          selling_price: payload.sellingPrice ?? payload.price,
          unit: payload.unit || 'kg',
          available_quantity: payload.availableQuantity ?? 0,
          image_url: payload.imageUrl,
          description: payload.description,
          farmer_name: payload.farmerName || 'Pure Krishi Partner Farm',
          approval_status: payload.approvalStatus || 'approved',
          is_published: payload.isPublished ?? true,
          is_active: payload.isActive ?? true,
          approved_by: adminUserId,
          approved_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      await client.from('audit_logs').insert({
        user_id: adminUserId,
        actor_role: 'super_admin',
        action: 'ADMIN_PRODUCT_CREATED',
        entity_type: 'products',
        entity_id: data.id,
        new_values: payload,
      });
      return this.mapProductRow(data);
    }

    const created = { ...payload, id: `prd-${Date.now()}` };
    this.fallbackProducts.unshift(created);
    return created;
  }

  async updateAsAdmin(id: string, payload: any, adminUserId: string, sbToken?: string) {
    const client = this.supabaseService.getClientForUser(sbToken);
    if (client) {
      const { data: prev } = await client.from('products').select('price, name').eq('id', id).maybeSingle();
      const { data, error } = await client
        .from('products')
        .update({
          ...(payload.name !== undefined ? { name: payload.name } : {}),
          ...(payload.category !== undefined ? { category: payload.category } : {}),
          ...(payload.price !== undefined ? { price: payload.price, selling_price: payload.price } : {}),
          ...(payload.availableQuantity !== undefined ? { available_quantity: payload.availableQuantity } : {}),
          ...(payload.description !== undefined ? { description: payload.description } : {}),
          ...(payload.imageUrl !== undefined ? { image_url: payload.imageUrl } : {}),
          ...(payload.isPublished !== undefined ? { is_published: payload.isPublished } : {}),
          ...(payload.isActive !== undefined ? { is_active: payload.isActive } : {}),
          ...(payload.approvalStatus !== undefined ? { approval_status: payload.approvalStatus } : {}),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);

      await client.from('audit_logs').insert({
        user_id: adminUserId,
        actor_role: 'super_admin',
        action: prev && payload.price !== undefined && Number(prev.price) !== Number(payload.price)
          ? 'ADMIN_PRODUCT_PRICE_CHANGED'
          : 'ADMIN_PRODUCT_UPDATED',
        entity_type: 'products',
        entity_id: id,
        old_values: prev || null,
        new_values: payload,
      });
      return this.mapProductRow(data);
    }

    const idx = this.fallbackProducts.findIndex(p => p.id === id);
    if (idx === -1) throw new NotFoundException('Product not found');
    this.fallbackProducts[idx] = { ...this.fallbackProducts[idx], ...payload };
    return this.fallbackProducts[idx];
  }

  async removeAsAdmin(id: string, adminUserId: string, sbToken?: string) {
    const client = this.supabaseService.getClientForUser(sbToken);
    if (client) {
      const { error } = await client.from('products').delete().eq('id', id);
      if (error) throw new Error(error.message);
      await client.from('audit_logs').insert({
        user_id: adminUserId,
        actor_role: 'super_admin',
        action: 'ADMIN_PRODUCT_DELETED',
        entity_type: 'products',
        entity_id: id,
      });
      return { deleted: true, id };
    }
    this.fallbackProducts = this.fallbackProducts.filter(p => p.id !== id);
    return { deleted: true, id };
  }
}
