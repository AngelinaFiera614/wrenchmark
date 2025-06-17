
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MotorcycleModel } from '@/types/motorcycle';

interface EnhancedModelStatsProps {
  models: MotorcycleModel[];
  filteredModels: MotorcycleModel[];
}

const EnhancedModelStats: React.FC<EnhancedModelStatsProps> = ({ models, filteredModels }) => {
  const publishedCount = models.filter(m => !m.is_draft).length;
  const draftCount = models.filter(m => m.is_draft).length;
  const activeProductionCount = models.filter(m => (m.production_status || 'active') === 'active').length;
  const discontinuedCount = models.filter(m => (m.production_status || 'active') === 'discontinued').length;
  const uniqueBrands = new Set(models.map(m => m.brand_id)).size;
  const uniqueCategories = new Set(models.map(m => m.type)).size;

  const stats = [
    {
      title: 'Total Models',
      value: models.length,
      filtered: filteredModels.length,
      color: 'text-explorer-text'
    },
    {
      title: 'Published',
      value: publishedCount,
      filtered: filteredModels.filter(m => !m.is_draft).length,
      color: 'text-green-400'
    },
    {
      title: 'Drafts',
      value: draftCount,
      filtered: filteredModels.filter(m => m.is_draft).length,
      color: 'text-orange-400'
    },
    {
      title: 'Active Production',
      value: activeProductionCount,
      filtered: filteredModels.filter(m => (m.production_status || 'active') === 'active').length,
      color: 'text-accent-teal'
    },
    {
      title: 'Discontinued',
      value: discontinuedCount,
      filtered: filteredModels.filter(m => (m.production_status || 'active') === 'discontinued').length,
      color: 'text-red-400'
    },
    {
      title: 'Brands',
      value: uniqueBrands,
      filtered: new Set(filteredModels.map(m => m.brand_id)).size,
      color: 'text-blue-400'
    },
    {
      title: 'Categories',
      value: uniqueCategories,
      filtered: new Set(filteredModels.map(m => m.type)).size,
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-explorer-text">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.filtered}
              {stat.filtered !== stat.value && (
                <span className="text-sm text-explorer-text-muted ml-1">
                  / {stat.value}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EnhancedModelStats;
