
import React from 'react';
import { Brand } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface TimelineHeaderProps {
  brand: Brand;
  logoUrl: string;
  onSwitchToSlideshow: () => void;
}

export default function TimelineHeader({ 
  brand, 
  logoUrl, 
  onSwitchToSlideshow 
}: TimelineHeaderProps) {
  return (
    <div className="relative bg-gradient-to-r from-explorer-dark via-explorer-dark-light to-explorer-dark border-b border-explorer-chrome/30">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onSwitchToSlideshow}
            variant="ghost"
            className="text-explorer-text hover:text-explorer-teal hover:bg-explorer-card/50"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Slideshow
          </Button>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="relative">
            <div className="absolute inset-0 bg-explorer-teal rounded-full blur-lg opacity-30" />
            <img 
              src={logoUrl}
              alt={`${brand.name} logo`}
              className="relative w-20 h-20 object-contain"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-explorer-text mb-2">{brand.name}</h1>
            <p className="text-explorer-text-muted">
              Founded {brand.founded} in {brand.country}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
