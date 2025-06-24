
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Globe, 
  GitBranch, 
  Plus, 
  Search,
  Filter,
  Clock,
  MapPin
} from "lucide-react";

interface ComponentVariant {
  id: string;
  componentId: string;
  componentType: string;
  variantType: 'year_specific' | 'regional' | 'evolution';
  effectiveFromYear?: number;
  effectiveToYear?: number;
  region?: string;
  version: string;
  changes: string[];
  notes?: string;
  isActive: boolean;
}

interface ComponentVariantsManagerProps {
  componentId?: string;
  componentType?: string;
  onVariantCreate?: (variant: ComponentVariant) => void;
  onVariantUpdate?: (variant: ComponentVariant) => void;
}

const ComponentVariantsManager: React.FC<ComponentVariantsManagerProps> = ({
  componentId,
  componentType,
  onVariantCreate,
  onVariantUpdate
}) => {
  const [activeTab, setActiveTab] = useState("year-specific");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock data for demonstration
  const [variants] = useState<ComponentVariant[]>([
    {
      id: '1',
      componentId: 'engine-1',
      componentType: 'engine',
      variantType: 'year_specific',
      effectiveFromYear: 2020,
      effectiveToYear: 2022,
      version: '2.0',
      changes: ['Updated ECU mapping', 'Improved fuel injection'],
      isActive: true
    },
    {
      id: '2',
      componentId: 'brake-1',
      componentType: 'brake_system',
      variantType: 'regional',
      region: 'Europe',
      version: '1.1',
      changes: ['ABS compliance for EU', 'Different brake pad compound'],
      isActive: true
    },
    {
      id: '3',
      componentId: 'engine-1',
      componentType: 'engine',
      variantType: 'evolution',
      effectiveFromYear: 2023,
      version: '3.0',
      changes: ['Emissions upgrade', 'Performance tuning', 'New exhaust system'],
      isActive: true
    }
  ]);

  const filteredVariants = variants.filter(variant => {
    const matchesSearch = variant.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         variant.changes.some(change => change.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTab = activeTab === 'all' || variant.variantType === activeTab.replace('-', '_');
    return matchesSearch && matchesTab;
  });

  const getVariantIcon = (type: string) => {
    switch (type) {
      case 'year_specific': return <Calendar className="h-4 w-4" />;
      case 'regional': return <Globe className="h-4 w-4" />;
      case 'evolution': return <GitBranch className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getVariantBadgeColor = (type: string) => {
    switch (type) {
      case 'year_specific': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'regional': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'evolution': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const renderVariantCard = (variant: ComponentVariant) => (
    <Card key={variant.id} className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {getVariantIcon(variant.variantType)}
            Version {variant.version}
          </CardTitle>
          <Badge className={getVariantBadgeColor(variant.variantType)}>
            {variant.variantType.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Variant Details */}
        <div className="space-y-2">
          {variant.effectiveFromYear && (
            <div className="flex items-center gap-2 text-sm text-explorer-text-muted">
              <Calendar className="h-3 w-3" />
              <span>
                {variant.effectiveFromYear}
                {variant.effectiveToYear ? ` - ${variant.effectiveToYear}` : ' - Present'}
              </span>
            </div>
          )}
          {variant.region && (
            <div className="flex items-center gap-2 text-sm text-explorer-text-muted">
              <MapPin className="h-3 w-3" />
              <span>{variant.region}</span>
            </div>
          )}
        </div>

        {/* Changes List */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-explorer-text">Changes:</h4>
          <ul className="space-y-1">
            {variant.changes.map((change, index) => (
              <li key={index} className="text-xs text-explorer-text-muted flex items-start gap-2">
                <span className="text-accent-teal mt-1">•</span>
                <span>{change}</span>
              </li>
            ))}
          </ul>
        </div>

        {variant.notes && (
          <div className="pt-2 border-t border-explorer-chrome/30">
            <p className="text-xs text-explorer-text-muted">{variant.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-explorer-text">
                <GitBranch className="h-5 w-5 text-accent-teal" />
                Component Variants Manager
              </CardTitle>
              <p className="text-sm text-explorer-text-muted mt-1">
                Manage year-specific changes, regional variations, and component evolution
              </p>
            </div>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Variant
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-explorer-text-muted" />
              <Input
                placeholder="Search variants by version or changes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-explorer-dark border-explorer-chrome/30"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Variant Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Variants</TabsTrigger>
          <TabsTrigger value="year-specific">Year Specific</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
          <TabsTrigger value="evolution">Evolution</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredVariants.length === 0 ? (
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardContent className="pt-6 text-center">
                <GitBranch className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-explorer-text mb-2">No Variants Found</h3>
                <p className="text-explorer-text-muted mb-4">
                  {searchTerm 
                    ? "No variants match your search criteria." 
                    : "No component variants have been created yet."
                  }
                </p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-accent-teal text-black hover:bg-accent-teal/80"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Variant
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVariants.map(renderVariantCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-accent-teal">
              {variants.filter(v => v.variantType === 'year_specific').length}
            </div>
            <div className="text-sm text-explorer-text-muted">Year-Specific Variants</div>
          </CardContent>
        </Card>
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-accent-teal">
              {variants.filter(v => v.variantType === 'regional').length}
            </div>
            <div className="text-sm text-explorer-text-muted">Regional Variants</div>
          </CardContent>
        </Card>
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-accent-teal">
              {variants.filter(v => v.variantType === 'evolution').length}
            </div>
            <div className="text-sm text-explorer-text-muted">Evolution Variants</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComponentVariantsManager;
