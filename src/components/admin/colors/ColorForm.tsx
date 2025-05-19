
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ColorFormState } from "@/types/colors";

interface ColorFormProps {
  initialData?: ColorFormState;
  onSubmit: (data: ColorFormState) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ColorForm({
  initialData = {
    name: "",
    hex_code: "",
    image_url: "",
    is_limited: false
  },
  onSubmit,
  onCancel,
  isSubmitting
}: ColorFormProps) {
  const [formData, setFormData] = useState<ColorFormState>(initialData);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      is_limited: checked
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Color Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g. Pearl White"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="hex_code">Hex Color Code</Label>
        <div className="flex items-center gap-3">
          <Input
            id="hex_code"
            name="hex_code"
            value={formData.hex_code || ""}
            onChange={handleChange}
            placeholder="#FFFFFF"
          />
          {formData.hex_code && (
            <div
              className="h-8 w-8 rounded-full border border-border"
              style={{ backgroundColor: formData.hex_code }}
            ></div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          name="image_url"
          value={formData.image_url || ""}
          onChange={handleChange}
          placeholder="https://example.com/color-image.jpg"
        />
      </div>
      
      <div className="flex items-center space-x-2 py-2">
        <Switch
          id="is_limited"
          checked={formData.is_limited}
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="is_limited">Limited Edition Color</Label>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !formData.name}
        >
          {isSubmitting ? "Saving..." : initialData.name ? "Update Color" : "Add Color"}
        </Button>
      </div>
    </form>
  );
}
