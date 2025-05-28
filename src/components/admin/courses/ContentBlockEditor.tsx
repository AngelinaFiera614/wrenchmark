
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ContentBlock, ContentBlockType } from '@/types/course';
import { getContentBlockTypes } from '@/services/contentBlockService';
import { Plus, GripVertical, Trash2, Eye, EyeOff } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface ContentBlockEditorProps {
  contentBlocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

export default function ContentBlockEditor({ contentBlocks, onChange }: ContentBlockEditorProps) {
  const [blockTypes, setBlockTypes] = useState<ContentBlockType[]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadBlockTypes();
  }, []);

  const loadBlockTypes = async () => {
    try {
      const types = await getContentBlockTypes();
      setBlockTypes(types);
    } catch (error) {
      console.error('Error loading block types:', error);
    }
  };

  const addBlock = (type: string) => {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type,
      order: contentBlocks.length,
      data: getDefaultDataForType(type),
      title: `New ${type} block`
    };
    onChange([...contentBlocks, newBlock]);
  };

  const getDefaultDataForType = (type: string): Record<string, any> => {
    switch (type) {
      case 'text':
        return { content: '', format: 'markdown' };
      case 'video':
        return { url: '', title: '', description: '' };
      case 'image_gallery':
        return { images: [] };
      case 'table':
        return { headers: [], rows: [], caption: '' };
      case 'downloadable':
        return { file_url: '', title: '', description: '', file_type: '' };
      case 'glossary_highlight':
        return { terms: [], auto_detect: true };
      case 'motorcycle_reference':
        return { model_ids: [], comparison_type: 'basic' };
      case 'quiz':
        return { questions: [], passing_score: 70 };
      default:
        return {};
    }
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    const updatedBlocks = contentBlocks.map(block =>
      block.id === id ? { ...block, ...updates } : block
    );
    onChange(updatedBlocks);
  };

  const deleteBlock = (id: string) => {
    const updatedBlocks = contentBlocks.filter(block => block.id !== id);
    onChange(updatedBlocks);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(contentBlocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const reorderedBlocks = items.map((block, index) => ({
      ...block,
      order: index
    }));

    onChange(reorderedBlocks);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Content Blocks</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          
          <Select onValueChange={addBlock}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Add content block" />
            </SelectTrigger>
            <SelectContent>
              {blockTypes.map((type) => (
                <SelectItem key={type.id} value={type.name}>
                  <div className="flex items-center gap-2">
                    <span>{type.name}</span>
                    <Badge variant="outline">{type.description}</Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {previewMode ? (
        <div className="space-y-4">
          {contentBlocks
            .sort((a, b) => a.order - b.order)
            .map((block) => (
              <ContentBlockPreview key={block.id} block={block} />
            ))}
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="content-blocks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {contentBlocks
                  .sort((a, b) => a.order - b.order)
                  .map((block, index) => (
                    <Draggable key={block.id} draggableId={block.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="bg-card border rounded-lg"
                        >
                          <ContentBlockEditForm
                            block={block}
                            blockTypes={blockTypes}
                            onUpdate={(updates) => updateBlock(block.id, updates)}
                            onDelete={() => deleteBlock(block.id)}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}

interface ContentBlockEditFormProps {
  block: ContentBlock;
  blockTypes: ContentBlockType[];
  onUpdate: (updates: Partial<ContentBlock>) => void;
  onDelete: () => void;
  dragHandleProps?: any;
}

function ContentBlockEditForm({ block, blockTypes, onUpdate, onDelete, dragHandleProps }: ContentBlockEditFormProps) {
  const blockType = blockTypes.find(t => t.name === block.type);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <div {...dragHandleProps}>
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          </div>
          <CardTitle className="text-sm">
            {blockType?.description || block.type}
          </CardTitle>
          <Badge variant="outline">{block.type}</Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Block title (optional)"
          value={block.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
        />
        
        {block.type === 'text' && (
          <div className="space-y-2">
            <Select
              value={block.data.format || 'markdown'}
              onValueChange={(format) => onUpdate({ data: { ...block.data, format } })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="markdown">Markdown</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Enter your content..."
              value={block.data.content || ''}
              onChange={(e) => onUpdate({ data: { ...block.data, content: e.target.value } })}
              className="min-h-[150px]"
            />
          </div>
        )}

        {block.type === 'video' && (
          <div className="space-y-2">
            <Input
              placeholder="Video URL"
              value={block.data.url || ''}
              onChange={(e) => onUpdate({ data: { ...block.data, url: e.target.value } })}
            />
            <Input
              placeholder="Video title"
              value={block.data.title || ''}
              onChange={(e) => onUpdate({ data: { ...block.data, title: e.target.value } })}
            />
            <Textarea
              placeholder="Video description"
              value={block.data.description || ''}
              onChange={(e) => onUpdate({ data: { ...block.data, description: e.target.value } })}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ContentBlockPreview({ block }: { block: ContentBlock }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{block.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {block.type === 'text' && (
          <div className="prose prose-sm max-w-none">
            {block.data.format === 'markdown' ? (
              <div>{block.data.content}</div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: block.data.content }} />
            )}
          </div>
        )}
        
        {block.type === 'video' && (
          <div className="space-y-2">
            <h4 className="font-medium">{block.data.title}</h4>
            <p className="text-sm text-muted-foreground">{block.data.description}</p>
            <div className="bg-muted p-4 rounded">
              Video: {block.data.url}
            </div>
          </div>
        )}
        
        {!['text', 'video'].includes(block.type) && (
          <div className="text-sm text-muted-foreground">
            Preview for {block.type} blocks coming soon...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
