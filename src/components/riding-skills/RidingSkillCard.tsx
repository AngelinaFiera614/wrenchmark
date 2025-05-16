
import { RidingSkill } from "@/types/riding-skills";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, VideoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface RidingSkillCardProps {
  skill: RidingSkill;
}

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Beginner':
      return 'bg-green-600/20 text-green-400';
    case 'Intermediate':
      return 'bg-blue-600/20 text-blue-400';
    case 'Advanced':
      return 'bg-amber-600/20 text-amber-400';
    default:
      return 'bg-accent-teal/20 text-accent-teal';
  }
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Parking lot': 'bg-slate-600/20 text-slate-400',
    'Low-speed': 'bg-indigo-600/20 text-indigo-400',
    'Highway': 'bg-cyan-600/20 text-cyan-400',
    'Off-road': 'bg-orange-600/20 text-orange-400',
    'Emergency': 'bg-red-600/20 text-red-400',
    'City': 'bg-violet-600/20 text-violet-400',
    'Advanced control': 'bg-fuchsia-600/20 text-fuchsia-400'
  };
  
  return colors[category] || 'bg-accent-teal/20 text-accent-teal';
};

const RidingSkillCard = ({ skill }: RidingSkillCardProps) => {
  const { title, level, category, difficulty, instructions, image_url, video_url } = skill;
  
  // Truncate instructions for the card preview
  const previewInstructions = instructions.length > 120 
    ? `${instructions.substring(0, 120)}...` 
    : instructions;
  
  return (
    <Card className="overflow-hidden border-border/40 bg-background/80 backdrop-blur-sm transition-all hover:border-accent-teal/50 h-full flex flex-col">
      {image_url && (
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={image_url} 
            alt={title}
            className="object-cover w-full h-full"
          />
          {video_url && (
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className="bg-background/60 backdrop-blur-sm">
                <VideoIcon className="h-3 w-3 mr-1 text-accent-teal" />
                Video
              </Badge>
            </div>
          )}
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge className={cn("font-medium", getLevelColor(level))}>
            {level}
          </Badge>
          <Badge className={cn("font-medium", getCategoryColor(category))}>
            {category}
          </Badge>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-muted-foreground">{previewInstructions}</p>
        
        {difficulty && (
          <div className="mt-4 flex items-center">
            <span className="text-xs text-muted-foreground mr-2">Difficulty:</span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i}
                  className={`w-2 h-4 mx-0.5 rounded-sm ${i < difficulty ? 'bg-accent-teal' : 'bg-muted'}`}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          asChild 
          variant="ghost" 
          className="w-full justify-between hover:bg-accent-teal/10 hover:text-accent-teal group"
        >
          <Link to={`/riding-skills/${skill.id}`}>
            View details
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RidingSkillCard;
