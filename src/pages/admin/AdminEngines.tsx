
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminEngineDialog from "@/components/admin/components/AdminEngineDialog";

const AdminEngines = () => {
  const { toast } = useToast();
  const [isCreateEngineOpen, setIsCreateEngineOpen] = useState(false);
  const [editEngine, setEditEngine] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch engines
  const { data: engines, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-engines"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('engines')
        .select('*')
        .order('displacement_cc', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const handleCreateEngine = () => {
    setEditEngine(null);
    setIsCreateEngineOpen(true);
  };

  const handleEditEngine = (engine) => {
    setEditEngine(engine);
    setIsCreateEngineOpen(true);
  };

  const handleDeleteEngine = async (engine) => {
    if (!confirm(`Are you sure you want to delete the ${engine.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('engines')
        .delete()
        .eq('id', engine.id);

      if (error) throw error;

      toast({
        title: "Engine deleted",
        description: `${engine.name} has been removed.`,
      });

      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete engine. Please try again.",
      });
    }
  };

  const handleDialogClose = (refreshData = false) => {
    setIsCreateEngineOpen(false);
    setEditEngine(null);
    if (refreshData) {
      refetch();
    }
  };

  // Filter engines based on search
  const filteredEngines = engines?.filter(engine => {
    const matchesSearch = !searchTerm || 
      engine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engine.engine_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engine.displacement_cc.toString().includes(searchTerm);

    return matchesSearch;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-teal"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-explorer-text">Engines</h1>
          <p className="text-explorer-text-muted mt-1">
            Manage the engine component library for motorcycle configurations.
          </p>
        </div>
        <Button 
          onClick={handleCreateEngine}
          className="bg-accent-teal text-black hover:bg-accent-teal/80"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Engine
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-explorer-text">Total Engines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-explorer-text">{engines?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-explorer-text">Engine Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-teal">
              {new Set(engines?.map(e => e.engine_type).filter(Boolean)).size || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-explorer-text">Avg Displacement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-explorer-text">
              {engines?.length ? Math.round(engines.reduce((sum, e) => sum + e.displacement_cc, 0) / engines.length) : 0}cc
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-explorer-text">Max Power</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {engines?.length ? Math.max(...engines.map(e => e.power_hp || 0)) : 0}hp
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-explorer-text-muted h-4 w-4" />
            <Input
              placeholder="Search engines by name, type, or displacement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          </div>
        </CardContent>
      </Card>

      {/* Engines Table */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">
            Engines ({filteredEngines.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEngines.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-explorer-chrome/20">
                  <TableHead className="text-explorer-text">Name</TableHead>
                  <TableHead className="text-explorer-text">Displacement</TableHead>
                  <TableHead className="text-explorer-text">Power</TableHead>
                  <TableHead className="text-explorer-text">Torque</TableHead>
                  <TableHead className="text-explorer-text">Type</TableHead>
                  <TableHead className="text-explorer-text">Cylinders</TableHead>
                  <TableHead className="text-explorer-text">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEngines.map((engine) => (
                  <TableRow key={engine.id} className="border-explorer-chrome/20">
                    <TableCell>
                      <div className="font-medium text-explorer-text">{engine.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-accent-teal/20 text-accent-teal border-accent-teal/30">
                        {engine.displacement_cc}cc
                      </Badge>
                    </TableCell>
                    <TableCell className="text-explorer-text">
                      {engine.power_hp ? `${engine.power_hp}hp` : '-'}
                      {engine.power_rpm && (
                        <div className="text-xs text-explorer-text-muted">@ {engine.power_rpm}rpm</div>
                      )}
                    </TableCell>
                    <TableCell className="text-explorer-text">
                      {engine.torque_nm ? `${engine.torque_nm}Nm` : '-'}
                      {engine.torque_rpm && (
                        <div className="text-xs text-explorer-text-muted">@ {engine.torque_rpm}rpm</div>
                      )}
                    </TableCell>
                    <TableCell className="text-explorer-text">{engine.engine_type || '-'}</TableCell>
                    <TableCell className="text-explorer-text">{engine.cylinder_count || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditEngine(engine)}
                          className="h-8 px-2 text-xs"
                        >
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEngine(engine)}
                          className="h-8 px-2 text-xs text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <div className="text-explorer-text-muted">
                {searchTerm 
                  ? "No engines match your search." 
                  : "No engines found. Start by adding your first engine."
                }
              </div>
              {!searchTerm && (
                <Button 
                  variant="outline" 
                  onClick={handleCreateEngine}
                  className="mt-4"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Engine
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <AdminEngineDialog 
        open={isCreateEngineOpen}
        engine={editEngine}
        onClose={handleDialogClose}
      />
    </div>
  );
};

export default AdminEngines;
