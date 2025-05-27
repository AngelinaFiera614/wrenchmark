
import { Badge } from "@/components/ui/badge";

interface EnhancedCardBadgesProps {
  category?: string;
  styleTags?: string[];
}

export function EnhancedCardBadges({ category, styleTags }: EnhancedCardBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="teal" className="text-xs font-medium shadow-teal-glow/50">
        {category || "Standard"}
      </Badge>
      {styleTags && styleTags.length > 0 ? (
        <>
          {styleTags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs bg-white/10 border-white/20">
              {tag}
            </Badge>
          ))}
          {styleTags.length > 2 && (
            <Badge variant="outline" className="text-xs border-white/30">
              +{styleTags.length - 2}
            </Badge>
          )}
        </>
      ) : (
        <Badge variant="secondary" className="text-xs bg-white/10 border-white/20">
          General
        </Badge>
      )}
    </div>
  );
}
