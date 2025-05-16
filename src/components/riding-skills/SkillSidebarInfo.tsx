
import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Video } from "lucide-react";

interface SkillSidebarInfoProps {
  practiceLayout: string;
  videoUrl?: string | null;
}

const SkillSidebarInfo: React.FC<SkillSidebarInfoProps> = ({ practiceLayout, videoUrl }) => {
  return (
    <div className="space-y-6">
      <div className="bg-muted/20 rounded-lg p-4">
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <MapPin className="mr-2 h-4 w-4 text-accent-teal" />
          Practice Layout
        </h3>
        <p className="text-sm text-muted-foreground">
          {practiceLayout}
        </p>
      </div>
      
      {videoUrl && (
        <div className="bg-muted/20 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <Video className="mr-2 h-4 w-4 text-accent-teal" />
            Video Tutorial
          </h3>
          <Button 
            variant="outline" 
            size="sm"
            className="w-full mt-2 border-accent-teal/50 hover:bg-accent-teal/10"
            asChild
          >
            <a href={videoUrl} target="_blank" rel="noopener noreferrer">
              Watch on YouTube
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default SkillSidebarInfo;
