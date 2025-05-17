
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Brand } from "@/types";
import { getBrandLogoUrl, getLogoTooltipContent } from "@/utils/brandLogoUtils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BrandsTableProps {
  brands: Brand[];
  handleEditBrand: (brand: Brand) => void;
  handleDeleteClick: (brand: Brand) => void;
}

const BrandsTable = ({ brands, handleEditBrand, handleDeleteClick }: BrandsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Country</TableHead>
            <TableHead className="hidden md:table-cell">Founded</TableHead>
            <TableHead className="hidden lg:table-cell">Known For</TableHead>
            <TableHead className="hidden lg:table-cell">Status</TableHead>
            <TableHead className="hidden lg:table-cell">Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.map((brand) => {
            const { url: logoUrl, sourceType } = getBrandLogoUrl(brand.logo_url, brand.slug);
            const tooltipContent = getLogoTooltipContent(sourceType, brand.name);

            return (
              <TableRow key={brand.id}>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="h-12 w-12 bg-black flex items-center justify-center rounded-md">
                          {logoUrl && (
                            <img 
                              src={logoUrl} 
                              alt={`${brand.name} logo`} 
                              className="max-h-10 max-w-10 object-contain"
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
                </TableCell>
                <TableCell className="font-medium">{brand.name}</TableCell>
                <TableCell className="hidden md:table-cell">{brand.country || "-"}</TableCell>
                <TableCell className="hidden md:table-cell">{brand.founded || "-"}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {brand.known_for?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
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
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {brand.brand_type && (
                    <Badge variant="secondary" className="text-xs">
                      {brand.brand_type}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => handleEditBrand(brand)}
                      size="sm"
                      variant="ghost"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(brand)}
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default BrandsTable;
