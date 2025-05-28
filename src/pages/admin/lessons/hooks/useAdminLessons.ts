
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLessonsByCourseId, deleteLesson } from "@/services/lessonService";
import { getCourseById } from "@/services/courseService";
import { Lesson, Course } from "@/types/course";
import { toast } from "sonner";

export function useAdminLessons() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const [selectedLessonForQuiz, setSelectedLessonForQuiz] = useState<Lesson | null>(null);
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState<boolean>(false);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState<boolean>(false);

  // Load course and lessons
  useEffect(() => {
    const loadData = async () => {
      if (!courseId) return;

      try {
        setLoading(true);

        // Load course details
        const courseData = await getCourseById(courseId);
        if (!courseData) {
          toast.error("Course not found");
          navigate("/admin/courses");
          return;
        }
        setCourse(courseData);

        // Load lessons
        const lessonsData = await getLessonsByCourseId(courseId);
        setLessons(lessonsData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load course data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseId, navigate]);

  // Filter lessons by search query
  const filteredLessons = lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Delete a lesson
  const handleDelete = async (id: string) => {
    try {
      await deleteLesson(id);
      setLessons(lessons.filter((lesson) => lesson.id !== id));
      toast.success("Lesson deleted successfully");
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast.error("Failed to delete lesson");
    }
  };

  // Open the edit dialog
  const handleEdit = (lesson: Lesson) => {
    setEditLesson(lesson);
    setIsLessonDialogOpen(true);
  };

  // Open quiz dialog
  const handleManageQuiz = (lesson: Lesson) => {
    setSelectedLessonForQuiz(lesson);
    setIsQuizDialogOpen(true);
  };

  // Handle lesson creation/edit success
  const handleLessonFormSuccess = () => {
    if (courseId) {
      getLessonsByCourseId(courseId).then(lessonsData => {
        setLessons(lessonsData.sort((a, b) => a.order - b.order));
      });
    }
    setIsLessonDialogOpen(false);
    setEditLesson(null);
  };

  return {
    courseId,
    lessons,
    course,
    loading,
    searchQuery,
    setSearchQuery,
    filteredLessons,
    editLesson,
    setEditLesson,
    selectedLessonForQuiz,
    setSelectedLessonForQuiz,
    isLessonDialogOpen,
    setIsLessonDialogOpen,
    isQuizDialogOpen,
    setIsQuizDialogOpen,
    handleDelete,
    handleEdit,
    handleManageQuiz,
    handleLessonFormSuccess
  };
}
