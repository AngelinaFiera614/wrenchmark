
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink } from "lucide-react";

interface MediaPreviewDialogProps {
  open: boolean;
  item: any;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
  onUpdate?: () => void;
}

const MediaPreviewDialog = ({ open, item, onClose, onOpenChange, onUpdate }: MediaPreviewDialogProps) => {
  if (!item) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-explorer-card border-explorer-chrome/30 text-explorer-text sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{item.file_name}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(item.file_url, '_blank')}
                className="border-explorer-chrome/30"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = item.file_url;
                  link.download = item.file_name;
                  link.click();
                }}
                className="border-explorer-chrome/30"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Preview */}
          {item.file_type === 'image' && (
            <div className="text-center">
              <img
                src={item.file_url}
                alt={item.alt_text || item.file_name}
                className="max-w-full max-h-96 object-contain rounded border border-explorer-chrome/30"
              />
            </div>
          )}

          {item.file_type === 'video' && (
            <div className="text-center">
              <video
                src={item.file_url}
                controls
                className="max-w-full max-h-96 rounded border border-explorer-chrome/30"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-explorer-text mb-2">File Information</div>
              <div className="space-y-1 text-explorer-text-muted">
                <div>Type: {item.file_type}</div>
                <div>MIME: {item.mime_type}</div>
                <div>Size: {formatFileSize(item.file_size_bytes || 0)}</div>
              </div>
            </div>
            
            <div>
              <div className="font-medium text-explorer-text mb-2">Timestamps</div>
              <div className="space-y-1 text-explorer-text-muted">
                <div>Created: {formatDate(item.created_at)}</div>
                <div>Updated: {formatDate(item.updated_at)}</div>
              </div>
            </div>
          </div>

          {/* Caption */}
          {item.caption && (
            <div>
              <div className="font-medium text-explorer-text mb-2">Caption</div>
              <div className="text-explorer-text-muted">{item.caption}</div>
            </div>
          )}

          {/* Alt Text */}
          {item.alt_text && (
            <div>
              <div className="font-medium text-explorer-text mb-2">Alt Text</div>
              <div className="text-explorer-text-muted">{item.alt_text}</div>
            </div>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div>
              <div className="font-medium text-explorer-text mb-2">Tags</div>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaPreviewDialog;
