
import React, { useState, useEffect } from "react";
import { getUserSkills } from "@/services/skillsService";
import { UserSkill } from "@/types/course";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import SkillBadge from "@/components/learning/SkillBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";

const UserSkillsSection: React.FC = () => {
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadSkills = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await getUserSkills();
        setSkills(data);
      } catch (error) {
        console.error("Error loading skills:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, [user]);

  if (!user) {
    return null;
  }

  // Find max skill level for scaling
  const maxLevel = Math.max(...skills.map(skill => skill.level), 5);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Your Skills</CardTitle>
        <CardDescription>
          Skills you've developed through courses
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>Complete courses to develop your skills</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.skill_id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{skill.skill_name || skill.skill_id}</span>
                    <span className="text-xs text-muted-foreground">Lv.{skill.level}</span>
                  </div>
                  <Progress value={(skill.level / maxLevel) * 100} className="h-2" />
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Skill Tags</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <SkillBadge key={skill.skill_id} skill={skill} />
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserSkillsSection;
