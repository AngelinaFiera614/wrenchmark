
import { createContext, useContext, useState, ReactNode } from "react";
import { Motorcycle } from "@/types";
import { toast } from "sonner";

type ComparisonContextType = {
  motorcyclesToCompare: Motorcycle[];
  addToComparison: (motorcycle: Motorcycle) => void;
  removeFromComparison: (motorcycleId: string) => void;
  clearComparison: () => void;
  isInComparison: (motorcycleId: string) => boolean;
};

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider = ({ children }: { children: ReactNode }) => {
  const [motorcyclesToCompare, setMotorcyclesToCompare] = useState<Motorcycle[]>([]);

  const addToComparison = (motorcycle: Motorcycle) => {
    if (motorcyclesToCompare.length >= 3) {
      toast.error("Comparison limit reached", {
        description: "You can compare up to 3 motorcycles at once. Remove one to add another."
      });
      return;
    }
    
    setMotorcyclesToCompare((prev) => [...prev, motorcycle]);
    toast.success("Added to comparison", {
      description: `${motorcycle.make} ${motorcycle.model} added to comparison`
    });
  };

  const removeFromComparison = (motorcycleId: string) => {
    setMotorcyclesToCompare((prev) => 
      prev.filter((m) => m.id !== motorcycleId)
    );
  };

  const clearComparison = () => {
    setMotorcyclesToCompare([]);
  };

  const isInComparison = (motorcycleId: string) => {
    return motorcyclesToCompare.some((m) => m.id === motorcycleId);
  };

  return (
    <ComparisonContext.Provider
      value={{
        motorcyclesToCompare,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
};
