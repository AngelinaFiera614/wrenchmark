
import { Motorcycle } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle2, X } from "lucide-react";
import { SpecificationItem } from "./SpecificationItem";

interface FeaturesListProps {
  motorcycle: Motorcycle;
}

export function FeaturesList({ motorcycle }: FeaturesListProps) {
  const { abs, smart_features } = motorcycle;
  
  return (
    <>
      <Card className="border border-border/50 bg-card/70 backdrop-blur-sm overflow-hidden animate-in slide-in-from-bottom-5 duration-500 delay-170 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <span>Features</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <SpecificationItem 
              label="ABS" 
              value={abs ? 
                <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
                <X className="h-5 w-5 text-red-500" />
              }
              icon={<Activity className="h-4 w-4" />}
              tooltip="Anti-lock Braking System prevents wheel lock during braking"
            />
          </div>
        </CardContent>
      </Card>

      {smart_features.length > 0 && (
        <Card className="border border-border/50 bg-card/70 backdrop-blur-sm overflow-hidden animate-in slide-in-from-bottom-5 duration-500 delay-200 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground">Smart Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {smart_features.map((feature) => (
                <div key={feature} className="group relative">
                  <Badge 
                    key={feature} 
                    variant="outline" 
                    className="bg-muted/30 text-foreground border-primary/30 hover:bg-primary/20 hover:border-primary transition-colors duration-300"
                  >
                    {feature}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
