
import React from "react";
import { Dialog } from "@/components/ui/dialog";
import LessonFormDialog from "@/components/admin/courses/LessonFormDialog";
import QuizFormDialog from "@/components/admin/courses/QuizFormDialog";
import { Lesson } from "@/types/course";

interface AdminLessonsDialogsProps {
  courseId: string;
  editLesson: Lesson | null;
  setEditLesson: (lesson: Lesson | null) => void;
  selectedLessonForQuiz: Lesson | null;
  setSelectedLessonForQuiz: (lesson: Lesson | null) => void;
  isLessonDialogOpen: boolean;
  setIsLessonDialogOpen: (open: boolean) => void;
  isQuizDialogOpen: boolean;
  setIsQuizDialogOpen: (open: boolean) => void;
  handleLessonFormSuccess: () => void;
  lessons: Lesson[];
}

export default function AdminLessonsDialogs({
  courseId,
  editLesson,
  setEditLesson,
  selectedLessonForQuiz,
  setSelectedLessonForQuiz,
  isLessonDialogOpen,
  setIsLessonDialogOpen,
  isQuizDialogOpen,
  setIsQuizDialogOpen,
  handleLessonFormSuccess,
  lessons
}: AdminLessonsDialogsProps) {
  return (
    <>
      <LessonFormDialog
        open={isLessonDialogOpen}
        onOpenChange={setIsLessonDialogOpen}
        lesson={editLesson}
        courseId={courseId}
        onSuccess={handleLessonFormSuccess}
        onCancel={() => {
          setIsLessonDialogOpen(false);
          setEditLesson(null);
        }}
        existingLessons={lessons}
      />

      <Dialog open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen}>
        {selectedLessonForQuiz && (
          <QuizFormDialog
            lessonId={selectedLessonForQuiz.id}
            lessonTitle={selectedLessonForQuiz.title}
            onSuccess={() => {
              setIsQuizDialogOpen(false);
              setSelectedLessonForQuiz(null);
            }}
            onCancel={() => {
              setIsQuizDialogOpen(false);
              setSelectedLessonForQuiz(null);
            }}
          />
        )}
      </Dialog>
    </>
  );
}
