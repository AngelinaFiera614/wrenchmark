
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Image, Video, FileText, Calendar, Settings } from "lucide-react";
import EnhancedMediaUpload from "@/components/admin/media/EnhancedMediaUpload";
import EnhancedMediaGallery from "@/components/admin/media/EnhancedMediaGallery";
import { useEnhancedMedia } from "@/hooks/useEnhancedMedia";

interface MediaManagementTabProps {
  motorcycleId: string;
}

export function MediaManagementTab({ motorcycleId }: MediaManagementTabProps) {
  const [selectedTab, setSelectedTab] = useState('gallery');
  const { media, isLoading } = useEnhancedMedia(motorcycleId);

  const getMediaStats = () => {
    const stats = {
      total: media.length,
      images: media.filter(m => m.media_type === 'image').length,
      videos: media.filter(m => m.media_type === 'video').length,
      documents: media.filter(m => 
        ['document', 'brochure', 'manual'].includes(m.media_type || '')
      ).length,
      historic: media.filter(m => m.historical_significance).length,
      featured: media.filter(m => m.is_featured).length
    };
    return stats;
  };

  const stats = getMediaStats();

  const handleUploadComplete = () => {
    // Media will be automatically refreshed by the hook
    setSelectedTab('gallery');
  };

  return (
    <div className="space-y-6">
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
              <Calendar className="h-4 w-4 mr-1" />
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="mt-6">
          <EnhancedMediaGallery
            motorcycleId={motorcycleId}
            enableTimeline={false}
          />
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <EnhancedMediaUpload
            motorcycleId={motorcycleId}
            onUploadComplete={handleUploadComplete}
          />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <EnhancedMediaGallery
            motorcycleId={motorcycleId}
            enableTimeline={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
