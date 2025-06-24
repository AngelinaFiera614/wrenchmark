
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings, 
  Filter, 
  Play, 
  Save, 
  History,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BulkOperationFilter {
  brands?: string[];
  categories?: string[];
  yearRange?: { from: number; to: number };
  assignmentStatus?: 'complete' | 'partial' | 'missing';
  componentTypes?: string[];
}

interface BulkOperation {
  id: string;
  type: 'assign' | 'remove' | 'replace';
  componentType: string;
  componentId?: string;
  targetCount: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  completedAt?: Date;
  errors?: string[];
}

interface SavedFilterPreset {
  id: string;
  name: string;
  description: string;
  filters: BulkOperationFilter;
  createdAt: Date;
  usageCount: number;
}

interface AdvancedBulkOperationsProps {
  onOperationStart?: (operation: BulkOperation) => void;
  onFilterChange?: (filters: BulkOperationFilter) => void;
}

const AdvancedBulkOperations: React.FC<AdvancedBulkOperationsProps> = ({
  onOperationStart,
  onFilterChange
}) => {
  const [activeFilters, setActiveFilters] = useState<BulkOperationFilter>({});
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [operationType, setOperationType] = useState<'assign' | 'remove' | 'replace'>('assign');
  const [selectedComponentType, setSelectedComponentType] = useState<string>('');
  const [selectedComponentId, setSelectedComponentId] = useState<string>('');
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [presetName, setPresetName] = useState('');

  // Mock data for saved presets
  const savedPresets: SavedFilterPreset[] = [
    {
      id: '1',
      name: 'Honda Sport Bikes',
      description: 'Honda motorcycles in Sport category, 2020-2024',
      filters: {
        brands: ['Honda'],
        categories: ['Sport'],
        yearRange: { from: 2020, to: 2024 }
      },
      createdAt: new Date('2024-01-15'),
      usageCount: 12
    },
    {
      id: '2',
      name: 'Incomplete Assignments',
      description: 'Models missing essential components',
      filters: {
        assignmentStatus: 'partial',
        componentTypes: ['engine', 'brake_system']
      },
      createdAt: new Date('2024-02-01'),
      usageCount: 8
    }
  ];

  // Mock data for recent operations
  const recentOperations: BulkOperation[] = [
    {
      id: '1',
      type: 'assign',
      componentType: 'engine',
      componentId: 'engine-v-twin-883',
      targetCount: 15,
      status: 'completed',
      progress: 100,
      createdAt: new Date('2024-01-20T10:30:00'),
      completedAt: new Date('2024-01-20T10:35:00')
    },
    {
      id: '2',
      type: 'replace',
      componentType: 'brake_system',
      componentId: 'brake-abs-dual',
      targetCount: 8,
      status: 'running',
      progress: 62,
      createdAt: new Date('2024-01-20T11:00:00')
    }
  ];

  const componentTypes = [
    { key: 'engine', label: 'Engine' },
    { key: 'brake_system', label: 'Brake System' },
    { key: 'frame', label: 'Frame' },
    { key: 'suspension', label: 'Suspension' },
    { key: 'wheel', label: 'Wheels' }
  ];

  const handleFilterChange = (key: keyof BulkOperationFilter, value: any) => {
    const newFilters = { ...activeFilters, [key]: value };
    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleApplyPreset = (preset: SavedFilterPreset) => {
    setActiveFilters(preset.filters);
    onFilterChange?.(preset.filters);
  };

  const handleSavePreset = () => {
    if (presetName.trim()) {
      // In real implementation, save to database
      console.log('Saving preset:', { name: presetName, filters: activeFilters });
      setShowSavePreset(false);
      setPresetName('');
    }
  };

  const handleStartOperation = () => {
    if (!selectedComponentType || selectedModels.length === 0) return;

    const operation: BulkOperation = {
      id: Date.now().toString(),
      type: operationType,
      componentType: selectedComponentType,
      componentId: selectedComponentId,
      targetCount: selectedModels.length,
      status: 'pending',
      progress: 0,
      createdAt: new Date()
    };

    onOperationStart?.(operation);
  };

  const getOperationStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'running': return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getOperationStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500 border-green-500 bg-green-500/10';
      case 'running': return 'text-blue-500 border-blue-500 bg-blue-500/10';
      case 'failed': return 'text-red-500 border-red-500 bg-red-500/10';
      default: return 'text-gray-500 border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Advanced Filters */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-explorer-text">
            <Filter className="h-5 w-5 text-accent-teal" />
            Advanced Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-explorer-text">Brands</Label>
              <Input 
                placeholder="Select brands..."
                className="bg-explorer-dark border-explorer-chrome/30"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-explorer-text">Categories</Label>
              <Select>
                <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                  <SelectValue placeholder="Select categories..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sport">Sport</SelectItem>
                  <SelectItem value="cruiser">Cruiser</SelectItem>
                  <SelectItem value="touring">Touring</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-explorer-text">Assignment Status</Label>
              <Select onValueChange={(value) => handleFilterChange('assignmentStatus', value)}>
                <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                  <SelectValue placeholder="Select status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="missing">Missing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-explorer-text">Year Range</Label>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  placeholder="From"
                  className="bg-explorer-dark border-explorer-chrome/30"
                />
                <Input 
                  type="number" 
                  placeholder="To"
                  className="bg-explorer-dark border-explorer-chrome/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-explorer-text">Component Types</Label>
              <div className="flex flex-wrap gap-2">
                {componentTypes.map((type) => (
                  <div key={type.key} className="flex items-center space-x-2">
                    <Checkbox 
                      id={type.key}
                      onCheckedChange={(checked) => {
                        const current = activeFilters.componentTypes || [];
                        const updated = checked 
                          ? [...current, type.key]
                          : current.filter(t => t !== type.key);
                        handleFilterChange('componentTypes', updated);
                      }}
                    />
                    <Label htmlFor={type.key} className="text-sm text-explorer-text">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Filter Presets */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-explorer-text">
            <div className="flex items-center gap-2">
              <Save className="h-5 w-5 text-accent-teal" />
              Saved Filter Presets
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowSavePreset(true)}
            >
              Save Current
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showSavePreset && (
            <Alert className="mb-4">
              <AlertDescription>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Preset name..."
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleSavePreset}>Save</Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowSavePreset(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {savedPresets.map((preset) => (
              <div 
                key={preset.id}
                className="p-3 border border-explorer-chrome/30 rounded-lg hover:bg-explorer-chrome/10 cursor-pointer"
                onClick={() => handleApplyPreset(preset)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-explorer-text">{preset.name}</div>
                    <div className="text-sm text-explorer-text-muted mt-1">
                      {preset.description}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Used {preset.usageCount}x
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Operation Setup */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-explorer-text">
            <Settings className="h-5 w-5 text-accent-teal" />
            Bulk Operation Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-explorer-text">Operation Type</Label>
              <Select value={operationType} onValueChange={(value: any) => setOperationType(value)}>
                <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="assign">Assign Component</SelectItem>
                  <SelectItem value="remove">Remove Component</SelectItem>
                  <SelectItem value="replace">Replace Component</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-explorer-text">Component Type</Label>
              <Select value={selectedComponentType} onValueChange={setSelectedComponentType}>
                <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                  <SelectValue placeholder="Select component type..." />
                </SelectTrigger>
                <SelectContent>
                  {componentTypes.map((type) => (
                    <SelectItem key={type.key} value={type.key}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-explorer-text">Target Models</Label>
              <div className="text-sm text-explorer-text-muted">
                {selectedModels.length} models selected
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleStartOperation}
              disabled={!selectedComponentType || selectedModels.length === 0}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Operation
            </Button>
            <Button variant="outline">
              Preview Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Operation History */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-explorer-text">
            <History className="h-5 w-5 text-accent-teal" />
            Recent Operations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentOperations.map((operation) => (
              <div 
                key={operation.id}
                className="flex items-center justify-between p-3 border border-explorer-chrome/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getOperationStatusIcon(operation.status)}
                  <div>
                    <div className="text-sm font-medium text-explorer-text">
                      {operation.type} {operation.componentType}
                    </div>
                    <div className="text-xs text-explorer-text-muted">
                      {operation.targetCount} models • {operation.createdAt.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getOperationStatusColor(operation.status)}`}
                  >
                    {operation.status}
                  </Badge>
                  {operation.status === 'running' && (
                    <div className="text-xs text-explorer-text-muted">
                      {operation.progress}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedBulkOperations;
