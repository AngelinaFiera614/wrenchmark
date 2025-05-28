
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ImageGalleryBlockProps {
  data: {
    images: Array<{
      url: string;
      caption?: string;
      alt?: string;
    }>;
    title?: string;
    layout?: 'carousel' | 'grid';
  };
}

export default function ImageGalleryBlock({ data }: ImageGalleryBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const layout = data.layout || 'carousel';

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % data.images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + data.images.length) % data.images.length);
  };

  if (!data.images || data.images.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden animate-fade-in">
      <CardContent className="p-6">
        {data.title && (
          <h3 className="text-xl font-semibold mb-4 text-accent-teal">{data.title}</h3>
        )}
        
        {layout === 'carousel' ? (
          <div className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={data.images[currentIndex].url}
                alt={data.images[currentIndex].alt || data.images[currentIndex].caption || ''}
                className="w-full h-full object-cover"
              />
              
              {data.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <img
                    src={data.images[currentIndex].url}
                    alt={data.images[currentIndex].alt || data.images[currentIndex].caption || ''}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                </DialogContent>
              </Dialog>
            </div>
            
            {data.images[currentIndex].caption && (
              <p className="text-sm text-muted-foreground text-center">
                {data.images[currentIndex].caption}
              </p>
            )}
            
            {data.images.length > 1 && (
              <div className="flex justify-center space-x-2">
                {data.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-accent-teal' : 'bg-muted-foreground/30'
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.images.map((image, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer group">
                    <img
                      src={image.url}
                      alt={image.alt || image.caption || ''}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <img
                    src={image.url}
                    alt={image.alt || image.caption || ''}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                  {image.caption && (
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      {image.caption}
                    </p>
                  )}
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
