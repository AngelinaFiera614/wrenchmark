
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import { Brand } from "@/types";
import { getBrandLogoUrl, getLogoTooltipContent } from "@/utils/brandLogoUtils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BrandsCardViewProps {
  brands: Brand[];
  handleEditBrand: (brand: Brand) => void;
  handleDeleteClick: (brand: Brand) => void;
}

const BrandsCardView = ({ 
  brands, 
  handleEditBrand, 
  handleDeleteClick 
}: BrandsCardViewProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {brands.map((brand) => {
        const { url: logoUrl, sourceType } = getBrandLogoUrl(brand.logo_url, brand.slug);
        const tooltipContent = getLogoTooltipContent(sourceType, brand.name);

        return (
          <Card key={brand.id} className="overflow-hidden">
            <CardHeader className="p-4 pb-0 flex flex-row items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="h-16 w-16 bg-black flex items-center justify-center rounded-md">
                      {logoUrl && (
                        <img 
                          src={logoUrl} 
                          alt={`${brand.name} logo`} 
                          className="max-h-14 max-w-14 object-contain"
                          onError={(e) => {
                            console.error(`Failed to load image: ${logoUrl}`);
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{tooltipContent}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <div className="flex flex-col flex-1 overflow-hidden">
                <h3 className="font-semibold truncate">{brand.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{brand.country || "Unknown"}</span>
                  {brand.founded && (
                    <>
                      <span>•</span>
                      <span>Est. {brand.founded}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {brand.status && (
                    <Badge 
                      variant={
                        brand.status === "active" ? "teal" : 
                        brand.status === "defunct" ? "outline" : 
                        "secondary"
                      }
                      className="text-xs"
                    >
                      {brand.status}
                    </Badge>
                  )}
                  {brand.brand_type && (
                    <Badge variant="secondary" className="text-xs">
                      {brand.brand_type}
                    </Badge>
                  )}
                  {brand.is_electric && (
                    <Badge variant="outline" className="text-xs bg-green-950 border-green-700">
                      Electric
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {brand.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {brand.description}
                </p>
              )}
              <div className="flex flex-wrap gap-1">
                {brand.known_for?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button
                onClick={() => handleEditBrand(brand)}
                size="sm"
                variant="outline"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                onClick={() => handleDeleteClick(brand)}
                size="sm"
                variant="outline"
                className="text-destructive border-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default BrandsCardView;
