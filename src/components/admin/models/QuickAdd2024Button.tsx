
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface QuickAdd2024ButtonProps {
  onSuccess: () => void;
}

export default function QuickAdd2024Button({ onSuccess }: QuickAdd2024ButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    brand_id: "",
    name: "",
    type: "",
    base_description: "",
    msrp_usd: "",
  });

  const { toast } = useToast();

  // Fetch brands for the dropdown
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("id, name")
        .order("name");
      
      if (error) throw error;
      return data;
    }
  });

  const motorcycleTypes = [
    "Adventure",
    "Cruiser", 
    "Naked",
    "Scooter",
    "Sport",
    "Sport Touring",
    "Standard",
    "Touring",
    "Dual Sport",
    "Electric"
  ];

  const generateSlug = (brandName: string, modelName: string) => {
    return `${brandName}-${modelName}-2024`
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedBrand = brands?.find(b => b.id === formData.brand_id);
      if (!selectedBrand) {
        throw new Error("Please select a brand");
      }

      const slug = generateSlug(selectedBrand.name, formData.name);

      // Create the motorcycle model
      const { data: modelData, error: modelError } = await supabase
        .from("motorcycle_models")
        .insert({
          brand_id: formData.brand_id,
          name: formData.name,
          type: formData.type,
          base_description: formData.base_description,
          production_start_year: 2024,
          production_status: "active",
          slug: slug
        })
        .select()
        .single();

      if (modelError) throw modelError;

      // Create the 2024 model year
      const { data: yearData, error: yearError } = await supabase
        .from("model_years")
        .insert({
          motorcycle_id: modelData.id,
          year: 2024,
          msrp_usd: formData.msrp_usd ? parseFloat(formData.msrp_usd) : null,
          changes: "Initial release"
        })
        .select()
        .single();

      if (yearError) throw yearError;

      // Create a default configuration
      const { error: configError } = await supabase
        .from("model_configurations")
        .insert({
          model_year_id: yearData.id,
          name: "Standard",
          is_default: true
        });

      if (configError) throw configError;

      toast({
        title: "Model Added Successfully",
        description: `${selectedBrand.name} ${formData.name} 2024 has been added to the database.`,
      });

      setIsOpen(false);
      setFormData({
        brand_id: "",
        name: "",
        type: "",
        base_description: "",
        msrp_usd: "",
      });
      onSuccess();

    } catch (error: any) {
      console.error("Error adding model:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add model. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-accent-teal text-black hover:bg-accent-teal/80"
      >
        <Zap className="mr-2 h-4 w-4" />
        Quick Add 2024 Model
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent-teal" />
              Quick Add 2024 Model
            </DialogTitle>
            <DialogDescription>
              Quickly add a new 2024 motorcycle model with default configuration.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Select
                  value={formData.brand_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, brand_id: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands?.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {motorcycleTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Model Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Ninja 400, Street Triple, etc."
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="msrp">MSRP (USD)</Label>
              <Input
                id="msrp"
                type="number"
                placeholder="e.g., 12999"
                value={formData.msrp_usd}
                onChange={(e) => setFormData(prev => ({ ...prev, msrp_usd: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the motorcycle..."
                value={formData.base_description}
                onChange={(e) => setFormData(prev => ({ ...prev, base_description: e.target.value }))}
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Model"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
