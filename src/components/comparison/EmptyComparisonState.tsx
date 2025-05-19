
import { Button } from "@/components/ui/button";

export default function EmptyComparisonState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h2 className="text-2xl font-semibold mb-4">No models selected for comparison</h2>
      <p className="text-muted-foreground mb-6">
        Please select motorcycles to compare from the motorcycles page.
      </p>
      <Button asChild>
        <a href="/motorcycles">Browse Motorcycles</a>
      </Button>
    </div>
  );
}
