
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface ExpandableSectionProps {
  id: string;
  title: string;
  status: 'complete' | 'partial' | 'missing';
  summary: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  className?: string;
}

const ExpandableSection = ({ 
  id,
  title, 
  status, 
  summary, 
  children, 
  isExpanded,
  onToggle,
  className = "" 
}: ExpandableSectionProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'partial':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'missing':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-green-100 text-green-800">Complete</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>;
      case 'missing':
        return <Badge className="bg-red-100 text-red-800">Missing</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card className={`bg-explorer-card border-explorer-chrome/30 ${className}`}>
      <CardHeader className="cursor-pointer hover:bg-explorer-chrome/10 transition-colors" onClick={() => onToggle(id)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <h3 className="text-lg font-semibold text-explorer-text">{title}</h3>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-explorer-text-muted" />
            ) : (
              <ChevronRight className="h-4 w-4 text-explorer-text-muted" />
            )}
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
          </div>
        </div>
        {!isExpanded && (
          <div className="text-sm text-explorer-text-muted mt-2 ml-7">
            {summary}
          </div>
        )}
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0">
          {children}
        </CardContent>
      )}
    </Card>
  );
};

export default ExpandableSection;
