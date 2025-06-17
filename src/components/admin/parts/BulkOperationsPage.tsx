
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Database, 
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  BarChart3
} from "lucide-react";

interface BulkActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  onExecute: () => void;
  isDestructive?: boolean;
}

const BulkActionCard: React.FC<BulkActionCardProps> = ({
  title,
  description,
  icon,
  action,
  onExecute,
  isDestructive = false
}) => {
  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <CardTitle className="text-explorer-text flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-explorer-text-muted mb-4">
          {description}
        </p>
        <Button
          onClick={onExecute}
          variant={isDestructive ? "destructive" : "default"}
          className={!isDestructive ? "bg-accent-teal hover:bg-accent-teal/80" : ""}
        >
          {action}
        </Button>
      </CardContent>
    </Card>
  );
};

interface DataQualityIssue {
  type: string;
  count: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

const DataQualityCard: React.FC<{ issues: DataQualityIssue[] }> = ({ issues }) => {
  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <CardTitle className="text-explorer-text flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Data Quality Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {issues.map((issue, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-explorer-dark rounded-lg border border-explorer-chrome/20"
            >
              <div className="flex items-center gap-3">
                {issue.severity === 'high' ? (
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                ) : issue.severity === 'medium' ? (
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                )}
                <div>
                  <div className="font-medium text-explorer-text">
                    {issue.type}
                  </div>
                  <div className="text-sm text-explorer-text-muted">
                    {issue.description}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    issue.severity === 'high' ? 'border-red-400/30 text-red-400' :
                    issue.severity === 'medium' ? 'border-yellow-400/30 text-yellow-400' :
                    'border-green-400/30 text-green-400'
                  }
                >
                  {issue.count}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const BulkOperationsPage = () => {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  // Mock data quality issues - in real implementation, this would come from actual queries
  const dataQualityIssues: DataQualityIssue[] = [
    {
      type: "Missing Engine Components",
      count: 12,
      severity: 'high',
      description: "Models without default engine assignments"
    },
    {
      type: "Incomplete Configurations",
      count: 8,
      severity: 'medium',
      description: "Configurations missing 2+ components"
    },
    {
      type: "Orphaned Components",
      count: 3,
      severity: 'low',
      description: "Components not assigned to any model"
    },
    {
      type: "Duplicate Assignments",
      count: 2,
      severity: 'medium',
      description: "Models with duplicate component assignments"
    }
  ];

  const handleBulkAssignment = () => {
    console.log('Execute bulk component assignment');
    // TODO: Open bulk assignment interface
  };

  const handleDataExport = () => {
    console.log('Export component data');
    // TODO: Generate and download export file
  };

  const handleDataImport = () => {
    console.log('Import component data');
    // TODO: Open import interface
  };

  const handleDataCleanup = () => {
    console.log('Clean up data inconsistencies');
    // TODO: Execute cleanup operations
  };

  const handleRegenerateStats = () => {
    console.log('Regenerate usage statistics');
    // TODO: Regenerate component usage stats
  };

  const handlePopulateDefaults = () => {
    console.log('Populate default assignments');
    // TODO: Auto-populate missing component assignments
  };

  return (
    <div className="flex-1 p-6 bg-explorer-dark">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-explorer-text mb-2">
          Bulk Operations
        </h1>
        <p className="text-explorer-text-muted">
          Mass assignment and data management tools
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DataQualityCard issues={dataQualityIssues} />
        
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader>
            <CardTitle className="text-explorer-text">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handlePopulateDefaults}
              className="w-full bg-accent-teal hover:bg-accent-teal/80 justify-start"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Auto-Populate Missing Assignments
            </Button>
            <Button
              onClick={handleRegenerateStats}
              variant="outline"
              className="w-full border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20 justify-start"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Regenerate Usage Statistics
            </Button>
            <Button
              onClick={handleDataCleanup}
              variant="outline"
              className="w-full border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 justify-start"
            >
              <Database className="h-4 w-4 mr-2" />
              Clean Up Data Inconsistencies
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BulkActionCard
          title="Bulk Component Assignment"
          description="Assign components to multiple models or configurations at once"
          icon={<Database className="h-5 w-5" />}
          action="Start Bulk Assignment"
          onExecute={handleBulkAssignment}
        />

        <BulkActionCard
          title="Export Component Data"
          description="Download a comprehensive export of all component assignments and configurations"
          icon={<Download className="h-5 w-5" />}
          action="Export Data"
          onExecute={handleDataExport}
        />

        <BulkActionCard
          title="Import Component Data"
          description="Upload and import component assignments from a CSV or JSON file"
          icon={<Upload className="h-5 w-5" />}
          action="Import Data"
          onExecute={handleDataImport}
        />
      </div>
    </div>
  );
};

export default BulkOperationsPage;
