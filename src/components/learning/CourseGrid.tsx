
import React from "react";
import { CourseWithProgress } from "@/types/course";
import CourseCard from "./CourseCard";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseGridProps {
  courses: CourseWithProgress[];
  loading?: boolean;
}

const CourseGrid: React.FC<CourseGridProps> = ({ courses, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="h-full">
            <div className="w-full aspect-video rounded-t-md overflow-hidden">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="pt-2">
                <Skeleton className="h-2 w-full" />
              </div>
              <div className="flex justify-between pt-1">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-muted-foreground">No courses available</h3>
        <p className="text-muted-foreground">Check back soon for new learning content</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseGrid;
