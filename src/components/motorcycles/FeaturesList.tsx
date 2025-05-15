
import { useState } from "react";
import { Motorcycle } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  X, 
  Lightbulb, 
  Sparkles,
  Smartphone
} from "lucide-react";
import { SpecificationItem } from "./SpecificationItem";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface FeaturesListProps {
  motorcycle: Motorcycle;
}

export function FeaturesList({ motorcycle }: FeaturesListProps) {
  const { abs, smart_features, style_tags } = motorcycle;
  const [isSmartFeaturesOpen, setIsSmartFeaturesOpen] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Filter tags based on selection
  const filteredFeatures = selectedTag 
    ? smart_features.filter(feature => feature.toLowerCase().includes(selectedTag.toLowerCase()))
    : smart_features;
  
  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
    }
  };
  
  return (
    <>
      <Card className="border border-border/50 bg-card/70 backdrop-blur-sm overflow-hidden animate-in slide-in-from-bottom-5 duration-500 delay-170 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <CheckCircle2 className="h-5 w-5 text-accent-teal" />
            <span>Features</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <SpecificationItem 
              label="ABS" 
              value={abs ? 
                <span className="flex items-center text-green-500"><CheckCircle2 className="h-5 w-5 mr-1" /> Equipped</span> : 
                <span className="flex items-center text-red-500"><X className="h-5 w-5 mr-1" /> Not Available</span>
              }
              icon={<Lightbulb className="h-4 w-4" />}
              tooltip="Anti-lock Braking System prevents wheel lock during braking"
            />
            
            <div className="pt-3">
              <p className="text-sm font-medium text-muted-foreground mb-2">Style Tags</p>
              <div className="flex flex-wrap gap-2">
                {style_tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className={`
                      cursor-pointer transition-all duration-200 
                      ${selectedTag === tag 
                        ? 'bg-accent-teal text-black hover:bg-accent-teal-hover border-accent-teal' 
                        : 'bg-muted/30 text-foreground border-primary/30 hover:bg-primary/20 hover:border-primary'}
                    `}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {smart_features.length > 0 && (
        <Collapsible 
          open={isSmartFeaturesOpen} 
          onOpenChange={setIsSmartFeaturesOpen}
          className="mt-4"
        >
          <Card className="border border-border/50 bg-card/70 backdrop-blur-sm overflow-hidden animate-in slide-in-from-bottom-5 duration-500 delay-200 shadow-md">
            <CardHeader className="pb-2">
              <CollapsibleTrigger className="flex w-full items-center justify-between group">
                <CardTitle className="flex items-center gap-2 text-foreground group-hover:text-accent-teal transition-colors">
                  <Smartphone className="h-5 w-5 text-accent-teal" />
                  <span>Smart Features</span>
                </CardTitle>
                <Sparkles className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
              </CollapsibleTrigger>
            </CardHeader>
            
            <CollapsibleContent>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {filteredFeatures.map((feature) => (
                    <TooltipProvider key={feature}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge 
                            variant="outline" 
                            className="bg-muted/30 text-foreground border-primary/30 hover:bg-primary/20 hover:border-primary transition-colors duration-300 cursor-help"
                          >
                            {feature}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[200px] text-xs">
                          Smart feature: {feature}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
                
                {filteredFeatures.length === 0 && (
                  <p className="text-sm text-muted-foreground">No matching features found.</p>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}
    </>
  );
}
