import { Motorcycle } from "@/types";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  X, 
  Info, 
  GaugeCircle, 
  Activity, 
  Gauge, 
  ArrowUp, 
  ArrowDown,
  CircleArrowDown,
  CircleArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
    <div className="space-y-8 animate-in fade-in-0 duration-500">
      {/* Header Section with Image and Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden border border-border/30 bg-card/50 backdrop-blur-sm">
          <AspectRatio ratio={4/3} className="bg-muted/20">
            <img
              src={image_url}
              alt={`${make} ${model}`}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
            />
          </AspectRatio>
        </Card>
        
        <div className="space-y-5">
          <div className="animate-in slide-in-from-right-5 duration-300 delay-150">
            <h1 className="text-3xl font-bold tracking-tight">{make} {model}</h1>
            <p className="text-xl text-muted-foreground">{year}</p>
          </div>

          <p className="text-lg animate-in slide-in-from-right-5 duration-300 delay-200">{summary}</p>

          <div className="flex flex-wrap gap-2 animate-in slide-in-from-right-5 duration-300 delay-250">
            <Badge variant="outline" className="bg-secondary/50 text-xs">
              {category}
            </Badge>
            {style_tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-secondary/20 text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="animate-in slide-in-from-right-5 duration-300 delay-300">
            <div className="flex items-center gap-2 py-2">
              <span className="text-sm text-muted-foreground">Difficulty:</span>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-6 mx-0.5 rounded-sm ${
                      i < difficulty_level ? difficultyColor : "bg-muted"
                    } transition-all hover:h-8`}
                  />
                ))}
              </div>
              <span className="text-sm ml-2">{difficulty_level}/5</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-4 animate-in slide-in-from-right-5 duration-300 delay-350">
            <Button onClick={handleSaveBike} className="group">
              <span className="relative inline-block">Save this bike</span>
            </Button>
            <Button variant="outline" onClick={handleCompare}>
              Compare
            </Button>
          </div>
        </div>
      </div>

      {/* Specifications Section */}
      <Card className="border border-border/30 bg-card/50 backdrop-blur-sm overflow-hidden animate-in slide-in-from-bottom-5 duration-500 delay-100">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <GaugeCircle className="h-5 w-5 text-primary" />
            <span>Performance Specifications</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Engine & Performance */}
            <div className="space-y-4">
              <SpecItem 
                label="Engine" 
                value={`${engine_cc} cc`} 
                icon={<GaugeCircle className="h-4 w-4" />}
                tooltip="Engine displacement in cubic centimeters, indicating the size of the engine"
              />
              <SpecItem 
                label="Horsepower" 
                value={`${horsepower_hp} hp`} 
                icon={<Activity className="h-4 w-4" />}
                tooltip="Maximum power output of the engine"
              />
              <SpecItem 
                label="Torque" 
                value={`${torque_nm} Nm`} 
                icon={<CircleArrowUp className="h-4 w-4" />}
                tooltip="Rotational force produced by the engine"
              />
              <SpecItem 
                label="Top Speed" 
                value={`${top_speed_kph} km/h`} 
                icon={<Gauge className="h-4 w-4" />}
                tooltip="Maximum speed the motorcycle can achieve"
              />
            </div>

            {/* Physical Dimensions */}
            <div className="space-y-4">
              <SpecItem 
                label="Weight" 
                value={`${weight_kg} kg`} 
                icon={<ArrowDown className="h-4 w-4" />}
                tooltip="Dry weight without fluids or rider"
              />
              <SpecItem 
                label="Seat Height" 
                value={`${seat_height_mm} mm`} 
                icon={<ArrowUp className="h-4 w-4" />}
                tooltip="Height of seat from the ground, affects rider comfort and accessibility"
              />
              <SpecItem 
                label="Wheelbase" 
                value={`${wheelbase_mm} mm`} 
                icon={<CircleArrowDown className="h-4 w-4" />}
                tooltip="Distance between the centers of the front and rear wheels"
              />
              <SpecItem 
                label="Ground Clearance" 
                value={`${ground_clearance_mm} mm`} 
                icon={<ArrowDown className="h-4 w-4" />}
                tooltip="Distance between the lowest point of the motorcycle and the ground"
              />
            </div>

            {/* Features */}
            <div className="space-y-4">
              <SpecItem 
                label="Fuel Capacity" 
                value={`${fuel_capacity_l} L`} 
                icon={<CircleArrowDown className="h-4 w-4" />}
                tooltip="Total fuel the tank can hold"
              />
              <SpecItem 
                label="ABS" 
                value={abs ? 
                  <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
                  <X className="h-5 w-5 text-red-500" />
                }
                icon={<Activity className="h-4 w-4" />}
                tooltip="Anti-lock Braking System prevents wheel lock during braking"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Features Section */}
      {smart_features.length > 0 && (
        <Card className="border border-border/30 bg-card/50 backdrop-blur-sm overflow-hidden animate-in slide-in-from-bottom-5 duration-500 delay-150">
          <CardHeader className="pb-2">
            <CardTitle>Smart Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {smart_features.map((feature) => (
                <div key={feature} className="group relative">
                  <Badge 
                    key={feature} 
                    variant="outline" 
                    className="hover:bg-primary/20 hover:border-primary transition-colors duration-300"
                  >
                    {feature}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Maintenance Section */}
      <Card className="border border-border/30 bg-card/50 backdrop-blur-sm overflow-hidden animate-in slide-in-from-bottom-5 duration-500 delay-200">
        <CardHeader className="pb-2">
          <CardTitle>Maintenance Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 p-6 rounded text-center">
            <p className="text-muted-foreground">Maintenance logs will be available in a future update</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for specification items with tooltips
interface SpecItemProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  tooltip?: string;
}

function SpecItem({ label, value, icon, tooltip }: SpecItemProps) {
  return (
    <div className="grid grid-cols-2 gap-2 py-2 border-b border-border/50 group hover:bg-muted/10 px-2 -mx-2 rounded transition-colors">
      <div className="flex items-center gap-2">
        {icon && <span className="text-primary/80">{icon}</span>}
        <span className="text-muted-foreground">{label}</span>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground/70 cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px] text-xs">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <span className={cn("font-mono text-right", typeof value === "string" ? "text-primary-foreground" : "")}>{value}</span>
    </div>
  );
}
