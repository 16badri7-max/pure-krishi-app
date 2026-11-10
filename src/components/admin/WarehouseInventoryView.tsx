import React, { useState } from 'react';
import { 
  Warehouse, 
  Boxes, 
  Search, 
  Filter, 
  Plus, 
  Thermometer, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import { InventoryItem } from '../../types';
import { Badge } from '../common/Badge';

export const WarehouseInventoryView: React.FC = () => {
  const { state } = useStore();
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInventory = state.inventory.filter((item) => {
    const matchesWarehouse = selectedWarehouseId === 'all' || item.warehouseId === selectedWarehouseId;
    const matchesSearch = 
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.farmerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesWarehouse && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-display text-[#17231C]">
              Warehouse & Cold Storage Operations
            </h1>
            <span className="bg-[#FAF8F0] text-[#176B45] text-xs font-bold px-2 py-0.5 rounded-full border border-[#176B45]/15">
              Live Pallet & Bin Inventory
            </span>
          </div>
          <p className="text-xs text-[#66736A] mt-1">
            Track certified inbound harvest batches, temperature-controlled storage, and reserved supermarket stock.
          </p>
        </div>
      </div>

      {/* Warehouses Capacity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {state.warehouses.map((wh) => {
          const occupancy = Math.round((wh.occupiedTonnes / wh.capacityTonnes) * 100);
          return (
            <div 
              key={wh.id}
              className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#17231C]">{wh.name}</h3>
                  <p className="text-xs text-[#66736A]">{wh.city}, {wh.state}</p>
                </div>
                {wh.coldStorageAvailable && (
                  <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold flex items-center space-x-1" title="Cold Storage Available">
                    <Thermometer className="w-3.5 h-3.5" />
                    <span>Cold Chain</span>
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#66736A]">Storage Capacity:</span>
                  <span className="font-bold text-[#104D35]">{wh.occupiedTonnes} / {wh.capacityTonnes} Tonnes ({occupancy}%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${occupancy > 80 ? 'bg-amber-500' : 'bg-[#176B45]'}`}
                    style={{ width: `${occupancy}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#66736A]">
                <span>Mgr: {wh.contactPerson}</span>
                <span>{wh.phone}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#176B45]/15 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product, batch ID, farmer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#176B45]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={selectedWarehouseId}
            onChange={(e) => setSelectedWarehouseId(e.target.value)}
            className="text-xs rounded-xl border border-gray-200 px-3 py-1.5 bg-white text-gray-700"
          >
            <option value="all">All Regional Agro-Hubs</option>
            {state.warehouses.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Stock Table */}
      <div className="bg-white rounded-2xl border border-[#176B45]/15 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F0] border-b border-gray-200 text-[#66736A] uppercase font-bold text-[10px]">
              <tr>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Batch ID & Origin</th>
                <th className="px-4 py-3">Agro-Hub</th>
                <th className="px-4 py-3">QC Grade</th>
                <th className="px-4 py-3">Available Stock</th>
                <th className="px-4 py-3">Reserved for POs</th>
                <th className="px-4 py-3">Unit Valuation</th>
                <th className="px-4 py-3">Freshness / Expiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-4 py-3 font-bold text-[#17231C]">
                    {item.productName}
                    <div className="text-[10px] text-gray-500 font-normal">{item.category}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono font-semibold text-[#176B45] text-xs">{item.batchId}</span>
                    <div className="text-[11px] text-gray-600">{item.farmerName}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.warehouseName.replace('Pure Krishi ', '')}</td>
                  <td className="px-4 py-3">
                    <Badge variant="green">{item.grade}</Badge>
                  </td>
                  <td className="px-4 py-3 font-extrabold text-[#104D35] text-sm">
                    {item.availableQuantityKg.toLocaleString()} kg
                  </td>
                  <td className="px-4 py-3 font-semibold text-amber-700">
                    {item.reservedQuantityKg.toLocaleString()} kg
                  </td>
                  <td className="px-4 py-3 font-mono font-medium text-gray-800">
                    ₹{item.unitPrice.toFixed(2)} / kg
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">
                    {item.expiryDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
