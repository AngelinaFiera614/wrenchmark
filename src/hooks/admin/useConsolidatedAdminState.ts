
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

  // Fetch models with debugging
  const { data: models = [], isLoading: modelsLoading, error: modelsError } = useQuery({
    queryKey: ["admin-models"],
    queryFn: async () => {
      console.log("🔍 Fetching models...");
      try {
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
        
        if (error) {
          console.error("❌ Models query error:", error);
          throw error;
        }
        
        console.log("✅ Models fetched successfully:", data?.length, "models");
        console.log("📊 Sample model:", data?.[0]);
        return data || [];
      } catch (err) {
        console.error("💥 Models fetch failed:", err);
        throw err;
      }
    }
  });

  // Log any models loading error
  useEffect(() => {
    if (modelsError) {
      console.error("🚨 Models loading error:", modelsError);
      toast({
        variant: "destructive",
        title: "Failed to Load Models",
        description: "Unable to fetch motorcycle models. Please check your connection and try again."
      });
    }
  }, [modelsError, toast]);

  // Fetch model years for selected model
  const { data: modelYears = [], isLoading: yearsLoading } = useQuery({
    queryKey: ["admin-model-years", selectedModel],
    queryFn: async () => {
      if (!selectedModel) return [];
      
      console.log("🔍 Fetching years for model:", selectedModel);
      const { data, error } = await supabase
        .from("model_years")
        .select("*")
        .eq("motorcycle_id", selectedModel)
        .order("year", { ascending: false });
      
      if (error) {
        console.error("❌ Years query error:", error);
        throw error;
      }
      
      console.log("✅ Years fetched:", data?.length, "years");
      return data || [];
    },
    enabled: !!selectedModel
  });

  // Fetch configurations for selected year
  const { data: configurations = [], isLoading: configsLoading } = useQuery({
    queryKey: ["admin-configurations", selectedYear],
    queryFn: async () => {
      if (!selectedYear) return [];
      
      console.log("🔍 Fetching configurations for year:", selectedYear);
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
      
      if (error) {
        console.error("❌ Configurations query error:", error);
        throw error;
      }
      
      console.log("✅ Configurations fetched:", data?.length, "configurations");
      return data || [];
    },
    enabled: !!selectedYear
  });

  // Derived data
  const selectedModelData = models.find(m => m.id === selectedModel);
  const selectedYearData = modelYears.find(y => y.id === selectedYear);
  const selectedConfigData = configurations.find(c => c.id === selectedConfig);

  // Debug selected data
  useEffect(() => {
    console.log("📊 Current selection state:", {
      selectedModel,
      selectedYear,
      selectedConfig,
      modelsCount: models.length,
      yearsCount: modelYears.length,
      configsCount: configurations.length
    });
  }, [selectedModel, selectedYear, selectedConfig, models.length, modelYears.length, configurations.length]);

  // Handlers
  const handleModelSelect = useCallback((modelId: string) => {
    console.log("🎯 Model selected:", modelId);
    setSelectedModel(modelId);
    setSelectedYear(null);
    setSelectedConfig(null);
  }, []);

  const handleYearSelect = useCallback((yearId: string) => {
    console.log("🎯 Year selected:", yearId);
    setSelectedYear(yearId);
    setSelectedConfig(null);
  }, []);

  const handleConfigSelect = useCallback((configId: string) => {
    console.log("🎯 Config selected:", configId);
    setSelectedConfig(configId);
  }, []);

  const refreshData = useCallback(() => {
    console.log("🔄 Refreshing all data...");
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
    modelsError,
    handleModelSelect,
    handleYearSelect,
    handleConfigSelect,
    refreshData
  };
};
