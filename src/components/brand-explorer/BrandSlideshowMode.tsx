
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brand } from '@/types';
import { getBrandLogoUrl, getBrandFallbackImage } from '@/utils/brandLogoUtils';
import {
  BrandSlideshowBackground,
  BrandSlideshowCard,
  FunFactBubble,
  SlideshowNavigation
} from './slideshow';

interface BrandSlideshowModeProps {
  brands: Brand[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onSwitchToTimeline: () => void;
}

const funFacts = [
  "Was one of the first manufacturers to use disc brakes",
  "Holds multiple land speed records",
  "Started as a bicycle manufacturer",
  "Pioneered the use of aluminum frames",
  "Famous for their distinctive engine sound",
  "Introduced the first production superbike",
  "Known for innovative aerodynamic designs",
  "Has a rich racing heritage spanning decades"
];

export default function BrandSlideshowMode({
  brands,
  currentIndex,
  onIndexChange,
  onSwitchToTimeline
}: BrandSlideshowModeProps) {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  const currentBrand = brands[currentIndex];
  const logoData = getBrandLogoUrl(currentBrand.logo_url, currentBrand.slug);

  // Auto-advance slideshow
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      onIndexChange((currentIndex + 1) % brands.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [currentIndex, brands.length, isAutoPlaying, onIndexChange]);

  // Rotate fun facts
  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % funFacts.length);
    }, 3000);

    return () => clearInterval(factInterval);
  }, []);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    onIndexChange((currentIndex + 1) % brands.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    onIndexChange(currentIndex === 0 ? brands.length - 1 : currentIndex - 1);
  };

  const handleIndexChange = (index: number) => {
    setIsAutoPlaying(false);
    onIndexChange(index);
  };

  const handleImageError = () => {
    setImageError(prev => ({ ...prev, [currentIndex]: true }));
  };

  const getDisplayImage = () => {
    if (imageError[currentIndex]) {
      return getBrandFallbackImage(currentBrand.name);
    }
    return logoData.url;
  };

  return (
    <div className="relative h-screen w-full overflow-hidden pt-16">
      <BrandSlideshowBackground />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="relative h-full flex items-center justify-center p-8"
        >
          <div className="flex flex-col items-center">
            <BrandSlideshowCard
              brand={currentBrand}
              logoUrl={getDisplayImage()}
              onSwitchToTimeline={onSwitchToTimeline}
              onNextSlide={nextSlide}
              onImageError={handleImageError}
            />
            
            <FunFactBubble 
              currentFactIndex={currentFactIndex}
              funFacts={funFacts}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      <SlideshowNavigation
        brands={brands}
        currentIndex={currentIndex}
        isAutoPlaying={isAutoPlaying}
        onIndexChange={handleIndexChange}
        onToggleAutoPlay={() => setIsAutoPlaying(!isAutoPlaying)}
        onPrevSlide={prevSlide}
        onNextSlide={nextSlide}
      />
    </div>
  );
}
