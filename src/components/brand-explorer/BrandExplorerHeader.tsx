
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Clock, ArrowLeft } from 'lucide-react';

interface BrandExplorerHeaderProps {
  currentMode: 'slideshow' | 'timeline';
  onModeChange: (mode: 'slideshow' | 'timeline') => void;
  totalBrands: number;
  currentIndex: number;
  onBackToDirectory?: () => void;
}

export default function BrandExplorerHeader({
  currentMode,
  onModeChange,
  totalBrands,
  currentIndex,
  onBackToDirectory
}: BrandExplorerHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-explorer-dark/95 backdrop-blur-xl border-b border-explorer-chrome/30">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and title */}
          <div className="flex items-center gap-4">
            {onBackToDirectory && (
              <Button
                onClick={onBackToDirectory}
                variant="ghost"
                size="sm"
                className="text-explorer-text hover:text-explorer-teal hover:bg-explorer-card/50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Directory
              </Button>
            )}
            <h1 className="text-xl font-bold text-explorer-text">
              BRAND <span className="text-explorer-teal">EXPLORER</span>
            </h1>
            <div className="text-sm text-explorer-text-muted">
              {currentIndex + 1} of {totalBrands}
            </div>
          </div>

          {/* Mode toggle */}
          <div className="flex items-center gap-2 bg-explorer-card border border-explorer-chrome/30 rounded-full p-1">
            <Button
              onClick={() => onModeChange('slideshow')}
              variant={currentMode === 'slideshow' ? 'default' : 'ghost'}
              size="sm"
              className={`rounded-full px-4 ${
                currentMode === 'slideshow' 
                  ? 'bg-explorer-teal text-black hover:bg-explorer-teal-hover' 
                  : 'text-explorer-text hover:bg-explorer-chrome/20'
              }`}
            >
              <Play className="h-4 w-4 mr-2" />
              Slideshow
            </Button>
            <Button
              onClick={() => onModeChange('timeline')}
              variant={currentMode === 'timeline' ? 'default' : 'ghost'}
              size="sm"
              className={`rounded-full px-4 ${
                currentMode === 'timeline' 
                  ? 'bg-explorer-teal text-black hover:bg-explorer-teal-hover' 
                  : 'text-explorer-text hover:bg-explorer-chrome/20'
              }`}
            >
              <Clock className="h-4 w-4 mr-2" />
              Timeline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
