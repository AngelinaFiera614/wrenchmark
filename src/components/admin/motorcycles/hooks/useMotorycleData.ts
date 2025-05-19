
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MotorcycleGridItem } from "../types";

export const useMotorcycleData = () => {
  const [motorcycles, setMotorcycles] = useState<MotorcycleGridItem[]>([]);
  const [originalData, setOriginalData] = useState<Record<string, MotorcycleGridItem>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch motorcycles with brand info
  const fetchMotorcycles = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("motorcycles")
        .select(`
          id,
          model_name,
          brand_id,
          year,
          summary,
          status,
          year_end,
          brands:brand_id (
            id,
            name
          )
        `)
        .order("model_name");

      if (error) throw error;

      if (!data) {
        toast({
          variant: "destructive",
          title: "Failed to load motorcycles",
          description: "No data was returned from the database.",
        });
        setIsLoading(false);
        return;
      }

      // Transform data for the grid
      const formattedData = data.map((item: any) => ({
        id: item.id,
        model_name: item.model_name,
        brand_id: item.brand_id,
        brand_name: item.brands?.name || "Unknown",
        year_start: item.year || undefined,
        year_end: item.year_end || null,
        description: item.summary || "", // Use summary instead of description
        status: item.status || "draft",
        isDirty: false,
      }));

      setMotorcycles(formattedData);
      
      // Initialize original data for cancel operations
      const originalMap: Record<string, MotorcycleGridItem> = {};
      formattedData.forEach(item => {
        originalMap[item.id] = { ...item };
      });
      setOriginalData(originalMap);
    } catch (error) {
      console.error("Error fetching motorcycles:", error);
      toast({
        variant: "destructive",
        title: "Failed to load motorcycles",
        description: "There was an error loading the motorcycle data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMotorcycles();
  }, []);

  return {
    motorcycles,
    setMotorcycles,
    originalData,
    setOriginalData,
    isLoading,
    fetchMotorcycles
  };
};
