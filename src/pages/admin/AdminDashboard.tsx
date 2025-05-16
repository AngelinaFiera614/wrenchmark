
import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bike, Building2, Wrench, FileText, Component, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  // Fetch counts of different content types
  const { data: counts, isLoading } = useQuery({
    queryKey: ["admin-dashboard-counts"],
    queryFn: async () => {
      const [
        motorcyclesCount,
        brandsCount,
        repairSkillsCount,
        manualsCount,
        profilesCount,
      ] = await Promise.all([
        supabase.from("motorcycles").select("*", { count: "exact", head: true }),
        supabase.from("brands").select("*", { count: "exact", head: true }),
        supabase.from("repair_skills").select("*", { count: "exact", head: true }),
        supabase.from("manuals").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
      ]);

      return {
        motorcycles: motorcyclesCount.count || 0,
        brands: brandsCount.count || 0,
        repairSkills: repairSkillsCount.count || 0,
        manuals: manualsCount.count || 0,
        users: profilesCount.count || 0,
      };
    },
  });

  const contentCards = [
    {
      title: "Motorcycles",
      icon: <Bike className="h-8 w-8 text-accent-teal" />,
      count: counts?.motorcycles || 0,
      path: "/admin/motorcycles",
    },
    {
      title: "Brands",
      icon: <Building2 className="h-8 w-8 text-accent-teal" />,
      count: counts?.brands || 0,
      path: "/admin/brands",
    },
    {
      title: "Repair Skills",
      icon: <Wrench className="h-8 w-8 text-accent-teal" />,
      count: counts?.repairSkills || 0,
      path: "/admin/repair-skills",
    },
    {
      title: "Manuals",
      icon: <FileText className="h-8 w-8 text-accent-teal" />,
      count: counts?.manuals || 0,
      path: "/admin/manuals",
    },
    {
      title: "Parts Reference",
      icon: <Component className="h-8 w-8 text-accent-teal" />,
      count: 0,
      path: "/admin/parts",
      comingSoon: true,
    },
    {
      title: "Users",
      icon: <Users className="h-8 w-8 text-accent-teal" />,
      count: counts?.users || 0,
      path: "/admin/users",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage content and monitor activity across the Wrenchmark platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contentCards.map((card) => (
          <Card key={card.title} className="border border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : card.count}
              </div>
              <p className="text-xs text-muted-foreground">
                Total {card.title.toLowerCase()} in database
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" asChild>
                <Link to={card.path}>
                  {card.comingSoon ? "Coming Soon" : `Manage ${card.title}`}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="border rounded-md p-6">
        <h2 className="text-xl font-bold mb-4">Admin Quick Tips</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-accent-teal">Managing Content</h3>
            <p className="text-sm text-muted-foreground">
              Use the left sidebar to navigate between different content types. 
              Each section provides tools to add, edit, and delete items.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-accent-teal">Best Practices</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>Always add high-quality images for motorcycles and parts</li>
              <li>Keep model names and specs consistent across the database</li>
              <li>Use tags effectively to help users find relevant content</li>
              <li>Ensure repair guides include clear safety instructions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
