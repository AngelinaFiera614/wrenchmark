
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { autofillService } from "@/services/autofillService";
import { ModelSuggestion, FetchedModelData } from "@/types/autofill";

export function useModelAutofill() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ModelSuggestion | null>(null);
  const { toast } = useToast();

  const fetchModelInfo = async (model: any) => {
    if (!model?.brand?.name || !model?.name) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Model must have a brand and name to fetch suggestions.",
      });
      return false;
    }

    if (model.ignore_autofill) {
      toast({
        variant: "destructive",
        title: "Autofill Disabled",
        description: "Autofill has been disabled for this model.",
      });
      return false;
    }

    setIsLoading(true);
    
    try {
      // Check for existing suggestions first
      const existingSuggestions = await autofillService.getSuggestions(model.id);
      if (existingSuggestions) {
        setSuggestions(existingSuggestions);
        toast({
          title: "Suggestions Found",
          description: "Using previously fetched suggestions.",
        });
        return true;
      }

      // Fetch new data
      const fetchedData = await autofillService.fetchModelData(
        model.brand.name,
        model.name
      );

      if (!fetchedData) {
        toast({
          variant: "destructive",
          title: "No Data Found",
          description: "Could not fetch suggestions for this model.",
        });
        return false;
      }

      // Store suggestions
      const storedSuggestions = await autofillService.storeSuggestions(
        model.id,
        fetchedData,
        'Mock API'
      );

      if (!storedSuggestions) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to store suggestions.",
        });
        return false;
      }

      // Log the fetch attempt
      await autofillService.logAction(
        model.id,
        'fetch',
        {},
        {},
        'Mock API',
        `Fetched suggestions for ${model.brand.name} ${model.name}`
      );

      setSuggestions(storedSuggestions);
      
      toast({
        title: "Suggestions Fetched",
        description: "Model suggestions have been fetched successfully.",
      });

      return true;
    } catch (error) {
      console.error('Error fetching model info:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch model suggestions.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearSuggestions = () => {
    setSuggestions(null);
  };

  return {
    isLoading,
    suggestions,
    fetchModelInfo,
    clearSuggestions
  };
}
