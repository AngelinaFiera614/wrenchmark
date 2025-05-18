
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface TagsFieldProps {
  tags: string[];
  suggestedTags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

const TagsField: React.FC<TagsFieldProps> = ({
  tags,
  suggestedTags,
  onAddTag,
  onRemoveTag
}) => {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Tags</div>
      <div className="flex flex-wrap gap-2">
        {tags?.map((tag) => (
          <Badge 
            key={tag} 
            variant="outline"
            className="bg-accent-teal/10 text-accent-teal border-accent-teal/20 flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemoveTag(tag)}
              className="ml-1 rounded-full hover:bg-accent-teal/20 p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      
      {suggestedTags.length > 0 && (
        <div className="mt-2">
          <div className="text-xs text-muted-foreground mb-1">Suggested tags:</div>
          <div className="flex flex-wrap gap-2">
            {suggestedTags.map((tag) => (
              <Badge 
                key={tag} 
                variant="outline"
                className="bg-accent-teal/5 hover:bg-accent-teal/20 cursor-pointer transition-colors"
                onClick={() => onAddTag(tag)}
              >
                + {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsField;
