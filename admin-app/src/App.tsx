import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLogin } from './components/AdminLogin';
import { AdminLayout } from './components/layout/AdminLayout';
import { Dashboard } from './components/views/Dashboard';
import { FarmerAppMgmt } from './components/views/FarmerAppMgmt';
import { CustomerAppMgmt } from './components/views/CustomerAppMgmt';
import { FarmerManagement } from './components/views/FarmerManagement';
import { CustomerManagement } from './components/views/CustomerManagement';
import { ProductManagement } from './components/views/ProductManagement';
import { ProductApproval } from './components/views/ProductApproval';
import { InventoryManagement } from './components/views/InventoryManagement';
import { OrderManagement } from './components/views/OrderManagement';
import { WarehouseManagement } from './components/views/WarehouseManagement';
import { SupermarketManagement } from './components/views/SupermarketManagement';
import { DeliveryManagement } from './components/views/DeliveryManagement';
import { PaymentManagement } from './components/views/PaymentManagement';
import { ReportsAnalytics } from './components/views/ReportsAnalytics';
import { Notifications } from './components/views/Notifications';
import { ChangeRequests } from './components/views/ChangeRequests';
import { UserRoles } from './components/views/UserRoles';
import { AppSettings } from './components/views/AppSettings';
import { AuditLogs } from './components/views/AuditLogs';

export interface AdminUser {
  username: string;
  name: string;
  role: string;
}

export default function App() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  if (!admin) return <AdminLogin onLogin={setAdmin} />;

  return (
    <BrowserRouter>
      <AdminLayout admin={admin} onLogout={() => setAdmin(null)}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/farmer-app" element={<FarmerAppMgmt />} />
          <Route path="/customer-app" element={<CustomerAppMgmt />} />
          <Route path="/farmers" element={<FarmerManagement />} />
          <Route path="/customers" element={<CustomerManagement />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/product-approval" element={<ProductApproval />} />
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/warehouse" element={<WarehouseManagement />} />
          <Route path="/supermarkets" element={<SupermarketManagement />} />
          <Route path="/delivery" element={<DeliveryManagement />} />
          <Route path="/payments" element={<PaymentManagement />} />
          <Route path="/reports" element={<ReportsAnalytics />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/change-requests" element={<ChangeRequests />} />
          <Route path="/user-roles" element={<UserRoles />} />
          <Route path="/settings" element={<AppSettings />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AdminLayout>
    </BrowserRouter>
  );
}
