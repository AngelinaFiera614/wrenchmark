
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Image, Video, FileText, Timeline, Settings } from "lucide-react";
import EnhancedMediaUpload from "@/components/admin/media/EnhancedMediaUpload";
import EnhancedMediaGallery from "@/components/admin/media/EnhancedMediaGallery";
import { EnhancedMotorcycleImage } from "@/types/media";

export default function AdminEnhancedMedia() {
  const [selectedTab, setSelectedTab] = useState('upload');
  const [mediaData, setMediaData] = useState<EnhancedMotorcycleImage[]>([]);

  // Mock data for demonstration
  const mockMedia: EnhancedMotorcycleImage[] = [
    {
      id: '1',
      file_name: 'ducati-panigale-v4-front.jpg',
      file_url: '/api/placeholder/400/300',
      alt_text: 'Ducati Panigale V4 Front View',
      angle: 'front',
      photo_context: 'studio',
      color: 'Ducati Red',
      color_code: 'DR-1',
      year_captured: 2024,
      media_type: 'image',
      is_primary: true,
      is_featured: true,
      file_size_bytes: 1024000,
      width_px: 1920,
      height_px: 1080,
      historical_significance: 'Launch press kit image for the 2024 model year',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      file_name: 'ducati-panigale-v4-action.jpg',
      file_url: '/api/placeholder/400/300',
      alt_text: 'Ducati Panigale V4 Action Shot',
      angle: 'right_side',
      photo_context: 'action',
      color: 'Ducati Red',
      year_captured: 2024,
      media_type: 'image',
      is_primary: false,
      is_featured: true,
      file_size_bytes: 1200000,
      width_px: 1920,
      height_px: 1080,
      historical_significance: 'Track testing at Mugello Circuit',
      created_at: '2024-02-01T14:30:00Z',
      updated_at: '2024-02-01T14:30:00Z'
    },
    {
      id: '3',
      file_name: 'ducati-panigale-v4-review.mp4',
      file_url: '/api/placeholder/video',
      alt_text: 'Ducati Panigale V4 Review Video',
      media_type: 'video',
      video_url: '/api/placeholder/video',
      thumbnail_url: '/api/placeholder/400/300',
      duration_seconds: 420,
      year_captured: 2024,
      is_primary: false,
      is_featured: true,
      historical_significance: 'Official launch review video',
      created_at: '2024-02-15T09:00:00Z',
      updated_at: '2024-02-15T09:00:00Z'
    }
  ];

  const handleUploadComplete = (uploadedFiles: any[]) => {
    console.log('Upload complete:', uploadedFiles);
    // Here we would typically refresh the media data
  };

  const handleMediaSelect = (media: EnhancedMotorcycleImage) => {
    console.log('Media selected:', media);
  };

  const handleMediaEdit = (media: EnhancedMotorcycleImage) => {
    console.log('Edit media:', media);
  };

  const handleMediaDelete = (media: EnhancedMotorcycleImage) => {
    console.log('Delete media:', media);
  };

  const getMediaStats = () => {
    const stats = {
      total: mockMedia.length,
      images: mockMedia.filter(m => m.media_type === 'image').length,
      videos: mockMedia.filter(m => m.media_type === 'video').length,
      documents: mockMedia.filter(m => 
        ['document', 'brochure', 'manual'].includes(m.media_type)
      ).length,
      historic: mockMedia.filter(m => m.historical_significance).length,
      featured: mockMedia.filter(m => m.is_featured).length
    };
    return stats;
  };

  const stats = getMediaStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Enhanced Media Management</h1>
          <p className="text-muted-foreground">
            Comprehensive media handling with historical tracking and advanced organization
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent-teal">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Media</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-1">
              <Image className="h-4 w-4 mr-1" />
              <div className="text-2xl font-bold">{stats.images}</div>
            </div>
            <div className="text-sm text-muted-foreground">Images</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-1">
              <Video className="h-4 w-4 mr-1" />
              <div className="text-2xl font-bold">{stats.videos}</div>
            </div>
            <div className="text-sm text-muted-foreground">Videos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-1">
              <FileText className="h-4 w-4 mr-1" />
              <div className="text-2xl font-bold">{stats.documents}</div>
            </div>
            <div className="text-sm text-muted-foreground">Documents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-1">
              <Timeline className="h-4 w-4 mr-1" />
              <div className="text-2xl font-bold">{stats.historic}</div>
            </div>
            <div className="text-sm text-muted-foreground">Historic</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent-teal">{stats.featured}</div>
            <div className="text-sm text-muted-foreground">Featured</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Timeline className="h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="collections" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Collections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <EnhancedMediaUpload
            onUploadComplete={handleUploadComplete}
            onError={(error) => console.error('Upload error:', error)}
          />
        </TabsContent>

        <TabsContent value="gallery" className="mt-6">
          <EnhancedMediaGallery
            media={mockMedia}
            onMediaSelect={handleMediaSelect}
            onMediaEdit={handleMediaEdit}
            onMediaDelete={handleMediaDelete}
            enableTimeline={false}
          />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <EnhancedMediaGallery
            media={mockMedia}
            onMediaSelect={handleMediaSelect}
            onMediaEdit={handleMediaEdit}
            onMediaDelete={handleMediaDelete}
            enableTimeline={true}
          />
        </TabsContent>

        <TabsContent value="collections" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Media Collections</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Media collections functionality will be implemented here. This will allow grouping 
                related media items for events, press kits, model years, and historical significance.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
