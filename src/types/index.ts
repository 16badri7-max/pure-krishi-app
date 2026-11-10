export type UserRole = 
  | 'super_admin'
  | 'operations_admin'
  | 'buyer'
  | 'farmer'
  | 'expert'
  | 'warehouse_staff'
  | 'delivery_partner'
  | 'customer';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  organization?: string;
  location?: string;
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
}

export type BuyerType = 
  | 'Supermarkets'
  | 'Organic Stores'
  | 'Retail Shops'
  | 'Hotels'
  | 'Restaurants'
  | 'Distributors'
  | 'Institutional Buyers';

export type ProcurementStage = 
  | 'Lead Identified'
  | 'Contacted'
  | 'Meeting Scheduled'
  | 'Requirements Collected'
  | 'Quotation Submitted'
  | 'Negotiation'
  | 'Trial Order'
  | 'Agreement Signed'
  | 'Active Buyer'
  | 'Supply in Progress';

export interface Buyer {
  id: string;
  businessName: string;
  buyerType: BuyerType;
  contactPerson: string;
  procurementManager: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  gstNumber?: string;
  preferredCommunication: 'Email' | 'Phone' | 'WhatsApp';
  stage: ProcurementStage;
  totalRequirementsCount: number;
  activeAgreementsCount: number;
  totalPurchaseValue: number;
  createdAt: string;
}

export interface BuyerRequirementItem {
  id: string;
  productName: string;
  category: 'Vegetables' | 'Fruits' | 'Grains' | 'Pulses' | 'Spices';
  requiredQuantity: number;
  unit: 'kg' | 'tonnes' | 'quintals' | 'crates';
  frequency: 'Daily' | 'Weekly' | 'Bi-Weekly' | 'Monthly' | 'One-Time';
  expectedPriceRange: string; // e.g., "₹35 - ₹42 / kg"
  qualityGrade: 'Grade A Premium' | 'Grade A' | 'Grade B Standard' | 'Export Quality';
  organicRequirement: '100% Certified Organic' | 'Naturally Grown / Zero Chemical' | 'Pesticide Free' | 'Conventional Allowed';
  packaging: 'Crates' | 'Eco-friendly Pouches' | 'Jute Bags' | 'Vacuum Packed' | 'Bulk Boxes';
  requiredDeliveryDate: string;
  allocatedFarmerQuantity?: number;
  status: 'Pending' | 'Sourced' | 'Partially Sourced' | 'Fulfilled';
}

export interface BuyerRequirement {
  id: string;
  buyerId: string;
  buyerName: string;
  deliveryLocation: string;
  items: BuyerRequirementItem[];
  additionalInstructions?: string;
  submittedAt: string;
  status: 'Submitted' | 'Under Review' | 'Quoted' | 'Farmer Matched' | 'Fulfilled';
}

export interface SupplyAgreement {
  id: string;
  buyerId: string;
  buyerName: string;
  productsSummary: string;
  agreedQuantityMonthly: number;
  unit: string;
  estimatedValueMonthly: number;
  deliveryFrequency: string;
  qualityStandard: string;
  startDate: string;
  endDate: string;
  paymentTerms: 'Net 7 Days' | 'Net 15 Days' | 'Net 30 Days' | 'Advance 50%' | 'Immediate on Delivery';
  deliveryLocation: string;
  status: 'Draft' | 'Sent for Review' | 'Authorized & Signed' | 'Active' | 'Completed' | 'Terminated';
  documentUrl?: string;
  signedByAdmin?: string;
  signedAt?: string;
}

export interface Farm {
  id: string;
  farmerId: string;
  farmName: string;
  village: string;
  district: string;
  state: string;
  totalLandAreaAcres: number;
  cultivatedAreaAcres: number;
  ownershipType: 'Owned' | 'Leased' | 'Cooperative Member';
  waterSource: 'Borewell' | 'Canal Irrigation' | 'River' | 'Rainfed' | 'Drip Micro-irrigation';
  farmingPractice: 'Certified Organic' | 'Natural Farming (ZBNF)' | 'Pesticide Free' | 'Regenerative Agriculture';
  soilType: 'Black Cotton Soil' | 'Red Sandy Loam' | 'Alluvial Soil' | 'Clay Loam';
  soilPh?: number;
  organicCarbonPercentage?: number;
  verificationStatus: 'Verified by Pure Krishi' | 'Inspection Scheduled' | 'Pending Verification';
  latitude: number;
  longitude: number;
  photos: string[];
}

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  email: string;
  village: string;
  district: string;
  state: string;
  totalAcres: number;
  farmingPractices: string;
  mainCrops: string[];
  totalEarnings: number;
  pendingPayment: number;
  farms: Farm[];
  createdAt: string;
}

export interface CropRecord {
  id: string;
  farmId: string;
  farmerId: string;
  farmerName: string;
  cropName: string;
  variety: string;
  category: 'Vegetables' | 'Fruits' | 'Grains' | 'Pulses' | 'Spices';
  cultivatedAcres: number;
  sowingDate: string;
  expectedHarvestDate: string;
  expectedYieldKg: number;
  actualHarvestKg?: number;
  growthStage: 'Germination' | 'Vegetative' | 'Flowering' | 'Fruit Formation' | 'Maturity / Ready to Harvest' | 'Harvested';
  allocatedToDemandKg: number;
  surplusKg: number;
  healthStatus: 'Excellent' | 'Good' | 'Attention Needed';
}

export interface CropPlanAllocation {
  id: string;
  requirementItemId: string;
  buyerName: string;
  cropRecordId: string;
  farmerId: string;
  farmerName: string;
  cropName: string;
  allocatedQuantityKg: number;
  targetHarvestDate: string;
  estimatedDeliveryDate: string;
  status: 'Proposed' | 'Confirmed' | 'Cultivation Tracked' | 'Harvested & Dispatched';
}

export interface HarvestBatch {
  id: string;
  farmerId: string;
  farmerName: string;
  farmId: string;
  cropName: string;
  harvestDate: string;
  harvestQuantity: number;
  unit: 'kg' | 'quintals';
  expectedGrade: 'Grade A Premium' | 'Grade A' | 'Grade B';
  storageRequirements: string;
  photos: string[];
  assignedWarehouseId: string;
  status: 'Harvested' | 'Under Inspection' | 'Approved' | 'Rejected' | 'In Warehouse';
  qualityInspectionId?: string;
}

export interface QualityInspection {
  id: string;
  harvestBatchId: string;
  inspectorId: string;
  inspectorName: string;
  inspectedAt: string;
  assignedGrade: 'Grade A Premium' | 'Grade A' | 'Grade B Standard' | 'Rejected';
  brixSugarContent?: number;
  moisturePercentage?: number;
  visualDefectPercentage: number;
  chemicalResidueStatus: 'Zero Detected (Clean Lab)' | 'Within Organic Permissible' | 'Contaminated (Rejected)';
  observations: string;
  photos: string[];
  status: 'Approved' | 'Rejected' | 'Needs Re-inspection';
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  capacityTonnes: number;
  occupiedTonnes: number;
  coldStorageAvailable: boolean;
  contactPerson: string;
  phone: string;
}

export interface InventoryItem {
  id: string;
  warehouseId: string;
  warehouseName: string;
  productName: string;
  category: string;
  batchId: string;
  farmerName: string;
  grade: string;
  availableQuantityKg: number;
  reservedQuantityKg: number;
  unitPrice: number;
  expiryDate: string;
  storageLocation?: string;
  lastUpdated: string;
}

export interface InventoryMovementRecord {
  id: string;
  batchId: string;
  productName: string;
  movementType: 'Inbound Ingest' | 'Storage Relocation' | 'Order Allocation' | 'Pick & Pack' | 'Dispatch';
  quantityKg: number;
  fromLocation: string;
  toLocation: string;
  staffName: string;
  timestamp: string;
}



export type OrderStatus = 
  | 'Requested'
  | 'Quoted'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Dispatched'
  | 'Delivered'
  | 'Completed'
  | 'Cancelled';

export interface B2BOrder {
  id: string;
  buyerId: string;
  buyerName: string;
  orderDate: string;
  deliveryDate: string;
  deliveryAddress: string;
  items: {
    productName: string;
    quantityKg: number;
    unitPrice: number;
    totalPrice: number;
    batchId: string;
  }[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: 'Pending' | 'Paid' | 'Partial' | 'Overdue';
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  dispatchTimestamp?: string;
  deliveryTimestamp?: string;
  proofOfDeliveryUrl?: string;
  proofOfDeliveryNotes?: string;
  receiverName?: string;
  pickupStatus?: 'Pending' | 'Picked Up';
  deliveryIssueReported?: {
    type: string;
    notes: string;
    reportedAt: string;
  };
}

export interface ProductListing {
  id: string;
  name: string;
  category: 'Vegetables' | 'Fruits' | 'Grains' | 'Pulses' | 'Dry fruits' | 'Spices';
  price: number;
  unit: string;
  availableQuantity: number;
  farmerName: string;
  farmerLocation: string;
  farmName: string;
  harvestBatchId: string;
  verificationBadge: string;
  imageUrl: string;
  description: string;
  nutritionalBenefits: string[];
  isLockedForCustomers?: boolean;
  lockedByBuyerName?: string;
  lockedReason?: string;
  lockedAt?: string;
  lockedQuantityKg?: number;
}

export interface CustomerOrderItem {
  product: ProductListing;
  quantity: number;
}

export interface CustomerOrder {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  items: CustomerOrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  status: 'Order Placed' | 'Packed' | 'Out for Delivery' | 'Delivered';
  orderDate: string;
  estimatedDelivery: string;
}

export interface AIMessage {
  id: string;
  sender: 'farmer' | 'ai' | 'expert';
  senderName?: string;
  content: string;
  timestamp: string;
  imageUrl?: string;
  confidenceScore?: number; // 0 to 100
  needsExpertReview?: boolean;
  expertReviewed?: boolean;
}

export interface ExpertReviewCase {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  cropName: string;
  question: string;
  aiSuggestedAnswer: string;
  confidenceScore: number;
  status: 'Pending Review' | 'In Progress' | 'Resolved';
  assignedExpertId?: string;
  assignedExpertName?: string;
  expertResponse?: string;
  expertComments?: string;
  additionalInfoRequested?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface FinancialMetric {
  totalBuyerSales: number;
  totalCustomerSales: number;
  farmerProcurementCost: number;
  warehouseLogisticsCost: number;
  operationalCosts: number;
  grossRevenue: number;
  netProfit: number;
  grossMarginPercentage: number;
  outstandingBuyerPayments: number;
  pendingFarmerPayments: number;
}

export interface QuotationItem {
  productName: string;
  quantityKg: number;
  unitPrice: number;
  totalPrice: number;
  qualityGrade: string;
}

export interface Quotation {
  id: string;
  buyerId: string;
  buyerName: string;
  requirementId: string;
  quotationNumber: string;
  items: QuotationItem[];
  totalQuotedAmount: number;
  terms: string;
  validUntil: string;
  status: 'Draft' | 'Submitted' | 'Accepted' | 'Rejected' | 'Negotiation';
  negotiationNotes?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  recipientRole: UserRole | 'all';
  recipientId?: string;
  title: string;
  message: string;
  type: 'order' | 'requirement' | 'quotation' | 'alert' | 'expert' | 'payment';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface FarmerExpense {
  id: string;
  farmerId: string;
  category: 'Seeds & Saplings' | 'Bio-Fertilizer / Jeevamrit' | 'Irrigation & Power' | 'Labor & Harvesting' | 'Equipment & Tools';
  amount: number;
  description: string;
  date: string;
}

export interface SavedAddress {
  id: string;
  title: string;
  fullAddress: string;
  city: string;
  pincode: string;
  isDefault?: boolean;
}
