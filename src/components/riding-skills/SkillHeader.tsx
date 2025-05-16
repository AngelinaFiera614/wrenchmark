
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { RidingSkill } from "@/types/riding-skills";

interface SkillHeaderProps {
  skill: RidingSkill;
}

const SkillHeader: React.FC<SkillHeaderProps> = ({ skill }) => {
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

  return (
    <div className="mb-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground mb-4">
        <Link to="/" className="hover:text-accent-teal">Home</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link to="/riding-skills" className="hover:text-accent-teal">Riding Skills</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-foreground truncate max-w-[200px]">{skill.title}</span>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        asChild
        className="mb-6 hover:bg-accent-teal/10 hover:text-accent-teal"
      >
        <Link to="/riding-skills">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to all skills
        </Link>
      </Button>

      {/* Header section */}
      <div>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={`font-medium ${getLevelColor(skill.level)}`}>
            {skill.level}
          </Badge>
          <Badge className="bg-accent-teal/20 text-accent-teal">
            {skill.category}
          </Badge>
          {skill.difficulty && (
            <Badge variant="outline" className="flex items-center gap-1">
              <span>Difficulty:</span>
              <div className="flex ml-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i}
                    className={`w-1.5 h-3 mx-0.5 rounded-sm ${i < skill.difficulty! ? 'bg-accent-teal' : 'bg-muted'}`}
                  />
                ))}
              </div>
            </Badge>
          )}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {skill.title}
        </h1>
      </div>
    </div>
  );
};

export default SkillHeader;
