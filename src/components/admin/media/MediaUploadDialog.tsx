
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, X, FileText, Image, Video, Music, 
  Plus, Loader2, CheckCircle, AlertCircle 
} from 'lucide-react';
import { uploadMediaItem, MediaLibraryItem } from '@/services/mediaLibraryService';
import { useToast } from '@/hooks/use-toast';

interface MediaUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: (item: MediaLibraryItem) => void;
}

interface UploadFile {
  file: File;
  preview?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  result?: MediaLibraryItem;
}

export default function MediaUploadDialog({
  open,
  onOpenChange,
  onUploadSuccess
}: MediaUploadDialogProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [globalMetadata, setGlobalMetadata] = useState({
    tags: [] as string[],
    alt_text: '',
    caption: ''
  });
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (files: FileList) => {
    const newFiles: UploadFile[] = Array.from(files).map(file => {
      const uploadFile: UploadFile = {
        file,
        progress: 0,
        status: 'pending'
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadFiles(prev => prev.map(f => 
            f.file === file ? { ...f, preview: e.target?.result as string } : f
          ));
        };
        reader.readAsDataURL(file);
      }

      return uploadFile;
    });

    setUploadFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const removeFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !globalMetadata.tags.includes(tag.trim())) {
      setGlobalMetadata(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const removeTag = (tag: string) => {
    setGlobalMetadata(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const startUpload = async () => {
    setUploading(true);
    
    for (let i = 0; i < uploadFiles.length; i++) {
      const uploadFile = uploadFiles[i];
      
      try {
        // Update status to uploading
        setUploadFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'uploading' as const, progress: 0 } : f
        ));

        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setUploadFiles(prev => prev.map((f, idx) => 
            idx === i && f.progress < 90 ? { ...f, progress: f.progress + 10 } : f
          ));
        }, 200);

        const result = await uploadMediaItem(uploadFile.file, {
          alt_text: globalMetadata.alt_text || uploadFile.file.name,
          caption: globalMetadata.caption,
          tags: globalMetadata.tags
        });

        clearInterval(progressInterval);

        // Complete the upload
        setUploadFiles(prev => prev.map((f, idx) => 
          idx === i ? { 
            ...f, 
            status: 'completed' as const, 
            progress: 100,
            result 
          } : f
        ));

        onUploadSuccess(result);

      } catch (error) {
        setUploadFiles(prev => prev.map((f, idx) => 
          idx === i ? { 
            ...f, 
            status: 'error' as const, 
            error: error instanceof Error ? error.message : 'Upload failed'
          } : f
        ));
      }
    }
    
    setUploading(false);
    
    // Auto-close if all uploads successful
    const allCompleted = uploadFiles.every(f => f.status === 'completed');
    if (allCompleted) {
      setTimeout(() => {
        onOpenChange(false);
        setUploadFiles([]);
        setGlobalMetadata({ tags: [], alt_text: '', caption: '' });
      }, 1000);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-8 w-8" />;
    if (file.type.startsWith('video/')) return <Video className="h-8 w-8" />;
    if (file.type.startsWith('audio/')) return <Music className="h-8 w-8" />;
    return <FileText className="h-8 w-8" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Media
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Media Files</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-accent-teal bg-accent-teal/10' 
                : 'border-muted-foreground/25 hover:border-accent-teal/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Drop files here or click to browse</h3>
            <p className="text-muted-foreground mb-4">
              Support for images, videos, audio, and documents
            </p>
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              Select Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            />
          </div>

          {/* Global Metadata */}
          {uploadFiles.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Apply to All Files</h4>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {globalMetadata.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Add tags (press Enter)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alt_text">Alt Text</Label>
                <Input
                  id="alt_text"
                  value={globalMetadata.alt_text}
                  onChange={(e) => setGlobalMetadata(prev => ({ ...prev, alt_text: e.target.value }))}
                  placeholder="Describe the content for accessibility"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  value={globalMetadata.caption}
                  onChange={(e) => setGlobalMetadata(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="Add a caption or description"
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* Upload Queue */}
          {uploadFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Files to Upload ({uploadFiles.length})</h4>
                <Button
                  onClick={startUpload}
                  disabled={uploading || uploadFiles.every(f => f.status === 'completed')}
                  className="flex items-center gap-2"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {uploading ? 'Uploading...' : 'Start Upload'}
                </Button>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {uploadFiles.map((uploadFile, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                      {uploadFile.preview ? (
                        <img src={uploadFile.preview} alt="" className="w-full h-full object-cover" />
                      ) : (
                        getFileIcon(uploadFile.file)
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{uploadFile.file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(uploadFile.file.size)}
                      </p>
                      
                      {uploadFile.status === 'uploading' && (
                        <Progress value={uploadFile.progress} className="mt-2" />
                      )}
                      
                      {uploadFile.status === 'error' && (
                        <p className="text-sm text-destructive mt-1">
                          {uploadFile.error}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {uploadFile.status === 'completed' && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {uploadFile.status === 'error' && (
                        <AlertCircle className="h-5 w-5 text-destructive" />
                      )}
                      {uploadFile.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
