import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  private orders: any[] = [];

  findAll() { return this.orders; }
  create(order: any) {
    const newOrder = { ...order, id: `ORD-${Date.now()}`, status: 'pending', createdAt: new Date().toISOString() };
    this.orders.push(newOrder);
    return newOrder;
  }
  updateStatus(id: string, status: string) {
    const order = this.orders.find(o => o.id === id);
    if (order) order.status = status;
    return order;
  }
}
