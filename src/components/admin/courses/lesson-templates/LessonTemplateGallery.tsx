
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Clock, Users, Bookmark } from 'lucide-react';
import { getLessonTemplates, incrementTemplateUsage, LessonTemplate } from '@/services/lessonTemplateService';
import { ContentBlock } from '@/types/course';
import { toast } from 'sonner';

interface LessonTemplateGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplateApply: (template: LessonTemplate) => void;
}

const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'All Templates', icon: Bookmark },
  { id: 'tutorial', label: 'Tutorial', icon: Clock },
  { id: 'assessment', label: 'Assessment', icon: Users },
  { id: 'interactive', label: 'Interactive', icon: Users },
  { id: 'introduction', label: 'Introduction', icon: Clock },
];

export default function LessonTemplateGallery({ 
  open, 
  onOpenChange, 
  onTemplateApply 
}: LessonTemplateGalleryProps) {
  const [templates, setTemplates] = useState<LessonTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<LessonTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (open) {
      loadTemplates();
    }
  }, [open]);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchQuery, selectedCategory]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const templatesData = await getLessonTemplates();
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => 
        template.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.description?.toLowerCase().includes(query)
      );
    }

    setFilteredTemplates(filtered);
  };

  const handleTemplateApply = async (template: LessonTemplate) => {
    try {
      await incrementTemplateUsage(template.id);
      onTemplateApply(template);
      onOpenChange(false);
      toast.success(`Applied template: ${template.name}`);
    } catch (error) {
      console.error('Error applying template:', error);
      toast.error('Failed to apply template');
    }
  };

  const getBlockTypesPreview = (blocks: ContentBlock[]) => {
    const types = blocks.map(block => block.type);
    const uniqueTypes = Array.from(new Set(types));
    return uniqueTypes.slice(0, 3).join(', ') + (uniqueTypes.length > 3 ? '...' : '');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Lesson Template Gallery</DialogTitle>
          <DialogDescription>
            Choose from pre-built lesson templates to quickly create structured content.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-5">
              {TEMPLATE_CATEGORIES.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  <category.icon className="h-4 w-4" />
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array(4).fill(0).map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardHeader>
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </CardHeader>
                        <CardContent>
                          <div className="h-16 bg-muted rounded"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredTemplates.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No templates found matching your criteria.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTemplates.map((template) => (
                      <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{template.name}</CardTitle>
                              <CardDescription className="mt-1">
                                {template.description || 'No description available'}
                              </CardDescription>
                            </div>
                            {template.category && (
                              <Badge variant="outline" className="ml-2">
                                {template.category}
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="text-sm text-muted-foreground">
                            <div className="flex items-center justify-between">
                              <span>{template.template_blocks.length} blocks</span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {template.usage_count} uses
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            <strong>Contains:</strong> {getBlockTypesPreview(template.template_blocks)}
                          </div>

                          <Button 
                            onClick={() => handleTemplateApply(template)}
                            className="w-full"
                            size="sm"
                          >
                            Use This Template
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
