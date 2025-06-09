
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Save, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { fetchWheels, createWheel, updateWheel, deleteWheel } from "@/services/wheelService";
import type { Wheel } from "@/services/wheelService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

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
        description: "At least type or wheel sizes are required"
      });
      return;
    }

    try {
      await createWheel(formData as Omit<Wheel, 'id' | 'created_at' | 'updated_at' | 'name'>);
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
                value={formData.type || ""}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                  <SelectValue placeholder="Wheel Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cast">Cast</SelectItem>
                  <SelectItem value="Spoke">Spoke</SelectItem>
                  <SelectItem value="Carbon">Carbon</SelectItem>
                  <SelectItem value="Alloy">Alloy</SelectItem>
                  <SelectItem value="Wire">Wire</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder='Front Size (e.g., 17")'
                value={formData.front_size || ""}
                onChange={(e) => setFormData({ ...formData, front_size: e.target.value })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Input
                placeholder='Rear Size (e.g., 17")'
                value={formData.rear_size || ""}
                onChange={(e) => setFormData({ ...formData, rear_size: e.target.value })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Input
                placeholder="Front Tire (e.g., 110/90-17)"
                value={formData.front_tire_size || ""}
                onChange={(e) => setFormData({ ...formData, front_tire_size: e.target.value })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Input
                placeholder="Rear Tire (e.g., 150/70-17)"
                value={formData.rear_tire_size || ""}
                onChange={(e) => setFormData({ ...formData, rear_tire_size: e.target.value })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Select
                value={formData.rim_material || ""}
                onValueChange={(value) => setFormData({ ...formData, rim_material: value })}
              >
                <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                  <SelectValue placeholder="Rim Material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Steel">Steel</SelectItem>
                  <SelectItem value="Aluminum">Aluminum</SelectItem>
                  <SelectItem value="Carbon Fiber">Carbon Fiber</SelectItem>
                  <SelectItem value="Magnesium">Magnesium</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.tubeless || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, tubeless: checked })}
                />
                <label className="text-sm text-explorer-text">Tubeless</label>
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Front Size</TableHead>
                  <TableHead>Rear Size</TableHead>
                  <TableHead>Front Tire</TableHead>
                  <TableHead>Rear Tire</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Tubeless</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWheels.map((wheel) => (
                  <TableRow key={wheel.id}>
                    <TableCell>
                      {editingId === wheel.id ? (
                        <Select
                          value={formData.type || ""}
                          onValueChange={(value) => setFormData({ ...formData, type: value })}
                        >
                          <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cast">Cast</SelectItem>
                            <SelectItem value="Spoke">Spoke</SelectItem>
                            <SelectItem value="Carbon">Carbon</SelectItem>
                            <SelectItem value="Alloy">Alloy</SelectItem>
                            <SelectItem value="Wire">Wire</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <Select
                          value={formData.rim_material || ""}
                          onValueChange={(value) => setFormData({ ...formData, rim_material: value })}
                        >
                          <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Steel">Steel</SelectItem>
                            <SelectItem value="Aluminum">Aluminum</SelectItem>
                            <SelectItem value="Carbon Fiber">Carbon Fiber</SelectItem>
                            <SelectItem value="Magnesium">Magnesium</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        wheel.rim_material || "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === wheel.id ? (
                        <Switch
                          checked={formData.tubeless || false}
                          onCheckedChange={(checked) => setFormData({ ...formData, tubeless: checked })}
                        />
                      ) : (
                        wheel.tubeless ? "Yes" : "No"
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
                    <TableCell colSpan={8} className="text-center py-8 text-explorer-text-muted">
                      {searchTerm ? "No wheels match your search" : "No wheels found"}
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

export default WheelsManager;
