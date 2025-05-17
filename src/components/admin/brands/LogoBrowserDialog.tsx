
import React, { useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { useStorageList, StorageFile } from '@/hooks/useStorageList';
import { cn } from '@/lib/utils';

interface LogoBrowserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLogo: (url: string) => void;
}

const LogoBrowserDialog: React.FC<LogoBrowserDialogProps> = ({
  isOpen,
  onClose,
  onSelectLogo,
}) => {
  const { files, isLoading, error, fetchFiles } = useStorageList('brand-logos');
  const [selectedLogo, setSelectedLogo] = React.useState<string | null>(null);

  // Fetch files when the dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchFiles();
    }
  }, [isOpen, fetchFiles]);

  const handleSelectLogo = () => {
    if (selectedLogo) {
      onSelectLogo(selectedLogo);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Brand Logos</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive rounded-md p-4 text-center">
              <AlertTriangle className="h-6 w-6 text-destructive mx-auto mb-2" />
              <p className="text-destructive font-medium">Failed to load logos</p>
              <p className="text-sm text-destructive/80">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={fetchFiles}
              >
                Try Again
              </Button>
            </div>
          )}

          {!isLoading && !error && files.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No logo files found in the brand-logos bucket.</p>
              <p className="text-sm mt-1">Upload some logos first to see them here.</p>
            </div>
          )}

          {!isLoading && !error && files.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={cn(
                    "border rounded-md p-2 cursor-pointer hover:border-accent-teal transition-colors",
                    selectedLogo === file.url && "border-2 border-accent-teal ring-2 ring-accent-teal/20"
                  )}
                  onClick={() => setSelectedLogo(file.url)}
                >
                  <div className="aspect-square bg-black flex items-center justify-center p-2">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <p className="text-xs text-center mt-2 truncate" title={file.name}>
                    {file.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="teal" 
            onClick={handleSelectLogo} 
            disabled={!selectedLogo || isLoading}
          >
            Select Logo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoBrowserDialog;
