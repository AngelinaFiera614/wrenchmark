import { useEffect, useMemo, useState } from "react";
import { fetchLatestSweepResultsForModels } from "@/services/productionSweepService";

export function useProductionSweepResults(modelIds: string[]) {
  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState<Record<string, any>>({});

  const ids = useMemo(() => Array.from(new Set(modelIds)).filter(Boolean), [modelIds.join(',')]);

  useEffect(() => {
    let isMounted = true;
    if (!ids.length) {
      setMap({});
      return;
    }
    setLoading(true);
    fetchLatestSweepResultsForModels(ids)
      .then((rows) => {
        if (!isMounted) return;
        const m: Record<string, any> = {};
        rows.forEach((r: any) => { m[r.model_id] = r; });
        setMap(m);
      })
      .catch(() => { if (isMounted) setMap({}); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [ids]);

  return { loading, resultsMap: map };
}
