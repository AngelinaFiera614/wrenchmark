
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface YearManagementPanelProps {
  modelYears: any[];
  selectedYear: string | null;
  selectedModelData?: any;
  onYearSelect: (yearId: string) => void;
  loading: boolean;
}

const YearManagementPanel: React.FC<YearManagementPanelProps> = ({
  modelYears,
  selectedYear,
  selectedModelData,
  onYearSelect,
  loading
}) => {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newYear, setNewYear] = useState("");
  const [newMsrp, setNewMsrp] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateYear = async () => {
    if (!newYear || !selectedModelData) return;

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('model_years')
        .insert({
          motorcycle_id: selectedModelData.id,
          year: parseInt(newYear),
          msrp_usd: newMsrp ? parseFloat(newMsrp) : null,
          is_available: true
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Year Created",
        description: `${newYear} model year has been created successfully.`
      });

      setShowCreateDialog(false);
      setNewYear("");
      setNewMsrp("");
      
      // Auto-select the new year
      onYearSelect(data.id);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: error.message || "Failed to create model year."
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (!selectedModelData) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Model Years
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
            <p className="text-explorer-text-muted">Select a model to manage years</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-explorer-text flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Model Years
              <Badge variant="secondary">{modelYears.length}</Badge>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateDialog(true)}
              className="border-accent-teal/30 text-accent-teal hover:bg-accent-teal/10"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Year
            </Button>
          </div>
          <p className="text-sm text-explorer-text-muted">
            {selectedModelData.name} ({selectedModelData.brands?.name})
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-explorer-chrome/20 rounded animate-pulse" />
              ))}
            </div>
          ) : modelYears.length > 0 ? (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {modelYears.map((year) => (
                <Button
                  key={year.id}
                  variant={selectedYear === year.id ? "default" : "ghost"}
                  onClick={() => onYearSelect(year.id)}
                  className={`w-full justify-between text-left h-auto p-3 ${
                    selectedYear === year.id
                      ? "bg-accent-teal text-black hover:bg-accent-teal/80"
                      : "text-explorer-text hover:bg-explorer-chrome/20"
                  }`}
                >
                  <div>
                    <div className="font-medium">{year.year}</div>
                    {year.msrp_usd && (
                      <div className="text-sm opacity-70">
                        MSRP: ${year.msrp_usd.toLocaleString()}
                      </div>
                    )}
                    {year.marketing_tagline && (
                      <div className="text-xs opacity-60">
                        {year.marketing_tagline}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {!year.is_available && (
                      <Badge variant="outline" className="text-xs">
                        Discontinued
                      </Badge>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
              <p className="text-explorer-text-muted mb-4">No model years found</p>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(true)}
                className="border-accent-teal/30 text-accent-teal hover:bg-accent-teal/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Year
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Model Year</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Year</label>
              <Input
                type="number"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                placeholder="2024"
                min="1900"
                max="2030"
              />
            </div>
            <div>
              <label className="text-sm font-medium">MSRP (USD) - Optional</label>
              <Input
                type="number"
                value={newMsrp}
                onChange={(e) => setNewMsrp(e.target.value)}
                placeholder="15999"
                min="0"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateYear}
                disabled={!newYear || isCreating}
                className="bg-accent-teal text-black hover:bg-accent-teal/80"
              >
                {isCreating ? "Creating..." : "Create Year"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default YearManagementPanel;
