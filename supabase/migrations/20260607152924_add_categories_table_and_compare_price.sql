-- Create categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_ar text NOT NULL,
  slug text NOT NULL UNIQUE,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- RLS policies for categories (public read, admin write via service role)
CREATE POLICY "select_categories" ON categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "insert_categories" ON categories FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "update_categories" ON categories FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_categories" ON categories FOR DELETE TO anon, authenticated USING (true);

-- Seed default categories
INSERT INTO categories (name_en, name_ar, slug) VALUES
  ('Dresses', 'فساتين', 'Dresses'),
  ('Sets', 'سوت', 'Sets'),
  ('Pajamas', 'بيجامات', 'Pajamas');

-- Add compare_at_price column to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS compare_at_price numeric;

-- Fix product deletion FK constraint: change to ON DELETE SET NULL so products can be deleted
-- even if they are referenced in order_items
ALTER TABLE order_items DROP CONSTRAINT order_items_product_id_fkey;
ALTER TABLE order_items ADD CONSTRAINT order_items_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;
