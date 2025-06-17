
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ContentBlock, ContentBlockType } from '@/types/course';
import { getContentBlockTypes } from '@/services/contentBlockService';
import { Plus, GripVertical, Trash2, Eye, EyeOff, Palette } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import EnhancedContentBlockPalette from './lesson-form/EnhancedContentBlockPalette';
import BulkOperationsToolbar from './lesson-form/BulkOperationsToolbar';
import AdvancedPreviewModes from './lesson-form/AdvancedPreviewModes';
import { useBulkOperations } from './lesson-form/useBulkOperations';

interface ContentBlockEditorProps {
  contentBlocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  lessonType?: string;
}

export default function ContentBlockEditor({ contentBlocks, onChange, lessonType }: ContentBlockEditorProps) {
  const [blockTypes, setBlockTypes] = useState<ContentBlockType[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [showAdvancedPreview, setShowAdvancedPreview] = useState(false);
  const [recentlyUsedBlocks, setRecentlyUsedBlocks] = useState<string[]>([]);

  const {
    selectedBlocks,
    hasClipboard,
    selectBlock,
    selectAll,
    clearSelection,
    copyBlocks,
    pasteBlocks,
    deleteBlocks,
    duplicateBlocks,
    moveBlocks
  } = useBulkOperations(contentBlocks, onChange);

  useEffect(() => {
    loadBlockTypes();
    loadRecentlyUsedBlocks();
  }, []);

  const loadBlockTypes = async () => {
    try {
      const types = await getContentBlockTypes();
      setBlockTypes(types);
    } catch (error) {
      console.error('Error loading block types:', error);
    }
  };

  const loadRecentlyUsedBlocks = () => {
    const stored = localStorage.getItem('wrenchmark_recent_blocks');
    if (stored) {
      setRecentlyUsedBlocks(JSON.parse(stored));
    }
  };

  const saveRecentlyUsedBlock = (blockType: string) => {
    const updated = [blockType, ...recentlyUsedBlocks.filter(b => b !== blockType)].slice(0, 10);
    setRecentlyUsedBlocks(updated);
    localStorage.setItem('wrenchmark_recent_blocks', JSON.stringify(updated));
  };

  const addBlock = (type: string, defaultData?: any) => {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type,
      order: contentBlocks.length,
      data: defaultData || getDefaultDataForType(type),
      title: `New ${type.replace(/_/g, ' ')} block`
    };
    onChange([...contentBlocks, newBlock]);
    saveRecentlyUsedBlock(type);
    setShowPalette(false);
  };

  const getDefaultDataForType = (type: string): Record<string, any> => {
    switch (type) {
      case 'text':
        return { content: '', format: 'markdown' };
      case 'rich_text':
        return { content: '<p>Enter your rich text content here...</p>', title: '', format: 'html' };
      case 'video':
        return { url: '', title: '', description: '' };
      case 'audio_player':
        return { audio_url: '', title: '', description: '', auto_play: false, show_controls: true };
      case 'image_gallery':
        return { images: [] };
      case 'interactive_image':
        return { image_url: '', alt_text: '', hotspots: [] };
      case 'table':
        return { headers: [], rows: [], caption: '' };
      case 'download':
        return { file_url: '', title: '', description: '', file_type: '' };
      case 'code_highlight':
        return { code: 'console.log("Hello, World!");', language: 'javascript', title: '', line_numbers: true };
      case 'interactive_quiz':
        return { 
          questions: [
            {
              id: '1',
              type: 'multiple_choice',
              question: 'What is the correct answer?',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correct_answer: 'Option A',
              explanation: 'This is why Option A is correct.',
              points: 1
            }
          ],
          passing_score: 70,
          allow_retries: true,
          show_results: true
        };
      case 'conditional_content':
        return { 
          content: '<p>This content will show when conditions are met.</p>',
          conditions: [{ type: 'skill_level', operator: '>=', value: '5' }],
          fallback_content: '<p>Complete more lessons to unlock this content.</p>'
        };
      case 'glossary_links':
        return { terms: [], auto_detect: true };
      case 'related_models':
        return { model_ids: [], comparison_type: 'basic' };
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

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedPreview(true)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Advanced Preview
          </Button>
          
          <Dialog open={showPalette} onOpenChange={setShowPalette}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Block
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Content Block Palette
                </DialogTitle>
              </DialogHeader>
              <EnhancedContentBlockPalette 
                onBlockAdd={addBlock}
                recentlyUsedBlocks={recentlyUsedBlocks}
                lessonType={lessonType}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <BulkOperationsToolbar
        selectedBlocks={selectedBlocks}
        contentBlocks={contentBlocks}
        onCopyBlocks={copyBlocks}
        onDeleteBlocks={deleteBlocks}
        onDuplicateBlocks={duplicateBlocks}
        onMoveBlocks={moveBlocks}
        onSelectAll={selectAll}
        onClearSelection={clearSelection}
        hasClipboard={hasClipboard}
        onPasteBlocks={pasteBlocks}
      />

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
                            isSelected={selectedBlocks.includes(block.id)}
                            onSelect={() => selectBlock(block.id)}
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

      <AdvancedPreviewModes
        contentBlocks={contentBlocks}
        title="Lesson Preview"
        open={showAdvancedPreview}
        onOpenChange={setShowAdvancedPreview}
      />
    </div>
  );
}

interface ContentBlockEditFormProps {
  block: ContentBlock;
  blockTypes: ContentBlockType[];
  onUpdate: (updates: Partial<ContentBlock>) => void;
  onDelete: () => void;
  dragHandleProps?: any;
  isSelected: boolean;
  onSelect: () => void;
}

function ContentBlockEditForm({ 
  block, 
  blockTypes, 
  onUpdate, 
  onDelete, 
  dragHandleProps, 
  isSelected, 
  onSelect 
}: ContentBlockEditFormProps) {
  const blockType = blockTypes.find(t => t.name === block.type);

  return (
    <Card className={isSelected ? 'ring-2 ring-accent-teal' : ''}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
          />
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

function getDefaultDataForType(type: string): Record<string, any> {
  switch (type) {
    case 'text':
      return { content: '', format: 'markdown' };
    case 'rich_text':
      return { content: '<p>Enter your rich text content here...</p>', title: '', format: 'html' };
    case 'video':
      return { url: '', title: '', description: '' };
    case 'audio_player':
      return { audio_url: '', title: '', description: '', auto_play: false, show_controls: true };
    case 'image_gallery':
      return { images: [] };
    case 'interactive_image':
      return { image_url: '', alt_text: '', hotspots: [] };
    case 'table':
      return { headers: [], rows: [], caption: '' };
    case 'download':
      return { file_url: '', title: '', description: '', file_type: '' };
    case 'code_highlight':
      return { code: 'console.log("Hello, World!");', language: 'javascript', title: '', line_numbers: true };
    case 'interactive_quiz':
      return { 
        questions: [
          {
            id: '1',
            type: 'multiple_choice',
            question: 'What is the correct answer?',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correct_answer: 'Option A',
            explanation: 'This is why Option A is correct.',
            points: 1
          }
        ],
        passing_score: 70,
        allow_retries: true,
        show_results: true
      };
    case 'conditional_content':
      return { 
        content: '<p>This content will show when conditions are met.</p>',
        conditions: [{ type: 'skill_level', operator: '>=', value: '5' }],
        fallback_content: '<p>Complete more lessons to unlock this content.</p>'
      };
    case 'glossary_links':
      return { terms: [], auto_detect: true };
    case 'related_models':
      return { model_ids: [], comparison_type: 'basic' };
    default:
      return {};
  }
}
