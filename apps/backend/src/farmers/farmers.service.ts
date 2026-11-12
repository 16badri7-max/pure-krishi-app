import { Injectable } from '@nestjs/common';

@Injectable()
export class FarmersService {
  private farmers = [
    { id: 'fmr-01', name: 'Ramesh Patil', location: 'Dindori, Nashik, Maharashtra', farm: 'Godavari Bio-Dynamic Orchards', verified: true, crops: ['Tomatoes', 'Onions'] },
    { id: 'fmr-02', name: 'Basavaraj Gowda', location: 'Mandya, Karnataka', farm: 'Kaveri Green Springs Farm', verified: true, crops: ['Spinach', 'Cucumbers'] },
    { id: 'fmr-03', name: 'Srinivasa Rao', location: 'Tenali, Guntur, Andhra Pradesh', farm: 'Krishna Delta Natural Acres', verified: true, crops: ['Rice', 'Turmeric'] },
    { id: 'fmr-04', name: 'Kuldeep Negi', location: 'Theog, Shimla, Himachal Pradesh', farm: 'Himalayan Highs Apple Estate', verified: true, crops: ['Apples', 'Walnuts'] },
  ];

  findAll() { return this.farmers; }
  findOne(id: string) { return this.farmers.find(f => f.id === id); }
}
