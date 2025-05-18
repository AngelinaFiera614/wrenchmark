
import React from "react";
import { Link } from "react-router-dom";
import { Lesson } from "@/types/course";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonSidebarProps {
  lessons: Lesson[];
  currentLessonId?: string;
  courseSlug: string;
  completedLessons: string[];
}

const LessonSidebar: React.FC<LessonSidebarProps> = ({
  lessons,
  currentLessonId,
  courseSlug,
  completedLessons
}) => {
  return (
    <div className="bg-card border border-border rounded-md h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold">Course Lessons</h2>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-1">
          {lessons.map((lesson) => {
            const isActive = lesson.id === currentLessonId;
            const isCompleted = completedLessons.includes(lesson.id);
            
            return (
              <Link
                key={lesson.id}
                to={`/courses/${courseSlug}/${lesson.slug}`}
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/20",
                    isCompleted && !isActive && "text-accent-teal hover:text-accent-teal hover:bg-accent-teal/10"
                  )}
                >
                  <div className="flex items-center w-full">
                    <div className="mr-2">
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-accent-teal" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </div>
                    <span className="truncate">{lesson.title}</span>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LessonSidebar;
