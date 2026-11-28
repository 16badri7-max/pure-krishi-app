import React, { useState, lazy, Suspense } from 'react';
import { 
  ShoppingBag, 
  Search, 
  ShieldCheck, 
  Plus, 
  Minus, 
  CheckCircle2, 
  MapPin, 
  ArrowRight, 
  ExternalLink, 
  Truck, 
  Heart, 
  UserCheck, 
  HelpCircle, 
  Package, 
  Building2,
  Utensils,
  Hotel,
  ChefHat,
  Store,
  Users,
  User,
  PhoneCall,
  FileText,
  Lock
} from 'lucide-react';

// Lazy-load 3D sections (heavy — won't block initial render)
const Hero3DSection = lazy(() => import('./Hero3DSection'));
const MidSection3D = lazy(() => import('./MidSection3D'));
import { useStore } from '../../services/useStore';
import { centralApi } from '../../lib/centralApi';
import { ProductListing, CustomerOrder } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { ProfileEditorModal } from '../common/ProfileEditorModal';

export type CustomerNav = 
  | 'shop'
  | 'farmers'
  | 'orders'
  | 'track_order'
  | 'wishlist'
  | 'addresses'
  | 'profile'
  | 'support';

// Bulk buyer types
const bulkBuyerTypes = [
  { id: 'hotel', label: 'Hotels & Resorts', icon: Hotel, desc: 'Minimum 50 kg per order', color: 'bg-blue-50 border-blue-200 text-blue-800' },
  { id: 'restaurant', label: 'Restaurants & Cafes', icon: Utensils, desc: 'Minimum 20 kg per order', color: 'bg-orange-50 border-orange-200 text-orange-800' },
  { id: 'catering', label: 'Catering Services', icon: ChefHat, desc: 'Minimum 100 kg per order', color: 'bg-purple-50 border-purple-200 text-purple-800' },
  { id: 'retail', label: 'Retail / Kirana Stores', icon: Store, desc: 'Minimum 25 kg per order', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  { id: 'institution', label: 'Schools & Institutions', icon: Building2, desc: 'Minimum 75 kg per order', color: 'bg-rose-50 border-rose-200 text-rose-800' },
  { id: 'corporate', label: 'Corporate Canteens', icon: Users, desc: 'Minimum 30 kg per order', color: 'bg-amber-50 border-amber-200 text-amber-800' },
];

export const CustomerMarketplace: React.FC = () => {
  const { state, store } = useStore();
  const [activeNav, setActiveNav] = useState<CustomerNav>('shop');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [traceProduct, setTraceProduct] = useState<ProductListing | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<CustomerOrder | null>(null);
  const myCustomerOrders = state.customerOrders.filter(
    o => o.customerId === state.currentUser.id || state.currentUser.role === 'super_admin' || state.currentUser.role === 'operations_admin'
  );
  const [trackingOrder, setTrackingOrder] = useState<CustomerOrder | null>(myCustomerOrders[0] || null);

  // Customer type: individual or bulk
  const [customerType, setCustomerType] = useState<'individual' | 'bulk'>('individual');
  const [selectedBulkType, setSelectedBulkType] = useState<string | null>(null);
  const [bulkQty, setBulkQty] = useState<Record<string, number>>({});
  const [bulkQuoteSubmitted, setBulkQuoteSubmitted] = useState(false);
  const [bulkContactName, setBulkContactName] = useState('');
  const [bulkContactPhone, setBulkContactPhone] = useState('');
  const [bulkBusinessName, setBulkBusinessName] = useState('');

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>(['prd-01', 'prd-04']);

  // Checkout Form
  const [shippingAddress, setShippingAddress] = useState(
    state.savedAddresses[0]?.fullAddress || 'Flat 402, Sea Green Apts, Perry Cross Road, Bandra West, Mumbai 400050'
  );
  const [customerPhone, setCustomerPhone] = useState('+91 98200 44556');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod' | 'card'>('upi');
  const [deliverySlot, setDeliverySlot] = useState('Tomorrow Morning (07:00 AM - 10:00 AM)');

  const activeCategoryNames = state.categories.filter(c => c.isActive).map(c => c.name);
  const categories = ['all', ...(activeCategoryNames.length > 0 ? activeCategoryNames : ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Dry fruits', 'Spices'])];

  // Customers only see Admin-approved, published, active products
  const approvedProducts = state.products.filter(
    p => p.isActive !== false && p.isPublished !== false && (p.approvalStatus ?? 'approved') === 'approved'
  );

  const filteredProducts = approvedProducts.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.farmerLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    // Individual customers: hide B2B locked. Bulk buyers: show all
    const matchesLock = customerType === 'bulk' || !p.isLockedForCustomers;
    return matchesSearch && matchesCat && matchesLock;
  });

  const cartItemCount = state.cart.reduce((s, i) => s + i.quantity, 0);
  const cartSubtotal = state.cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const effectiveDeliveryFee = cartSubtotal >= state.platformSettings.freeDeliveryAbove ? 0 : state.platformSettings.deliveryFee;

  const toggleWishlist = (id: string) => {
    if (wishlistIds.includes(id)) {
      setWishlistIds(wishlistIds.filter(i => i !== id));
    } else {
      setWishlistIds([...wishlistIds, id]);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.cart.length === 0 || isCheckingOut) return;
    setCheckoutError('');
    setIsCheckingOut(true);

    try {
      const order = await centralApi.placeCustomerOrder({
        shippingAddress,
        customerPhone,
        paymentMethod,
        deliverySlot,
      });
      setOrderSuccess(order);
      setTrackingOrder(order);
      setIsCheckoutOpen(false);
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Unable to place order. Please check stock availability.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Order tracking steps
  const orderSteps = [
    { label: 'Order Placed', desc: 'Received & Confirmed' },
    { label: 'Harvest Matched', desc: 'Farm origin verified' },
    { label: 'Packed', desc: 'Cold storage crate staged' },
    { label: 'Dispatched', desc: 'In climate-controlled fleet' },
    { label: 'Out for Delivery', desc: 'With local delivery partner' },
    { label: 'Delivered', desc: 'At doorstep' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Order Placed': return 0;
      case 'Confirmed': return 1;
      case 'Packed': return 2;
      case 'Dispatched': return 3;
      case 'Out for Delivery': return 4;
      case 'Delivered': return 5;
      default: return 1;
    }
  };

  const navItems = [
    { id: 'shop', label: 'Fresh Marketplace', icon: ShoppingBag },
    { id: 'orders', label: 'My Orders', icon: Package, badge: myCustomerOrders.length },
    { id: 'track_order', label: 'Live Order Tracker', icon: Truck },
    { id: 'farmers', label: 'Meet the Farmers', icon: UserCheck },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, badge: wishlistIds.length },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'support', label: 'Customer Support', icon: HelpCircle },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      
      {/* Customer Navigation Sidebar */}
      <aside className="w-full md:w-60 bg-white rounded-2xl p-4 border border-[#176B45]/15 shadow-sm space-y-4 shrink-0 h-fit">
        <div>
          <span className="font-extrabold text-xs text-[#104D35] uppercase tracking-wider font-display">
            Customer Portal
          </span>
          <h2 className="font-bold text-sm text-[#17231C]">Hello, {state.currentUser.name}</h2>
          <p className="text-[11px] text-[#66736A] mt-0.5">Bandra West, Mumbai</p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id as CustomerNav)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#176B45] text-white shadow-sm'
                    : 'text-[#17231C] hover:bg-[#F0F7F0] hover:text-[#176B45]'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#5BA66B]'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 space-y-6">
        
        {/* Navigation 1: Shop */}
        {activeNav === 'shop' && (
          <div className="space-y-5">

            {/* ── Customer Type Toggle ── */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-[#176B45]/15 shadow-sm w-fit">
              <button
                onClick={() => setCustomerType('individual')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  customerType === 'individual'
                    ? 'bg-[#176B45] text-white shadow-sm'
                    : 'text-[#17231C] hover:bg-[#F0F7F0]'
                }`}
              >
                <User className="w-4 h-4" />
                Individual / Retail
              </button>
              <button
                onClick={() => setCustomerType('bulk')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  customerType === 'bulk'
                    ? 'bg-[#176B45] text-white shadow-sm'
                    : 'text-[#17231C] hover:bg-[#F0F7F0]'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Bulk Buyer
                <span className="bg-amber-400 text-stone-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full">B2B</span>
              </button>
            </div>

            {/* ══ INDIVIDUAL VIEW ══ */}
            {customerType === 'individual' && (
              <>
                {/* 3D Hero Section */}
                <Suspense fallback={
                  <div className="bg-gradient-to-r from-[#176B45] via-[#104D35] to-[#176B45] rounded-3xl p-8 text-white animate-pulse h-40" />
                }>
                  <Hero3DSection
                    onShopNow={() => document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' })}
                    onMeetFarmers={() => setActiveNav('farmers')}
                  />
                </Suspense>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#176B45]/15 shadow-sm">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search organic fruits, veggies..." value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#176B45]" />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                    {categories.map((cat) => (
                      <button key={cat} onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${
                          selectedCategory === cat ? 'bg-[#176B45] text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}>{cat}</button>
                    ))}
                  </div>
                </div>

                {/* 3D Mid-Section — Orbiting Farm Globe */}
                <div className="relative bg-gradient-to-br from-emerald-900/80 via-green-900/60 to-teal-900/70 rounded-3xl overflow-hidden border border-emerald-500/20 shadow-xl">
                  <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="flex-1 p-6 md:p-8 z-10">
                      <h2 className="text-2xl font-black text-white mb-2">Farm-to-Fork<br /><span className="text-emerald-400">Ecosystem</span></h2>
                      <p className="text-emerald-300/70 text-sm mb-4">Every product orbits through verified farmers → organic processing → your doorstep.</p>
                      <div className="flex flex-wrap gap-2">
                        {['🌱 Soil-Tested', '🤖 AI-Graded', '🚜 Farmer-Verified', '📦 Fresh Packed'].map((tag) => (
                          <span key={tag} className="text-xs bg-emerald-500/15 border border-emerald-400/20 text-emerald-300 px-3 py-1 rounded-full font-semibold">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="w-full md:w-80 h-56 md:h-72">
                      <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-5xl animate-spin">🌿</div>}>
                        <MidSection3D />
                      </Suspense>
                    </div>
                  </div>
                </div>

                <div id="product-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredProducts.map((prod) => {
                    const cartItem = state.cart.find(i => i.product.id === prod.id);
                    const isWishlisted = wishlistIds.includes(prod.id);
                    return (
                      <div key={prod.id} className="bg-white rounded-2xl border border-[#176B45]/15 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group relative">
                        <button onClick={() => toggleWishlist(prod.id)}
                          className={`absolute top-2 right-2 z-10 p-1.5 rounded-full backdrop-blur-xs transition-colors ${isWishlisted ? 'bg-rose-50 text-rose-600' : 'bg-white/80 text-gray-400 hover:text-rose-500'}`}>
                          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                        </button>
                        <div className="relative h-44 bg-gray-100 overflow-hidden">
                          <img src={prod.imageUrl} alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute bottom-2 left-2">
                            <span className="bg-black/60 backdrop-blur-xs text-white font-bold text-[9px] px-2 py-0.5 rounded">{prod.verificationBadge}</span>
                          </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-[#66736A]">
                              <span>{prod.category}</span>
                              <span className="font-semibold text-emerald-800">{prod.unit}</span>
                            </div>
                            <h3 className="font-bold text-sm text-[#17231C] leading-snug">{prod.name}</h3>
                            <p className="text-xs text-[#66736A] line-clamp-2">{prod.description}</p>
                          </div>
                          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                            <div>
                              <span className="text-[10px] text-gray-500 block">Grower:</span>
                              <strong className="text-gray-800">{prod.farmerName}</strong>
                            </div>
                            <button onClick={() => setTraceProduct(prod)} className="text-[11px] font-bold text-[#176B45] hover:underline flex items-center space-x-1">
                              <span>Trace Batch</span><ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                            <div>
                              <span className="text-base font-extrabold text-[#104D35]">₹{prod.price}</span>
                              <span className="text-[10px] text-gray-500"> / {prod.unit}</span>
                              <span className={`block text-[10px] font-semibold ${prod.availableQuantity <= 0 ? 'text-rose-600' : prod.availableQuantity <= 25 ? 'text-amber-600' : 'text-emerald-700'}`}>
                                {prod.availableQuantity <= 0 ? 'Out of Stock' : prod.availableQuantity <= 25 ? `Only ${prod.availableQuantity} left` : `${prod.availableQuantity} available`}
                              </span>
                            </div>
                            {cartItem ? (
                              <div className="flex items-center space-x-2 bg-[#F0F7F0] px-2 py-1 rounded-xl border border-[#DCECDC]">
                                <button onClick={() => store.updateCartQuantity(prod.id, cartItem.quantity - 1)} className="p-1 text-[#176B45] hover:bg-[#DCECDC] rounded"><Minus className="w-3.5 h-3.5" /></button>
                                <span className="font-bold text-xs text-[#176B45]">{cartItem.quantity}</span>
                                <button
                                  disabled={cartItem.quantity >= prod.availableQuantity}
                                  onClick={() => store.updateCartQuantity(prod.id, cartItem.quantity + 1)}
                                  className="p-1 text-[#176B45] hover:bg-[#DCECDC] rounded disabled:opacity-40"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                disabled={prod.availableQuantity <= 0}
                                onClick={() => store.addToCart(prod, 1)}
                                className="px-3.5 py-1.5 bg-[#176B45] hover:bg-[#104D35] disabled:bg-gray-300 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" /><span>{prod.availableQuantity <= 0 ? 'Sold Out' : 'Add'}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ══ BULK BUYER VIEW ══ */}
            {customerType === 'bulk' && (
              <div className="space-y-5">
                <div className="bg-gradient-to-r from-[#104D35] via-[#176B45] to-[#104D35] rounded-3xl p-6 sm:p-7 text-white shadow-xl">
                  <div className="max-w-2xl space-y-2">
                    <div className="inline-flex items-center space-x-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold">
                      <Building2 className="w-4 h-4 text-amber-300" />
                      <span>Bulk B2B Procurement — Farm-Direct, Best Rates, Weekly Supply</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-extrabold font-display leading-tight">
                      Wholesale Organic Produce for Your Business.
                    </h1>
                    <p className="text-xs text-emerald-100 leading-relaxed">
                      Hotels, restaurants, caterers & institutions get verified bulk supply at contract pricing. Zero middlemen. Fresh every week.
                    </p>
                  </div>
                </div>

                {!selectedBulkType ? (
                  <div className="space-y-3">
                    <div>
                      <h2 className="text-sm font-bold text-[#17231C]">Select Your Business Type</h2>
                      <p className="text-xs text-gray-500 mt-0.5">We'll customise pricing & minimum order quantities for you.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {bulkBuyerTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <button key={type.id} onClick={() => setSelectedBulkType(type.id)}
                            className={`flex flex-col items-start gap-2 p-5 rounded-2xl border-2 text-left transition-all hover:shadow-md hover:scale-[1.02] ${type.color}`}>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center">
                                <Icon className="w-5 h-5" />
                              </div>
                              <span className="font-bold text-sm">{type.label}</span>
                            </div>
                            <p className="text-[11px] opacity-80 font-medium">{type.desc}</p>
                            <span className="text-[10px] font-bold bg-white/50 px-2 py-0.5 rounded-full">Click to place bulk order →</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <button onClick={() => { setSelectedBulkType(null); setBulkQuoteSubmitted(false); }}
                      className="text-xs font-semibold text-[#176B45] hover:underline flex items-center gap-1">
                      ← Back to Business Type Selection
                    </button>

                    {bulkQuoteSubmitted ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#176B45] flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-[#17231C]">Bulk Quote Request Received!</h3>
                          <p className="text-xs text-gray-600 mt-1">Our B2B team will call <strong>{bulkContactPhone}</strong> within 2 business hours with custom pricing and a supply agreement.</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-xs text-left space-y-1 border border-emerald-100">
                          <p><strong>Business:</strong> {bulkBusinessName}</p>
                          <p><strong>Contact:</strong> {bulkContactName} — {bulkContactPhone}</p>
                          <p><strong>Type:</strong> {bulkBuyerTypes.find(b => b.id === selectedBulkType)?.label}</p>
                        </div>
                        <button onClick={() => { setBulkQuoteSubmitted(false); setSelectedBulkType(null); setBulkQty({}); setBulkBusinessName(''); setBulkContactName(''); setBulkContactPhone(''); }}
                          className="px-5 py-2 bg-[#176B45] text-white font-bold text-xs rounded-xl">
                          Place Another Quote
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={(e) => { e.preventDefault(); setBulkQuoteSubmitted(true); }} className="space-y-5">
                        <div className="bg-white rounded-2xl border border-[#176B45]/15 p-5 space-y-4">
                          <h3 className="font-bold text-sm text-[#17231C] flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#176B45]" /> Business Details
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-[#17231C] mb-1">Business / Restaurant Name *</label>
                              <input required value={bulkBusinessName} onChange={e => setBulkBusinessName(e.target.value)}
                                placeholder="e.g. The Grand Hotel Mumbai"
                                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#176B45]" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-[#17231C] mb-1">Contact Person Name *</label>
                              <input required value={bulkContactName} onChange={e => setBulkContactName(e.target.value)}
                                placeholder="Purchase Manager / Chef Name"
                                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#176B45]" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-[#17231C] mb-1">Phone / WhatsApp *</label>
                              <input required type="tel" value={bulkContactPhone} onChange={e => setBulkContactPhone(e.target.value)}
                                placeholder="+91 98XXX XXXXX"
                                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#176B45]" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-[#17231C] mb-1">Supply Frequency</label>
                              <select className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#176B45]">
                                <option>Daily</option>
                                <option>Every 2 Days</option>
                                <option>Weekly</option>
                                <option>Bi-weekly</option>
                                <option>Monthly Contract</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-[#176B45]/15 p-5 space-y-4">
                          <h3 className="font-bold text-sm text-[#17231C] flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-[#176B45]" /> Select Products & Quantity (kg)
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {state.products.map(prod => (
                              <div key={prod.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-[#FAF8F0]">
                                <div className="flex items-center gap-2">
                                  <img src={prod.imageUrl} alt={prod.name} className="w-10 h-10 rounded-lg object-cover" />
                                  <div>
                                    <p className="text-xs font-bold text-[#17231C]">{prod.name}</p>
                                    <p className="text-[10px] text-emerald-700 font-semibold">₹{prod.price}/{prod.unit} · Bulk rate negotiable</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <button type="button"
                                    onClick={() => setBulkQty(q => ({ ...q, [prod.id]: Math.max(0, (q[prod.id] || 0) - 10) }))}
                                    className="w-6 h-6 rounded-lg bg-gray-200 text-gray-700 font-bold flex items-center justify-center hover:bg-gray-300">
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-12 text-center text-xs font-bold text-[#176B45]">{bulkQty[prod.id] || 0} kg</span>
                                  <button type="button"
                                    onClick={() => setBulkQty(q => ({ ...q, [prod.id]: (q[prod.id] || 0) + 10 }))}
                                    className="w-6 h-6 rounded-lg bg-[#176B45] text-white font-bold flex items-center justify-center hover:bg-[#104D35]">
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-[10px] text-gray-500">* Quantities increase in steps of 10 kg. Final pricing confirmed by our B2B team.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FAF8F0] border border-[#176B45]/15 rounded-2xl p-4">
                          <div className="text-xs text-[#17231C]">
                            <p className="font-bold">Total Requested: {Object.values(bulkQty).reduce((a, b) => a + b, 0)} kg</p>
                            <p className="text-gray-500 mt-0.5">Our team will confirm bulk pricing within 2 hours via call/WhatsApp</p>
                          </div>
                          <button type="submit"
                            className="px-6 py-2.5 bg-[#176B45] hover:bg-[#104D35] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all">
                            <PhoneCall className="w-4 h-4" />
                            Request Bulk Quote
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* Navigation 2: Track Order Journey */}
        {(activeNav === 'track_order' || activeNav === 'orders') && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-5">
              <div className="flex justify-between items-start pb-3 border-b border-gray-100">
                <div>
                  <h2 className="text-base font-bold text-[#17231C]">Live Order Journey Tracker</h2>
                  <p className="text-xs text-[#66736A]">Tracking Order Ref: <strong>{trackingOrder?.id || 'ORD-CUST-901'}</strong></p>
                </div>
                <Badge variant="blue">{trackingOrder?.status || 'Out for Delivery'}</Badge>
              </div>

              {/* Progress Stepper Bar */}
              <div className="py-4">
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-emerald-600 -translate-y-1/2 z-0 transition-all duration-500" 
                    style={{ width: `${(getStepIndex(trackingOrder?.status || 'Out for Delivery') / 5) * 100}%` }}
                  />

                  {orderSteps.map((step, idx) => {
                    const activeIdx = getStepIndex(trackingOrder?.status || 'Out for Delivery');
                    const isPassed = idx <= activeIdx;
                    return (
                      <div key={idx} className="relative z-10 flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isPassed ? 'bg-[#176B45] text-white shadow-md' : 'bg-gray-100 text-gray-400 border border-gray-200'
                        }`}>
                          {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span className={`text-[11px] font-bold mt-2 text-center hidden sm:block ${
                          isPassed ? 'text-[#104D35]' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </span>
                        <span className="text-[9px] text-gray-500 text-center hidden sm:block">
                          {step.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items in Tracking */}
              {trackingOrder && (
                <div className="bg-[#FAF8F0] p-4 rounded-xl border border-[#176B45]/10 space-y-2 text-xs">
                  <span className="font-bold text-[#17231C]">Delivering to: {trackingOrder.shippingAddress}</span>
                  <div className="space-y-1 pt-2 border-t border-gray-200">
                    {trackingOrder.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between text-gray-700">
                        <span>{i.product.name} ({i.quantity} × ₹{i.product.price})</span>
                        <strong>₹{i.quantity * i.product.price}</strong>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-sm text-[#104D35] pt-1 border-t border-gray-200">
                      <span>Total Paid:</span>
                      <span>₹{trackingOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Past Orders List */}
            <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-[#17231C]">My Order History ({myCustomerOrders.length})</h3>
              {myCustomerOrders.map(ord => (
                <div 
                  key={ord.id}
                  onClick={() => setTrackingOrder(ord)}
                  className="p-3.5 rounded-xl border border-gray-200 hover:border-[#176B45]/30 cursor-pointer flex justify-between items-center text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-[#176B45]">{ord.id}</span>
                    <p className="text-gray-500 text-[11px]">{new Date(ord.orderDate).toLocaleDateString()} • {ord.items.length} Items</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm text-[#104D35]">₹{ord.totalAmount}</span>
                    <div className="mt-0.5">
                      <Badge variant="green">{ord.status}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation 3: Meet the Farmers */}
        {activeNav === 'farmers' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#17231C]">Our Organic Farmers & Cultivated Land</h2>
              <p className="text-xs text-[#66736A]">Pure Krishi eliminates all middle-agents, giving farmers fair guaranteed pricing.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {state.farmers.map(farmer => (
                <div key={farmer.id} className="p-4 rounded-xl border border-gray-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#17231C]">{farmer.name}</h4>
                      <p className="text-gray-500">{farmer.village}, {farmer.district}</p>
                    </div>
                    <Badge variant="green">{farmer.farmingPractices}</Badge>
                  </div>
                  <p className="text-gray-600 text-[11px]">Crops Cultivated: <strong>{farmer.mainCrops.join(', ')}</strong></p>
                  <p className="text-emerald-700 font-semibold text-[11px]">Fair-trade earnings received: ₹{farmer.totalEarnings.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation 4: Wishlist */}
        {activeNav === 'wishlist' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#17231C]">My Saved Organic Favourites ({wishlistIds.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {state.products.filter(p => wishlistIds.includes(p.id)).map(prod => (
                <div key={prod.id} className="p-3 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <img src={prod.imageUrl} alt={prod.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <strong className="text-gray-800">{prod.name}</strong>
                      <p className="text-[#104D35] font-bold">₹{prod.price} / {prod.unit}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => store.addToCart(prod, 1)}
                    className="px-3 py-1.5 bg-[#176B45] text-white font-bold rounded-lg text-xs"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation 5: Saved Addresses */}
        {activeNav === 'addresses' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#17231C]">Saved Delivery Addresses</h2>
            <div className="space-y-3 text-xs">
              {state.savedAddresses.map(addr => (
                <div key={addr.id} className="p-3.5 rounded-xl border border-gray-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#104D35]">{addr.title}</span>
                    <p className="text-gray-700 mt-0.5">{addr.fullAddress}, {addr.city} - {addr.pincode}</p>
                  </div>
                  {addr.isDefault && <Badge variant="green">Default</Badge>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation: My Profile */}
        {activeNav === 'profile' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-[#17231C]">My Customer Profile</h2>
                <p className="text-xs text-[#66736A]">Manage only your own account details & delivery preferences.</p>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="px-4 py-2 bg-[#176B45] text-white text-xs font-bold rounded-xl"
              >
                Edit My Profile
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#FAF8F0] rounded-xl">
                <span className="text-gray-500 block">Full Name</span>
                <strong>{state.currentUser.name}</strong>
              </div>
              <div className="p-3 bg-[#FAF8F0] rounded-xl">
                <span className="text-gray-500 block">Email</span>
                <strong>{state.currentUser.email}</strong>
              </div>
              <div className="p-3 bg-[#FAF8F0] rounded-xl">
                <span className="text-gray-500 block">Phone</span>
                <strong>{state.currentUser.phone || customerPhone}</strong>
              </div>
              <div className="p-3 bg-[#FAF8F0] rounded-xl">
                <span className="text-gray-500 block">Location</span>
                <strong>{state.currentUser.location || 'Mumbai, Maharashtra'}</strong>
              </div>
            </div>
            <ProfileEditorModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
          </div>
        )}

        {/* Navigation 6: Support */}
        {activeNav === 'support' && (
          <div className="bg-white rounded-2xl p-5 border border-[#176B45]/15 shadow-sm space-y-4 text-xs">
            <h2 className="text-base font-bold text-[#17231C]">Pure Krishi Help & Quality Assurance</h2>
            <p className="text-gray-600">Have questions about your organic delivery or chemical test reports?</p>
            <div className="p-4 bg-[#FAF8F0] rounded-xl border border-[#176B45]/10 space-y-1">
              <p>Customer Care Hotline: <strong>1800-PURE-KRISHI (Toll Free)</strong></p>
              <p>Email: <strong>support@purekrishi.org</strong></p>
              <p>WhatsApp Care: <strong>+91 98200 44556</strong></p>
            </div>
          </div>
        )}

      </main>

      {/* Floating Cart Button */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="bg-[#176B45] hover:bg-[#104D35] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 transition-all transform hover:scale-105 border-2 border-white"
          >
            <div className="w-6 h-6 rounded-full bg-white text-[#176B45] flex items-center justify-center font-bold text-xs">
              {cartItemCount}
            </div>
            <span className="font-bold text-xs sm:text-sm">Proceed to Checkout • ₹{cartSubtotal}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Traceability Modal */}
      {traceProduct && (
        <Modal
          isOpen={Boolean(traceProduct)}
          onClose={() => setTraceProduct(null)}
          title="Digital Traceability Certificate"
          subtitle={`Verified provenance for Batch ID: ${traceProduct.harvestBatchId}`}
        >
          <div className="space-y-4">
            {traceProduct.isLockedForCustomers && (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start space-x-3 text-xs text-amber-950">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-900 flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <strong className="block font-bold text-sm text-amber-900">
                    Exclusively Contracted & Locked for Supermarket B2B
                  </strong>
                  <p className="text-amber-800 text-xs">
                    This harvest batch was pre-purchased and locked by <strong>{traceProduct.lockedByBuyerName || 'Supermarket Procurement'}</strong> ({traceProduct.lockedQuantityKg || 1200} kg). Retail customer checkout is disabled for this batch.
                  </p>
                  {traceProduct.lockedReason && (
                    <span className="text-[10px] text-amber-700 block italic">Ref: {traceProduct.lockedReason}</span>
                  )}
                </div>
              </div>
            )}

            <div className="p-4 bg-[#F0F7F0] rounded-2xl border border-[#DCECDC] flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-[#176B45] text-white flex items-center justify-center font-bold shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#104D35]">{traceProduct.verificationBadge}</h4>
                <p className="text-xs text-[#66736A]">
                  Certified organic under NPOP standards. Clean multi-residue gas chromatography screening.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#FAF8F0] rounded-xl border border-[#176B45]/10">
                <span className="text-[10px] text-gray-500 block">Cultivating Farmer</span>
                <strong className="text-sm font-bold text-[#17231C]">{traceProduct.farmerName}</strong>
                <p className="text-[11px] text-gray-600 mt-0.5">{traceProduct.farmerLocation}</p>
              </div>

              <div className="p-3 bg-[#FAF8F0] rounded-xl border border-[#176B45]/10">
                <span className="text-[10px] text-gray-500 block">Farm Parcel</span>
                <strong className="text-sm font-bold text-[#17231C]">{traceProduct.farmName}</strong>
                <p className="text-[11px] text-emerald-800 mt-0.5">ZBNF Bio-Dynamic Soil (pH 6.8)</p>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <span className="font-bold text-[#17231C]">Health & Nutritional Advantages:</span>
              <ul className="list-disc list-inside space-y-0.5 text-gray-600 text-[11px]">
                {traceProduct.nutritionalBenefits.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setTraceProduct(null)}
                className="px-4 py-2 bg-[#176B45] text-white font-bold text-xs rounded-xl"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <Modal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          title="Direct Farm-to-Consumer Checkout"
          subtitle="Harvested fresh from verified farms, dispatched in climate-controlled crates."
        >
          <form onSubmit={handleCheckout} className="space-y-4">
            <div className="space-y-2 max-h-48 overflow-y-auto bg-[#FAF8F0] p-3 rounded-xl border border-[#176B45]/10">
              {state.cart.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center text-xs">
                  <div>
                    <strong className="text-gray-800">{item.product.name}</strong>
                    <span className="text-gray-500 text-[11px]"> ({item.quantity} × ₹{item.product.price})</span>
                  </div>
                  <strong className="text-[#104D35]">₹{item.quantity * item.product.price}</strong>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-200 flex justify-between text-xs text-gray-600">
                <span>Eco-friendly Reefer Dispatch Fee:</span>
                <span>{effectiveDeliveryFee === 0 ? 'FREE' : `₹${effectiveDeliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#104D35]">
                <span>Total Amount:</span>
                <span>₹{cartSubtotal + effectiveDeliveryFee}</span>
              </div>
            </div>
            {checkoutError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
                {checkoutError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Delivery Address *</label>
              <textarea
                rows={2}
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#17231C] mb-1">Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#17231C] mb-1">Preferred Slot</label>
                <select
                  value={deliverySlot}
                  onChange={(e) => setDeliverySlot(e.target.value)}
                  className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-white"
                >
                  <option value="Tomorrow Morning (07:00 AM - 10:00 AM)">Tomorrow Morning (07:00 AM - 10:00 AM)</option>
                  <option value="Tomorrow Evening (05:00 PM - 08:00 PM)">Tomorrow Evening (05:00 PM - 08:00 PM)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17231C] mb-1">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold ${
                    paymentMethod === 'upi' ? 'bg-[#F0F7F0] border-[#176B45] text-[#176B45]' : 'bg-white border-gray-200'
                  }`}
                >
                  UPI (GPay / PhonePe)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold ${
                    paymentMethod === 'cod' ? 'bg-[#F0F7F0] border-[#176B45] text-[#176B45]' : 'bg-white border-gray-200'
                  }`}
                >
                  Cash on Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold ${
                    paymentMethod === 'card' ? 'bg-[#F0F7F0] border-[#176B45] text-[#176B45]' : 'bg-white border-gray-200'
                  }`}
                >
                  Card / NetBanking
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCheckingOut}
                className="px-5 py-2 text-xs font-bold text-white bg-[#176B45] hover:bg-[#104D35] disabled:opacity-50 rounded-xl shadow-md transition-all"
              >
                {isCheckingOut ? 'Placing Order...' : `Confirm Order (₹${cartSubtotal + effectiveDeliveryFee})`}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Order Success Modal */}
      {orderSuccess && (
        <Modal
          isOpen={Boolean(orderSuccess)}
          onClose={() => setOrderSuccess(null)}
          title="Order Successfully Placed!"
          subtitle={`Order ID: ${orderSuccess.id}`}
        >
          <div className="space-y-4 text-center p-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#176B45] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#17231C]">Thank you for supporting verified organic farmers!</h3>
              <p className="text-xs text-gray-600 mt-1">
                Your fresh produce is being picked and packed at the Bhiwandi Regional Agro-Hub for delivery by {deliverySlot}.
              </p>
            </div>
            <div className="flex justify-center space-x-2 pt-2">
              <button
                onClick={() => {
                  setOrderSuccess(null);
                  setActiveNav('track_order');
                }}
                className="px-5 py-2.5 bg-[#176B45] text-white font-bold text-xs rounded-xl shadow-md"
              >
                Track Live Delivery Journey
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
