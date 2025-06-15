
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Keyboard, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HeaderSectionProps {
  completeness: { percentage: number; issues: string[] };
  selectedModel: any;
  isLoading: boolean;
  onShowKeyboardHelp: () => void;
  onRefresh: () => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  completeness,
  selectedModel,
  isLoading,
  onShowKeyboardHelp,
  onRefresh
}) => (
  <TooltipProvider>
    <div className="bg-explorer-card border-b border-explorer-chrome/30 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-explorer-text">Parts & Configuration Manager</h1>
          <p className="text-explorer-text-muted">
            Comprehensive motorcycle parts and configuration management
          </p>
        </div>
        <div className="flex items-center gap-4">
          {selectedModel && (
            <div className="text-right">
              <div className="text-sm font-medium text-explorer-text">Completeness</div>
              <Badge
                variant="outline"
                className={completeness.percentage >= 80 ? 'text-green-400 border-green-400/30' : 'text-yellow-400 border-yellow-400/30'}
              >
                {completeness.percentage >= 80 ?
                  <CheckCircle className="h-3 w-3 mr-1" /> :
                  <AlertTriangle className="h-3 w-3 mr-1" />}
                {completeness.percentage}%
              </Badge>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShowKeyboardHelp}
                  className="h-8 w-8 p-0"
                >
                  <Keyboard className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Keyboard Shortcuts (F1)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRefresh}
                  className="h-8 w-8 p-0"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh Data (R)</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  </TooltipProvider>
);

export default HeaderSection;
