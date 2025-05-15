
import { Motorcycle } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useComparison } from "@/context/ComparisonContext";
import { compareStringValues, getComparisonClass } from "@/lib/comparison-utils";
import ComparisonSectionHeader from "../ComparisonSectionHeader";
import { useMobile } from "@/hooks/use-mobile";

interface ComparisonOverviewProps {
  motorcycles: Motorcycle[];
}

export default function ComparisonOverview({ motorcycles }: ComparisonOverviewProps) {
  const { removeFromComparison } = useComparison();
  const isMobile = useMobile();

  // Compare makes
  const makeComparisons = compareStringValues(motorcycles.map(m => m.make));
  
  // Compare years
  const yearComparisons = compareStringValues(motorcycles.map(m => m.year.toString()));

  return (
    <>
      <ComparisonSectionHeader 
        title="Overview" 
        description="Basic information about the motorcycles" 
      />
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-8' : `grid-cols-${motorcycles.length} gap-4`}`}>
        {motorcycles.map((motorcycle, index) => {
          const makeCompare = makeComparisons[index];
          const yearCompare = yearComparisons[index];

          return (
            <Card key={motorcycle.id} className="relative">
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
                  onClick={() => removeFromComparison(motorcycle.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              
              <CardContent className="p-4">
                <div className="mb-4">
                  <AspectRatio ratio={16/9} className="overflow-hidden rounded-md">
                    <img 
                      src={motorcycle.image_url} 
                      alt={`${motorcycle.make} ${motorcycle.model}`}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-baseline gap-2">
                      <span className={getComparisonClass(makeCompare)}>
                        {motorcycle.make}
                      </span>
                      <span>{motorcycle.model}</span>
                    </h3>
                    <p className={`text-sm text-muted-foreground ${getComparisonClass(yearCompare)}`}>
                      {motorcycle.year}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Category</h4>
                    <Badge variant="outline" className="bg-secondary/50">
                      {motorcycle.category}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Style</h4>
                    <div className="flex flex-wrap gap-1">
                      {motorcycle.style_tags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="bg-secondary/20"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Difficulty</h4>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-5 mx-0.5 rounded-sm ${
                            i < motorcycle.difficulty_level ? `difficulty-${motorcycle.difficulty_level}` : "bg-muted"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm">{motorcycle.difficulty_level}/5</span>
                    </div>
                  </div>
                  
                  {isMobile && (
                    <Button
                      variant="outline" 
                      className="w-full text-red-500/70 border-red-500/30 hover:bg-red-500/10"
                      onClick={() => removeFromComparison(motorcycle.id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove from comparison
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
