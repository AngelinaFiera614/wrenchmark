
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Heart, TrendingUp, Users, Zap } from 'lucide-react';
import { Motorcycle } from '@/types';
import { Link } from 'react-router-dom';

interface RelatedModel {
  motorcycle: Motorcycle;
  similarity: number;
  reason: string;
  category: 'similar' | 'alternative' | 'category' | 'upgrade' | 'downgrade';
}

interface RelatedModelsSystemProps {
  currentMotorcycle: Motorcycle;
  onMotorcycleSelect?: (motorcycle: Motorcycle) => void;
}

export default function RelatedModelsSystem({
  currentMotorcycle,
  onMotorcycleSelect
}: RelatedModelsSystemProps) {
  const [relatedModels, setRelatedModels] = useState<RelatedModel[]>([]);
  const [activeTab, setActiveTab] = useState('similar');
  const [isLoading, setIsLoading] = useState(false);

  // Mock related models generator - in real app, this would call an API
  useEffect(() => {
    const generateRelatedModels = () => {
      setIsLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        const mockRelatedModels: RelatedModel[] = [
          {
            motorcycle: {
              ...currentMotorcycle,
              id: 'related-1',
              model: 'Similar Sport 600',
              horsepower: currentMotorcycle.horsepower + 10,
              weight_kg: currentMotorcycle.weight_kg - 5,
              slug: 'similar-sport-600'
            },
            similarity: 95,
            reason: 'Similar engine size and performance characteristics',
            category: 'similar'
          },
          {
            motorcycle: {
              ...currentMotorcycle,
              id: 'related-2',
              model: 'Alternative Naked 650',
              category: 'Naked',
              horsepower: currentMotorcycle.horsepower - 20,
              weight_kg: currentMotorcycle.weight_kg + 15,
              slug: 'alternative-naked-650'
            },
            similarity: 78,
            reason: 'Different style, similar engine displacement',
            category: 'alternative'
          },
          {
            motorcycle: {
              ...currentMotorcycle,
              id: 'related-3',
              model: 'Category Sport 750',
              horsepower: currentMotorcycle.horsepower + 25,
              engine_size: currentMotorcycle.engine_size + 150,
              slug: 'category-sport-750'
            },
            similarity: 88,
            reason: 'Same category, higher performance',
            category: 'upgrade'
          },
          {
            motorcycle: {
              ...currentMotorcycle,
              id: 'related-4',
              model: 'Entry Sport 400',
              horsepower: currentMotorcycle.horsepower - 40,
              engine_size: currentMotorcycle.engine_size - 200,
              difficulty_level: 3,
              slug: 'entry-sport-400'
            },
            similarity: 72,
            reason: 'Same category, beginner-friendly',
            category: 'downgrade'
          }
        ];
        
        setRelatedModels(mockRelatedModels);
        setIsLoading(false);
      }, 1000);
    };
    
    generateRelatedModels();
  }, [currentMotorcycle]);

  const getTabIcon = (category: string) => {
    switch (category) {
      case 'similar': return Heart;
      case 'alternative': return TrendingUp;
      case 'category': return Users;
      case 'upgrade': return Zap;
      default: return Heart;
    }
  };

  const getTabLabel = (category: string) => {
    switch (category) {
      case 'similar': return 'Similar Models';
      case 'alternative': return 'Alternatives';
      case 'category': return 'Same Category';
      case 'upgrade': return 'Upgrades';
      default: return 'Related';
    }
  };

  const getFilteredModels = (category: string) => {
    if (category === 'similar') {
      return relatedModels.filter(m => m.category === 'similar');
    } else if (category === 'alternatives') {
      return relatedModels.filter(m => m.category === 'alternative');
    } else if (category === 'category') {
      return relatedModels.filter(m => m.category === 'category' || m.category === 'upgrade' || m.category === 'downgrade');
    }
    return relatedModels;
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 90) return 'text-green-400';
    if (similarity >= 75) return 'text-blue-400';
    if (similarity >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Related Models</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-explorer-teal"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-explorer-text">
          <Users className="h-5 w-5 text-explorer-teal" />
          Related Models
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-explorer-dark-light">
            {['similar', 'alternatives', 'category'].map((category) => {
              const Icon = getTabIcon(category);
              return (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="flex items-center gap-2 text-explorer-text data-[state=active]:bg-explorer-teal data-[state=active]:text-explorer-dark"
                >
                  <Icon className="h-4 w-4" />
                  {getTabLabel(category)}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {['similar', 'alternatives', 'category'].map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="space-y-4">
                {getFilteredModels(category).map((related, index) => (
                  <div
                    key={related.motorcycle.id}
                    className="p-4 rounded-lg border border-explorer-chrome/20 bg-explorer-dark-light hover:border-explorer-teal/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-explorer-text">
                            {related.motorcycle.make} {related.motorcycle.model}
                          </h4>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getSimilarityColor(related.similarity)}`}
                          >
                            {related.similarity}% match
                          </Badge>
                        </div>
                        <p className="text-sm text-explorer-text-muted mb-2">
                          {related.reason}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-explorer-text-muted">
                          <span>{related.motorcycle.engine_size}cc</span>
                          <span>{related.motorcycle.horsepower}hp</span>
                          <span>{related.motorcycle.weight_kg}kg</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onMotorcycleSelect?.(related.motorcycle)}
                          className="border-explorer-chrome/30 text-explorer-text hover:border-explorer-teal/50"
                        >
                          Compare
                        </Button>
                        <Link to={`/motorcycles/${related.motorcycle.slug}`}>
                          <Button
                            size="sm"
                            className="bg-explorer-teal text-explorer-dark hover:bg-explorer-teal/80"
                          >
                            View
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                
                {getFilteredModels(category).length === 0 && (
                  <div className="text-center py-8 text-explorer-text-muted">
                    No {getTabLabel(category).toLowerCase()} found
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
