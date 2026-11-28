import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useStore } from './services/useStore';
import { useAuth } from './lib/auth';
import { Header } from './components/common/Header';
import { LoginScreen } from './components/common/LoginScreen';
import { SplashScreen } from './components/common/SplashScreen';
import { OperationsPortal } from './components/operations/OperationsPortal';
import { BuyerPortal } from './components/buyer/BuyerPortal';
import { ExpertPortal } from './components/expert/ExpertPortal';
import { WarehousePortal } from './components/warehouse/WarehousePortal';
import { DeliveryPortal } from './components/delivery/DeliveryPortal';
import { CustomerMarketplace } from './components/marketplace/CustomerMarketplace';
import { AIAssistantModal } from './components/ai/AIAssistantModal';
import { LandingPage } from './pages/LandingPage';
import { CustomerApp } from './pages/CustomerApp';
import { AdminApp } from './pages/AdminApp';
import { FarmerApp } from './pages/FarmerApp';
import { Bot, Sparkles } from 'lucide-react';
import type { UserRole } from './types';

function LegacyRolePortal() {
  const navigate = useNavigate();
  const { state } = useStore();
  const { isAuthenticated, user, logout } = useAuth();
  const [isAIOpen, setIsAIOpen] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <LoginScreen
        onLogin={(loggedRole: UserRole) => {
          if (loggedRole === 'super_admin' || loggedRole === 'operations_admin') navigate('/admin');
          else if (loggedRole === 'farmer') navigate('/farmer');
          else if (loggedRole === 'customer') navigate('/customer');
        }}
      />
    );
  }

  const role = user.role || state.currentUser.role;
  if (role === 'super_admin') return <Navigate to="/admin" replace />;
  if (role === 'farmer') return <Navigate to="/farmer" replace />;
  if (role === 'customer') return <Navigate to="/customer" replace />;

  const portalBg: Record<string, string> = {
    operations_admin: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50',
    buyer: 'bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50',
    expert: 'bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50',
    warehouse_staff: 'bg-gradient-to-br from-orange-50 via-amber-50 to-red-50',
    delivery_partner: 'bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50',
  };
  const bgClass = portalBg[role] ?? 'bg-[#F7F8F5]';

  return (
    <div className={`min-h-screen ${bgClass} text-[#17231C] flex flex-col font-sans`}>
      <Header onLogout={() => void logout()} />
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 gap-5">
        {role === 'operations_admin' ? (
          <main className="flex-1 w-full"><OperationsPortal /></main>
        ) : role === 'buyer' ? (
          <main className="flex-1 w-full"><BuyerPortal /></main>
        ) : role === 'expert' ? (
          <main className="flex-1 w-full"><ExpertPortal /></main>
        ) : role === 'warehouse_staff' ? (
          <main className="flex-1 w-full"><WarehousePortal /></main>
        ) : role === 'delivery_partner' ? (
          <main className="flex-1 w-full"><DeliveryPortal /></main>
        ) : (
          <main className="flex-1 w-full"><CustomerMarketplace /></main>
        )}
      </div>

      <div className="fixed bottom-5 left-5 z-40">
        <button
          onClick={() => setIsAIOpen(true)}
          className="bg-[#104D35] hover:bg-[#176B45] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 transition-all hover:scale-105 border border-emerald-500/20 group"
          title="Consult AI Agronomist"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-amber-300 flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 group-hover:animate-bounce" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold leading-none flex items-center gap-1">
              <span>AI Agronomist</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </div>
            <span className="text-[10px] text-emerald-300">ICAR & Gemini Ready</span>
          </div>
        </button>
      </div>

      <AIAssistantModal isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
}

export function App() {
  const [splashDone, setSplashDone] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('pure_krishi_splash_seen') === '1';
    } catch {
      return false;
    }
  });

  const handleSplashDone = () => {
    try {
      sessionStorage.setItem('pure_krishi_splash_seen', '1');
    } catch {
      // ignore
    }
    setSplashDone(true);
  };

  if (!splashDone) {
    return <SplashScreen onDone={handleSplashDone} />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/customer/*" element={<CustomerApp />} />
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/farmer/*" element={<FarmerApp />} />
      <Route path="/portal/*" element={<LegacyRolePortal />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
