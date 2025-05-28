
import React from 'react';
import { motion } from 'framer-motion';
import { Brand } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Clock } from 'lucide-react';

interface BrandSlideshowCardProps {
  brand: Brand;
  logoUrl: string;
  onSwitchToTimeline: () => void;
  onNextSlide: () => void;
  onImageError: () => void;
}

export default function BrandSlideshowCard({
  brand,
  logoUrl,
  onSwitchToTimeline,
  onNextSlide,
  onImageError
}: BrandSlideshowCardProps) {
  return (
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
              src={logoUrl}
              alt={`${brand.name} logo`}
              className="relative w-32 h-32 object-contain filter drop-shadow-2xl"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(0, 210, 180, 0.5))'
              }}
              onError={onImageError}
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
            {brand.name}
          </h1>
          <p className="text-xl text-explorer-text-muted">
            Founded {brand.founded} • {brand.country}
          </p>
        </motion.div>

        {/* Known for badges */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {brand.known_for?.slice(0, 4).map((specialty, index) => (
            <Badge 
              key={index}
              variant="outline" 
              className="px-4 py-2 text-sm bg-explorer-teal/20 border-explorer-teal text-explorer-teal hover:bg-explorer-teal/30 transition-all duration-300"
            >
              {specialty}
            </Badge>
          ))}
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
            onClick={onNextSlide}
            variant="outline"
            className="border-explorer-chrome text-explorer-text hover:bg-explorer-chrome/20 px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
          >
            Next Brand
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
