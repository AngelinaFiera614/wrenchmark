
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Save, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { fetchBrakes, createBrake, updateBrake, deleteBrake } from "@/services/brakeService";
import type { BrakeSystem } from "@/services/brakeService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const BrakesManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<Partial<BrakeSystem>>({});

  const { data: brakes = [], isLoading } = useQuery({
    queryKey: ["brakes"],
    queryFn: fetchBrakes
  });

  const filteredBrakes = brakes.filter(brake =>
    brake.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brake.brake_brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brake.caliper_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async () => {
    if (!formData.type) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Brake type is required"
      });
      return;
    }

    try {
      await createBrake(formData as Omit<BrakeSystem, 'id' | 'created_at' | 'updated_at' | 'name'>);
      toast({
        title: "Success",
        description: "Brake system created successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["brakes"] });
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
      await updateBrake(id, formData);
      toast({
        title: "Success",
        description: "Brake system updated successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["brakes"] });
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
    if (!confirm("Are you sure you want to delete this brake system?")) return;

    try {
      await deleteBrake(id);
      toast({
        title: "Success",
        description: "Brake system deleted successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["brakes"] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
  };

  const startEdit = (brake: BrakeSystem) => {
    setEditingId(brake.id);
    setFormData(brake);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading brake systems...</div>;
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
                placeholder="Search brake systems by type, brand, or caliper..."
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
              Add Brake System
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="bg-accent-teal/10 border-accent-teal/30">
          <CardHeader>
            <CardTitle className="text-explorer-text">Create New Brake System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder="System Type*"
                value={formData.type || ""}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Input
                placeholder="Brand"
                value={formData.brake_brand || ""}
                onChange={(e) => setFormData({ ...formData, brake_brand: e.target.value })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Select
                value={formData.front_type || ""}
                onValueChange={(value) => setFormData({ ...formData, front_type: value })}
              >
                <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                  <SelectValue placeholder="Front Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disc">Disc</SelectItem>
                  <SelectItem value="Dual Disc">Dual Disc</SelectItem>
                  <SelectItem value="Drum">Drum</SelectItem>
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
                  <SelectItem value="Disc">Disc</SelectItem>
                  <SelectItem value="Drum">Drum</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Front Disc Size"
                value={formData.front_disc_size_mm || ""}
                onChange={(e) => setFormData({ ...formData, front_disc_size_mm: e.target.value })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Input
                placeholder="Rear Disc Size"
                value={formData.rear_disc_size_mm || ""}
                onChange={(e) => setFormData({ ...formData, rear_disc_size_mm: e.target.value })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Input
                placeholder="Caliper Type"
                value={formData.caliper_type || ""}
                onChange={(e) => setFormData({ ...formData, caliper_type: e.target.value })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.has_traction_control || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, has_traction_control: checked })}
                />
                <label className="text-sm text-explorer-text">Traction Control</label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.has_abs || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, has_abs: checked })}
                />
                <label className="text-sm text-explorer-text">ABS</label>
              </div>
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
                Create Brake System
              </Button>
              <Button variant="outline" onClick={() => { setShowCreateForm(false); setFormData({}); }}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Brake Systems Table */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            Brake Systems ({filteredBrakes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Front</TableHead>
                  <TableHead>Rear</TableHead>
                  <TableHead>Caliper</TableHead>
                  <TableHead>TC</TableHead>
                  <TableHead>ABS</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrakes.map((brake) => (
                  <TableRow key={brake.id}>
                    <TableCell>
                      {editingId === brake.id ? (
                        <Input
                          value={formData.type || ""}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          className="bg-explorer-dark border-explorer-chrome/30"
                        />
                      ) : (
                        brake.type || "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === brake.id ? (
                        <Input
                          value={formData.brake_brand || ""}
                          onChange={(e) => setFormData({ ...formData, brake_brand: e.target.value })}
                          className="bg-explorer-dark border-explorer-chrome/30"
                        />
                      ) : (
                        brake.brake_brand || "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === brake.id ? (
                        <Select
                          value={formData.front_type || ""}
                          onValueChange={(value) => setFormData({ ...formData, front_type: value })}
                        >
                          <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Disc">Disc</SelectItem>
                            <SelectItem value="Dual Disc">Dual Disc</SelectItem>
                            <SelectItem value="Drum">Drum</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        brake.front_type || "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === brake.id ? (
                        <Select
                          value={formData.rear_type || ""}
                          onValueChange={(value) => setFormData({ ...formData, rear_type: value })}
                        >
                          <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Disc">Disc</SelectItem>
                            <SelectItem value="Drum">Drum</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        brake.rear_type || "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === brake.id ? (
                        <Input
                          value={formData.caliper_type || ""}
                          onChange={(e) => setFormData({ ...formData, caliper_type: e.target.value })}
                          className="bg-explorer-dark border-explorer-chrome/30"
                        />
                      ) : (
                        brake.caliper_type || "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === brake.id ? (
                        <Switch
                          checked={formData.has_traction_control || false}
                          onCheckedChange={(checked) => setFormData({ ...formData, has_traction_control: checked })}
                        />
                      ) : (
                        brake.has_traction_control ? "Yes" : "No"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === brake.id ? (
                        <Switch
                          checked={formData.has_abs || false}
                          onCheckedChange={(checked) => setFormData({ ...formData, has_abs: checked })}
                        />
                      ) : (
                        brake.has_abs ? "Yes" : "No"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === brake.id ? (
                        <div className="flex gap-1">
                          <Button size="sm" onClick={() => handleUpdate(brake.id)} className="bg-accent-teal text-black hover:bg-accent-teal/80">
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => startEdit(brake)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(brake.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredBrakes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-explorer-text-muted">
                      {searchTerm ? "No brake systems match your search" : "No brake systems found"}
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

export default BrakesManager;
