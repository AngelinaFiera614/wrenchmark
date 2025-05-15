
import { Motorcycle } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SpecificationItem } from "./SpecificationItem";
import { AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SafetyNotesSectionProps {
  motorcycle: Motorcycle;
}

export function SafetyNotesSection({ motorcycle }: SafetyNotesSectionProps) {
  const { abs, difficulty_level } = motorcycle;
  
  // Determine safety message based on ABS presence and difficulty level
  const getSafetyMessage = () => {
    if (!abs) {
      return {
        title: "No ABS Safety Alert",
        description: "This motorcycle does not have Anti-lock Braking System (ABS). Exercise extra caution when braking in slippery conditions.",
        icon: <AlertTriangle className="h-5 w-5" />,
        variant: "destructive" as const
      };
    }
    
    if (difficulty_level >= 4) {
      return {
        title: "Advanced Rider Warning",
        description: "This high-performance motorcycle is rated for experienced riders. ABS is equipped but caution is still advised.",
        icon: <ShieldAlert className="h-5 w-5" />,
        variant: "default" as const
      };
    }
    
    return {
      title: "Safety Features",
      description: "This motorcycle comes equipped with ABS for enhanced braking safety on all road conditions.",
      icon: <ShieldCheck className="h-5 w-5" />,
      variant: "default" as const
    };
  };
  
  const safetyMessage = getSafetyMessage();
  
  return (
    <Card className="border border-border/50 bg-card/70 backdrop-blur-sm overflow-hidden animate-in slide-in-from-bottom-5 duration-500 delay-170 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <ShieldCheck className="h-5 w-5 text-accent-teal" />
          <span>Safety Information</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Alert variant={safetyMessage.variant} className="mb-4 bg-card border-border/50">
          <div className="flex items-start gap-2">
            {safetyMessage.icon}
            <div>
              <AlertTitle className="text-foreground">{safetyMessage.title}</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                {safetyMessage.description}
              </AlertDescription>
            </div>
          </div>
        </Alert>
        
        <div className="space-y-4">
          <SpecificationItem 
            label="ABS System" 
            value={abs ? "Equipped" : "Not Available"} 
            icon={<ShieldCheck className="h-4 w-4" />}
            tooltip="Anti-lock Braking System prevents wheel lock during emergency braking"
          />
          
          <SpecificationItem 
            label="Difficulty Level" 
            value={
              <div className={`inline-flex items-center h-5 px-1.5 rounded text-xs font-medium bg-opacity-50 text-white difficulty-${difficulty_level}`}>
                {difficulty_level}/5
              </div>
            } 
            icon={<AlertTriangle className="h-4 w-4" />}
            tooltip="Rider difficulty rating from 1 (beginner-friendly) to 5 (expert)"
          />
        </div>
      </CardContent>
    </Card>
  );
}
