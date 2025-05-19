
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import ImageUpload from "@/components/admin/shared/ImageUpload";
import { AccessoryCategory, AccessoryFormState } from "@/types/accessories";
import { Loader2 } from "lucide-react";

interface AccessoryFormProps {
  initialValues?: {
    id?: string;
    name?: string;
    category?: string;
    description?: string;
    price_usd?: number;
    image_url?: string;
    manufacturer?: string;
  };
  onSubmit: (data: AccessoryFormState) => void;
  loading?: boolean;
  onCancel: () => void;
}

const ACCESSORY_CATEGORIES: AccessoryCategory[] = [
  "Luggage",
  "Protection",
  "Performance",
  "Comfort",
  "Electronics",
  "Appearance"
];

export function AccessoryForm({
  initialValues,
  onSubmit,
  loading = false,
  onCancel
}: AccessoryFormProps) {
  const form = useForm<AccessoryFormState>({
    defaultValues: {
      name: initialValues?.name || "",
      category: (initialValues?.category as AccessoryCategory) || "Luggage",
      description: initialValues?.description || "",
      price_usd: initialValues?.price_usd || undefined,
      image_url: initialValues?.image_url || "",
      manufacturer: initialValues?.manufacturer || ""
    }
  });

  const handleImageUpload = (url: string) => {
    form.setValue("image_url", url);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input placeholder="Accessory name" {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category *</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ACCESSORY_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Accessory description"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price_usd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (USD)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Price in USD"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manufacturer</FormLabel>
                <FormControl>
                  <Input placeholder="Manufacturer name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={handleImageUpload}
                  bucketName="accessories"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {initialValues?.id ? "Update" : "Create"} Accessory
          </Button>
        </div>
      </form>
    </Form>
  );
}
