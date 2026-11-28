import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, EyeOff, ArrowLeft, KeyRound } from 'lucide-react';
import { RequireRole } from '../lib/guards';
import { useAuth } from '../lib/auth';
import { centralApi } from '../lib/centralApi';
import { Header } from '../components/common/Header';
import { AdminSidebar, AdminViewType } from '../components/admin/AdminSidebar';
import { OverviewView } from '../components/admin/OverviewView';
import { CustomerManagementView } from '../components/admin/CustomerManagementView';
import { BuyerManagementView } from '../components/admin/BuyerManagementView';
import { BuyerRequirementsView } from '../components/admin/BuyerRequirementsView';
import { SupplyAgreementsView } from '../components/admin/SupplyAgreementsView';
import { FarmerManagementView } from '../components/admin/FarmerManagementView';
import { LandDiscoveryView } from '../components/admin/LandDiscoveryView';
import { CropPlanningView } from '../components/admin/CropPlanningView';
import { HarvestManagementView } from '../components/admin/HarvestManagementView';
import { QualityVerificationView } from '../components/admin/QualityVerificationView';
import { ProductManagementView } from '../components/admin/ProductManagementView';
import { CategoryManagementView } from '../components/admin/CategoryManagementView';
import { WarehouseInventoryView } from '../components/admin/WarehouseInventoryView';
import { OrdersLogisticsView } from '../components/admin/OrdersLogisticsView';
import { DeliveryManagementView } from '../components/admin/DeliveryManagementView';
import { BusinessAnalyticsView } from '../components/admin/BusinessAnalyticsView';
import { FinancePaymentsView } from '../components/admin/FinancePaymentsView';
import { ReportsSettingsView } from '../components/admin/ReportsSettingsView';
import { EmployeeManagementView } from '../components/admin/EmployeeManagementView';
import { SettingsView } from '../components/admin/SettingsView';
import { ExpertPortal } from '../components/expert/ExpertPortal';
import { AIAssistantModal } from '../components/ai/AIAssistantModal';
import logoImg from '../assets/logo.jpg';

const AdminAuthScreen: React.FC = () => {
  const { authMode, hasProvisionedLocalAdmin, loginWithEmailPassword, provisionLocalAdminAccount } = useAuth();
  const [mode] = useState<'login' | 'provision'>(
    authMode === 'offline' && !hasProvisionedLocalAdmin ? 'provision' : 'login'
  );
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'provision') {
        await provisionLocalAdminAccount({ email, name, password });
      } else {
        await loginWithEmailPassword(email, password, 'admin');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Admin authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#061810] via-[#0d3524] to-[#104D35] p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-200/30">
        <div className="bg-gradient-to-r from-[#104D35] to-[#176B45] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Pure Krishi" className="w-11 h-11 rounded-2xl object-cover border border-white/25" />
            <div>
              <h1 className="text-lg font-extrabold">Pure Krishi Admin Centre</h1>
              <p className="text-[11px] text-emerald-200">Authorized Central Control Only</p>
            </div>
          </div>
          <Link to="/" className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white" title="Back">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-emerald-900">
            <Lock className="w-4 h-4 text-[#176B45] shrink-0 mt-0.5" />
            <div>
              <strong>Security Policy:</strong> Admin access cannot be granted via public sign-up.
              {authMode === 'offline' && !hasProvisionedLocalAdmin
                ? ' Complete initial local Administrator provisioning for this offline workspace below.'
                : ' Sign in with an existing authorized Admin account.'}
            </div>
          </div>

          {mode === 'provision' && (
            <div>
              <label className="block font-bold text-[#17231C] mb-1">Administrator Full Name *</label>
              <input
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Rajesh Varma"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
              />
            </div>
          )}

          <div>
            <label className="block font-bold text-[#17231C] mb-1">Authorized Admin Email *</label>
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@purekrishi.org"
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
            />
          </div>

          <div>
            <label className="block font-bold text-[#17231C] mb-1">Passphrase *</label>
            <div className="relative">
              <input
                required
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={mode === 'provision' ? 'Create passphrase (min 8 chars)' : 'Enter passphrase'}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-semibold">{error}</div>}

          <button
            disabled={loading}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#104D35] to-[#176B45] text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            {mode === 'provision' ? <KeyRound className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            <span>
              {loading
                ? 'Verifying...'
                : mode === 'provision'
                ? 'Provision Local Admin & Enter'
                : 'Sign In to Admin Centre'}
            </span>
          </button>

          {authMode === 'offline' && hasProvisionedLocalAdmin && (
            <p className="text-[11px] text-center text-gray-500">
              Verified offline admin account is provisioned locally via salted SHA-256 hash.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export const AdminApp: React.FC = () => {
  const { logout } = useAuth();
  const [adminView, setAdminView] = useState<AdminViewType>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  useEffect(() => {
    void centralApi.syncAdminWorkspace().catch(() => {});
  }, []);

  return (
    <RequireRole
      allowedRoles={['super_admin', 'operations_admin']}
      portalName="Admin Control Centre"
      fallbackLogin={<AdminAuthScreen />}
    >
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 text-[#17231C] flex flex-col">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} onLogout={() => void logout()} />

        <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 gap-5">
          <AdminSidebar
            currentView={adminView}
            onSelectView={v => {
              if (v === 'ai_agronomy') setIsAIOpen(true);
              else setAdminView(v);
            }}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
          <main className="flex-1 min-w-0">
            {adminView === 'overview' && (
              <OverviewView
                onNavigate={v => {
                  if (v === 'ai_agronomy') setIsAIOpen(true);
                  else setAdminView(v as AdminViewType);
                }}
              />
            )}
            {adminView === 'analytics' && <BusinessAnalyticsView />}
            {adminView === 'customers' && <CustomerManagementView />}
            {adminView === 'products' && <ProductManagementView />}
            {adminView === 'categories' && <CategoryManagementView />}
            {(adminView === 'inventory' || adminView === 'warehouse') && <WarehouseInventoryView />}
            {adminView === 'orders' && <OrdersLogisticsView />}
            {adminView === 'delivery' && <DeliveryManagementView />}
            {adminView === 'buyers' && <BuyerManagementView />}
            {adminView === 'requirements' && <BuyerRequirementsView />}
            {adminView === 'agreements' && <SupplyAgreementsView />}
            {adminView === 'farmers' && <FarmerManagementView />}
            {adminView === 'land' && <LandDiscoveryView />}
            {adminView === 'crop_planning' && <CropPlanningView />}
            {adminView === 'harvest' && <HarvestManagementView />}
            {adminView === 'quality' && <QualityVerificationView />}
            {adminView === 'expert_support' && <ExpertPortal />}
            {adminView === 'finance' && <FinancePaymentsView />}
            {adminView === 'reports' && <ReportsSettingsView />}
            {adminView === 'employees' && <EmployeeManagementView />}
            {adminView === 'settings' && <SettingsView />}
          </main>
        </div>

        <AIAssistantModal isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
      </div>
    </RequireRole>
  );
};
