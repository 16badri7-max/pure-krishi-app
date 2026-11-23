import React, { useState } from 'react';
import { Search, MapPin, Package, Truck, CheckCircle, Clock } from 'lucide-react';

const steps = [
  { key: 'placed', label: 'Order Placed', icon: Package, time: '22 Nov, 10:00 AM', done: true },
  { key: 'processing', label: 'Processing', icon: Clock, time: '22 Nov, 11:30 AM', done: true },
  { key: 'dispatched', label: 'Dispatched from Farm', icon: Truck, time: '22 Nov, 2:00 PM', done: true },
  { key: 'in-transit', label: 'In Transit', icon: Truck, time: '23 Nov, 9:00 AM', done: true },
  { key: 'out', label: 'Out for Delivery', icon: MapPin, time: '23 Nov, 11:00 AM', done: false },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle, time: 'Expected by 2 PM', done: false },
];

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('PK-1032');
  const [searched, setSearched] = useState(true);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold text-gray-800">Track Order</h1>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={orderId} onChange={e => setOrderId(e.target.value)}
            placeholder="Enter Order ID (e.g. PK-1032)"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>
        <button onClick={() => setSearched(true)}
          className="bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition">
          Track
        </button>
      </div>

      {searched && (
        <>
          {/* Order info card */}
          <div className="bg-gradient-to-br from-green-700 to-emerald-800 text-white rounded-2xl p-5">
            <div className="text-sm text-green-200">Order {orderId}</div>
            <h2 className="text-lg font-bold mt-1">Basmati Rice 5kg</h2>
            <div className="mt-2 text-green-200 text-sm">Expected delivery: Today by 2:00 PM</div>
            <div className="mt-3 bg-white/10 rounded-xl px-4 py-2 inline-block">
              <div className="text-sm font-medium">🚚 In Transit — Hubli → Dharwad</div>
            </div>
          </div>

          {/* Stepper */}
          <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-5">Delivery Status</h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-gray-200" />
              <div className="space-y-6">
                {steps.map((step, i) => (
                  <div key={step.key} className="flex items-start gap-4 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${step.done ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-300'}`}>
                      <step.icon size={15} />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className={`text-sm font-medium ${step.done ? 'text-gray-800' : 'text-gray-400'}`}>{step.label}</div>
                      <div className={`text-xs mt-0.5 ${step.done ? 'text-gray-400' : 'text-gray-300'}`}>{step.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery info */}
          <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm">Delivery Address</h3>
            <div className="text-sm text-gray-600">📍 123 MG Road, Dharwad – 580001, Karnataka</div>
            <div className="mt-2 text-sm text-gray-500">Delivery Partner: Pure Krishi Logistics</div>
          </div>
        </>
      )}
    </div>
  );
}
