
import React from "react";
import { FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { BrandFormValues } from "../BrandFormSchema";
import { MilestoneItem } from "./milestone/MilestoneItem";
import { AddMilestoneButton } from "./milestone/AddMilestoneButton";
import { useMilestonesManagement } from "../hooks/useMilestonesManagement";

interface BrandMilestonesFieldProps {
  form: UseFormReturn<BrandFormValues>;
}

export default function BrandMilestonesField({ form }: BrandMilestonesFieldProps) {
  const { milestones, addMilestone, removeMilestone } = useMilestonesManagement(form);

  return (
    <FormField
      control={form.control}
      name="milestones"
      render={() => (
        <FormItem>
          <FormLabel>Milestones</FormLabel>
          <FormDescription>
            Key dates and events in the brand's history.
          </FormDescription>

          <div className="space-y-4">
            {milestones.map((_, index) => (
              <MilestoneItem
                key={index}
                form={form}
                index={index}
                onRemove={removeMilestone}
              />
            ))}
            
            <AddMilestoneButton onClick={addMilestone} />
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
