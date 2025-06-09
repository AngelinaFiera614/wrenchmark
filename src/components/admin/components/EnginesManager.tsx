
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Save, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { fetchEngines, createEngine, updateEngine, deleteEngine } from "@/services/engineService";
import type { Engine } from "@/services/engineService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EnginesManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Engine>>({});

  const { data: engines = [], isLoading } = useQuery({
    queryKey: ["engines"],
    queryFn: fetchEngines
  });

  const filteredEngines = engines.filter(engine =>
    engine.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    engine.engine_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    engine.engine_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async () => {
    if (!formData.name || !formData.displacement_cc) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Name and displacement are required"
      });
      return;
    }

    try {
      await createEngine(formData as Omit<Engine, 'id' | 'created_at' | 'updated_at'>);
      toast({
        title: "Success",
        description: "Engine created successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["engines"] });
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
      await updateEngine(id, formData);
      toast({
        title: "Success",
        description: "Engine updated successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["engines"] });
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
    if (!confirm("Are you sure you want to delete this engine?")) return;

    try {
      await deleteEngine(id);
      toast({
        title: "Success",
        description: "Engine deleted successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["engines"] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
  };

  const startEdit = (engine: Engine) => {
    setEditingId(engine.id);
    setFormData(engine);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading engines...</div>;
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
                placeholder="Search engines by name, type, or code..."
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
              Add Engine
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="bg-accent-teal/10 border-accent-teal/30">
          <CardHeader>
            <CardTitle className="text-explorer-text">Create New Engine</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder="Engine Name*"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Input
                type="number"
                placeholder="Displacement (cc)*"
                value={formData.displacement_cc || ""}
                onChange={(e) => setFormData({ ...formData, displacement_cc: parseInt(e.target.value) || undefined })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Select
                value={formData.engine_type || ""}
                onValueChange={(value) => setFormData({ ...formData, engine_type: value })}
              >
                <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                  <SelectValue placeholder="Engine Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Parallel Twin">Parallel Twin</SelectItem>
                  <SelectItem value="V-Twin">V-Twin</SelectItem>
                  <SelectItem value="Inline-3">Inline-3</SelectItem>
                  <SelectItem value="Inline-4">Inline-4</SelectItem>
                  <SelectItem value="V4">V4</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Power (hp)"
                value={formData.power_hp || ""}
                onChange={(e) => setFormData({ ...formData, power_hp: parseFloat(e.target.value) || undefined })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Input
                type="number"
                placeholder="Torque (Nm)"
                value={formData.torque_nm || ""}
                onChange={(e) => setFormData({ ...formData, torque_nm: parseFloat(e.target.value) || undefined })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Select
                value={formData.cooling || ""}
                onValueChange={(value) => setFormData({ ...formData, cooling: value })}
              >
                <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                  <SelectValue placeholder="Cooling" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Air">Air</SelectItem>
                  <SelectItem value="Liquid">Liquid</SelectItem>
                  <SelectItem value="Oil">Oil</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Cylinders"
                value={formData.cylinder_count || ""}
                onChange={(e) => setFormData({ ...formData, cylinder_count: parseInt(e.target.value) || undefined })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Select
                value={formData.valve_train || ""}
                onValueChange={(value) => setFormData({ ...formData, valve_train: value })}
              >
                <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                  <SelectValue placeholder="Valve Train" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOHC">SOHC</SelectItem>
                  <SelectItem value="DOHC">DOHC</SelectItem>
                  <SelectItem value="Pushrod">Pushrod</SelectItem>
                  <SelectItem value="OHV">OHV</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={formData.stroke_type || ""}
                onValueChange={(value) => setFormData({ ...formData, stroke_type: value })}
              >
                <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                  <SelectValue placeholder="Stroke Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2-stroke">2-stroke</SelectItem>
                  <SelectItem value="4-stroke">4-stroke</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Bore (mm)"
                value={formData.bore_mm || ""}
                onChange={(e) => setFormData({ ...formData, bore_mm: parseFloat(e.target.value) || undefined })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Input
                type="number"
                placeholder="Stroke (mm)"
                value={formData.stroke_mm || ""}
                onChange={(e) => setFormData({ ...formData, stroke_mm: parseFloat(e.target.value) || undefined })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Input
                placeholder="Compression Ratio"
                value={formData.compression_ratio || ""}
                onChange={(e) => setFormData({ ...formData, compression_ratio: e.target.value })}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
              <Select
                value={formData.fuel_system || ""}
                onValueChange={(value) => setFormData({ ...formData, fuel_system: value })}
              >
                <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                  <SelectValue placeholder="Fuel System" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Carburetor">Carburetor</SelectItem>
                  <SelectItem value="EFI">EFI</SelectItem>
                  <SelectItem value="TBI">TBI</SelectItem>
                  <SelectItem value="Direct Injection">Direct Injection</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={formData.ignition || ""}
                onValueChange={(value) => setFormData({ ...formData, ignition: value })}
              >
                <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                  <SelectValue placeholder="Ignition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CDI">CDI</SelectItem>
                  <SelectItem value="Digital">Digital</SelectItem>
                  <SelectItem value="Magneto">Magneto</SelectItem>
                  <SelectItem value="TCI">TCI</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={formData.starter || ""}
                onValueChange={(value) => setFormData({ ...formData, starter: value })}
              >
                <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                  <SelectValue placeholder="Starter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electric">Electric</SelectItem>
                  <SelectItem value="Kick">Kick</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Engine Code"
                value={formData.engine_code || ""}
                onChange={(e) => setFormData({ ...formData, engine_code: e.target.value })}
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
                Create Engine
              </Button>
              <Button variant="outline" onClick={() => { setShowCreateForm(false); setFormData({}); }}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Engines Table */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            Engines ({filteredEngines.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Displacement</TableHead>
                  <TableHead>Power</TableHead>
                  <TableHead>Torque</TableHead>
                  <TableHead>Cooling</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEngines.map((engine) => (
                  <TableRow key={engine.id}>
                    <TableCell>
                      {editingId === engine.id ? (
                        <Input
                          value={formData.name || ""}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-explorer-dark border-explorer-chrome/30"
                        />
                      ) : (
                        engine.name || "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === engine.id ? (
                        <Select
                          value={formData.engine_type || ""}
                          onValueChange={(value) => setFormData({ ...formData, engine_type: value })}
                        >
                          <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Single">Single</SelectItem>
                            <SelectItem value="Parallel Twin">Parallel Twin</SelectItem>
                            <SelectItem value="V-Twin">V-Twin</SelectItem>
                            <SelectItem value="Inline-3">Inline-3</SelectItem>
                            <SelectItem value="Inline-4">Inline-4</SelectItem>
                            <SelectItem value="V4">V4</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        engine.engine_type || "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === engine.id ? (
                        <Input
                          type="number"
                          value={formData.displacement_cc || ""}
                          onChange={(e) => setFormData({ ...formData, displacement_cc: parseInt(e.target.value) || undefined })}
                          className="bg-explorer-dark border-explorer-chrome/30"
                        />
                      ) : (
                        engine.displacement_cc ? `${engine.displacement_cc}cc` : "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === engine.id ? (
                        <Input
                          type="number"
                          value={formData.power_hp || ""}
                          onChange={(e) => setFormData({ ...formData, power_hp: parseFloat(e.target.value) || undefined })}
                          className="bg-explorer-dark border-explorer-chrome/30"
                        />
                      ) : (
                        engine.power_hp ? `${engine.power_hp}hp` : "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === engine.id ? (
                        <Input
                          type="number"
                          value={formData.torque_nm || ""}
                          onChange={(e) => setFormData({ ...formData, torque_nm: parseFloat(e.target.value) || undefined })}
                          className="bg-explorer-dark border-explorer-chrome/30"
                        />
                      ) : (
                        engine.torque_nm ? `${engine.torque_nm}Nm` : "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === engine.id ? (
                        <Select
                          value={formData.cooling || ""}
                          onValueChange={(value) => setFormData({ ...formData, cooling: value })}
                        >
                          <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Air">Air</SelectItem>
                            <SelectItem value="Liquid">Liquid</SelectItem>
                            <SelectItem value="Oil">Oil</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        engine.cooling || "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === engine.id ? (
                        <Input
                          value={formData.engine_code || ""}
                          onChange={(e) => setFormData({ ...formData, engine_code: e.target.value })}
                          className="bg-explorer-dark border-explorer-chrome/30"
                        />
                      ) : (
                        engine.engine_code || "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === engine.id ? (
                        <div className="flex gap-1">
                          <Button size="sm" onClick={() => handleUpdate(engine.id)} className="bg-accent-teal text-black hover:bg-accent-teal/80">
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => startEdit(engine)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(engine.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredEngines.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-explorer-text-muted">
                      {searchTerm ? "No engines match your search" : "No engines found"}
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

export default EnginesManager;
