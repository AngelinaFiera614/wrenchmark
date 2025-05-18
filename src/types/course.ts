
export interface Course {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  content: string | null;
  slug: string;
  order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface LessonQuiz {
  id: string;
  lesson_id: string;
  questions: QuizQuestion[];
  passing_score: number;
  created_at?: string;
  updated_at?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number; // Index of the correct answer
  explanation?: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  icon: string | null;
}

export interface UserProgress {
  lesson_id: string;
  completed_at: string;
  quiz_score: number | null;
}

export interface UserSkill {
  skill_id: string;
  level: number;
  updated_at: string;
  skill_name?: string;
  skill_category?: string;
  skill_icon?: string;
}

export interface CourseProgress {
  total_lessons: number;
  completed_lessons: number;
  progress_percentage: number;
}

export interface LessonSkill {
  lesson_id: string;
  skill_id: string;
  level: number;
}

export interface CourseWithProgress extends Course {
  progress?: CourseProgress;
}
