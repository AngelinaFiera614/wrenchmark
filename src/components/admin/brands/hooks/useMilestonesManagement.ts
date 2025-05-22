
import { UseFormReturn } from "react-hook-form";
import { BrandFormValues } from "../BrandFormSchema";
import { createMilestonesField } from "@/services/brandService";

export function useMilestonesManagement(form: UseFormReturn<BrandFormValues>) {
  const milestones = form.watch("milestones") || [];

  const addMilestone = () => {
    form.setValue("milestones", [...milestones, ...createMilestonesField()]);
  };

  const removeMilestone = (index: number) => {
    const updatedMilestones = [...milestones];
    updatedMilestones.splice(index, 1);
    form.setValue("milestones", updatedMilestones);
  };

  return {
    milestones,
    addMilestone,
    removeMilestone
  };
}
