-- Migration: Add local sales tracking table
-- This table will store daily local sales entries for the unified dashboard

CREATE TABLE IF NOT EXISTS local_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  estimated_orders INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure only one entry per date
  UNIQUE(date)
);

-- Create index for faster date queries
CREATE INDEX IF NOT EXISTS idx_local_sales_date ON local_sales(date);

-- Add RLS (Row Level Security)
ALTER TABLE local_sales ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (admin access)
CREATE POLICY "Admin can manage local sales" ON local_sales
  FOR ALL USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_local_sales_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_local_sales_updated_at
  BEFORE UPDATE ON local_sales
  FOR EACH ROW
  EXECUTE FUNCTION update_local_sales_updated_at();

-- Insert sample data for testing
INSERT INTO local_sales (date, total_amount, estimated_orders, notes) 
VALUES 
  (CURRENT_DATE - INTERVAL '1 day', 850.00, 34, 'Día normal de ventas'),
  (CURRENT_DATE - INTERVAL '2 days', 920.50, 38, 'Buen día, promoción de almuerzo'),
  (CURRENT_DATE - INTERVAL '3 days', 780.00, 31, 'Día tranquilo')
ON CONFLICT (date) DO NOTHING;