
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, Users, Zap } from "lucide-react";
import { Motorcycle, MotorcycleFilters } from "@/types";
import MotorcycleCard from "./MotorcycleCard";

interface SmartRecommendationsProps {
  motorcycles: Motorcycle[];
  filters: MotorcycleFilters;
  onFilterChange: (filters: MotorcycleFilters) => void;
}

interface Recommendation {
  id: string;
  type: 'skill-based' | 'similar-users' | 'trending' | 'value';
  title: string;
  description: string;
  icon: React.ReactNode;
  motorcycles: Motorcycle[];
  filters?: Partial<MotorcycleFilters>;
}

export default function SmartRecommendations({ 
  motorcycles, 
  filters, 
  onFilterChange 
}: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedRec, setSelectedRec] = useState<string | null>(null);

  useEffect(() => {
    const generateRecommendations = () => {
      const recs: Recommendation[] = [];

      // Skill-based recommendations
      if (filters.difficultyLevel < 3) {
        const beginnerBikes = motorcycles.filter(m => 
          m.difficulty_level <= 2 && 
          m.engine_size <= 400 &&
          m.is_entry_level
        ).slice(0, 4);

        if (beginnerBikes.length > 0) {
          recs.push({
            id: 'beginner-friendly',
            type: 'skill-based',
            title: 'Perfect for Beginners',
            description: 'Based on your skill level preference, these bikes are ideal for new riders',
            icon: <Users className="h-4 w-4" />,
            motorcycles: beginnerBikes,
            filters: {
              difficultyLevel: 2,
              isEntryLevel: true,
              engineSizeRange: [0, 400]
            }
          });
        }
      }

      // Value recommendations
      const valueBikes = motorcycles.filter(m => 
        m.power_to_weight_ratio && 
        m.power_to_weight_ratio > 0.8 &&
        m.engine_size > 0
      )
      .sort((a, b) => (b.power_to_weight_ratio || 0) - (a.power_to_weight_ratio || 0))
      .slice(0, 4);

      if (valueBikes.length > 0) {
        recs.push({
          id: 'best-value',
          type: 'value',
          title: 'Best Power-to-Weight Value',
          description: 'Maximum performance per kilogram',
          icon: <Zap className="h-4 w-4" />,
          motorcycles: valueBikes,
          filters: {
            powerToWeightRange: [0.8, 2.0]
          }
        });
      }

      // Category-based trending
      if (filters.categories.length === 0) {
        const sportBikes = motorcycles.filter(m => 
          m.category === 'Sport'
        ).slice(0, 4);

        if (sportBikes.length > 0) {
          recs.push({
            id: 'trending-sport',
            type: 'trending',
            title: 'Trending Sport Bikes',
            description: 'Popular sport motorcycles right now',
            icon: <TrendingUp className="h-4 w-4" />,
            motorcycles: sportBikes,
            filters: {
              categories: ['Sport']
            }
          });
        }
      }

      // Smart suggestions based on current filters
      if (filters.useCases?.includes('Commuting')) {
        const commutingBikes = motorcycles.filter(m => 
          m.use_cases?.includes('Commuting') &&
          m.fuel_capacity_l > 10 &&
          m.seat_height_mm < 850
        ).slice(0, 4);

        if (commutingBikes.length > 0) {
          recs.push({
            id: 'commuting-optimal',
            type: 'similar-users',
            title: 'Commuting Champions',
            description: 'Perfect for daily rides with good fuel capacity and comfort',
            icon: <Lightbulb className="h-4 w-4" />,
            motorcycles: commutingBikes
          });
        }
      }

      setRecommendations(recs);
    };

    generateRecommendations();
  }, [motorcycles, filters]);

  const applyRecommendation = (rec: Recommendation) => {
    if (rec.filters) {
      onFilterChange({
        ...filters,
        ...rec.filters
      });
    }
    setSelectedRec(rec.id);
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-accent-teal" />
        <h3 className="text-lg font-semibold">Smart Recommendations</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => (
          <Card 
            key={rec.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedRec === rec.id ? 'ring-2 ring-accent-teal' : ''
            }`}
            onClick={() => applyRecommendation(rec)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                {rec.icon}
                {rec.title}
                <Badge variant="outline" className="text-xs">
                  {rec.motorcycles.length}
                </Badge>
              </CardTitle>
              <p className="text-xs text-muted-foreground">{rec.description}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-2">
                {rec.motorcycles.slice(0, 2).map((motorcycle) => (
                  <div key={motorcycle.id} className="text-xs">
                    <div className="font-medium truncate">{motorcycle.make} {motorcycle.model}</div>
                    <div className="text-muted-foreground">{motorcycle.engine_size}cc</div>
                  </div>
                ))}
              </div>
              {rec.motorcycles.length > 2 && (
                <div className="text-xs text-muted-foreground mt-2">
                  +{rec.motorcycles.length - 2} more
                </div>
              )}
              <Button size="sm" className="w-full mt-3" variant="outline">
                Apply Filters
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
