
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, ArrowLeft } from "lucide-react";
import { Course } from "@/types/course";

interface AdminLessonsHeaderProps {
  course: Course | null;
  loading: boolean;
  isLessonDialogOpen: boolean;
  setIsLessonDialogOpen: (open: boolean) => void;
}

export default function AdminLessonsHeader({
  course,
  loading,
  isLessonDialogOpen,
  setIsLessonDialogOpen
}: AdminLessonsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <Button
          variant="ghost"
          asChild
          className="mb-2"
          size="sm"
        >
          <Link to="/admin/courses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">
          {loading ? (
            <Skeleton className="h-8 w-48" />
          ) : (
            `Lessons: ${course?.title}`
          )}
        </h1>
      </div>

      <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Lesson
          </Button>
        </DialogTrigger>
      </Dialog>
    </div>
  );
}
