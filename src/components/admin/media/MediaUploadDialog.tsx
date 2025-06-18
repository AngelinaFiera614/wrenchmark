
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X } from "lucide-react";

interface MediaUploadDialogProps {
  open: boolean;
  onClose: (refresh?: boolean) => void;
  onUploadSuccess?: (item: any) => void;
}

const MediaUploadDialog = ({ open, onClose, onUploadSuccess }: MediaUploadDialogProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    caption: "",
    alt_text: "",
    tags: ""
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a file to upload.",
      });
      return;
    }

    setUploading(true);

    try {
      // For now, we'll just save the metadata to the database
      // In a real implementation, you'd upload to Supabase Storage first
      const fileType = selectedFile.type.startsWith('image/') ? 'image' : 
                      selectedFile.type.startsWith('video/') ? 'video' : 'document';

      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

      const { data, error } = await supabase
        .from('media_library')
        .insert([{
          file_name: selectedFile.name,
          file_url: URL.createObjectURL(selectedFile), // Temporary URL for demo
          file_type: fileType,
          mime_type: selectedFile.type,
          file_size_bytes: selectedFile.size,
          caption: formData.caption,
          alt_text: formData.alt_text,
          tags: tagsArray
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "File uploaded",
        description: `${selectedFile.name} has been uploaded successfully.`,
      });

      if (onUploadSuccess && data) {
        onUploadSuccess(data);
      }

      onClose(true);
      
      // Reset form
      setSelectedFile(null);
      setFormData({ caption: "", alt_text: "", tags: "" });

    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="bg-explorer-card border-explorer-chrome/30 text-explorer-text sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* File Selection */}
          <div className="space-y-2">
            <Label>Select File</Label>
            <div className="border-2 border-dashed border-explorer-chrome/30 rounded-lg p-6 text-center">
              {selectedFile ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm">{selectedFile.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 mx-auto mb-2 text-explorer-text-muted" />
                  <p className="text-sm text-explorer-text-muted mb-2">
                    Click to select a file or drag and drop
                  </p>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    className="hidden"
                    id="file-upload"
                  />
                  <Label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-accent-teal text-black px-4 py-2 rounded hover:bg-accent-teal/80"
                  >
                    Choose File
                  </Label>
                </div>
              )}
            </div>
          </div>

          {/* Metadata Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                placeholder="Brief description of the media..."
                value={formData.caption}
                onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alt_text">Alt Text (for accessibility)</Label>
              <Input
                id="alt_text"
                placeholder="Describe the image for screen readers..."
                value={formData.alt_text}
                onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="motorcycle, yamaha, sport..."
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="bg-explorer-dark border-explorer-chrome/30"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => onClose()}
              className="border-explorer-chrome/30"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaUploadDialog;
