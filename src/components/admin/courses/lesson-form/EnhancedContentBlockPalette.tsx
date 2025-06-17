
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  Type, 
  Video, 
  Image, 
  Table, 
  Download, 
  BookOpen, 
  Bike,
  Code,
  Volume2,
  MousePointer2,
  Zap,
  Clock,
  Star,
  Plus
} from 'lucide-react';
import { ContentBlockType } from '@/types/course';
import { getContentBlockTypes, getContentBlockTemplate } from '@/services/contentBlockService';
import { toast } from 'sonner';

interface EnhancedContentBlockPaletteProps {
  onBlockAdd: (type: string, defaultData?: any) => void;
  recentlyUsedBlocks?: string[];
  lessonType?: string;
}

const BLOCK_CATEGORIES = [
  { id: 'all', label: 'All Blocks', icon: Plus },
  { id: 'text', label: 'Text & Content', icon: Type },
  { id: 'media', label: 'Media', icon: Video },
  { id: 'interactive', label: 'Interactive', icon: MousePointer2 },
  { id: 'assessment', label: 'Assessment', icon: Zap },
  { id: 'advanced', label: 'Advanced', icon: Code },
];

const BLOCK_ICONS: Record<string, any> = {
  text: Type,
  rich_text: Type,
  video: Video,
  audio_player: Volume2,
  image_gallery: Image,
  interactive_image: MousePointer2,
  table: Table,
  download: Download,
  code_highlight: Code,
  interactive_quiz: Zap,
  glossary_links: BookOpen,
  related_models: Bike,
  conditional_content: Zap,
};

const BLOCK_CATEGORY_MAP: Record<string, string> = {
  text: 'text',
  rich_text: 'text',
  video: 'media',
  audio_player: 'media',
  image_gallery: 'media',
  interactive_image: 'interactive',
  table: 'text',
  download: 'text',
  code_highlight: 'advanced',
  interactive_quiz: 'assessment',
  glossary_links: 'advanced',
  related_models: 'advanced',
  conditional_content: 'advanced',
};

export default function EnhancedContentBlockPalette({ 
  onBlockAdd, 
  recentlyUsedBlocks = [],
  lessonType 
}: EnhancedContentBlockPaletteProps) {
  const [blockTypes, setBlockTypes] = useState<ContentBlockType[]>([]);
  const [filteredBlocks, setFilteredBlocks] = useState<ContentBlockType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    loadBlockTypes();
  }, []);

  useEffect(() => {
    filterBlocks();
  }, [blockTypes, searchQuery, selectedCategory]);

  const loadBlockTypes = async () => {
    try {
      setLoading(true);
      const types = await getContentBlockTypes();
      setBlockTypes(types);
    } catch (error) {
      console.error('Error loading block types:', error);
      toast.error('Failed to load content blocks');
    } finally {
      setLoading(false);
    }
  };

  const filterBlocks = () => {
    let filtered = blockTypes;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(block => 
        BLOCK_CATEGORY_MAP[block.name] === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(block =>
        block.name.toLowerCase().includes(query) ||
        block.description?.toLowerCase().includes(query)
      );
    }

    setFilteredBlocks(filtered);
  };

  const handleBlockAdd = (blockType: string) => {
    const defaultData = getContentBlockTemplate(blockType);
    onBlockAdd(blockType, defaultData);
    toast.success(`Added ${blockType} block`);
  };

  const getBlockIcon = (blockName: string) => {
    const IconComponent = BLOCK_ICONS[blockName] || Type;
    return IconComponent;
  };

  const getSuggestedBlocks = () => {
    if (!lessonType) return [];
    
    const suggestions: Record<string, string[]> = {
      tutorial: ['text', 'video', 'code_highlight', 'interactive_image'],
      assessment: ['interactive_quiz', 'conditional_content', 'text'],
      introduction: ['rich_text', 'video', 'image_gallery', 'glossary_links'],
      practice: ['interactive_image', 'audio_player', 'table', 'download'],
    };

    return suggestions[lessonType] || [];
  };

  const renderBlockCard = (blockType: ContentBlockType, isRecent = false, isSuggested = false) => {
    const IconComponent = getBlockIcon(blockType.name);
    
    return (
      <Card 
        key={blockType.id} 
        className="hover:shadow-md transition-all cursor-pointer group relative"
        onClick={() => handleBlockAdd(blockType.name)}
      >
        {(isRecent || isSuggested) && (
          <div className="absolute top-2 right-2 z-10">
            {isRecent && <Badge variant="secondary" className="text-xs">Recent</Badge>}
            {isSuggested && <Badge variant="default" className="text-xs bg-accent-teal text-black">Suggested</Badge>}
          </div>
        )}
        
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted group-hover:bg-accent-teal/10 transition-colors">
              <IconComponent className="h-5 w-5 text-muted-foreground group-hover:text-accent-teal" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-sm font-medium">
                {blockType.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <CardDescription className="text-xs leading-relaxed">
            {blockType.description || `Add a ${blockType.name} block to your lesson`}
          </CardDescription>
          
          <Button 
            size="sm" 
            className="w-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              handleBlockAdd(blockType.name);
            }}
          >
            Add Block
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search content blocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Recently Used Blocks */}
      {recentlyUsedBlocks.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Recently Used</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {recentlyUsedBlocks.slice(0, 4).map((blockName) => {
              const blockType = blockTypes.find(b => b.name === blockName);
              return blockType ? renderBlockCard(blockType, true) : null;
            })}
          </div>
        </div>
      )}

      {/* Suggested Blocks */}
      {lessonType && getSuggestedBlocks().length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-accent-teal" />
            <span className="text-sm font-medium">Suggested for {lessonType}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {getSuggestedBlocks().slice(0, 4).map((blockName) => {
              const blockType = blockTypes.find(b => b.name === blockName);
              return blockType ? renderBlockCard(blockType, false, true) : null;
            })}
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          {BLOCK_CATEGORIES.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
              <category.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{category.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-4">
          <ScrollArea className="h-[300px] pr-4">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-muted rounded-lg"></div>
                        <div className="h-4 bg-muted rounded w-20"></div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-8 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredBlocks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No content blocks found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {filteredBlocks.map((blockType) => renderBlockCard(blockType))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
