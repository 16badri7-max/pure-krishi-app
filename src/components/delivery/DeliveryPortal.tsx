import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Upload, 
  ShieldCheck, 
  Camera,
  Building2,
  Navigation,
  AlertTriangle,
  FileText,
  Bell,
  User,
  ArrowRight,
  Compass,
  Thermometer,
  RotateCcw,
  Package,
  Layers
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import { B2BOrder, OrderStatus } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { MetricCard } from '../common/MetricCard';

export type DeliverySection = 
  | 'dashboard'
  | 'assigned_orders'
  | 'pickup_details'
  | 'delivery_details'
  | 'route_info'
  | 'history'
  | 'notifications'
  | 'profile';

export const DeliveryPortal: React.FC = () => {
  const { state, store } = useStore();
  const [activeSection, setActiveSection] = useState<DeliverySection>('dashboard');
  
  // Modals state
  const [selectedOrderForPOD, setSelectedOrderForPOD] = useState<B2BOrder | null>(null);
  const [receiverName, setReceiverName] = useState('Suresh Kadam (Store Receiving Mgr)');
  const [receiverNotes, setReceiverNotes] = useState('All 50 crates inspected. Temperature logged at +11.4°C. Zero physical bruising. Sign-off recorded.');
  const [podPhotoUrl, setPodPhotoUrl] = useState('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80');

  const [issueModalOrder, setIssueModalOrder] = useState<B2BOrder | null>(null);
  const [issueType, setIssueType] = useState('Highway Traffic Delay (>45 mins)');
  const [issueNotes, setIssueNotes] = useState('');

  // Active delivery orders
  const assignedOrders = state.b2bOrders.filter(o => 
    o.status === 'Packed' || o.status === 'Dispatched' || o.status === 'Delivered'
  );

  const pendingPickups = assignedOrders.filter(o => o.status === 'Packed' || !o.pickupStatus || o.pickupStatus === 'Pending');
  const inProgressDeliveries = assignedOrders.filter(o => o.status === 'Dispatched');
  const completedDeliveries = assignedOrders.filter(o => o.status === 'Delivered');

  const deliveryNotifications = state.notifications.filter(
    n => n.recipientRole === 'delivery_partner' || n.recipientRole === 'all'
  );

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Truck },
    { id: 'assigned_orders', label: 'Assigned Orders', icon: Package, badge: assignedOrders.length },
    { id: 'pickup_details', label: 'Pickup Details', icon: Building2, badge: pendingPickups.length },
    { id: 'delivery_details', label: 'Delivery Details', icon: MapPin },
    { id: 'route_info', label: 'Route Information', icon: Compass },
    { id: 'history', label: 'Delivery History', icon: Clock, badge: completedDeliveries.length },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: deliveryNotifications.filter(n => !n.isRead).length },
    { id: 'profile', label: 'Driver Profile', icon: User },
  ];

  const handleConfirmPOD = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForPOD) return;

    store.submitProofOfDelivery(selectedOrderForPOD.id, receiverName, receiverNotes, podPhotoUrl);
    setSelectedOrderForPOD(null);
  };

  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueModalOrder) return;

    store.reportDeliveryIssue(issueModalOrder.id, issueType, issueNotes);
    setIssueModalOrder(null);
    setIssueNotes('');
  };

  const handlePickupOrder = (orderId: string) => {
    store.updatePickupStatus(orderId, 'Picked Up');
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      
      {/* Delivery Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white rounded-2xl p-4 border border-[#176B45]/15 shadow-sm space-y-4 shrink-0 h-fit">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-xs text-[#104D35] uppercase tracking-wider font-display">
              ColdChain Logistics
            </span>
            <span className="bg-[#F0F7F0] text-[#176B45] text-[10px] font-bold px-1.5 py-0.2 rounded border border-[#DCECDC]">
              GPS Active
            </span>
          </div>
          <p className="text-[11px] text-[#66736A] mt-0.5">
            Fleet: MH-04-AZ-9981 (Reefer)
          </p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as DeliverySection)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#104D35] text-white shadow-sm'
                    : 'text-[#66736A] hover:bg-[#F0F7F0] hover:text-[#17231C]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-[#176B45]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-amber-400 text-stone-900' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Live Temperature Monitor Status */}
        <div className="p-3 bg-[#FAF8F0] rounded-xl border border-[#176B45]/15 space-y-1 text-xs">
          <div className="flex items-center space-x-1.5 text-blue-700 font-bold">
            <Thermometer className="w-3.5 h-3.5" />
            <span>Reefer Cargo Temp: +10.2°C</span>
          </div>
          <span className="text-[10px] text-gray-500 block">Within optimal supermarket freshness corridor.</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 space-y-6">
        
        {/* Top Delivery Header Banner */}
        <div className="bg-white rounded-3xl p-6 border border-[#176B45]/15 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-14 h-14 rounded-2xl bg-[#F0F7F0] text-[#176B45] flex items-center justify-center font-bold text-xl border border-[#DCECDC] shrink-0">
                <Truck className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-bold font-display text-[#17231C]">
                    Logistics & Fleet Partner Console
                  </h1>
                  <Badge variant="blue">Reefer Active</Badge>
                </div>
                <p className="text-xs text-[#66736A] mt-0.5">
                  Driver: <strong>{state.currentUser.name}</strong> • Vehicle: <strong>MH-04-AZ-9981</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs font-semibold bg-[#F0F7F0] text-[#104D35] px-4 py-2.5 rounded-2xl border border-[#DCECDC]">
              <Navigation className="w-4 h-4 text-[#176B45]" />
              <span>Assigned Corridor: Mumbai MMR & Navi Mumbai Supermarket Route</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: DASHBOARD */}
        {activeSection === 'dashboard' && (
          <div className="space-y-6">
            {/* 4 Dashboard Metrics requested in Prompt 2 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-[#176B45]/15 shadow-sm text-center">
                <span className="text-xs text-[#66736A] block">Assigned Deliveries</span>
                <span className="text-2xl font-extrabold text-[#104D35] mt-1 block">{assignedOrders.length}</span>
                <span className="text-[10px] text-gray-400">Total Route Drops</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-[#176B45]/15 shadow-sm text-center">
                <span className="text-xs text-[#66736A] block">Pending Pickups</span>
                <span className="text-2xl font-extrabold text-amber-700 mt-1 block">{pendingPickups.length}</span>
                <span className="text-[10px] text-amber-600 font-bold">At Warehouse Dock</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-[#176B45]/15 shadow-sm text-center">
                <span className="text-xs text-[#66736A] block">Deliveries in Progress</span>
                <span className="text-2xl font-extrabold text-blue-600 mt-1 block">{inProgressDeliveries.length}</span>
                <span className="text-[10px] text-blue-500 font-bold">On the Highway</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-[#176B45]/15 shadow-sm text-center">
                <span className="text-xs text-[#66736A] block">Completed Deliveries</span>
                <span className="text-2xl font-extrabold text-[#176B45] mt-1 block">{completedDeliveries.length}</span>
                <span className="text-[10px] text-gray-400">POD Signed</span>
              </div>
            </div>

            {/* Quick Active Deliveries View */}
            <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <h3 className="text-sm font-bold text-[#17231C]">Today's Scheduled Deliveries</h3>
                <button onClick={() => setActiveSection('assigned_orders')} className="text-xs font-bold text-[#176B45] hover:underline">
                  View All ({assignedOrders.length})
                </button>
              </div>

              <div className="space-y-3">
                {assignedOrders.map((order) => {
                  const isDelivered = order.status === 'Delivered';
                  return (
                    <div key={order.id} className="p-4 rounded-xl border border-gray-200 bg-[#FAF8F0] space-y-3 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-[#176B45]">{order.id}</span>
                            <span className="text-gray-400">•</span>
                            <h4 className="font-bold text-sm text-[#17231C]">{order.buyerName}</h4>
                            <Badge variant={isDelivered ? 'green' : 'blue'}>{order.status}</Badge>
                          </div>
                          <p className="text-gray-600 mt-1 flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{order.deliveryAddress}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-sm text-[#104D35] block">
                            ₹{order.totalAmount.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-gray-500">{order.deliveryDate}</span>
                        </div>
                      </div>

                      {order.deliveryIssueReported && (
                        <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs">
                          <strong>Reported Issue:</strong> {order.deliveryIssueReported.type} — {order.deliveryIssueReported.notes}
                        </div>
                      )}

                      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-200">
                        <button
                          onClick={() => setIssueModalOrder(order)}
                          className="px-3 py-1.5 text-xs text-red-700 hover:bg-red-50 rounded-lg border border-red-200 font-semibold"
                        >
                          Report Issue
                        </button>
                        {!isDelivered ? (
                          <button
                            onClick={() => setSelectedOrderForPOD(order)}
                            className="px-4 py-1.5 bg-[#104D35] hover:bg-[#176B45] text-white rounded-lg font-bold"
                          >
                            Record Proof of Delivery (POD)
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-[#104D35] flex items-center space-x-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Signed by {order.receiverName}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: ASSIGNED ORDERS */}
        {activeSection === 'assigned_orders' && (
          <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#17231C] font-display">Assigned Supermarket Deliveries</h2>
              <p className="text-xs text-[#66736A]">All wholesale orders routed to Fleet Unit MH-04-AZ-9981.</p>
            </div>

            <div className="space-y-4">
              {assignedOrders.map((order) => (
                <div key={order.id} className="p-4 rounded-xl border border-gray-200 space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono font-bold text-[#176B45]">{order.id}</span>
                      <h4 className="font-bold text-sm text-[#17231C] mt-0.5">{order.buyerName}</h4>
                      <p className="text-gray-500">Destination: {order.deliveryAddress}</p>
                    </div>
                    <Badge variant={order.status === 'Delivered' ? 'green' : 'blue'}>{order.status}</Badge>
                  </div>

                  <div className="bg-[#FAF8F0] p-3 rounded-xl border border-[#176B45]/10 space-y-1">
                    <span className="font-bold text-[#104D35] block">Order Manifest:</span>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-gray-700">
                        <span>{item.productName}</span>
                        <strong>{item.quantityKg} kg (Batch: {item.batchId})</strong>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => setIssueModalOrder(order)}
                      className="px-3 py-1.5 text-xs text-red-700 hover:bg-red-50 rounded-lg border border-red-200 font-semibold"
                    >
                      Report Problem
                    </button>
                    {order.status !== 'Delivered' && (
                      <button
                        onClick={() => setSelectedOrderForPOD(order)}
                        className="px-4 py-1.5 bg-[#104D35] hover:bg-[#176B45] text-white rounded-lg font-bold"
                      >
                        Record POD & Sign-Off
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: PICKUP DETAILS */}
        {activeSection === 'pickup_details' && (
          <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#17231C] font-display">Warehouse Loading & Pickup Dock</h2>
              <p className="text-xs text-[#66736A]">Central hub address, bay numbers, and pallet handoff verification.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F0] border border-[#176B45]/15 space-y-3 text-xs">
              <div className="flex items-center space-x-2 text-[#104D35] font-bold text-sm">
                <Building2 className="w-5 h-5 text-[#176B45]" />
                <span>Pure Krishi Bhiwandi Central Agro-Hub</span>
              </div>
              <p className="text-gray-700">
                Building B3, Logistics Park, Mankoli, Bhiwandi, Maharashtra 421302
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#176B45]/10">
                <div>Dock Bay Assigned: <strong>Bay #4 (Cold Chain Staging)</strong></div>
                <div>Warehouse Manager: <strong>Anil Deshmukh (+91 97654 32109)</strong></div>
                <div>Required Vehicle Temp: <strong>Below +12°C prior to loading</strong></div>
                <div>Status: <strong>Pallets Pre-Cooled and Scanned</strong></div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => alert('Vehicle pre-cooling verified. Pallets authorized for loading.')}
                  className="px-4 py-2 bg-[#104D35] text-white rounded-xl font-bold hover:bg-[#176B45]"
                >
                  Confirm Arrival at Dock Bay #4
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: DELIVERY DETAILS */}
        {activeSection === 'delivery_details' && (
          <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#17231C] font-display">Delivery Gate & Supermarket Receiving Bays</h2>
              <p className="text-xs text-[#66736A]">Customer privacy protection: B2B destinations with contact receiving managers.</p>
            </div>

            <div className="space-y-3">
              {assignedOrders.map((order) => (
                <div key={order.id} className="p-4 rounded-xl border border-gray-200 bg-white space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm text-[#17231C]">{order.buyerName}</h4>
                    <span className="font-mono text-[#176B45] font-bold">{order.id}</span>
                  </div>
                  <p className="text-gray-600 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{order.deliveryAddress}</span>
                  </p>
                  <div className="bg-gray-50 p-2.5 rounded-lg text-gray-700">
                    Receiving Window: <strong>06:00 AM - 11:30 AM</strong> • Unloading Dock: <strong>Basement Ramp 2</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: ROUTE INFORMATION */}
        {activeSection === 'route_info' && (
          <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#17231C] font-display">Turn-by-Turn Reefer Route Map</h2>
              <p className="text-xs text-[#66736A]">Optimized multi-drop transit path minimizing temperature fluctuation.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F0] border border-[#176B45]/15 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#104D35]">Active Route: MMR Expressway Loop (48 km total)</span>
                <Badge variant="blue">ETA: 42 mins next stop</Badge>
              </div>

              <div className="space-y-3 pl-4 border-l-2 border-[#176B45]">
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-gray-500">STOP 1 (ORIGIN):</span>
                  <p className="font-bold text-stone-900">Bhiwandi Central Hub (Loading completed at 05:30 AM)</p>
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-[#176B45]">STOP 2 (EN ROUTE):</span>
                  <p className="font-bold text-stone-900">Nature's Basket Gourmet Supermarkets, Mumbai (PO-2025-881)</p>
                  <p className="text-gray-500">Unload: 1,500 kg Heirloom Tomatoes, 1,200 kg Onions</p>
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-gray-500">STOP 3:</span>
                  <p className="font-bold text-stone-900">Reliance Fresh Agro Logistics Hub, Ghansoli, Navi Mumbai (PO-2025-882)</p>
                  <p className="text-gray-500">Unload: 600 kg Baby Spinach</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6: DELIVERY HISTORY */}
        {activeSection === 'history' && (
          <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#17231C] font-display">Completed Delivery Archives & POD Receipts</h2>
              <p className="text-xs text-[#66736A]">Signed verification records with timestamps and receiver comments.</p>
            </div>

            <div className="space-y-3">
              {completedDeliveries.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs">
                  No completed deliveries recorded yet today.
                </div>
              ) : (
                completedDeliveries.map((order) => (
                  <div key={order.id} className="p-4 rounded-xl border border-gray-200 bg-white space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono font-bold text-[#176B45]">{order.id}</span>
                        <h4 className="font-bold text-sm text-[#17231C]">{order.buyerName}</h4>
                      </div>
                      <Badge variant="green">Delivered</Badge>
                    </div>

                    <div className="text-xs bg-[#F0F7F0] p-3 rounded-xl border border-[#DCECDC] space-y-1 text-[#104D35]">
                      <div>Receiver: <strong>{order.receiverName || 'Store Manager'}</strong></div>
                      <div>Delivered At: <strong>{new Date(order.deliveryTimestamp || order.deliveryDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></div>
                      <div>Notes: <em>{order.proofOfDeliveryNotes || 'Full consignment accepted without remarks.'}</em></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SECTION 7: NOTIFICATIONS */}
        {activeSection === 'notifications' && (
          <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-[#17231C] font-display">Dispatch & Dispatcher Alerts</h2>
                <p className="text-xs text-[#66736A]">Real-time dock and traffic notifications.</p>
              </div>
              <button
                onClick={() => store.markAllNotificationsAsRead('delivery_partner')}
                className="text-xs font-bold text-[#176B45] hover:underline"
              >
                Mark all as read
              </button>
            </div>

            <div className="space-y-2">
              {deliveryNotifications.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs">
                  No notifications for the driver team.
                </div>
              ) : (
                deliveryNotifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                      n.isRead ? 'bg-gray-50/50 border-gray-100' : 'bg-emerald-50/30 border-emerald-200'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-[#17231C] block">{n.title}</span>
                      <p className="text-gray-600 mt-0.5">{n.message}</p>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {!n.isRead && (
                      <button
                        onClick={() => store.markNotificationAsRead(n.id)}
                        className="text-[11px] text-[#176B45] font-semibold hover:underline shrink-0"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SECTION 8: PROFILE */}
        {activeSection === 'profile' && (
          <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#17231C] font-display">Driver & Reefer Fleet Profile</h2>
              <p className="text-xs text-[#66736A]">License details, temperature calibration certificate, and safety score.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F0] border border-[#176B45]/15 space-y-3 text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 rounded-2xl bg-[#104D35] text-white flex items-center justify-center font-bold text-xl">
                  VS
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#17231C]">Vikram Singh</h3>
                  <p className="text-gray-500">Commercial Cold Chain Pilot • Fleet Partner</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="green">Safety Rating: 4.95 ★</Badge>
                    <Badge variant="blue">Reefer Certified</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#176B45]/10">
                <div>Vehicle Registration: <strong>MH-04-AZ-9981</strong></div>
                <div>Chamber Capacity: <strong>6.5 Tonnes (Cold Reefer)</strong></div>
                <div>License: <strong>DL-MH04-2016-887192</strong></div>
                <div>Insurance / Fitness: <strong>Valid thru Dec 2026</strong></div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: RECORD PROOF OF DELIVERY (POD) */}
      <Modal
        isOpen={!!selectedOrderForPOD}
        onClose={() => setSelectedOrderForPOD(null)}
        title={`Confirm Proof of Delivery (POD) - ${selectedOrderForPOD?.id}`}
      >
        {selectedOrderForPOD && (
          <form onSubmit={handleConfirmPOD} className="space-y-4 text-xs">
            <div className="bg-[#FAF8F0] p-3 rounded-xl border border-[#176B45]/15 space-y-1">
              <span className="font-bold text-[#104D35]">{selectedOrderForPOD.buyerName}</span>
              <p className="text-gray-600">{selectedOrderForPOD.deliveryAddress}</p>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Receiver Name & Designation:</label>
              <input
                type="text"
                required
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Temperature Log & Quality Remarks:</label>
              <textarea
                rows={3}
                required
                value={receiverNotes}
                onChange={(e) => setReceiverNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrderForPOD(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#104D35] hover:bg-[#176B45] text-white rounded-xl font-bold shadow-sm"
              >
                Sign & Finalize POD
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* MODAL 2: REPORT DELIVERY ISSUE */}
      <Modal
        isOpen={!!issueModalOrder}
        onClose={() => setIssueModalOrder(null)}
        title={`Report Delivery Exception - ${issueModalOrder?.id}`}
      >
        {issueModalOrder && (
          <form onSubmit={handleReportIssue} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Issue Category:</label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
              >
                <option value="Highway Traffic Delay (>45 mins)">Highway Traffic Delay (&gt;45 mins)</option>
                <option value="Supermarket Unloading Bay Busy">Supermarket Unloading Bay Busy</option>
                <option value="Temperature Chamber Spike Warning">Temperature Chamber Spike Warning</option>
                <option value="Store Receiving Manager Unavailable">Store Receiving Manager Unavailable</option>
                <option value="Damaged Produce Packaging Observed">Damaged Produce Packaging Observed</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Driver Field Remarks:</label>
              <textarea
                rows={4}
                required
                value={issueNotes}
                onChange={(e) => setIssueNotes(e.target.value)}
                placeholder="Describe current location and reason for delay..."
                className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIssueModalOrder(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
              >
                Broadcast Alert to Operations
              </button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};
