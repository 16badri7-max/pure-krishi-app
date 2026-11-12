import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
  private products = [
    { id: 'prd-01', name: 'Certified Organic Heirloom Tomatoes', category: 'Vegetables', price: 48, unit: '1 kg pack', availableQuantity: 450, farmerName: 'Ramesh Patil', farmerLocation: 'Dindori, Nashik, Maharashtra', imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
    { id: 'prd-04', name: 'Traditional Sona Masoori Unpolished Rice', category: 'Grains', price: 88, unit: '1 kg pack', availableQuantity: 1200, farmerName: 'Srinivasa Rao', farmerLocation: 'Tenali, Guntur, Andhra Pradesh', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
    { id: 'prd-05', name: 'Natural Turmeric Powder (5.2% Curcumin)', category: 'Spices', price: 140, unit: '250 g jar', availableQuantity: 340, farmerName: 'Srinivasa Rao', farmerLocation: 'Tenali, Guntur, Andhra Pradesh', imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80' },
  ];

  findAll(category?: string) {
    if (category && category !== 'all') return this.products.filter(p => p.category === category);
    return this.products;
  }
  findOne(id: string) { return this.products.find(p => p.id === id); }
}
