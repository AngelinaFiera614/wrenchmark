
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brand, MediaItem } from "@/types";

interface BrandMediaProps {
  brand: Brand;
}

export default function BrandMedia({ brand }: BrandMediaProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  
  // Close lightbox when clicking outside the image
  const closeLightbox = () => {
    setSelectedMedia(null);
  };

  return (
    <div className="space-y-6">
      {/* Media Gallery */}
      {brand.media_gallery && brand.media_gallery.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {brand.media_gallery.map((item, index) => (
            <div 
              key={index} 
              className="bg-muted rounded-md overflow-hidden cursor-pointer aspect-square"
              onClick={() => setSelectedMedia(item)}
            >
              {item.type === 'image' ? (
                <img 
                  src={item.url} 
                  alt={item.caption || `${brand.name} media ${index + 1}`}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              ) : (
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-white">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>
                  <img 
                    src={item.url.replace(/\.(mp4|webm)$/, ".jpg")} 
                    alt={item.caption || `${brand.name} video thumbnail`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center p-6">
            <p className="text-muted-foreground">No media available for this brand.</p>
          </CardContent>
        </Card>
      )}
      
      {/* Lightbox */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div 
            className="max-w-4xl max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMedia.type === 'image' ? (
              <img 
                src={selectedMedia.url} 
                alt={selectedMedia.caption || "Brand media"} 
                className="max-w-full max-h-[80vh] object-contain"
              />
            ) : (
              <video 
                src={selectedMedia.url} 
                controls 
                className="max-w-full max-h-[80vh]"
              />
            )}
            
            {selectedMedia.caption && (
              <div className="bg-black/60 p-2 absolute bottom-0 left-0 right-0">
                <p className="text-white">{selectedMedia.caption}</p>
                {selectedMedia.year && <p className="text-white/70 text-sm">{selectedMedia.year}</p>}
              </div>
            )}
          </div>
          
          <button 
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white"
            onClick={closeLightbox}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
