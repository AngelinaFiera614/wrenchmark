
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, Plus, Palette, Edit, Trash2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ColorOptionDialog from "./ColorOptionDialog";

interface ColorOption {
  id: string;
  name: string;
  hex_code: string;
  image_url: string;
  is_limited: boolean;
  model_year_id: string;
  created_at: string;
  updated_at: string;
  model_years?: {
    year: number;
    motorcycle_models?: {
      name: string;
      brands?: {
        name: string;
      };
    };
  };
}

const ColorOptionsManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingColor, setEditingColor] = useState<ColorOption | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: colorOptions, refetch } = useQuery({
    queryKey: ['color-options'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('color_options')
        .select(`
          *,
          model_years (
            year,
            motorcycle_models (
              name,
              brands (
                name
              )
            )
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ColorOption[];
    }
  });

  const filteredColors = colorOptions?.filter(color => 
    color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    color.model_years?.motorcycle_models?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    color.model_years?.motorcycle_models?.brands?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (color: ColorOption) => {
    if (!confirm(`Are you sure you want to delete the color "${color.name}"?`)) return;

    try {
      const { error } = await supabase
        .from('color_options')
        .delete()
        .eq('id', color.id);

      if (error) throw error;

      toast({
        title: "Color deleted",
        description: `${color.name} has been deleted successfully.`,
      });

      refetch();
    } catch (error) {
      console.error('Error deleting color:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete color option.",
      });
    }
  };

  const handleCloseDialog = (refresh?: boolean) => {
    setDialogOpen(false);
    setEditingColor(null);
    if (refresh) refetch();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Color Options
            </div>
            <Button 
              onClick={() => setDialogOpen(true)}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Color
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-explorer-text-muted" />
            <Input
              placeholder="Search color options..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-explorer-dark border-explorer-chrome/30"
            />
          </div>

          {/* Colors List */}
          <div className="space-y-3">
            {filteredColors?.map((color) => (
              <Card key={color.id} className="bg-explorer-dark border-explorer-chrome/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Color Preview */}
                      <div 
                        className="w-12 h-12 rounded-lg border-2 border-explorer-chrome/30 flex-shrink-0"
                        style={{ backgroundColor: color.hex_code || '#cccccc' }}
                        title={color.hex_code || 'No color set'}
                      />
                      
                      {/* Color Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-explorer-text">
                            {color.name}
                          </span>
                          {color.is_limited && (
                            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                              <Star className="h-3 w-3 mr-1" />
                              Limited
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-sm text-explorer-text-muted">
                          {color.model_years?.motorcycle_models?.brands?.name} {' '}
                          {color.model_years?.motorcycle_models?.name} ({color.model_years?.year})
                        </div>
                        
                        {color.hex_code && (
                          <div className="text-xs text-explorer-text-muted mt-1">
                            {color.hex_code}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingColor(color);
                          setDialogOpen(true);
                        }}
                        className="border-explorer-chrome/30"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(color)}
                        className="border-red-400/30 text-red-400 hover:bg-red-400/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Color Image Preview */}
                  {color.image_url && (
                    <div className="mt-3">
                      <img
                        src={color.image_url}
                        alt={`${color.name} color option`}
                        className="w-full h-32 object-cover rounded border border-explorer-chrome/30"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {(!filteredColors || filteredColors.length === 0) && (
            <div className="text-center py-12 text-explorer-text-muted">
              {searchTerm 
                ? "No color options match your search criteria."
                : "No color options found. Add some to get started."
              }
            </div>
          )}
        </CardContent>
      </Card>

      <ColorOptionDialog
        open={dialogOpen}
        color={editingColor}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default ColorOptionsManager;
