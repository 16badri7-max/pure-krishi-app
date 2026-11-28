import { centralBackendUrl, isSupabaseConfigured } from './supabase';
import {
  approveStockSubmissionViaRPC,
  createProductInDB,
  deleteProductInDB,
  fetchAllProductsForAdminFromDB,
  fetchApprovedProductsFromDB,
  fetchAuditLogsFromDB,
  fetchCategoriesFromDB,
  fetchCustomerOrdersFromDB,
  fetchEmployeesFromDB,
  fetchPlatformSettingsFromDB,
  placeCustomerOrderViaRPC,
  reviewSubmissionViaRPC,
  submitFarmerProductInDB,
  submitStockUpdateInDB,
  updateProductInDB,
} from './database';
import { store } from '../services/store';
import type {
  CustomerOrder,
  DeliveryRecord,
  EmployeeRecord,
  FarmerProductSubmission,
  PlatformSettings,
  ProductCategory,
  ProductListing,
  StockSubmission,
  UserRole,
} from '../types';

const TOKEN_STORAGE_KEY = 'pure_krishi_api_token_v1';

export function getBackendToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setBackendToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
    else localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
}

async function callBackend<T>(path: string, options: RequestInit = {}): Promise<T | null> {
  if (!centralBackendUrl) return null;
  const token = getBackendToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${centralBackendUrl.replace(/\/$/, '')}/api/v1${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(errText || `Backend error (${res.status})`);
  }
  return (await res.json()) as T;
}

function assertRole(allowed: UserRole[], action: string) {
  const role = store.getState().currentUser.role;
  if (!allowed.includes(role)) {
    throw new Error(`Unauthorized (${role}): You do not have permission to ${action}.`);
  }
}

/**
 * Central API Gateway connecting Customer, Admin, and Farmer interfaces
 * through a single authorized backend / database pipeline.
 * Frontends never invoke each other directly.
 */
export const centralApi = {
  // ── CUSTOMER OPERATIONS ─────────────────────────────────────────────────
  async getApprovedCatalogue(): Promise<ProductListing[]> {
    if (centralBackendUrl) {
      try {
        const remote = await callBackend<ProductListing[]>('/products');
        if (remote && remote.length > 0) return remote;
      } catch {
        // fall through to Supabase / local store
      }
    }
    if (isSupabaseConfigured) {
      const dbProducts = await fetchApprovedProductsFromDB();
      if (dbProducts && dbProducts.length > 0) {
        store.hydrateFromRemote({ products: dbProducts });
        return dbProducts;
      }
    }
    return store
      .getState()
      .products.filter(
        p => p.isActive !== false && p.isPublished !== false && (p.approvalStatus ?? 'approved') === 'approved'
      );
  },

  async placeCustomerOrder(params: {
    shippingAddress: string;
    customerPhone: string;
    paymentMethod?: 'upi' | 'cod' | 'card';
    deliverySlot?: string;
    idempotencyKey?: string;
  }): Promise<CustomerOrder> {
    const state = store.getState();
    const idempotencyKey = params.idempotencyKey || `idem-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    if (centralBackendUrl && getBackendToken()) {
      await callBackend('/orders', {
        method: 'POST',
        body: JSON.stringify({
          shippingAddress: params.shippingAddress,
          customerPhone: params.customerPhone,
          paymentMethod: params.paymentMethod || 'upi',
          deliverySlot: params.deliverySlot,
          idempotencyKey,
          items: state.cart.map(i => ({ productId: i.product.id, quantity: i.quantity })),
        }),
      });
    } else if (isSupabaseConfigured) {
      try {
        await placeCustomerOrderViaRPC({
          customerName: state.currentUser.name,
          customerPhone: params.customerPhone,
          shippingAddress: params.shippingAddress,
          paymentMethod: params.paymentMethod || 'upi',
          deliverySlot: params.deliverySlot || 'Tomorrow Morning (07:00 AM - 10:00 AM)',
          items: state.cart.map(i => ({ product_id: i.product.id, quantity: i.quantity })),
          idempotencyKey,
        });
      } catch (err) {
        // Only fall back if product IDs are offline seed IDs (non-UUID)
        const hasUuid = state.cart.every(i => /^[0-9a-f-]{36}$/i.test(i.product.id));
        if (hasUuid) throw err;
      }
    }

    return store.checkoutCustomerOrder(params.shippingAddress, params.customerPhone, {
      paymentMethod: params.paymentMethod,
      deliverySlot: params.deliverySlot,
      idempotencyKey,
    });
  },

  async syncCustomerOrders(): Promise<CustomerOrder[]> {
    const user = store.getState().currentUser;
    if (isSupabaseConfigured) {
      const dbOrders = await fetchCustomerOrdersFromDB(user.id);
      if (dbOrders) return dbOrders;
    }
    return store.getState().customerOrders.filter(
      o => o.customerId === user.id || user.role === 'super_admin' || user.role === 'operations_admin'
    );
  },

  // ── FARMER OPERATIONS (SUBMIT REQUESTS ONLY — NEVER LIVE CATALOGUE) ─────
  async submitProductForApproval(
    submission: Omit<FarmerProductSubmission, 'id' | 'status' | 'createdAt'>
  ): Promise<FarmerProductSubmission> {
    assertRole(['farmer', 'super_admin', 'operations_admin'], 'submit agricultural products for review');
    const userId = store.getState().currentUser.id;

    if (centralBackendUrl && getBackendToken()) {
      await callBackend('/submissions', {
        method: 'POST',
        body: JSON.stringify(submission),
      });
    } else if (isSupabaseConfigured) {
      try {
        await submitFarmerProductInDB(submission, userId);
      } catch {
        // Preserve offline fallback if FK is local seed ID
      }
    }
    return store.farmerSubmitProduct(submission);
  },

  async submitStockForApproval(
    submission: Omit<StockSubmission, 'id' | 'status' | 'createdAt'>
  ): Promise<StockSubmission> {
    assertRole(['farmer', 'super_admin', 'operations_admin'], 'submit stock availability updates');
    const userId = store.getState().currentUser.id;

    if (centralBackendUrl && getBackendToken()) {
      await callBackend('/farmers/stock-submissions', {
        method: 'POST',
        body: JSON.stringify(submission),
      });
    } else if (isSupabaseConfigured) {
      try {
        await submitStockUpdateInDB(submission, userId);
      } catch {
        // Preserve offline fallback if FK is local seed ID
      }
    }
    return store.farmerSubmitStockUpdate(submission);
  },

  // ── ADMIN OPERATIONS (CENTRAL AUTHORITY) ────────────────────────────────
  async syncAdminWorkspace(): Promise<void> {
    assertRole(['super_admin', 'operations_admin'], 'sync central admin workspace');
    if (!isSupabaseConfigured) return;

    const [products, categories, orders, auditLogs, employees, settings] = await Promise.all([
      fetchAllProductsForAdminFromDB(),
      fetchCategoriesFromDB(),
      fetchCustomerOrdersFromDB(),
      fetchAuditLogsFromDB(),
      fetchEmployeesFromDB(),
      fetchPlatformSettingsFromDB(),
    ]);

    const patch: Partial<ReturnType<typeof store.getState>> = {};
    if (products && products.length > 0) patch.products = products;
    if (categories && categories.length > 0) patch.categories = categories;
    if (orders && orders.length > 0) patch.customerOrders = orders;
    if (auditLogs && auditLogs.length > 0) patch.auditLogs = auditLogs;
    if (employees && employees.length > 0) patch.employees = employees;
    if (settings) patch.platformSettings = settings;
    if (Object.keys(patch).length > 0) store.hydrateFromRemote(patch);
  },

  async adminCreateProduct(input: Omit<ProductListing, 'id' | 'updatedAt'>): Promise<ProductListing> {
    assertRole(['super_admin', 'operations_admin'], 'create live catalogue products');
    if (centralBackendUrl && getBackendToken()) {
      await callBackend('/products', { method: 'POST', body: JSON.stringify(input) });
    } else if (isSupabaseConfigured) {
      try {
        await createProductInDB(input);
      } catch {
        // fallback if offline user
      }
    }
    return store.adminCreateProduct(input);
  },

  async adminUpdateProduct(productId: string, updates: Partial<ProductListing>): Promise<ProductListing | null> {
    assertRole(['super_admin', 'operations_admin'], 'update live catalogue products');
    if (centralBackendUrl && getBackendToken()) {
      await callBackend(`/products/${productId}`, { method: 'PATCH', body: JSON.stringify(updates) });
    } else if (isSupabaseConfigured && /^[0-9a-f-]{36}$/i.test(productId)) {
      await updateProductInDB(productId, updates);
    }
    return store.adminUpdateProduct(productId, updates);
  },

  async adminToggleProductPublish(productId: string): Promise<void> {
    assertRole(['super_admin', 'operations_admin'], 'publish or unpublish products');
    store.adminToggleProductPublish(productId);
    const updated = store.getState().products.find(p => p.id === productId);
    if (updated && isSupabaseConfigured && /^[0-9a-f-]{36}$/i.test(productId)) {
      await updateProductInDB(productId, {
        isPublished: updated.isPublished,
        isActive: updated.isActive,
        approvalStatus: updated.approvalStatus,
      });
    }
  },

  async adminDeleteProduct(productId: string): Promise<void> {
    assertRole(['super_admin', 'operations_admin'], 'delete catalogue products');
    if (centralBackendUrl && getBackendToken()) {
      await callBackend(`/products/${productId}`, { method: 'DELETE' });
    } else if (isSupabaseConfigured && /^[0-9a-f-]{36}$/i.test(productId)) {
      await deleteProductInDB(productId);
    }
    store.adminDeleteProduct(productId);
  },

  async adminReviewProductSubmission(
    submissionId: string,
    decision: 'approved' | 'rejected' | 'under_review',
    options?: {
      adminNotes?: string;
      overridePrice?: number;
      overrideQuantity?: number;
      overrideName?: string;
      overrideDescription?: string;
    }
  ): Promise<FarmerProductSubmission | null> {
    assertRole(['super_admin', 'operations_admin'], 'approve or reject farmer product submissions');
    if (centralBackendUrl && getBackendToken()) {
      await callBackend(`/submissions/${submissionId}/review`, {
        method: 'POST',
        body: JSON.stringify({ decision, ...options }),
      });
    } else if (isSupabaseConfigured && /^[0-9a-f-]{36}$/i.test(submissionId)) {
      await reviewSubmissionViaRPC(submissionId, decision, options);
    }
    return store.adminReviewProductSubmission(submissionId, decision, options);
  },

  async adminReviewStockSubmission(
    submissionId: string,
    decision: 'approved' | 'rejected',
    adminNotes?: string
  ): Promise<StockSubmission | null> {
    assertRole(['super_admin', 'operations_admin'], 'approve or reject stock updates');
    if (centralBackendUrl && getBackendToken()) {
      await callBackend(`/admin/stock-submissions/${submissionId}/approve`, {
        method: 'POST',
        body: JSON.stringify({ decision, adminNotes }),
      });
    } else if (isSupabaseConfigured && /^[0-9a-f-]{36}$/i.test(submissionId)) {
      await approveStockSubmissionViaRPC(submissionId, decision, adminNotes);
    }
    return store.adminReviewStockSubmission(submissionId, decision, adminNotes);
  },

  adminSaveCategory(category: Omit<ProductCategory, 'id' | 'createdAt' | 'slug'> & { id?: string }): ProductCategory {
    assertRole(['super_admin', 'operations_admin'], 'manage categories');
    return store.adminSaveCategory(category);
  },

  adminToggleCategory(categoryId: string) {
    assertRole(['super_admin', 'operations_admin'], 'toggle categories');
    store.adminToggleCategory(categoryId);
  },

  adminUpdateCustomerOrder(
    orderId: string,
    updates: Partial<Pick<CustomerOrder, 'status' | 'assignedWarehouseId' | 'assignedFarmerName' | 'deliveryPartnerName' | 'trackingNotes'>>
  ) {
    assertRole(['super_admin', 'operations_admin'], 'update customer order fulfilment');
    store.adminUpdateCustomerOrder(orderId, updates);
  },

  adminUpdateDeliveryStatus(
    deliveryId: string,
    status: DeliveryRecord['status'],
    driverName?: string,
    vehicleNumber?: string,
    currentLocation?: string
  ) {
    assertRole(['super_admin', 'operations_admin'], 'manage delivery tracking');
    store.adminUpdateDeliveryStatus(deliveryId, status, driverName, vehicleNumber, currentLocation);
  },

  adminToggleCustomerStatus(customerId: string) {
    assertRole(['super_admin', 'operations_admin'], 'manage customer account status');
    store.adminToggleCustomerStatus(customerId);
  },

  adminAddEmployee(emp: Omit<EmployeeRecord, 'id'>): EmployeeRecord {
    assertRole(['super_admin', 'operations_admin'], 'add employees');
    return store.adminAddEmployee(emp);
  },

  adminUpdateEmployeeStatus(employeeId: string, status: EmployeeRecord['status']) {
    assertRole(['super_admin', 'operations_admin'], 'update employee status');
    store.adminUpdateEmployeeStatus(employeeId, status);
  },

  adminUpdateSettings(settings: Partial<PlatformSettings>) {
    assertRole(['super_admin', 'operations_admin'], 'update system settings');
    store.adminUpdateSettings(settings);
  },
};
