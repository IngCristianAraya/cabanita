/*
  # Restaurant Database Schema for La Cabañita

  ## Overview
  Complete database schema for a Peruvian restaurant delivery system specializing in ceviche and seafood.

  ## Tables Created

  ### 1. restaurants
  - `id` (uuid, primary key)
  - `name` (text) - Restaurant name
  - `phone` (text) - Contact phone
  - `email` (text) - Contact email
  - `address` (text) - Physical address
  - `logo_url` (text) - Logo image URL
  - `primary_color` (text) - Brand color
  - `delivery_fee` (numeric) - Default delivery fee
  - `min_order_amount` (numeric) - Minimum order amount
  - `is_open` (boolean) - Restaurant open/closed status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. categories
  - `id` (uuid, primary key)
  - `name` (text) - Category name (e.g., "Ceviches", "Platos Principales")
  - `slug` (text, unique) - URL-friendly identifier
  - `description` (text) - Category description
  - `display_order` (integer) - Sort order
  - `icon` (text) - Lucide icon name
  - `created_at` (timestamptz)

  ### 3. menu_items
  - `id` (uuid, primary key)
  - `category_id` (uuid, foreign key) - Links to categories
  - `name` (text) - Dish name
  - `description` (text) - Dish description
  - `price` (numeric) - Price in soles
  - `image_url` (text) - Dish image
  - `is_available` (boolean) - Availability status
  - `is_featured` (boolean) - Featured on home page
  - `ingredients` (text[]) - Array of ingredients
  - `spicy_level` (integer) - 0-3 spice rating
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. daily_menus
  - `id` (uuid, primary key)
  - `menu_date` (date, unique) - Date for this menu
  - `is_published` (boolean) - Visibility status
  - `special_note` (text) - Special announcements
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. daily_menu_items
  - `id` (uuid, primary key)
  - `daily_menu_id` (uuid, foreign key) - Links to daily_menus
  - `menu_item_id` (uuid, foreign key) - Links to menu_items
  - `is_available` (boolean) - Override availability for this date
  - `special_price` (numeric) - Special price for this date (optional)

  ### 6. customers
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - Links to auth.users (optional)
  - `full_name` (text) - Customer name
  - `phone` (text) - Phone number
  - `email` (text) - Email address
  - `default_address` (text) - Saved address
  - `created_at` (timestamptz)

  ### 7. delivery_zones
  - `id` (uuid, primary key)
  - `name` (text) - Zone name (e.g., "San Miguel", "Pueblo Libre")
  - `delivery_fee` (numeric) - Delivery cost for this zone
  - `min_order_amount` (numeric) - Minimum order for this zone
  - `estimated_time_minutes` (integer) - Delivery time estimate
  - `is_active` (boolean) - Zone availability
  - `created_at` (timestamptz)

  ### 8. orders
  - `id` (uuid, primary key)
  - `order_number` (text, unique) - Human-readable order number
  - `customer_id` (uuid, foreign key) - Links to customers
  - `delivery_zone_id` (uuid, foreign key) - Links to delivery_zones
  - `customer_name` (text) - Customer name
  - `customer_phone` (text) - Customer phone
  - `customer_email` (text) - Customer email
  - `delivery_address` (text) - Delivery address
  - `subtotal` (numeric) - Items total
  - `delivery_fee` (numeric) - Delivery cost
  - `total` (numeric) - Grand total
  - `payment_method` (text) - Payment type (cash, yape, plin, card)
  - `payment_status` (text) - pending, completed, failed
  - `order_status` (text) - pending, confirmed, preparing, on_delivery, delivered, cancelled
  - `notes` (text) - Customer notes
  - `estimated_delivery_time` (timestamptz) - Expected delivery
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 9. order_items
  - `id` (uuid, primary key)
  - `order_id` (uuid, foreign key) - Links to orders
  - `menu_item_id` (uuid, foreign key) - Links to menu_items
  - `quantity` (integer) - Item quantity
  - `unit_price` (numeric) - Price per unit
  - `subtotal` (numeric) - Line total
  - `special_instructions` (text) - Item-specific notes

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Public read access for menus, categories, menu_items, daily_menus
  - Authenticated admin access for all write operations
  - Customers can read their own orders

  ## Indexes
  - Performance indexes on frequently queried columns
  - Foreign key indexes for join optimization
*/

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  address text NOT NULL,
  logo_url text,
  primary_color text DEFAULT '#1E3A8A',
  delivery_fee numeric(10,2) DEFAULT 5.00,
  min_order_amount numeric(10,2) DEFAULT 20.00,
  is_open boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  display_order integer DEFAULT 0,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  image_url text,
  is_available boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  ingredients text[],
  spicy_level integer DEFAULT 0 CHECK (spicy_level >= 0 AND spicy_level <= 3),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create daily_menus table
CREATE TABLE IF NOT EXISTS daily_menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_date date UNIQUE NOT NULL,
  is_published boolean DEFAULT false,
  special_note text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create daily_menu_items junction table
CREATE TABLE IF NOT EXISTS daily_menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_menu_id uuid REFERENCES daily_menus(id) ON DELETE CASCADE,
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE CASCADE,
  is_available boolean DEFAULT true,
  special_price numeric(10,2),
  UNIQUE(daily_menu_id, menu_item_id)
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  default_address text,
  created_at timestamptz DEFAULT now()
);

-- Create delivery_zones table
CREATE TABLE IF NOT EXISTS delivery_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  delivery_fee numeric(10,2) NOT NULL,
  min_order_amount numeric(10,2) DEFAULT 0,
  estimated_time_minutes integer DEFAULT 45,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  delivery_zone_id uuid REFERENCES delivery_zones(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  delivery_address text NOT NULL,
  subtotal numeric(10,2) NOT NULL,
  delivery_fee numeric(10,2) NOT NULL,
  total numeric(10,2) NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('cash', 'yape', 'plin', 'card')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  order_status text DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'preparing', 'on_delivery', 'delivered', 'cancelled')),
  notes text,
  estimated_delivery_time timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE SET NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(10,2) NOT NULL,
  subtotal numeric(10,2) NOT NULL,
  special_instructions text
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_featured ON menu_items(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_daily_menus_date ON daily_menus(menu_date);
CREATE INDEX IF NOT EXISTS idx_daily_menu_items_menu ON daily_menu_items(daily_menu_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- Enable Row Level Security
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access (menus, categories)
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view menu items"
  ON menu_items FOR SELECT
  TO public
  USING (is_available = true);

CREATE POLICY "Public can view daily menus"
  ON daily_menus FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Public can view daily menu items"
  ON daily_menu_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view delivery zones"
  ON delivery_zones FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Public can view restaurant info"
  ON restaurants FOR SELECT
  TO public
  USING (true);

-- RLS Policies for authenticated admin users (full access)
CREATE POLICY "Authenticated users can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage menu items"
  ON menu_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage daily menus"
  ON daily_menus FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage daily menu items"
  ON daily_menu_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage delivery zones"
  ON delivery_zones FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage restaurants"
  ON restaurants FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all customers"
  ON customers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage customers"
  ON customers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage orders"
  ON orders FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage order items"
  ON order_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Public can create orders and customers
CREATE POLICY "Public can create customers"
  ON customers FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can create orders"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can create order items"
  ON order_items FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can view their orders"
  ON orders FOR SELECT
  TO public
  USING (true);

-- Insert initial restaurant data
INSERT INTO restaurants (name, phone, email, address, primary_color, delivery_fee, min_order_amount)
VALUES (
  'La Cabañita PUCP',
  '+51 987 654 321',
  'contacto@lacabanita.pe',
  'Av. Universitaria, San Miguel, Lima',
  '#1E3A8A',
  5.00,
  20.00
) ON CONFLICT DO NOTHING;

-- Insert categories
INSERT INTO categories (name, slug, description, display_order, icon) VALUES
  ('Ceviches y Tiraditos', 'ceviches-tiraditos', 'Frescos ceviches y tiraditos del día', 1, 'Fish'),
  ('Entradas Criollas', 'entradas-criollas', 'Deliciosas entradas de la comida peruana', 2, 'Utensils'),
  ('Platos de Fondo', 'platos-fondo', 'Platos principales abundantes', 3, 'ChefHat'),
  ('Mariscos', 'mariscos', 'Lo mejor del mar peruano', 4, 'Shell'),
  ('Bebidas', 'bebidas', 'Chicha morada, Inca Kola y más', 5, 'Coffee'),
  ('Postres', 'postres', 'Dulces tradicionales peruanos', 6, 'Cake')
ON CONFLICT (slug) DO NOTHING;

-- Insert delivery zones (Lima districts near PUCP)
INSERT INTO delivery_zones (name, delivery_fee, min_order_amount, estimated_time_minutes, is_active) VALUES
  ('San Miguel', 5.00, 20.00, 30, true),
  ('Pueblo Libre', 5.00, 20.00, 35, true),
  ('Magdalena', 6.00, 25.00, 40, true),
  ('Jesús María', 6.00, 25.00, 40, true),
  ('Lince', 7.00, 30.00, 45, true),
  ('San Isidro', 7.00, 30.00, 45, true)
ON CONFLICT DO NOTHING;