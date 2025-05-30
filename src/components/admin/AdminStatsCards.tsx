
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Wrench, Bike, FileText } from "lucide-react";
import { AdminStats } from "@/services/adminService";

interface AdminStatsCardsProps {
  stats: AdminStats | null;
  isLoading: boolean;
}

const AdminStatsCards = ({ stats, isLoading }: AdminStatsCardsProps) => {
  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Brands",
      value: stats?.totalBrands || 0,
      icon: Wrench,
      color: "text-accent-teal"
    },
    {
      title: "Motorcycles",
      value: stats?.totalMotorcycles || 0,
      icon: Bike,
      color: "text-orange-600"
    },
    {
      title: "Manuals",
      value: stats?.totalManuals || 0,
      icon: FileText,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : card.value.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStatsCards;
