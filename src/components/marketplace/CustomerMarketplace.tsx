import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ShieldCheck, 
  Plus, 
  Minus, 
  CheckCircle2, 
  MapPin, 
  Sparkles, 
  Wheat, 
  ArrowRight, 
  ExternalLink, 
  Truck, 
  Heart, 
  UserCheck, 
  HelpCircle, 
  Clock, 
  Package, 
  CreditCard,
  Building2,
  Trash2,
  Tag,
  Lock,
  LockKeyhole
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import { ProductListing, CustomerOrder, SavedAddress } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export type CustomerNav = 
  | 'shop'
  | 'farmers'
  | 'orders'
  | 'track_order'
  | 'wishlist'
  | 'addresses'
  | 'profile'
  | 'support';

export const CustomerMarketplace: React.FC = () => {
  const { state, store } = useStore();
  const [activeNav, setActiveNav] = useState<CustomerNav>('shop');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [traceProduct, setTraceProduct] = useState<ProductListing | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<CustomerOrder | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<CustomerOrder | null>(state.customerOrders[0] || null);

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>(['prd-01', 'prd-04']);

  // Checkout Form
  const [shippingAddress, setShippingAddress] = useState(
    state.savedAddresses[0]?.fullAddress || 'Flat 402, Sea Green Apts, Perry Cross Road, Bandra West, Mumbai 400050'
  );
  const [customerPhone, setCustomerPhone] = useState('+91 98200 44556');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod' | 'card'>('upi');
  const [deliverySlot, setDeliverySlot] = useState('Tomorrow Morning (07:00 AM - 10:00 AM)');
  const [hideLockedForB2B, setHideLockedForB2B] = useState(false);

  const categories = ['all', 'Vegetables', 'Fruits', 'Grains', 'Pulses', 'Dry fruits', 'Spices'];

  const lockedProductsCount = state.products.filter(p => p.isLockedForCustomers).length;

  const filteredProducts = state.products.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.farmerLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesLock = !hideLockedForB2B || !p.isLockedForCustomers;
    return matchesSearch && matchesCat && matchesLock;
  });


  const cartItemCount = state.cart.reduce((s, i) => s + i.quantity, 0);
  const cartSubtotal = state.cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  const toggleWishlist = (id: string) => {
    if (wishlistIds.includes(id)) {
      setWishlistIds(wishlistIds.filter(i => i !== id));
    } else {
      setWishlistIds([...wishlistIds, id]);
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.cart.length === 0) return;

    const order = store.checkoutCustomerOrder(shippingAddress, customerPhone);
    setOrderSuccess(order);
    setTrackingOrder(order);
    setIsCheckoutOpen(false);
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
      case 'Order Placed': return 1;
      case 'Packed': return 2;
      case 'Out for Delivery': return 4;
      case 'Delivered': return 5;
      default: return 2;
    }
  };

  const navItems = [
    { id: 'shop', label: 'Fresh Marketplace', icon: ShoppingBag },
    { id: 'orders', label: 'My Orders', icon: Package, badge: state.customerOrders.length },
    { id: 'track_order', label: 'Live Order Tracker', icon: Truck },
    { id: 'farmers', label: 'Meet the Farmers', icon: UserCheck },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, badge: wishlistIds.length },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
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
          <div className="space-y-6">
            {/* Consumer Hero Banner */}
            <div className="bg-gradient-to-r from-[#176B45] via-[#104D35] to-[#176B45] rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
              <div className="max-w-2xl relative z-10 space-y-2">
                <div className="inline-flex items-center space-x-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>100% Zero Synthetic Pesticide Residue Tested</span>
                </div>
                <h1 className="text-xl sm:text-3xl font-extrabold font-display leading-tight">
                  Pure Organic Harvest, Delivered Farm-Fresh to Your Kitchen.
                </h1>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  Every product displays its verifiable batch ID, cultivating farmer, and soil test certificate.
                </p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#176B45]/15 shadow-sm">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search organic fruits, veggies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#176B45]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${
                      selectedCategory === cat
                        ? 'bg-[#176B45] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}

                {lockedProductsCount > 0 && (
                  <button
                    onClick={() => setHideLockedForB2B(!hideLockedForB2B)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border ${
                      hideLockedForB2B 
                        ? 'bg-amber-100 text-amber-900 border-amber-300' 
                        : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                    }`}
                    title="Toggle visibility of items locked for supermarket wholesale contracts"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-700" />
                    <span>{lockedProductsCount} B2B Locked</span>
                    <span className="text-[10px] text-amber-700 underline font-normal">
                      ({hideLockedForB2B ? 'Hidden' : 'Visible'})
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((prod) => {
                const cartItem = state.cart.find(i => i.product.id === prod.id);
                const isWishlisted = wishlistIds.includes(prod.id);
                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl border border-[#176B45]/15 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group relative"
                  >
                    {/* Wishlist button */}
                    <button
                      onClick={() => toggleWishlist(prod.id)}
                      className={`absolute top-2 right-2 z-10 p-1.5 rounded-full backdrop-blur-xs transition-colors ${
                        isWishlisted ? 'bg-rose-50 text-rose-600' : 'bg-white/80 text-gray-400 hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>

                    <div className="relative h-44 bg-gray-100 overflow-hidden">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                          prod.isLockedForCustomers ? 'opacity-85 filter saturate-75' : ''
                        }`}
                      />
                      {prod.isLockedForCustomers && (
                        <div className="absolute top-2 left-2 z-10 flex items-center space-x-1.5 bg-amber-500 text-stone-900 font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-md border border-amber-300">
                          <Lock className="w-3 h-3 text-stone-900" />
                          <span>B2B Contract Locked</span>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2">
                        <span className="bg-black/60 backdrop-blur-xs text-white font-bold text-[9px] px-2 py-0.5 rounded">
                          {prod.verificationBadge}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-[#66736A]">
                          <span>{prod.category}</span>
                          <span className="font-semibold text-emerald-800">{prod.unit}</span>
                        </div>
                        <h3 className="font-bold text-sm text-[#17231C] leading-snug">
                          {prod.name}
                        </h3>
                        <p className="text-xs text-[#66736A] line-clamp-2">
                          {prod.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-gray-500 block">Grower:</span>
                          <strong className="text-gray-800">{prod.farmerName}</strong>
                        </div>
                        <button
                          onClick={() => setTraceProduct(prod)}
                          className="text-[11px] font-bold text-[#176B45] hover:underline flex items-center space-x-1"
                        >
                          <span>Trace Batch</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <span className="text-base font-extrabold text-[#104D35]">₹{prod.price}</span>
                          <span className="text-[10px] text-gray-500"> / {prod.unit}</span>
                        </div>

                        {prod.isLockedForCustomers ? (
                          <div 
                            className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold"
                            title={prod.lockedReason || 'Reserved for supermarket wholesale'}
                          >
                            <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            <span>Locked for B2B</span>
                          </div>
                        ) : cartItem ? (
                          <div className="flex items-center space-x-2 bg-[#F0F7F0] px-2 py-1 rounded-xl border border-[#DCECDC]">
                            <button
                              onClick={() => store.updateCartQuantity(prod.id, cartItem.quantity - 1)}
                              className="p-1 text-[#176B45] hover:bg-[#DCECDC] rounded"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-bold text-xs text-[#176B45]">{cartItem.quantity}</span>
                            <button
                              onClick={() => store.updateCartQuantity(prod.id, cartItem.quantity + 1)}
                              className="p-1 text-[#176B45] hover:bg-[#DCECDC] rounded"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => store.addToCart(prod, 1)}
                            className="px-3.5 py-1.5 bg-[#176B45] hover:bg-[#104D35] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
              <h3 className="text-sm font-bold text-[#17231C]">Order History ({state.customerOrders.length})</h3>
              {state.customerOrders.map(ord => (
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
                <span>₹40</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#104D35]">
                <span>Total Amount:</span>
                <span>₹{cartSubtotal + 40}</span>
              </div>
            </div>

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
                className="px-5 py-2 text-xs font-bold text-white bg-[#176B45] hover:bg-[#104D35] rounded-xl shadow-md transition-all"
              >
                Confirm Order (₹{cartSubtotal + 40})
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
