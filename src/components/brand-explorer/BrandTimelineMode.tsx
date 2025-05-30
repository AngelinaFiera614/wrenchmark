
import React, { useState } from 'react';
import { Brand } from '@/types';
import { getBrandLogoUrl, getBrandFallbackImage } from '@/utils/brandLogoUtils';
import {
  TimelineHeader,
  TimelineTabsContent
} from './timeline';
import EnhancedBrandTimeline from './timeline/EnhancedBrandTimeline';
import ModelEvolutionTracker from './timeline/ModelEvolutionTracker';
import ProductionYearInsights from './timeline/ProductionYearInsights';

interface BrandTimelineModeProps {
  brand: Brand;
  onSwitchToSlideshow: () => void;
}

export default function BrandTimelineMode({ brand, onSwitchToSlideshow }: BrandTimelineModeProps) {
  const [activeTab, setActiveTab] = useState('timeline');
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

  // Mock motorcycle launches data (would come from API in real implementation)
  const motorcycleLaunches = [
    {
      year: brand.founded + 10,
      model: 'Classic Heritage',
      category: 'Cruiser',
      significance: 'high' as const,
      description: 'Iconic model that defined the brand'
    },
    {
      year: brand.founded + 25,
      model: 'Sport Evolution',
      category: 'Sport',
      significance: 'medium' as const,
      description: 'First modern sport motorcycle'
    },
    {
      year: 2010,
      model: 'Adventure Pioneer',
      category: 'Adventure',
      significance: 'high' as const,
      description: 'Revolutionary adventure touring machine'
    }
  ];

  // Mock model evolution data
  const modelGenerations = [
    {
      id: '1',
      name: 'Generation I',
      years: '1970-1985',
      keyChanges: ['Air-cooled engine', 'Drum brakes', 'Steel frame', 'Carbureted fuel system'],
      image: '/placeholder.svg'
    },
    {
      id: '2',
      name: 'Generation II',
      years: '1986-2000',
      keyChanges: ['Liquid cooling', 'Disc brakes', 'Fuel injection', 'Aluminum components'],
      image: '/placeholder.svg'
    },
    {
      id: '3',
      name: 'Generation III',
      years: '2001-2015',
      keyChanges: ['Electronic systems', 'ABS brakes', 'Ride modes', 'LED lighting'],
      image: '/placeholder.svg'
    },
    {
      id: '4',
      name: 'Generation IV',
      years: '2016-Present',
      keyChanges: ['Smart connectivity', 'Advanced electronics', 'Hybrid systems', 'Carbon fiber'],
      image: '/placeholder.svg'
    }
  ];

  // Mock production data
  const productionData = [
    {
      year: 1990,
      models: 3,
      totalProduction: 15000,
      marketContext: 'Economic recession impact',
      technicalUpdates: ['Fuel injection', 'ABS introduction']
    },
    {
      year: 2000,
      models: 8,
      totalProduction: 45000,
      marketContext: 'Millennium boom period',
      technicalUpdates: ['Electronic ignition', 'Catalytic converters']
    },
    {
      year: 2010,
      models: 12,
      totalProduction: 65000,
      marketContext: 'Global expansion',
      technicalUpdates: ['Traction control', 'Ride modes', 'LED lighting']
    },
    {
      year: 2020,
      models: 15,
      totalProduction: 85000,
      marketContext: 'Electric transition',
      technicalUpdates: ['Smart connectivity', 'Hybrid systems', 'Advanced safety']
    }
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

  const tabs = [
    { id: 'timeline', label: 'Interactive Timeline' },
    { id: 'evolution', label: 'Model Evolution' },
    { id: 'production', label: 'Production Insights' },
    { id: 'story', label: 'Brand Story' }
  ];

  return (
    <div className="min-h-screen bg-explorer-dark text-explorer-text pt-16">
      <TimelineHeader 
        brand={brand}
        logoUrl={getDisplayImage()}
        onSwitchToSlideshow={onSwitchToSlideshow}
      />

      <div className="container mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-explorer-chrome/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-explorer-teal text-explorer-teal'
                  : 'border-transparent text-explorer-text-muted hover:text-explorer-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'timeline' && (
          <EnhancedBrandTimeline 
            milestones={milestones}
            motorcycleLaunches={motorcycleLaunches}
            onMilestoneClick={(milestone) => console.log('Milestone clicked:', milestone)}
          />
        )}
        
        {activeTab === 'evolution' && (
          <div className="space-y-6">
            <ModelEvolutionTracker
              modelName="Flagship Series"
              generations={modelGenerations}
              onGenerationClick={(generation) => console.log('Generation clicked:', generation)}
            />
          </div>
        )}
        
        {activeTab === 'production' && (
          <ProductionYearInsights
            brandName={brand.name}
            productionData={productionData}
            onYearClick={(year) => console.log('Year clicked:', year)}
          />
        )}
        
        {activeTab === 'story' && (
          <TimelineTabsContent
            brand={brand}
            logoUrl={getDisplayImage()}
            notableModels={notableModels}
            activeTab="story"
            onTabChange={setActiveTab}
          />
        )}
      </div>
    </div>
  );
}
