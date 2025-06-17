
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Link, 
  ArrowDown, 
  Settings,
  AlertTriangle 
} from "lucide-react";

interface ComponentOverrideIndicatorProps {
  isOverride: boolean;
  hasComponent: boolean;
  componentName?: string;
  onToggleOverride: (isOverride: boolean) => void;
  onSelectComponent: () => void;
  disabled?: boolean;
}

const ComponentOverrideIndicator: React.FC<ComponentOverrideIndicatorProps> = ({
  isOverride,
  hasComponent,
  componentName,
  onToggleOverride,
  onSelectComponent,
  disabled = false
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-explorer-dark rounded border border-explorer-chrome/30">
      <div className="flex items-center gap-3">
        {/* Override Status Badge */}
        {isOverride ? (
          <Badge variant="secondary" className="bg-accent-teal/20 text-accent-teal">
            <Link className="h-3 w-3 mr-1" />
            Override Active
          </Badge>
        ) : (
          <Badge variant="outline" className="text-explorer-text-muted">
            <ArrowDown className="h-3 w-3 mr-1" />
            Inherited
          </Badge>
        )}

        {/* Component Status */}
        <div className="text-sm">
          {hasComponent ? (
            <span className="text-explorer-text">{componentName}</span>
          ) : (
            <div className="flex items-center gap-1 text-orange-400">
              <AlertTriangle className="h-3 w-3" />
              <span>No component assigned</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {!isOverride && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleOverride(true)}
            disabled={disabled}
            className="text-xs"
          >
            Override
          </Button>
        )}
        
        {isOverride && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onSelectComponent}
              disabled={disabled}
              className="text-xs"
            >
              <Settings className="h-3 w-3 mr-1" />
              Change
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleOverride(false)}
              disabled={disabled}
              className="text-xs text-explorer-text-muted hover:text-red-400"
            >
              Remove Override
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ComponentOverrideIndicator;
