
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Configuration } from "@/types/motorcycle";
import { getCompatibleAccessories } from "@/services/accessoryService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

interface AccessoriesListProps {
  configuration: Configuration;
}

export function AccessoriesList({ configuration }: AccessoriesListProps) {
  const { data: accessories, isLoading } = useQuery({
    queryKey: ["compatible-accessories", configuration.id],
    queryFn: () => getCompatibleAccessories(configuration.id),
    enabled: !!configuration.id
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-accent-teal" />
      </div>
    );
  }

  if (!accessories || accessories.length === 0) {
    return (
      <div className="text-center py-8 border border-border/30 rounded-md bg-muted/10">
        <p className="text-muted-foreground">
          No compatible accessories found for this model.
        </p>
      </div>
    );
  }

  // Group accessories by category
  const categories = [...new Set(accessories.map(acc => acc.category))];

  return (
    <div className="space-y-4">
      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="w-full grid" style={{ gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))` }}>
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map(category => (
          <TabsContent key={category} value={category} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accessories
                .filter(acc => acc.category === category)
                .map(accessory => (
                  <div key={accessory.id} className="border border-border/30 rounded-md overflow-hidden bg-card hover:border-accent-teal/50 transition-colors">
                    <div className="h-32 bg-muted/30 relative">
                      {accessory.image_url ? (
                        <img 
                          src={accessory.image_url} 
                          alt={accessory.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          No image available
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h4 className="font-medium text-lg mb-1">{accessory.name}</h4>
                      {accessory.manufacturer && (
                        <p className="text-sm text-muted-foreground mb-2">
                          By {accessory.manufacturer}
                        </p>
                      )}
                      {accessory.price_usd && (
                        <p className="text-accent-teal font-medium">
                          ${accessory.price_usd}
                        </p>
                      )}
                      {accessory.description && (
                        <p className="text-sm mt-2 line-clamp-2">{accessory.description}</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
