
import React from 'react';
import { Brand } from '@/types';
import { ChevronRight, Play } from 'lucide-react';

interface SlideshowNavigationProps {
  brands: Brand[];
  currentIndex: number;
  isAutoPlaying: boolean;
  onIndexChange: (index: number) => void;
  onToggleAutoPlay: () => void;
  onPrevSlide: () => void;
  onNextSlide: () => void;
}

export default function SlideshowNavigation({
  brands,
  currentIndex,
  isAutoPlaying,
  onIndexChange,
  onToggleAutoPlay,
  onPrevSlide,
  onNextSlide
}: SlideshowNavigationProps) {
  return (
    <>
      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {brands.map((_, index) => (
          <button
            key={index}
            onClick={() => onIndexChange(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-explorer-teal shadow-lg shadow-explorer-teal/50' 
                : 'bg-explorer-chrome/50 hover:bg-explorer-chrome/80'
            }`}
          />
        ))}
      </div>

      {/* Auto-play control */}
      <button
        onClick={onToggleAutoPlay}
        className="absolute top-1/2 right-8 transform -translate-y-1/2 bg-explorer-card/80 border border-explorer-chrome rounded-full p-3 text-explorer-text hover:bg-explorer-card transition-all duration-300"
      >
        <Play className={`h-5 w-5 ${isAutoPlaying ? 'opacity-100' : 'opacity-50'}`} />
      </button>

      {/* Navigation arrows */}
      <button
        onClick={onPrevSlide}
        className="absolute top-1/2 left-8 transform -translate-y-1/2 bg-explorer-card/80 border border-explorer-chrome rounded-full p-3 text-explorer-text hover:bg-explorer-card transition-all duration-300"
      >
        <ChevronRight className="h-6 w-6 rotate-180" />
      </button>
      
      <button
        onClick={onNextSlide}
        className="absolute top-1/2 right-20 transform -translate-y-1/2 bg-explorer-card/80 border border-explorer-chrome rounded-full p-3 text-explorer-text hover:bg-explorer-card transition-all duration-300"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </>
  );
}
