
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Save, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { fetchFrames, createFrame, updateFrame, deleteFrame } from "@/services/frameService";
import type { Frame } from "@/services/frameService";

const FramesManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Frame>>({});

  const { data: frames = [], isLoading } = useQuery({
    queryKey: ["frames"],
    queryFn: fetchFrames
  });

  const filteredFrames = frames.filter(frame =>
    frame.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    frame.material?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async () => {
    if (!formData.type) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Frame type is required"
      });
      return;
    }

    try {
      await createFrame(formData as Omit<Frame, 'id' | 'created_at' | 'updated_at' | 'name'>);
      toast({
        title: "Success",
        description: "Frame created successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["frames"] });
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
      await updateFrame(id, formData);
      toast({
        title: "Success",
        description: "Frame updated successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["frames"] });
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
    if (!confirm("Are you sure you want to delete this frame?")) return;

    try {
      await deleteFrame(id);
      toast({
        title: "Success",
        description: "Frame deleted successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["frames"] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
  };

  const startEdit = (frame: Frame) => {
    setEditingId(frame.id);
    setFormData(frame);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading frames...</div>;
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
                placeholder="Search frames by type or material..."
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
              Add Frame
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="bg-accent-teal/10 border-accent-teal/30">
          <CardHeader>
            <CardTitle className="text-explorer-text">Create New Frame</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                placeholder="Frame Type"
                value={formData.type || ""}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Input
                placeholder="Material"
                value={formData.material || ""}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Input
                placeholder="Construction Method"
                value={formData.construction_method || ""}
                onChange={(e) => setFormData({ ...formData, construction_method: e.target.value })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Input
                type="number"
                placeholder="Rake (degrees)"
                value={formData.rake_degrees || ""}
                onChange={(e) => setFormData({ ...formData, rake_degrees: parseFloat(e.target.value) || undefined })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Input
                type="number"
                placeholder="Trail (mm)"
                value={formData.trail_mm || ""}
                onChange={(e) => setFormData({ ...formData, trail_mm: parseFloat(e.target.value) || undefined })}
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
                Create Frame
              </Button>
              <Button variant="outline" onClick={() => { setShowCreateForm(false); setFormData({}); }}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Frames Table */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            Frames ({filteredFrames.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Construction</TableHead>
                <TableHead>Rake</TableHead>
                <TableHead>Trail</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFrames.map((frame) => (
                <TableRow key={frame.id}>
                  <TableCell>
                    {editingId === frame.id ? (
                      <Input
                        value={formData.type || ""}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="bg-explorer-dark border-explorer-chrome/30"
                      />
                    ) : (
                      frame.type
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === frame.id ? (
                      <Input
                        value={formData.material || ""}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                        className="bg-explorer-dark border-explorer-chrome/30"
                      />
                    ) : (
                      frame.material || "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === frame.id ? (
                      <Input
                        value={formData.construction_method || ""}
                        onChange={(e) => setFormData({ ...formData, construction_method: e.target.value })}
                        className="bg-explorer-dark border-explorer-chrome/30"
                      />
                    ) : (
                      frame.construction_method || "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === frame.id ? (
                      <Input
                        type="number"
                        value={formData.rake_degrees || ""}
                        onChange={(e) => setFormData({ ...formData, rake_degrees: parseFloat(e.target.value) || undefined })}
                        className="bg-explorer-dark border-explorer-chrome/30"
                      />
                    ) : (
                      frame.rake_degrees ? `${frame.rake_degrees}°` : "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === frame.id ? (
                      <Input
                        type="number"
                        value={formData.trail_mm || ""}
                        onChange={(e) => setFormData({ ...formData, trail_mm: parseFloat(e.target.value) || undefined })}
                        className="bg-explorer-dark border-explorer-chrome/30"
                      />
                    ) : (
                      frame.trail_mm ? `${frame.trail_mm}mm` : "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === frame.id ? (
                      <Input
                        value={formData.notes || ""}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="bg-explorer-dark border-explorer-chrome/30"
                      />
                    ) : (
                      <div className="max-w-32 truncate" title={frame.notes || ""}>
                        {frame.notes || "-"}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === frame.id ? (
                      <div className="flex gap-1">
                        <Button size="sm" onClick={() => handleUpdate(frame.id)} className="bg-accent-teal text-black hover:bg-accent-teal/80">
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => startEdit(frame)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(frame.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredFrames.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-explorer-text-muted">
                    {searchTerm ? "No frames match your search" : "No frames found"}
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

export default FramesManager;
