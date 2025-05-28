
import React from 'react';
import { motion } from 'framer-motion';
import { Brand, NotableModel } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Globe, Image } from 'lucide-react';

interface TimelineTabsContentProps {
  brand: Brand;
  logoUrl: string;
  notableModels: NotableModel[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export default function TimelineTabsContent({
  brand,
  logoUrl,
  notableModels,
  activeTab,
  onTabChange
}: TimelineTabsContentProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
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
                src={logoUrl}
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
  );
}
