
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Grid, List, Download, Settings, Wrench } from 'lucide-react';
import { Motorcycle } from '@/types';
import EnhancedFiltersContainer from './filters/EnhancedFiltersContainer';

interface EnhancedMotorcycleManagementProps {
  motorcycles: Motorcycle[];
  onCreateNew: () => void;
  onEditMotorcycle: (motorcycle: Motorcycle) => void;
  onDeleteMotorcycle: (motorcycle: Motorcycle) => void;
  onToggleStatus: (motorcycle: Motorcycle) => void;
}

const EnhancedMotorcycleManagement = ({
  motorcycles,
  onCreateNew,
  onEditMotorcycle,
  onDeleteMotorcycle,
  onToggleStatus
}: EnhancedMotorcycleManagementProps) => {
  const [filteredMotorcycles, setFilteredMotorcycles] = useState<Motorcycle[]>(motorcycles);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleExport = () => {
    // Export filtered motorcycles to CSV
    const csvContent = filteredMotorcycles.map(m => ({
      Name: m.name,
      Brand: m.brand?.name || '',
      Category: m.category || m.type || '',
      Year: m.production_start_year || '',
      Status: m.is_draft ? 'Draft' : 'Published',
      'Engine Size': m.engine_size || '',
      Horsepower: m.horsepower || '',
      Weight: m.weight_kg || ''
    }));

    const csv = [
      Object.keys(csvContent[0]).join(','),
      ...csvContent.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'motorcycles.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header with clear action buttons */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-explorer-text">Motorcycle Management</h1>
          <p className="text-explorer-text-muted">
            Manage motorcycles, assign components, and configure trim levels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-explorer-dark border-explorer-chrome/30">
            {filteredMotorcycles.length} of {motorcycles.length} models
          </Badge>
          <Button
            variant="outline"
            onClick={handleExport}
            className="bg-explorer-dark border-explorer-chrome/30"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <div className="flex border border-explorer-chrome/30 rounded-md overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-accent-teal text-black' : ''}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-accent-teal text-black' : ''}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={onCreateNew}
            className="bg-accent-teal text-black hover:bg-accent-teal/80"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Motorcycle
          </Button>
        </div>
      </div>

      <EnhancedFiltersContainer
        motorcycles={motorcycles}
        onFilteredMotorcycles={setFilteredMotorcycles}
      />

      {/* Results */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">
            Motorcycle Models ({filteredMotorcycles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMotorcycles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-explorer-text-muted mb-4">
                No motorcycles match your current filters
              </div>
              <Button
                variant="outline"
                onClick={() => setFilteredMotorcycles(motorcycles)}
                className="bg-explorer-dark border-explorer-chrome/30"
              >
                Clear Filters
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMotorcycles.map((motorcycle) => (
                <div
                  key={motorcycle.id}
                  className="bg-explorer-dark border border-explorer-chrome/30 rounded-lg p-4 hover:bg-explorer-chrome/10 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-explorer-text truncate">
                      {motorcycle.name}
                    </h3>
                    <Badge
                      variant={motorcycle.is_draft ? 'secondary' : 'default'}
                      className={
                        motorcycle.is_draft
                          ? 'bg-orange-600/20 text-orange-400'
                          : 'bg-green-600/20 text-green-400'
                      }
                    >
                      {motorcycle.is_draft ? 'Draft' : 'Published'}
                    </Badge>
                  </div>
                  <p className="text-sm text-explorer-text-muted mb-3">
                    {motorcycle.brand?.name} • {motorcycle.category || motorcycle.type}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-explorer-text-muted">
                      {motorcycle.production_start_year || 'Unknown'}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditMotorcycle(motorcycle)}
                        className="text-xs"
                        title="Edit motorcycle details, assign components, and manage trim levels"
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Manage
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onToggleStatus(motorcycle)}
                        className="text-xs"
                      >
                        {motorcycle.is_draft ? 'Publish' : 'Unpublish'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMotorcycles.map((motorcycle) => (
                <div
                  key={motorcycle.id}
                  className="flex items-center justify-between p-3 bg-explorer-dark border border-explorer-chrome/30 rounded-lg hover:bg-explorer-chrome/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-explorer-text">
                        {motorcycle.name}
                      </h3>
                      <p className="text-sm text-explorer-text-muted">
                        {motorcycle.brand?.name} • {motorcycle.category || motorcycle.type} • {motorcycle.production_start_year || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={motorcycle.is_draft ? 'secondary' : 'default'}
                      className={
                        motorcycle.is_draft
                          ? 'bg-orange-600/20 text-orange-400'
                          : 'bg-green-600/20 text-green-400'
                      }
                    >
                      {motorcycle.is_draft ? 'Draft' : 'Published'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditMotorcycle(motorcycle)}
                      title="Edit motorcycle details, assign components, and manage trim levels"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Manage
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggleStatus(motorcycle)}
                    >
                      {motorcycle.is_draft ? 'Publish' : 'Unpublish'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedMotorcycleManagement;
