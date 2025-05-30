
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Image, Video, FileText, Calendar, Settings, Database } from "lucide-react";
import EnhancedMediaUpload from "@/components/admin/media/EnhancedMediaUpload";
import EnhancedMediaGallery from "@/components/admin/media/EnhancedMediaGallery";
import { useEnhancedMedia } from "@/hooks/useEnhancedMedia";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function AdminEnhancedMedia() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const { initializeStorage } = useEnhancedMedia();

  // Fetch all media across all motorcycles for admin overview
  const { data: allMedia = [], isLoading } = useQuery({
    queryKey: ['admin-all-media'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('motorcycle_images')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const getMediaStats = () => {
    const stats = {
      total: allMedia.length,
      images: allMedia.filter(m => m.media_type === 'image').length,
      videos: allMedia.filter(m => m.media_type === 'video').length,
      documents: allMedia.filter(m => 
        ['document', 'brochure', 'manual'].includes(m.media_type || '')
      ).length,
      historic: allMedia.filter(m => m.historical_significance).length,
      featured: allMedia.filter(m => m.is_featured).length
    };
    return stats;
  };

  const stats = getMediaStats();

  const handleInitializeStorage = async () => {
    await initializeStorage();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Enhanced Media Management</h1>
          <p className="text-muted-foreground">
            Comprehensive media handling with historical tracking and advanced organization
          </p>
        </div>
        <Button onClick={handleInitializeStorage} variant="outline">
          <Database className="h-4 w-4 mr-2" />
          Initialize Storage
        </Button>
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            All Media
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="management" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Media System Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Storage Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Images Bucket:</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Videos Bucket:</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Documents Bucket:</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Recent Activity</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>Enhanced media system initialized</div>
                    <div>Storage buckets configured</div>
                    <div>Media management ready</div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Quick Actions</h4>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedTab('gallery')}
                  >
                    View All Media
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleInitializeStorage}
                  >
                    Reinitialize Storage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="mt-6">
          <EnhancedMediaGallery
            media={allMedia}
            enableTimeline={false}
          />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <EnhancedMediaGallery
            media={allMedia}
            enableTimeline={true}
          />
        </TabsContent>

        <TabsContent value="management" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Media Management Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Bulk Operations</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Advanced media management tools for bulk operations and maintenance.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" disabled>
                      Bulk Tag Update
                    </Button>
                    <Button variant="outline" disabled>
                      Archive Old Media
                    </Button>
                    <Button variant="outline" disabled>
                      Generate Thumbnails
                    </Button>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Analytics</h4>
                  <p className="text-sm text-muted-foreground">
                    Media analytics and reporting features will be available here.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
