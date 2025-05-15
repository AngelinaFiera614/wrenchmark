
import { Motorcycle } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, X } from "lucide-react";
import { compareBooleanValues, compareArrayValues, getComparisonClass } from "@/lib/comparison-utils";
import ComparisonSectionHeader from "../ComparisonSectionHeader";
import { useMobile } from "@/hooks/use-mobile";

interface ComparisonFeaturesProps {
  motorcycles: Motorcycle[];
}

export default function ComparisonFeatures({ motorcycles }: ComparisonFeaturesProps) {
  const isMobile = useMobile();
  
  // Compare ABS
  const absComparisons = compareBooleanValues(motorcycles.map(m => m.abs));
  
  // Compare smart features
  const featuresComparisons = compareArrayValues(motorcycles.map(m => m.smart_features));
  
  // Create mobile cards for each motorcycle
  if (isMobile) {
    return (
      <>
        <ComparisonSectionHeader 
          title="Features" 
          description="Safety and smart features" 
        />
        
        <div className="space-y-6">
          {motorcycles.map((motorcycle, index) => (
            <div key={motorcycle.id} className="bg-card/70 rounded-lg border border-border/50 p-4 backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-4 text-foreground">{motorcycle.make} {motorcycle.model}</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">ABS</p>
                  <div className={`flex items-center ${getComparisonClass(absComparisons[index])} text-foreground`}>
                    {motorcycle.abs ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        <span>Equipped</span>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 text-red-500 mr-2" />
                        <span>Not equipped</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Smart Features</p>
                  <div className="flex flex-wrap gap-2">
                    {motorcycle.smart_features.length > 0 ? (
                      motorcycle.smart_features.map((feature) => (
                        <Badge 
                          key={feature} 
                          variant="secondary" 
                          className="bg-secondary/30 text-foreground border border-accent-teal/20"
                        >
                          {feature}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground italic">None</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }
  
  // Desktop table view
  return (
    <>
      <ComparisonSectionHeader 
        title="Features" 
        description="Safety and smart features" 
      />
      
      <Table className="bg-card/50 border border-border/30">
        <TableHeader>
          <TableRow className="border-border/30">
            <TableHead className="w-[180px] text-foreground">Feature</TableHead>
            {motorcycles.map((motorcycle) => (
              <TableHead key={motorcycle.id} className="text-foreground">
                {motorcycle.make} {motorcycle.model}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="border-border/30">
            <TableCell className="font-medium text-foreground">ABS</TableCell>
            {absComparisons.map((comparison, i) => (
              <TableCell 
                key={`abs-${motorcycles[i].id}`}
                className={`${getComparisonClass(comparison)} text-foreground`}
              >
                {comparison.value ? (
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span>Equipped</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <X className="h-4 w-4 text-red-500 mr-2" />
                    <span>Not equipped</span>
                  </div>
                )}
              </TableCell>
            ))}
          </TableRow>
          
          <TableRow className="border-border/30">
            <TableCell className="font-medium text-foreground">Smart Features</TableCell>
            {featuresComparisons.map((comparison, i) => (
              <TableCell 
                key={`features-${motorcycles[i].id}`}
                className="align-top text-foreground"
              >
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(comparison.value) && comparison.value.length > 0 ? (
                    comparison.value.map((feature) => (
                      <Badge 
                        key={feature} 
                        variant="secondary" 
                        className={`bg-secondary/20 text-foreground ${comparison.isUnique ? 'border border-accent-teal' : 'border border-border/30'}`}
                      >
                        {feature}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground italic">None</span>
                  )}
                </div>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
