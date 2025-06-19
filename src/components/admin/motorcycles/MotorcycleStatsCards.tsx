
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Clock, Eye } from "lucide-react";

interface StatsData {
  total: number;
  complete: number;
  incomplete: number;
  drafts: number;
}

interface MotorcycleStatsCardsProps {
  stats?: StatsData;
  isLoading: boolean;
}

const MotorcycleStatsCards = ({ stats, isLoading }: MotorcycleStatsCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-explorer-card border-explorer-chrome/30">
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const published = stats ? stats.total - stats.drafts : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-explorer-text-muted">Total Models</p>
              <p className="text-2xl font-bold text-explorer-text">{stats?.total || 0}</p>
            </div>
            <div className="h-8 w-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Eye className="h-4 w-4 text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-explorer-text-muted">Published</p>
              <p className="text-2xl font-bold text-green-400">{published}</p>
            </div>
            <div className="h-8 w-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-explorer-text-muted">Drafts</p>
              <p className="text-2xl font-bold text-orange-400">{stats?.drafts || 0}</p>
            </div>
            <div className="h-8 w-8 bg-orange-500/20 rounded-full flex items-center justify-center">
              <Clock className="h-4 w-4 text-orange-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-explorer-text-muted">Incomplete</p>
              <p className="text-2xl font-bold text-red-400">{stats?.incomplete || 0}</p>
            </div>
            <div className="h-8 w-8 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-red-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MotorcycleStatsCards;
