
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ContentBlock } from '@/types/course';
import { Monitor, Tablet, Smartphone, Eye, EyeOff } from 'lucide-react';
import { SecureContentRenderer } from '@/components/security/SecureContentRenderer';

interface AdvancedPreviewModesProps {
  contentBlocks: ContentBlock[];
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PREVIEW_MODES = [
  { id: 'desktop', label: 'Desktop', icon: Monitor, width: '100%', height: '600px' },
  { id: 'tablet', label: 'Tablet', icon: Tablet, width: '768px', height: '600px' },
  { id: 'mobile', label: 'Mobile', icon: Smartphone, width: '375px', height: '600px' },
];

export default function AdvancedPreviewModes({
  contentBlocks,
  title,
  open,
  onOpenChange
}: AdvancedPreviewModesProps) {
  const [activeMode, setActiveMode] = useState('desktop');
  const activePreview = PREVIEW_MODES.find(mode => mode.id === activeMode)!;

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50">
      <div className="container mx-auto h-full flex flex-col p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold">Preview: {title}</h2>
            <Badge variant="outline" className="flex items-center gap-2">
              <activePreview.icon className="h-4 w-4" />
              {activePreview.label}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Tabs value={activeMode} onValueChange={setActiveMode}>
              <TabsList>
                {PREVIEW_MODES.map((mode) => (
                  <TabsTrigger key={mode.id} value={mode.id} className="flex items-center gap-2">
                    <mode.icon className="h-4 w-4" />
                    {mode.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-2"
            >
              <EyeOff className="h-4 w-4" />
              Close Preview
            </Button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg">
          <div 
            className="bg-background rounded-lg shadow-lg overflow-hidden transition-all duration-300"
            style={{
              width: activePreview.width,
              height: activePreview.height,
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          >
            <div className="h-full overflow-y-auto">
              <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">{title}</h1>
                
                {contentBlocks
                  .sort((a, b) => a.order - b.order)
                  .map((block) => (
                    <PreviewBlock key={block.id} block={block} />
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Preview showing {contentBlocks.length} content blocks in {activePreview.label.toLowerCase()} view
        </div>
      </div>
    </div>
  );
}

function PreviewBlock({ block }: { block: ContentBlock }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        {block.title && (
          <CardTitle className="text-lg">{block.title}</CardTitle>
        )}
        <Badge variant="outline" className="w-fit text-xs">
          {block.type.replace(/_/g, ' ')}
        </Badge>
      </CardHeader>
      <CardContent>
        {block.type === 'text' && (
          <div className="prose prose-sm max-w-none">
            {block.data.format === 'markdown' ? (
              <SecureContentRenderer 
                content={block.data.content}
                type="markdown"
                className="text-content"
              />
            ) : (
              <SecureContentRenderer 
                content={block.data.content}
                type="html"
                className="text-content"
              />
            )}
          </div>
        )}
        
        {block.type === 'rich_text' && (
          <div className="prose prose-sm max-w-none">
            <SecureContentRenderer 
              content={block.data.content}
              type="html"
              className="rich-text-content"
            />
          </div>
        )}
        
        {block.type === 'video' && (
          <div className="space-y-2">
            {block.data.title && (
              <h4 className="font-medium">{block.data.title}</h4>
            )}
            {block.data.description && (
              <p className="text-sm text-muted-foreground">{block.data.description}</p>
            )}
            <div className="bg-muted p-8 rounded text-center text-muted-foreground">
              📺 Video: {block.data.url || 'No URL provided'}
            </div>
          </div>
        )}
        
        {!['text', 'rich_text', 'video'].includes(block.type) && (
          <div className="bg-muted p-4 rounded text-center text-muted-foreground">
            🔧 Preview for {block.type} blocks coming soon...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
