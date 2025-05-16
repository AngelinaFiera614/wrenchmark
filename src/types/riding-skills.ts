
export type RidingSkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type RidingSkillCategory = 'Parking lot' | 'Low-speed' | 'Highway' | 'Off-road' | 'Emergency' | 'City' | 'Advanced control';

export interface RidingSkill {
  id: string;
  title: string;
  level: RidingSkillLevel;
  category: RidingSkillCategory | string;
  instructions: string;
  practice_layout: string;
  difficulty?: number;
  image_url?: string | null;
  video_url?: string | null;
  created_at: string;
  updated_at: string;
}
