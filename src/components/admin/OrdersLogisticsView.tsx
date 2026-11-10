import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Truck, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  FileText, 
  UserCheck,
  ChevronRight,
  PackageCheck,
  Lock,
  Unlock
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import { B2BOrder, OrderStatus } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const OrdersLogisticsView: React.FC = () => {
  const { state, store } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<B2BOrder | null>(null);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [lockBuyerId, setLockBuyerId] = useState(state.buyers[0]?.id || '');
  const [lockProductId, setLockProductId] = useState(state.products[0]?.id || '');
  const [lockQty, setLockQty] = useState(1200);


  const orderStatuses: OrderStatus[] = [
    'Requested',
    'Quoted',
    'Confirmed',
    'Processing',
    'Packed',
    'Dispatched',
    'Delivered',
    'Completed',
    'Cancelled'
  ];

  const filteredOrders = state.b2bOrders.filter((o) => {
    const matchesSearch = 
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.buyerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    store.updateB2BOrderStatus(orderId, status);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-display text-[#17231C]">
              B2B Purchase Orders & Logistics Dispatch
            </h1>
            <span className="bg-[#FAF8F0] text-[#176B45] text-xs font-bold px-2 py-0.5 rounded-full border border-[#176B45]/15">
              Supermarket Deliveries
            </span>
          </div>
          <p className="text-xs text-[#66736A] mt-1">
            Manage purchase order fulfillment, cold chain dispatch, delivery partner routes, and supermarket proof of delivery.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsLockModalOpen(true)}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-stone-900 text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 transition-all"
          >
            <Lock className="w-3.5 h-3.5 text-stone-900" />
            <span>Order & Lock for Supermarket</span>
          </button>
        </div>
      </div>

      {/* B2B Customer Lock Active Monitor */}
      <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-900 flex items-center justify-center font-bold shrink-0">
              <Lock className="w-4 h-4 text-stone-900" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                B2B Exclusive Batches (Locked for Retail Customers)
              </h3>
              <p className="text-[11px] text-amber-800">
                Produce exclusively allocated to wholesale supermarket buyers and hidden from retail customer purchasing.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full">
            {state.products.filter(p => p.isLockedForCustomers).length} Locked
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {state.products.filter(p => p.isLockedForCustomers).map(p => (
            <div key={p.id} className="p-3 bg-white rounded-xl border border-amber-200 text-xs space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-[#17231C]">{p.name}</h4>
                  <span className="text-[10px] text-gray-500 font-mono block">Batch: {p.harvestBatchId}</span>
                </div>
                <Badge variant="amber">Locked for Retail</Badge>
              </div>
              <div className="text-[11px] text-gray-600 bg-amber-50/60 p-2 rounded-lg">
                <div>Contracted Buyer: <strong className="text-stone-900">{p.lockedByBuyerName || 'Supermarket Wholesale'}</strong></div>
                <div>Volume Reserved: <strong>{p.lockedQuantityKg || 1200} kg</strong></div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => store.unlockProductForCustomers(p.id)}
                  className="px-2.5 py-1 text-[11px] font-bold text-stone-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-gray-200 transition-colors"
                >
                  Unlock for Retail
                </button>
              </div>
            </div>
          ))}
          {state.products.filter(p => p.isLockedForCustomers).length === 0 && (
            <div className="col-span-3 text-center py-3 text-xs text-amber-800">
              No produce batches currently locked for B2B. All produce is available to retail customers.
            </div>
          )}
        </div>
      </div>


      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#176B45]/15 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search PO number, buyer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#176B45]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs rounded-xl border border-gray-200 px-3 py-1.5 bg-white text-gray-700"
          >
            <option value="all">All Order Statuses</option>
            {orderStatuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const isDelivered = order.status === 'Delivered' || order.status === 'Completed';
          return (
            <div 
              key={order.id}
              className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-[#176B45]">{order.id}</span>
                    <h3 className="text-base font-bold text-[#17231C]">{order.buyerName}</h3>
                    <Badge variant={isDelivered ? 'green' : order.status === 'Dispatched' ? 'blue' : 'amber'}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#66736A] mt-0.5 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>Drop-off: {order.deliveryAddress}</span>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-base font-extrabold text-[#104D35]">
                    ₹{order.totalAmount.toLocaleString()}
                  </div>
                  <span className={`text-[11px] font-semibold ${order.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                    Payment: {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Items in PO */}
              <div className="bg-[#FAF8F0] rounded-xl p-3 border border-[#176B45]/10 space-y-2">
                <span className="text-[11px] font-bold text-[#104D35] uppercase tracking-wider block">
                  Consolidated Line Items ({order.items.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded-lg border border-gray-200 flex items-center justify-between">
                      <div>
                        <strong className="text-gray-800">{item.productName}</strong>
                        <p className="text-[10px] text-gray-500 font-mono">Trace Batch: {item.batchId}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#17231C]">{item.quantityKg} kg</span>
                        <p className="text-[10px] text-gray-500">₹{item.totalPrice.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logistics & Status Workflow bar */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2 text-[#66736A]">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  <span>
                    Fleet Carrier: <strong className="text-gray-800">{order.deliveryPartnerName || 'Fleet Assigned'}</strong>
                  </span>
                  {order.dispatchTimestamp && (
                    <span className="text-gray-400">| Dispatched: {new Date(order.dispatchTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 font-semibold">Update Status:</span>
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                    className="text-xs bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1 font-bold text-[#176B45] focus:outline-none"
                  >
                    {orderStatuses.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Super Admin B2B Order & Produce Lock Modal */}
      {isLockModalOpen && (
        <Modal
          isOpen={isLockModalOpen}
          onClose={() => setIsLockModalOpen(false)}
          title="Direct B2B Order & Customer Lock Console"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const buyer = state.buyers.find(b => b.id === lockBuyerId) || state.buyers[0];
              const product = state.products.find(p => p.id === lockProductId) || state.products[0];
              if (buyer && product) {
                store.lockProductForB2B(
                  product.id,
                  buyer.businessName,
                  buyer.id,
                  lockQty,
                  `Admin Direct Wholesale Order for ${buyer.businessName} (${lockQty} kg)`
                );
                setIsLockModalOpen(false);
              }
            }}
            className="space-y-4 text-xs"
          >
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-1 text-amber-950">
              <div className="flex items-center space-x-1.5 font-bold">
                <Lock className="w-4 h-4 text-amber-700" />
                <span>Super Admin Wholesale Produce Lock</span>
              </div>
              <p className="text-xs text-amber-800">
                Executing this B2B order will reserve the specified harvest volume and <strong>lock the product from all retail customers</strong> in the consumer marketplace.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Select Supermarket Buyer:</label>
                <select
                  value={lockBuyerId}
                  onChange={(e) => setLockBuyerId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-semibold"
                >
                  {state.buyers.map(b => (
                    <option key={b.id} value={b.id}>{b.businessName} ({b.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Select Harvest Produce:</label>
                <select
                  value={lockProductId}
                  onChange={(e) => setLockProductId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-semibold"
                >
                  {state.products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.isLockedForCustomers ? '(Currently Locked)' : '(Available)'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-gray-700 block mb-1">Volume to Lock & Order (kg):</label>
                <input
                  type="number"
                  required
                  min={100}
                  step={50}
                  value={lockQty}
                  onChange={(e) => setLockQty(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsLockModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#104D35] hover:bg-[#176B45] text-white rounded-xl font-bold shadow-sm flex items-center space-x-1.5"
              >
                <Lock className="w-4 h-4 text-amber-300" />
                <span>Execute Order & Lock Produce</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};

