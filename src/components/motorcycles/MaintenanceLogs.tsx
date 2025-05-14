
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MaintenanceLogs() {
  return (
    <Card className="border border-border/30 bg-card/50 backdrop-blur-sm overflow-hidden animate-in slide-in-from-bottom-5 duration-500 delay-250">
      <CardHeader className="pb-2">
        <CardTitle>Maintenance Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/30 p-6 rounded text-center">
          <p className="text-muted-foreground">Maintenance logs will be available in a future update</p>
        </div>
      </CardContent>
    </Card>
  );
}
