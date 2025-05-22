
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { BrandFormValues } from "../BrandFormSchema";
import { createMilestonesField } from "@/services/brandService";
import { useToast } from "@/hooks/use-toast";

export function useMilestonesManagement(form: UseFormReturn<BrandFormValues>) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const milestones = form.watch("milestones") || [];

  const addMilestone = () => {
    try {
      setIsLoading(true);
      const newMilestones = [...milestones, ...createMilestonesField()];
      form.setValue("milestones", newMilestones);
      form.trigger("milestones");
    } catch (error) {
      console.error("Error adding milestone:", error);
      toast({
        variant: "destructive",
        title: "Error adding milestone",
        description: "Failed to add milestone. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeMilestone = (index: number) => {
    try {
      const updatedMilestones = [...milestones];
      updatedMilestones.splice(index, 1);
      form.setValue("milestones", updatedMilestones);
      form.trigger("milestones");
    } catch (error) {
      console.error("Error removing milestone:", error);
      toast({
        variant: "destructive",
        title: "Error removing milestone",
        description: "Failed to remove milestone. Please try again.",
      });
    }
  };

  const sortMilestonesByYear = () => {
    if (!milestones.length) return;
    
    try {
      const sortedMilestones = [...milestones].sort((a, b) => a.year - b.year);
      form.setValue("milestones", sortedMilestones);
    } catch (error) {
      console.error("Error sorting milestones:", error);
    }
  };

  return {
    milestones,
    isLoading,
    addMilestone,
    removeMilestone,
    sortMilestonesByYear
  };
}
