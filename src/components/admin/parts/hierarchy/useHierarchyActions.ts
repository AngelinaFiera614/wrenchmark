
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { generateModelYears } from "@/services/models/modelYearService";

export const useHierarchyActions = () => {
  const [generatingYears, setGeneratingYears] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleRetryModelYears = (selectedModel: string | null, onModelSelect: (modelId: string) => void) => {
    // Re-trigger the model selection to refetch data
    if (selectedModel) {
      onModelSelect(selectedModel);
    }
  };

  const handleGenerateModelYears = async (selectedModel: string | null, onModelSelect: (modelId: string) => void) => {
    if (!selectedModel) return;

    setGeneratingYears(true);
    try {
      const success = await generateModelYears(selectedModel);
      if (success) {
        toast({
          title: "Model years generated",
          description: "Model years have been automatically generated based on production range.",
        });
        // Refresh the model years data
        queryClient.invalidateQueries({ queryKey: ["model-years", selectedModel] });
        // Re-trigger the model selection to refetch data
        onModelSelect(selectedModel);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to generate years",
          description: "Could not generate model years. Please check the model's production data.",
        });
      }
    } catch (error) {
      console.error("Error generating model years:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while generating model years.",
      });
    } finally {
      setGeneratingYears(false);
    }
  };

  return {
    generatingYears,
    handleRetryModelYears,
    handleGenerateModelYears
  };
};
