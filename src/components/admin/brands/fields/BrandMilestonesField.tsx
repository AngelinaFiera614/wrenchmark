
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import { BrandFormValues } from "../BrandFormSchema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createMilestonesField } from "@/services/brandService";
import { Textarea } from "@/components/ui/textarea";

interface BrandMilestonesFieldProps {
  form: UseFormReturn<BrandFormValues>;
}

export default function BrandMilestonesField({ form }: BrandMilestonesFieldProps) {
  const milestones = form.watch("milestones") || [];

  const addMilestone = () => {
    form.setValue("milestones", [...milestones, ...createMilestonesField()]);
  };

  const removeMilestone = (index: number) => {
    const updatedMilestones = [...milestones];
    updatedMilestones.splice(index, 1);
    form.setValue("milestones", updatedMilestones);
  };

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
              <div key={index} className="flex flex-col gap-2 p-4 border rounded-md">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">Milestone {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMilestone(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Year Field */}
                  <FormField
                    control={form.control}
                    name={`milestones.${index}.year`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g. 1985" 
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Importance Field */}
                  <FormField
                    control={form.control}
                    name={`milestones.${index}.importance`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Importance</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select importance" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Description Field */}
                <FormField
                  control={form.control}
                  name={`milestones.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the milestone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addMilestone}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
