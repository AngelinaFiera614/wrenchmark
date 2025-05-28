
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brand } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Globe, Calendar, Award, Image } from 'lucide-react';
import { getBrandLogoUrl } from '@/utils/brandLogoUtils';

interface BrandTimelineModeProps {
  brand: Brand;
  onSwitchToSlideshow: () => void;
}

export default function BrandTimelineMode({ brand, onSwitchToSlideshow }: BrandTimelineModeProps) {
  const [activeTab, setActiveTab] = useState('story');
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

  return (
    <div className="min-h-screen bg-explorer-dark text-explorer-text">
      {/* Header */}
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
                src={logoData.url}
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

      {/* Timeline */}
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-explorer-text mb-6 flex items-center">
            <Calendar className="mr-3 h-6 w-6 text-explorer-teal" />
            Timeline
          </h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-explorer-teal via-explorer-chrome to-explorer-teal opacity-50" />
            
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-center gap-6"
                >
                  {/* Timeline dot */}
                  <div className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    milestone.importance === 'high' 
                      ? 'bg-explorer-teal border-explorer-teal shadow-lg shadow-explorer-teal/50' 
                      : 'bg-explorer-chrome border-explorer-chrome'
                  }`}>
                    <div className="w-2 h-2 rounded-full bg-explorer-dark" />
                  </div>
                  
                  {/* Timeline content */}
                  <div className="flex-1 bg-explorer-card border border-explorer-chrome/30 rounded-lg p-4 hover:border-explorer-teal/50 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl font-bold text-explorer-teal">{milestone.year}</span>
                      {milestone.importance === 'high' && (
                        <Award className="h-5 w-5 text-explorer-teal" />
                      )}
                    </div>
                    <p className="text-explorer-text-muted">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-explorer-card border border-explorer-chrome/30">
            <TabsTrigger value="story" className="data-[state=active]:bg-explorer-teal data-[state=active]:text-black">
              Brand Story
            </TabsTrigger>
            <TabsTrigger value="models" className="data-[state=active]:bg-explorer-teal data-[state=active]:text-black">
              Notable Models
            </TabsTrigger>
            <TabsTrigger value="evolution" className="data-[state=active]:bg-explorer-teal data-[state=active]:text-black">
              Logo Evolution
            </TabsTrigger>
            <TabsTrigger value="external" className="data-[state=active]:bg-explorer-teal data-[state=active]:text-black">
              External Links
            </TabsTrigger>
          </TabsList>

          <TabsContent value="story" className="mt-6">
            <div className="bg-explorer-card border border-explorer-chrome/30 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-explorer-text mb-4">The {brand.name} Story</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-explorer-text-muted leading-relaxed">
                  {brand.brand_history || brand.description || `${brand.name} has been a pioneering force in the motorcycle industry since ${brand.founded}. Founded in ${brand.country}, the company has consistently pushed the boundaries of motorcycle design and engineering, creating machines that are both beautiful and functional.`}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="models" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {notableModels.map((model, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-explorer-card border border-explorer-chrome/30 rounded-lg p-6 hover:border-explorer-teal/50 transition-colors duration-300"
                >
                  <h4 className="text-xl font-bold text-explorer-text mb-2">{model.name}</h4>
                  <p className="text-explorer-teal mb-2">{model.years}</p>
                  <p className="text-sm text-explorer-text-muted mb-3">{model.category}</p>
                  <p className="text-explorer-text-muted">{model.description}</p>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="evolution" className="mt-6">
            <div className="bg-explorer-card border border-explorer-chrome/30 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-explorer-text mb-6 flex items-center">
                <Image className="mr-3 h-6 w-6 text-explorer-teal" />
                Logo Evolution
              </h3>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-explorer-teal rounded-lg blur-xl opacity-20" />
                  <img 
                    src={logoData.url}
                    alt={`${brand.name} current logo`}
                    className="relative w-48 h-48 object-contain bg-explorer-dark-light rounded-lg p-4"
                  />
                </div>
              </div>
              <p className="text-center text-explorer-text-muted mt-4">
                Current {brand.name} logo
              </p>
            </div>
          </TabsContent>

          <TabsContent value="external" className="mt-6">
            <div className="bg-explorer-card border border-explorer-chrome/30 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-explorer-text mb-6">Learn More</h3>
              {brand.website_url ? (
                <Button
                  asChild
                  className="bg-explorer-teal hover:bg-explorer-teal-hover text-black font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
                >
                  <a href={brand.website_url} target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-5 w-5" />
                    Visit Official Website
                  </a>
                </Button>
              ) : (
                <p className="text-explorer-text-muted">Official website information not available</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
