
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { MotorcycleFilters as FilterType } from "@/services/domain/MotorcycleService";
import { Brand } from "@/types/motorcycle";

interface MotorcycleFiltersProps {
  filters: FilterType;
  brands: Brand[];
  onFilterChange: (filters: Partial<FilterType>) => void;
  onClearFilters: () => void;
  resultCount: number;
}

const MotorcycleFilters = ({
  filters,
  brands,
  onFilterChange,
  onClearFilters,
  resultCount
}: MotorcycleFiltersProps) => {
  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== "" && value !== null
  );

  return (
    <div className="bg-explorer-card border border-explorer-chrome/30 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-explorer-text-muted" />
          <span className="text-sm font-medium text-explorer-text">Filters</span>
          {hasActiveFilters && (
            <span className="text-xs text-explorer-text-muted">
              ({resultCount} results)
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-explorer-text-muted hover:text-explorer-text"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-explorer-text-muted" />
          <Input
            placeholder="Search models..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange({ search: e.target.value || undefined })}
            className="pl-10 bg-explorer-dark border-explorer-chrome/30"
          />
        </div>

        <Select
          value={filters.brandId || "all"}
          onValueChange={(value) => onFilterChange({ brandId: value === "all" ? undefined : value })}
        >
          <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
            <SelectValue placeholder="All brands" />
          </SelectTrigger>
          <SelectContent className="bg-explorer-card border-explorer-chrome/30 text-explorer-text">
            <SelectItem value="all">All brands</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.category || "all"}
          onValueChange={(value) => onFilterChange({ category: value === "all" ? undefined : value })}
        >
          <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent className="bg-explorer-card border-explorer-chrome/30 text-explorer-text">
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="Sport">Sport</SelectItem>
            <SelectItem value="Cruiser">Cruiser</SelectItem>
            <SelectItem value="Touring">Touring</SelectItem>
            <SelectItem value="Adventure">Adventure</SelectItem>
            <SelectItem value="Naked">Naked</SelectItem>
            <SelectItem value="Standard">Standard</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.isDraft !== undefined ? filters.isDraft.toString() : "all"}
          onValueChange={(value) => 
            onFilterChange({ 
              isDraft: value === "all" ? undefined : value === "true" 
            })
          }
        >
          <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent className="bg-explorer-card border-explorer-chrome/30 text-explorer-text">
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="false">Published</SelectItem>
            <SelectItem value="true">Drafts</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MotorcycleFilters;
