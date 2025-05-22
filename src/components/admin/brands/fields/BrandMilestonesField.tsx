
import React, { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { BrandFormValues } from "../BrandFormSchema";
import { MilestoneItem } from "./milestone/MilestoneItem";
import { AddMilestoneButton } from "./milestone/AddMilestoneButton";
import { useMilestonesManagement } from "../hooks/useMilestonesManagement";
import { Button } from "@/components/ui/button";
import { ArrowDownUp } from "lucide-react";

interface BrandMilestonesFieldProps {
  form: UseFormReturn<BrandFormValues>;
}

export default function BrandMilestonesField({ form }: BrandMilestonesFieldProps) {
  const { milestones, isLoading, addMilestone, removeMilestone, sortMilestonesByYear } = useMilestonesManagement(form);
  
  // Sort milestones when component mounts or milestones change
  useEffect(() => {
    if (milestones.length > 1) {
      sortMilestonesByYear();
    }
  }, []);

  return (
    <FormField
      control={form.control}
      name="milestones"
      render={() => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>Milestones</FormLabel>
            {milestones.length > 1 && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={sortMilestonesByYear}
              >
                <ArrowDownUp className="h-4 w-4 mr-1" />
                Sort by year
              </Button>
            )}
          </div>
          
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
            
            <AddMilestoneButton 
              onClick={addMilestone} 
              isLoading={isLoading} 
              isDisabled={isLoading} 
            />
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
