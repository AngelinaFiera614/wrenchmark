
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, Upload, Image, Video, FileText, Trash2, Edit, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MediaUploadDialog from "./MediaUploadDialog";
import MediaEditDialog from "./MediaEditDialog";
import MediaPreviewDialog from "./MediaPreviewDialog";

interface MediaItem {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  mime_type: string;
  file_size_bytes: number;
  tags: string[];
  caption: string;
  alt_text: string;
  created_at: string;
  updated_at: string;
}

const MediaLibraryManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  const { data: mediaItems, refetch } = useQuery({
    queryKey: ['media-library'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as MediaItem[];
    }
  });

  const filteredItems = mediaItems?.filter(item => {
    const matchesSearch = item.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === "all" || item.file_type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Are you sure you want to delete "${item.file_name}"?`)) return;

    try {
      const { error } = await supabase
        .from('media_library')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: "Media deleted",
        description: `${item.file_name} has been deleted successfully.`,
      });

      refetch();
    } catch (error) {
      console.error('Error deleting media:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete media item.",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string, mimeType: string) => {
    if (fileType === 'image' || mimeType?.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-400" />;
    }
    if (fileType === 'video' || mimeType?.startsWith('video/')) {
      return <Video className="h-5 w-5 text-purple-400" />;
    }
    return <FileText className="h-5 w-5 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Media Library</span>
            <Button 
              onClick={() => setUploadDialogOpen(true)}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-explorer-text-muted" />
                <Input
                  placeholder="Search media files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-explorer-dark border-explorer-chrome/30"
                />
              </div>
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 bg-explorer-dark border border-explorer-chrome/30 rounded-md text-explorer-text"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
            </select>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems?.map((item) => (
              <Card key={item.id} className="bg-explorer-dark border-explorer-chrome/30">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getFileIcon(item.file_type, item.mime_type)}
                      <span className="text-sm font-medium text-explorer-text truncate">
                        {item.file_name}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewItem(item)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingItem(item)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item)}
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Preview */}
                  {item.file_type === 'image' && (
                    <div className="mb-3">
                      <img
                        src={item.file_url}
                        alt={item.alt_text || item.file_name}
                        className="w-full h-32 object-cover rounded border border-explorer-chrome/30"
                      />
                    </div>
                  )}

                  {/* Details */}
                  <div className="space-y-2 text-sm text-explorer-text-muted">
                    <div>Size: {formatFileSize(item.file_size_bytes || 0)}</div>
                    {item.caption && (
                      <div className="truncate">Caption: {item.caption}</div>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {(!filteredItems || filteredItems.length === 0) && (
            <div className="text-center py-12 text-explorer-text-muted">
              {searchTerm || selectedType !== "all" 
                ? "No media items match your search criteria."
                : "No media items found. Upload some files to get started."
              }
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <MediaUploadDialog
        open={uploadDialogOpen}
        onClose={(refresh) => {
          setUploadDialogOpen(false);
          if (refresh) refetch();
        }}
      />

      <MediaEditDialog
        open={!!editingItem}
        item={editingItem}
        onClose={(refresh) => {
          setEditingItem(null);
          if (refresh) refetch();
        }}
      />

      <MediaPreviewDialog
        open={!!previewItem}
        item={previewItem}
        onClose={() => setPreviewItem(null)}
      />
    </div>
  );
};

export default MediaLibraryManager;
