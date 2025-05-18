
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CourseWithProgress } from "@/types/course";

interface CourseCardProps {
  course: CourseWithProgress;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Link to={`/courses/${course.slug}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow bg-card border-border">
        <div className="relative w-full aspect-video overflow-hidden">
          {course.image_url ? (
            <img 
              src={course.image_url} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{course.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description || "No description available"}
          </p>
        </CardContent>
        
        <CardFooter className="flex flex-col items-stretch gap-2">
          {course.progress && (
            <div className="w-full">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{course.progress.progress_percentage}%</span>
              </div>
              <Progress 
                value={course.progress.progress_percentage} 
                className="h-2 bg-muted" 
              />
            </div>
          )}
          
          <div className="flex justify-between items-center w-full mt-1">
            {course.progress && course.progress.progress_percentage > 0 && course.progress.progress_percentage < 100 && (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                In Progress
              </Badge>
            )}
            
            {course.progress && course.progress.progress_percentage === 100 && (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                Completed
              </Badge>
            )}
            
            {(!course.progress || course.progress.progress_percentage === 0) && (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                Start Learning
              </Badge>
            )}
            
            {course.progress && (
              <span className="text-xs text-muted-foreground">
                {course.progress.completed_lessons}/{course.progress.total_lessons} lessons
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCard;
