
import React, { useState, useEffect } from "react";
import { ManualWithMotorcycle, ManualTag } from "@/services/manuals/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { getManualsByMotorcycleId, incrementDownloadCount } from "@/services/manuals";
import { toast } from "sonner";

interface ManualsListProps {
  motorcycleId: string;
}

type ManualType = 'owner' | 'service' | 'wiring';

const ManualTypeColors: Record<ManualType, string> = {
  owner: "bg-blue-500/20 text-blue-300",
  service: "bg-amber-500/20 text-amber-300",
  wiring: "bg-green-500/20 text-green-300"
};

const ManualsList: React.FC<ManualsListProps> = ({ motorcycleId }) => {
  const [manuals, setManuals] = useState<ManualWithMotorcycle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManuals = async () => {
      try {
        setLoading(true);
        const data = await getManualsByMotorcycleId(motorcycleId);
        setManuals(data);
      } catch (error) {
        console.error("Error fetching manuals:", error);
        toast.error("Failed to load manuals");
      } finally {
        setLoading(false);
      }
    };

    fetchManuals();
  }, [motorcycleId]);

  const handleDownload = async (manual: ManualWithMotorcycle) => {
    // Open the file in a new tab
    window.open(manual.file_url, "_blank");
    
    // Increment the download count
    try {
      await incrementDownloadCount(manual.id);
      // Update the local state with the incremented download count
      setManuals(manuals.map(m => 
        m.id === manual.id ? { ...m, downloads: m.downloads + 1 } : m
      ));
    } catch (error) {
      console.error("Error tracking download:", error);
      // Non-critical error, so don't show a toast
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="h-8 w-8 border-4 border-t-accent-teal border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (manuals.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30 mb-3" />
        <h3 className="text-lg font-medium">No manuals yet</h3>
        <p className="text-muted-foreground">No manuals are available for this motorcycle.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {manuals.map((manual) => (
        <Card key={manual.id} className="bg-card/50 border border-border/50 hover:border-accent-teal/50 transition-all">
          <CardContent className="p-4 flex flex-col h-full">
            <div className="flex items-start justify-between mb-3">
              <Badge 
                variant="outline" 
                className={`${ManualTypeColors[manual.manual_type as ManualType] || 'bg-gray-500/20 text-gray-300'} capitalize border-0`}
              >
                {manual.manual_type}
              </Badge>
              {manual.year && <span className="text-sm text-muted-foreground">{manual.year}</span>}
            </div>
            
            <h3 className="text-lg font-medium mb-1">{manual.title}</h3>
            
            {/* Display make/model from manual if available */}
            {(manual.make || manual.model) && (
              <div className="text-sm text-muted-foreground mb-2">
                {manual.make} {manual.model}
              </div>
            )}
            
            {/* Tags */}
            {manual.tag_details && manual.tag_details.length > 0 && (
              <div className="flex flex-wrap gap-1 my-2">
                {manual.tag_details.map((tag) => (
                  <Badge 
                    key={tag.id}
                    variant="outline"
                    className="text-xs px-1.5 py-0 h-5"
                    style={{ 
                      backgroundColor: `${tag.color}20`, 
                      color: tag.color,
                      borderColor: `${tag.color}40`
                    }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex items-center mt-auto pt-3 text-sm text-muted-foreground">
              {manual.file_size_mb && (
                <span className="mr-4">{manual.file_size_mb} MB</span>
              )}
              <span>{manual.downloads} downloads</span>
            </div>
            
            <Button 
              variant="outline" 
              className="mt-3 w-full" 
              onClick={() => handleDownload(manual)}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ManualsList;
