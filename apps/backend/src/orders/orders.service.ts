import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class OrdersService {
  private orders: any[] = [];

  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(user: { userId: string; role: string; sbToken?: string }) {
    const client = this.supabaseService.getClientForUser(user.sbToken);
    if (client) {
      let query = client
        .from('customer_orders')
        .select('*, customer_order_items(*)')
        .order('order_date', { ascending: false });
      if (user.role !== 'super_admin' && user.role !== 'operations_admin') {
        query = query.eq('customer_id', user.userId);
      }
      const { data, error } = await query;
      if (!error && data) return data;
    }

    if (user.role === 'super_admin' || user.role === 'operations_admin') {
      return this.orders;
    }
    return this.orders.filter(o => o.customerId === user.userId);
  }

  async create(order: any, user: { userId: string; email: string; sbToken?: string }) {
    if (!order?.items || !Array.isArray(order.items) || order.items.length === 0) {
      throw new BadRequestException('Order items are required');
    }

    const client = this.supabaseService.getClientForUser(user.sbToken);
    if (client) {
      const { data, error } = await client.rpc('place_customer_order', {
        p_customer_name: order.customerName || user.email,
        p_customer_phone: order.customerPhone || '',
        p_shipping_address: order.shippingAddress || '',
        p_payment_method: order.paymentMethod || 'upi',
        p_delivery_slot: order.deliverySlot || 'Tomorrow Morning',
        p_items: order.items.map((it: any) => ({ product_id: it.productId, quantity: it.quantity })),
        p_idempotency_key: order.idempotencyKey || null,
        p_customer_id: user.userId,
      });
      if (error) throw new BadRequestException(error.message);
      return data;
    }

    const newOrder = {
      ...order,
      id: `ORD-${Date.now()}`,
      customerId: user.userId,
      status: 'Order Placed',
      createdAt: new Date().toISOString(),
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  async updateStatus(id: string, status: string, adminUserId: string, sbToken?: string) {
    const client = this.supabaseService.getClientForUser(sbToken);
    if (client) {
      const { data, error } = await client
        .from('customer_orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new BadRequestException(error.message);
      await client.from('audit_logs').insert({
        user_id: adminUserId,
        actor_role: 'super_admin',
        action: 'ADMIN_ORDER_STATUS_UPDATED',
        entity_type: 'customer_orders',
        entity_id: id,
        new_values: { status },
      });
      return data;
    }

    const order = this.orders.find(o => o.id === id);
    if (order) order.status = status;
    return order;
  }
}
