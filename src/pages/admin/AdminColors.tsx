
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Search, Plus, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ColorManagementStats, BrandColorVariant } from "@/types/colorManagement";
import { getColorManagementStats, getBrandColors } from "@/services/colorManagementService";
import { supabase } from "@/integrations/supabase/client";

const AdminColors = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<ColorManagementStats>({
    total_brand_colors: 0,
    total_model_colors: 0,
    total_trim_assignments: 0,
    colors_by_brand: {}
  });
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [brandColors, setBrandColors] = useState<BrandColorVariant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const statsData = await getColorManagementStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error loading color stats:", error);
    }
  };

  const loadBrands = async () => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('id, name, slug')
        .order('name');

      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error("Error loading brands:", error);
    }
  };

  const loadBrandColors = async (brandId: string) => {
    try {
      const colors = await getBrandColors(brandId);
      setBrandColors(colors);
    } catch (error) {
      console.error("Error loading brand colors:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadStats(), loadBrands()]);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      loadBrandColors(selectedBrand);
    }
  }, [selectedBrand]);

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <div className="text-explorer-text-muted">Loading color management...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-explorer-text">Color Management</h1>
          <p className="text-explorer-text-muted">Manage brand colors and trim assignments</p>
        </div>
        <Button className="bg-accent-teal text-black hover:bg-accent-teal/80">
          <Plus className="h-4 w-4 mr-2" />
          Add Brand Color
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Brand Colors</p>
                <p className="text-2xl font-bold text-explorer-text">{stats.total_brand_colors}</p>
              </div>
              <Palette className="h-8 w-8 text-accent-teal" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Model Colors</p>
                <p className="text-2xl font-bold text-explorer-text">{stats.total_model_colors}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Trim Assignments</p>
                <p className="text-2xl font-bold text-explorer-text">{stats.total_trim_assignments}</p>
              </div>
              <Badge className="bg-green-500 text-white">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-explorer-text-muted">Active Brands</p>
                <p className="text-2xl font-bold text-explorer-text">{Object.keys(stats.colors_by_brand).length}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-explorer-text-muted">with colors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="brands" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="brands">Brand Colors</TabsTrigger>
          <TabsTrigger value="models">Model Years</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="brands" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Brand Selector */}
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader>
                <CardTitle className="text-explorer-text">Select Brand</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-explorer-text-muted" />
                  <Input
                    placeholder="Search brands..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-explorer-dark border-explorer-chrome/30"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                {filteredBrands.map((brand) => (
                  <div
                    key={brand.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedBrand === brand.id
                        ? "bg-accent-teal/20 border-accent-teal"
                        : "bg-explorer-dark border-explorer-chrome/30 hover:border-explorer-chrome/50"
                    }`}
                    onClick={() => setSelectedBrand(brand.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-explorer-text">{brand.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {stats.colors_by_brand[brand.id] || 0} colors
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Brand Colors */}
            <div className="lg:col-span-2">
              <Card className="bg-explorer-card border-explorer-chrome/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-explorer-text">
                      {selectedBrand ? 
                        `${brands.find(b => b.id === selectedBrand)?.name} Colors` : 
                        'Brand Colors'
                      }
                    </CardTitle>
                    {selectedBrand && (
                      <Button size="sm" className="bg-accent-teal text-black hover:bg-accent-teal/80">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Color
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {!selectedBrand ? (
                    <div className="text-center py-8 text-explorer-text-muted">
                      Select a brand from the left to view its colors
                    </div>
                  ) : brandColors.length === 0 ? (
                    <div className="text-center py-8">
                      <Palette className="h-12 w-12 mx-auto text-explorer-text-muted mb-4" />
                      <p className="text-explorer-text-muted">No colors defined for this brand yet.</p>
                      <Button className="mt-4 bg-accent-teal text-black hover:bg-accent-teal/80">
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Color
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {brandColors.map((color) => (
                        <div
                          key={color.id}
                          className="p-4 rounded-lg border border-explorer-chrome/30 bg-explorer-dark"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {color.hex_code && (
                                <div 
                                  className="w-6 h-6 rounded border border-explorer-chrome/30"
                                  style={{ backgroundColor: color.hex_code }}
                                />
                              )}
                              <span className="font-medium text-explorer-text">{color.name}</span>
                            </div>
                            <div className="flex gap-1">
                              {color.is_metallic && <Badge variant="outline" className="text-xs">Metallic</Badge>}
                              {color.is_pearl && <Badge variant="outline" className="text-xs">Pearl</Badge>}
                              {color.is_matte && <Badge variant="outline" className="text-xs">Matte</Badge>}
                            </div>
                          </div>
                          
                          {color.description && (
                            <p className="text-sm text-explorer-text-muted mb-2">{color.description}</p>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-explorer-text-muted">
                            <span>
                              {color.year_introduced && `Since ${color.year_introduced}`}
                              {color.year_discontinued && ` - ${color.year_discontinued}`}
                            </span>
                            <span>{color.hex_code}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="models">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text">Model Year Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-explorer-text-muted">
                Model year color management coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text">Color Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-explorer-text-muted">
                Color analytics and reporting coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminColors;
