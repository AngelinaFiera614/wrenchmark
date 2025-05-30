
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, X, Image, Video, FileText } from "lucide-react";
import { toast } from "sonner";
import { MediaUploadData, PhotoContext, MediaType, VideoType, DocumentType } from "@/types/media";

interface EnhancedMediaUploadProps {
  motorcycleId?: string;
  modelYearId?: string;
  configurationId?: string;
  onUploadComplete?: (uploadedFiles: any[]) => void;
  onError?: (error: Error) => void;
}

const PHOTO_CONTEXTS: { value: PhotoContext; label: string }[] = [
  { value: 'studio', label: 'Studio' },
  { value: 'action', label: 'Action' },
  { value: 'event', label: 'Event' },
  { value: 'historic', label: 'Historic' },
  { value: 'dealership', label: 'Dealership' },
  { value: 'press', label: 'Press' },
  { value: 'user_submitted', label: 'User Submitted' }
];

const MEDIA_TYPES: { value: MediaType; label: string; icon: React.ReactNode }[] = [
  { value: 'image', label: 'Image', icon: <Image className="h-4 w-4" /> },
  { value: 'video', label: 'Video', icon: <Video className="h-4 w-4" /> },
  { value: 'document', label: 'Document', icon: <FileText className="h-4 w-4" /> },
  { value: 'brochure', label: 'Brochure', icon: <FileText className="h-4 w-4" /> },
  { value: 'manual', label: 'Manual', icon: <FileText className="h-4 w-4" /> }
];

const VIEW_ANGLES = [
  'front', 'rear', 'left_side', 'right_side', 'front_quarter', 'rear_quarter',
  'top', 'bottom', 'interior', 'cockpit', 'detail', 'engine', 'exhaust'
];

export default function EnhancedMediaUpload({
  motorcycleId,
  modelYearId,
  configurationId,
  onUploadComplete,
  onError
}: EnhancedMediaUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<MediaUploadData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const newUploadData: MediaUploadData[] = files.map(file => ({
      file,
      mediaType: getMediaTypeFromFile(file),
      isPrimary: false,
      isFeatured: false
    }));

    setSelectedFiles(prev => [...prev, ...newUploadData]);
  };

  const getMediaTypeFromFile = (file: File): MediaType => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type === 'application/pdf') return 'document';
    return 'document';
  };

  const updateFileData = (index: number, updates: Partial<MediaUploadData>) => {
    setSelectedFiles(prev => prev.map((item, i) => 
      i === index ? { ...item, ...updates } : item
    ));
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    setIsUploading(true);
    try {
      const uploadedFiles = [];
      
      for (const uploadData of selectedFiles) {
        // Here we would implement the actual upload logic
        // For now, we'll simulate the upload
        console.log('Uploading:', uploadData);
        uploadedFiles.push(uploadData);
      }

      toast.success(`Successfully uploaded ${uploadedFiles.length} files`);
      setSelectedFiles([]);
      onUploadComplete?.(uploadedFiles);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error("Upload failed");
      onError?.(error as Error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Enhanced Media Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept="image/*,video/*,.pdf"
              onChange={handleFileSelect}
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Select Files
            </Button>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Selected Files ({selectedFiles.length})</h3>
              
              {selectedFiles.map((uploadData, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {MEDIA_TYPES.find(t => t.value === uploadData.mediaType)?.icon}
                      <span className="font-medium">{uploadData.file.name}</span>
                      <Badge variant="secondary">
                        {uploadData.mediaType}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label>Media Type</Label>
                      <Select
                        value={uploadData.mediaType}
                        onValueChange={(value: MediaType) => 
                          updateFileData(index, { mediaType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MEDIA_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                {type.icon}
                                {type.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {uploadData.mediaType === 'image' && (
                      <div>
                        <Label>View Angle</Label>
                        <Select
                          value={uploadData.angle || ''}
                          onValueChange={(value) => 
                            updateFileData(index, { angle: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select angle" />
                          </SelectTrigger>
                          <SelectContent>
                            {VIEW_ANGLES.map(angle => (
                              <SelectItem key={angle} value={angle}>
                                {angle.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label>Photo Context</Label>
                      <Select
                        value={uploadData.context || ''}
                        onValueChange={(value: PhotoContext) => 
                          updateFileData(index, { context: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select context" />
                        </SelectTrigger>
                        <SelectContent>
                          {PHOTO_CONTEXTS.map(context => (
                            <SelectItem key={context.value} value={context.value}>
                              {context.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Color Code (Optional)</Label>
                      <Input
                        placeholder="e.g., NH-1, PB-1M"
                        value={uploadData.colorCode || ''}
                        onChange={(e) => 
                          updateFileData(index, { colorCode: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label>Year Captured</Label>
                      <Input
                        type="number"
                        placeholder="e.g., 2024"
                        value={uploadData.yearCaptured || ''}
                        onChange={(e) => 
                          updateFileData(index, { 
                            yearCaptured: e.target.value ? parseInt(e.target.value) : undefined 
                          })
                        }
                      />
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <Label>Historical Significance (Optional)</Label>
                      <Textarea
                        placeholder="Describe the historical context or significance of this media..."
                        value={uploadData.historicalSignificance || ''}
                        onChange={(e) => 
                          updateFileData(index, { historicalSignificance: e.target.value })
                        }
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`primary-${index}`}
                          checked={uploadData.isPrimary || false}
                          onCheckedChange={(checked) => 
                            updateFileData(index, { isPrimary: checked as boolean })
                          }
                        />
                        <Label htmlFor={`primary-${index}`}>Primary Image</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`featured-${index}`}
                          checked={uploadData.isFeatured || false}
                          onCheckedChange={(checked) => 
                            updateFileData(index, { isFeatured: checked as boolean })
                          }
                        />
                        <Label htmlFor={`featured-${index}`}>Featured</Label>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              <Button 
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading {selectedFiles.length} files...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload {selectedFiles.length} Files
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
