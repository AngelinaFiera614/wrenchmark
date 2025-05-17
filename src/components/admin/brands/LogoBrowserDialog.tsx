
import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, AlertTriangle } from "lucide-react";
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
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [loadErrors, setLoadErrors] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch files when the dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchFiles();
      setSelectedLogo(null);
      setLoadErrors({});
      setSearchTerm('');
    }
  }, [isOpen, fetchFiles]);

  const handleSelectLogo = () => {
    if (selectedLogo) {
      console.log("Selecting logo with URL:", selectedLogo);
      onSelectLogo(selectedLogo);
      onClose();
    }
  };

  const handleImageError = (name: string) => {
    console.error(`Failed to load image: ${name}`);
    setLoadErrors(prev => ({ ...prev, [name]: true }));
  };

  // Filter files based on search term
  const filteredFiles = searchTerm.trim() === '' 
    ? files 
    : files.filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Brand Logos</DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <input
            type="search"
            placeholder="Search logos..."
            className="w-full px-4 py-2 border rounded-md bg-background focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

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

          {!isLoading && !error && filteredFiles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              {searchTerm.trim() !== '' ? (
                <p>No logos found matching "{searchTerm}".</p>
              ) : (
                <>
                  <p>No logo files found in the brand-logos bucket.</p>
                  <p className="text-sm mt-1">Upload some logos first to see them here.</p>
                </>
              )}
            </div>
          )}

          {!isLoading && !error && filteredFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={cn(
                    "border rounded-md p-2 cursor-pointer hover:border-accent-teal transition-colors",
                    selectedLogo === file.url && "border-2 border-accent-teal ring-2 ring-accent-teal/20"
                  )}
                  onClick={() => {
                    setSelectedLogo(file.url);
                    console.log("Selected logo URL:", file.url);
                  }}
                >
                  <div className="aspect-square bg-black flex items-center justify-center p-2 relative">
                    {loadErrors[file.name] ? (
                      <div className="flex flex-col items-center justify-center text-red-500">
                        <AlertTriangle className="h-8 w-8 mb-1" />
                        <span className="text-xs text-center">Failed to load</span>
                      </div>
                    ) : (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="max-h-full max-w-full object-contain"
                        onError={() => handleImageError(file.name)}
                      />
                    )}
                  </div>
                  <p className="text-xs text-center mt-2 truncate" title={file.name}>
                    {file.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 flex-col sm:flex-row">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="sm:w-auto w-full"
          >
            Cancel
          </Button>
          <Button 
            variant="teal" 
            onClick={handleSelectLogo} 
            disabled={!selectedLogo || isLoading}
            className="sm:w-auto w-full"
          >
            Select Logo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoBrowserDialog;
