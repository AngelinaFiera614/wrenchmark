
import React, { useState, useEffect } from 'react';
import { getAllBrands } from '@/services/brandService';
import { Brand } from '@/types';
import { toast } from 'sonner';
import BrandSlideshowMode from '@/components/brand-explorer/BrandSlideshowMode';
import BrandTimelineMode from '@/components/brand-explorer/BrandTimelineMode';
import BrandExplorerHeader from '@/components/brand-explorer/BrandExplorerHeader';
import Header from '@/components/layout/Header';

interface BrandExplorerProps {
  onBackToDirectory?: () => void;
}

export default function BrandExplorer({ onBackToDirectory }: BrandExplorerProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMode, setCurrentMode] = useState<'slideshow' | 'timeline'>('slideshow');
  const [currentBrandIndex, setCurrentBrandIndex] = useState(0);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setIsLoading(true);
        const data = await getAllBrands();
        setBrands(data.filter(brand => brand.name && brand.founded)); // Only show complete brands
      } catch (error) {
        console.error('Failed to load brands:', error);
        toast.error('Failed to load brands data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-explorer-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-t-explorer-teal border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="text-explorer-text-muted">Loading brand stories...</p>
        </div>
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="min-h-screen bg-explorer-dark flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-explorer-text mb-4">No brands available</h2>
          <p className="text-explorer-text-muted">Check back later for brand stories.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Include main site header when accessed from directory */}
      {onBackToDirectory && <Header />}
      
      <div className="min-h-screen bg-explorer-dark overflow-hidden">
        <BrandExplorerHeader 
          currentMode={currentMode}
          onModeChange={setCurrentMode}
          totalBrands={brands.length}
          currentIndex={currentBrandIndex}
          onBackToDirectory={onBackToDirectory}
        />
        
        {currentMode === 'slideshow' ? (
          <BrandSlideshowMode 
            brands={brands}
            currentIndex={currentBrandIndex}
            onIndexChange={setCurrentBrandIndex}
            onSwitchToTimeline={() => setCurrentMode('timeline')}
          />
        ) : (
          <BrandTimelineMode 
            brand={brands[currentBrandIndex]}
            onSwitchToSlideshow={() => setCurrentMode('slideshow')}
          />
        )}
      </div>
    </div>
  );
}
