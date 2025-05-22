
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Zap, Flag } from "lucide-react";
import { Brand } from "@/types";

interface BrandOverviewProps {
  brand: Brand;
  motorcycles: any[];
}

export default function BrandOverview({ brand, motorcycles }: BrandOverviewProps) {
  // Get brand type icon
  const getBrandTypeIcon = (type?: string) => {
    switch(type) {
      case "boutique":
        return <Wrench className="h-4 w-4" />;
      case "electric":
      case "oem":
        return <Zap className="h-4 w-4" />;
      default:
        return <Flag className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">About {brand.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{brand.description || `Founded in ${brand.founded} in ${brand.country}`}</p>
        </CardContent>
      </Card>

      {/* Key Facts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Key Facts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-accent-teal">Founded</p>
              <p className="text-foreground">{brand.founded}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-accent-teal">Country</p>
              <p className="text-foreground">{brand.country}</p>
            </div>
            
            {brand.founded_city && (
              <div>
                <p className="text-sm font-medium text-accent-teal">Founded In</p>
                <p className="text-foreground">{brand.founded_city}</p>
              </div>
            )}
            
            {brand.headquarters && (
              <div>
                <p className="text-sm font-medium text-accent-teal">Headquarters</p>
                <p className="text-foreground">{brand.headquarters}</p>
              </div>
            )}
            
            {brand.status && (
              <div>
                <p className="text-sm font-medium text-accent-teal">Status</p>
                <p className="text-foreground capitalize">{brand.status}</p>
              </div>
            )}
            
            {brand.website_url && (
              <div>
                <p className="text-sm font-medium text-accent-teal">Website</p>
                <a 
                  href={brand.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent-teal hover:underline"
                >
                  Visit Website
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Specialties & Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Specialties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {brand.known_for?.map((specialty, index) => (
              <Badge key={`${specialty}-${index}`} variant="outline" className="bg-muted/20">
                {specialty}
              </Badge>
            ))}
            
            {brand.categories?.map((category, index) => (
              <Badge key={`${category}-${index}`} variant="secondary" className="bg-accent-teal/10 text-accent-teal">
                {category}
              </Badge>
            ))}
            
            {brand.is_electric && (
              <Badge variant="outline" className="bg-green-950 border-green-700">
                <Zap className="mr-1 h-3 w-3" />
                Electric
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <p className="text-2xl font-bold text-accent-teal">{motorcycles.length}</p>
              <p className="text-sm text-muted-foreground">Models</p>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <p className="text-2xl font-bold text-accent-teal">{brand.founded ? (new Date().getFullYear() - brand.founded) : "--"}</p>
              <p className="text-sm text-muted-foreground">Years in Industry</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
