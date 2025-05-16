
import React from "react";

interface SkillMediaProps {
  videoUrl?: string | null;
  imageUrl?: string | null;
  title: string;
}

const SkillMedia: React.FC<SkillMediaProps> = ({ videoUrl, imageUrl, title }) => {
  if (!videoUrl && !imageUrl) {
    return null;
  }
  
  return (
    <div className="mb-8 rounded-lg overflow-hidden">
      {videoUrl ? (
        <iframe
          width="100%"
          height="400"
          src={videoUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="border-0"
        ></iframe>
      ) : imageUrl && (
        <img 
          src={imageUrl} 
          alt={title}
          className="rounded-lg w-full max-h-[400px] object-cover"
        />
      )}
    </div>
  );
};

export default SkillMedia;
