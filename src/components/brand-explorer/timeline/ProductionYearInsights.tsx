
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Filter, Calendar, Zap } from 'lucide-react';

interface ProductionYear {
  year: number;
  models: number;
  totalProduction?: number;
  marketContext?: string;
  technicalUpdates?: string[];
  majorLaunches?: string[];
}

interface ProductionYearInsightsProps {
  brandName: string;
  productionData: ProductionYear[];
  onYearClick?: (year: ProductionYear) => void;
}

const specificationFilters = [
  { id: 'engine-updates', label: 'Engine Updates', color: 'bg-red-500' },
  { id: 'safety-features', label: 'Safety Features', color: 'bg-blue-500' },
  { id: 'electronics', label: 'Electronics', color: 'bg-green-500' },
  { id: 'design-refresh', label: 'Design Refresh', color: 'bg-purple-500' }
];

export default function ProductionYearInsights({
  brandName,
  productionData,
  onYearClick
}: ProductionYearInsightsProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'chart' | 'timeline'>('chart');

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  const chartData = productionData.map(year => ({
    year: year.year,
    models: year.models,
    production: year.totalProduction || 0
  }));

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-explorer-text">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-explorer-teal" />
            {brandName} Production Insights
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'chart' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('chart')}
              className="text-xs"
            >
              Chart
            </Button>
            <Button
              variant={viewMode === 'timeline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('timeline')}
              className="text-xs"
            >
              Timeline
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Specification Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-explorer-teal" />
            <span className="text-sm font-medium text-explorer-text">Filter by Updates</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {specificationFilters.map((filter) => (
              <Button
                key={filter.id}
                variant={selectedFilters.includes(filter.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFilter(filter.id)}
                className={`text-xs ${
                  selectedFilters.includes(filter.id) 
                    ? 'bg-explorer-teal text-explorer-dark' 
                    : 'border-explorer-chrome/30 text-explorer-text'
                }`}
              >
                <div className={`w-2 h-2 rounded-full mr-2 ${filter.color}`} />
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {viewMode === 'chart' ? (
          <div className="h-64 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                <XAxis dataKey="year" stroke="#A0AEC0" />
                <YAxis stroke="#A0AEC0" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A202C', 
                    border: '1px solid #4A5568',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="models" fill="#00D2B4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {productionData.map((year, index) => (
              <motion.div
                key={year.year}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-explorer-dark-light border border-explorer-chrome/20 rounded-lg p-3 hover:border-explorer-teal/50 transition-colors duration-300 cursor-pointer"
                onClick={() => onYearClick?.(year)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-explorer-teal" />
                    <span className="font-semibold text-explorer-text">{year.year}</span>
                    <Badge variant="secondary" className="text-xs">
                      {year.models} models
                    </Badge>
                  </div>
                  {year.totalProduction && (
                    <span className="text-xs text-explorer-text-muted">
                      {year.totalProduction.toLocaleString()} units
                    </span>
                  )}
                </div>
                
                {year.marketContext && (
                  <p className="text-xs text-explorer-text-muted mb-2">{year.marketContext}</p>
                )}
                
                {year.technicalUpdates && year.technicalUpdates.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-explorer-teal">
                      <Zap className="h-3 w-3" />
                      Technical Updates
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {year.technicalUpdates.slice(0, 3).map((update, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {update}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
