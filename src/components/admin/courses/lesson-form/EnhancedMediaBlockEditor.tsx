
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ContentBlock } from '@/types/course';
import { Image, Video, Music, Plus, Trash2, Edit } from 'lucide-react';
import MediaInsertDialog, { MediaInsertData } from '../../media/MediaInsertDialog';

interface EnhancedMediaBlockEditorProps {
  block: ContentBlock;
  onUpdate: (updates: Partial<ContentBlock>) => void;
}

export default function EnhancedMediaBlockEditor({ block, onUpdate }: EnhancedMediaBlockEditorProps) {
  const [showMediaDialog, setShowMediaDialog] = useState(false);

  const handleMediaInsert = (mediaData: MediaInsertData) => {
    if (block.type === 'image_gallery') {
      const newImage = {
        id: crypto.randomUUID(),
        url: mediaData.item?.file_url || mediaData.url,
        alt_text: mediaData.alt_text || mediaData.item?.alt_text || '',
        caption: mediaData.caption || mediaData.item?.caption || '',
        display_options: mediaData.display_options
      };

      const currentImages = block.data.images || [];
      onUpdate({
        data: {
          ...block.data,
          images: [...currentImages, newImage]
        }
      });
    } else if (block.type === 'video') {
      onUpdate({
        data: {
          ...block.data,
          url: mediaData.item?.file_url || mediaData.url,
          title: mediaData.item?.file_name || block.data.title,
          description: mediaData.caption || block.data.description
        }
      });
    } else if (block.type === 'audio_player') {
      onUpdate({
        data: {
          ...block.data,
          audio_url: mediaData.item?.file_url || mediaData.url,
          title: mediaData.item?.file_name || block.data.title,
          description: mediaData.caption || block.data.description
        }
      });
    }

    setShowMediaDialog(false);
  };

  const removeImage = (imageId: string) => {
    const updatedImages = block.data.images.filter((img: any) => img.id !== imageId);
    onUpdate({
      data: {
        ...block.data,
        images: updatedImages
      }
    });
  };

  const updateImage = (imageId: string, updates: any) => {
    const updatedImages = block.data.images.map((img: any) => 
      img.id === imageId ? { ...img, ...updates } : img
    );
    onUpdate({
      data: {
        ...block.data,
        images: updatedImages
      }
    });
  };

  const getAllowedTypes = () => {
    switch (block.type) {
      case 'image_gallery':
      case 'interactive_image':
        return ['image'];
      case 'video':
        return ['video'];
      case 'audio_player':
        return ['audio'];
      default:
        return undefined;
    }
  };

  return (
    <div className="space-y-4">
      {block.type === 'image_gallery' && (
        <ImageGalleryEditor 
          block={block}
          onUpdate={onUpdate}
          onAddImage={() => setShowMediaDialog(true)}
          onRemoveImage={removeImage}
          onUpdateImage={updateImage}
        />
      )}

      {block.type === 'video' && (
        <VideoBlockEditor 
          block={block}
          onUpdate={onUpdate}
          onSelectVideo={() => setShowMediaDialog(true)}
        />
      )}

      {block.type === 'audio_player' && (
        <AudioBlockEditor 
          block={block}
          onUpdate={onUpdate}
          onSelectAudio={() => setShowMediaDialog(true)}
        />
      )}

      {block.type === 'interactive_image' && (
        <InteractiveImageEditor 
          block={block}
          onUpdate={onUpdate}
          onSelectImage={() => setShowMediaDialog(true)}
        />
      )}

      <MediaInsertDialog
        open={showMediaDialog}
        onOpenChange={setShowMediaDialog}
        onInsert={handleMediaInsert}
        allowedTypes={getAllowedTypes()}
      />
    </div>
  );
}

function ImageGalleryEditor({ 
  block, 
  onUpdate, 
  onAddImage, 
  onRemoveImage, 
  onUpdateImage 
}: {
  block: ContentBlock;
  onUpdate: (updates: Partial<ContentBlock>) => void;
  onAddImage: () => void;
  onRemoveImage: (id: string) => void;
  onUpdateImage: (id: string, updates: any) => void;
}) {
  const images = block.data.images || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Image Gallery ({images.length} images)</Label>
        <Button size="sm" onClick={onAddImage}>
          <Plus className="h-4 w-4 mr-2" />
          Add Image
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gallery-layout">Layout</Label>
        <Select 
          value={block.data.layout || 'grid'} 
          onValueChange={(layout) => onUpdate({ data: { ...block.data, layout } })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grid">Grid</SelectItem>
            <SelectItem value="carousel">Carousel</SelectItem>
            <SelectItem value="masonry">Masonry</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image: any) => (
          <Card key={image.id} className="overflow-hidden">
            <div className="aspect-video bg-muted relative">
              <img 
                src={image.url} 
                alt={image.alt_text}
                className="w-full h-full object-cover"
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2 h-6 w-6 p-0"
                onClick={() => onRemoveImage(image.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <CardContent className="p-3 space-y-2">
              <Input
                placeholder="Alt text"
                value={image.alt_text || ''}
                onChange={(e) => onUpdateImage(image.id, { alt_text: e.target.value })}
                className="text-xs"
              />
              <Input
                placeholder="Caption"
                value={image.caption || ''}
                onChange={(e) => onUpdateImage(image.id, { caption: e.target.value })}
                className="text-xs"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function VideoBlockEditor({ 
  block, 
  onUpdate, 
  onSelectVideo 
}: {
  block: ContentBlock;
  onUpdate: (updates: Partial<ContentBlock>) => void;
  onSelectVideo: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Video Source</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Video URL"
            value={block.data.url || ''}
            onChange={(e) => onUpdate({ data: { ...block.data, url: e.target.value } })}
          />
          <Button variant="outline" onClick={onSelectVideo}>
            <Video className="h-4 w-4 mr-2" />
            Browse
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="video-title">Title</Label>
          <Input
            id="video-title"
            value={block.data.title || ''}
            onChange={(e) => onUpdate({ data: { ...block.data, title: e.target.value } })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="video-autoplay">Auto Play</Label>
          <Switch
            checked={block.data.auto_play || false}
            onCheckedChange={(auto_play) => onUpdate({ data: { ...block.data, auto_play } })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="video-description">Description</Label>
        <Textarea
          id="video-description"
          value={block.data.description || ''}
          onChange={(e) => onUpdate({ data: { ...block.data, description: e.target.value } })}
        />
      </div>

      {block.data.url && (
        <div className="border rounded-lg p-4 bg-muted/20">
          <h4 className="font-medium mb-2">Preview</h4>
          <video 
            src={block.data.url} 
            controls 
            className="w-full max-h-64 rounded"
          />
        </div>
      )}
    </div>
  );
}

function AudioBlockEditor({ 
  block, 
  onUpdate, 
  onSelectAudio 
}: {
  block: ContentBlock;
  onUpdate: (updates: Partial<ContentBlock>) => void;
  onSelectAudio: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Audio Source</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Audio URL"
            value={block.data.audio_url || ''}
            onChange={(e) => onUpdate({ data: { ...block.data, audio_url: e.target.value } })}
          />
          <Button variant="outline" onClick={onSelectAudio}>
            <Music className="h-4 w-4 mr-2" />
            Browse
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="audio-title">Title</Label>
          <Input
            id="audio-title"
            value={block.data.title || ''}
            onChange={(e) => onUpdate({ data: { ...block.data, title: e.target.value } })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="audio-autoplay">Auto Play</Label>
          <Switch
            checked={block.data.auto_play || false}
            onCheckedChange={(auto_play) => onUpdate({ data: { ...block.data, auto_play } })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="audio-description">Description</Label>
        <Textarea
          id="audio-description"
          value={block.data.description || ''}
          onChange={(e) => onUpdate({ data: { ...block.data, description: e.target.value } })}
        />
      </div>

      {block.data.audio_url && (
        <div className="border rounded-lg p-4 bg-muted/20">
          <h4 className="font-medium mb-2">Preview</h4>
          <audio src={block.data.audio_url} controls className="w-full" />
        </div>
      )}
    </div>
  );
}

function InteractiveImageEditor({ 
  block, 
  onUpdate, 
  onSelectImage 
}: {
  block: ContentBlock;
  onUpdate: (updates: Partial<ContentBlock>) => void;
  onSelectImage: () => void;
}) {
  const addHotspot = () => {
    const newHotspot = {
      id: crypto.randomUUID(),
      x: 50,
      y: 50,
      title: 'New Hotspot',
      content: 'Hotspot content'
    };

    onUpdate({
      data: {
        ...block.data,
        hotspots: [...(block.data.hotspots || []), newHotspot]
      }
    });
  };

  const removeHotspot = (hotspotId: string) => {
    onUpdate({
      data: {
        ...block.data,
        hotspots: block.data.hotspots.filter((h: any) => h.id !== hotspotId)
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Background Image</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Image URL"
            value={block.data.image_url || ''}
            onChange={(e) => onUpdate({ data: { ...block.data, image_url: e.target.value } })}
          />
          <Button variant="outline" onClick={onSelectImage}>
            <Image className="h-4 w-4 mr-2" />
            Browse
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image-alt">Alt Text</Label>
        <Input
          id="image-alt"
          value={block.data.alt_text || ''}
          onChange={(e) => onUpdate({ data: { ...block.data, alt_text: e.target.value } })}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Hotspots ({(block.data.hotspots || []).length})</Label>
          <Button size="sm" onClick={addHotspot}>
            <Plus className="h-4 w-4 mr-2" />
            Add Hotspot
          </Button>
        </div>

        <div className="space-y-2">
          {(block.data.hotspots || []).map((hotspot: any, index: number) => (
            <Card key={hotspot.id}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">Hotspot {index + 1}</Badge>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => removeHotspot(hotspot.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="X Position (%)"
                    type="number"
                    value={hotspot.x}
                    onChange={(e) => {
                      const updatedHotspots = block.data.hotspots.map((h: any) =>
                        h.id === hotspot.id ? { ...h, x: Number(e.target.value) } : h
                      );
                      onUpdate({ data: { ...block.data, hotspots: updatedHotspots } });
                    }}
                  />
                  <Input
                    placeholder="Y Position (%)"
                    type="number"
                    value={hotspot.y}
                    onChange={(e) => {
                      const updatedHotspots = block.data.hotspots.map((h: any) =>
                        h.id === hotspot.id ? { ...h, y: Number(e.target.value) } : h
                      );
                      onUpdate({ data: { ...block.data, hotspots: updatedHotspots } });
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {block.data.image_url && (
        <div className="border rounded-lg p-4 bg-muted/20">
          <h4 className="font-medium mb-2">Preview</h4>
          <div className="relative aspect-video bg-muted rounded overflow-hidden">
            <img 
              src={block.data.image_url} 
              alt={block.data.alt_text}
              className="w-full h-full object-cover"
            />
            {(block.data.hotspots || []).map((hotspot: any) => (
              <div
                key={hotspot.id}
                className="absolute w-4 h-4 bg-accent-teal rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`
                }}
                title={hotspot.title}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
