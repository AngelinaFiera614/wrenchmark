-- Create table to store production sweep results
CREATE TABLE IF NOT EXISTS public.production_sweep_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL REFERENCES public.motorcycle_models(id) ON DELETE CASCADE,
  model_year integer,
  config_id uuid,
  completeness_overall integer,
  completeness_basic integer,
  completeness_components integer,
  completeness_dimensions integer,
  vpic_status text,
  vpic_matched_name text,
  vpic_total integer,
  vpic_url text,
  raw jsonb,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT production_sweep_unique_per_year UNIQUE (model_id, model_year)
);

-- Enable RLS
ALTER TABLE public.production_sweep_results ENABLE ROW LEVEL SECURITY;

-- Policies: admins can do all, no public write
CREATE POLICY "production_sweep_admin_all"
ON public.production_sweep_results
AS PERMISSIVE
FOR ALL
USING (current_user_is_admin())
WITH CHECK (current_user_is_admin());

-- Optional read policy for admins (covered by ALL above, but explicit)
CREATE POLICY "production_sweep_admin_read"
ON public.production_sweep_results
AS PERMISSIVE
FOR SELECT
USING (current_user_is_admin());

-- Trigger to keep updated_at current
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_production_sweep_updated_at ON public.production_sweep_results;
CREATE TRIGGER trg_production_sweep_updated_at
BEFORE UPDATE ON public.production_sweep_results
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_production_sweep_model ON public.production_sweep_results (model_id);
CREATE INDEX IF NOT EXISTS idx_production_sweep_created_at ON public.production_sweep_results (created_at DESC);
