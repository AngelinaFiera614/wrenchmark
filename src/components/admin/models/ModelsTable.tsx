
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Plus, ChevronDown, ChevronRight, Calendar, Cog } from "lucide-react";
import { MotorcycleModel } from "@/types/motorcycle";

interface ModelsTableProps {
  models: MotorcycleModel[];
  onEditModel: (model: MotorcycleModel) => void;
  onDeleteModel: (model: MotorcycleModel) => void;
  onAddYear: (model: MotorcycleModel) => void;
  onAddConfiguration: (year: any) => void;
  expandedModels: Set<string>;
  onToggleExpanded: (modelId: string) => void;
}

export default function ModelsTable({
  models,
  onEditModel,
  onDeleteModel,
  onAddYear,
  onAddConfiguration,
  expandedModels,
  onToggleExpanded
}: ModelsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Get unique types and statuses for filters
  const uniqueTypes = useMemo(() => {
    const types = [...new Set(models.map(m => m.type).filter(Boolean))];
    return types.sort();
  }, [models]);

  const uniqueStatuses = useMemo(() => {
    const statuses = [...new Set(models.map(m => m.production_status).filter(Boolean))];
    return statuses.sort();
  }, [models]);

  // Filter and sort models
  const filteredAndSortedModels = useMemo(() => {
    let filtered = models.filter(model => {
      const matchesSearch = !searchTerm || 
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.brand?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || model.production_status === statusFilter;
      const matchesType = typeFilter === "all" || model.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "brand":
          aValue = a.brand?.name?.toLowerCase() || "";
          bValue = b.brand?.name?.toLowerCase() || "";
          break;
        case "type":
          aValue = a.type.toLowerCase();
          bValue = b.type.toLowerCase();
          break;
        case "year":
          aValue = a.production_start_year || 0;
          bValue = b.production_start_year || 0;
          break;
        case "status":
          aValue = a.production_status.toLowerCase();
          bValue = b.production_status.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [models, searchTerm, statusFilter, typeFilter, sortBy, sortOrder]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (column: string) => {
    if (sortBy === column) {
      return sortOrder === "asc" ? "↑" : "↓";
    }
    return "";
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <Input
                placeholder="Search models or brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {uniqueStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="brand">Brand</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                  <SelectItem value="year">Start Year</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredAndSortedModels.length} of {models.length} models
          </div>
        </CardContent>
      </Card>

      {/* Models Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50" 
                  onClick={() => handleSort("name")}
                >
                  Model {getSortIcon("name")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50" 
                  onClick={() => handleSort("brand")}
                >
                  Brand {getSortIcon("brand")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50" 
                  onClick={() => handleSort("type")}
                >
                  Type {getSortIcon("type")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50" 
                  onClick={() => handleSort("year")}
                >
                  Production {getSortIcon("year")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50" 
                  onClick={() => handleSort("status")}
                >
                  Status {getSortIcon("status")}
                </TableHead>
                <TableHead>Years</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedModels.map((model) => (
                <React.Fragment key={model.id}>
                  <TableRow className="group">
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleExpanded(model.id)}
                        className="p-1"
                      >
                        {expandedModels.has(model.id) ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{model.name}</div>
                      {model.base_description && (
                        <div className="text-sm text-muted-foreground">
                          {model.base_description.substring(0, 60)}
                          {model.base_description.length > 60 ? "..." : ""}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {model.brand?.logo_url && (
                          <img 
                            src={model.brand.logo_url} 
                            alt={model.brand.name}
                            className="w-6 h-6 rounded object-contain"
                          />
                        )}
                        {model.brand?.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{model.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {model.production_start_year}
                        {model.production_end_year && ` - ${model.production_end_year}`}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={model.production_status === 'active' ? 'default' : 'secondary'}>
                        {model.production_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{model.years?.length || 0}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onAddYear(model)}
                          className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditModel(model)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => onDeleteModel(model)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Expanded section for years and configurations */}
                  {expandedModels.has(model.id) && model.years && (
                    <TableRow>
                      <TableCell colSpan={8} className="p-0">
                        <div className="bg-muted/20 p-4 border-t">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Model Years & Configurations
                              </h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onAddYear(model)}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Year
                              </Button>
                            </div>
                            
                            {model.years.length === 0 ? (
                              <div className="text-center py-4 text-muted-foreground">
                                No years configured. Add the first year to get started.
                              </div>
                            ) : (
                              <div className="grid gap-3">
                                {model.years.map((year) => (
                                  <div key={year.id} className="border rounded-lg p-3 bg-background">
                                    <div className="flex justify-between items-start mb-2">
                                      <div className="flex items-center gap-3">
                                        <span className="font-medium text-lg">{year.year}</span>
                                        {year.msrp_usd && (
                                          <Badge variant="outline" className="text-green-600">
                                            ${year.msrp_usd.toLocaleString()}
                                          </Badge>
                                        )}
                                        {year.changes && (
                                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                            {year.changes}
                                          </span>
                                        )}
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onAddConfiguration(year)}
                                      >
                                        <Cog className="h-4 w-4 mr-1" />
                                        Add Config
                                      </Button>
                                    </div>

                                    {year.configurations && year.configurations.length > 0 && (
                                      <div className="space-y-2">
                                        <div className="text-sm font-medium text-muted-foreground">
                                          Configurations ({year.configurations.length})
                                        </div>
                                        <div className="grid gap-2">
                                          {year.configurations.map((config) => (
                                            <div key={config.id} className="flex justify-between items-center p-2 bg-muted/50 rounded border">
                                              <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">{config.name}</span>
                                                {config.is_default && (
                                                  <Badge variant="secondary" className="text-xs">Default</Badge>
                                                )}
                                                {config.trim_level && (
                                                  <Badge variant="outline" className="text-xs">{config.trim_level}</Badge>
                                                )}
                                              </div>
                                              <div className="text-xs text-muted-foreground flex items-center gap-4">
                                                {config.engine?.displacement_cc && (
                                                  <span>{config.engine.displacement_cc}cc</span>
                                                )}
                                                {config.weight_kg && (
                                                  <span>{config.weight_kg}kg</span>
                                                )}
                                                {config.seat_height_mm && (
                                                  <span>{config.seat_height_mm}mm seat</span>
                                                )}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>

          {filteredAndSortedModels.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all" 
                ? "No models match your current filters." 
                : "No motorcycle models found. Add your first model to get started."
              }
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
