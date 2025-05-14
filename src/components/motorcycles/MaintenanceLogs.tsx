
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MaintenanceLogs() {
  return (
    <Card className="border border-border/50 bg-card/70 backdrop-blur-sm overflow-hidden animate-in slide-in-from-bottom-5 duration-500 delay-250 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-foreground">Maintenance Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/40 p-6 rounded text-center">
          <p className="text-foreground">Maintenance logs will be available in a future update</p>
        </div>
      </CardContent>
    </Card>
  );
}
