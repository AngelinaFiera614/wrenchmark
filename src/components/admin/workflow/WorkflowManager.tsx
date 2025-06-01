
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Clock, User, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { getWorkflowsByStatus, updateWorkflowStatus, type WorkflowStatus } from "@/services/workflow/workflowService";

const WorkflowManager = () => {
  const { toast } = useToast();
  const [workflows, setWorkflows] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const statuses = ['draft', 'review', 'approved', 'published'];
      const workflowData: Record<string, any[]> = {};

      await Promise.all(
        statuses.map(async (status) => {
          workflowData[status] = await getWorkflowsByStatus(status);
        })
      );

      setWorkflows(workflowData);
    } catch (error) {
      console.error('Error loading workflows:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load workflows"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (configurationId: string, newStatus: string) => {
    try {
      await updateWorkflowStatus(configurationId, newStatus, notes);
      
      toast({
        title: "Status Updated",
        description: `Configuration moved to ${newStatus}`
      });

      setNotes("");
      setSelectedWorkflow(null);
      loadWorkflows();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText className="h-4 w-4" />;
      case 'review':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'published':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-500/20 text-gray-400';
      case 'review':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'approved':
        return 'bg-blue-500/20 text-blue-400';
      case 'published':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const WorkflowCard = ({ workflow }: { workflow: any }) => (
    <Card className="bg-explorer-card border-explorer-chrome/30 hover:border-accent-teal/50 transition-colors">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-explorer-text">
              {workflow.model_configurations?.name || 'Unnamed Configuration'}
            </h4>
            <Badge className={getStatusColor(workflow.status)}>
              {getStatusIcon(workflow.status)}
              <span className="ml-1 capitalize">{workflow.status}</span>
            </Badge>
          </div>
          
          <div className="text-sm text-explorer-text-muted">
            <p>
              {workflow.model_configurations?.model_years?.motorcycle_models?.brands?.name} {' '}
              {workflow.model_configurations?.model_years?.motorcycle_models?.name} {' '}
              ({workflow.model_configurations?.model_years?.year})
            </p>
          </div>

          {workflow.notes && (
            <div className="bg-explorer-dark/50 p-2 rounded text-sm text-explorer-text-muted">
              {workflow.notes}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-explorer-text-muted">
              <Clock className="h-3 w-3" />
              <span>Updated: {new Date(workflow.updated_at).toLocaleDateString()}</span>
            </div>
            
            <div className="flex space-x-2">
              {workflow.status === 'draft' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate(workflow.configuration_id, 'review')}
                >
                  Send to Review
                </Button>
              )}
              {workflow.status === 'review' && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(workflow.configuration_id, 'approved')}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(workflow.configuration_id, 'draft')}
                  >
                    Back to Draft
                  </Button>
                </>
              )}
              {workflow.status === 'approved' && (
                <Button
                  size="sm"
                  className="bg-accent-teal text-black hover:bg-accent-teal/80"
                  onClick={() => handleStatusUpdate(workflow.configuration_id, 'published')}
                >
                  Publish
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-explorer-card border-explorer-chrome/30">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Workflow Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(workflows).map(([status, items]) => (
          <Card key={status} className="bg-explorer-card border-explorer-chrome/30">
            <CardContent className="p-6">
              <div className="flex items-center">
                {getStatusIcon(status)}
                <div className="ml-2">
                  <p className="text-sm font-medium text-explorer-text-muted capitalize">{status}</p>
                  <p className="text-2xl font-bold text-explorer-text">{items.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="review" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="draft">Draft ({workflows.draft?.length || 0})</TabsTrigger>
          <TabsTrigger value="review">Review ({workflows.review?.length || 0})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({workflows.approved?.length || 0})</TabsTrigger>
          <TabsTrigger value="published">Published ({workflows.published?.length || 0})</TabsTrigger>
        </TabsList>

        {Object.entries(workflows).map(([status, items]) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {items.length === 0 ? (
              <Card className="bg-explorer-card border-explorer-chrome/30">
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
                  <p className="text-explorer-text-muted">No configurations in {status} status</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((workflow) => (
                  <WorkflowCard key={workflow.id} workflow={workflow} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Status Update Dialog */}
      {selectedWorkflow && (
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Add notes about this status change..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-explorer-dark border-explorer-chrome/30"
            />
            <div className="flex space-x-2">
              <Button
                onClick={() => setSelectedWorkflow(null)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={() => selectedWorkflow && handleStatusUpdate(selectedWorkflow, 'review')}
                className="bg-accent-teal text-black hover:bg-accent-teal/80"
              >
                Update Status
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkflowManager;
