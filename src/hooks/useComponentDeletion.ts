
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { canDeleteComponent } from "@/services/modelComponentService";

interface ComponentUsageInfo {
  canDelete: boolean;
  usageCount: number;
  models: string[];
  trims: string[];
}

export const useComponentDeletion = () => {
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);

  const checkComponentUsage = async (
    componentType: string,
    componentId: string
  ): Promise<ComponentUsageInfo | null> => {
    setIsChecking(true);
    try {
      const usageInfo = await canDeleteComponent(componentType, componentId);
      return usageInfo;
    } catch (error) {
      console.error("Error checking component usage:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to check component usage. Please try again.",
      });
      return null;
    } finally {
      setIsChecking(false);
    }
  };

  return {
    checkComponentUsage,
    isChecking
  };
};
