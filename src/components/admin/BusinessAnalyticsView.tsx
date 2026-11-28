import React from 'react';
import {
  Users,
  Tractor,
  Package,
  ShoppingCart,
  TrendingUp,
  Clock,
  CheckCircle2,
  Warehouse,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import { MetricCard } from '../common/MetricCard';

export const BusinessAnalyticsView: React.FC = () => {
  const { state } = useStore();

  const totalCustomers = state.customerAccounts.length;
  const totalFarmers = state.farmers.length;
  const totalProducts = state.products.length;
  const publishedProducts = state.products.filter(p => p.isPublished !== false && p.isActive !== false).length;

  const totalCustomerOrders = state.customerOrders.length;
  const totalB2BOrders = state.b2bOrders.length;
  const totalOrders = totalCustomerOrders + totalB2BOrders;

  const pendingCustomerOrders = state.customerOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const pendingB2BOrders = state.b2bOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Completed' && o.status !== 'Cancelled').length;
  const pendingOrders = pendingCustomerOrders + pendingB2BOrders;

  const completedOrders =
    state.customerOrders.filter(o => o.status === 'Delivered').length +
    state.b2bOrders.filter(o => o.status === 'Delivered' || o.status === 'Completed').length;

  const b2cRevenue = state.customerOrders.reduce((s, o) => s + o.totalAmount, 0);
  const b2bRevenue = state.b2bOrders.reduce((s, o) => s + o.totalAmount, 0);
  const totalRevenue = Math.max(state.financials.grossRevenue, b2cRevenue + b2bRevenue);

  const availableWarehouseKg = state.inventory.reduce((s, i) => s + i.availableQuantityKg, 0);
  const availableCatalogueUnits = state.products.reduce((s, p) => s + p.availableQuantity, 0);
  const threshold = state.platformSettings.lowStockThresholdKg || 50;
  const lowStockProducts = state.products.filter(p => p.availableQuantity <= threshold);

  // Category distribution computed directly from live products & stock
  const categoryBreakdown = state.categories.map(cat => {
    const prods = state.products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase());
    const stock = prods.reduce((s, p) => s + p.availableQuantity, 0);
    const catalogValue = prods.reduce((s, p) => s + p.price * p.availableQuantity, 0);
    return {
      name: cat.name,
      icon: cat.icon,
      count: prods.length,
      stock,
      catalogValue,
    };
  });
  const maxCategoryValue = Math.max(1, ...categoryBreakdown.map(c => c.catalogValue));

  // Order fulfillment distribution
  const orderStatusCounts = [
    { label: 'Placed / Confirmed', count: state.customerOrders.filter(o => o.status === 'Order Placed' || o.status === 'Confirmed').length + state.b2bOrders.filter(o => o.status === 'Requested' || o.status === 'Confirmed').length, color: 'bg-amber-500' },
    { label: 'Packed / Processing', count: state.customerOrders.filter(o => o.status === 'Packed').length + state.b2bOrders.filter(o => o.status === 'Processing' || o.status === 'Packed').length, color: 'bg-blue-500' },
    { label: 'Dispatched / Out for Delivery', count: state.customerOrders.filter(o => o.status === 'Dispatched' || o.status === 'Out for Delivery').length + state.b2bOrders.filter(o => o.status === 'Dispatched').length, color: 'bg-indigo-500' },
    { label: 'Delivered / Completed', count: completedOrders, color: 'bg-emerald-600' },
  ];
  const maxStatusCount = Math.max(1, ...orderStatusCounts.map(s => s.count));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-[#17231C]">
            Live Business Analytics & Performance
          </h1>
          <p className="text-xs text-[#66736A] mt-1">
            All KPIs and charts below are computed directly from live Supabase / Central Store records across Customer, Farmer, and Warehouse operations.
          </p>
        </div>
      </div>

      {/* Required 9 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard title="Total Customers" value={totalCustomers} subtitle="Registered B2C shoppers" icon={Users} />
        <MetricCard title="Total Farmers" value={totalFarmers} subtitle={`${state.farms.length} registered farms`} icon={Tractor} />
        <MetricCard title="Total Products" value={totalProducts} subtitle={`${publishedProducts} live in Customer App`} icon={Package} />
        <MetricCard title="Total Orders" value={totalOrders} subtitle={`${totalCustomerOrders} B2C • ${totalB2BOrders} B2B`} icon={ShoppingCart} />
        <MetricCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} subtitle="Consolidated B2C + B2B" icon={TrendingUp} isPositive={true} change={`${state.financials.grossMarginPercentage}% Margin`} />
        <MetricCard title="Pending Orders" value={pendingOrders} subtitle="Awaiting fulfilment/delivery" icon={Clock} />
        <MetricCard title="Completed Orders" value={completedOrders} subtitle="Delivered & settled" icon={CheckCircle2} />
        <MetricCard title="Available Inventory" value={`${availableWarehouseKg.toLocaleString()} kg`} subtitle={`${availableCatalogueUnits.toLocaleString()} retail SKU units`} icon={Warehouse} />
        <MetricCard title="Low-Stock Alerts" value={lowStockProducts.length} subtitle={`SKUs at or below ${threshold} units`} icon={AlertTriangle} />
      </div>

      {/* Business Performance Charts (Live Data Driven) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Inventory Value Bar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#17231C] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#176B45]" /> Category Catalogue Valuation
              </h3>
              <p className="text-[11px] text-[#66736A]">Live stock × price value across approved categories</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {categoryBreakdown.map(cat => {
              const pct = Math.round((cat.catalogValue / maxCategoryValue) * 100);
              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[#17231C]">
                      {cat.icon} {cat.name} ({cat.count} SKUs)
                    </span>
                    <span className="font-bold text-[#104D35]">₹{cat.catalogValue.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#176B45] to-[#5BA66B] rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(4, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Fulfillment Pipeline Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-[#176B45]/15 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-sm text-[#17231C]">Order Fulfillment Pipeline</h3>
            <p className="text-[11px] text-[#66736A]">Real-time distribution across B2C & B2B orders</p>
          </div>

          <div className="space-y-4 pt-2">
            {orderStatusCounts.map(st => {
              const pct = Math.round((st.count / maxStatusCount) * 100);
              return (
                <div key={st.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-700">{st.label}</span>
                    <span className="font-bold text-[#17231C]">{st.count} orders</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${st.color} rounded-full transition-all duration-500`} style={{ width: `${Math.max(5, pct)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Low Stock Watchlist */}
          <div className="pt-3 border-t border-gray-100">
            <h4 className="text-xs font-bold text-rose-700 mb-2">Low-Stock Products Requiring Restock ({lowStockProducts.length})</h4>
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-emerald-700 bg-emerald-50 p-3 rounded-xl">All catalogue products are adequately stocked.</p>
            ) : (
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {lowStockProducts.map(p => (
                  <div key={p.id} className="flex justify-between items-center text-xs bg-rose-50/70 px-3 py-1.5 rounded-lg border border-rose-100">
                    <span className="font-semibold text-[#17231C]">{p.name}</span>
                    <span className="font-bold text-rose-700">{p.availableQuantity} left</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
