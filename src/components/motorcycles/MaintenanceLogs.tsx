
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Calendar, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function MaintenanceLogs() {
  const handleAddLog = () => {
    toast.info("Coming Soon", {
      description: "Maintenance logs feature will be available in a future update"
    });
  };
  
  return (
    <Card className="border border-border/50 bg-card/70 backdrop-blur-sm overflow-hidden animate-in slide-in-from-bottom-5 duration-500 delay-250 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Wrench className="h-5 w-5 text-accent-teal" />
          <span>Maintenance Logs</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/20 p-6 rounded-md border border-border/30 flex flex-col items-center justify-center space-y-4">
          <Calendar className="h-12 w-12 text-muted-foreground/50" />
          <div className="text-center space-y-2">
            <p className="text-foreground font-medium">No maintenance records yet</p>
            <p className="text-sm text-muted-foreground">
              Track service history, repairs, and maintenance schedules for this motorcycle.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleAddLog} className="mt-2">
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Maintenance Log
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
