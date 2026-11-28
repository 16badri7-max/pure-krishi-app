import { supabase } from './supabase';
import type {
  ProductListing,
  ProductCategory,
  FarmerProductSubmission,
  StockSubmission,
  CustomerOrder,
  EmployeeRecord,
  AuditLogEntry,
  PlatformSettings,
} from '../types';

function mapProductRow(row: Record<string, unknown>): ProductListing {
  return {
    id: String(row.id),
    name: String(row.name || ''),
    category: (row.category as ProductListing['category']) || 'Vegetables',
    price: Number(row.price ?? 0),
    sellingPrice: Number(row.selling_price ?? row.price ?? 0),
    mrp: row.mrp != null ? Number(row.mrp) : undefined,
    unit: String(row.unit || 'kg'),
    availableQuantity: Number(row.available_quantity ?? 0),
    farmerId: row.farmer_id ? String(row.farmer_id) : undefined,
    farmerName: String(row.farmer_name || 'Pure Krishi Partner Farmer'),
    farmerLocation: String(row.farmer_location || 'India'),
    farmName: String(row.farm_name || 'Verified Organic Farm'),
    harvestBatchId: String(row.harvest_batch_id || 'BAT-VERIFIED'),
    verificationBadge: String(row.verification_badge || 'NPOP Organic Certified'),
    imageUrl: String(
      row.image_url ||
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'
    ),
    description: String(row.description || ''),
    nutritionalBenefits: Array.isArray(row.nutritional_benefits)
      ? (row.nutritional_benefits as string[])
      : [],
    approvalStatus: (row.approval_status as ProductListing['approvalStatus']) || 'approved',
    isPublished: row.is_published !== false,
    isActive: row.is_active !== false,
    lowStockThreshold: Number(row.low_stock_threshold ?? 25),
    updatedAt: row.updated_at ? String(row.updated_at) : undefined,
    isLockedForCustomers: Boolean(row.is_locked_for_customers),
    lockedByBuyerName: row.locked_by_buyer_name ? String(row.locked_by_buyer_name) : undefined,
    lockedReason: row.locked_reason ? String(row.locked_reason) : undefined,
    lockedQuantityKg: row.locked_quantity_kg != null ? Number(row.locked_quantity_kg) : undefined,
  };
}

export async function fetchApprovedProductsFromDB(): Promise<ProductListing[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_published', true)
    .eq('approval_status', 'approved')
    .order('created_at', { ascending: false });

  if (error || !data) return null;
  return data.map(r => mapProductRow(r as Record<string, unknown>));
}

export async function fetchAllProductsForAdminFromDB(): Promise<ProductListing[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return null;
  return data.map(r => mapProductRow(r as Record<string, unknown>));
}

export async function fetchCategoriesFromDB(): Promise<ProductCategory[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error || !data) return null;
  return data.map((row: Record<string, unknown>) => ({
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description || ''),
    icon: String(row.icon || '🌱'),
    displayOrder: Number(row.display_order ?? 0),
    isActive: row.is_active !== false,
    createdAt: String(row.created_at || new Date().toISOString()),
  }));
}

export async function createProductInDB(product: Omit<ProductListing, 'id' | 'updatedAt'>): Promise<ProductListing | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('products')
    .insert({
      name: product.name,
      category: product.category,
      price: product.price,
      selling_price: product.sellingPrice ?? product.price,
      mrp: product.mrp ?? null,
      unit: product.unit,
      available_quantity: product.availableQuantity,
      farmer_id: product.farmerId ?? null,
      farmer_name: product.farmerName,
      farmer_location: product.farmerLocation,
      farm_name: product.farmName,
      harvest_batch_id: product.harvestBatchId,
      verification_badge: product.verificationBadge,
      image_url: product.imageUrl,
      description: product.description,
      nutritional_benefits: product.nutritionalBenefits,
      approval_status: product.approvalStatus ?? 'approved',
      is_published: product.isPublished ?? true,
      is_active: product.isActive ?? true,
      low_stock_threshold: product.lowStockThreshold ?? 25,
    })
    .select()
    .single();

  if (error || !data) throw new Error(error?.message || 'Failed to create product in Supabase');
  return mapProductRow(data as Record<string, unknown>);
}

export async function updateProductInDB(productId: string, updates: Partial<ProductListing>): Promise<ProductListing | null> {
  if (!supabase) return null;
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.price !== undefined) payload.price = updates.price;
  if (updates.sellingPrice !== undefined) payload.selling_price = updates.sellingPrice;
  if (updates.unit !== undefined) payload.unit = updates.unit;
  if (updates.availableQuantity !== undefined) payload.available_quantity = updates.availableQuantity;
  if (updates.imageUrl !== undefined) payload.image_url = updates.imageUrl;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.approvalStatus !== undefined) payload.approval_status = updates.approvalStatus;
  if (updates.isPublished !== undefined) payload.is_published = updates.isPublished;
  if (updates.isActive !== undefined) payload.is_active = updates.isActive;
  if (updates.isLockedForCustomers !== undefined) payload.is_locked_for_customers = updates.isLockedForCustomers;

  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', productId)
    .select()
    .single();

  if (error || !data) throw new Error(error?.message || 'Failed to update product in Supabase');
  return mapProductRow(data as Record<string, unknown>);
}

export async function deleteProductInDB(productId: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('products').delete().eq('id', productId);
  if (error) throw new Error(error.message);
  return true;
}

export async function submitFarmerProductInDB(
  sub: Omit<FarmerProductSubmission, 'id' | 'status' | 'createdAt'>,
  userId?: string
): Promise<FarmerProductSubmission | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('farmer_product_submissions')
    .insert({
      farmer_id: sub.farmerId || null,
      farm_id: sub.farmId || null,
      submitted_by: userId || null,
      farmer_name: sub.farmerName,
      submission_type: sub.submissionType,
      target_product_id: sub.targetProductId || null,
      product_name: sub.productName,
      category: sub.category,
      description: sub.description,
      images: sub.images,
      proposed_price: sub.proposedPrice,
      unit: sub.unit,
      proposed_quantity: sub.proposedQuantity,
      harvest_date: sub.harvestDate || null,
      organic_certified: sub.organicCertified,
      farming_notes: sub.farmingNotes || null,
      status: 'pending',
    })
    .select()
    .single();

  if (error || !data) throw new Error(error?.message || 'Failed to save product submission');
  return {
    id: String(data.id),
    farmerId: String(data.farmer_id || sub.farmerId),
    farmerName: String(data.farmer_name),
    submissionType: data.submission_type,
    targetProductId: data.target_product_id ?? undefined,
    productName: String(data.product_name),
    category: data.category,
    description: String(data.description || ''),
    images: data.images || [],
    proposedPrice: Number(data.proposed_price),
    unit: String(data.unit),
    proposedQuantity: Number(data.proposed_quantity),
    harvestDate: data.harvest_date ?? undefined,
    organicCertified: Boolean(data.organic_certified),
    farmingNotes: data.farming_notes ?? undefined,
    status: data.status,
    createdAt: String(data.created_at),
  };
}

export async function reviewSubmissionViaRPC(
  submissionId: string,
  decision: 'approved' | 'rejected' | 'under_review',
  options?: { adminNotes?: string; overridePrice?: number; overrideQuantity?: number; overrideName?: string; overrideDescription?: string }
): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.rpc('admin_review_product_submission', {
    p_submission_id: submissionId,
    p_decision: decision,
    p_admin_notes: options?.adminNotes ?? null,
    p_override_price: options?.overridePrice ?? null,
    p_override_quantity: options?.overrideQuantity ?? null,
    p_override_title: options?.overrideName ?? null,
    p_override_description: options?.overrideDescription ?? null,
  });
  if (error) throw new Error(error.message);
  return true;
}

export async function submitStockUpdateInDB(
  sub: Omit<StockSubmission, 'id' | 'status' | 'createdAt'>,
  userId?: string
): Promise<StockSubmission | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('stock_submissions')
    .insert({
      farmer_id: sub.farmerId || null,
      submitted_by: userId || null,
      farmer_name: sub.farmerName,
      product_id: sub.productId || null,
      warehouse_id: sub.warehouseId || null,
      harvest_batch_id: sub.harvestBatchId || null,
      product_name: sub.productName,
      submitted_quantity: sub.submittedQuantity,
      unit: sub.unit,
      harvest_date: sub.harvestDate,
      expected_grade: sub.expectedGrade,
      notes: sub.notes || null,
      status: 'pending',
    })
    .select()
    .single();

  if (error || !data) throw new Error(error?.message || 'Failed to save stock submission');
  return {
    id: String(data.id),
    farmerId: String(data.farmer_id || sub.farmerId),
    farmerName: String(data.farmer_name),
    productId: data.product_id ?? undefined,
    warehouseId: data.warehouse_id ?? undefined,
    harvestBatchId: data.harvest_batch_id ?? undefined,
    productName: String(data.product_name),
    submittedQuantity: Number(data.submitted_quantity),
    unit: String(data.unit),
    harvestDate: String(data.harvest_date),
    expectedGrade: String(data.expected_grade || 'Grade A'),
    notes: data.notes ?? undefined,
    status: data.status,
    createdAt: String(data.created_at),
  };
}

export async function approveStockSubmissionViaRPC(
  submissionId: string,
  decision: 'approved' | 'rejected',
  adminNotes?: string
): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.rpc('admin_approve_stock_submission', {
    p_submission_id: submissionId,
    p_decision: decision,
    p_admin_notes: adminNotes ?? null,
  });
  if (error) throw new Error(error.message);
  return true;
}

export async function placeCustomerOrderViaRPC(params: {
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  deliverySlot: string;
  items: Array<{ product_id: string; quantity: number }>;
  idempotencyKey?: string;
}): Promise<Record<string, unknown> | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc('place_customer_order', {
    p_customer_name: params.customerName,
    p_customer_phone: params.customerPhone,
    p_shipping_address: params.shippingAddress,
    p_payment_method: params.paymentMethod,
    p_delivery_slot: params.deliverySlot,
    p_items: params.items,
    p_idempotency_key: params.idempotencyKey ?? null,
  });
  if (error) throw new Error(error.message);
  return data as Record<string, unknown>;
}

export async function fetchCustomerOrdersFromDB(customerId?: string): Promise<CustomerOrder[] | null> {
  if (!supabase) return null;
  let query = supabase
    .from('customer_orders')
    .select('*, customer_order_items(*)')
    .order('order_date', { ascending: false });

  if (customerId) {
    query = query.eq('customer_id', customerId);
  }
  const { data, error } = await query;
  if (error || !data) return null;

  return data.map((row: Record<string, unknown>) => ({
    id: String(row.order_number || row.id),
    customerId: String(row.customer_id || ''),
    customerName: String(row.customer_name || ''),
    customerPhone: String(row.customer_phone || ''),
    shippingAddress: String(row.shipping_address || ''),
    items: Array.isArray(row.customer_order_items)
      ? (row.customer_order_items as Array<Record<string, unknown>>).map(it => ({
          quantity: Number(it.quantity ?? 1),
          product: {
            id: String(it.product_id || ''),
            name: String(it.product_name || ''),
            category: 'Vegetables',
            price: Number(it.unit_price ?? 0),
            unit: 'kg',
            availableQuantity: 0,
            farmerName: String(it.farmer_name || 'Pure Krishi Farmer'),
            farmerLocation: 'India',
            farmName: 'Partner Farm',
            harvestBatchId: 'BAT-VERIFIED',
            verificationBadge: 'NPOP Organic Certified',
            imageUrl: '',
            description: '',
            nutritionalBenefits: [],
          },
        }))
      : [],
    subtotal: Number(row.subtotal ?? 0),
    deliveryFee: Number(row.delivery_fee ?? 40),
    totalAmount: Number(row.total_amount ?? 0),
    status: (row.status as CustomerOrder['status']) || 'Order Placed',
    orderDate: String(row.order_date || new Date().toISOString()),
    estimatedDelivery: String(row.estimated_delivery || new Date().toISOString()),
    paymentMethod: (row.payment_method as CustomerOrder['paymentMethod']) || 'upi',
    paymentStatus: (row.payment_status as CustomerOrder['paymentStatus']) || 'Paid',
    deliverySlot: row.delivery_slot ? String(row.delivery_slot) : undefined,
    trackingNotes: row.tracking_notes ? String(row.tracking_notes) : undefined,
  }));
}

export async function fetchAuditLogsFromDB(): Promise<AuditLogEntry[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error || !data) return null;
  return data.map((row: Record<string, unknown>) => ({
    id: String(row.id),
    userId: row.user_id ? String(row.user_id) : undefined,
    actorName: String(row.actor_name || 'System Operator'),
    actorRole: String(row.actor_role || 'super_admin'),
    action: String(row.action),
    entityType: String(row.entity_type),
    entityId: String(row.entity_id),
    summary: String((row.new_values as Record<string, unknown> | null)?.summary || `${row.action} on ${row.entity_type}`),
    oldValues: (row.old_values as Record<string, unknown>) || undefined,
    newValues: (row.new_values as Record<string, unknown>) || undefined,
    createdAt: String(row.created_at),
  }));
}

export async function fetchEmployeesFromDB(): Promise<EmployeeRecord[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('employees').select('*').order('created_at', { ascending: false });
  if (error || !data) return null;
  return data.map((row: Record<string, unknown>) => ({
    id: String(row.id),
    fullName: String(row.full_name),
    email: String(row.email),
    phone: String(row.phone || ''),
    roleTitle: String(row.role_title),
    department: String(row.department),
    accessRole: row.access_role as EmployeeRecord['accessRole'],
    assignedWarehouseId: row.assigned_warehouse_id ? String(row.assigned_warehouse_id) : undefined,
    status: (row.status as EmployeeRecord['status']) || 'active',
    joinedAt: String(row.joined_at || ''),
  }));
}

export async function fetchPlatformSettingsFromDB(): Promise<PlatformSettings | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('platform_settings').select('key, value');
  if (error || !data || data.length === 0) return null;
  const map = Object.fromEntries(data.map((r: { key: string; value: Record<string, unknown> }) => [r.key, r.value]));
  return {
    deliveryFee: Number(map.delivery_fee?.standard ?? 40),
    freeDeliveryAbove: Number(map.delivery_fee?.free_above ?? 999),
    lowStockThresholdKg: Number(map.inventory_alerts?.low_stock_threshold_kg ?? 50),
    requireAdminApprovalForProducts: Boolean(map.order_workflow?.require_admin_approval_for_products ?? true),
    requireAdminApprovalForStock: Boolean(map.order_workflow?.require_admin_approval_for_stock ?? true),
    maintenanceMode: false,
  };
}
