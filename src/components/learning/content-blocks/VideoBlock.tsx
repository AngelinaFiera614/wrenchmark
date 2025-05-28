
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoBlockProps {
  data: {
    url: string;
    title?: string;
    description?: string;
    thumbnail?: string;
    autoplay?: boolean;
  };
}

export default function VideoBlock({ data }: VideoBlockProps) {
  const [isLoaded, setIsLoaded] = useState(data.autoplay || false);

  const getVideoEmbedUrl = (url: string) => {
    // YouTube
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Vimeo
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    
    // Return original URL for direct video files
    return url;
  };

  const isDirectVideo = data.url.match(/\.(mp4|webm|ogg)$/i);
  const embedUrl = getVideoEmbedUrl(data.url);

  return (
    <Card className="overflow-hidden animate-fade-in">
      <CardContent className="p-6">
        {data.title && (
          <h3 className="text-xl font-semibold mb-2 text-accent-teal">{data.title}</h3>
        )}
        {data.description && (
          <p className="text-muted-foreground mb-4">{data.description}</p>
        )}
        
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
          {!isLoaded ? (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-cover bg-center cursor-pointer group"
              style={{ 
                backgroundImage: data.thumbnail ? `url(${data.thumbnail})` : 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)'
              }}
              onClick={() => setIsLoaded(true)}
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
              <Button size="lg" variant="teal" className="relative z-10">
                <Play className="mr-2 h-5 w-5" />
                Play Video
              </Button>
            </div>
          ) : isDirectVideo ? (
            <video 
              controls 
              className="w-full h-full"
              autoPlay={data.autoplay}
            >
              <source src={data.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <iframe
              src={embedUrl}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
        
        <div className="flex justify-end mt-3">
          <Button variant="outline" size="sm" asChild>
            <a href={data.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Original
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
