
import { Link } from "react-router-dom";
import { Motorcycle } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useComparison } from "@/context/ComparisonContext";
import { cn } from "@/lib/utils";
import { MotorcycleCardImage } from "./card/MotorcycleCardImage";
import { MotorcycleCardBadges } from "./card/MotorcycleCardBadges";
import { MotorcycleCardSpecs } from "./card/MotorcycleCardSpecs";
import { MotorcycleCardFooter } from "./card/MotorcycleCardFooter";

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
}

export default function MotorcycleCard({ motorcycle }: MotorcycleCardProps) {
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
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-teal-glow hover:scale-105 hover:border-primary/40 group",
      isSelected && "ring-2 ring-primary shadow-teal-glow"
    )}>
      <Link to={motorcycleUrl}>
        <MotorcycleCardImage
          imageUrl={image_url}
          make={make}
          model={model}
          year={year}
          category={category}
          isSelected={isSelected}
          onCompareToggle={handleCompareToggle}
        />
        
        <CardContent className="p-5 space-y-4">
          <MotorcycleCardBadges 
            category={category}
            styleTags={style_tags}
          />

          <MotorcycleCardSpecs
            engineCc={engine_cc}
            horsepowerHp={horsepower_hp}
            topSpeedKph={top_speed_kph}
            seatHeightMm={seat_height_mm}
            weightKg={weight_kg}
            abs={abs}
          />

          <p className="text-sm text-secondary-muted line-clamp-2 leading-relaxed">
            {summary || `${make} ${model} ${year}`}
          </p>
        </CardContent>

        <CardFooter className="p-0">
          <MotorcycleCardFooter difficultyLevel={difficulty_level} />
        </CardFooter>
      </Link>
    </Card>
  );
}
