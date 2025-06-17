
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MediaLibraryItem } from '@/services/mediaLibraryService';
import MediaLibraryBrowser from './MediaLibraryBrowser';
import { Link, Upload } from 'lucide-react';

interface MediaInsertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (mediaData: MediaInsertData) => void;
  allowedTypes?: string[];
}

export interface MediaInsertData {
  type: 'library' | 'url';
  item?: MediaLibraryItem;
  url?: string;
  alt_text?: string;
  caption?: string;
  display_options?: {
    size?: 'small' | 'medium' | 'large' | 'full';
    alignment?: 'left' | 'center' | 'right';
    show_caption?: boolean;
  };
}

export default function MediaInsertDialog({
  open,
  onOpenChange,
  onInsert,
  allowedTypes
}: MediaInsertDialogProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'url'>('library');
  const [selectedItem, setSelectedItem] = useState<MediaLibraryItem | null>(null);
  const [urlData, setUrlData] = useState({
    url: '',
    alt_text: '',
    caption: ''
  });
  const [displayOptions, setDisplayOptions] = useState({
    size: 'medium' as const,
    alignment: 'center' as const,
    show_caption: true
  });

  const handleInsert = () => {
    if (activeTab === 'library' && selectedItem) {
      onInsert({
        type: 'library',
        item: selectedItem,
        display_options: displayOptions
      });
    } else if (activeTab === 'url' && urlData.url) {
      onInsert({
        type: 'url',
        url: urlData.url,
        alt_text: urlData.alt_text,
        caption: urlData.caption,
        display_options: displayOptions
      });
    }
    
    // Reset form
    setSelectedItem(null);
    setUrlData({ url: '', alt_text: '', caption: '' });
    onOpenChange(false);
  };

  const canInsert = (activeTab === 'library' && selectedItem) || 
                   (activeTab === 'url' && urlData.url);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Insert Media</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'library' | 'url')} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Media Library
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              From URL
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 flex flex-col overflow-hidden">
            <TabsContent value="library" className="flex-1 flex flex-col mt-4">
              <div className="flex-1 overflow-hidden">
                <MediaLibraryBrowser
                  onSelectMedia={setSelectedItem}
                  fileTypeFilter={allowedTypes}
                  showUpload={true}
                />
              </div>
            </TabsContent>

            <TabsContent value="url" className="flex-1 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="media-url">Media URL</Label>
                  <Input
                    id="media-url"
                    placeholder="https://example.com/image.jpg"
                    value={urlData.url}
                    onChange={(e) => setUrlData(prev => ({ ...prev, url: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url-alt-text">Alt Text</Label>
                  <Input
                    id="url-alt-text"
                    placeholder="Describe the media for accessibility"
                    value={urlData.alt_text}
                    onChange={(e) => setUrlData(prev => ({ ...prev, alt_text: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url-caption">Caption</Label>
                  <Input
                    id="url-caption"
                    placeholder="Optional caption"
                    value={urlData.caption}
                    onChange={(e) => setUrlData(prev => ({ ...prev, caption: e.target.value }))}
                  />
                </div>

                {urlData.url && (
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <h4 className="font-medium mb-2">Preview</h4>
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
                      {urlData.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        <img 
                          src={urlData.url} 
                          alt={urlData.alt_text}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <Link className="h-8 w-8 mx-auto mb-2" />
                          <p>Media preview</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>

          {/* Display Options */}
          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium mb-3">Display Options</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Size</Label>
                <Select value={displayOptions.size} onValueChange={(value: any) => 
                  setDisplayOptions(prev => ({ ...prev, size: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="full">Full Width</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Alignment</Label>
                <Select value={displayOptions.alignment} onValueChange={(value: any) => 
                  setDisplayOptions(prev => ({ ...prev, alignment: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleInsert}
              disabled={!canInsert}
            >
              Insert Media
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
