
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Save, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { fetchSuspensions, createSuspension, updateSuspension, deleteSuspension } from "@/services/suspensionService";
import type { Suspension } from "@/services/suspensionService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SuspensionsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Suspension>>({});

  const { data: suspensions = [], isLoading } = useQuery({
    queryKey: ["suspensions"],
    queryFn: fetchSuspensions
  });

  const filteredSuspensions = suspensions.filter(suspension =>
    suspension.front_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    suspension.rear_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    suspension.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async () => {
    if (!formData.front_type && !formData.rear_type) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "At least front or rear type is required"
      });
      return;
    }

    try {
      await createSuspension(formData as Omit<Suspension, 'id' | 'created_at' | 'updated_at' | 'name'>);
      toast({
        title: "Success",
        description: "Suspension created successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["suspensions"] });
      setShowCreateForm(false);
      setFormData({});
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateSuspension(id, formData);
      toast({
        title: "Success",
        description: "Suspension updated successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["suspensions"] });
      setEditingId(null);
      setFormData({});
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this suspension?")) return;

    try {
      await deleteSuspension(id);
      toast({
        title: "Success",
        description: "Suspension deleted successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["suspensions"] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
  };

  const startEdit = (suspension: Suspension) => {
    setEditingId(suspension.id);
    setFormData(suspension);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading suspensions...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-explorer-text-muted h-4 w-4" />
              <Input
                placeholder="Search suspensions by type or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-explorer-dark border-explorer-chrome/30"
              />
            </div>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Suspension
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="bg-accent-teal/10 border-accent-teal/30">
          <CardHeader>
            <CardTitle className="text-explorer-text">Create New Suspension</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
                value={formData.front_type || ""}
                onValueChange={(value) => setFormData({ ...formData, front_type: value })}
              >
                <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                  <SelectValue placeholder="Front Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Telescopic">Telescopic</SelectItem>
                  <SelectItem value="USD Fork">USD Fork</SelectItem>
                  <SelectItem value="Leading Link">Leading Link</SelectItem>
                  <SelectItem value="Girder">Girder</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={formData.rear_type || ""}
                onValueChange={(value) => setFormData({ ...formData, rear_type: value })}
              >
                <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                  <SelectValue placeholder="Rear Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dual Shock">Dual Shock</SelectItem>
                  <SelectItem value="Monoshock">Monoshock</SelectItem>
                  <SelectItem value="Swing Arm">Swing Arm</SelectItem>
                  <SelectItem value="Cantilever">Cantilever</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Brand"
                value={formData.brand || ""}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Select
                value={formData.adjustability || ""}
                onValueChange={(value) => setFormData({ ...formData, adjustability: value })}
              >
                <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                  <SelectValue placeholder="Adjustability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Preload">Preload</SelectItem>
                  <SelectItem value="Compression">Compression</SelectItem>
                  <SelectItem value="Rebound">Rebound</SelectItem>
                  <SelectItem value="Full">Full</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Front Travel (mm)"
                value={formData.front_travel_mm || ""}
                onChange={(e) => setFormData({ ...formData, front_travel_mm: parseInt(e.target.value) || undefined })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Input
                type="number"
                placeholder="Rear Travel (mm)"
                value={formData.rear_travel_mm || ""}
                onChange={(e) => setFormData({ ...formData, rear_travel_mm: parseInt(e.target.value) || undefined })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Select
                value={formData.damping_system || ""}
                onValueChange={(value) => setFormData({ ...formData, damping_system: value })}
              >
                <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                  <SelectValue placeholder="Damping System" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cartridge">Cartridge</SelectItem>
                  <SelectItem value="Gas-Charged">Gas-Charged</SelectItem>
                  <SelectItem value="Oil">Oil</SelectItem>
                  <SelectItem value="Electronic">Electronic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Notes"
              value={formData.notes || ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-explorer-dark border-explorer-chrome/30"
            />
            <div className="flex gap-2">
              <Button onClick={handleCreate} className="bg-accent-teal text-black hover:bg-accent-teal/80">
                <Save className="h-4 w-4 mr-2" />
                Create Suspension
              </Button>
              <Button variant="outline" onClick={() => { setShowCreateForm(false); setFormData({}); }}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suspensions Table */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            Suspensions ({filteredSuspensions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Front Type</TableHead>
                  <TableHead>Rear Type</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Adjustability</TableHead>
                  <TableHead>Front Travel</TableHead>
                  <TableHead>Rear Travel</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuspensions.map((suspension) => (
                  <TableRow key={suspension.id}>
                    <TableCell>
                      {editingId === suspension.id ? (
                        <Select
                          value={formData.front_type || ""}
                          onValueChange={(value) => setFormData({ ...formData, front_type: value })}
                        >
                          <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Telescopic">Telescopic</SelectItem>
                            <SelectItem value="USD Fork">USD Fork</SelectItem>
                            <SelectItem value="Leading Link">Leading Link</SelectItem>
                            <SelectItem value="Girder">Girder</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        suspension.front_type || "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === suspension.id ? (
                        <Select
                          value={formData.rear_type || ""}
                          onValueChange={(value) => setFormData({ ...formData, rear_type: value })}
                        >
                          <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Dual Shock">Dual Shock</SelectItem>
                            <SelectItem value="Monoshock">Monoshock</SelectItem>
                            <SelectItem value="Swing Arm">Swing Arm</SelectItem>
                            <SelectItem value="Cantilever">Cantilever</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        suspension.rear_type || "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === suspension.id ? (
                        <Input
                          value={formData.brand || ""}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          className="bg-explorer-dark border-explorer-chrome/30"
                        />
                      ) : (
                        suspension.brand || "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === suspension.id ? (
                        <Select
                          value={formData.adjustability || ""}
                          onValueChange={(value) => setFormData({ ...formData, adjustability: value })}
                        >
                          <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="None">None</SelectItem>
                            <SelectItem value="Preload">Preload</SelectItem>
                            <SelectItem value="Compression">Compression</SelectItem>
                            <SelectItem value="Rebound">Rebound</SelectItem>
                            <SelectItem value="Full">Full</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        suspension.adjustability || "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === suspension.id ? (
                        <Input
                          type="number"
                          value={formData.front_travel_mm || ""}
                          onChange={(e) => setFormData({ ...formData, front_travel_mm: parseInt(e.target.value) || undefined })}
                          className="bg-explorer-dark border-explorer-chrome/30"
                        />
                      ) : (
                        suspension.front_travel_mm ? `${suspension.front_travel_mm}mm` : "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === suspension.id ? (
                        <Input
                          type="number"
                          value={formData.rear_travel_mm || ""}
                          onChange={(e) => setFormData({ ...formData, rear_travel_mm: parseInt(e.target.value) || undefined })}
                          className="bg-explorer-dark border-explorer-chrome/30"
                        />
                      ) : (
                        suspension.rear_travel_mm ? `${suspension.rear_travel_mm}mm` : "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === suspension.id ? (
                        <div className="flex gap-1">
                          <Button size="sm" onClick={() => handleUpdate(suspension.id)} className="bg-accent-teal text-black hover:bg-accent-teal/80">
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => startEdit(suspension)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(suspension.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredSuspensions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-explorer-text-muted">
                      {searchTerm ? "No suspensions match your search" : "No suspensions found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuspensionsManager;
