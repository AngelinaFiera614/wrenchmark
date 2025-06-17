
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface Hotspot {
  x: number;
  y: number;
  title: string;
  content: string;
  link?: string;
}

interface InteractiveImageBlockProps {
  data: {
    image_url: string;
    alt_text: string;
    hotspots: Hotspot[];
  };
}

export default function InteractiveImageBlock({ data }: InteractiveImageBlockProps) {
  const { image_url, alt_text, hotspots = [] } = data;
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="relative inline-block">
          <img
            src={image_url}
            alt={alt_text}
            className="max-w-full h-auto rounded-lg"
          />
          
          {hotspots.map((hotspot, index) => (
            <button
              key={index}
              className="absolute w-6 h-6 bg-accent-teal text-black rounded-full flex items-center justify-center text-xs font-bold hover:scale-110 transition-transform cursor-pointer shadow-lg"
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => setSelectedHotspot(hotspot)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        
        <Dialog open={!!selectedHotspot} onOpenChange={() => setSelectedHotspot(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedHotspot?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm leading-relaxed">{selectedHotspot?.content}</p>
              {selectedHotspot?.link && (
                <Button asChild variant="outline" size="sm">
                  <a
                    href={selectedHotspot.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    Learn More
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
