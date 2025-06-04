
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, AlertCircle, X } from "lucide-react";
import { ValidationResult, ValidationIssue } from "../validation/ValidationEngine";

interface ValidationResultsDialogProps {
  open: boolean;
  onClose: () => void;
  results: ValidationResult[];
  configurations: any[];
}

const ValidationResultsDialog = ({ open, onClose, results, configurations }: ValidationResultsDialogProps) => {
  const getIssueIcon = (type: ValidationIssue['type']) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getIssueColor = (type: ValidationIssue['type']) => {
    switch (type) {
      case 'error': return 'text-red-400 border-red-400/30';
      case 'warning': return 'text-yellow-400 border-yellow-400/30';
      case 'info': return 'text-blue-400 border-blue-400/30';
    }
  };

  const overallStats = {
    total: results.length,
    valid: results.filter(r => r.isValid).length,
    invalid: results.filter(r => !r.isValid).length,
    avgCompleteness: Math.round(results.reduce((sum, r) => sum + r.completeness, 0) / results.length)
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto bg-explorer-card border-explorer-chrome/30">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-explorer-text">Validation Results</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Overall Stats */}
        <Card className="bg-explorer-dark border-explorer-chrome/30 mb-6">
          <CardHeader>
            <CardTitle className="text-explorer-text">Overall Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-explorer-text">{overallStats.total}</div>
                <div className="text-sm text-explorer-text-muted">Total Configurations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{overallStats.valid}</div>
                <div className="text-sm text-explorer-text-muted">Valid</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{overallStats.invalid}</div>
                <div className="text-sm text-explorer-text-muted">Invalid</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-teal">{overallStats.avgCompleteness}%</div>
                <div className="text-sm text-explorer-text-muted">Avg Completeness</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Individual Results */}
        <div className="space-y-4">
          {results.map((result, index) => {
            const config = configurations[index];
            if (!config) return null;

            return (
              <Card key={config.id} className="bg-explorer-dark border-explorer-chrome/30">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-explorer-text text-lg">
                        {config.name || "Standard Configuration"}
                      </CardTitle>
                      <div className="text-sm text-explorer-text-muted">
                        {config.model_years?.motorcycle_models?.name} • {config.model_years?.year}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className={result.isValid ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}
                      >
                        {result.isValid ? 'Valid' : 'Invalid'}
                      </Badge>
                      <Badge variant="outline" className="text-accent-teal border-accent-teal/30">
                        {result.completeness}% Complete
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                {result.issues.length > 0 && (
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-medium text-explorer-text">Issues Found:</h4>
                      {result.issues.map((issue, issueIndex) => (
                        <div 
                          key={issueIndex}
                          className={`p-3 rounded border ${getIssueColor(issue.type)} bg-opacity-10`}
                        >
                          <div className="flex items-start gap-3">
                            {getIssueIcon(issue.type)}
                            <div className="flex-1">
                              <div className="font-medium text-explorer-text">{issue.message}</div>
                              {issue.fix && (
                                <div className="text-sm text-explorer-text-muted mt-1">
                                  Fix: {issue.fix}
                                </div>
                              )}
                              <Badge variant="outline" className="text-xs mt-2">
                                {issue.section}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ValidationResultsDialog;
