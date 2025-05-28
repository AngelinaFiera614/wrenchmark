
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, File } from 'lucide-react';

interface DownloadBlockProps {
  data: {
    title?: string;
    description?: string;
    files?: Array<{
      name: string;
      url: string;
      size?: string;
      type?: string;
    }>;
    [key: string]: any;
  };
}

export default function DownloadBlock({ data }: DownloadBlockProps) {
  const getFileIcon = (type?: string) => {
    if (type?.includes('pdf')) return FileText;
    return File;
  };

  if (!data?.files || data.files.length === 0) {
    return (
      <Card className="overflow-hidden animate-fade-in">
        <CardContent className="p-6">
          <p className="text-muted-foreground">No files available for download</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden animate-fade-in">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-accent-teal">
          {data.title || 'Downloads'}
        </h3>
        {data.description && (
          <p className="text-muted-foreground mb-4">{data.description}</p>
        )}
        
        <div className="space-y-3">
          {data.files.map((file, index) => {
            const FileIcon = getFileIcon(file.type);
            
            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileIcon className="h-5 w-5 text-accent-teal" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    {file.size && (
                      <p className="text-sm text-muted-foreground">{file.size}</p>
                    )}
                  </div>
                </div>
                
                <Button variant="teal" size="sm" asChild>
                  <a
                    href={file.url}
                    download={file.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
