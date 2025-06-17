
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
      // Map component type to the expected database type
      const componentTypeMap: Record<string, 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel'> = {
        'engine': 'engine',
        'brakes': 'brake_system',
        'brake_system': 'brake_system',
        'frame': 'frame',
        'suspension': 'suspension',
        'wheels': 'wheel',
        'wheel': 'wheel'
      };
      
      const dbComponentType = componentTypeMap[componentType] || componentType as 'engine' | 'brake_system' | 'frame' | 'suspension' | 'wheel';
      const result = await canDeleteComponent(componentId, dbComponentType);
      
      return {
        canDelete: result.canDelete,
        usageCount: result.usage?.usageCount || 0,
        models: result.usage?.usedInModels || [],
        trims: result.usage?.usedInConfigurations || []
      };
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
