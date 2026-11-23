import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CustomerLogin from './components/CustomerLogin';
import CustomerLayout from './components/layout/CustomerLayout';
import Shop from './components/views/Shop';
import Cart from './components/views/Cart';
import Orders from './components/views/Orders';
import TrackOrder from './components/views/TrackOrder';
import Profile from './components/views/Profile';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [customer, setCustomer] = useState<{ name: string; email: string } | null>(null);
  const [cart, setCart] = useState<Array<{ id: number; name: string; price: number; qty: number; icon: string }>>([]);

  const handleLogin = (name: string, email: string) => {
    setCustomer({ name, email });
    setLoggedIn(true);
  };

  const addToCart = (item: { id: number; name: string; price: number; icon: string }) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(c => c.id !== id));
  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) removeFromCart(id);
    else setCart(prev => prev.map(c => c.id === id ? { ...c, qty } : c));
  };

  if (!loggedIn) return <CustomerLogin onLogin={handleLogin} />;

  return (
    <BrowserRouter>
      <CustomerLayout customer={customer} cartCount={cart.reduce((s, c) => s + c.qty, 0)}>
        <Routes>
          <Route path="/" element={<Navigate to="/shop" replace />} />
          <Route path="/shop" element={<Shop addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} updateQty={updateQty} removeFromCart={removeFromCart} />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/profile" element={<Profile customer={customer} />} />
          <Route path="*" element={<Navigate to="/shop" replace />} />
        </Routes>
      </CustomerLayout>
    </BrowserRouter>
  );
}

export default App;
