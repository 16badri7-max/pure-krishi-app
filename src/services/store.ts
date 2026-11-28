import { 
  UserProfile, 
  UserRole, 
  Buyer, 
  BuyerRequirement, 
  SupplyAgreement, 
  Farmer, 
  Farm, 
  CropRecord, 
  CropPlanAllocation, 
  HarvestBatch, 
  QualityInspection, 
  Warehouse, 
  InventoryItem, 
  B2BOrder, 
  ProductListing, 
  CustomerOrder, 
  CustomerOrderItem,
  ExpertReviewCase, 
  FinancialMetric,
  AIMessage,
  Quotation,
  AppNotification,
  FarmerExpense,
  SavedAddress,
  InventoryMovementRecord,
  ProductCategory,
  FarmerProductSubmission,
  StockSubmission,
  EmployeeRecord,
  AuditLogEntry,
  PlatformSettings,
  CustomerAccountSummary,
  DeliveryRecord
} from '../types';

import { 
  INITIAL_PROFILES, 
  INITIAL_BUYERS, 
  INITIAL_BUYER_REQUIREMENTS, 
  INITIAL_AGREEMENTS, 
  INITIAL_FARMS, 
  INITIAL_FARMERS, 
  INITIAL_CROPS, 
  INITIAL_ALLOCATIONS, 
  INITIAL_HARVEST_BATCHES, 
  INITIAL_INSPECTIONS, 
  INITIAL_WAREHOUSES, 
  INITIAL_INVENTORY, 
  INITIAL_ORDERS, 
  INITIAL_B2C_PRODUCTS, 
  INITIAL_CUSTOMER_ORDERS, 
  INITIAL_EXPERT_REVIEWS, 
  INITIAL_FINANCIALS,
  INITIAL_QUOTATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_FARMER_EXPENSES,
  INITIAL_SAVED_ADDRESSES
} from './mockData';

const STORAGE_KEY = 'pure_krishi_state_v1';

export interface AppState {
  currentUser: UserProfile;
  buyers: Buyer[];
  requirements: BuyerRequirement[];
  agreements: SupplyAgreement[];
  quotations: Quotation[];
  farmers: Farmer[];
  farms: Farm[];
  crops: CropRecord[];
  allocations: CropPlanAllocation[];
  harvestBatches: HarvestBatch[];
  inspections: QualityInspection[];
  warehouses: Warehouse[];
  inventory: InventoryItem[];
  b2bOrders: B2BOrder[];
  products: ProductListing[];
  customerOrders: CustomerOrder[];
  cart: CustomerOrderItem[];
  expertReviews: ExpertReviewCase[];
  aiChatHistory: AIMessage[];
  financials: FinancialMetric;
  notifications: AppNotification[];
  farmerExpenses: FarmerExpense[];
  savedAddresses: SavedAddress[];
  inventoryMovements: InventoryMovementRecord[];
  categories: ProductCategory[];
  productSubmissions: FarmerProductSubmission[];
  stockSubmissions: StockSubmission[];
  employees: EmployeeRecord[];
  auditLogs: AuditLogEntry[];
  platformSettings: PlatformSettings;
  customerAccounts: CustomerAccountSummary[];
  deliveries: DeliveryRecord[];
  processedIdempotencyKeys: string[];
}

const INITIAL_INVENTORY_MOVEMENTS: InventoryMovementRecord[] = [
  {
    id: 'mov-101',
    batchId: 'BAT-2025-0301',
    productName: 'Desi Organic Tomatoes (Heirloom)',
    movementType: 'Inbound Ingest',
    quantityKg: 2800,
    fromLocation: 'Receiving Dock D-02',
    toLocation: 'QC Inspection Bay 1',
    staffName: 'Anil Deshmukh',
    timestamp: '2025-03-01T14:00:00Z',
  },
  {
    id: 'mov-102',
    batchId: 'BAT-2025-0301',
    productName: 'Desi Organic Tomatoes (Heirloom)',
    movementType: 'Storage Relocation',
    quantityKg: 2800,
    fromLocation: 'QC Inspection Bay 1',
    toLocation: 'Zone A Cold Bay (Rack A-04)',
    staffName: 'Sanjay Shinde',
    timestamp: '2025-03-01T16:15:00Z',
  },
  {
    id: 'mov-103',
    batchId: 'BAT-2025-0301',
    productName: 'Desi Organic Tomatoes (Heirloom)',
    movementType: 'Pick & Pack',
    quantityKg: 1500,
    fromLocation: 'Zone A Cold Bay (Rack A-04)',
    toLocation: 'Staging Pallet #3 (PO-2025-881)',
    staffName: 'Sanjay Shinde',
    timestamp: '2025-03-02T04:30:00Z',
  },
  {
    id: 'mov-104',
    batchId: 'BAT-2025-0301',
    productName: 'Desi Organic Tomatoes (Heirloom)',
    movementType: 'Dispatch',
    quantityKg: 1500,
    fromLocation: 'Staging Pallet #3',
    toLocation: 'ColdChain Reefer Truck MH-04-AZ-9981',
    staffName: 'Anil Deshmukh',
    timestamp: '2025-03-02T05:30:00Z',
  }
];

const INITIAL_CATEGORIES: ProductCategory[] = [
  { id: 'cat-veg', name: 'Vegetables', slug: 'vegetables', description: 'Fresh residue-free seasonal vegetables', icon: '🥬', displayOrder: 1, isActive: true, createdAt: '2025-01-01T00:00:00Z' },
  { id: 'cat-fru', name: 'Fruits', slug: 'fruits', description: 'Naturally ripened organic orchard fruits', icon: '🍎', displayOrder: 2, isActive: true, createdAt: '2025-01-01T00:00:00Z' },
  { id: 'cat-grn', name: 'Grains', slug: 'grains', description: 'Unpolished heirloom rice & ancient millets', icon: '🌾', displayOrder: 3, isActive: true, createdAt: '2025-01-01T00:00:00Z' },
  { id: 'cat-pls', name: 'Pulses', slug: 'pulses', description: 'Single-origin unpolished organic dals', icon: '🫘', displayOrder: 4, isActive: true, createdAt: '2025-01-01T00:00:00Z' },
  { id: 'cat-dry', name: 'Dry fruits', slug: 'dry-fruits', description: 'Hand-cracked nuts and unsulfured dried fruits', icon: '🌰', displayOrder: 5, isActive: true, createdAt: '2025-01-01T00:00:00Z' },
  { id: 'cat-spc', name: 'Spices', slug: 'spices', description: 'Single-estate sun-dried whole & ground spices', icon: '🌶️', displayOrder: 6, isActive: true, createdAt: '2025-01-01T00:00:00Z' },
];

const INITIAL_PRODUCT_SUBMISSIONS: FarmerProductSubmission[] = [
  {
    id: 'sub-prd-101',
    farmerId: 'fmr-01',
    farmerName: 'Ramesh Patil',
    submissionType: 'new_product',
    productName: 'Nashik Organic Cherry Tomatoes',
    category: 'Vegetables',
    description: 'Sweet vine-ripened organic cherry tomatoes cultivated using Jeevamrit bio-inputs in Dindori.',
    images: ['https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=600&q=80'],
    proposedPrice: 75,
    unit: '500 g punnet',
    proposedQuantity: 320,
    harvestDate: '2025-03-04',
    organicCertified: true,
    farmingNotes: 'Zero synthetic pesticides; drip irrigated.',
    status: 'pending',
    createdAt: '2025-03-02T10:20:00Z',
  },
  {
    id: 'sub-prd-102',
    farmerId: 'fmr-03',
    farmerName: 'Srinivasa Rao',
    submissionType: 'price_change',
    targetProductId: 'prd-05',
    productName: 'Natural Turmeric Powder (5.2% Curcumin)',
    category: 'Spices',
    description: 'Seasonal harvest batch with tested 5.4% curcumin content.',
    images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80'],
    proposedPrice: 152,
    unit: '250 g jar',
    proposedQuantity: 340,
    organicCertified: true,
    farmingNotes: 'Updated stone-milling packaging cost.',
    status: 'pending',
    createdAt: '2025-03-02T09:10:00Z',
  },
];

const INITIAL_STOCK_SUBMISSIONS: StockSubmission[] = [
  {
    id: 'sub-stk-201',
    farmerId: 'fmr-02',
    farmerName: 'Basavaraj Gowda',
    productId: 'prd-07',
    warehouseId: 'wh-201',
    harvestBatchId: 'BAT-2025-0311',
    productName: 'Fresh English Cucumbers',
    submittedQuantity: 250,
    unit: 'kg',
    harvestDate: '2025-03-02',
    expectedGrade: 'Grade A Premium',
    notes: 'Fresh morning harvest from Mandya polyhouse #2.',
    status: 'pending',
    createdAt: '2025-03-02T07:45:00Z',
  },
];

const INITIAL_EMPLOYEES: EmployeeRecord[] = [
  { id: 'emp-01', fullName: 'Rajesh Varma', email: 'admin@purekrishi.org', phone: '+91 98201 12345', roleTitle: 'Chief Operating Administrator', department: 'Executive Control', accessRole: 'super_admin', status: 'active', joinedAt: '2025-01-10' },
  { id: 'emp-02', fullName: 'Anil Deshmukh', email: 'ops.bhiwandi@purekrishi.org', phone: '+91 97654 32109', roleTitle: 'Agro-Hub Manager', department: 'Warehouse Operations', accessRole: 'warehouse_staff', status: 'active', joinedAt: '2025-01-25' },
  { id: 'emp-03', fullName: 'Dr. M. S. Swaminathan', email: 'dr.swaminathan@purekrishi.org', phone: '+91 98450 67890', roleTitle: 'Chief Agronomist & QC Lead', department: 'Quality & Agronomy', accessRole: 'expert', status: 'active', joinedAt: '2025-01-05' },
  { id: 'emp-04', fullName: 'Vikram Singh', email: 'logistics.fleet@purekrishi.org', phone: '+91 98111 22334', roleTitle: 'Cold-Chain Fleet Coordinator', department: 'Logistics & Dispatch', accessRole: 'delivery_partner', status: 'active', joinedAt: '2025-02-01' },
];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-101',
    actorName: 'Rajesh Varma',
    actorRole: 'super_admin',
    action: 'SUPPLY_AGREEMENT_AUTHORIZED',
    entityType: 'supply_agreements',
    entityId: 'agr-301',
    summary: 'Authorized monthly supermarket supply agreement for Nature\'s Basket',
    createdAt: '2025-03-01T16:30:12Z',
  },
  {
    id: 'AUD-102',
    actorName: 'Dr. M. S. Swaminathan',
    actorRole: 'expert',
    action: 'QUALITY_INSPECTION_APPROVED',
    entityType: 'harvest_batches',
    entityId: 'BAT-2025-0301',
    summary: 'Verified Grade A Premium — Zero chemical residue detected',
    createdAt: '2025-03-01T15:30:00Z',
  },
];

const INITIAL_SETTINGS: PlatformSettings = {
  deliveryFee: 40,
  freeDeliveryAbove: 999,
  lowStockThresholdKg: 50,
  requireAdminApprovalForProducts: true,
  requireAdminApprovalForStock: true,
  maintenanceMode: false,
};

const INITIAL_CUSTOMER_ACCOUNTS: CustomerAccountSummary[] = [
  {
    id: 'usr-cust-1',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@gmail.com',
    phone: '+91 98200 44556',
    location: 'Bandra West, Mumbai',
    status: 'active',
    totalOrders: 1,
    totalSpent: 245,
    lastOrderAt: '2025-03-02T08:30:00Z',
    joinedAt: '2025-02-10T16:20:00Z',
  },
];

const INITIAL_DELIVERIES: DeliveryRecord[] = [
  {
    id: 'DEL-901',
    orderId: 'ORD-CUST-901',
    orderType: 'B2C',
    customerOrBuyerName: 'Ananya Sharma',
    destination: 'Bandra West, Mumbai 400050',
    driverName: 'Vikram Singh',
    vehicleNumber: 'MH-04-PK-2201',
    currentLocation: 'Western Express Highway, Santacruz',
    status: 'Out for Delivery',
    estimatedArrival: '2025-03-02T18:00:00Z',
    updatedAt: '2025-03-02T14:15:00Z',
  },
];

function normalizeProducts(products: ProductListing[]): ProductListing[] {
  return products.map(p => ({
    ...p,
    sellingPrice: p.sellingPrice ?? p.price,
    approvalStatus: p.approvalStatus ?? 'approved',
    isPublished: p.isPublished ?? true,
    isActive: p.isActive ?? true,
    lowStockThreshold: p.lowStockThreshold ?? 50,
  }));
}

class StoreManager {
  private state: AppState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): AppState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          products: normalizeProducts(parsed.products || INITIAL_B2C_PRODUCTS),
          quotations: parsed.quotations || INITIAL_QUOTATIONS,
          notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
          farmerExpenses: parsed.farmerExpenses || INITIAL_FARMER_EXPENSES,
          savedAddresses: parsed.savedAddresses || INITIAL_SAVED_ADDRESSES,
          inventoryMovements: parsed.inventoryMovements || INITIAL_INVENTORY_MOVEMENTS,
          categories: parsed.categories || INITIAL_CATEGORIES,
          productSubmissions: parsed.productSubmissions || INITIAL_PRODUCT_SUBMISSIONS,
          stockSubmissions: parsed.stockSubmissions || INITIAL_STOCK_SUBMISSIONS,
          employees: parsed.employees || INITIAL_EMPLOYEES,
          auditLogs: parsed.auditLogs || INITIAL_AUDIT_LOGS,
          platformSettings: parsed.platformSettings || INITIAL_SETTINGS,
          customerAccounts: parsed.customerAccounts || INITIAL_CUSTOMER_ACCOUNTS,
          deliveries: parsed.deliveries || INITIAL_DELIVERIES,
          processedIdempotencyKeys: parsed.processedIdempotencyKeys || [],
        };
      }
    } catch (e) {
      console.error('Error loading state from localStorage:', e);
    }

    return {
      currentUser: INITIAL_PROFILES[0], // default Super Admin
      buyers: INITIAL_BUYERS,
      requirements: INITIAL_BUYER_REQUIREMENTS,
      agreements: INITIAL_AGREEMENTS,
      quotations: INITIAL_QUOTATIONS,
      farmers: INITIAL_FARMERS,
      farms: INITIAL_FARMS,
      crops: INITIAL_CROPS,
      allocations: INITIAL_ALLOCATIONS,
      harvestBatches: INITIAL_HARVEST_BATCHES,
      inspections: INITIAL_INSPECTIONS,
      warehouses: INITIAL_WAREHOUSES,
      inventory: INITIAL_INVENTORY,
      b2bOrders: INITIAL_ORDERS,
      products: normalizeProducts(INITIAL_B2C_PRODUCTS),
      customerOrders: INITIAL_CUSTOMER_ORDERS,
      cart: [],
      expertReviews: INITIAL_EXPERT_REVIEWS,
      aiChatHistory: [
        {
          id: 'msg-init-1',
          sender: 'ai',
          content: '🌱 Welcome to Pure Krishi AI Agronomy Assistant. Ask any question regarding crop diagnostics, organic fertilization (ZBNF), irrigation scheduling, or pest controls. Questions with low certainty will be automatically routed to our Chief Agronomists.',
          timestamp: new Date().toISOString(),
          confidenceScore: 98,
        }
      ],
      financials: INITIAL_FINANCIALS,
      notifications: INITIAL_NOTIFICATIONS,
      farmerExpenses: INITIAL_FARMER_EXPENSES,
      savedAddresses: INITIAL_SAVED_ADDRESSES,
      inventoryMovements: INITIAL_INVENTORY_MOVEMENTS,
      categories: INITIAL_CATEGORIES,
      productSubmissions: INITIAL_PRODUCT_SUBMISSIONS,
      stockSubmissions: INITIAL_STOCK_SUBMISSIONS,
      employees: INITIAL_EMPLOYEES,
      auditLogs: INITIAL_AUDIT_LOGS,
      platformSettings: INITIAL_SETTINGS,
      customerAccounts: INITIAL_CUSTOMER_ACCOUNTS,
      deliveries: INITIAL_DELIVERIES,
      processedIdempotencyKeys: [],
    };
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Error persisting state:', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public getState(): AppState {
    return this.state;
  }

  public resetToDefault() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = this.loadState();
    this.notify();
  }

  // --- User & Role Management ---
  public switchRole(role: UserRole) {
    const foundProfile = INITIAL_PROFILES.find(p => p.role === role);
    if (foundProfile) {
      this.state.currentUser = foundProfile;
    } else {
      this.state.currentUser = {
        ...this.state.currentUser,
        role: role,
        name: `${role.replace('_', ' ').toUpperCase()} User`,
      };
    }
    this.persist();
  }

  public setCurrentUser(user: UserProfile) {
    this.state.currentUser = user;
    this.persist();
  }

  // --- Buyer & Requirements Management ---
  public addBuyer(buyer: Omit<Buyer, 'id' | 'totalRequirementsCount' | 'activeAgreementsCount' | 'totalPurchaseValue' | 'createdAt'>) {
    const newBuyer: Buyer = {
      ...buyer,
      id: `byr-${Date.now().toString().slice(-4)}`,
      totalRequirementsCount: 0,
      activeAgreementsCount: 0,
      totalPurchaseValue: 0,
      createdAt: new Date().toISOString(),
    };
    this.state.buyers.unshift(newBuyer);
    this.persist();
    return newBuyer;
  }

  public updateBuyerStage(buyerId: string, stage: Buyer['stage']) {
    this.state.buyers = this.state.buyers.map(b => 
      b.id === buyerId ? { ...b, stage } : b
    );
    this.persist();
  }

  public addBuyerRequirement(requirement: Omit<BuyerRequirement, 'id' | 'submittedAt'>) {
    const newReq: BuyerRequirement = {
      ...requirement,
      id: `req-${Date.now().toString().slice(-4)}`,
      submittedAt: new Date().toISOString(),
    };
    this.state.requirements.unshift(newReq);
    
    // Update buyer count
    this.state.buyers = this.state.buyers.map(b => 
      b.id === requirement.buyerId ? { ...b, totalRequirementsCount: b.totalRequirementsCount + 1 } : b
    );
    this.persist();
    return newReq;
  }

  public addSupplyAgreement(agreement: Omit<SupplyAgreement, 'id'>) {
    const newAgreement: SupplyAgreement = {
      ...agreement,
      id: `agr-${Date.now().toString().slice(-4)}`,
    };
    this.state.agreements.unshift(newAgreement);
    this.persist();
    return newAgreement;
  }

  public signSupplyAgreement(agreementId: string, adminName: string) {
    this.state.agreements = this.state.agreements.map(a => 
      a.id === agreementId 
        ? { ...a, status: 'Authorized & Signed', signedByAdmin: adminName, signedAt: new Date().toISOString() } 
        : a
    );
    this.persist();
  }

  // --- Farmer & Farm Management ---
  public addFarmer(farmer: Omit<Farmer, 'id' | 'totalEarnings' | 'pendingPayment' | 'createdAt'>) {
    const newFarmer: Farmer = {
      ...farmer,
      id: `fmr-${Date.now().toString().slice(-4)}`,
      totalEarnings: 0,
      pendingPayment: 0,
      createdAt: new Date().toISOString(),
    };
    this.state.farmers.unshift(newFarmer);
    this.persist();
    return newFarmer;
  }

  public addFarm(farm: Omit<Farm, 'id'>) {
    const newFarm: Farm = {
      ...farm,
      id: `farm-${Date.now().toString().slice(-4)}`,
    };
    this.state.farms.unshift(newFarm);
    
    // Also attach to farmer's farms array
    this.state.farmers = this.state.farmers.map(f => 
      f.id === farm.farmerId ? { ...f, farms: [...f.farms, newFarm] } : f
    );
    this.persist();
    return newFarm;
  }

  public verifyFarm(farmId: string, status: Farm['verificationStatus']) {
    this.state.farms = this.state.farms.map(f => 
      f.id === farmId ? { ...f, verificationStatus: status } : f
    );
    this.persist();
  }

  // --- Crop & Demand Allocation Management ---
  public addCropRecord(crop: Omit<CropRecord, 'id' | 'actualHarvestKg' | 'allocatedToDemandKg' | 'surplusKg'>) {
    const newCrop: CropRecord = {
      ...crop,
      id: `crp-${Date.now().toString().slice(-4)}`,
      actualHarvestKg: 0,
      allocatedToDemandKg: 0,
      surplusKg: crop.expectedYieldKg,
    };
    this.state.crops.unshift(newCrop);
    this.persist();
    return newCrop;
  }

  public allocateFarmerToDemand(allocation: Omit<CropPlanAllocation, 'id'>) {
    const newAlloc: CropPlanAllocation = {
      ...allocation,
      id: `alc-${Date.now().toString().slice(-4)}`,
    };
    this.state.allocations.unshift(newAlloc);

    // Update crop record allocated quantity
    this.state.crops = this.state.crops.map(c => {
      if (c.id === allocation.cropRecordId) {
        const allocated = c.allocatedToDemandKg + allocation.allocatedQuantityKg;
        const surplus = Math.max(0, c.expectedYieldKg - allocated);
        return { ...c, allocatedToDemandKg: allocated, surplusKg: surplus };
      }
      return c;
    });

    // Update requirement item allocated quantity
    this.state.requirements = this.state.requirements.map(req => {
      const updatedItems = req.items.map(item => {
        if (item.id === allocation.requirementItemId) {
          const currentAlloc = (item.allocatedFarmerQuantity || 0) + allocation.allocatedQuantityKg;
          const status: 'Sourced' | 'Partially Sourced' = currentAlloc >= item.requiredQuantity ? 'Sourced' : 'Partially Sourced';
          return { ...item, allocatedFarmerQuantity: currentAlloc, status };
        }
        return item;
      });
      return { ...req, items: updatedItems };
    });

    this.persist();
    return newAlloc;
  }

  // --- Harvest & Quality Inspection ---
  public logHarvestBatch(batch: Omit<HarvestBatch, 'id' | 'status'>) {
    const newBatch: HarvestBatch = {
      ...batch,
      id: `BAT-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
      status: 'Harvested',
    };
    this.state.harvestBatches.unshift(newBatch);
    this.persist();
    return newBatch;
  }

  public submitQualityInspection(inspection: Omit<QualityInspection, 'id' | 'inspectedAt'>) {
    const newInspection: QualityInspection = {
      ...inspection,
      id: `qc-${Date.now().toString().slice(-4)}`,
      inspectedAt: new Date().toISOString(),
    };
    this.state.inspections.unshift(newInspection);

    // Update harvest batch status
    const isApproved = inspection.assignedGrade !== 'Rejected' && inspection.status === 'Approved';
    this.state.harvestBatches = this.state.harvestBatches.map(b => {
      if (b.id === inspection.harvestBatchId) {
        return {
          ...b,
          status: isApproved ? 'Approved' : 'Rejected',
          qualityInspectionId: newInspection.id,
        };
      }
      return b;
    });

    // If approved, create/update warehouse inventory
    if (isApproved) {
      const batch = this.state.harvestBatches.find(b => b.id === inspection.harvestBatchId);
      if (batch) {
        const wh = this.state.warehouses.find(w => w.id === batch.assignedWarehouseId) || this.state.warehouses[0];
        const newInv: InventoryItem = {
          id: `inv-${Date.now().toString().slice(-4)}`,
          warehouseId: wh.id,
          warehouseName: wh.name,
          productName: batch.cropName,
          category: 'Vegetables',
          batchId: batch.id,
          farmerName: batch.farmerName,
          grade: inspection.assignedGrade,
          availableQuantityKg: batch.harvestQuantity,
          reservedQuantityKg: 0,
          unitPrice: 42.00,
          expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          lastUpdated: new Date().toISOString(),
        };
        this.state.inventory.unshift(newInv);
      }
    }

    this.persist();
    return newInspection;
  }

  // --- Warehouse & B2B Orders ---
  public updateB2BOrderStatus(orderId: string, status: B2BOrder['status'], extra?: Partial<B2BOrder>) {
    this.state.b2bOrders = this.state.b2bOrders.map(o => 
      o.id === orderId ? { ...o, status, ...(extra || {}) } : o
    );
    this.persist();
  }

  public createB2BOrder(order: Omit<B2BOrder, 'id' | 'orderDate'>) {
    const newOrder: B2BOrder = {
      ...order,
      id: `PO-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`,
      orderDate: new Date().toISOString().split('T')[0],
    };
    this.state.b2bOrders.unshift(newOrder);

    // If order specifies items with batchId, lock corresponding retail products for customers
    order.items.forEach(it => {
      this.state.products = this.state.products.map(p => {
        if (p.harvestBatchId === it.batchId || p.name.toLowerCase().includes(it.productName.toLowerCase())) {
          return {
            ...p,
            isLockedForCustomers: true,
            lockedByBuyerName: order.buyerName,
            lockedReason: `Reserved for ${order.buyerName} under Purchase Order ${newOrder.id}`,
            lockedAt: new Date().toISOString(),
            lockedQuantityKg: it.quantityKg,
            availableQuantity: 0,
          };
        }
        return p;
      });
      // Remove locked items from customer carts
      this.state.cart = this.state.cart.filter(c => c.product.harvestBatchId !== it.batchId);
    });

    this.persist();
    return newOrder;
  }

  // --- B2B Direct Order & Customer Lock ---
  public lockProductForB2B(productId: string, buyerName: string, buyerId: string, quantityKg: number, reason: string = 'Supermarket Wholesale Purchase Order') {
    const product = this.state.products.find(p => p.id === productId);
    if (!product) return;

    // 1. Mark product as locked for customers
    product.isLockedForCustomers = true;
    product.lockedByBuyerName = buyerName;
    product.lockedReason = reason;
    product.lockedAt = new Date().toISOString();
    product.lockedQuantityKg = quantityKg;
    product.availableQuantity = 0; // depleted for retail customers

    // 2. Remove from any customer carts
    this.state.cart = this.state.cart.filter(item => item.product.id !== productId);

    // 3. Create confirmed B2B order for the buyer
    const unitPrice = Math.round(product.price * 0.85); // wholesale discounted price
    const totalAmount = unitPrice * quantityKg;
    
    const newOrder: B2BOrder = {
      id: `PO-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`,
      buyerId,
      buyerName,
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      deliveryAddress: 'Central Supermarket Logistics Distribution Hub',
      items: [
        {
          productName: product.name,
          quantityKg,
          unitPrice,
          totalPrice: totalAmount,
          batchId: product.harvestBatchId || 'BAT-EXCLUSIVE',
        }
      ],
      totalAmount,
      status: 'Confirmed',
      paymentStatus: 'Pending',
    };
    this.state.b2bOrders.unshift(newOrder);

    // 4. Update warehouse inventory reserved quantity
    this.state.inventory = this.state.inventory.map(inv => {
      if (inv.batchId === product.harvestBatchId || inv.productName.toLowerCase().includes(product.name.toLowerCase())) {
        return {
          ...inv,
          availableQuantityKg: Math.max(0, inv.availableQuantityKg - quantityKg),
          reservedQuantityKg: inv.reservedQuantityKg + quantityKg,
          lastUpdated: new Date().toISOString(),
        };
      }
      return inv;
    });

    // 5. Notifications
    this.addNotification({
      recipientRole: 'buyer',
      recipientId: buyerId,
      title: `Produce Exclusively Locked & Ordered`,
      message: `${quantityKg} kg of ${product.name} has been exclusively locked for ${buyerName} (Order #${newOrder.id}). Retail customer purchasing disabled.`,
      type: 'order',
      link: 'orders',
    });

    this.addNotification({
      recipientRole: 'super_admin',
      title: `B2B Exclusive Lock: ${product.name}`,
      message: `${product.name} was ordered and locked for retail customers by ${buyerName} (${quantityKg} kg).`,
      type: 'order',
      link: 'orders',
    });

    this.persist();
    return { order: newOrder, product };
  }

  public unlockProductForCustomers(productId: string) {
    const prod = this.state.products.find(p => p.id === productId);
    if (!prod) return;

    prod.isLockedForCustomers = false;
    prod.lockedByBuyerName = undefined;
    prod.lockedReason = undefined;
    prod.lockedAt = undefined;
    prod.lockedQuantityKg = undefined;
    prod.availableQuantity = 450; // restored retail inventory

    this.addNotification({
      recipientRole: 'super_admin',
      title: `Produce Unlocked for Retail`,
      message: `${prod.name} has been released back to retail customers in the marketplace.`,
      type: 'alert',
      link: 'products',
    });

    this.persist();
  }

  // --- Customer Marketplace & Cart ---
  public addToCart(product: ProductListing, quantity: number = 1) {
    if (product.isLockedForCustomers || product.isPublished === false || product.isActive === false || (product.approvalStatus && product.approvalStatus !== 'approved')) {
      console.warn(`Product ${product.name} is unavailable for retail purchase.`);
      return;
    }
    const liveProduct = this.state.products.find(p => p.id === product.id) || product;
    const existing = this.state.cart.find(item => item.product.id === product.id);
    const nextQty = (existing?.quantity || 0) + quantity;
    if (nextQty > liveProduct.availableQuantity) {
      throw new Error(`Only ${liveProduct.availableQuantity} units available for ${liveProduct.name}.`);
    }
    if (existing) {
      existing.quantity = nextQty;
      existing.product = liveProduct;
    } else {
      this.state.cart.push({ product: liveProduct, quantity });
    }
    this.persist();
  }

  public updateCartQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.state.cart = this.state.cart.filter(item => item.product.id !== productId);
    } else {
      const item = this.state.cart.find(i => i.product.id === productId);
      const liveProduct = this.state.products.find(p => p.id === productId);
      if (item) {
        if (liveProduct && quantity > liveProduct.availableQuantity) {
          throw new Error(`Only ${liveProduct.availableQuantity} units available for ${liveProduct.name}.`);
        }
        item.quantity = quantity;
      }
    }
    this.persist();
  }

  public clearCart() {
    this.state.cart = [];
    this.persist();
  }

  public checkoutCustomerOrder(
    shippingAddress: string,
    customerPhone: string,
    options?: {
      paymentMethod?: 'upi' | 'cod' | 'card';
      deliverySlot?: string;
      idempotencyKey?: string;
    }
  ): CustomerOrder {
    if (options?.idempotencyKey && this.state.processedIdempotencyKeys.includes(options.idempotencyKey)) {
      const existingOrder = this.state.customerOrders[0];
      if (existingOrder) return existingOrder;
    }

    if (this.state.cart.length === 0) {
      throw new Error('Your cart is empty.');
    }

    // Validate live stock & approved status atomically before committing order
    const validatedItems: CustomerOrderItem[] = this.state.cart.map(item => {
      const liveProduct = this.state.products.find(p => p.id === item.product.id);
      if (!liveProduct || liveProduct.isActive === false || liveProduct.isPublished === false || (liveProduct.approvalStatus && liveProduct.approvalStatus !== 'approved')) {
        throw new Error(`Product "${item.product.name}" is no longer available in the approved catalogue.`);
      }
      if (liveProduct.isLockedForCustomers) {
        throw new Error(`Product "${liveProduct.name}" is exclusively reserved for B2B buyers.`);
      }
      if (liveProduct.availableQuantity < item.quantity) {
        throw new Error(`Insufficient stock for "${liveProduct.name}". Available: ${liveProduct.availableQuantity}`);
      }
      return { product: liveProduct, quantity: item.quantity };
    });

    const subtotal = validatedItems.reduce(
      (sum, item) => sum + (item.product.sellingPrice ?? item.product.price) * item.quantity,
      0
    );
    const deliveryFee = subtotal >= this.state.platformSettings.freeDeliveryAbove
      ? 0
      : this.state.platformSettings.deliveryFee;
    const total = subtotal + deliveryFee;

    const newOrder: CustomerOrder = {
      id: `ORD-CUST-${Date.now().toString().slice(-4)}`,
      customerId: this.state.currentUser.id,
      customerName: this.state.currentUser.name,
      customerPhone,
      shippingAddress,
      items: validatedItems,
      subtotal,
      deliveryFee,
      totalAmount: total,
      status: 'Order Placed',
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      paymentMethod: options?.paymentMethod || 'upi',
      paymentStatus: options?.paymentMethod === 'cod' ? 'Pending' : 'Paid',
      deliverySlot: options?.deliverySlot || 'Tomorrow Morning (07:00 AM - 10:00 AM)',
      assignedWarehouseId: this.state.warehouses[0]?.id,
      assignedFarmerName: validatedItems[0]?.product.farmerName,
    };

    // Deduct stock atomically
    for (const item of validatedItems) {
      this.state.products = this.state.products.map(p =>
        p.id === item.product.id
          ? { ...p, availableQuantity: Math.max(0, p.availableQuantity - item.quantity), updatedAt: new Date().toISOString() }
          : p
      );
    }

    if (options?.idempotencyKey) {
      this.state.processedIdempotencyKeys.push(options.idempotencyKey);
    }

    this.state.customerOrders.unshift(newOrder);
    this.state.cart = [];

    // Update customer summary
    const existingCust = this.state.customerAccounts.find(c => c.id === this.state.currentUser.id || c.email === this.state.currentUser.email);
    if (existingCust) {
      existingCust.totalOrders += 1;
      existingCust.totalSpent += total;
      existingCust.lastOrderAt = newOrder.orderDate;
    } else {
      this.state.customerAccounts.unshift({
        id: this.state.currentUser.id,
        name: this.state.currentUser.name,
        email: this.state.currentUser.email,
        phone: customerPhone,
        location: this.state.currentUser.location || shippingAddress,
        status: 'active',
        totalOrders: 1,
        totalSpent: total,
        lastOrderAt: newOrder.orderDate,
        joinedAt: this.state.currentUser.createdAt || newOrder.orderDate,
      });
    }

    // Create delivery record for admin coordination
    this.state.deliveries.unshift({
      id: `DEL-${Date.now().toString().slice(-4)}`,
      orderId: newOrder.id,
      orderType: 'B2C',
      customerOrBuyerName: newOrder.customerName,
      destination: shippingAddress,
      driverName: 'Pending Assignment',
      vehicleNumber: 'TBA',
      currentLocation: 'Bhiwandi Regional Agro-Hub',
      status: 'Assigned',
      estimatedArrival: newOrder.estimatedDelivery,
      updatedAt: new Date().toISOString(),
    });

    // Update financials
    this.state.financials.totalCustomerSales += total;
    this.state.financials.grossRevenue += total;

    this.recordAuditLog({
      action: 'CUSTOMER_ORDER_PLACED',
      entityType: 'customer_orders',
      entityId: newOrder.id,
      summary: `${newOrder.customerName} placed order ${newOrder.id} worth ₹${total}`,
      newValues: { totalAmount: total, itemCount: validatedItems.length },
    });

    this.addNotification({
      recipientRole: 'super_admin',
      title: `New Customer Order ${newOrder.id}`,
      message: `${newOrder.customerName} placed a ₹${total.toLocaleString()} order (${validatedItems.length} items). Ready for fulfilment coordination.`,
      type: 'order',
      link: 'orders',
    });

    this.addNotification({
      recipientRole: 'farmer',
      title: `New Fulfilment Demand (${newOrder.id})`,
      message: `${validatedItems.map(i => `${i.product.name} × ${i.quantity}`).join(', ')} ordered — prepare fresh harvest dispatch when Admin confirms.`,
      type: 'order',
      link: 'orders',
    });

    this.persist();
    return newOrder;
  }

  // --- AI Chat & Agronomy Assistant ---
  public addAIMessage(message: Omit<AIMessage, 'id' | 'timestamp'>) {
    const newMsg: AIMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.state.aiChatHistory.push(newMsg);
    this.persist();
    return newMsg;
  }

  public escalateToExpert(farmerId: string, farmerName: string, farmerPhone: string, cropName: string, question: string, aiSuggestedAnswer: string, confidence: number) {
    const newCase: ExpertReviewCase = {
      id: `EXP-CASE-${Date.now().toString().slice(-4)}`,
      farmerId,
      farmerName,
      farmerPhone,
      cropName,
      question,
      aiSuggestedAnswer,
      confidenceScore: confidence,
      status: 'Pending Review',
      createdAt: new Date().toISOString(),
    };
    this.state.expertReviews.unshift(newCase);
    this.persist();
    return newCase;
  }

  public resolveExpertCase(caseId: string, expertName: string, response: string) {
    this.state.expertReviews = this.state.expertReviews.map(c => 
      c.id === caseId 
        ? { ...c, status: 'Resolved', assignedExpertName: expertName, expertResponse: response, resolvedAt: new Date().toISOString() } 
        : c
    );
    this.persist();
  }

  // --- Quotations Management ---
  public addQuotation(quotation: Omit<Quotation, 'id' | 'createdAt'>) {
    const newQuo: Quotation = {
      ...quotation,
      id: `QUO-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`,
      createdAt: new Date().toISOString(),
    };
    this.state.quotations.unshift(newQuo);

    // Notify buyer
    this.addNotification({
      recipientRole: 'buyer',
      recipientId: quotation.buyerId,
      title: 'New Quotation Received',
      message: `Quotation ${newQuo.quotationNumber} (₹${newQuo.totalQuotedAmount.toLocaleString()}) has been prepared for your demand.`,
      type: 'quotation',
      link: 'quotations',
    });

    this.persist();
    return newQuo;
  }

  public updateQuotationStatus(quotationId: string, status: Quotation['status'], negotiationNotes?: string) {
    this.state.quotations = this.state.quotations.map(q => 
      q.id === quotationId 
        ? { ...q, status, ...(negotiationNotes ? { negotiationNotes } : {}) } 
        : q
    );
    this.persist();
  }

  // --- Shared Notification System ---
  public addNotification(notif: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.state.notifications.unshift(newNotif);
    this.persist();
    return newNotif;
  }

  public markNotificationAsRead(id: string) {
    this.state.notifications = this.state.notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    this.persist();
  }

  public markAllNotificationsAsRead(role?: UserRole) {
    this.state.notifications = this.state.notifications.map(n => 
      (!role || n.recipientRole === role || n.recipientRole === 'all')
        ? { ...n, isRead: true } 
        : n
    );
    this.persist();
  }

  // --- Farmer Portal Enhancements ---
  public addFarmerExpense(expense: Omit<FarmerExpense, 'id'>) {
    const newExp: FarmerExpense = {
      ...expense,
      id: `exp-${Date.now().toString().slice(-4)}`,
    };
    this.state.farmerExpenses.unshift(newExp);
    this.persist();
    return newExp;
  }

  public updateCropGrowthStage(cropId: string, growthStage: CropRecord['growthStage'], healthStatus?: CropRecord['healthStatus']) {
    this.state.crops = this.state.crops.map(c => 
      c.id === cropId 
        ? { ...c, growthStage, ...(healthStatus ? { healthStatus } : {}) } 
        : c
    );
    this.persist();
  }

  public farmerCommitDemand(requirementItemId: string, cropRecordId: string, farmerId: string, committedKg: number) {
    const crop = this.state.crops.find(c => c.id === cropRecordId);
    const req = this.state.requirements.find(r => r.items.some(i => i.id === requirementItemId));
    const reqItem = req?.items.find(i => i.id === requirementItemId);

    if (crop && req && reqItem) {
      const newAlloc: CropPlanAllocation = {
        id: `alc-${Date.now().toString().slice(-4)}`,
        requirementItemId,
        buyerName: req.buyerName,
        cropRecordId: crop.id,
        farmerId,
        farmerName: crop.farmerName,
        cropName: crop.cropName,
        allocatedQuantityKg: committedKg,
        targetHarvestDate: crop.expectedHarvestDate,
        estimatedDeliveryDate: reqItem.requiredDeliveryDate,
        status: 'Confirmed',
      };

      this.state.allocations.unshift(newAlloc);

      // Update crop surplus
      crop.allocatedToDemandKg += committedKg;
      crop.surplusKg = Math.max(0, crop.expectedYieldKg - crop.allocatedToDemandKg);

      // Update requirement item
      reqItem.allocatedFarmerQuantity = (reqItem.allocatedFarmerQuantity || 0) + committedKg;
      if (reqItem.allocatedFarmerQuantity >= reqItem.requiredQuantity) {
        reqItem.status = 'Sourced';
      } else {
        reqItem.status = 'Partially Sourced';
      }

      // Notify Super Admin & Operations Admin
      this.addNotification({
        recipientRole: 'super_admin',
        title: 'Farmer Supply Commitment Confirmed',
        message: `${crop.farmerName} committed ${committedKg} kg of ${crop.cropName} for ${req.buyerName}.`,
        type: 'requirement',
        link: 'crop_planning',
      });

      this.persist();
      return newAlloc;
    }
  }

  // --- Customer Portal Enhancements ---
  public updateCustomerOrderStatus(orderId: string, status: CustomerOrder['status']) {
    this.state.customerOrders = this.state.customerOrders.map(o => 
      o.id === orderId ? { ...o, status } : o
    );
    this.persist();
  }

  public addSavedAddress(address: Omit<SavedAddress, 'id'>) {
    const newAddr: SavedAddress = {
      ...address,
      id: `addr-${Date.now().toString().slice(-3)}`,
    };
    this.state.savedAddresses.push(newAddr);
    this.persist();
    return newAddr;
  }

  // --- Expert Portal Methods ---
  public requestAdditionalExpertInfo(caseId: string, requestText: string) {
    this.state.expertReviews = this.state.expertReviews.map(c => 
      c.id === caseId 
        ? { ...c, status: 'In Progress', additionalInfoRequested: requestText } 
        : c
    );
    this.addNotification({
      recipientRole: 'farmer',
      title: 'Expert Requested Additional Details',
      message: `Chief Agronomist has requested more photos/observations for your case ${caseId}.`,
      type: 'expert',
      link: 'ai-assistant',
    });
    this.persist();
  }

  public addExpertComment(caseId: string, comments: string) {
    this.state.expertReviews = this.state.expertReviews.map(c => 
      c.id === caseId 
        ? { ...c, expertComments: comments } 
        : c
    );
    this.persist();
  }

  public submitExpertRecommendation(farmerId: string, farmerName: string, cropName: string, recommendation: string) {
    const newCase: ExpertReviewCase = {
      id: `EXP-REC-${Date.now().toString().slice(-4)}`,
      farmerId,
      farmerName,
      farmerPhone: '+91 94220 54321',
      cropName,
      question: `Proactive seasonal guidance for ${cropName}`,
      aiSuggestedAnswer: 'Automated seasonal agronomic advisory.',
      confidenceScore: 99,
      status: 'Resolved',
      assignedExpertName: this.state.currentUser.name,
      expertResponse: recommendation,
      createdAt: new Date().toISOString(),
      resolvedAt: new Date().toISOString(),
    };
    this.state.expertReviews.unshift(newCase);
    this.addNotification({
      recipientRole: 'farmer',
      recipientId: farmerId,
      title: `Official Expert Recommendation: ${cropName}`,
      message: recommendation,
      type: 'expert',
      link: 'expert-support',
    });
    this.persist();
    return newCase;
  }

  // --- Warehouse Operations Methods ---
  public registerInboundHarvestBatch(batch: {
    cropName: string;
    farmerName: string;
    farmerId: string;
    farmId: string;
    harvestQuantity: number;
    unit: 'kg' | 'quintals';
    expectedGrade: 'Grade A Premium' | 'Grade A' | 'Grade B';
    storageRequirements: string;
    assignedWarehouseId: string;
  }) {
    const newBatch: HarvestBatch = {
      id: `BAT-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
      ...batch,
      harvestDate: new Date().toISOString().split('T')[0],
      photos: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'],
      status: 'Under Inspection',
    };
    this.state.harvestBatches.unshift(newBatch);

    // Record movement
    this.recordInventoryMovement({
      batchId: newBatch.id,
      productName: newBatch.cropName,
      movementType: 'Inbound Ingest',
      quantityKg: batch.unit === 'quintals' ? batch.harvestQuantity * 100 : batch.harvestQuantity,
      fromLocation: 'Farm Gate / Transport Reefer',
      toLocation: 'Receiving Dock & Inspection Staging',
      staffName: this.state.currentUser.name,
    });

    this.addNotification({
      recipientRole: 'warehouse_staff',
      title: 'New Harvest Produce Received',
      message: `${batch.harvestQuantity} ${batch.unit} of ${batch.cropName} from ${batch.farmerName} arrived at dock.`,
      type: 'alert',
      link: 'incoming',
    });

    this.persist();
    return newBatch;
  }

  public assignStorageLocation(inventoryId: string, location: string, staffName: string = 'Staff') {
    let batchId = '';
    let productName = '';
    let qty = 0;
    let oldLocation = 'Dock Staging';

    this.state.inventory = this.state.inventory.map(item => {
      if (item.id === inventoryId) {
        batchId = item.batchId;
        productName = item.productName;
        qty = item.availableQuantityKg;
        oldLocation = item.storageLocation || 'Dock Staging';
        return { ...item, storageLocation: location, lastUpdated: new Date().toISOString() };
      }
      return item;
    });

    if (batchId) {
      this.recordInventoryMovement({
        batchId,
        productName,
        movementType: 'Storage Relocation',
        quantityKg: qty,
        fromLocation: oldLocation,
        toLocation: location,
        staffName,
      });
    }

    this.persist();
  }

  public recordInventoryMovement(record: Omit<InventoryMovementRecord, 'id' | 'timestamp'>) {
    const newRecord: InventoryMovementRecord = {
      ...record,
      id: `mov-${Date.now()}-${Math.floor(Math.random() * 100)}`,
      timestamp: new Date().toISOString(),
    };
    this.state.inventoryMovements.unshift(newRecord);
    this.persist();
    return newRecord;
  }

  public advanceWarehouseWorkflow(orderId: string, nextStatus: 'Processing' | 'Packed' | 'Dispatched', staffName: string = 'Warehouse Staff') {
    const order = this.state.b2bOrders.find(o => o.id === orderId);
    if (!order) return;

    if (nextStatus === 'Processing') {
      this.updateB2BOrderStatus(orderId, 'Processing');
      this.recordInventoryMovement({
        batchId: order.items[0]?.batchId || 'BATCH',
        productName: order.items[0]?.productName || 'Order Items',
        movementType: 'Order Allocation',
        quantityKg: order.items.reduce((s, i) => s + i.quantityKg, 0),
        fromLocation: 'Cold Bay Racks',
        toLocation: 'Picking Lane 2',
        staffName,
      });
    } else if (nextStatus === 'Packed') {
      this.updateB2BOrderStatus(orderId, 'Packed');
      this.recordInventoryMovement({
        batchId: order.items[0]?.batchId || 'BATCH',
        productName: order.items[0]?.productName || 'Order Items',
        movementType: 'Pick & Pack',
        quantityKg: order.items.reduce((s, i) => s + i.quantityKg, 0),
        fromLocation: 'Picking Lane 2',
        toLocation: `Staging Dock Bay 4 (${orderId})`,
        staffName,
      });
      this.addNotification({
        recipientRole: 'delivery_partner',
        title: 'New Order Packed & Ready for Pickup',
        message: `${orderId} for ${order.buyerName} (${order.totalAmount.toLocaleString()} INR) is packed in Staging Bay 4.`,
        type: 'order',
        link: 'assigned-orders',
      });
    } else if (nextStatus === 'Dispatched') {
      this.updateB2BOrderStatus(orderId, 'Dispatched', {
        dispatchTimestamp: new Date().toISOString(),
        deliveryPartnerName: 'ColdChain Express (Fleet Unit MH-04-AZ-9981)'
      });
      this.recordInventoryMovement({
        batchId: order.items[0]?.batchId || 'BATCH',
        productName: order.items[0]?.productName || 'Order Items',
        movementType: 'Dispatch',
        quantityKg: order.items.reduce((s, i) => s + i.quantityKg, 0),
        fromLocation: 'Staging Dock Bay 4',
        toLocation: 'Reefer Truck MH-04-AZ-9981',
        staffName,
      });
      this.addNotification({
        recipientRole: 'buyer',
        recipientId: order.buyerId,
        title: 'Your Order Has Been Dispatched',
        message: `Order ${orderId} is en route in temperature-controlled reefer fleet.`,
        type: 'order',
        link: 'orders',
      });
    }
    this.persist();
  }

  // --- Delivery Partner Methods ---
  public updatePickupStatus(orderId: string, status: 'Picked Up') {
    this.state.b2bOrders = this.state.b2bOrders.map(o => 
      o.id === orderId 
        ? { ...o, pickupStatus: status, status: 'Dispatched', dispatchTimestamp: new Date().toISOString() } 
        : o
    );
    this.addNotification({
      recipientRole: 'warehouse_staff',
      title: 'Order Picked Up by Driver',
      message: `Driver picked up order ${orderId} from dispatch dock.`,
      type: 'order',
    });
    this.persist();
  }

  public reportDeliveryIssue(orderId: string, issueType: string, notes: string) {
    this.state.b2bOrders = this.state.b2bOrders.map(o => 
      o.id === orderId 
        ? { 
            ...o, 
            deliveryIssueReported: { 
              type: issueType, 
              notes, 
              reportedAt: new Date().toISOString() 
            } 
          } 
        : o
    );
    this.addNotification({
      recipientRole: 'operations_admin',
      title: `Logistics Alert: ${issueType} on ${orderId}`,
      message: `Driver reported: ${notes}`,
      type: 'alert',
      link: 'delivery_coord',
    });
    this.persist();
  }

  public submitProofOfDelivery(orderId: string, receiverName: string, proofNotes: string, photoUrl: string = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80') {
    this.state.b2bOrders = this.state.b2bOrders.map(o => 
      o.id === orderId 
        ? { 
            ...o, 
            status: 'Delivered', 
            deliveryTimestamp: new Date().toISOString(),
            receiverName,
            proofOfDeliveryNotes: proofNotes,
            proofOfDeliveryUrl: photoUrl 
          } 
        : o
    );
    const order = this.state.b2bOrders.find(o => o.id === orderId);
    if (order) {
      this.addNotification({
        recipientRole: 'buyer',
        recipientId: order.buyerId,
        title: `Order ${orderId} Delivered Successfully`,
        message: `Produce delivered to ${receiverName}. Inspection sign-off completed.`,
        type: 'order',
        link: 'orders',
      });
      this.addNotification({
        recipientRole: 'super_admin',
        title: `B2B Order ${orderId} Completed`,
        message: `Delivered to ${order.buyerName} (₹${order.totalAmount.toLocaleString()}). Ready for invoice reconciliation.`,
        type: 'order',
        link: 'orders',
      });
    }
    this.persist();
  }

  // =========================================================================
  // CENTRAL AUTHORIZED WORKFLOWS (ADMIN AUTHORITY + FARMER SUBMISSIONS)
  // =========================================================================

  private isAdminUser(role: UserRole = this.state.currentUser.role): boolean {
    return role === 'super_admin' || role === 'operations_admin';
  }

  private assertAdmin(actionLabel: string) {
    if (!this.isAdminUser()) {
      throw new Error(`Forbidden: Only authorized Admin users can ${actionLabel}.`);
    }
  }

  public recordAuditLog(entry: Omit<AuditLogEntry, 'id' | 'createdAt' | 'actorName' | 'actorRole' | 'userId'>) {
    const log: AuditLogEntry = {
      ...entry,
      id: `AUD-${Date.now().toString().slice(-5)}`,
      userId: this.state.currentUser.id,
      actorName: this.state.currentUser.name,
      actorRole: this.state.currentUser.role,
      createdAt: new Date().toISOString(),
    };
    this.state.auditLogs.unshift(log);
  }

  // --- ADMIN-ONLY PRODUCT CATALOGUE MANAGEMENT (WORKFLOW 1 & 4) ---
  public adminCreateProduct(input: Omit<ProductListing, 'id' | 'updatedAt'>): ProductListing {
    this.assertAdmin('create live catalogue products');
    const newProduct: ProductListing = {
      ...input,
      id: `prd-${Date.now().toString().slice(-5)}`,
      sellingPrice: input.sellingPrice ?? input.price,
      approvalStatus: input.approvalStatus ?? 'approved',
      isPublished: input.isPublished ?? true,
      isActive: input.isActive ?? true,
      lowStockThreshold: input.lowStockThreshold ?? this.state.platformSettings.lowStockThresholdKg,
      updatedAt: new Date().toISOString(),
    };
    this.state.products.unshift(newProduct);
    this.recordAuditLog({
      action: 'ADMIN_PRODUCT_CREATED',
      entityType: 'products',
      entityId: newProduct.id,
      summary: `Created live product "${newProduct.name}" at ₹${newProduct.price}/${newProduct.unit}`,
      newValues: { name: newProduct.name, price: newProduct.price, stock: newProduct.availableQuantity },
    });
    this.persist();
    return newProduct;
  }

  public adminUpdateProduct(productId: string, updates: Partial<ProductListing>): ProductListing | null {
    this.assertAdmin('edit live catalogue products');
    const existing = this.state.products.find(p => p.id === productId);
    if (!existing) return null;

    const oldPrice = existing.price;
    const nextPrice = updates.price ?? existing.price;

    const updated: ProductListing = {
      ...existing,
      ...updates,
      sellingPrice: updates.sellingPrice ?? nextPrice,
      updatedAt: new Date().toISOString(),
    };

    this.state.products = this.state.products.map(p => (p.id === productId ? updated : p));

    this.recordAuditLog({
      action: oldPrice !== nextPrice ? 'ADMIN_PRODUCT_PRICE_CHANGED' : 'ADMIN_PRODUCT_UPDATED',
      entityType: 'products',
      entityId: productId,
      summary:
        oldPrice !== nextPrice
          ? `Price updated for "${updated.name}": ₹${oldPrice} → ₹${nextPrice}`
          : `Updated product details for "${updated.name}"`,
      oldValues: { price: oldPrice, name: existing.name, availableQuantity: existing.availableQuantity, isPublished: existing.isPublished },
      newValues: { price: nextPrice, name: updated.name, availableQuantity: updated.availableQuantity, isPublished: updated.isPublished },
    });

    this.persist();
    return updated;
  }

  public adminToggleProductPublish(productId: string) {
    this.assertAdmin('publish or unpublish products');
    const existing = this.state.products.find(p => p.id === productId);
    if (!existing) return;
    const nextPublished = !(existing.isPublished ?? true);
    this.adminUpdateProduct(productId, {
      isPublished: nextPublished,
      isActive: nextPublished,
      approvalStatus: nextPublished ? 'approved' : 'draft',
    });
  }

  public adminDeleteProduct(productId: string) {
    this.assertAdmin('delete catalogue products');
    const existing = this.state.products.find(p => p.id === productId);
    if (!existing) return;
    this.state.products = this.state.products.filter(p => p.id !== productId);
    this.state.cart = this.state.cart.filter(i => i.product.id !== productId);
    this.recordAuditLog({
      action: 'ADMIN_PRODUCT_DELETED',
      entityType: 'products',
      entityId: productId,
      summary: `Removed product "${existing.name}" from catalogue`,
      oldValues: { name: existing.name, price: existing.price },
    });
    this.persist();
  }

  // --- ADMIN-ONLY CATEGORY MANAGEMENT ---
  public adminSaveCategory(category: Omit<ProductCategory, 'id' | 'createdAt' | 'slug'> & { id?: string }): ProductCategory {
    this.assertAdmin('manage product categories');
    const slug = category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (category.id) {
      let updatedCat!: ProductCategory;
      this.state.categories = this.state.categories.map(c => {
        if (c.id === category.id) {
          updatedCat = { ...c, ...category, slug };
          return updatedCat;
        }
        return c;
      });
      this.recordAuditLog({
        action: 'ADMIN_CATEGORY_UPDATED',
        entityType: 'product_categories',
        entityId: category.id,
        summary: `Updated category "${category.name}"`,
      });
      this.persist();
      return updatedCat;
    }
    const created: ProductCategory = {
      ...category,
      id: `cat-${Date.now().toString().slice(-4)}`,
      slug,
      createdAt: new Date().toISOString(),
    };
    this.state.categories.push(created);
    this.recordAuditLog({
      action: 'ADMIN_CATEGORY_CREATED',
      entityType: 'product_categories',
      entityId: created.id,
      summary: `Created product category "${created.name}"`,
    });
    this.persist();
    return created;
  }

  public adminToggleCategory(categoryId: string) {
    this.assertAdmin('toggle product categories');
    this.state.categories = this.state.categories.map(c =>
      c.id === categoryId ? { ...c, isActive: !c.isActive } : c
    );
    this.persist();
  }

  // --- WORKFLOW 1: FARMER PRODUCT SUBMISSION -> ADMIN APPROVAL -> LIVE CATALOGUE ---
  public farmerSubmitProduct(
    submission: Omit<FarmerProductSubmission, 'id' | 'status' | 'createdAt'>
  ): FarmerProductSubmission {
    if (this.state.currentUser.role !== 'farmer' && !this.isAdminUser()) {
      throw new Error('Only registered farmers can submit agricultural products for review.');
    }
    const created: FarmerProductSubmission = {
      ...submission,
      id: `sub-prd-${Date.now().toString().slice(-5)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.state.productSubmissions.unshift(created);
    this.addNotification({
      recipientRole: 'super_admin',
      title: `New Farmer Submission: ${created.productName}`,
      message: `${created.farmerName} submitted ${created.submissionType.replace('_', ' ')} (${created.proposedQuantity} ${created.unit} @ ₹${created.proposedPrice}). Awaiting Admin approval.`,
      type: 'alert',
      link: 'products',
    });
    this.recordAuditLog({
      action: 'FARMER_PRODUCT_SUBMITTED',
      entityType: 'farmer_product_submissions',
      entityId: created.id,
      summary: `Farmer ${created.farmerName} submitted "${created.productName}" for Admin approval`,
    });
    this.persist();
    return created;
  }

  public adminReviewProductSubmission(
    submissionId: string,
    decision: 'approved' | 'rejected' | 'under_review',
    options?: {
      adminNotes?: string;
      overridePrice?: number;
      overrideQuantity?: number;
      overrideName?: string;
      overrideDescription?: string;
    }
  ): FarmerProductSubmission | null {
    this.assertAdmin('approve or reject farmer product submissions');
    const sub = this.state.productSubmissions.find(s => s.id === submissionId);
    if (!sub) return null;

    const finalPrice = options?.overridePrice ?? sub.proposedPrice;
    const finalQty = options?.overrideQuantity ?? sub.proposedQuantity;
    const finalName = options?.overrideName?.trim() || sub.productName;
    const finalDesc = options?.overrideDescription?.trim() || sub.description;
    let createdOrUpdatedProductId = sub.createdProductId;

    if (decision === 'approved') {
      const farmer = this.state.farmers.find(f => f.id === sub.farmerId);
      const farm = this.state.farms.find(f => f.farmerId === sub.farmerId);
      if (sub.targetProductId) {
        const existingProd = this.state.products.find(p => p.id === sub.targetProductId);
        if (existingProd) {
          this.adminUpdateProduct(existingProd.id, {
            name: finalName,
            description: finalDesc,
            price: finalPrice,
            sellingPrice: finalPrice,
            availableQuantity:
              sub.submissionType === 'stock_update'
                ? existingProd.availableQuantity + finalQty
                : finalQty,
            isPublished: true,
            isActive: true,
            approvalStatus: 'approved',
          });
          createdOrUpdatedProductId = existingProd.id;
        }
      } else {
        const liveProduct = this.adminCreateProduct({
          name: finalName,
          category: sub.category,
          price: finalPrice,
          sellingPrice: finalPrice,
          unit: sub.unit,
          availableQuantity: finalQty,
          farmerId: sub.farmerId,
          farmerName: sub.farmerName,
          farmerLocation: farmer ? `${farmer.village}, ${farmer.district}, ${farmer.state}` : 'India',
          farmName: farm?.farmName || 'Verified Pure Krishi Partner Farm',
          harvestBatchId: `BAT-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
          verificationBadge: sub.organicCertified ? 'NPOP Organic Certified' : 'Residue-Free Verified',
          imageUrl: sub.images[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
          description: finalDesc || `Fresh ${finalName} harvested by ${sub.farmerName}.`,
          nutritionalBenefits: ['Farm-Direct Verified', 'Admin Quality Approved', 'Zero Synthetic Residue'],
          approvalStatus: 'approved',
          isPublished: true,
          isActive: true,
        });
        createdOrUpdatedProductId = liveProduct.id;
      }
    }

    const updatedSub: FarmerProductSubmission = {
      ...sub,
      status: decision,
      adminNotes: options?.adminNotes,
      reviewedBy: this.state.currentUser.name,
      reviewedAt: new Date().toISOString(),
      createdProductId: createdOrUpdatedProductId,
    };

    this.state.productSubmissions = this.state.productSubmissions.map(s =>
      s.id === submissionId ? updatedSub : s
    );

    this.addNotification({
      recipientRole: 'farmer',
      recipientId: sub.farmerId,
      title: `Product Submission ${decision === 'approved' ? 'Approved & Live' : decision.toUpperCase()}`,
      message:
        decision === 'approved'
          ? `Admin approved "${finalName}" at ₹${finalPrice}/${sub.unit}. It is now visible to customers.`
          : `Admin reviewed "${finalName}": ${options?.adminNotes || decision}`,
      type: 'alert',
      link: 'submit',
    });

    this.recordAuditLog({
      action: `ADMIN_SUBMISSION_${decision.toUpperCase()}`,
      entityType: 'farmer_product_submissions',
      entityId: submissionId,
      summary: `Admin ${decision} farmer submission "${finalName}" from ${sub.farmerName}`,
      newValues: { decision, finalPrice, finalQty, productId: createdOrUpdatedProductId },
    });

    this.persist();
    return updatedSub;
  }

  // --- WORKFLOW 3: FARMER STOCK SUBMISSION -> ADMIN APPROVAL -> INVENTORY SYNC ---
  public farmerSubmitStockUpdate(
    submission: Omit<StockSubmission, 'id' | 'status' | 'createdAt'>
  ): StockSubmission {
    if (this.state.currentUser.role !== 'farmer' && !this.isAdminUser()) {
      throw new Error('Only registered farmers can submit stock updates.');
    }
    const created: StockSubmission = {
      ...submission,
      id: `sub-stk-${Date.now().toString().slice(-5)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.state.stockSubmissions.unshift(created);
    this.addNotification({
      recipientRole: 'super_admin',
      title: `Stock Update Submitted: ${created.productName}`,
      message: `${created.farmerName} submitted +${created.submittedQuantity} ${created.unit} for inventory approval.`,
      type: 'alert',
      link: 'warehouse',
    });
    this.recordAuditLog({
      action: 'FARMER_STOCK_SUBMITTED',
      entityType: 'stock_submissions',
      entityId: created.id,
      summary: `Farmer ${created.farmerName} submitted +${created.submittedQuantity} ${created.unit} of ${created.productName}`,
    });
    this.persist();
    return created;
  }

  public adminReviewStockSubmission(
    submissionId: string,
    decision: 'approved' | 'rejected',
    adminNotes?: string
  ): StockSubmission | null {
    this.assertAdmin('approve or reject stock updates');
    const sub = this.state.stockSubmissions.find(s => s.id === submissionId);
    if (!sub || sub.status !== 'pending') return null;

    if (decision === 'approved') {
      // Update matching live product stock
      this.state.products = this.state.products.map(p => {
        const matches =
          (sub.productId && p.id === sub.productId) ||
          p.name.toLowerCase().includes(sub.productName.toLowerCase());
        if (matches) {
          return {
            ...p,
            availableQuantity: p.availableQuantity + sub.submittedQuantity,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });

      // Update warehouse inventory or insert new batch entry
      const wh = this.state.warehouses.find(w => w.id === sub.warehouseId) || this.state.warehouses[0];
      const existingInv = this.state.inventory.find(
        i => i.productName.toLowerCase() === sub.productName.toLowerCase() && i.farmerName === sub.farmerName
      );
      if (existingInv) {
        existingInv.availableQuantityKg += sub.submittedQuantity;
        existingInv.lastUpdated = new Date().toISOString();
      } else if (wh) {
        this.state.inventory.unshift({
          id: `inv-${Date.now().toString().slice(-4)}`,
          warehouseId: wh.id,
          warehouseName: wh.name,
          productName: sub.productName,
          category: 'Vegetables',
          batchId: sub.harvestBatchId || `BAT-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
          farmerName: sub.farmerName,
          grade: sub.expectedGrade || 'Grade A Premium',
          availableQuantityKg: sub.submittedQuantity,
          reservedQuantityKg: 0,
          unitPrice: 45,
          expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          lastUpdated: new Date().toISOString(),
        });
      }

      if (wh) {
        this.recordInventoryMovement({
          batchId: sub.harvestBatchId || sub.id,
          productName: sub.productName,
          movementType: 'Inbound Ingest',
          quantityKg: sub.submittedQuantity,
          fromLocation: `Farmer ${sub.farmerName}`,
          toLocation: wh.name,
          staffName: this.state.currentUser.name,
        });
      }
    }

    const updated: StockSubmission = {
      ...sub,
      status: decision,
      adminNotes,
      reviewedBy: this.state.currentUser.name,
      reviewedAt: new Date().toISOString(),
    };
    this.state.stockSubmissions = this.state.stockSubmissions.map(s =>
      s.id === submissionId ? updated : s
    );

    this.addNotification({
      recipientRole: 'farmer',
      recipientId: sub.farmerId,
      title: `Stock Submission ${decision === 'approved' ? 'Approved' : 'Rejected'}`,
      message: `${sub.submittedQuantity} ${sub.unit} of ${sub.productName} was ${decision} by Admin.`,
      type: 'alert',
      link: 'stock',
    });

    this.recordAuditLog({
      action: `ADMIN_STOCK_${decision.toUpperCase()}`,
      entityType: 'stock_submissions',
      entityId: submissionId,
      summary: `Admin ${decision} stock update +${sub.submittedQuantity} ${sub.unit} for ${sub.productName}`,
      newValues: { decision, quantity: sub.submittedQuantity },
    });

    this.persist();
    return updated;
  }

  public adminAdjustInventoryStock(inventoryId: string, newAvailableKg: number, reason: string) {
    this.assertAdmin('adjust warehouse inventory');
    const item = this.state.inventory.find(i => i.id === inventoryId);
    if (!item) return;
    const oldQty = item.availableQuantityKg;
    item.availableQuantityKg = Math.max(0, newAvailableKg);
    item.lastUpdated = new Date().toISOString();

    this.recordInventoryMovement({
      batchId: item.batchId,
      productName: item.productName,
      movementType: 'Storage Relocation',
      quantityKg: Math.abs(newAvailableKg - oldQty),
      fromLocation: `${oldQty} kg`,
      toLocation: `${newAvailableKg} kg (${reason})`,
      staffName: this.state.currentUser.name,
    });

    this.recordAuditLog({
      action: 'ADMIN_INVENTORY_ADJUSTED',
      entityType: 'warehouse_inventory',
      entityId: inventoryId,
      summary: `Adjusted ${item.productName} stock from ${oldQty} kg to ${newAvailableKg} kg (${reason})`,
      oldValues: { availableQuantityKg: oldQty },
      newValues: { availableQuantityKg: newAvailableKg, reason },
    });
    this.persist();
  }

  // --- WORKFLOW 2: ADMIN ORDER & DELIVERY COORDINATION ---
  public adminUpdateCustomerOrder(
    orderId: string,
    updates: Partial<Pick<CustomerOrder, 'status' | 'assignedWarehouseId' | 'assignedFarmerName' | 'deliveryPartnerName' | 'trackingNotes'>>
  ) {
    this.assertAdmin('update customer order status or fulfilment assignment');
    const existing = this.state.customerOrders.find(o => o.id === orderId);
    if (!existing) return;

    const updated: CustomerOrder = { ...existing, ...updates };
    this.state.customerOrders = this.state.customerOrders.map(o => (o.id === orderId ? updated : o));

    // Sync delivery record status
    const mappedDelStatus: DeliveryRecord['status'] =
      updated.status === 'Delivered'
        ? 'Delivered'
        : updated.status === 'Out for Delivery'
        ? 'Out for Delivery'
        : updated.status === 'Dispatched'
        ? 'In Transit'
        : 'Assigned';

    this.state.deliveries = this.state.deliveries.map(d =>
      d.orderId === orderId
        ? {
            ...d,
            driverName: updated.deliveryPartnerName || d.driverName,
            status: mappedDelStatus,
            currentLocation: updated.trackingNotes || d.currentLocation,
            updatedAt: new Date().toISOString(),
          }
        : d
    );

    this.addNotification({
      recipientRole: 'customer',
      recipientId: updated.customerId,
      title: `Order ${orderId} Update: ${updated.status}`,
      message: updated.trackingNotes || `Your order status is now "${updated.status}".`,
      type: 'order',
      link: 'orders',
    });

    this.recordAuditLog({
      action: 'ADMIN_ORDER_UPDATED',
      entityType: 'customer_orders',
      entityId: orderId,
      summary: `Order ${orderId} updated to status "${updated.status}"`,
      oldValues: { status: existing.status },
      newValues: updates as Record<string, unknown>,
    });

    this.persist();
  }

  public adminUpdateDeliveryStatus(deliveryId: string, status: DeliveryRecord['status'], driverName?: string, vehicleNumber?: string, currentLocation?: string) {
    this.assertAdmin('manage delivery operations');
    let linkedOrderId = '';
    let linkedType: 'B2C' | 'B2B' = 'B2C';
    this.state.deliveries = this.state.deliveries.map(d => {
      if (d.id === deliveryId) {
        linkedOrderId = d.orderId;
        linkedType = d.orderType;
        return {
          ...d,
          status,
          driverName: driverName ?? d.driverName,
          vehicleNumber: vehicleNumber ?? d.vehicleNumber,
          currentLocation: currentLocation ?? d.currentLocation,
          updatedAt: new Date().toISOString(),
        };
      }
      return d;
    });

    if (linkedOrderId && linkedType === 'B2C') {
      const orderStatus: CustomerOrder['status'] =
        status === 'Delivered'
          ? 'Delivered'
          : status === 'Out for Delivery'
          ? 'Out for Delivery'
          : status === 'In Transit'
          ? 'Dispatched'
          : 'Packed';
      this.state.customerOrders = this.state.customerOrders.map(o =>
        o.id === linkedOrderId ? { ...o, status: orderStatus, deliveryPartnerName: driverName || o.deliveryPartnerName } : o
      );
    }

    this.recordAuditLog({
      action: 'ADMIN_DELIVERY_UPDATED',
      entityType: 'deliveries',
      entityId: deliveryId,
      summary: `Delivery ${deliveryId} (${linkedOrderId}) marked ${status}`,
    });
    this.persist();
  }

  // --- ADMIN: CUSTOMER, WAREHOUSE, EMPLOYEE, SETTINGS MANAGEMENT ---
  public adminToggleCustomerStatus(customerId: string) {
    this.assertAdmin('manage customer account status');
    this.state.customerAccounts = this.state.customerAccounts.map(c =>
      c.id === customerId ? { ...c, status: c.status === 'active' ? 'suspended' : 'active' } : c
    );
    this.recordAuditLog({
      action: 'ADMIN_CUSTOMER_STATUS_TOGGLED',
      entityType: 'customer_accounts',
      entityId: customerId,
      summary: `Toggled customer account status for ${customerId}`,
    });
    this.persist();
  }

  public adminAddWarehouse(wh: Omit<Warehouse, 'id'>): Warehouse {
    this.assertAdmin('add warehouse facility');
    const created: Warehouse = { ...wh, id: `wh-${Date.now().toString().slice(-4)}` };
    this.state.warehouses.push(created);
    this.recordAuditLog({
      action: 'ADMIN_WAREHOUSE_ADDED',
      entityType: 'warehouses',
      entityId: created.id,
      summary: `Added Agro-Hub warehouse "${created.name}" (${created.city})`,
    });
    this.persist();
    return created;
  }

  public adminAddEmployee(emp: Omit<EmployeeRecord, 'id'>): EmployeeRecord {
    this.assertAdmin('manage employees');
    const created: EmployeeRecord = { ...emp, id: `emp-${Date.now().toString().slice(-4)}` };
    this.state.employees.unshift(created);
    this.recordAuditLog({
      action: 'ADMIN_EMPLOYEE_ADDED',
      entityType: 'employees',
      entityId: created.id,
      summary: `Added employee ${created.fullName} (${created.roleTitle})`,
    });
    this.persist();
    return created;
  }

  public adminUpdateEmployeeStatus(employeeId: string, status: EmployeeRecord['status']) {
    this.assertAdmin('update employee status');
    this.state.employees = this.state.employees.map(e => (e.id === employeeId ? { ...e, status } : e));
    this.persist();
  }

  public adminUpdateSettings(settings: Partial<PlatformSettings>) {
    this.assertAdmin('update platform settings');
    this.state.platformSettings = { ...this.state.platformSettings, ...settings };
    this.recordAuditLog({
      action: 'ADMIN_SETTINGS_UPDATED',
      entityType: 'platform_settings',
      entityId: 'global',
      summary: 'Updated platform configuration settings',
      newValues: settings as Record<string, unknown>,
    });
    this.persist();
  }

  public hydrateFromRemote(partial: Partial<AppState>) {
    this.state = {
      ...this.state,
      ...partial,
      products: partial.products ? normalizeProducts(partial.products) : this.state.products,
    };
    this.persist();
  }
}

export const store = new StoreManager();
