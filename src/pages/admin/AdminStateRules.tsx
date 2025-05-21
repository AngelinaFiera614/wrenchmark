
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { getAllStateRules, upsertStateRule } from '@/services/stateRulesService';
import { StateRule } from '@/types/state';
import { Loader2, Plus, Edit, ExternalLink } from "lucide-react";

const AdminStateRules = () => {
  const [stateRules, setStateRules] = useState<StateRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStateRule, setCurrentStateRule] = useState<Partial<StateRule>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all state rules
  const fetchStateRules = async () => {
    try {
      setIsLoading(true);
      const data = await getAllStateRules();
      setStateRules(data);
    } catch (error) {
      console.error('Error fetching state rules:', error);
      toast.error('Failed to load state rules');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchStateRules();
  }, []);

  // Open dialog for creating a new state rule
  const handleAddNew = () => {
    setCurrentStateRule({});
    setIsDialogOpen(true);
  };

  // Open dialog for editing an existing state rule
  const handleEdit = (stateRule: StateRule) => {
    setCurrentStateRule({ ...stateRule });
    setIsDialogOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentStateRule.state_code || !currentStateRule.state_name) {
      toast.error('State code and name are required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await upsertStateRule(currentStateRule);
      toast.success('State rule saved successfully');
      setIsDialogOpen(false);
      fetchStateRules();
    } catch (error) {
      console.error('Error saving state rule:', error);
      toast.error('Failed to save state rule');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">State Rules</h1>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New State Rule
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>State</TableHead>
                <TableHead>Permit Age</TableHead>
                <TableHead>Helmet Required</TableHead>
                <TableHead>Road Test</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stateRules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No state rules found. Add your first state rule to get started.
                  </TableCell>
                </TableRow>
              ) : (
                stateRules.map((rule) => (
                  <TableRow key={rule.state_code}>
                    <TableCell>
                      <div className="font-medium">{rule.state_name}</div>
                      <div className="text-xs text-muted-foreground">{rule.state_code}</div>
                    </TableCell>
                    <TableCell>{rule.permit_age_min ?? 'N/A'}</TableCell>
                    <TableCell>
                      {rule.helmet_required ? (
                        <Badge variant="default">Required</Badge>
                      ) : (
                        <Badge variant="outline">Optional</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {rule.road_test_required ? (
                        <Badge variant="default">Required</Badge>
                      ) : (
                        <Badge variant="outline">Optional</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {rule.link_to_dmv && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            asChild
                          >
                            <a 
                              href={rule.link_to_dmv} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              title="Visit official DMV website"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* State Rule Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentStateRule.state_code ? `Edit ${currentStateRule.state_name}` : 'Add New State Rule'}
            </DialogTitle>
            <DialogDescription>
              Enter the details for this state's motorcycle rules and requirements.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state_code">State Code</Label>
                <Input
                  id="state_code"
                  value={currentStateRule.state_code || ''}
                  onChange={(e) => setCurrentStateRule({...currentStateRule, state_code: e.target.value.toUpperCase()})}
                  placeholder="CA"
                  maxLength={2}
                  disabled={!!currentStateRule.state_code}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state_name">State Name</Label>
                <Input
                  id="state_name"
                  value={currentStateRule.state_name || ''}
                  onChange={(e) => setCurrentStateRule({...currentStateRule, state_name: e.target.value})}
                  placeholder="California"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="permit_age_min">Minimum Permit Age</Label>
                <Input
                  id="permit_age_min"
                  type="number"
                  min={0}
                  value={currentStateRule.permit_age_min || ''}
                  onChange={(e) => setCurrentStateRule({
                    ...currentStateRule, 
                    permit_age_min: e.target.value ? parseInt(e.target.value) : null
                  })}
                  placeholder="16"
                />
              </div>
              <div className="flex items-end space-x-2 pb-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="helmet_required" 
                    checked={currentStateRule.helmet_required || false}
                    onCheckedChange={(checked) => setCurrentStateRule({
                      ...currentStateRule,
                      helmet_required: checked === true
                    })}
                  />
                  <Label htmlFor="helmet_required">Helmet Required</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="road_test_required" 
                    checked={currentStateRule.road_test_required !== false}
                    onCheckedChange={(checked) => setCurrentStateRule({
                      ...currentStateRule,
                      road_test_required: checked === true
                    })}
                  />
                  <Label htmlFor="road_test_required">Road Test</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="special_rules">Special Rules</Label>
              <Textarea
                id="special_rules"
                value={currentStateRule.special_rules || ''}
                onChange={(e) => setCurrentStateRule({...currentStateRule, special_rules: e.target.value})}
                placeholder="Any special rules or requirements for this state..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="link_to_dmv">DMV Website URL</Label>
              <Input
                id="link_to_dmv"
                type="url"
                value={currentStateRule.link_to_dmv || ''}
                onChange={(e) => setCurrentStateRule({...currentStateRule, link_to_dmv: e.target.value})}
                placeholder="https://dmv.ca.gov/motorcycles"
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Rule'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStateRules;
