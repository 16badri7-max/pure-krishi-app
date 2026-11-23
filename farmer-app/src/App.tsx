import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FarmerLogin from './components/FarmerLogin';
import FarmerLayout from './components/layout/FarmerLayout';
import FarmerDashboard from './components/views/FarmerDashboard';
import MyFarm from './components/views/MyFarm';
import CropManagement from './components/views/CropManagement';
import ProductSubmission from './components/views/ProductSubmission';
import StockUpdate from './components/views/StockUpdate';
import AssignedOrders from './components/views/AssignedOrders';
import Earnings from './components/views/Earnings';
import AIAssistant from './components/views/AIAssistant';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [farmer, setFarmer] = useState<{ name: string; phone: string } | null>(null);

  const handleLogin = (name: string, phone: string) => {
    setFarmer({ name, phone });
    setLoggedIn(true);
  };

  if (!loggedIn) return <FarmerLogin onLogin={handleLogin} />;

  return (
    <BrowserRouter>
      <FarmerLayout farmer={farmer} onLogout={() => { setLoggedIn(false); setFarmer(null); }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<FarmerDashboard farmer={farmer} />} />
          <Route path="/farm" element={<MyFarm />} />
          <Route path="/crops" element={<CropManagement />} />
          <Route path="/submit" element={<ProductSubmission />} />
          <Route path="/stock" element={<StockUpdate />} />
          <Route path="/orders" element={<AssignedOrders />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/ai" element={<AIAssistant />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </FarmerLayout>
    </BrowserRouter>
  );
}

export default App;
