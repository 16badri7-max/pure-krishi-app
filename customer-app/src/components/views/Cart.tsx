import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartItem { id: number; name: string; price: number; qty: number; icon: string; }
interface CartProps {
  cart: CartItem[];
  updateQty: (id: number, qty: number) => void;
  removeFromCart: (id: number) => void;
}

export default function Cart({ cart, updateQty, removeFromCart }: CartProps) {
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const delivery = subtotal >= 1000 ? 0 : 50;
  const total = subtotal + delivery;

  if (cart.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-96 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-gray-700">Your cart is empty</h2>
        <p className="text-gray-400 text-sm mt-2">Add fresh farm produce to get started</p>
        <a href="/shop" className="mt-6 bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition">Shop Now</a>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800">Your Cart</h1>

      {/* Items */}
      <div className="space-y-3">
        {cart.map(item => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
            <div className="text-3xl">{item.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-800 text-sm">{item.name}</div>
              <div className="text-green-700 font-bold text-sm mt-0.5">₹{item.price}/kg</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(item.id, item.qty - 1)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
                <Minus size={13} />
              </button>
              <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
              <button onClick={() => updateQty(item.id, item.qty + 1)}
                className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition text-green-700">
                <Plus size={13} />
              </button>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-800 text-sm">₹{item.price * item.qty}</div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 mt-1">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
        <h2 className="font-semibold text-gray-800">Order Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600"><span>Subtotal ({cart.reduce((s, c) => s + c.qty, 0)} items)</span><span>₹{subtotal}</span></div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery</span>
            <span className={delivery === 0 ? 'text-green-600 font-medium' : ''}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
          </div>
          {delivery === 0 && <div className="text-xs text-green-600">🎉 Free delivery on orders above ₹1,000</div>}
          {delivery > 0 && <div className="text-xs text-gray-400">Add ₹{1000 - subtotal} more for free delivery</div>}
          <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-800 text-base">
            <span>Total</span><span>₹{total}</span>
          </div>
        </div>
        <button className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-green-500 hover:to-emerald-600 transition">
          <ShoppingBag size={18} /> Proceed to Checkout <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
