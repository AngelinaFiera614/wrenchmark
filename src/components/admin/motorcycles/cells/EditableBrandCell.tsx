
import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
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
  brands: Brand[];
  error?: string;
}

export function EditableBrandCell({
  value,
  displayValue,
  isEditing,
  onChange,
  brands = [], // Provide default empty array to prevent undefined
  error,
}: EditableBrandCellProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  
  // Close popover when clicking outside
  useEffect(() => {
    if (!isEditing) {
      setOpen(false);
    }
  }, [isEditing]);

  // Ensure brands is always an array
  const safetyBrands = Array.isArray(brands) ? brands : [];

  if (isEditing) {
    return (
      <div className="relative min-w-[180px]">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={triggerRef}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full justify-between",
                error ? "border-red-500" : ""
              )}
            >
              {value
                ? safetyBrands.find((brand) => brand.id === value)?.name || "Unknown Brand"
                : "Select brand..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
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
              <CommandGroup>
                {safetyBrands.map((brand) => (
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
            </Command>
          </PopoverContent>
        </Popover>
        {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
      </div>
    );
  }

  return <span>{displayValue || "-"}</span>;
}
