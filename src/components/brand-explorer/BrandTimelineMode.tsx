
import React, { useState } from 'react';
import { Brand } from '@/types';
import { getBrandLogoUrl, getBrandFallbackImage } from '@/utils/brandLogoUtils';
import {
  TimelineHeader,
  BrandTimeline,
  TimelineTabsContent
} from './timeline';

interface BrandTimelineModeProps {
  brand: Brand;
  onSwitchToSlideshow: () => void;
}

export default function BrandTimelineMode({ brand, onSwitchToSlideshow }: BrandTimelineModeProps) {
  const [activeTab, setActiveTab] = useState('story');
  const [imageError, setImageError] = useState(false);
  const logoData = getBrandLogoUrl(brand.logo_url, brand.slug);

  // Use actual milestones from brand data with fallbacks
  const milestones = brand.milestones && brand.milestones.length > 0 
    ? brand.milestones.sort((a, b) => a.year - b.year)
    : [
        { year: brand.founded, description: `${brand.name} was founded`, importance: 'high' as const },
        { year: brand.founded + 5, description: 'Early growth and expansion', importance: 'medium' as const },
        { year: brand.founded + 15, description: 'Innovation breakthrough', importance: 'high' as const },
        { year: 2000, description: 'Modern era begins', importance: 'medium' as const },
        { year: 2020, description: 'Electric future', importance: 'high' as const }
      ];

  // Use actual notable models from brand data with fallbacks
  const notableModels = brand.notable_models && brand.notable_models.length > 0 
    ? brand.notable_models 
    : [
        { name: 'Classic Model', years: '1970-1985', category: 'Heritage', description: 'Iconic design that defined the era' },
        { name: 'Modern Legend', years: '2000-present', category: 'Performance', description: 'Cutting-edge technology meets timeless style' }
      ];

  const getDisplayImage = () => {
    if (imageError) {
      return getBrandFallbackImage(brand.name);
    }
    return logoData.url;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="min-h-screen bg-explorer-dark text-explorer-text pt-16">
      <TimelineHeader 
        brand={brand}
        logoUrl={getDisplayImage()}
        onSwitchToSlideshow={onSwitchToSlideshow}
      />

      <div className="container mx-auto px-6 py-8">
        <BrandTimeline milestones={milestones} />
        
        <TimelineTabsContent
          brand={brand}
          logoUrl={getDisplayImage()}
          notableModels={notableModels}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
}
