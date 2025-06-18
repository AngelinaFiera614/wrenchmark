
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Upload, FolderPlus, Grid, List, Filter, 
  Image, Video, FileText, Music, Download, Trash2,
  Eye, Edit, Copy, Tag, Calendar, User
} from 'lucide-react';
import { getMediaLibraryItems, uploadMediaItem, deleteMediaItem, updateMediaItem, MediaLibraryItem } from '@/services/mediaLibraryService';
import { useToast } from '@/hooks/use-toast';
import MediaUploadDialog from './MediaUploadDialog';
import MediaPreviewDialog from './MediaPreviewDialog';

interface MediaLibraryBrowserProps {
  onSelectMedia?: (item: MediaLibraryItem) => void;
  allowMultiSelect?: boolean;
  fileTypeFilter?: string[];
  showUpload?: boolean;
}

export default function MediaLibraryBrowser({
  onSelectMedia,
  allowMultiSelect = false,
  fileTypeFilter,
  showUpload = true
}: MediaLibraryBrowserProps) {
  const [mediaItems, setMediaItems] = useState<MediaLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewItem, setPreviewItem] = useState<MediaLibraryItem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMediaItems();
  }, [selectedType, selectedTags, searchQuery]);

  const loadMediaItems = async () => {
    try {
      setLoading(true);
      const items = await getMediaLibraryItems(
        selectedType === 'all' ? undefined : selectedType,
        selectedTags.length > 0 ? selectedTags : undefined,
        searchQuery || undefined
      );
      
      let filteredItems = items;
      if (fileTypeFilter && fileTypeFilter.length > 0) {
        filteredItems = items.filter(item => fileTypeFilter.includes(item.file_type));
      }
      
      setMediaItems(filteredItems);
    } catch (error) {
      console.error('Error loading media items:', error);
      toast({
        variant: "destructive",
        title: "Error loading media",
        description: "Failed to load media library items"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (newItem: MediaLibraryItem) => {
    setMediaItems(prev => [newItem, ...prev]);
    setShowUploadDialog(false);
    toast({
      title: "Upload successful",
      description: "Media file has been uploaded successfully"
    });
  };

  const handleSelectItem = (item: MediaLibraryItem) => {
    if (allowMultiSelect) {
      setSelectedItems(prev => 
        prev.includes(item.id) 
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
    } else {
      onSelectMedia?.(item);
    }
  };

  const handlePreview = (item: MediaLibraryItem) => {
    setPreviewItem(item);
    setShowPreviewDialog(true);
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this media file?')) return;
    
    try {
      await deleteMediaItem(itemId);
      setMediaItems(prev => prev.filter(item => item.id !== itemId));
      toast({
        title: "Media deleted",
        description: "Media file has been deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting media:', error);
      toast({
        variant: "destructive",
        title: "Error deleting media",
        description: "Failed to delete media file"
      });
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uniqueTags = Array.from(new Set(mediaItems.flatMap(item => item.tags)));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Media Library</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
          {showUpload && (
            <MediaUploadDialog
              open={showUploadDialog}
              onClose={(refresh) => {
                setShowUploadDialog(false);
                if (refresh) loadMediaItems();
              }}
              onUploadSuccess={handleUploadSuccess}
            />
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search media files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
          </SelectContent>
        </Select>

        {uniqueTags.length > 0 && (
          <Select value={selectedTags[0] || ''} onValueChange={(value) => setSelectedTags(value ? [value] : [])}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Tags</SelectItem>
              {uniqueTags.map(tag => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Media Grid/List */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mediaItems.map((item) => (
            <MediaGridItem
              key={item.id}
              item={item}
              selected={selectedItems.includes(item.id)}
              onSelect={() => handleSelectItem(item)}
              onPreview={() => handlePreview(item)}
              onDelete={() => handleDelete(item.id)}
              getFileIcon={getFileIcon}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {mediaItems.map((item) => (
            <MediaListItem
              key={item.id}
              item={item}
              selected={selectedItems.includes(item.id)}
              onSelect={() => handleSelectItem(item)}
              onPreview={() => handlePreview(item)}
              onDelete={() => handleDelete(item.id)}
              getFileIcon={getFileIcon}
              formatFileSize={formatFileSize}
            />
          ))}
        </div>
      )}

      {mediaItems.length === 0 && !loading && (
        <div className="text-center py-12">
          <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No media files found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || selectedType !== 'all' ? 'Try adjusting your filters' : 'Upload your first media file to get started'}
          </p>
          {showUpload && (
            <Button onClick={() => setShowUploadDialog(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
          )}
        </div>
      )}

      {/* Selected Items Actions */}
      {allowMultiSelect && selectedItems.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-background border rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
            </span>
            <Button size="sm" variant="outline" onClick={() => setSelectedItems([])}>
              Clear
            </Button>
            <Button size="sm" onClick={() => {
              selectedItems.forEach(id => {
                const item = mediaItems.find(i => i.id === id);
                if (item) onSelectMedia?.(item);
              });
            }}>
              Use Selected
            </Button>
          </div>
        </div>
      )}

      {/* Preview Dialog */}
      <MediaPreviewDialog
        open={showPreviewDialog}
        onClose={() => setShowPreviewDialog(false)}
        item={previewItem}
        onUpdate={loadMediaItems}
      />
    </div>
  );
}

function MediaGridItem({ 
  item, 
  selected, 
  onSelect, 
  onPreview, 
  onDelete, 
  getFileIcon 
}: {
  item: MediaLibraryItem;
  selected: boolean;
  onSelect: () => void;
  onPreview: () => void;
  onDelete: () => void;
  getFileIcon: (type: string) => React.ReactNode;
}) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${selected ? 'ring-2 ring-accent-teal' : ''}`}
      onClick={onSelect}
    >
      <CardContent className="p-2">
        <div className="aspect-square bg-muted rounded-md mb-2 relative overflow-hidden">
          {item.file_type === 'image' ? (
            <img 
              src={item.file_url} 
              alt={item.alt_text || item.file_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {getFileIcon(item.file_type)}
            </div>
          )}
          
          <div className="absolute top-1 right-1 flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
            >
              <Eye className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs font-medium truncate">{item.file_name}</p>
          <div className="flex items-center gap-1">
            {getFileIcon(item.file_type)}
            <span className="text-xs text-muted-foreground capitalize">{item.file_type}</span>
          </div>
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                  {tag}
                </Badge>
              ))}
              {item.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  +{item.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MediaListItem({ 
  item, 
  selected, 
  onSelect, 
  onPreview, 
  onDelete, 
  getFileIcon,
  formatFileSize 
}: {
  item: MediaLibraryItem;
  selected: boolean;
  onSelect: () => void;
  onPreview: () => void;
  onDelete: () => void;
  getFileIcon: (type: string) => React.ReactNode;
  formatFileSize: (bytes: number) => string;
}) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-sm ${selected ? 'ring-2 ring-accent-teal' : ''}`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center overflow-hidden">
            {item.file_type === 'image' ? (
              <img 
                src={item.file_url} 
                alt={item.alt_text || item.file_name}
                className="w-full h-full object-cover"
              />
            ) : (
              getFileIcon(item.file_type)
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{item.file_name}</h4>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                {getFileIcon(item.file_type)}
                <span className="capitalize">{item.file_type}</span>
              </span>
              {item.file_size_bytes && (
                <span>{formatFileSize(item.file_size_bytes)}</span>
              )}
              <span>{new Date(item.created_at).toLocaleDateString()}</span>
            </div>
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
