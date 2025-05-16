
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bike, Building, Wrench, FileText } from "lucide-react";

const AdminDashboard = () => {
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
        Welcome to the Wrenchmark admin dashboard. Select a section to manage content.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
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
    </div>
  );
};

export default AdminDashboard;
