
import React from "react";
import { Brand } from "@/types";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Country</TableHead>
            <TableHead className="hidden md:table-cell">Founded</TableHead>
            <TableHead className="hidden lg:table-cell">Known For</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands?.map((brand) => (
            <TableRow key={brand.id} className="hover:bg-muted/30">
              <TableCell>
                <div className="h-10 w-10 bg-black rounded overflow-hidden">
                  <img 
                    src={brand.logo_url || '/placeholder.svg'} 
                    alt={brand.name}
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">{brand.name}</TableCell>
              <TableCell className="hidden md:table-cell">{brand.country || 'Unknown'}</TableCell>
              <TableCell className="hidden md:table-cell">{brand.founded || 'Unknown'}</TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex flex-wrap gap-1 max-w-xs">
                  {brand.known_for?.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {brand.known_for && brand.known_for.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{brand.known_for.length - 3}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {/* Desktop Actions */}
                  <div className="hidden md:flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditBrand(brand)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteClick(brand)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Mobile Actions */}
                  <div className="md:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditBrand(brand)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(brand)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BrandsTable;
