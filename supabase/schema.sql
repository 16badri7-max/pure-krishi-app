-- PURE KRISHI POSTGRESQL DATABASE SCHEMA (SUPABASE READY)
-- Full production schema with Row Level Security (RLS), tables, constraints, indexes & triggers

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role_enum AS ENUM (
  'super_admin',
  'operations_admin',
  'buyer',
  'farmer',
  'expert',
  'warehouse_staff',
  'delivery_partner',
  'customer'
);

CREATE TYPE procurement_stage_enum AS ENUM (
  'Lead Identified',
  'Contacted',
  'Meeting Scheduled',
  'Requirements Collected',
  'Quotation Submitted',
  'Negotiation',
  'Trial Order',
  'Agreement Signed',
  'Active Buyer',
  'Supply in Progress'
);

CREATE TYPE order_status_enum AS ENUM (
  'Requested',
  'Quoted',
  'Confirmed',
  'Processing',
  'Packed',
  'Dispatched',
  'Delivered',
  'Completed',
  'Cancelled'
);

-- 3. PROFILES & ROLES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  organization TEXT,
  location TEXT,
  role user_role_enum NOT NULL DEFAULT 'customer',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. BUYERS & CONTACTS
CREATE TABLE IF NOT EXISTS buyers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT NOT NULL,
  buyer_type TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  procurement_manager TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  gst_number TEXT,
  preferred_communication TEXT DEFAULT 'Email',
  stage procurement_stage_enum DEFAULT 'Lead Identified',
  total_requirements_count INT DEFAULT 0,
  active_agreements_count INT DEFAULT 0,
  total_purchase_value NUMERIC(14, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS buyer_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  contact_name TEXT NOT NULL,
  designation TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BUYER REQUIREMENTS & ITEMS
CREATE TABLE IF NOT EXISTS buyer_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  delivery_location TEXT NOT NULL,
  additional_instructions TEXT,
  status TEXT NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Under Review', 'Quoted', 'Farmer Matched', 'Fulfilled')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS buyer_requirement_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requirement_id UUID NOT NULL REFERENCES buyer_requirements(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  required_quantity NUMERIC(10, 2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  frequency TEXT NOT NULL,
  expected_price_range TEXT,
  quality_grade TEXT NOT NULL,
  organic_requirement TEXT NOT NULL,
  packaging TEXT,
  required_delivery_date DATE NOT NULL,
  allocated_farmer_quantity NUMERIC(10, 2) DEFAULT 0.00,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Sourced', 'Partially Sourced', 'Fulfilled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. QUOTATIONS & SUPPLY AGREEMENTS
CREATE TABLE IF NOT EXISTS quotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  requirement_id UUID REFERENCES buyer_requirements(id) ON DELETE SET NULL,
  quotation_number TEXT UNIQUE NOT NULL,
  total_quoted_amount NUMERIC(14, 2) NOT NULL,
  terms TEXT,
  valid_until DATE NOT NULL,
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Submitted', 'Accepted', 'Rejected', 'Expired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS supply_agreements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  products_summary TEXT NOT NULL,
  agreed_quantity_monthly NUMERIC(12, 2) NOT NULL,
  unit TEXT DEFAULT 'kg',
  estimated_value_monthly NUMERIC(14, 2) NOT NULL,
  delivery_frequency TEXT NOT NULL,
  quality_standard TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  payment_terms TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent for Review', 'Authorized & Signed', 'Active', 'Completed', 'Terminated')),
  document_url TEXT,
  signed_by_admin UUID REFERENCES profiles(id),
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. FARMERS & FARMS
CREATE TABLE IF NOT EXISTS farmers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  village TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL,
  total_acres NUMERIC(8, 2) NOT NULL,
  farming_practices TEXT NOT NULL,
  main_crops TEXT[] NOT NULL DEFAULT '{}',
  total_earnings NUMERIC(14, 2) DEFAULT 0.00,
  pending_payment NUMERIC(14, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS farms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  farm_name TEXT NOT NULL,
  village TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL,
  total_land_area_acres NUMERIC(8, 2) NOT NULL,
  cultivated_area_acres NUMERIC(8, 2) NOT NULL,
  ownership_type TEXT NOT NULL,
  water_source TEXT NOT NULL,
  farming_practice TEXT NOT NULL,
  soil_type TEXT NOT NULL,
  soil_ph NUMERIC(4, 2),
  organic_carbon_percentage NUMERIC(4, 2),
  verification_status TEXT DEFAULT 'Pending Verification' CHECK (verification_status IN ('Verified by Pure Krishi', 'Inspection Scheduled', 'Pending Verification')),
  latitude NUMERIC(10, 6) NOT NULL,
  longitude NUMERIC(10, 6) NOT NULL,
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS farm_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CROPS & DEMAND-DRIVEN CROP PLANNING
CREATE TABLE IF NOT EXISTS crops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  variety TEXT NOT NULL,
  category TEXT NOT NULL,
  cultivated_acres NUMERIC(8, 2) NOT NULL,
  sowing_date DATE NOT NULL,
  expected_harvest_date DATE NOT NULL,
  expected_yield_kg NUMERIC(10, 2) NOT NULL,
  actual_harvest_kg NUMERIC(10, 2),
  growth_stage TEXT NOT NULL DEFAULT 'Vegetative',
  allocated_to_demand_kg NUMERIC(10, 2) DEFAULT 0.00,
  surplus_kg NUMERIC(10, 2) DEFAULT 0.00,
  health_status TEXT DEFAULT 'Good' CHECK (health_status IN ('Excellent', 'Good', 'Attention Needed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crop_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_title TEXT NOT NULL,
  buyer_id UUID REFERENCES buyers(id) ON DELETE SET NULL,
  season TEXT NOT NULL,
  start_date DATE NOT NULL,
  target_delivery_date DATE NOT NULL,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS farmer_allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requirement_item_id UUID REFERENCES buyer_requirement_items(id) ON DELETE CASCADE,
  crop_record_id UUID REFERENCES crops(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  allocated_quantity_kg NUMERIC(10, 2) NOT NULL,
  target_harvest_date DATE NOT NULL,
  estimated_delivery_date DATE NOT NULL,
  status TEXT DEFAULT 'Proposed' CHECK (status IN ('Proposed', 'Confirmed', 'Cultivation Tracked', 'Harvested & Dispatched')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. HARVEST BATCHES & QUALITY VERIFICATION
CREATE TABLE IF NOT EXISTS harvest_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  harvest_date DATE NOT NULL,
  harvest_quantity NUMERIC(10, 2) NOT NULL,
  unit TEXT DEFAULT 'kg',
  expected_grade TEXT NOT NULL,
  storage_requirements TEXT,
  photos TEXT[] DEFAULT '{}',
  assigned_warehouse_id UUID,
  status TEXT DEFAULT 'Harvested' CHECK (status IN ('Harvested', 'Under Inspection', 'Approved', 'Rejected', 'In Warehouse')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quality_inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  harvest_batch_id UUID NOT NULL REFERENCES harvest_batches(id) ON DELETE CASCADE,
  inspector_id UUID REFERENCES profiles(id),
  inspected_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_grade TEXT NOT NULL,
  brix_sugar_content NUMERIC(5, 2),
  moisture_percentage NUMERIC(5, 2),
  visual_defect_percentage NUMERIC(5, 2) DEFAULT 0.00,
  chemical_residue_status TEXT NOT NULL,
  observations TEXT NOT NULL,
  photos TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'Approved' CHECK (status IN ('Approved', 'Rejected', 'Needs Re-inspection')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. PRODUCTS & PRODUCT BATCHES
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  available_quantity NUMERIC(10, 2) DEFAULT 0.00,
  image_url TEXT,
  description TEXT,
  nutritional_benefits TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  harvest_batch_id UUID REFERENCES harvest_batches(id) ON DELETE SET NULL,
  farmer_id UUID REFERENCES farmers(id) ON DELETE SET NULL,
  grade TEXT NOT NULL,
  packed_quantity NUMERIC(10, 2) NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. WAREHOUSES & INVENTORY
CREATE TABLE IF NOT EXISTS warehouses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  capacity_tonnes NUMERIC(10, 2) NOT NULL,
  occupied_tonnes NUMERIC(10, 2) DEFAULT 0.00,
  cold_storage_available BOOLEAN DEFAULT FALSE,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS warehouse_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  batch_id TEXT NOT NULL,
  farmer_name TEXT NOT NULL,
  grade TEXT NOT NULL,
  available_quantity_kg NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  reserved_quantity_kg NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  unit_price NUMERIC(10, 2) NOT NULL,
  expiry_date DATE,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('Inbound Harvest', 'Order Reservation', 'Dispatch Outbound', 'Adjustment / Loss')),
  quantity_kg NUMERIC(10, 2) NOT NULL,
  batch_id TEXT,
  reference_order_id TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. B2B PURCHASE ORDERS & DELIVERIES
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  delivery_date DATE NOT NULL,
  delivery_address TEXT NOT NULL,
  total_amount NUMERIC(14, 2) NOT NULL,
  status order_status_enum DEFAULT 'Requested',
  payment_status TEXT DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Partial', 'Overdue')),
  delivery_partner_id UUID REFERENCES profiles(id),
  dispatch_timestamp TIMESTAMPTZ,
  delivery_timestamp TIMESTAMPTZ,
  proof_of_delivery_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS purchase_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  quantity_kg NUMERIC(10, 2) NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  total_price NUMERIC(14, 2) NOT NULL,
  batch_id TEXT
);

CREATE TABLE IF NOT EXISTS deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  driver_name TEXT NOT NULL,
  vehicle_number TEXT NOT NULL,
  current_location TEXT,
  estimated_arrival TIMESTAMPTZ,
  delivery_status TEXT DEFAULT 'Assigned' CHECK (delivery_status IN ('Assigned', 'In Transit', 'Out for Delivery', 'Delivered', 'Failed')),
  proof_of_delivery_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS delivery_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  delivery_id UUID NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
  assigned_to UUID NOT NULL REFERENCES profiles(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. B2C CUSTOMER ORDERS
CREATE TABLE IF NOT EXISTS customer_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES profiles(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 40.00,
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'Order Placed' CHECK (status IN ('Order Placed', 'Packed', 'Out for Delivery', 'Delivered')),
  order_date TIMESTAMPTZ DEFAULT NOW(),
  estimated_delivery TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS customer_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES customer_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  quantity INT NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL
);

-- 14. PAYMENTS & EXPENSES (FINANCE)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('Buyer Inbound', 'Farmer Disbursement', 'Customer Checkout')),
  entity_id TEXT NOT NULL,
  amount NUMERIC(14, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'Success' CHECK (status IN ('Success', 'Pending', 'Failed')),
  transaction_ref TEXT UNIQUE NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL CHECK (category IN ('Warehousing & Cold Storage', 'Logistics & Transport', 'Quality Testing Lab', 'Farm Extension Support', 'Packaging Material', 'Administrative')),
  amount NUMERIC(14, 2) NOT NULL,
  description TEXT NOT NULL,
  receipt_url TEXT,
  recorded_by UUID REFERENCES profiles(id),
  expense_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. AI CONVERSATIONS & EXPERT ESCALATIONS
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Agronomy Consultation',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('farmer', 'ai', 'expert')),
  content TEXT NOT NULL,
  image_url TEXT,
  confidence_score NUMERIC(5, 2),
  needs_expert_review BOOLEAN DEFAULT FALSE,
  expert_reviewed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expert_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
  farmer_name TEXT NOT NULL,
  farmer_phone TEXT NOT NULL,
  crop_name TEXT NOT NULL,
  question TEXT NOT NULL,
  ai_suggested_answer TEXT NOT NULL,
  confidence_score NUMERIC(5, 2) NOT NULL,
  status TEXT DEFAULT 'Pending Review' CHECK (status IN ('Pending Review', 'In Progress', 'Resolved')),
  assigned_expert_id UUID REFERENCES profiles(id),
  expert_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- 16. NOTIFICATIONS & AUDIT LOGS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_requirement_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE harvest_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies Examples
CREATE POLICY "Public products viewable by all" ON products FOR SELECT USING (true);
CREATE POLICY "Public profiles read" ON profiles FOR SELECT USING (true);
CREATE POLICY "Admins full access to buyers" ON buyers FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('super_admin', 'operations_admin'))
);
CREATE POLICY "Buyers see own requirements" ON buyer_requirements FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role IN ('super_admin', 'operations_admin') OR profiles.organization = (SELECT business_name FROM buyers WHERE id = buyer_requirements.buyer_id)))
);
CREATE POLICY "Farmers see own farms and crops" ON farms FOR ALL USING (
  EXISTS (SELECT 1 FROM farmers WHERE farmers.id = farms.farmer_id AND farmers.profile_id = auth.uid()) 
  OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('super_admin', 'operations_admin', 'expert'))
);
