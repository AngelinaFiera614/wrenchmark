
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserSkill } from "@/types/course";

interface SkillBadgeProps {
  skill: UserSkill;
  showLevel?: boolean;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, showLevel = true }) => {
  // Generate a color based on the skill category or level
  const getColorClass = (skill: UserSkill) => {
    const category = skill.skill_category?.toLowerCase() || '';
    
    if (category.includes('engine')) return 'bg-red-500/10 text-red-500 border-red-500/20';
    if (category.includes('electrical')) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    if (category.includes('handling')) return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    if (category.includes('safety')) return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (category.includes('maint')) return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    
    // Fallback: use level to determine color
    if (skill.level >= 10) return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    if (skill.level >= 5) return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
    
    return 'bg-accent-teal/10 text-accent-teal border-accent-teal/20';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={getColorClass(skill)}
          >
            {skill.skill_name || skill.skill_id}
            {showLevel && skill.level > 0 && (
              <span className="ml-1 opacity-80">Lv.{skill.level}</span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <p className="font-medium">{skill.skill_name}</p>
            {skill.level > 0 && (
              <p>Level: {skill.level}</p>
            )}
            {skill.skill_category && (
              <p>Category: {skill.skill_category}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SkillBadge;
