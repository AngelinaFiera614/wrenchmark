
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brand, NotableModel } from "@/types";
import MotorcycleGrid from "@/components/motorcycles/MotorcycleGrid";

interface BrandModelsProps {
  brand: Brand;
  motorcycles: any[];
}

export default function BrandModels({ brand, motorcycles }: BrandModelsProps) {
  return (
    <div className="space-y-6">
      {/* Notable Models */}
      {brand.notable_models && brand.notable_models.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notable Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {brand.notable_models.map((model, index) => (
                <Card key={index} className="overflow-hidden">
                  {model.image_url && (
                    <div className="w-full h-32 bg-muted">
                      <img 
                        src={model.image_url} 
                        alt={model.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <p className="font-medium">{model.name}</p>
                    <p className="text-sm text-muted-foreground">{model.years}</p>
                    <p className="text-xs text-muted-foreground mt-1">{model.category}</p>
                    {model.description && (
                      <p className="text-sm mt-2">{model.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Current Models */}
      <div>
        <h3 className="text-xl font-bold mb-4">Current Models</h3>
        {motorcycles.length > 0 ? (
          <MotorcycleGrid motorcycles={motorcycles} />
        ) : (
          <Card>
            <CardContent className="text-center p-6">
              <p className="text-muted-foreground">No current models found for this brand.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
