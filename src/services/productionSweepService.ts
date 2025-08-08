import { supabase } from "@/integrations/supabase/client";

export interface SweepResultRow {
  model_id: string;
  model_year?: number | null;
  config_id?: string | null;
  completeness_overall?: number | null;
  completeness_basic?: number | null;
  completeness_components?: number | null;
  completeness_dimensions?: number | null;
  vpic_status?: string | null;
  vpic_matched_name?: string | null;
  vpic_total?: number | null;
  vpic_url?: string | null;
  raw?: any;
}

export async function upsertSweepResults(rows: SweepResultRow[]): Promise<{ inserted: number }> {
  if (!rows.length) return { inserted: 0 };

  const { error } = await supabase
    .from('production_sweep_results')
    .upsert(
      rows.map(r => ({
        model_id: r.model_id,
        model_year: r.model_year ?? null,
        config_id: r.config_id ?? null,
        completeness_overall: r.completeness_overall ?? null,
        completeness_basic: r.completeness_basic ?? null,
        completeness_components: r.completeness_components ?? null,
        completeness_dimensions: r.completeness_dimensions ?? null,
        vpic_status: r.vpic_status ?? null,
        vpic_matched_name: r.vpic_matched_name ?? null,
        vpic_total: r.vpic_total ?? null,
        vpic_url: r.vpic_url ?? null,
        raw: r.raw ?? null,
      })),
      { onConflict: 'model_id,model_year' }
    );

  if (error) throw error;
  return { inserted: rows.length };
}

export async function fetchLatestSweepResultsForModels(modelIds: string[]) {
  if (!modelIds.length) return [] as any[];

  const { data, error } = await supabase
    .from('production_sweep_results')
    .select('model_id, model_year, completeness_overall, completeness_basic, completeness_components, completeness_dimensions, vpic_status, vpic_matched_name, vpic_total, vpic_url, raw, created_at')
    .in('model_id', modelIds)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Deduplicate by model_id, keeping the latest
  const seen = new Set<string>();
  const latest: any[] = [];
  for (const row of data || []) {
    if (!seen.has(row.model_id)) {
      latest.push(row);
      seen.add(row.model_id);
    }
  }
  return latest;
}
