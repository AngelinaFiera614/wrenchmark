
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brand } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Clock, Play } from 'lucide-react';
import { getBrandLogoUrl, getBrandFallbackImage } from '@/utils/brandLogoUtils';

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

  const handleImageError = (index: number) => {
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  const getDisplayImage = () => {
    if (imageError[currentIndex]) {
      return getBrandFallbackImage(currentBrand.name);
    }
    return logoData.url;
  };

  return (
    <div className="relative h-screen w-full overflow-hidden pt-16">
      {/* Background with smoke effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-explorer-dark via-explorer-dark-light to-explorer-dark opacity-90" />
      <div className="absolute inset-0 bg-explorer-smoke opacity-20" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="relative h-full flex items-center justify-center p-8"
        >
          {/* Main brand card */}
          <div className="relative max-w-4xl w-full">
            {/* Metallic frame */}
            <div className="absolute inset-0 bg-gradient-to-br from-explorer-chrome-light via-explorer-chrome to-explorer-chrome-dark rounded-2xl opacity-30 blur-sm" />
            <div className="relative bg-explorer-card border border-explorer-chrome rounded-2xl p-12 backdrop-blur-xl">
              
              {/* Logo section */}
              <motion.div
                initial={{ rotateY: 180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="flex justify-center mb-8"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-explorer-teal rounded-full blur-xl opacity-30 animate-pulse" />
                  <img 
                    src={getDisplayImage()}
                    alt={`${currentBrand.name} logo`}
                    className="relative w-32 h-32 object-contain filter drop-shadow-2xl"
                    style={{
                      filter: 'drop-shadow(0 0 20px rgba(0, 210, 180, 0.5))'
                    }}
                    onError={() => handleImageError(currentIndex)}
                  />
                </div>
              </motion.div>

              {/* Brand name and tagline */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-center mb-8"
              >
                <h1 className="text-6xl font-bold text-explorer-text mb-4 tracking-wider">
                  {currentBrand.name}
                </h1>
                <p className="text-xl text-explorer-text-muted">
                  Founded {currentBrand.founded} • {currentBrand.country}
                </p>
              </motion.div>

              {/* Known for badges */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-wrap justify-center gap-3 mb-8"
              >
                {currentBrand.known_for?.slice(0, 4).map((specialty, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="px-4 py-2 text-sm bg-explorer-teal/20 border-explorer-teal text-explorer-teal hover:bg-explorer-teal/30 transition-all duration-300"
                  >
                    {specialty}
                  </Badge>
                ))}
              </motion.div>

              {/* Fun fact bubble */}
              <motion.div
                key={currentFactIndex}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative mx-auto max-w-md mb-8"
              >
                <div className="bg-gradient-to-r from-explorer-teal/20 to-explorer-chrome/20 border border-explorer-teal/50 rounded-full px-6 py-4 text-center">
                  <p className="text-explorer-text text-sm">
                    💡 {funFacts[currentFactIndex]}
                  </p>
                </div>
              </motion.div>

              {/* Navigation buttons */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="flex justify-center gap-4"
              >
                <Button
                  onClick={onSwitchToTimeline}
                  className="bg-explorer-teal hover:bg-explorer-teal-hover text-black font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-explorer-teal/25"
                >
                  <Clock className="mr-2 h-5 w-5" />
                  View Timeline
                </Button>
                
                <Button
                  onClick={nextSlide}
                  variant="outline"
                  className="border-explorer-chrome text-explorer-text hover:bg-explorer-chrome/20 px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
                >
                  Next Brand
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {brands.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAutoPlaying(false);
              onIndexChange(index);
            }}
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
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute top-1/2 right-8 transform -translate-y-1/2 bg-explorer-card/80 border border-explorer-chrome rounded-full p-3 text-explorer-text hover:bg-explorer-card transition-all duration-300"
      >
        <Play className={`h-5 w-5 ${isAutoPlaying ? 'opacity-100' : 'opacity-50'}`} />
      </button>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-8 transform -translate-y-1/2 bg-explorer-card/80 border border-explorer-chrome rounded-full p-3 text-explorer-text hover:bg-explorer-card transition-all duration-300"
      >
        <ChevronRight className="h-6 w-6 rotate-180" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-20 transform -translate-y-1/2 bg-explorer-card/80 border border-explorer-chrome rounded-full p-3 text-explorer-text hover:bg-explorer-card transition-all duration-300"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}
