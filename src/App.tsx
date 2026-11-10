import React, { useState } from 'react';
import { useStore } from './services/useStore';
import { Header } from './components/common/Header';
import { LoginScreen } from './components/common/LoginScreen';
import { AdminSidebar, AdminViewType } from './components/admin/AdminSidebar';
import { OverviewView } from './components/admin/OverviewView';
import { BuyerManagementView } from './components/admin/BuyerManagementView';
import { BuyerRequirementsView } from './components/admin/BuyerRequirementsView';
import { SupplyAgreementsView } from './components/admin/SupplyAgreementsView';
import { FarmerManagementView } from './components/admin/FarmerManagementView';
import { LandDiscoveryView } from './components/admin/LandDiscoveryView';
import { CropPlanningView } from './components/admin/CropPlanningView';
import { HarvestManagementView } from './components/admin/HarvestManagementView';
import { QualityVerificationView } from './components/admin/QualityVerificationView';
import { WarehouseInventoryView } from './components/admin/WarehouseInventoryView';
import { OrdersLogisticsView } from './components/admin/OrdersLogisticsView';
import { FinancePaymentsView } from './components/admin/FinancePaymentsView';
import { ReportsSettingsView } from './components/admin/ReportsSettingsView';

import { OperationsPortal } from './components/operations/OperationsPortal';
import { BuyerPortal } from './components/buyer/BuyerPortal';
import { FarmerPortal } from './components/farmer/FarmerPortal';
import { ExpertPortal } from './components/expert/ExpertPortal';
import { WarehousePortal } from './components/warehouse/WarehousePortal';
import { DeliveryPortal } from './components/delivery/DeliveryPortal';
import { CustomerMarketplace } from './components/marketplace/CustomerMarketplace';

import { AIAssistantModal } from './components/ai/AIAssistantModal';
import { Bot, Sparkles } from 'lucide-react';

export function App() {
  const { state, store } = useStore();
  const [adminView, setAdminView] = useState<AdminViewType>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiCropContext, setAiCropContext] = useState<{ cropName: string; growthStage: string } | undefined>(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const role = state.currentUser.role;

  const handleOpenAIWithContext = (context?: { cropName: string; growthStage: string }) => {
    setAiCropContext(context);
    setIsAIOpen(true);
  };

  // Show Login screen first
  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#17231C] flex flex-col font-sans">

      {/* Sticky Header */}
      <Header
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenCart={() => {
          if (role !== 'customer') store.switchRole('customer');
        }}
        onLogout={() => setIsLoggedIn(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 gap-5">

        {/* Super Admin: sidebar + content */}
        {role === 'super_admin' ? (
          <>
            <AdminSidebar
              currentView={adminView}
              onSelectView={(v) => {
                if (v === 'ai_agronomy') setIsAIOpen(true);
                else setAdminView(v);
              }}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />
            <main className="flex-1 min-w-0">
              {adminView === 'overview' && (
                <OverviewView
                  onNavigate={(v) => {
                    if (v === 'ai_agronomy') setIsAIOpen(true);
                    else setAdminView(v);
                  }}
                />
              )}
              {adminView === 'buyers' && <BuyerManagementView />}
              {adminView === 'requirements' && <BuyerRequirementsView />}
              {adminView === 'agreements' && <SupplyAgreementsView />}
              {adminView === 'farmers' && <FarmerManagementView />}
              {adminView === 'land' && <LandDiscoveryView />}
              {adminView === 'crop_planning' && <CropPlanningView />}
              {adminView === 'harvest' && <HarvestManagementView />}
              {adminView === 'quality' && <QualityVerificationView />}
              {adminView === 'warehouse' && <WarehouseInventoryView />}
              {adminView === 'orders' && <OrdersLogisticsView />}
              {adminView === 'delivery' && <OrdersLogisticsView />}
              {adminView === 'expert_support' && <ExpertPortal />}
              {adminView === 'finance' && <FinancePaymentsView />}
              {adminView === 'reports' && <ReportsSettingsView />}
              {adminView === 'settings' && <ReportsSettingsView />}
            </main>
          </>
        ) : role === 'operations_admin' ? (
          <main className="flex-1 w-full"><OperationsPortal /></main>
        ) : role === 'buyer' ? (
          <main className="flex-1 w-full"><BuyerPortal /></main>
        ) : role === 'farmer' ? (
          <main className="flex-1 w-full"><FarmerPortal onOpenAI={handleOpenAIWithContext} /></main>
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

      {/* Floating AI Button */}
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

      {/* AI Modal */}
      <AIAssistantModal
        isOpen={isAIOpen}
        onClose={() => { setIsAIOpen(false); setAiCropContext(undefined); }}
        initialContext={aiCropContext}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-100 bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#104D35]">PURE KRISHI</span>
            <span>•</span>
            <span>Demand-First Agritech & AI Agricultural Operating System</span>
          </div>
          <span>Zero Chemical Residue Certified</span>
        </div>
      </footer>

    </div>
  );
}

export default App;
