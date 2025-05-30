
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Image, Video, FileText, Calendar, Eye, Star, Trash2, 
  Search, Filter, MoreHorizontal, Download
} from "lucide-react";
import { EnhancedMotorcycleImage, MediaType, PhotoContext } from "@/types/media";
import { useEnhancedMedia } from "@/hooks/useEnhancedMedia";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EnhancedMediaGalleryProps {
  motorcycleId?: string;
  media?: EnhancedMotorcycleImage[];
  onMediaSelect?: (media: EnhancedMotorcycleImage) => void;
  onMediaEdit?: (media: EnhancedMotorcycleImage) => void;
  onMediaDelete?: (media: EnhancedMotorcycleImage) => void;
  enableTimeline?: boolean;
}

const MEDIA_TYPE_ICONS = {
  image: <Image className="h-4 w-4" />,
  video: <Video className="h-4 w-4" />,
  document: <FileText className="h-4 w-4" />,
  brochure: <FileText className="h-4 w-4" />,
  manual: <FileText className="h-4 w-4" />
};

export default function EnhancedMediaGallery({
  motorcycleId,
  media: propMedia,
  onMediaSelect,
  onMediaEdit,
  onMediaDelete,
  enableTimeline = false
}: EnhancedMediaGalleryProps) {
  const { media: hookMedia, isLoading, deleteMedia, setPrimaryImage } = useEnhancedMedia(motorcycleId);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<MediaType | 'all'>('all');
  const [filterContext, setFilterContext] = useState<PhotoContext | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  const media = propMedia || hookMedia;

  const filteredMedia = media.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.alt_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.caption?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || item.media_type === filterType;
    const matchesContext = filterContext === 'all' || item.photo_context === filterContext;
    
    return matchesSearch && matchesType && matchesContext;
  });

  const handleDelete = async (item: EnhancedMotorcycleImage) => {
    if (onMediaDelete) {
      onMediaDelete(item);
    } else {
      await deleteMedia(item.id);
    }
  };

  const handleSetPrimary = async (item: EnhancedMotorcycleImage) => {
    if (motorcycleId) {
      await setPrimaryImage(item.id);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-muted-foreground">Loading media...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Media Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={(value: MediaType | 'all') => setFilterType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Media Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterContext} onValueChange={(value: PhotoContext | 'all') => setFilterContext(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Context" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contexts</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="action">Action</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="historic">Historic</SelectItem>
                <SelectItem value="press">Press</SelectItem>
              </SelectContent>
            </Select>

            <Select value={viewMode} onValueChange={(value: 'grid' | 'timeline') => setViewMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid View</SelectItem>
                <SelectItem value="timeline">Timeline View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="text-muted-foreground">
                {media.length === 0 ? 'No media found' : 'No media matches your filters'}
              </div>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'timeline' ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'}>
          {filteredMedia.map((item) => (
            <Card 
              key={item.id} 
              className={`${item.is_primary ? 'ring-2 ring-accent-teal' : ''} hover:shadow-lg transition-shadow cursor-pointer`}
              onClick={() => onMediaSelect?.(item)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Media Preview */}
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
                    {item.media_type === 'image' ? (
                      <img 
                        src={item.file_url} 
                        alt={item.alt_text || item.file_name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        {MEDIA_TYPE_ICONS[item.media_type as MediaType]}
                        <span className="text-sm font-medium">
                          {item.media_type?.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Media Info */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.file_name}</h4>
                        {item.caption && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.caption}
                          </p>
                        )}
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onMediaEdit?.(item)}>
                            Edit Details
                          </DropdownMenuItem>
                          {!item.is_primary && (
                            <DropdownMenuItem onClick={() => handleSetPrimary(item)}>
                              Set as Primary
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem asChild>
                            <a href={item.file_url} download target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(item)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1">
                      {item.is_primary && (
                        <Badge variant="default" className="bg-accent-teal">
                          <Star className="h-3 w-3 mr-1" />
                          Primary
                        </Badge>
                      )}
                      {item.is_featured && (
                        <Badge variant="secondary">
                          <Eye className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {item.media_type && (
                        <Badge variant="outline">
                          {MEDIA_TYPE_ICONS[item.media_type as MediaType]}
                          <span className="ml-1">{item.media_type}</span>
                        </Badge>
                      )}
                      {item.photo_context && (
                        <Badge variant="outline">
                          {item.photo_context}
                        </Badge>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>Size: {formatFileSize(item.file_size_bytes)}</span>
                        {item.year_captured && (
                          <span>Year: {item.year_captured}</span>
                        )}
                      </div>
                      <div>Uploaded: {formatDate(item.created_at)}</div>
                      {item.angle && (
                        <div>Angle: {item.angle.replace('_', ' ')}</div>
                      )}
                    </div>

                    {/* Historical significance */}
                    {item.historical_significance && (
                      <div className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-1 mb-1">
                          <Calendar className="h-3 w-3" />
                          <span className="font-medium">Historical Note:</span>
                        </div>
                        <p className="line-clamp-2">{item.historical_significance}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
