
import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useConsolidatedAdminState = () => {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch models
  const { data: models = [], isLoading: modelsLoading } = useQuery({
    queryKey: ["admin-models"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("motorcycle_models")
        .select(`
          id,
          name,
          brand_id,
          production_start_year,
          production_end_year,
          production_status,
          brands!inner(name)
        `)
        .order("name");
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch model years for selected model
  const { data: modelYears = [], isLoading: yearsLoading } = useQuery({
    queryKey: ["admin-model-years", selectedModel],
    queryFn: async () => {
      if (!selectedModel) return [];
      
      const { data, error } = await supabase
        .from("model_years")
        .select("*")
        .eq("motorcycle_id", selectedModel)
        .order("year", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedModel
  });

  // Fetch configurations for selected year
  const { data: configurations = [], isLoading: configsLoading } = useQuery({
    queryKey: ["admin-configurations", selectedYear],
    queryFn: async () => {
      if (!selectedYear) return [];
      
      const { data, error } = await supabase
        .from("model_configurations")
        .select(`
          *,
          engines(name, displacement_cc),
          brake_systems(type),
          frames(type, material),
          suspensions(front_type, rear_type),
          wheels(type, front_size, rear_size)
        `)
        .eq("model_year_id", selectedYear)
        .order("name");
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedYear
  });

  // Derived data
  const selectedModelData = models.find(m => m.id === selectedModel);
  const selectedYearData = modelYears.find(y => y.id === selectedYear);
  const selectedConfigData = configurations.find(c => c.id === selectedConfig);

  // Handlers
  const handleModelSelect = useCallback((modelId: string) => {
    setSelectedModel(modelId);
    setSelectedYear(null);
    setSelectedConfig(null);
  }, []);

  const handleYearSelect = useCallback((yearId: string) => {
    setSelectedYear(yearId);
    setSelectedConfig(null);
  }, []);

  const handleConfigSelect = useCallback((configId: string) => {
    setSelectedConfig(configId);
  }, []);

  const refreshData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["admin-models"] });
    if (selectedModel) {
      queryClient.invalidateQueries({ queryKey: ["admin-model-years", selectedModel] });
    }
    if (selectedYear) {
      queryClient.invalidateQueries({ queryKey: ["admin-configurations", selectedYear] });
    }
    
    toast({
      title: "Data Refreshed",
      description: "All data has been refreshed successfully"
    });
  }, [selectedModel, selectedYear, queryClient, toast]);

  return {
    selectedModel,
    selectedYear,
    selectedConfig,
    models,
    modelYears,
    configurations,
    selectedModelData,
    selectedYearData,
    selectedConfigData,
    modelsLoading,
    yearsLoading,
    configsLoading,
    handleModelSelect,
    handleYearSelect,
    handleConfigSelect,
    refreshData
  };
};
