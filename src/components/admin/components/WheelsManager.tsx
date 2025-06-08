
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Save, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { fetchWheels, createWheel, updateWheel, deleteWheel } from "@/services/wheelService";

interface Wheel {
  id: string;
  type?: string;
  front_size?: string;
  rear_size?: string;
  front_tire_size?: string;
  rear_tire_size?: string;
  rim_material?: string;
  spoke_count_front?: number;
  spoke_count_rear?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

const WheelsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Wheel>>({});

  const { data: wheels = [], isLoading } = useQuery({
    queryKey: ["wheels"],
    queryFn: fetchWheels
  });

  const filteredWheels = wheels.filter(wheel =>
    wheel.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wheel.front_size?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wheel.rear_size?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wheel.rim_material?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async () => {
    if (!formData.type && !formData.front_size && !formData.rear_size) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "At least wheel type or size information is required"
      });
      return;
    }

    try {
      await createWheel(formData as Omit<Wheel, 'id' | 'created_at' | 'updated_at'>);
      toast({
        title: "Success",
        description: "Wheel created successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["wheels"] });
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
      await updateWheel(id, formData);
      toast({
        title: "Success",
        description: "Wheel updated successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["wheels"] });
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
    if (!confirm("Are you sure you want to delete this wheel?")) return;

    try {
      await deleteWheel(id);
      toast({
        title: "Success",
        description: "Wheel deleted successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["wheels"] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
  };

  const startEdit = (wheel: Wheel) => {
    setEditingId(wheel.id);
    setFormData(wheel);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading wheels...</div>;
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
                placeholder="Search wheels by type, size, or material..."
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
              Add Wheel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="bg-accent-teal/10 border-accent-teal/30">
          <CardHeader>
            <CardTitle className="text-explorer-text">Create New Wheel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                placeholder="Wheel Type"
                value={formData.type || ""}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Input
                placeholder="Front Size"
                value={formData.front_size || ""}
                onChange={(e) => setFormData({ ...formData, front_size: e.target.value })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Input
                placeholder="Rear Size"
                value={formData.rear_size || ""}
                onChange={(e) => setFormData({ ...formData, rear_size: e.target.value })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Input
                placeholder="Front Tire Size"
                value={formData.front_tire_size || ""}
                onChange={(e) => setFormData({ ...formData, front_tire_size: e.target.value })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Input
                placeholder="Rear Tire Size"
                value={formData.rear_tire_size || ""}
                onChange={(e) => setFormData({ ...formData, rear_tire_size: e.target.value })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Input
                placeholder="Rim Material"
                value={formData.rim_material || ""}
                onChange={(e) => setFormData({ ...formData, rim_material: e.target.value })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Input
                type="number"
                placeholder="Front Spoke Count"
                value={formData.spoke_count_front || ""}
                onChange={(e) => setFormData({ ...formData, spoke_count_front: parseInt(e.target.value) || undefined })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Input
                type="number"
                placeholder="Rear Spoke Count"
                value={formData.spoke_count_rear || ""}
                onChange={(e) => setFormData({ ...formData, spoke_count_rear: parseInt(e.target.value) || undefined })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
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
                Create Wheel
              </Button>
              <Button variant="outline" onClick={() => { setShowCreateForm(false); setFormData({}); }}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wheels Table */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            Wheels ({filteredWheels.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Front Size</TableHead>
                <TableHead>Rear Size</TableHead>
                <TableHead>Front Tire</TableHead>
                <TableHead>Rear Tire</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Front Spokes</TableHead>
                <TableHead>Rear Spokes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWheels.map((wheel) => (
                <TableRow key={wheel.id}>
                  <TableCell>
                    {editingId === wheel.id ? (
                      <Input
                        value={formData.type || ""}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="bg-explorer-dark border-explorer-chrome/30"
                      />
                    ) : (
                      wheel.type || "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === wheel.id ? (
                      <Input
                        value={formData.front_size || ""}
                        onChange={(e) => setFormData({ ...formData, front_size: e.target.value })}
                        className="bg-explorer-dark border-explorer-chrome/30"
                      />
                    ) : (
                      wheel.front_size || "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === wheel.id ? (
                      <Input
                        value={formData.rear_size || ""}
                        onChange={(e) => setFormData({ ...formData, rear_size: e.target.value })}
                        className="bg-explorer-dark border-explorer-chrome/30"
                      />
                    ) : (
                      wheel.rear_size || "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === wheel.id ? (
                      <Input
                        value={formData.front_tire_size || ""}
                        onChange={(e) => setFormData({ ...formData, front_tire_size: e.target.value })}
                        className="bg-explorer-dark border-explorer-chrome/30"
                      />
                    ) : (
                      wheel.front_tire_size || "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === wheel.id ? (
                      <Input
                        value={formData.rear_tire_size || ""}
                        onChange={(e) => setFormData({ ...formData, rear_tire_size: e.target.value })}
                        className="bg-explorer-dark border-explorer-chrome/30"
                      />
                    ) : (
                      wheel.rear_tire_size || "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === wheel.id ? (
                      <Input
                        value={formData.rim_material || ""}
                        onChange={(e) => setFormData({ ...formData, rim_material: e.target.value })}
                        className="bg-explorer-dark border-explorer-chrome/30"
                      />
                    ) : (
                      wheel.rim_material || "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === wheel.id ? (
                      <Input
                        type="number"
                        value={formData.spoke_count_front || ""}
                        onChange={(e) => setFormData({ ...formData, spoke_count_front: parseInt(e.target.value) || undefined })}
                        className="bg-explorer-dark border-explorer-chrome/30"
                      />
                    ) : (
                      wheel.spoke_count_front || "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === wheel.id ? (
                      <Input
                        type="number"
                        value={formData.spoke_count_rear || ""}
                        onChange={(e) => setFormData({ ...formData, spoke_count_rear: parseInt(e.target.value) || undefined })}
                        className="bg-explorer-dark border-explorer-chrome/30"
                      />
                    ) : (
                      wheel.spoke_count_rear || "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === wheel.id ? (
                      <div className="flex gap-1">
                        <Button size="sm" onClick={() => handleUpdate(wheel.id)} className="bg-accent-teal text-black hover:bg-accent-teal/80">
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => startEdit(wheel)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(wheel.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredWheels.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-explorer-text-muted">
                    {searchTerm ? "No wheels match your search" : "No wheels found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WheelsManager;
