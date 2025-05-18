
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ManualTag } from '@/services/manuals/tags/types';

export interface TagOption {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface TagPickerProps {
  selectedTags: string[];
  availableTags: TagOption[];
  onTagsChange: (tags: string[]) => void;
  onCreateTag?: (tagName: string) => Promise<TagOption>;
  placeholder?: string;
  className?: string;
  allowCreation?: boolean;
  disabled?: boolean;
  maxTags?: number;
}

export const TagPicker: React.FC<TagPickerProps> = ({
  selectedTags = [],
  availableTags = [],
  onTagsChange,
  onCreateTag,
  placeholder = "Select tags",
  className,
  allowCreation = true,
  disabled = false,
  maxTags
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const handleToggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId));
    } else {
      if (maxTags && selectedTags.length >= maxTags) {
        return; // Don't add if we've reached the max
      }
      onTagsChange([...selectedTags, tagId]);
    }
  };

  const handleRemoveTag = (tagId: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    onTagsChange(selectedTags.filter(id => id !== tagId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput && allowCreation && onCreateTag) {
      e.preventDefault();
      handleCreateTag();
    }
  };

  const handleCreateTag = async () => {
    if (!tagInput.trim() || !onCreateTag || isCreating) return;
    
    const tagName = tagInput.trim();
    
    // Check if tag already exists
    const existingTag = availableTags.find(
      tag => tag.name.toLowerCase() === tagName.toLowerCase()
    );
    
    if (existingTag) {
      // Select the existing tag instead of creating a new one
      if (!selectedTags.includes(existingTag.id)) {
        handleToggleTag(existingTag.id);
      }
      setTagInput('');
      return;
    }
    
    try {
      setIsCreating(true);
      const newTag = await onCreateTag(tagName);
      setTagInput('');
      
      // Add the newly created tag to selected tags
      onTagsChange([...selectedTags, newTag.id]);
    } catch (error) {
      console.error("Error creating tag:", error);
    } finally {
      setIsCreating(false);
    }
  };

  // Filter tags based on search
  const filteredTags = availableTags.filter(tag => 
    tag.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Get tag objects for the selected tags
  const selectedTagObjects = availableTags.filter(tag => 
    selectedTags.includes(tag.id)
  );
  
  const canAddMoreTags = !maxTags || selectedTags.length < maxTags;
  const showCreateOption = allowCreation && tagInput.trim() && !filteredTags.some(
    tag => tag.name.toLowerCase() === tagInput.trim().toLowerCase()
  );

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open && !disabled} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline" 
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-background"
            disabled={disabled}
          >
            <span className="truncate">
              {selectedTagObjects.length > 0
                ? `${selectedTagObjects.length} tags selected`
                : placeholder}
            </span>
            <div className="opacity-50">↓</div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Search tags..." 
              value={searchValue} 
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>
                {allowCreation && onCreateTag ? (
                  <div className="p-2">
                    <div className="text-sm text-muted-foreground mb-2">
                      No tags found. Create a new one:
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1"
                        placeholder="New tag name"
                      />
                      <Button
                        size="sm"
                        type="button"
                        onClick={handleCreateTag}
                        disabled={!tagInput.trim() || isCreating}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                ) : (
                  "No tags found."
                )}
              </CommandEmpty>
              <CommandGroup>
                {filteredTags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    value={tag.name}
                    onSelect={() => handleToggleTag(tag.id)}
                    disabled={!canAddMoreTags && !selectedTags.includes(tag.id)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <span 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: tag.color }}
                        />
                        <span>{tag.name}</span>
                        {tag.description && (
                          <span className="text-xs text-muted-foreground ml-2">
                            {tag.description}
                          </span>
                        )}
                      </div>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selectedTags.includes(tag.id) ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </div>
                  </CommandItem>
                ))}
                
                {showCreateOption && onCreateTag && (
                  <CommandItem
                    value={`create-${tagInput}`}
                    onSelect={handleCreateTag}
                    disabled={isCreating || !canAddMoreTags}
                  >
                    <div className="flex items-center text-accent-teal">
                      <Plus className="h-4 w-4 mr-1" />
                      Create "{tagInput}"
                    </div>
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected tags display */}
      <div className="flex flex-wrap gap-2">
        {selectedTagObjects.map((tag) => (
          <Badge 
            key={tag.id} 
            variant="outline"
            style={{
              backgroundColor: `${tag.color}20`, // Use tag color with transparency
              borderColor: `${tag.color}40`,
              color: tag.color
            }}
            className="flex items-center gap-1 py-1 px-2"
          >
            <span 
              className="w-2 h-2 rounded-full mr-1" 
              style={{ backgroundColor: tag.color }}
            />
            {tag.name}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => handleRemoveTag(tag.id, e)}
                className="ml-1 rounded-full hover:bg-black/10 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TagPicker;
