
import React from "react";
import { Brand } from "@/types";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface BrandsCardViewProps {
  brands: Brand[];
  handleEditBrand: (brand: Brand) => void;
  handleDeleteClick: (brand: Brand) => void;
}

const BrandsCardView = ({ brands, handleEditBrand, handleDeleteClick }: BrandsCardViewProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {brands?.map((brand) => (
        <Card key={brand.id} className="overflow-hidden hover:border-accent-teal/50 transition-colors">
          <div className="h-32 flex items-center justify-center bg-black p-4">
            {brand.logo_url ? (
              <img
                src={brand.logo_url}
                alt={brand.name}
                className="h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-gray-800 text-gray-400">
                No Logo
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold">{brand.name}</h3>
            <p className="text-sm text-muted-foreground">{brand.country || 'Unknown'}</p>
            <p className="text-sm text-muted-foreground">Founded: {brand.founded || 'Unknown'}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {brand.known_for?.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {brand.known_for && brand.known_for.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{brand.known_for.length - 3} more
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditBrand(brand)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => handleDeleteClick(brand)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default BrandsCardView;
