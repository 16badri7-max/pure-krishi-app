import { 
  UserProfile, 
  UserRole, 
  Buyer, 
  BuyerRequirement, 
  BuyerRequirementItem, 
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
  InventoryMovementRecord
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
          quotations: parsed.quotations || INITIAL_QUOTATIONS,
          notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
          farmerExpenses: parsed.farmerExpenses || INITIAL_FARMER_EXPENSES,
          savedAddresses: parsed.savedAddresses || INITIAL_SAVED_ADDRESSES,
          inventoryMovements: parsed.inventoryMovements || INITIAL_INVENTORY_MOVEMENTS,
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
      products: INITIAL_B2C_PRODUCTS,
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
          const status = currentAlloc >= item.requiredQuantity ? 'Sourced' : 'Partially Sourced';
          return { ...item, allocatedFarmerQuantity: currentAlloc, status: status as any };
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
    if (product.isLockedForCustomers) {
      console.warn(`Product ${product.name} is locked for B2B procurement and cannot be added to retail cart.`);
      return;
    }
    const existing = this.state.cart.find(item => item.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.state.cart.push({ product, quantity });
    }
    this.persist();
  }

  public updateCartQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.state.cart = this.state.cart.filter(item => item.product.id !== productId);
    } else {
      const item = this.state.cart.find(i => i.product.id === productId);
      if (item) item.quantity = quantity;
    }
    this.persist();
  }

  public clearCart() {
    this.state.cart = [];
    this.persist();
  }

  public checkoutCustomerOrder(shippingAddress: string, customerPhone: string): CustomerOrder {
    const subtotal = this.state.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const deliveryFee = 40;
    const total = subtotal + deliveryFee;

    const newOrder: CustomerOrder = {
      id: `ORD-CUST-${Date.now().toString().slice(-4)}`,
      customerId: this.state.currentUser.id,
      customerName: this.state.currentUser.name,
      customerPhone,
      shippingAddress,
      items: [...this.state.cart],
      subtotal,
      deliveryFee,
      totalAmount: total,
      status: 'Order Placed',
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    this.state.customerOrders.unshift(newOrder);
    this.state.cart = [];
    
    // Update financials
    this.state.financials.totalCustomerSales += total;
    this.state.financials.grossRevenue += total;

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
}

export const store = new StoreManager();
