
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ComparisonHeader() {
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" className="pl-0" asChild>
        <a href="/motorcycles">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Motorcycles
        </a>
      </Button>
    </div>
  );
}
