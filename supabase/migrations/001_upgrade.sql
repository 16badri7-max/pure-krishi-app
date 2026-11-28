-- =============================================================================
-- PURE KRISHI — UPGRADE MIGRATION  (001_upgrade.sql)
-- Safe to re-run: IF NOT EXISTS, DROP IF EXISTS, ON CONFLICT DO NOTHING.
-- Run AFTER schema.sql.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. PRODUCT CATEGORIES TABLE
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_categories (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT UNIQUE NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  description   TEXT,
  icon          TEXT DEFAULT '🌱',
  image_url     TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO product_categories (name, slug, description, icon, display_order) VALUES
  ('Vegetables', 'vegetables', 'Fresh residue-free seasonal vegetables', '🥬', 1),
  ('Fruits',     'fruits',     'Naturally ripened organic orchard fruits', '🍎', 2),
  ('Grains',     'grains',     'Unpolished heirloom rice & ancient millets', '🌾', 3),
  ('Pulses',     'pulses',     'Single-origin unpolished organic dals', '🫘', 4),
  ('Dry fruits', 'dry-fruits', 'Hand-cracked nuts and unsulfured dried fruits', '🌰', 5),
  ('Spices',     'spices',     'Single-estate sun-dried whole & ground spices', '🌶️', 6)
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 2. ADDITIVE COLUMNS ON products
-- ---------------------------------------------------------------------------
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id          UUID REFERENCES product_categories(id) ON DELETE SET NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS selling_price        NUMERIC(10,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS mrp                  NUMERIC(10,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS farmer_id            UUID REFERENCES farmers(id) ON DELETE SET NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS farm_id              UUID REFERENCES farms(id) ON DELETE SET NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS farmer_name          TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS farmer_location      TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS farm_name            TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS harvest_batch_id     TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS verification_badge   TEXT DEFAULT 'NPOP Organic Certified';
ALTER TABLE products ADD COLUMN IF NOT EXISTS approval_status      TEXT NOT NULL DEFAULT 'approved';
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_published         BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_locked_for_customers BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS locked_by_buyer_name TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS locked_reason        TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS locked_quantity_kg   NUMERIC(10,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS low_stock_threshold  NUMERIC(10,2) NOT NULL DEFAULT 25.00;
ALTER TABLE products ADD COLUMN IF NOT EXISTS approved_by         UUID REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS approved_at         TIMESTAMPTZ;
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Backfill selling_price from existing price
UPDATE products SET selling_price = price WHERE selling_price IS NULL;

-- ---------------------------------------------------------------------------
-- 3. FARMER PRODUCT SUBMISSIONS  (Workflow 1: Farmer → Admin → Catalogue)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS farmer_product_submissions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id        UUID REFERENCES farmers(id) ON DELETE CASCADE,
  farm_id          UUID REFERENCES farms(id) ON DELETE SET NULL,
  submitted_by     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  farmer_name      TEXT NOT NULL,
  submission_type  TEXT NOT NULL DEFAULT 'new_product'
    CHECK (submission_type IN ('new_product','price_change','description_update','stock_update')),
  target_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name     TEXT NOT NULL,
  category         TEXT NOT NULL,
  description      TEXT,
  images           TEXT[] NOT NULL DEFAULT '{}',
  proposed_price   NUMERIC(10,2) NOT NULL CHECK (proposed_price >= 0),
  unit             TEXT NOT NULL DEFAULT 'kg',
  proposed_quantity NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (proposed_quantity >= 0),
  harvest_date     DATE,
  organic_certified BOOLEAN NOT NULL DEFAULT TRUE,
  farming_notes    TEXT,
  status           TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','under_review','approved','rejected')),
  admin_notes      TEXT,
  reviewed_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at      TIMESTAMPTZ,
  created_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 4. STOCK SUBMISSIONS  (Workflow 3: Farmer stock harvest → Admin approval)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stock_submissions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id         UUID REFERENCES farmers(id) ON DELETE CASCADE,
  submitted_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  farmer_name       TEXT NOT NULL,
  product_id        UUID REFERENCES products(id) ON DELETE SET NULL,
  warehouse_id      UUID REFERENCES warehouses(id) ON DELETE SET NULL,
  harvest_batch_id  TEXT,
  product_name      TEXT NOT NULL,
  submitted_quantity NUMERIC(10,2) NOT NULL CHECK (submitted_quantity > 0),
  unit              TEXT NOT NULL DEFAULT 'kg',
  harvest_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_grade    TEXT DEFAULT 'Grade A Premium',
  notes             TEXT,
  status            TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected')),
  admin_notes       TEXT,
  reviewed_by       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 5. ADDITIVE COLUMNS ON customer_orders & related
-- ---------------------------------------------------------------------------
ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS order_number       TEXT UNIQUE;
ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS payment_method     TEXT DEFAULT 'upi';
ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS payment_status     TEXT DEFAULT 'Paid';
ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS delivery_slot      TEXT;
ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS warehouse_id       UUID REFERENCES warehouses(id) ON DELETE SET NULL;
ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS delivery_partner_id UUID REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS assigned_farmer_id UUID REFERENCES farmers(id) ON DELETE SET NULL;
ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS tracking_notes     TEXT;
ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS idempotency_key    TEXT UNIQUE;
ALTER TABLE customer_orders ADD COLUMN IF NOT EXISTS updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Widen status constraint to include all operational states
ALTER TABLE customer_orders DROP CONSTRAINT IF EXISTS customer_orders_status_check;
ALTER TABLE customer_orders ADD CONSTRAINT customer_orders_status_check
  CHECK (status IN ('Order Placed','Confirmed','Packed','Dispatched','Out for Delivery','Delivered','Cancelled'));

ALTER TABLE customer_order_items ADD COLUMN IF NOT EXISTS farmer_id   UUID REFERENCES farmers(id) ON DELETE SET NULL;
ALTER TABLE customer_order_items ADD COLUMN IF NOT EXISTS farmer_name TEXT;

-- Additive audit_log columns
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS actor_name TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS actor_role TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS old_values JSONB;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS new_values JSONB;

-- ---------------------------------------------------------------------------
-- 6. EMPLOYEES TABLE
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS employees (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id           UUID REFERENCES profiles(id) ON DELETE SET NULL,
  full_name            TEXT NOT NULL,
  email                TEXT UNIQUE NOT NULL,
  phone                TEXT,
  role_title           TEXT NOT NULL,
  department           TEXT NOT NULL,
  access_role          user_role_enum NOT NULL DEFAULT 'warehouse_staff',
  assigned_warehouse_id UUID REFERENCES warehouses(id) ON DELETE SET NULL,
  status               TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','on_leave','inactive')),
  joined_at            DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 7. PLATFORM SETTINGS TABLE
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS platform_settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO platform_settings (key, value, description) VALUES
  ('delivery_fee',      '{"standard": 40, "free_above": 999}',                                             'Customer delivery pricing rules'),
  ('inventory_alerts',  '{"low_stock_threshold_kg": 25, "auto_lock_zero_stock": true}',                    'Stock monitoring thresholds'),
  ('order_workflow',    '{"require_admin_approval_for_products": true, "require_admin_approval_for_stock": true}', 'Central governance flags')
ON CONFLICT (key) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 8. PERFORMANCE INDEXES
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_published       ON products(is_published, is_active, approval_status);
CREATE INDEX IF NOT EXISTS idx_products_category_id     ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status       ON farmer_product_submissions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_farmer       ON farmer_product_submissions(farmer_id);
CREATE INDEX IF NOT EXISTS idx_stock_submissions_status ON stock_submissions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stock_submissions_farmer ON stock_submissions(farmer_id);

-- ---------------------------------------------------------------------------
-- 9. SECURITY HELPER FUNCTION (MUST come before all RLS policies)
--    SECURITY DEFINER bypasses RLS so this function can safely query profiles
--    without causing the recursive-RLS loop that the base schema avoids.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION is_pure_krishi_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND role IN ('super_admin', 'operations_admin')
      AND status = 'active'
  );
$$;

-- Helper: get the role of the currently authenticated user (non-recursive)
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::TEXT FROM profiles WHERE id = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- 10. ROLE-ESCALATION PREVENTION TRIGGER
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION enforce_profile_role_security()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Public signup may only create customer or farmer profiles
    IF current_setting('role', TRUE) NOT IN ('service_role', 'postgres')
       AND NOT is_pure_krishi_admin()
       AND NEW.role NOT IN ('customer', 'farmer') THEN
      NEW.role := 'customer';
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.role IS DISTINCT FROM OLD.role
       AND current_setting('role', TRUE) NOT IN ('service_role', 'postgres')
       AND NOT is_pure_krishi_admin() THEN
      RAISE EXCEPTION 'Unauthorized: only Admin can modify user roles';
    END IF;
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_profile_role_security ON profiles;
CREATE TRIGGER trg_enforce_profile_role_security
BEFORE INSERT OR UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION enforce_profile_role_security();

-- ---------------------------------------------------------------------------
-- 11. AUTO-PROVISION PROFILE ON SIGNUP TRIGGER
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION handle_auth_user_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_requested_role TEXT;
  v_safe_role      user_role_enum;
BEGIN
  v_requested_role := COALESCE(NEW.raw_user_meta_data->>'role', 'customer');
  v_safe_role := CASE WHEN v_requested_role = 'farmer' THEN 'farmer'::user_role_enum
                      ELSE 'customer'::user_role_enum END;

  INSERT INTO profiles (id, email, name, phone, role, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, NEW.id::TEXT || '@purekrishi.local'),
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(COALESCE(NEW.email, 'User'), '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    v_safe_role,
    'active'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_auth_user_created();

-- ---------------------------------------------------------------------------
-- 12. ENABLE RLS ON NEW TABLES (upgrade-only tables)
-- ---------------------------------------------------------------------------
ALTER TABLE product_categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_product_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_submissions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_order_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries                ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_assignments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements       ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 13. COMPREHENSIVE RLS POLICIES
-- All policies: DROP IF EXISTS before CREATE (idempotent re-runs).
-- ---------------------------------------------------------------------------

-- ── profiles ──────────────────────────────────────────────────────────────
-- Replace base schema stub with full policy (admin can see all profiles)
DROP POLICY IF EXISTS "profiles_self_select"       ON profiles;
DROP POLICY IF EXISTS "profiles_self_update"       ON profiles;
DROP POLICY IF EXISTS "profiles_admin_select"      ON profiles;
DROP POLICY IF EXISTS "profiles_admin_insert"      ON profiles;
DROP POLICY IF EXISTS "Users read own profile or admin reads all" ON profiles;
DROP POLICY IF EXISTS "Users update own profile"   ON profiles;
DROP POLICY IF EXISTS "Public profiles read"       ON profiles;

-- SELECT: own row OR admin (via SECURITY DEFINER — no recursion)
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (id = auth.uid() OR is_pure_krishi_admin());

-- UPDATE: own row OR admin; trigger blocks role escalation
CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE USING (id = auth.uid() OR is_pure_krishi_admin())
  WITH CHECK  (id = auth.uid() OR is_pure_krishi_admin());

-- INSERT: service role / trigger only (normal users never INSERT directly)
CREATE POLICY "profiles_insert_service" ON profiles
  FOR INSERT WITH CHECK (
    current_setting('role', TRUE) IN ('service_role', 'postgres')
    OR is_pure_krishi_admin()
  );

-- DELETE: admin only
CREATE POLICY "profiles_delete_admin" ON profiles
  FOR DELETE USING (is_pure_krishi_admin());

-- ── products ──────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "products_public_select"             ON products;
DROP POLICY IF EXISTS "Public products viewable by all"    ON products;
DROP POLICY IF EXISTS "Published approved products viewable by all" ON products;
DROP POLICY IF EXISTS "Admins manage products"             ON products;
DROP POLICY IF EXISTS "Admin only product write"           ON products;

-- Public can browse approved & published active products
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (
    (is_active = TRUE AND is_published = TRUE AND approval_status = 'approved')
    OR is_pure_krishi_admin()
  );

-- Only admin can write products
CREATE POLICY "products_admin_write" ON products
  FOR ALL USING  (is_pure_krishi_admin())
  WITH CHECK     (is_pure_krishi_admin());

-- ── product_categories ────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Categories readable by all"      ON product_categories;
DROP POLICY IF EXISTS "Admin only category write"       ON product_categories;

CREATE POLICY "categories_public_read" ON product_categories
  FOR SELECT USING (is_active = TRUE OR is_pure_krishi_admin());

CREATE POLICY "categories_admin_write" ON product_categories
  FOR ALL USING  (is_pure_krishi_admin())
  WITH CHECK     (is_pure_krishi_admin());

-- ── buyers ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Admins full access to buyers" ON buyers;
DROP POLICY IF EXISTS "buyers_buyer_select"          ON buyers;

-- Admin full access; buyer sees their own organisation record
CREATE POLICY "buyers_admin_all" ON buyers
  FOR ALL USING  (is_pure_krishi_admin())
  WITH CHECK     (is_pure_krishi_admin());

CREATE POLICY "buyers_self_select" ON buyers
  FOR SELECT USING (
    email = (SELECT email FROM profiles WHERE id = auth.uid())
  );

-- ── buyer_contacts ────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "buyer_contacts_admin_all" ON buyer_contacts;
CREATE POLICY "buyer_contacts_admin_all" ON buyer_contacts
  FOR ALL USING  (is_pure_krishi_admin())
  WITH CHECK     (is_pure_krishi_admin());

-- ── buyer_requirements ────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Buyers see own requirements"    ON buyer_requirements;
DROP POLICY IF EXISTS "buyer_requirements_admin"       ON buyer_requirements;

CREATE POLICY "buyer_requirements_admin_all" ON buyer_requirements
  FOR ALL USING  (is_pure_krishi_admin())
  WITH CHECK     (is_pure_krishi_admin());

-- Buyer sees requirements linked to their buyer record
CREATE POLICY "buyer_requirements_self" ON buyer_requirements
  FOR SELECT USING (
    buyer_id IN (
      SELECT id FROM buyers WHERE email = (SELECT email FROM profiles WHERE id = auth.uid())
    )
  );

-- ── buyer_requirement_items ───────────────────────────────────────────────
DROP POLICY IF EXISTS "buyer_req_items_admin_all" ON buyer_requirement_items;
CREATE POLICY "buyer_req_items_admin_all" ON buyer_requirement_items
  FOR ALL USING  (is_pure_krishi_admin())
  WITH CHECK     (is_pure_krishi_admin());

CREATE POLICY "buyer_req_items_self" ON buyer_requirement_items
  FOR SELECT USING (
    requirement_id IN (
      SELECT br.id FROM buyer_requirements br
      JOIN buyers b ON b.id = br.buyer_id
      WHERE b.email = (SELECT email FROM profiles WHERE id = auth.uid())
    )
  );

-- ── quotations ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "quotations_admin_all" ON quotations;
CREATE POLICY "quotations_admin_all" ON quotations
  FOR ALL USING  (is_pure_krishi_admin())
  WITH CHECK     (is_pure_krishi_admin());

CREATE POLICY "quotations_buyer_select" ON quotations
  FOR SELECT USING (
    buyer_id IN (
      SELECT id FROM buyers WHERE email = (SELECT email FROM profiles WHERE id = auth.uid())
    )
  );

-- ── supply_agreements ─────────────────────────────────────────────────────
DROP POLICY IF EXISTS "supply_agreements_admin_all" ON supply_agreements;
CREATE POLICY "supply_agreements_admin_all" ON supply_agreements
  FOR ALL USING  (is_pure_krishi_admin())
  WITH CHECK     (is_pure_krishi_admin());

CREATE POLICY "supply_agreements_buyer_select" ON supply_agreements
  FOR SELECT USING (
    buyer_id IN (
      SELECT id FROM buyers WHERE email = (SELECT email FROM profiles WHERE id = auth.uid())
    )
  );

-- ── farmers ───────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "farmers_public_read"              ON farmers;
DROP POLICY IF EXISTS "Farmers public directory or own edit" ON farmers;
DROP POLICY IF EXISTS "Farmers update own or admin"      ON farmers;

-- Public directory read (name, village, district — no PII)
CREATE POLICY "farmers_public_select" ON farmers
  FOR SELECT USING (TRUE);

-- Farmers manage their own record; admin manages all
CREATE POLICY "farmers_self_or_admin_write" ON farmers
  FOR ALL USING  (profile_id = auth.uid() OR is_pure_krishi_admin())
  WITH CHECK     (profile_id = auth.uid() OR is_pure_krishi_admin());

-- ── farms ─────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "farms_farmer_select"              ON farms;
DROP POLICY IF EXISTS "Farmers see own farms and crops"  ON farms;
DROP POLICY IF EXISTS "farms_admin_all"                  ON farms;

CREATE POLICY "farms_farmer_or_admin" ON farms
  FOR ALL USING (
    farmer_id IN (SELECT id FROM farmers WHERE profile_id = auth.uid())
    OR is_pure_krishi_admin()
    OR current_user_role() = 'expert'
  )
  WITH CHECK (
    farmer_id IN (SELECT id FROM farmers WHERE profile_id = auth.uid())
    OR is_pure_krishi_admin()
  );

-- ── farm_documents ────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "farm_docs_farmer_or_admin" ON farm_documents;
CREATE POLICY "farm_docs_farmer_or_admin" ON farm_documents
  FOR ALL USING (
    farm_id IN (
      SELECT f.id FROM farms f
      JOIN farmers fr ON fr.id = f.farmer_id
      WHERE fr.profile_id = auth.uid()
    )
    OR is_pure_krishi_admin()
  )
  WITH CHECK (
    farm_id IN (
      SELECT f.id FROM farms f
      JOIN farmers fr ON fr.id = f.farmer_id
      WHERE fr.profile_id = auth.uid()
    )
    OR is_pure_krishi_admin()
  );

-- ── crops ─────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "crops_farmer_or_admin" ON crops;
CREATE POLICY "crops_farmer_or_admin" ON crops
  FOR ALL USING (
    farmer_id IN (SELECT id FROM farmers WHERE profile_id = auth.uid())
    OR is_pure_krishi_admin()
    OR current_user_role() = 'expert'
  )
  WITH CHECK (
    farmer_id IN (SELECT id FROM farmers WHERE profile_id = auth.uid())
    OR is_pure_krishi_admin()
  );

-- ── crop_plans ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "crop_plans_admin_all" ON crop_plans;
CREATE POLICY "crop_plans_admin_all" ON crop_plans
  FOR ALL USING  (is_pure_krishi_admin())
  WITH CHECK     (is_pure_krishi_admin());

-- ── farmer_allocations ────────────────────────────────────────────────────
DROP POLICY IF EXISTS "farmer_allocations_all" ON farmer_allocations;
CREATE POLICY "farmer_allocations_farmer_or_admin" ON farmer_allocations
  FOR ALL USING (
    farmer_id IN (SELECT id FROM farmers WHERE profile_id = auth.uid())
    OR is_pure_krishi_admin()
  )
  WITH CHECK (is_pure_krishi_admin());

-- ── harvest_batches ───────────────────────────────────────────────────────
DROP POLICY IF EXISTS "harvest_batches_farmer_or_admin" ON harvest_batches;
CREATE POLICY "harvest_batches_farmer_or_admin" ON harvest_batches
  FOR ALL USING (
    farmer_id IN (SELECT id FROM farmers WHERE profile_id = auth.uid())
    OR is_pure_krishi_admin()
    OR current_user_role() IN ('warehouse_staff', 'expert')
  )
  WITH CHECK (
    farmer_id IN (SELECT id FROM farmers WHERE profile_id = auth.uid())
    OR is_pure_krishi_admin()
  );

-- ── quality_inspections ───────────────────────────────────────────────────
DROP POLICY IF EXISTS "quality_inspections_admin_expert" ON quality_inspections;
CREATE POLICY "quality_inspections_admin_expert" ON quality_inspections
  FOR ALL USING (
    is_pure_krishi_admin()
    OR current_user_role() = 'expert'
    OR inspector_id = auth.uid()
  )
  WITH CHECK (
    is_pure_krishi_admin()
    OR current_user_role() = 'expert'
  );

-- ── product_batches ───────────────────────────────────────────────────────
DROP POLICY IF EXISTS "product_batches_admin_all" ON product_batches;
CREATE POLICY "product_batches_admin_all" ON product_batches
  FOR ALL USING  (is_pure_krishi_admin())
  WITH CHECK     (is_pure_krishi_admin());

CREATE POLICY "product_batches_farmer_select" ON product_batches
  FOR SELECT USING (
    farmer_id IN (SELECT id FROM farmers WHERE profile_id = auth.uid())
  );

-- ── warehouses ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Admin manages warehouses"       ON warehouses;
DROP POLICY IF EXISTS "warehouses_admin_or_staff"      ON warehouses;

-- Admin + warehouse_staff can read warehouses; admin alone writes
CREATE POLICY "warehouses_admin_write" ON warehouses
  FOR ALL USING  (is_pure_krishi_admin())
  WITH CHECK     (is_pure_krishi_admin());

CREATE POLICY "warehouses_staff_select" ON warehouses
  FOR SELECT USING (
    is_pure_krishi_admin()
    OR current_user_role() IN ('warehouse_staff', 'delivery_partner')
  );

-- ── warehouse_inventory ───────────────────────────────────────────────────
DROP POLICY IF EXISTS "Admin manages warehouse inventory" ON warehouse_inventory;
DROP POLICY IF EXISTS "warehouse_inventory_admin_staff"   ON warehouse_inventory;

CREATE POLICY "warehouse_inventory_admin_write" ON warehouse_inventory
  FOR ALL USING  (is_pure_krishi_admin())
  WITH CHECK     (is_pure_krishi_admin());

CREATE POLICY "warehouse_inventory_staff_select" ON warehouse_inventory
  FOR SELECT USING (
    is_pure_krishi_admin()
    OR current_user_role() = 'warehouse_staff'
  );

-- ── inventory_movements ───────────────────────────────────────────────────
DROP POLICY IF EXISTS "inventory_movements_admin_staff" ON inventory_movements;
CREATE POLICY "inventory_movements_admin_all" ON inventory_movements
  FOR ALL USING  (is_pure_krishi_admin())
  WITH CHECK     (is_pure_krishi_admin());

CREATE POLICY "inventory_movements_staff_select" ON inventory_movements
  FOR SELECT USING (current_user_role() = 'warehouse_staff');

-- ── purchase_orders (B2B) ─────────────────────────────────────────────────
DROP POLICY IF EXISTS "purchase_orders_admin_all"      ON purchase_orders;
DROP POLICY IF EXISTS "purchase_orders_buyer_select"   ON purchase_orders;

CREATE POLICY "purchase_orders_admin_all" ON purchase_orders
  FOR ALL USING  (is_pure_krishi_admin())
  WITH CHECK     (is_pure_krishi_admin());

CREATE POLICY "purchase_orders_buyer_select" ON purchase_orders
  FOR SELECT USING (
    buyer_id IN (
      SELECT id FROM buyers WHERE email = (SELECT email FROM profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "purchase_orders_delivery_select" ON purchase_orders
  FOR SELECT USING (
    delivery_partner_id = auth.uid()
    OR current_user_role() = 'delivery_partner'
  );

-- ── purchase_order_items ──────────────────────────────────────────────────
DROP POLICY IF EXISTS "purchase_order_items_admin_all" ON purchase_order_items;
CREATE POLICY "purchase_order_items_admin_all" ON purchase_order_items
  FOR ALL USING  (is_pure_krishi_admin())
  WITH CHECK     (is_pure_krishi_admin());

CREATE POLICY "purchase_order_items_buyer_select" ON purchase_order_items
  FOR SELECT USING (
    order_id IN (
      SELECT po.id FROM purchase_orders po
      JOIN buyers b ON b.id = po.buyer_id
      WHERE b.email = (SELECT email FROM profiles WHERE id = auth.uid())
    )
  );

-- ── deliveries ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "deliveries_admin_all"         ON deliveries;
DROP POLICY IF EXISTS "deliveries_partner_select"    ON deliveries;

CREATE POLICY "deliveries_admin_all" ON deliveries
  FOR ALL USING  (is_pure_krishi_admin())
  WITH CHECK     (is_pure_krishi_admin());

CREATE POLICY "deliveries_partner_select" ON deliveries
  FOR SELECT USING (current_user_role() = 'delivery_partner');

-- ── delivery_assignments ──────────────────────────────────────────────────
DROP POLICY IF EXISTS "delivery_assignments_admin_all"    ON delivery_assignments;
DROP POLICY IF EXISTS "delivery_assignments_self_select"  ON delivery_assignments;

CREATE POLICY "delivery_assignments_admin_all" ON delivery_assignments
  FOR ALL USING  (is_pure_krishi_admin())
  WITH CHECK     (is_pure_krishi_admin());

CREATE POLICY "delivery_assignments_self_select" ON delivery_assignments
  FOR SELECT USING (assigned_to = auth.uid());

-- ── customer_orders ───────────────────────────────────────────────────────
DROP POLICY IF EXISTS "customer_orders_self_select"    ON customer_orders;
DROP POLICY IF EXISTS "customer_orders_self_insert"    ON customer_orders;
DROP POLICY IF EXISTS "Customers read own orders or admin all"  ON customer_orders;
DROP POLICY IF EXISTS "Customers create own orders"    ON customer_orders;
DROP POLICY IF EXISTS "Admin updates customer orders"  ON customer_orders;

CREATE POLICY "customer_orders_customer_select" ON customer_orders
  FOR SELECT USING (customer_id = auth.uid() OR is_pure_krishi_admin());

CREATE POLICY "customer_orders_customer_insert" ON customer_orders
  FOR INSERT WITH CHECK (customer_id = auth.uid() OR is_pure_krishi_admin());

CREATE POLICY "customer_orders_admin_update" ON customer_orders
  FOR UPDATE USING  (is_pure_krishi_admin())
  WITH CHECK        (is_pure_krishi_admin());

-- ── customer_order_items ──────────────────────────────────────────────────
DROP POLICY IF EXISTS "Order items scoped access"      ON customer_order_items;

CREATE POLICY "customer_order_items_customer_select" ON customer_order_items
  FOR SELECT USING (
    is_pure_krishi_admin()
    OR order_id IN (SELECT id FROM customer_orders WHERE customer_id = auth.uid())
    OR farmer_id IN (SELECT id FROM farmers WHERE profile_id = auth.uid())
  );

CREATE POLICY "customer_order_items_service_insert" ON customer_order_items
  FOR INSERT WITH CHECK (
    current_setting('role', TRUE) IN ('service_role', 'postgres')
    OR is_pure_krishi_admin()
  );

-- ── payments ─────────────────────────────────────────────────────────────
-- Payments are sensitive: only admin can read; inserts from RPCs (service role)
DROP POLICY IF EXISTS "payments_admin_all"       ON payments;
DROP POLICY IF EXISTS "payments_service_insert"  ON payments;

CREATE POLICY "payments_admin_select" ON payments
  FOR SELECT USING (is_pure_krishi_admin());

CREATE POLICY "payments_service_insert" ON payments
  FOR INSERT WITH CHECK (
    current_setting('role', TRUE) IN ('service_role', 'postgres')
    OR is_pure_krishi_admin()
  );

-- ── expenses ──────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "expenses_admin_all" ON expenses;
CREATE POLICY "expenses_admin_all" ON expenses
  FOR ALL USING  (is_pure_krishi_admin())
  WITH CHECK     (is_pure_krishi_admin());

-- ── ai_conversations ──────────────────────────────────────────────────────
DROP POLICY IF EXISTS "ai_conversations_farmer_or_admin" ON ai_conversations;
CREATE POLICY "ai_conversations_farmer_or_admin" ON ai_conversations
  FOR ALL USING (
    farmer_id IN (SELECT id FROM farmers WHERE profile_id = auth.uid())
    OR is_pure_krishi_admin()
  )
  WITH CHECK (
    farmer_id IN (SELECT id FROM farmers WHERE profile_id = auth.uid())
    OR is_pure_krishi_admin()
  );

-- ── ai_messages ───────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "ai_messages_farmer_or_admin" ON ai_messages;
CREATE POLICY "ai_messages_farmer_or_admin" ON ai_messages
  FOR ALL USING (
    is_pure_krishi_admin()
    OR current_user_role() = 'expert'
    OR conversation_id IN (
      SELECT ac.id FROM ai_conversations ac
      JOIN farmers f ON f.id = ac.farmer_id
      WHERE f.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    is_pure_krishi_admin()
    OR current_user_role() IN ('expert', 'farmer')
    OR conversation_id IN (
      SELECT ac.id FROM ai_conversations ac
      JOIN farmers f ON f.id = ac.farmer_id
      WHERE f.profile_id = auth.uid()
    )
  );

-- ── expert_reviews ────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "expert_reviews_access" ON expert_reviews;
CREATE POLICY "expert_reviews_farmer_select" ON expert_reviews
  FOR SELECT USING (
    farmer_id IN (SELECT id FROM farmers WHERE profile_id = auth.uid())
    OR is_pure_krishi_admin()
    OR current_user_role() = 'expert'
  );

CREATE POLICY "expert_reviews_farmer_insert" ON expert_reviews
  FOR INSERT WITH CHECK (
    farmer_id IN (SELECT id FROM farmers WHERE profile_id = auth.uid())
    OR is_pure_krishi_admin()
  );

CREATE POLICY "expert_reviews_expert_update" ON expert_reviews
  FOR UPDATE USING (
    assigned_expert_id = auth.uid()
    OR is_pure_krishi_admin()
  )
  WITH CHECK (
    assigned_expert_id = auth.uid()
    OR is_pure_krishi_admin()
  );

-- ── notifications ─────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "notifications_self_select"       ON notifications;
DROP POLICY IF EXISTS "notifications_self_update"       ON notifications;
DROP POLICY IF EXISTS "Users read own notifications"    ON notifications;
DROP POLICY IF EXISTS "Users mark own notifications read" ON notifications;

CREATE POLICY "notifications_recipient_select" ON notifications
  FOR SELECT USING (recipient_id = auth.uid() OR is_pure_krishi_admin());

CREATE POLICY "notifications_recipient_update" ON notifications
  FOR UPDATE USING  (recipient_id = auth.uid() OR is_pure_krishi_admin())
  WITH CHECK        (recipient_id = auth.uid() OR is_pure_krishi_admin());

CREATE POLICY "notifications_service_insert" ON notifications
  FOR INSERT WITH CHECK (
    current_setting('role', TRUE) IN ('service_role', 'postgres')
    OR is_pure_krishi_admin()
  );

-- ── audit_logs ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "audit_logs_insert_authenticated"  ON audit_logs;
DROP POLICY IF EXISTS "Admin reads audit logs"           ON audit_logs;
DROP POLICY IF EXISTS "Authenticated audit log insert"   ON audit_logs;

CREATE POLICY "audit_logs_admin_select" ON audit_logs
  FOR SELECT USING (is_pure_krishi_admin());

CREATE POLICY "audit_logs_authenticated_insert" ON audit_logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ── farmer_product_submissions ────────────────────────────────────────────
DROP POLICY IF EXISTS "Farmers read own submissions or admin all"   ON farmer_product_submissions;
DROP POLICY IF EXISTS "Farmers create own pending submissions"      ON farmer_product_submissions;
DROP POLICY IF EXISTS "Admin reviews submissions"                   ON farmer_product_submissions;

CREATE POLICY "fps_farmer_or_admin_select" ON farmer_product_submissions
  FOR SELECT USING (
    submitted_by = auth.uid()
    OR farmer_id IN (SELECT id FROM farmers WHERE profile_id = auth.uid())
    OR is_pure_krishi_admin()
  );

CREATE POLICY "fps_farmer_insert" ON farmer_product_submissions
  FOR INSERT WITH CHECK (
    (submitted_by = auth.uid() AND status = 'pending')
    OR is_pure_krishi_admin()
  );

CREATE POLICY "fps_admin_update" ON farmer_product_submissions
  FOR UPDATE USING  (is_pure_krishi_admin())
  WITH CHECK        (is_pure_krishi_admin());

-- ── stock_submissions ─────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Farmers read own stock submissions or admin all"   ON stock_submissions;
DROP POLICY IF EXISTS "Farmers create own pending stock submissions"       ON stock_submissions;
DROP POLICY IF EXISTS "Admin reviews stock submissions"                    ON stock_submissions;

CREATE POLICY "ss_farmer_or_admin_select" ON stock_submissions
  FOR SELECT USING (
    submitted_by = auth.uid()
    OR farmer_id IN (SELECT id FROM farmers WHERE profile_id = auth.uid())
    OR is_pure_krishi_admin()
  );

CREATE POLICY "ss_farmer_insert" ON stock_submissions
  FOR INSERT WITH CHECK (
    (submitted_by = auth.uid() AND status = 'pending')
    OR is_pure_krishi_admin()
  );

CREATE POLICY "ss_admin_update" ON stock_submissions
  FOR UPDATE USING  (is_pure_krishi_admin())
  WITH CHECK        (is_pure_krishi_admin());

-- ── employees ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Admin manages employees" ON employees;
CREATE POLICY "employees_admin_all" ON employees
  FOR ALL USING  (is_pure_krishi_admin())
  WITH CHECK     (is_pure_krishi_admin());

-- ── platform_settings ─────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Platform settings readable by authenticated, writeable by admin" ON platform_settings;
DROP POLICY IF EXISTS "Admin manages platform settings"                                  ON platform_settings;

CREATE POLICY "platform_settings_public_read" ON platform_settings
  FOR SELECT USING (TRUE);

CREATE POLICY "platform_settings_admin_write" ON platform_settings
  FOR ALL USING  (is_pure_krishi_admin())
  WITH CHECK     (is_pure_krishi_admin());

-- ---------------------------------------------------------------------------
-- 14. ATOMIC TRANSACTIONAL RPCS
-- ---------------------------------------------------------------------------

-- RPC: Atomic Customer Order Placement (stock lock + idempotency key)
CREATE OR REPLACE FUNCTION place_customer_order(
  p_customer_name    TEXT,
  p_customer_phone   TEXT,
  p_shipping_address TEXT,
  p_payment_method   TEXT    DEFAULT 'upi',
  p_delivery_slot    TEXT    DEFAULT 'Tomorrow Morning (07:00 AM - 10:00 AM)',
  p_items            JSONB   DEFAULT '[]'::JSONB,
  p_idempotency_key  TEXT    DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id       UUID := auth.uid();
  v_existing_order RECORD;
  v_item          JSONB;
  v_product       RECORD;
  v_qty           INT;
  v_subtotal      NUMERIC(10,2) := 0;
  v_delivery_fee  NUMERIC(10,2) := 40.00;
  v_total         NUMERIC(10,2);
  v_order_id      UUID;
  v_order_number  TEXT;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to place an order';
  END IF;

  -- Idempotency check
  IF p_idempotency_key IS NOT NULL THEN
    SELECT id, order_number, total_amount, status
      INTO v_existing_order
      FROM customer_orders WHERE idempotency_key = p_idempotency_key;
    IF FOUND THEN
      RETURN jsonb_build_object(
        'id',           v_existing_order.id,
        'order_number', v_existing_order.order_number,
        'total_amount', v_existing_order.total_amount,
        'status',       v_existing_order.status,
        'deduplicated', TRUE
      );
    END IF;
  END IF;

  IF jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item';
  END IF;

  -- Pass 1: Lock rows, validate stock & published status, accumulate subtotal
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_qty := COALESCE((v_item->>'quantity')::INT, 0);
    IF v_qty <= 0 THEN
      RAISE EXCEPTION 'Invalid quantity for product %', v_item->>'product_id';
    END IF;

    SELECT * INTO v_product
    FROM products
    WHERE id = (v_item->>'product_id')::UUID
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product not found: %', v_item->>'product_id';
    END IF;
    IF NOT v_product.is_active OR NOT v_product.is_published OR v_product.approval_status <> 'approved' THEN
      RAISE EXCEPTION 'Product "%" is not currently available for purchase', v_product.name;
    END IF;
    IF COALESCE(v_product.is_locked_for_customers, FALSE) THEN
      RAISE EXCEPTION 'Product "%" is exclusively reserved for B2B supply', v_product.name;
    END IF;
    IF v_product.available_quantity < v_qty THEN
      RAISE EXCEPTION 'Insufficient stock for "%". Available: %, Requested: %',
        v_product.name, v_product.available_quantity, v_qty;
    END IF;

    v_subtotal := v_subtotal + (COALESCE(v_product.selling_price, v_product.price) * v_qty);
  END LOOP;

  IF v_subtotal >= 999 THEN v_delivery_fee := 0; END IF;
  v_total := v_subtotal + v_delivery_fee;
  v_order_number := 'ORD-CUST-' || to_char(NOW(), 'YYMMDD') || '-'
                    || substr(replace(uuid_generate_v4()::TEXT, '-', ''), 1, 5);

  INSERT INTO customer_orders (
    customer_id, customer_name, customer_phone, shipping_address,
    subtotal, delivery_fee, total_amount, status, order_number,
    payment_method, payment_status, delivery_slot, estimated_delivery, idempotency_key
  ) VALUES (
    v_user_id, p_customer_name, p_customer_phone, p_shipping_address,
    v_subtotal, v_delivery_fee, v_total, 'Order Placed', v_order_number,
    p_payment_method,
    CASE WHEN p_payment_method = 'cod' THEN 'Pending' ELSE 'Paid' END,
    p_delivery_slot, NOW() + INTERVAL '24 hours', p_idempotency_key
  )
  RETURNING id INTO v_order_id;

  -- Pass 2: Deduct inventory & insert line items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_qty := (v_item->>'quantity')::INT;
    SELECT * INTO v_product FROM products WHERE id = (v_item->>'product_id')::UUID;

    UPDATE products
    SET available_quantity = available_quantity - v_qty, updated_at = NOW()
    WHERE id = v_product.id;

    INSERT INTO customer_order_items (
      order_id, product_id, product_name, unit_price, quantity, total_price, farmer_id, farmer_name
    ) VALUES (
      v_order_id, v_product.id, v_product.name,
      COALESCE(v_product.selling_price, v_product.price),
      v_qty,
      COALESCE(v_product.selling_price, v_product.price) * v_qty,
      v_product.farmer_id, v_product.farmer_name
    );
  END LOOP;

  INSERT INTO payments (entity_type, entity_id, amount, payment_method, status, transaction_ref)
  VALUES (
    'Customer Checkout', v_order_id::TEXT, v_total,
    UPPER(p_payment_method),
    CASE WHEN p_payment_method = 'cod' THEN 'Pending' ELSE 'Success' END,
    'TXN-' || v_order_number
  );

  INSERT INTO audit_logs (user_id, actor_name, actor_role, action, entity_type, entity_id, new_values)
  VALUES (
    v_user_id, p_customer_name, 'customer', 'CUSTOMER_ORDER_PLACED',
    'customer_orders', v_order_id::TEXT,
    jsonb_build_object('order_number', v_order_number, 'total_amount', v_total, 'items', p_items)
  );

  RETURN jsonb_build_object(
    'id',           v_order_id,
    'order_number', v_order_number,
    'subtotal',     v_subtotal,
    'delivery_fee', v_delivery_fee,
    'total_amount', v_total,
    'status',       'Order Placed'
  );
END;
$$;

-- RPC: Admin review of Farmer Product Submission
CREATE OR REPLACE FUNCTION admin_review_product_submission(
  p_submission_id      UUID,
  p_decision           TEXT,
  p_admin_notes        TEXT    DEFAULT NULL,
  p_override_price     NUMERIC DEFAULT NULL,
  p_override_quantity  NUMERIC DEFAULT NULL,
  p_override_title     TEXT    DEFAULT NULL,
  p_override_description TEXT  DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_id    UUID := auth.uid();
  v_sub         RECORD;
  v_product_id  UUID;
  v_final_price NUMERIC(10,2);
  v_final_qty   NUMERIC(10,2);
  v_final_name  TEXT;
  v_final_desc  TEXT;
BEGIN
  IF NOT is_pure_krishi_admin() AND current_setting('role', TRUE) NOT IN ('service_role','postgres') THEN
    RAISE EXCEPTION 'Forbidden: only Admin can review product submissions';
  END IF;
  IF p_decision NOT IN ('approved','rejected','under_review') THEN
    RAISE EXCEPTION 'Invalid decision: %', p_decision;
  END IF;

  SELECT * INTO v_sub FROM farmer_product_submissions WHERE id = p_submission_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Submission not found: %', p_submission_id; END IF;

  v_final_price := COALESCE(p_override_price,       v_sub.proposed_price);
  v_final_qty   := COALESCE(p_override_quantity,    v_sub.proposed_quantity);
  v_final_name  := COALESCE(NULLIF(p_override_title,''),       v_sub.product_name);
  v_final_desc  := COALESCE(NULLIF(p_override_description,''), v_sub.description);

  IF p_decision = 'approved' THEN
    IF v_sub.target_product_id IS NOT NULL THEN
      UPDATE products SET
        name              = v_final_name,
        description       = COALESCE(v_final_desc, description),
        price             = v_final_price,
        selling_price     = v_final_price,
        available_quantity = CASE
          WHEN v_sub.submission_type = 'stock_update' THEN available_quantity + v_final_qty
          ELSE v_final_qty END,
        approval_status   = 'approved',
        is_published      = TRUE,
        is_active         = TRUE,
        approved_by       = v_admin_id,
        approved_at       = NOW(),
        updated_at        = NOW()
      WHERE id = v_sub.target_product_id
      RETURNING id INTO v_product_id;
    ELSE
      INSERT INTO products (
        name, category, price, selling_price, unit, available_quantity,
        image_url, description, farmer_id, farm_id, farmer_name,
        approval_status, is_published, is_active, approved_by, approved_at
      ) VALUES (
        v_final_name, v_sub.category, v_final_price, v_final_price, v_sub.unit, v_final_qty,
        COALESCE(v_sub.images[1], 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'),
        v_final_desc, v_sub.farmer_id, v_sub.farm_id, v_sub.farmer_name,
        'approved', TRUE, TRUE, v_admin_id, NOW()
      ) RETURNING id INTO v_product_id;
    END IF;
  END IF;

  UPDATE farmer_product_submissions SET
    status             = p_decision,
    admin_notes        = p_admin_notes,
    reviewed_by        = v_admin_id,
    reviewed_at        = NOW(),
    created_product_id = COALESCE(v_product_id, created_product_id),
    updated_at         = NOW()
  WHERE id = p_submission_id;

  INSERT INTO audit_logs (user_id, actor_role, action, entity_type, entity_id, old_values, new_values)
  VALUES (
    v_admin_id, 'super_admin',
    'ADMIN_REVIEW_SUBMISSION_' || UPPER(p_decision),
    'farmer_product_submissions', p_submission_id::TEXT,
    jsonb_build_object('status', v_sub.status, 'proposed_price', v_sub.proposed_price),
    jsonb_build_object('status', p_decision, 'product_id', v_product_id, 'final_price', v_final_price)
  );

  IF v_sub.submitted_by IS NOT NULL THEN
    INSERT INTO notifications (recipient_id, title, message, link) VALUES (
      v_sub.submitted_by,
      'Submission ' || INITCAP(p_decision) || ': ' || v_final_name,
      CASE
        WHEN p_decision = 'approved' THEN 'Your product was approved and published to the marketplace.'
        ELSE COALESCE('Admin note: ' || p_admin_notes, 'Your submission status was updated to ' || p_decision)
      END,
      '/farmer'
    );
  END IF;

  RETURN jsonb_build_object('submission_id', p_submission_id, 'status', p_decision, 'product_id', v_product_id);
END;
$$;

-- RPC: Admin approval of Farmer Stock Submission
CREATE OR REPLACE FUNCTION admin_approve_stock_submission(
  p_submission_id UUID,
  p_decision      TEXT,
  p_admin_notes   TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_id UUID := auth.uid();
  v_sub      RECORD;
BEGIN
  IF NOT is_pure_krishi_admin() AND current_setting('role', TRUE) NOT IN ('service_role','postgres') THEN
    RAISE EXCEPTION 'Forbidden: only Admin can approve stock submissions';
  END IF;
  IF p_decision NOT IN ('approved','rejected') THEN
    RAISE EXCEPTION 'Invalid decision: %', p_decision;
  END IF;

  SELECT * INTO v_sub FROM stock_submissions WHERE id = p_submission_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Stock submission not found: %', p_submission_id; END IF;
  IF v_sub.status <> 'pending' THEN
    RAISE EXCEPTION 'Stock submission already processed as %', v_sub.status;
  END IF;

  UPDATE stock_submissions SET
    status      = p_decision,
    admin_notes = p_admin_notes,
    reviewed_by = v_admin_id,
    reviewed_at = NOW()
  WHERE id = p_submission_id;

  IF p_decision = 'approved' THEN
    IF v_sub.product_id IS NOT NULL THEN
      UPDATE products SET
        available_quantity = available_quantity + v_sub.submitted_quantity,
        updated_at         = NOW()
      WHERE id = v_sub.product_id;
    END IF;
    IF v_sub.warehouse_id IS NOT NULL THEN
      INSERT INTO inventory_movements (warehouse_id, movement_type, quantity_kg, batch_id, created_by)
      VALUES (v_sub.warehouse_id, 'Inbound Harvest', v_sub.submitted_quantity, v_sub.harvest_batch_id, v_admin_id);
    END IF;
  END IF;

  INSERT INTO audit_logs (user_id, actor_role, action, entity_type, entity_id, new_values)
  VALUES (
    v_admin_id, 'super_admin',
    'ADMIN_STOCK_SUBMISSION_' || UPPER(p_decision),
    'stock_submissions', p_submission_id::TEXT,
    jsonb_build_object('product_name', v_sub.product_name, 'quantity', v_sub.submitted_quantity, 'status', p_decision)
  );

  RETURN jsonb_build_object('submission_id', p_submission_id, 'status', p_decision);
END;
$$;

-- =============================================================================
-- END OF 001_upgrade.sql
-- =============================================================================
