
import { Link } from "react-router-dom";
import { Motorcycle } from "@/types";
import { useComparison } from "@/context/ComparisonContext";
import { PremiumCard, PremiumCardContent, PremiumCardFooter } from "@/components/ui/premium-card";
import { EnhancedCardImage } from "./enhanced-card/EnhancedCardImage";
import { EnhancedCardBadges } from "./enhanced-card/EnhancedCardBadges";
import { EnhancedCardSpecs } from "./enhanced-card/EnhancedCardSpecs";
import { EnhancedCardFooter } from "./enhanced-card/EnhancedCardFooter";

interface EnhancedMotorcycleCardProps {
  motorcycle: Motorcycle;
}

export default function EnhancedMotorcycleCard({ motorcycle }: EnhancedMotorcycleCardProps) {
  const {
    id,
    make,
    model,
    year,
    category,
    style_tags,
    engine_cc,
    horsepower_hp,
    top_speed_kph,
    seat_height_mm,
    weight_kg,
    difficulty_level,
    abs,
    image_url,
    summary,
    slug
  } = motorcycle;

  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const isSelected = isInComparison(id);
  
  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSelected) {
      removeFromComparison(id);
    } else {
      addToComparison(motorcycle);
    }
  };

  const motorcycleUrl = slug ? `/motorcycles/${slug}` : `/motorcycles/${id}`;

  return (
    <PremiumCard 
      variant={isSelected ? "featured" : "premium"}
      interactive
      glow={isSelected ? "strong" : "subtle"}
      className="h-full flex flex-col group hover:shadow-teal-glow-lg transition-all duration-500 animate-scale-in-enhanced"
    >
      <Link to={motorcycleUrl} className="flex-1 flex flex-col">
        <EnhancedCardImage
          imageUrl={image_url}
          make={make}
          model={model}
          year={year}
          category={category}
          isSelected={isSelected}
          onCompareToggle={handleCompareToggle}
        />
        
        <PremiumCardContent className="flex-1 space-y-6 p-6">
          <EnhancedCardBadges 
            category={category}
            styleTags={style_tags}
          />

          <EnhancedCardSpecs
            engineCc={engine_cc}
            horsepowerHp={horsepower_hp}
            topSpeedKph={top_speed_kph}
            seatHeightMm={seat_height_mm}
            weightKg={weight_kg}
            abs={abs}
          />

          <p className="text-sm text-secondary-muted line-clamp-2 leading-relaxed font-medium">
            {summary || `${make} ${model} ${year} - Professional motorcycle specifications and details.`}
          </p>
        </PremiumCardContent>

        <PremiumCardFooter className="p-6 pt-0">
          <EnhancedCardFooter difficultyLevel={difficulty_level} />
        </PremiumCardFooter>
      </Link>
    </PremiumCard>
  );
}
