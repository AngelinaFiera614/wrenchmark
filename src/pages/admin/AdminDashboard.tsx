
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Bike, Building, Wrench, FileText, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface AdminMetric {
  title: string;
  value: number;
  loading: boolean;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<AdminMetric[]>([
    { title: "Motorcycles", value: 0, loading: true },
    { title: "Brands", value: 0, loading: true },
    { title: "Repair Skills", value: 0, loading: true },
    { title: "Manuals", value: 0, loading: true },
  ]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Fetch motorcycle count
        const { count: motorcycleCount, error: motorcycleError } = await supabase
          .from('motorcycles')
          .select('*', { count: 'exact', head: true });
          
        // Fetch brand count
        const { count: brandCount, error: brandError } = await supabase
          .from('brands')
          .select('*', { count: 'exact', head: true });
          
        // Fetch repair skills count
        const { count: repairCount, error: repairError } = await supabase
          .from('repair_skills')
          .select('*', { count: 'exact', head: true });
          
        // Fetch manuals count
        const { count: manualCount, error: manualError } = await supabase
          .from('manuals')
          .select('*', { count: 'exact', head: true });

        if (motorcycleError || brandError || repairError || manualError) {
          throw new Error("Error fetching metrics");
        }

        setMetrics([
          { title: "Motorcycles", value: motorcycleCount || 0, loading: false },
          { title: "Brands", value: brandCount || 0, loading: false },
          { title: "Repair Skills", value: repairCount || 0, loading: false },
          { title: "Manuals", value: manualCount || 0, loading: false },
        ]);
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load admin metrics",
        });
      }
    };

    fetchMetrics();
  }, [toast]);

  const adminSections = [
    {
      title: "Motorcycles",
      description: "Manage motorcycle listings and details",
      path: "/admin/motorcycles",
      icon: <Bike className="h-8 w-8" />,
    },
    {
      title: "Brands",
      description: "Manage motorcycle brands and manufacturers",
      path: "/admin/brands",
      icon: <Building className="h-8 w-8" />,
    },
    {
      title: "Repair Skills",
      description: "Create and edit motorcycle repair guides",
      path: "/admin/repair-skills",
      icon: <Wrench className="h-8 w-8" />,
    },
    {
      title: "Manuals",
      description: "Upload and manage service manuals",
      path: "/admin/manuals",
      icon: <FileText className="h-8 w-8" />,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to the Wrenchmark admin dashboard. Manage all your motorcycle content from here.
      </p>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{metric.title}</CardTitle>
              <CardDescription>Total Count</CardDescription>
            </CardHeader>
            <CardContent>
              {metric.loading ? (
                <Skeleton className="h-12 w-12" />
              ) : (
                <div className="text-3xl font-bold text-accent-teal">{metric.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Admin Section Cards */}
      <h2 className="text-xl font-semibold mt-10">Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminSections.map((section) => (
          <Link key={section.path} to={section.path}>
            <Card className="overflow-hidden h-full transition-all hover:border-accent-teal">
              <CardHeader className="pb-2">
                <div className="text-accent-teal mb-2">{section.icon}</div>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-accent-teal font-medium">
                  Manage →
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Admin info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Database className="h-5 w-5 mr-2 text-accent-teal" />
            Admin Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The admin dashboard is restricted to approved administrators. You are currently logged in as an administrator for afiera614@gmail.com.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
