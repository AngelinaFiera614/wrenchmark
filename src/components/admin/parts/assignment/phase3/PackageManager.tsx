
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Plus, 
  Search,
  Cog,
  Disc,
  Box,
  Waves,
  Circle,
  Star,
  Users,
  CheckCircle
} from "lucide-react";

interface ComponentPackage {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'touring' | 'entry_level' | 'premium' | 'custom';
  components: {
    engine?: string;
    brake_system?: string;
    frame?: string;
    suspension?: string;
    wheel?: string;
  };
  isTemplate: boolean;
  usageCount: number;
  compatibility: string[];
  tags: string[];
  createdBy?: string;
  isPublic: boolean;
}

interface PackageManagerProps {
  onPackageSelect?: (packageData: ComponentPackage) => void;
  onPackageCreate?: (packageData: Omit<ComponentPackage, 'id' | 'usageCount'>) => void;
}

const PackageManager: React.FC<PackageManagerProps> = ({
  onPackageSelect,
  onPackageCreate
}) => {
  const [activeTab, setActiveTab] = useState("templates");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock data for demonstration
  const [packages] = useState<ComponentPackage[]>([
    {
      id: '1',
      name: 'Sport Touring Package',
      description: 'Complete component set optimized for long-distance sport touring',
      category: 'touring',
      components: {
        engine: 'V-Twin 1200cc',
        brake_system: 'Dual Disc ABS',
        frame: 'Aluminum Perimeter',
        suspension: 'Adjustable Sport',
        wheel: 'Cast Aluminum Touring'
      },
      isTemplate: true,
      usageCount: 245,
      compatibility: ['Sport Touring', 'Adventure', 'Standard'],
      tags: ['touring', 'long-distance', 'comfort'],
      isPublic: true
    },
    {
      id: '2',
      name: 'Entry Level Package',
      description: 'Beginner-friendly component combination with safety focus',
      category: 'entry_level',
      components: {
        engine: 'Single 250cc',
        brake_system: 'Standard ABS',
        frame: 'Steel Tube',
        suspension: 'Basic Telescopic',
        wheel: 'Spoked Steel'
      },
      isTemplate: true,
      usageCount: 189,
      compatibility: ['Standard', 'Naked', 'Dual-sport'],
      tags: ['beginner', 'safety', 'affordable'],
      isPublic: true
    },
    {
      id: '3',
      name: 'Performance Track Package',
      description: 'High-performance components for track and racing applications',
      category: 'performance',
      components: {
        engine: 'Inline-4 1000cc Race',
        brake_system: 'Racing Brembo',
        frame: 'Carbon Fiber',
        suspension: 'Ohlins Racing',
        wheel: 'Forged Carbon'
      },
      isTemplate: true,
      usageCount: 87,
      compatibility: ['Sport', 'Superbike'],
      tags: ['racing', 'track', 'performance'],
      isPublic: true
    }
  ]);

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'templates' && pkg.isTemplate) ||
                      (activeTab === 'custom' && !pkg.isTemplate);
    return matchesSearch && matchesTab;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <Star className="h-4 w-4" />;
      case 'touring': return <Package className="h-4 w-4" />;
      case 'entry_level': return <Users className="h-4 w-4" />;
      case 'premium': return <CheckCircle className="h-4 w-4" />;
      default: return <Box className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'touring': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'entry_level': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'premium': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'engine': return <Cog className="h-3 w-3" />;
      case 'brake_system': return <Disc className="h-3 w-3" />;
      case 'frame': return <Box className="h-3 w-3" />;
      case 'suspension': return <Waves className="h-3 w-3" />;
      case 'wheel': return <Circle className="h-3 w-3" />;
      default: return <Package className="h-3 w-3" />;
    }
  };

  const renderPackageCard = (pkg: ComponentPackage) => (
    <Card key={pkg.id} className="bg-explorer-card border-explorer-chrome/30 hover:border-accent-teal/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2 mb-2">
              {getCategoryIcon(pkg.category)}
              {pkg.name}
            </CardTitle>
            <p className="text-sm text-explorer-text-muted">{pkg.description}</p>
          </div>
          <Badge className={getCategoryColor(pkg.category)}>
            {pkg.category.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Components List */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-explorer-text">Components:</h4>
          <div className="grid grid-cols-1 gap-1">
            {Object.entries(pkg.components).map(([type, name]) => (
              <div key={type} className="flex items-center gap-2 text-xs text-explorer-text-muted">
                {getComponentIcon(type)}
                <span className="capitalize">{type.replace('_', ' ')}:</span>
                <span className="text-explorer-text">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compatibility */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-explorer-text">Compatible with:</h4>
          <div className="flex flex-wrap gap-1">
            {pkg.compatibility.map((type, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {pkg.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Stats and Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-explorer-chrome/30">
          <div className="flex items-center gap-4 text-xs text-explorer-text-muted">
            <span>{pkg.usageCount} uses</span>
            {pkg.isPublic && <span>Public</span>}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPackageSelect?.(pkg)}
            >
              Use Package
            </Button>
          </div>
        </div>
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
                <Package className="h-5 w-5 text-accent-teal" />
                Package Manager
              </CardTitle>
              <p className="text-sm text-explorer-text-muted mt-1">
                Pre-configured component packages and templates for efficient assignment
              </p>
            </div>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Package
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Search */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-explorer-text-muted" />
            <Input
              placeholder="Search packages by name, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-explorer-dark border-explorer-chrome/30"
            />
          </div>
        </CardContent>
      </Card>

      {/* Package Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="custom">Custom Packages</TabsTrigger>
          <TabsTrigger value="all">All Packages</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredPackages.length === 0 ? (
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardContent className="pt-6 text-center">
                <Package className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-explorer-text mb-2">No Packages Found</h3>
                <p className="text-explorer-text-muted mb-4">
                  {searchTerm 
                    ? "No packages match your search criteria." 
                    : "No component packages have been created yet."
                  }
                </p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-accent-teal text-black hover:bg-accent-teal/80"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Package
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPackages.map(renderPackageCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-accent-teal">
              {packages.filter(p => p.category === 'performance').length}
            </div>
            <div className="text-sm text-explorer-text-muted">Performance</div>
          </CardContent>
        </Card>
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-accent-teal">
              {packages.filter(p => p.category === 'touring').length}
            </div>
            <div className="text-sm text-explorer-text-muted">Touring</div>
          </CardContent>
        </Card>
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-accent-teal">
              {packages.filter(p => p.category === 'entry_level').length}
            </div>
            <div className="text-sm text-explorer-text-muted">Entry Level</div>
          </CardContent>
        </Card>
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-accent-teal">
              {packages.reduce((sum, p) => sum + p.usageCount, 0)}
            </div>
            <div className="text-sm text-explorer-text-muted">Total Uses</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PackageManager;
