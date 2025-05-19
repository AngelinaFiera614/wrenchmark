
import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Brand } from "@/types";

interface EditableBrandCellProps {
  value: string;
  displayValue: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  brands: Brand[] | undefined;
  isLoading?: boolean;
  error?: string;
}

export function EditableBrandCell({
  value,
  displayValue,
  isEditing,
  onChange,
  brands,
  isLoading = false,
  error,
}: EditableBrandCellProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  
  // Close popover when clicking outside or when editing is disabled
  useEffect(() => {
    if (!isEditing) {
      setOpen(false);
    }
  }, [isEditing]);

  // If not editing, just return the display value
  if (!isEditing) {
    return <span>{displayValue || "-"}</span>;
  }

  // Process brands safely
  const safeBrands = Array.isArray(brands) ? brands : [];
  
  // Find the current selected brand name
  const selectedBrand = value 
    ? safeBrands.find((brand) => brand.id === value) 
    : undefined;

  return (
    <div className="relative min-w-[180px]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={isLoading}
            className={cn(
              "w-full justify-between",
              error ? "border-red-500" : "",
              isLoading ? "opacity-70" : ""
            )}
          >
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              selectedBrand?.name || "Select brand..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-accent-teal" />
            </div>
          ) : (
            <Command>
              <CommandInput 
                placeholder="Search brands..." 
                value={searchValue}
                onValueChange={setSearchValue}
              />
              <CommandEmpty>
                {searchValue ? (
                  <div className="py-3 text-center text-sm">
                    No brand found
                    <Button variant="link" className="mt-2 text-xs">
                      <Plus className="mr-2 h-3 w-3" />
                      Create &quot;{searchValue}&quot;
                    </Button>
                  </div>
                ) : (
                  "No brands found."
                )}
              </CommandEmpty>
              {safeBrands.length > 0 ? (
                <CommandGroup>
                  {safeBrands.map((brand) => (
                    <CommandItem
                      key={brand.id}
                      value={brand.name}
                      onSelect={() => {
                        onChange(brand.id);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === brand.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {brand.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <div className="py-3 text-center text-sm text-muted-foreground">
                  No brands available
                </div>
              )}
            </Command>
          )}
        </PopoverContent>
      </Popover>
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
}
