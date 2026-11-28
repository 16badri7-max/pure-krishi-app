import React, { useState } from 'react';
import { Truck, MapPin, Clock } from 'lucide-react';
import { useStore } from '../../services/useStore';
import { centralApi } from '../../lib/centralApi';
import { Badge } from '../common/Badge';
import type { DeliveryRecord } from '../../types';

export const DeliveryManagementView: React.FC = () => {
  const { state } = useStore();
  const [filter, setFilter] = useState<'all' | DeliveryRecord['status']>('all');
  const [driverDraft, setDriverDraft] = useState<Record<string, string>>({});
  const [locDraft, setLocDraft] = useState<Record<string, string>>({});

  const filtered = state.deliveries.filter(d => filter === 'all' || d.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-[#17231C]">
            Delivery & Last-Mile Fleet Management
          </h1>
          <p className="text-xs text-[#66736A] mt-1">
            Assign delivery partners, update live transit checkpoints, and synchronize delivery status back to Customer and B2B order trackers.
          </p>
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value as typeof filter)}
          className="text-xs rounded-xl border border-gray-200 px-3 py-2 bg-white font-semibold"
        >
          <option value="all">All Deliveries ({state.deliveries.length})</option>
          <option value="Assigned">Assigned</option>
          <option value="In Transit">In Transit</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#176B45]/15 shadow-sm">
          <span className="text-[11px] font-bold text-[#66736A] uppercase">Active Shipments</span>
          <div className="text-2xl font-extrabold text-[#17231C] mt-1">
            {state.deliveries.filter(d => d.status !== 'Delivered').length}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#176B45]/15 shadow-sm">
          <span className="text-[11px] font-bold text-[#66736A] uppercase">Out for Delivery</span>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">
            {state.deliveries.filter(d => d.status === 'Out for Delivery').length}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#176B45]/15 shadow-sm">
          <span className="text-[11px] font-bold text-[#66736A] uppercase">Completed Deliveries</span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">
            {state.deliveries.filter(d => d.status === 'Delivered').length}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(del => (
          <div key={del.id} className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-xs text-[#176B45]">{del.id}</span>
                  <span className="text-xs font-bold bg-gray-100 px-2 py-0.5 rounded">{del.orderType} • {del.orderId}</span>
                  <h3 className="font-bold text-sm text-[#17231C]">{del.customerOrBuyerName}</h3>
                </div>
                <p className="text-xs text-[#66736A] mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" /> {del.destination}
                </p>
              </div>
              <Badge variant={del.status === 'Delivered' ? 'green' : del.status === 'Out for Delivery' ? 'blue' : 'amber'}>
                {del.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Driver / Partner</label>
                <input
                  value={driverDraft[del.id] ?? del.driverName}
                  onChange={e => setDriverDraft(prev => ({ ...prev, [del.id]: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-3 py-1.5"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Live Checkpoint</label>
                <input
                  value={locDraft[del.id] ?? del.currentLocation}
                  onChange={e => setLocDraft(prev => ({ ...prev, [del.id]: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-3 py-1.5"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Update Delivery Status</label>
                <select
                  value={del.status}
                  onChange={e =>
                    centralApi.adminUpdateDeliveryStatus(
                      del.id,
                      e.target.value as DeliveryRecord['status'],
                      driverDraft[del.id] ?? del.driverName,
                      del.vehicleNumber,
                      locDraft[del.id] ?? del.currentLocation
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 px-3 py-1.5 bg-white font-bold text-[#176B45]"
                >
                  {(['Assigned', 'In Transit', 'Out for Delivery', 'Delivered', 'Failed'] as const).map(st => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#176B45]" /> Vehicle: <strong>{del.vehicleNumber}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Updated: {new Date(del.updatedAt).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
