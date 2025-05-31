
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Brand {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface RecentBrandsCardProps {
  brands: Brand[] | undefined;
  isLoading: boolean;
}

const RecentBrandsCard = ({ brands, isLoading }: RecentBrandsCardProps) => {
  return (
    <Card className="bg-explorer-card border-explorer-chrome/30 hover:border-accent-teal/30 transition-colors">
      <CardHeader>
        <CardTitle className="text-explorer-text flex items-center gap-2">
          Recent Brand Activity
          <Badge variant="outline" className="bg-accent-teal/20 text-accent-teal border-accent-teal/30">
            {brands?.length || 0}
          </Badge>
        </CardTitle>
        <CardDescription className="text-explorer-text-muted">
          Recently updated brands in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-teal mx-auto"></div>
            <p className="text-explorer-text-muted mt-2">Loading...</p>
          </div>
        ) : brands && brands.length > 0 ? (
          <div className="space-y-3">
            {brands.map((brand) => (
              <div key={brand.id} className="flex justify-between items-center py-2 border-b border-explorer-chrome/20 last:border-b-0">
                <div>
                  <p className="font-medium text-explorer-text">{brand.name}</p>
                  <p className="text-sm text-explorer-text-muted">
                    {formatDistanceToNow(new Date(brand.updated_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-explorer-text-muted text-center py-4">No recent brand activity</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentBrandsCard;
