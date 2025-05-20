
import React, { useState, useEffect } from "react";
import { getAllStateRules } from "@/services/stateRulesService";
import { StateRule } from "@/types/state";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Pencil, Trash2, MoreVertical, Plus, Search, CheckCircle, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import StateRuleFormDialog from "@/admin/courses/StateRuleFormDialog";
import { supabase } from "@/integrations/supabase/client";

const AdminStateRules: React.FC = () => {
  const [stateRules, setStateRules] = useState<StateRule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStateRule, setSelectedStateRule] = useState<StateRule | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Load state rules
  useEffect(() => {
    loadStateRules();
  }, []);

  const loadStateRules = async () => {
    try {
      setLoading(true);
      const rules = await getAllStateRules();
      setStateRules(rules);
    } catch (error) {
      console.error("Error loading state rules:", error);
      toast.error("Failed to load state rules");
    } finally {
      setLoading(false);
    }
  };

  // Filter state rules by search query
  const filteredStateRules = stateRules.filter((rule) =>
    rule.state_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.state_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Delete a state rule
  const handleDelete = async (stateCode: string) => {
    try {
      const { error } = await supabase
        .from("state_rules")
        .delete()
        .eq("state_code", stateCode);

      if (error) throw error;
      
      setStateRules(stateRules.filter((rule) => rule.state_code !== stateCode));
      toast.success("State rule deleted successfully");
    } catch (error: any) {
      console.error("Error deleting state rule:", error);
      toast.error("Failed to delete state rule");
    }
  };

  // Open the edit dialog
  const handleEdit = (stateRule: StateRule) => {
    setSelectedStateRule(stateRule);
    setIsDialogOpen(true);
  };

  // Handle form success
  const handleFormSuccess = () => {
    loadStateRules();
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">State Rules</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage motorcycle licensing rules and regulations by state.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedStateRule(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add State Rule
            </Button>
          </DialogTrigger>
          <StateRuleFormDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            stateRule={selectedStateRule}
            onSuccess={handleFormSuccess}
          />
        </Dialog>
      </div>

      <div className="bg-card border rounded-md">
        <div className="p-4 flex justify-between items-center border-b">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search states..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>State Code</TableHead>
                <TableHead>State Name</TableHead>
                <TableHead>Min Age</TableHead>
                <TableHead>Helmet Required</TableHead>
                <TableHead>Road Test Required</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-5 w-8" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-8" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-8 float-right" />
                      </TableCell>
                    </TableRow>
                  ))
              ) : filteredStateRules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-muted-foreground">No state rules found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStateRules.map((stateRule) => (
                  <TableRow key={stateRule.state_code}>
                    <TableCell className="font-medium">{stateRule.state_code}</TableCell>
                    <TableCell>{stateRule.state_name}</TableCell>
                    <TableCell>{stateRule.permit_age_min || "N/A"}</TableCell>
                    <TableCell>
                      {stateRule.helmet_required ? (
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 flex items-center gap-1 w-fit">
                          <CheckCircle className="h-3 w-3" />
                          Yes
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          <XCircle className="h-3 w-3" />
                          No
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {stateRule.road_test_required ? (
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 flex items-center gap-1 w-fit">
                          <CheckCircle className="h-3 w-3" />
                          Yes
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          <XCircle className="h-3 w-3" />
                          No
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(stateRule)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete State Rule</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the rules for {stateRule.state_name}?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(stateRule.state_code)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminStateRules;
