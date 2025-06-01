
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  MapPin, 
  Settings, 
  Plus,
  Star,
  TrendingUp
} from "lucide-react";

interface ConfigurationTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  fields: {
    seat_height_mm?: number;
    weight_kg?: number;
    market_region?: string;
    price_premium_usd?: number;
  };
  components: {
    engine_type?: string;
    brake_type?: string;
    suspension_type?: string;
  };
  popularity: number;
}

interface ConfigurationTemplatesProps {
  onTemplateSelect: (template: ConfigurationTemplate) => void;
  onCreateTemplate: () => void;
}

const TEMPLATES: ConfigurationTemplate[] = [
  {
    id: "sport",
    name: "Sport Configuration",
    category: "Performance",
    description: "High-performance setup with racing-oriented components",
    icon: <Zap className="h-4 w-4" />,
    fields: {
      seat_height_mm: 830,
      weight_kg: 180,
      market_region: "Global",
      price_premium_usd: 2000
    },
    components: {
      engine_type: "High-performance",
      brake_type: "Racing",
      suspension_type: "Adjustable"
    },
    popularity: 85
  },
  {
    id: "touring",
    name: "Touring Configuration",
    category: "Comfort",
    description: "Long-distance comfort with practical features",
    icon: <MapPin className="h-4 w-4" />,
    fields: {
      seat_height_mm: 790,
      weight_kg: 220,
      market_region: "North America",
      price_premium_usd: 1500
    },
    components: {
      engine_type: "Torque-focused",
      brake_type: "ABS",
      suspension_type: "Comfort"
    },
    popularity: 72
  },
  {
    id: "standard",
    name: "Standard Configuration",
    category: "Base",
    description: "Basic setup suitable for most riders",
    icon: <Settings className="h-4 w-4" />,
    fields: {
      seat_height_mm: 810,
      weight_kg: 200,
      market_region: "Global",
      price_premium_usd: 0
    },
    components: {
      engine_type: "Standard",
      brake_type: "Standard",
      suspension_type: "Standard"
    },
    popularity: 95
  }
];

const ConfigurationTemplates = ({
  onTemplateSelect,
  onCreateTemplate
}: ConfigurationTemplatesProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = Array.from(new Set(TEMPLATES.map(t => t.category)));
  const filteredTemplates = selectedCategory === "all" 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.category === selectedCategory);

  const getPopularityBadge = (popularity: number) => {
    if (popularity >= 90) return <Badge className="bg-green-500/20 text-green-400"><Star className="h-3 w-3 mr-1" />Popular</Badge>;
    if (popularity >= 70) return <Badge className="bg-blue-500/20 text-blue-400"><TrendingUp className="h-3 w-3 mr-1" />Trending</Badge>;
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-explorer-text">Configuration Templates</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onCreateTemplate}
          className="flex items-center gap-1"
        >
          <Plus className="h-3 w-3" />
          Create Template
        </Button>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList>
          <TabsTrigger value="all">All Templates</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(template => (
              <Card 
                key={template.id}
                className="cursor-pointer hover:border-accent-teal/50 transition-colors"
                onClick={() => onTemplateSelect(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {template.icon}
                      <CardTitle className="text-sm">{template.name}</CardTitle>
                    </div>
                    {getPopularityBadge(template.popularity)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {template.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-explorer-text">Key Features:</div>
                    <div className="flex flex-wrap gap-1">
                      {template.fields.seat_height_mm && (
                        <Badge variant="outline" className="text-xs">
                          {template.fields.seat_height_mm}mm seat
                        </Badge>
                      )}
                      {template.fields.weight_kg && (
                        <Badge variant="outline" className="text-xs">
                          {template.fields.weight_kg}kg
                        </Badge>
                      )}
                      {template.components.engine_type && (
                        <Badge variant="outline" className="text-xs">
                          {template.components.engine_type} engine
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfigurationTemplates;
