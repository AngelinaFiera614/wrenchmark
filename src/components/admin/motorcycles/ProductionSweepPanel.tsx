import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

interface MotorcycleLite {
  id: string;
  name: string;
  type?: string | null;
  production_status?: string | null;
  production_end_year?: number | null;
  brand?: { id?: string; name?: string } | null;
  brands?: { id?: string; name?: string } | null; // some shapes use `brands`
}

interface SweepRowResult {
  modelId: string;
  brand: string;
  model: string;
  year?: number;
  completeness?: { overall: number; basicInfo: number; components: number; dimensions: number } | null;
  vpic: {
    status: "confirmed" | "no_match" | "skipped";
    matchedName?: string;
    totalReturned?: number;
    url?: string;
  };
}

const currentYear = new Date().getFullYear();

const aliasMake = (make: string) => {
  const map: Record<string, string> = {
    "BMW Motorrad": "BMW",
    "CFMoto": "CFMOTO",
    "CF MOTO": "CFMOTO",
    "Harley Davidson": "Harley-Davidson",
    "Husqvarna Motorcycles": "Husqvarna",
  };
  return map[make] || make;
};

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/factory|sp|rr|rally|special|edition/g, "");

const isModelMatch = (a: string, b: string) => {
  const na = normalize(a);
  const nb = normalize(b);
  return na.includes(nb) || nb.includes(na);
};

export const ProductionSweepPanel: React.FC<{ motorcycles: MotorcycleLite[] }> = ({ motorcycles }) => {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SweepRowResult[]>([]);

  const activeModels = useMemo(() => {
    return motorcycles.filter((m) => {
      const statusOk = (m.production_status || "active") === "active";
      const endOk = !m.production_end_year || m.production_end_year >= currentYear;
      return statusOk && endOk;
    });
  }, [motorcycles]);

  const runSweep = async () => {
    setRunning(true);
    setProgress(0);
    setResults([]);

    try {
      // 1) Collect latest model year per model
      const modelIds = activeModels.map((m) => m.id);
      const { data: yearsData, error: yearsError } = await supabase
        .from("model_years")
        .select("id, year, motorcycle_id, is_draft")
        .in("motorcycle_id", modelIds);
      if (yearsError) throw yearsError;

      const latestYearByModel = new Map<string, { id: string; year: number }>();
      yearsData?.forEach((y) => {
        const existing = latestYearByModel.get(y.motorcycle_id);
        if (!existing || y.year > existing.year) {
          latestYearByModel.set(y.motorcycle_id, { id: y.id, year: y.year });
        }
      });

      // 2) Fetch configurations for the latest years
      const latestYearIds = Array.from(latestYearByModel.values()).map((v) => v.id);
      let configsByYear = new Map<string, { id: string; is_default: boolean }>();
      if (latestYearIds.length > 0) {
        const { data: configs, error: cfgErr } = await supabase
          .from("model_configurations")
          .select("id, is_default, model_year_id")
          .in("model_year_id", latestYearIds);
        if (cfgErr) throw cfgErr;
        // choose default if available, else first seen
        configs?.forEach((c) => {
          const prev = configsByYear.get(c.model_year_id);
          if (!prev || c.is_default) configsByYear.set(c.model_year_id, { id: c.id, is_default: !!c.is_default });
        });
      }

      const total = activeModels.length;
      let processed = 0;
      const newResults: SweepRowResult[] = [];

      for (const model of activeModels) {
        const brandName = model.brand?.name || model.brands?.name || "Unknown";
        const latest = latestYearByModel.get(model.id);
        const configForYear = latest ? configsByYear.get(latest.id) : undefined;

        // 3) Completeness via RPC (optional if config exists)
        let completeness: SweepRowResult["completeness"] = null;
        if (configForYear) {
          const { data: compData, error: compErr } = await supabase
            .rpc("calculate_configuration_completeness", { config_id: configForYear.id });
          if (compErr) {
            // non-fatal
            console.warn("Completeness RPC error", compErr);
          } else if (compData) {
            completeness = compData as any;
          }
        }

        // 4) vPIC check (US, no key)
        let vpic: SweepRowResult["vpic"] = { status: "skipped" };
        if (brandName !== "Unknown" && latest?.year) {
          const make = encodeURIComponent(aliasMake(brandName));
          const url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/modelyear/${latest.year}?format=json`;
          try {
            const res = await fetch(url);
            const json = await res.json();
            const list: Array<{ Model_Name: string }> = json?.Results || [];
            const match = list.find((r) => isModelMatch(model.name, r.Model_Name));
            vpic = {
              status: match ? "confirmed" : "no_match",
              matchedName: match?.Model_Name,
              totalReturned: list.length,
              url,
            };
          } catch (e) {
            console.warn("VPIC request failed", e);
            vpic = { status: "skipped" };
          }
        }

        newResults.push({
          modelId: model.id,
          brand: brandName,
          model: model.name,
          year: latest?.year,
          completeness,
          vpic,
        });

        processed += 1;
        setProgress(Math.round((processed / total) * 100));
      }

      setResults(newResults);
    } catch (e) {
      console.error("Production sweep failed", e);
    } finally {
      setRunning(false);
    }
  };

  const exportJson = () => {
    const dataStr = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
    const link = document.createElement("a");
    link.href = dataStr;
    link.download = `production_sweep_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2">
        <CardTitle>Current production sweep</CardTitle>
        <div className="flex items-center gap-2">
          <Button onClick={runSweep} disabled={running}>
            {running ? "Running…" : "Run vPIC + completeness sweep"}
          </Button>
          <Button variant="outline" onClick={exportJson} disabled={results.length === 0}>
            Export JSON
          </Button>
          <Badge variant="secondary">{activeModels.length} active models</Badge>
        </div>
        {running && (
          <div className="mt-2">
            <Progress value={progress} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <p className="text-muted-foreground">No results yet. Run the sweep to see verification and completeness.</p>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="py-2 pr-4">Brand</th>
                  <th className="py-2 pr-4">Model</th>
                  <th className="py-2 pr-4">Year</th>
                  <th className="py-2 pr-4">Completeness</th>
                  <th className="py-2 pr-4">VPIC</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.modelId} className="border-t">
                    <td className="py-2 pr-4">{r.brand}</td>
                    <td className="py-2 pr-4">{r.model}</td>
                    <td className="py-2 pr-4">{r.year ?? "–"}</td>
                    <td className="py-2 pr-4">
                      {r.completeness ? (
                        <div className="flex items-center gap-2">
                          <div className="w-28"><Progress value={r.completeness.overall} /></div>
                          <span className="text-xs text-muted-foreground">{r.completeness.overall}%</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">n/a</span>
                      )}
                    </td>
                    <td className="py-2 pr-4">
                      {r.vpic.status === "confirmed" ? (
                        <Badge className="mr-2" variant="default">Confirmed</Badge>
                      ) : r.vpic.status === "no_match" ? (
                        <Badge className="mr-2" variant="destructive">No match</Badge>
                      ) : (
                        <Badge className="mr-2" variant="secondary">Skipped</Badge>
                      )}
                      {r.vpic.url && (
                        <a href={r.vpic.url} target="_blank" rel="noreferrer" className="underline text-sm">
                          {r.vpic.totalReturned ?? 0} results
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductionSweepPanel;
