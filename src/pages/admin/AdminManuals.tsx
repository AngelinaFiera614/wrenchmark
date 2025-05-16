
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Manual } from "@/types";
import AdminManualDialog from "@/components/admin/manuals/AdminManualDialog";
import { supabase } from "@/integrations/supabase/client";
import { deleteManual } from "@/services/manualService";

interface MotorcycleInfo {
  make: string;
  model: string;
  year: number | null;
}

interface ManualWithMotorcycle extends Manual {
  motorcycles?: MotorcycleInfo;
}

const AdminManuals = () => {
  const [manuals, setManuals] = useState<ManualWithMotorcycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedManual, setSelectedManual] = useState<ManualWithMotorcycle | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchManuals = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('manuals')
        .select('*, motorcycles(make, model, year)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedData = data?.map(item => ({
        ...item,
        manual_type: item.manual_type as Manual['manual_type'],
        motorcycles: item.motorcycles as MotorcycleInfo
      })) || [];
      
      setManuals(formattedData);
    } catch (error) {
      console.error("Error fetching manuals:", error);
      toast({
        title: "Error",
        description: "Failed to load manuals",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchManuals();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteManual(id);
      toast({
        title: "Success",
        description: "Manual successfully deleted",
      });
      fetchManuals();
    } catch (error) {
      console.error("Error deleting manual:", error);
      toast({
        title: "Error",
        description: "Failed to delete manual",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (manual: ManualWithMotorcycle) => {
    setSelectedManual(manual);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (refreshNeeded: boolean) => {
    setIsDialogOpen(false);
    setSelectedManual(null);
    if (refreshNeeded) {
      fetchManuals();
    }
  };

  // Format file size
  const formatFileSize = (size: number | null) => {
    if (!size) return "Unknown";
    return `${size.toFixed(2)} MB`;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manuals</h1>
        <Button 
          onClick={() => setIsDialogOpen(true)} 
          className="bg-accent-teal hover:bg-accent-teal/90"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Manual
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
        </div>
      ) : manuals.length > 0 ? (
        <div className="bg-muted/20 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Motorcycle</th>
                  <th className="p-3">Year</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Downloads</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/20">
                {manuals.map((manual) => (
                  <tr key={manual.id} className="hover:bg-muted/10">
                    <td className="p-3">{manual.title}</td>
                    <td className="p-3 capitalize">{manual.manual_type}</td>
                    <td className="p-3">
                      {manual.motorcycles ? 
                        `${manual.motorcycles.make} ${manual.motorcycles.model}` : 
                        "Unknown"}
                    </td>
                    <td className="p-3">{manual.year || "Any"}</td>
                    <td className="p-3">{formatFileSize(manual.file_size_mb)}</td>
                    <td className="p-3">{manual.downloads}</td>
                    <td className="p-3 text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-accent-teal hover:text-accent-teal/90 hover:bg-accent-teal/10"
                        onClick={() => handleEdit(manual)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-500/90 hover:bg-red-500/10"
                        onClick={() => handleDelete(manual.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-muted/20 rounded-lg p-12 flex flex-col items-center justify-center">
          <p className="text-muted-foreground mb-4">No manuals added yet</p>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            variant="outline"
            className="border-accent-teal text-accent-teal hover:bg-accent-teal/10"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add your first manual
          </Button>
        </div>
      )}

      <AdminManualDialog
        open={isDialogOpen}
        selectedManual={selectedManual}
        onClose={handleDialogClose}
      />
    </div>
  );
};

export default AdminManuals;
