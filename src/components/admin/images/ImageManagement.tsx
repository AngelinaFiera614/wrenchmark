import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Search, Tag, Image as ImageIcon, Star, StarOff } from "lucide-react";
import { toast } from "sonner";
import { imageManagementService, MotorcycleImage, ImageTag } from "@/services/imageManagementService";
import { getAllMotorcycles } from "@/services/motorcycleService";
import { Motorcycle } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ImageManagement() {
  const [images, setImages] = useState<MotorcycleImage[]>([]);
  const [tags, setTags] = useState<ImageTag[]>([]);
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [motorcycleData, tagData] = await Promise.all([
      getAllMotorcycles(),
      imageManagementService.getImageTags()
    ]);
    
    setMotorcycles(motorcycleData);
    setTags(tagData);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    for (const file of Array.from(files)) {
      try {
        const timestamp = Date.now();
        const baseName = file.name.split('.')[0];
        const path = `uploads/${timestamp}-${baseName}`;
        
        const { url, error } = await imageManagementService.uploadImage(file, path);
        
        if (error) {
          toast.error(`Failed to upload ${file.name}: ${error.message}`);
          continue;
        }

        const imageData: Omit<MotorcycleImage, 'id' | 'created_at' | 'updated_at'> = {
          file_url: url,
          file_name: file.name,
          file_size_bytes: file.size,
          mime_type: file.type,
          motorcycle_id: selectedMotorcycle !== 'all' ? selectedMotorcycle : undefined,
          brand: extractBrandFromFileName(file.name),
          model: extractModelFromFileName(file.name),
          year: extractYearFromFileName(file.name),
          color: extractColorFromFileName(file.name),
          angle: 'side',
          is_primary: false,
          is_featured: false
        };

        const newImage = await imageManagementService.createImageRecord(imageData);
        if (newImage) {
          setImages(prev => [...prev, newImage]);
          toast.success(`Uploaded ${file.name} successfully`);
        }
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    
    setIsUploading(false);
    event.target.value = '';
  };

  const setPrimaryImage = async (imageId: string, motorcycleId: string) => {
    const success = await imageManagementService.setPrimaryImage(imageId, { motorcycleId });
    if (success) {
      toast.success('Primary image updated');
      const image = images.find(img => img.id === imageId);
      if (image) {
        await imageManagementService.updateMotorcyclePrimaryImage(motorcycleId, image.file_url);
      }
      loadMotorcycleImages(motorcycleId);
    } else {
      toast.error('Failed to update primary image');
    }
  };

  const loadMotorcycleImages = async (motorcycleId: string) => {
    const motorcycleImages = await imageManagementService.getMotorcycleImages(motorcycleId);
    setImages(motorcycleImages);
  };

  const extractBrandFromFileName = (fileName: string): string => {
    const brands = ['honda', 'ducati', 'bmw', 'kawasaki', 'yamaha', 'royal-enfield', 'harley-davidson'];
    const lowerName = fileName.toLowerCase();
    return brands.find(brand => lowerName.includes(brand)) || '';
  };

  const extractModelFromFileName = (fileName: string): string => {
    const parts = fileName.toLowerCase().split('-');
    if (parts.length >= 2) return parts[1];
    return '';
  };

  const extractYearFromFileName = (fileName: string): number | undefined => {
    const yearMatch = fileName.match(/(\d{4})/);
    return yearMatch ? parseInt(yearMatch[1]) : undefined;
  };

  const extractColorFromFileName = (fileName: string): string => {
    const colors = ['black', 'white', 'red', 'blue', 'green', 'silver', 'gold', 'yellow'];
    const lowerName = fileName.toLowerCase();
    return colors.find(color => lowerName.includes(color)) || '';
  };

  const filteredImages = images.filter(image => 
    searchTerm === '' || 
    image.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Image Management</h1>
        <div className="flex gap-2">
          <Button disabled={isUploading}>
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Upload Images'}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="gallery" className="w-full">
        <TabsList>
          <TabsTrigger value="gallery">Image Gallery</TabsTrigger>
          <TabsTrigger value="upload">Bulk Upload</TabsTrigger>
          <TabsTrigger value="tags">Manage Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Images</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by filename, brand, or model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="w-64">
              <Label htmlFor="motorcycle-select">Filter by Motorcycle</Label>
              <Select value={selectedMotorcycle} onValueChange={(value) => {
                setSelectedMotorcycle(value);
                if (value !== 'all') loadMotorcycleImages(value);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select motorcycle..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Images</SelectItem>
                  {motorcycles.map((motorcycle) => (
                    <SelectItem key={motorcycle.id} value={motorcycle.id}>
                      {motorcycle.make} {motorcycle.model} ({motorcycle.year})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="relative aspect-video">
                  <img
                    src={image.file_url}
                    alt={image.alt_text || image.file_name}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  {image.is_primary && (
                    <Badge className="absolute top-2 left-2 bg-accent-teal text-black">
                      <Star className="h-3 w-3 mr-1" />
                      Primary
                    </Badge>
                  )}
                  {image.is_featured && (
                    <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm mb-2 truncate">{image.file_name}</h3>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    {image.brand && <p>Brand: {image.brand}</p>}
                    {image.model && <p>Model: {image.model}</p>}
                    {image.year && <p>Year: {image.year}</p>}
                    {image.color && <p>Color: {image.color}</p>}
                    {image.angle && <p>Angle: {image.angle}</p>}
                  </div>
                  {image.motorcycle_id && (
                    <div className="mt-2 pt-2 border-t">
                      <Button
                        size="sm"
                        variant={image.is_primary ? "default" : "outline"}
                        onClick={() => setPrimaryImage(image.id, image.motorcycle_id!)}
                        className="w-full"
                      >
                        {image.is_primary ? (
                          <>
                            <Star className="h-3 w-3 mr-1" />
                            Primary
                          </>
                        ) : (
                          <>
                            <StarOff className="h-3 w-3 mr-1" />
                            Set Primary
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No images found</h3>
              <p className="text-sm text-muted-foreground">Upload some images to get started</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Image Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bulk-upload">Upload Multiple Images</Label>
                <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop images here, or click to select files
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Supports: JPG, PNG, WebP (max 10MB each)
                  </p>
                  <Button disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Select Images'}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <h4 className="font-medium mb-2">File Naming Convention:</h4>
                <p>For best results, name your files like:</p>
                <code className="block mt-1 p-2 bg-muted rounded text-xs">
                  brand-model-year-color-angle.jpg
                </code>
                <p className="mt-1">Example: <code>honda-cbr600rr-2023-red-side.jpg</code></p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(
              tags.reduce((acc, tag) => {
                if (!acc[tag.category]) acc[tag.category] = [];
                acc[tag.category].push(tag);
                return acc;
              }, {} as Record<string, ImageTag[]>)
            ).map(([category, categoryTags]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="capitalize">{category} Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {categoryTags.map((tag) => (
                      <Badge key={tag.id} variant="secondary">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
