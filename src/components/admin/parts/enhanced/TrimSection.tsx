
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Configuration } from "@/types/motorcycle";

interface TrimSectionProps {
  configurations: Configuration[];
  selectedYear: string | null;
  selectedConfig: string | null;
  onConfigSelect: (configId: string) => void;
  onConfigChange: () => void;
  onAddTrim: () => void;
  onEditTrim?: (config: Configuration) => void;
  onDeleteTrim?: (config: Configuration) => void;
}

const TrimSection = ({
  configurations,
  selectedYear,
  selectedConfig,
  onConfigSelect,
  onConfigChange,
  onAddTrim,
  onEditTrim,
  onDeleteTrim
}: TrimSectionProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (config: Configuration, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditTrim) {
      onEditTrim(config);
    }
  };

  const handleDelete = async (config: Configuration, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete the "${config.name}" trim level? This action cannot be undone.`)) {
      return;
    }
    
    setDeletingId(config.id);
    try {
      if (onDeleteTrim) {
        await onDeleteTrim(config);
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (!selectedYear) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Trim Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-explorer-text-muted">
            Select a model year to view trim levels
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <CardTitle className="text-explorer-text flex items-center justify-between">
          <div className="flex items-center gap-2">
            Trim Levels
            <Badge variant="secondary">
              {configurations.length} trims
            </Badge>
          </div>
          <Button
            size="sm"
            onClick={onAddTrim}
            className="bg-accent-teal text-black hover:bg-accent-teal/80"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Trim
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {configurations.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-orange-400 mx-auto mb-4" />
            <p className="text-explorer-text-muted mb-2">No trim levels found</p>
            <p className="text-xs text-explorer-text-muted">
              This year may need trim level configuration
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {configurations.map((config) => (
              <div key={config.id} className="relative group">
                <Button
                  variant="ghost"
                  onClick={() => onConfigSelect(config.id)}
                  disabled={deletingId === config.id}
                  className={`h-auto p-4 text-left w-full relative ${
                    selectedConfig === config.id
                      ? 'bg-accent-teal/20 text-accent-teal border-accent-teal/30 border'
                      : 'bg-explorer-dark hover:bg-explorer-chrome/10 border border-explorer-chrome/20'
                  } ${deletingId === config.id ? 'opacity-50' : ''}`}
                >
                  <div className="w-full space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-medium">{config.name || "Standard"}</span>
                      <div className="flex items-center gap-1">
                        {config.is_default && (
                          <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                            Default
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {config.price_premium_usd && (
                      <div className="text-sm text-green-400">
                        +${config.price_premium_usd.toLocaleString()} premium
                      </div>
                    )}
                    
                    {config.trim_level && (
                      <div className="text-xs text-explorer-text-muted">
                        Trim: {config.trim_level}
                      </div>
                    )}
                    
                    {config.special_features && config.special_features.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {config.special_features.slice(0, 2).map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs px-2 py-1">
                            {feature}
                          </Badge>
                        ))}
                        {config.special_features.length > 2 && (
                          <Badge variant="outline" className="text-xs px-2 py-1">
                            +{config.special_features.length - 2} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </Button>
                
                {/* Actions Dropdown */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 bg-explorer-dark/80 hover:bg-explorer-chrome/20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-explorer-card border-explorer-chrome/30">
                      <DropdownMenuItem
                        onClick={(e) => handleEdit(config, e)}
                        className="text-explorer-text hover:bg-explorer-chrome/10"
                      >
                        <Edit className="h-3 w-3 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => handleDelete(config, e)}
                        className="text-red-400 hover:bg-red-500/10"
                        disabled={deletingId === config.id}
                      >
                        <Trash2 className="h-3 w-3 mr-2" />
                        {deletingId === config.id ? 'Deleting...' : 'Delete'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrimSection;
