
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Download, Edit, Save, X, Copy, ExternalLink,
  Calendar, User, FileText, Image, Video, Music
} from 'lucide-react';
import { MediaLibraryItem, updateMediaItem } from '@/services/mediaLibraryService';
import { useToast } from '@/hooks/use-toast';

interface MediaPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MediaLibraryItem | null;
  onUpdate: () => void;
}

export default function MediaPreviewDialog({
  open,
  onOpenChange,
  item,
  onUpdate
}: MediaPreviewDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    alt_text: '',
    caption: '',
    tags: [] as string[]
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (item) {
      setEditData({
        alt_text: item.alt_text || '',
        caption: item.caption || '',
        tags: [...item.tags]
      });
    }
  }, [item]);

  const handleSave = async () => {
    if (!item) return;
    
    setSaving(true);
    try {
      await updateMediaItem(item.id, editData);
      setIsEditing(false);
      onUpdate();
      toast({
        title: "Media updated",
        description: "Media information has been updated successfully"
      });
    } catch (error) {
      console.error('Error updating media:', error);
      toast({
        variant: "destructive",
        title: "Error updating media",
        description: "Failed to update media information"
      });
    } finally {
      setSaving(false);
    }
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !editData.tags.includes(tag.trim())) {
      setEditData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const removeTag = (tag: string) => {
    setEditData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const copyUrl = () => {
    if (item) {
      navigator.clipboard.writeText(item.file_url);
      toast({
        title: "URL copied",
        description: "Media URL has been copied to clipboard"
      });
    }
  };

  const downloadFile = () => {
    if (item) {
      const link = document.createElement('a');
      link.href = item.file_url;
      link.download = item.file_name;
      link.click();
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image': return <Image className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'audio': return <Music className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {getFileIcon(item.file_type)}
              {item.file_name}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={copyUrl}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={downloadFile}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(item.file_url, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview */}
          <div className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
              {item.file_type === 'image' ? (
                <img 
                  src={item.file_url} 
                  alt={item.alt_text || item.file_name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : item.file_type === 'video' ? (
                <video 
                  src={item.file_url} 
                  controls 
                  className="max-w-full max-h-full"
                />
              ) : item.file_type === 'audio' ? (
                <div className="text-center">
                  <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <audio src={item.file_url} controls className="w-full" />
                </div>
              ) : (
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Document preview not available</p>
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Type:</span>
                <span className="ml-2 capitalize">{item.file_type}</span>
              </div>
              {item.file_size_bytes && (
                <div>
                  <span className="font-medium">Size:</span>
                  <span className="ml-2">{formatFileSize(item.file_size_bytes)}</span>
                </div>
              )}
              <div>
                <span className="font-medium">MIME:</span>
                <span className="ml-2">{item.mime_type}</span>
              </div>
              <div>
                <span className="font-medium">Created:</span>
                <span className="ml-2">{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-6">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="alt_text">Alt Text</Label>
                  <Input
                    id="alt_text"
                    value={editData.alt_text}
                    onChange={(e) => setEditData(prev => ({ ...prev, alt_text: e.target.value }))}
                    placeholder="Describe the content for accessibility"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caption">Caption</Label>
                  <Textarea
                    id="caption"
                    value={editData.caption}
                    onChange={(e) => setEditData(prev => ({ ...prev, caption: e.target.value }))}
                    placeholder="Add a caption or description"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editData.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add tags (press Enter)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <h4 className="font-medium mb-2">Alt Text</h4>
                  <p className="text-muted-foreground">
                    {item.alt_text || 'No alt text provided'}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Caption</h4>
                  <p className="text-muted-foreground">
                    {item.caption || 'No caption provided'}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.length > 0 ? (
                      item.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No tags assigned</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">File URL</h4>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={item.file_url} 
                      readOnly 
                      className="font-mono text-sm"
                    />
                    <Button size="sm" variant="outline" onClick={copyUrl}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
