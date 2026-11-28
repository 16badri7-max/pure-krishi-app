import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class FarmersService {
  private farmers = [
    { id: 'fmr-01', name: 'Ramesh Patil', location: 'Dindori, Nashik, Maharashtra', farm: 'Godavari Bio-Dynamic Orchards', verified: true, crops: ['Tomatoes', 'Onions'] },
    { id: 'fmr-02', name: 'Basavaraj Gowda', location: 'Mandya, Karnataka', farm: 'Kaveri Green Springs Farm', verified: true, crops: ['Spinach', 'Cucumbers'] },
    { id: 'fmr-03', name: 'Srinivasa Rao', location: 'Tenali, Guntur, Andhra Pradesh', farm: 'Krishna Delta Natural Acres', verified: true, crops: ['Rice', 'Turmeric'] },
    { id: 'fmr-04', name: 'Kuldeep Negi', location: 'Theog, Shimla, Himachal Pradesh', farm: 'Himalayan Highs Apple Estate', verified: true, crops: ['Apples', 'Walnuts'] },
  ];
  private stockSubmissions: any[] = [];

  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll() {
    const client = this.supabaseService.getClient();
    if (client) {
      const { data, error } = await client.from('farmers').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return this.farmers;
  }

  async findOne(id: string) {
    const client = this.supabaseService.getClient();
    if (client) {
      const { data } = await client.from('farmers').select('*').eq('id', id).maybeSingle();
      if (data) return data;
    }
    return this.farmers.find(f => f.id === id);
  }

  async submitStock(body: any, userId: string, sbToken?: string) {
    const client = this.supabaseService.getClientForUser(sbToken);
    if (client) {
      const { data, error } = await client
        .from('stock_submissions')
        .insert({
          farmer_id: body.farmerId || null,
          submitted_by: userId,
          farmer_name: body.farmerName || 'Farmer',
          product_id: body.productId || null,
          warehouse_id: body.warehouseId || null,
          harvest_batch_id: body.harvestBatchId || null,
          product_name: body.productName,
          submitted_quantity: Number(body.submittedQuantity || 0),
          unit: body.unit || 'kg',
          harvest_date: body.harvestDate || new Date().toISOString().split('T')[0],
          expected_grade: body.expectedGrade || 'Grade A Premium',
          notes: body.notes || '',
          status: 'pending',
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    }
    const created = { ...body, id: `stk-${Date.now()}`, status: 'pending', createdAt: new Date().toISOString() };
    this.stockSubmissions.unshift(created);
    return created;
  }
}
