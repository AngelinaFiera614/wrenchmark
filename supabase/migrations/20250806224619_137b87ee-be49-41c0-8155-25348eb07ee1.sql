-- Enhance color_options table with critical missing data
ALTER TABLE color_options ADD COLUMN IF NOT EXISTS popularity_score INTEGER DEFAULT 0;
ALTER TABLE color_options ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available';
ALTER TABLE color_options ADD COLUMN IF NOT EXISTS production_years INT4RANGE;
ALTER TABLE color_options ADD COLUMN IF NOT EXISTS color_family TEXT;
ALTER TABLE color_options ADD COLUMN IF NOT EXISTS finish_type TEXT DEFAULT 'solid';
ALTER TABLE color_options ADD COLUMN IF NOT EXISTS msrp_premium_usd NUMERIC DEFAULT 0;
ALTER TABLE color_options ADD COLUMN IF NOT EXISTS special_edition_name TEXT;
ALTER TABLE color_options ADD COLUMN IF NOT EXISTS color_description TEXT;

-- Add color popularity tracking
CREATE TABLE IF NOT EXISTS color_popularity_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  color_option_id UUID NOT NULL REFERENCES color_options(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  popularity_rank INTEGER,
  selection_percentage NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE color_popularity_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage color popularity tracking" 
ON color_popularity_tracking FOR ALL 
USING (current_user_is_admin());

CREATE POLICY "Public can read color popularity tracking" 
ON color_popularity_tracking FOR SELECT 
USING (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_color_options_availability ON color_options(availability_status);
CREATE INDEX IF NOT EXISTS idx_color_options_color_family ON color_options(color_family);
CREATE INDEX IF NOT EXISTS idx_color_options_finish_type ON color_options(finish_type);
CREATE INDEX IF NOT EXISTS idx_color_popularity_year ON color_popularity_tracking(year);

-- Add trigger for updated_at
CREATE TRIGGER update_color_popularity_tracking_updated_at
  BEFORE UPDATE ON color_popularity_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();