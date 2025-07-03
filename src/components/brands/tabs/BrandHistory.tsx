
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brand, BrandMilestone } from "@/types";
import { CalendarDays } from "lucide-react";
import { SecureContentRenderer } from "@/components/security/SecureContentRenderer";

interface BrandHistoryProps {
  brand: Brand;
}

export default function BrandHistory({ brand }: BrandHistoryProps) {
  return (
    <div className="space-y-6">
      {/* Brand History (Markdown content) - Now securely rendered */}
      {brand.brand_history && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Brand History</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <SecureContentRenderer 
              content={brand.brand_history}
              type="html"
              className="brand-history-content"
            />
          </CardContent>
        </Card>
      )}
      
      {/* Milestones Timeline */}
      {brand.milestones && brand.milestones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {brand.milestones
                .sort((a, b) => a.year - b.year)
                .map((milestone, index) => (
                  <div key={index} className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-10 h-10 rounded-full bg-accent-teal/20 flex items-center justify-center">
                        <CalendarDays className="h-5 w-5 text-accent-teal" />
                      </div>
                      {index < brand.milestones!.length - 1 && (
                        <div className="h-full w-0.5 bg-border mt-2" />
                      )}
                    </div>
                    
                    <div className="pb-6">
                      <p className="text-lg font-medium">{milestone.year}</p>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Manufacturing Facilities */}
      {brand.manufacturing_facilities && brand.manufacturing_facilities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Manufacturing Facilities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              {brand.manufacturing_facilities.map((facility, index) => (
                <li key={index} className="text-muted-foreground">{facility}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      {/* Logo History */}
      {brand.logo_history && brand.logo_history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Logo Evolution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {brand.logo_history
                .sort((a, b) => a.year - b.year)
                .map((logo, index) => (
                  <div key={index} className="text-center">
                    <div className="aspect-square bg-black flex items-center justify-center p-4 rounded-md mb-2">
                      <img 
                        src={logo.url} 
                        alt={`${brand.name} logo from ${logo.year}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <p className="font-medium">{logo.year}</p>
                    {logo.description && (
                      <p className="text-sm text-muted-foreground">{logo.description}</p>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
