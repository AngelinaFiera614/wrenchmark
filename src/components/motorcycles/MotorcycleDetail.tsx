
import { Motorcycle } from "@/types";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface MotorcycleDetailProps {
  motorcycle: Motorcycle;
}

export default function MotorcycleDetail({ motorcycle }: MotorcycleDetailProps) {
  const {
    make,
    model,
    year,
    engine_cc,
    horsepower_hp,
    torque_nm,
    top_speed_kph,
    category,
    style_tags,
    difficulty_level,
    weight_kg,
    seat_height_mm,
    wheelbase_mm,
    ground_clearance_mm,
    fuel_capacity_l,
    abs,
    smart_features,
    image_url,
    summary
  } = motorcycle;

  const difficultyColor = `difficulty-${difficulty_level}`;

  const handleSaveBike = () => {
    toast({
      title: "Feature coming soon",
      description: "Saving bikes will be available in a future update.",
      duration: 3000,
    });
  };

  const handleCompare = () => {
    toast({
      title: "Feature coming soon",
      description: "Compare feature will be available in a future update.",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="md:w-1/2">
          <div className="aspect-[4/3] overflow-hidden rounded-lg">
            <img
              src={image_url}
              alt={`${make} ${model}`}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        
        <div className="md:w-1/2 space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{make} {model}</h1>
            <p className="text-xl text-muted-foreground">{year}</p>
          </div>

          <p className="text-lg">{summary}</p>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-secondary/50 text-xs">
              {category}
            </Badge>
            {style_tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-secondary/20 text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-2 py-2">
            <span className="text-sm text-muted-foreground">Difficulty:</span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-6 mx-0.5 rounded-sm ${
                    i < difficulty_level ? difficultyColor : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm ml-2">{difficulty_level}/5</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-4">
            <Button onClick={handleSaveBike}>
              Save this bike
            </Button>
            <Button variant="outline" onClick={handleCompare}>
              Compare
            </Button>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Specifications</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 py-2 border-b">
              <span className="text-muted-foreground">Engine</span>
              <span className="font-mono">{engine_cc} cc</span>
            </div>
            <div className="grid grid-cols-2 gap-2 py-2 border-b">
              <span className="text-muted-foreground">Horsepower</span>
              <span className="font-mono">{horsepower_hp} hp</span>
            </div>
            <div className="grid grid-cols-2 gap-2 py-2 border-b">
              <span className="text-muted-foreground">Torque</span>
              <span className="font-mono">{torque_nm} Nm</span>
            </div>
            <div className="grid grid-cols-2 gap-2 py-2 border-b">
              <span className="text-muted-foreground">Top Speed</span>
              <span className="font-mono">{top_speed_kph} km/h</span>
            </div>
            <div className="grid grid-cols-2 gap-2 py-2 border-b">
              <span className="text-muted-foreground">Weight</span>
              <span className="font-mono">{weight_kg} kg</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 py-2 border-b">
              <span className="text-muted-foreground">Seat Height</span>
              <span className="font-mono">{seat_height_mm} mm</span>
            </div>
            <div className="grid grid-cols-2 gap-2 py-2 border-b">
              <span className="text-muted-foreground">Wheelbase</span>
              <span className="font-mono">{wheelbase_mm} mm</span>
            </div>
            <div className="grid grid-cols-2 gap-2 py-2 border-b">
              <span className="text-muted-foreground">Ground Clearance</span>
              <span className="font-mono">{ground_clearance_mm} mm</span>
            </div>
            <div className="grid grid-cols-2 gap-2 py-2 border-b">
              <span className="text-muted-foreground">Fuel Capacity</span>
              <span className="font-mono">{fuel_capacity_l} L</span>
            </div>
            <div className="grid grid-cols-2 gap-2 py-2 border-b">
              <span className="text-muted-foreground">ABS</span>
              <span>
                {abs ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                )}
              </span>
            </div>
          </div>
        </div>

        {smart_features.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Smart Features</h3>
            <div className="flex flex-wrap gap-2">
              {smart_features.map((feature) => (
                <Badge key={feature} variant="outline">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t">
          <h3 className="text-lg font-medium mb-4">Maintenance Logs</h3>
          <div className="bg-muted/30 p-4 rounded text-center">
            <p className="text-muted-foreground">Maintenance logs will be available in a future update</p>
          </div>
        </div>
      </div>
    </div>
  );
}
