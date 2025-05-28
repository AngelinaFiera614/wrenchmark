
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ModelBlockProps {
  data: {
    title?: string;
    models: Array<{
      id: string;
      name: string;
      brand: string;
      year?: number;
      image?: string;
      slug?: string;
    }>;
  };
}

export default function ModelBlock({ data }: ModelBlockProps) {
  if (!data.models || data.models.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden animate-fade-in">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-accent-teal">
          {data.title || 'Related Motorcycle Models'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.models.map((model, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              {model.image ? (
                <img
                  src={model.image}
                  alt={`${model.brand} ${model.name}`}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              ) : (
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">
                  {model.brand} {model.name}
                </h4>
                {model.year && (
                  <p className="text-sm text-muted-foreground">{model.year}</p>
                )}
              </div>
              
              {model.slug && (
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/motorcycles/${model.slug}`}>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-6">
          <Button variant="outline" asChild>
            <Link to="/motorcycles">
              Browse All Motorcycles
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
