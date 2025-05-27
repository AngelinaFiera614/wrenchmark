
import { Badge } from "@/components/ui/badge";

interface MotorcycleCardBadgesProps {
  category?: string;
  styleTags?: string[];
}

export function MotorcycleCardBadges({ category, styleTags }: MotorcycleCardBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="teal" className="text-xs">
        {category || "Standard"}
      </Badge>
      {styleTags && styleTags.length > 0 ? (
        <>
          {styleTags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {styleTags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{styleTags.length - 2}
            </Badge>
          )}
        </>
      ) : (
        <Badge variant="secondary" className="text-xs">
          General
        </Badge>
      )}
    </div>
  );
}
