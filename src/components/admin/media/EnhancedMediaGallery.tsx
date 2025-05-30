
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Filter, 
  Grid, 
  List, 
  Calendar, 
  Image, 
  Video, 
  FileText, 
  Star,
  Eye,
  Download,
  Edit,
  Trash2
} from "lucide-react";
import { EnhancedMotorcycleImage, MediaFilters, PhotoContext, MediaType } from "@/types/media";

interface EnhancedMediaGalleryProps {
  media: EnhancedMotorcycleImage[];
  onMediaSelect?: (media: EnhancedMotorcycleImage) => void;
  onMediaEdit?: (media: EnhancedMotorcycleImage) => void;
  onMediaDelete?: (media: EnhancedMotorcycleImage) => void;
  enableTimeline?: boolean;
}

export default function EnhancedMediaGallery({
  media,
  onMediaSelect,
  onMediaEdit,
  onMediaDelete,
  enableTimeline = true
}: EnhancedMediaGalleryProps) {
  const [filters, setFilters] = useState<MediaFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'timeline'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique filter options from media data
  const filterOptions = useMemo(() => ({
    contexts: [...new Set(media.map(m => m.photo_context).filter(Boolean))] as PhotoContext[],
    angles: [...new Set(media.map(m => m.angle).filter(Boolean))],
    colors: [...new Set(media.map(m => m.color).filter(Boolean))],
    years: [...new Set(media.map(m => m.year_captured).filter(Boolean))].sort((a, b) => (b || 0) - (a || 0)),
    mediaTypes: [...new Set(media.map(m => m.media_type))] as MediaType[]
  }), [media]);

  // Filter media based on current filters and search
  const filteredMedia = useMemo(() => {
    return media.filter(item => {
      const matchesSearch = !searchTerm || 
        item.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.alt_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.historical_significance?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesContext = !filters.context?.length || 
        (item.photo_context && filters.context.includes(item.photo_context));

      const matchesAngle = !filters.angle?.length || 
        (item.angle && filters.angle.includes(item.angle));

      const matchesColor = !filters.color?.length || 
        (item.color && filters.color.includes(item.color));

      const matchesYear = !filters.year?.length || 
        (item.year_captured && filters.year.includes(item.year_captured));

      const matchesMediaType = !filters.mediaType?.length || 
        filters.mediaType.includes(item.media_type);

      const matchesHistoric = filters.isHistoric === undefined || 
        (filters.isHistoric && item.historical_significance) ||
        (!filters.isHistoric && !item.historical_significance);

      const matchesFeatured = filters.isFeatured === undefined || 
        item.is_featured === filters.isFeatured;

      return matchesSearch && matchesContext && matchesAngle && 
             matchesColor && matchesYear && matchesMediaType && 
             matchesHistoric && matchesFeatured;
    });
  }, [media, filters, searchTerm]);

  // Group media by year for timeline view
  const timelineData = useMemo(() => {
    const grouped = filteredMedia.reduce((acc, item) => {
      const year = item.year_captured || item.year || 'Unknown';
      if (!acc[year]) acc[year] = [];
      acc[year].push(item);
      return acc;
    }, {} as Record<string | number, EnhancedMotorcycleImage[]>);

    return Object.keys(grouped)
      .sort((a, b) => {
        if (a === 'Unknown') return 1;
        if (b === 'Unknown') return -1;
        return Number(b) - Number(a);
      })
      .map(year => ({ year, items: grouped[year] }));
  }, [filteredMedia]);

  const getMediaIcon = (mediaType: MediaType) => {
    switch (mediaType) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const MediaCard = ({ item }: { item: EnhancedMotorcycleImage }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video bg-gray-100">
        {item.media_type === 'image' ? (
          <img
            src={item.file_url}
            alt={item.alt_text || item.file_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            {getMediaIcon(item.media_type)}
            <span className="ml-2 text-sm text-gray-600">
              {item.media_type.toUpperCase()}
            </span>
          </div>
        )}
        
        <div className="absolute top-2 left-2 flex gap-1">
          {item.is_primary && (
            <Badge variant="default" className="bg-accent-teal">
              Primary
            </Badge>
          )}
          {item.is_featured && (
            <Badge variant="secondary">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>

        <div className="absolute top-2 right-2">
          <Badge variant="outline" className="bg-white/90">
            {getMediaIcon(item.media_type)}
            <span className="ml-1">{item.media_type}</span>
          </Badge>
        </div>
      </div>

      <CardContent className="p-3">
        <div className="space-y-2">
          <h4 className="font-medium text-sm truncate">{item.file_name}</h4>
          
          <div className="flex flex-wrap gap-1">
            {item.angle && (
              <Badge variant="outline" className="text-xs">
                {item.angle.replace('_', ' ')}
              </Badge>
            )}
            {item.photo_context && (
              <Badge variant="outline" className="text-xs">
                {item.photo_context}
              </Badge>
            )}
            {item.color && (
              <Badge variant="outline" className="text-xs">
                {item.color}
              </Badge>
            )}
          </div>

          {item.year_captured && (
            <div className="flex items-center text-xs text-gray-600">
              <Calendar className="h-3 w-3 mr-1" />
              {item.year_captured}
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMediaSelect?.(item)}
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMediaEdit?.(item)}
              >
                <Edit className="h-3 w-3" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMediaDelete?.(item)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Media Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              {enableTimeline && (
                <Button
                  variant={viewMode === 'timeline' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('timeline')}
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Media Type</Label>
              <Select
                value={filters.mediaType?.[0] || ''}
                onValueChange={(value) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    mediaType: value ? [value as MediaType] : undefined 
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  {filterOptions.mediaTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        {getMediaIcon(type)}
                        {type}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Context</Label>
              <Select
                value={filters.context?.[0] || ''}
                onValueChange={(value) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    context: value ? [value as PhotoContext] : undefined 
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All contexts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All contexts</SelectItem>
                  {filterOptions.contexts.map(context => (
                    <SelectItem key={context} value={context}>
                      {context.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Year</Label>
              <Select
                value={filters.year?.[0]?.toString() || ''}
                onValueChange={(value) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    year: value ? [parseInt(value)] : undefined 
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All years</SelectItem>
                  {filterOptions.years.map(year => (
                    <SelectItem key={year} value={year?.toString() || ''}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="historic"
                  checked={filters.isHistoric || false}
                  onCheckedChange={(checked) => 
                    setFilters(prev => ({ ...prev, isHistoric: checked as boolean }))
                  }
                />
                <Label htmlFor="historic">Historic only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={filters.isFeatured || false}
                  onCheckedChange={(checked) => 
                    setFilters(prev => ({ ...prev, isFeatured: checked as boolean }))
                  }
                />
                <Label htmlFor="featured">Featured only</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {filteredMedia.length} of {media.length} media items
        </p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setFilters({});
            setSearchTerm('');
          }}
        >
          Clear Filters
        </Button>
      </div>

      {/* Media Display */}
      {viewMode === 'timeline' ? (
        <div className="space-y-8">
          {timelineData.map(({ year, items }) => (
            <div key={year}>
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-xl font-bold">{year}</h3>
                <Separator className="flex-1" />
                <Badge variant="secondary">{items.length} items</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map(item => (
                  <MediaCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            : "space-y-4"
        }>
          {filteredMedia.map(item => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {filteredMedia.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No media found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
