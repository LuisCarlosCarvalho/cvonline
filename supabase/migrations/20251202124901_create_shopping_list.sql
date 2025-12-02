/*
  # Shopping List System Migration

  ## New Tables
  
  ### `shopping_lists`
  - `id` (uuid, primary key) - Unique identifier for each list
  - `name` (text) - Name of the shopping list
  - `created_at` (timestamptz) - When the list was created
  - `updated_at` (timestamptz) - Last update timestamp

  ### `shopping_items`
  - `id` (uuid, primary key) - Unique identifier for each item
  - `list_id` (uuid, foreign key) - Reference to shopping list
  - `name` (text) - Item name
  - `quantity` (integer) - Quantity needed
  - `unit` (text) - Unit of measurement (kg, un, l, etc)
  - `price` (decimal) - Price per unit (optional)
  - `is_completed` (boolean) - Whether item was purchased
  - `created_at` (timestamptz) - When item was added
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Anyone can create, read, update lists and items (public app)
  
  ## Notes
  - Simple public shopping list system
  - No authentication required for this mini project
  - Items track completion status
*/

-- Create shopping_lists table
CREATE TABLE IF NOT EXISTS shopping_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create shopping_items table
CREATE TABLE IF NOT EXISTS shopping_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id uuid NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
  name text NOT NULL,
  quantity integer DEFAULT 1,
  unit text DEFAULT 'un',
  price decimal(10, 2),
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Public access for mini project
CREATE POLICY "Anyone can view shopping lists"
  ON shopping_lists FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create shopping lists"
  ON shopping_lists FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update shopping lists"
  ON shopping_lists FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete shopping lists"
  ON shopping_lists FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view shopping items"
  ON shopping_items FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create shopping items"
  ON shopping_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update shopping items"
  ON shopping_items FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete shopping items"
  ON shopping_items FOR DELETE
  TO anon, authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_shopping_items_list ON shopping_items(list_id);
CREATE INDEX IF NOT EXISTS idx_shopping_items_completed ON shopping_items(is_completed);

-- Triggers for updated_at
CREATE TRIGGER update_shopping_lists_updated_at BEFORE UPDATE ON shopping_lists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shopping_items_updated_at BEFORE UPDATE ON shopping_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();