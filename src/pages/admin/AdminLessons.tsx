import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getLessonsByCourseId, deleteLesson } from "@/services/lessonService";
import { getCourseById } from "@/services/courseService";
import { Lesson, Course } from "@/types/course";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  ListFilter,
  ArrowLeft,
  FileText,
  QrCode,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import LessonFormDialog from "@/components/admin/courses/LessonFormDialog";
import QuizFormDialog from "@/components/admin/courses/QuizFormDialog";

const AdminLessons: React.FC = () => {
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

  // Handle lesson creation/edit
  const handleLessonFormSuccess = () => {
    // Load lessons after a successful operation
    if (courseId) {
      getLessonsByCourseId(courseId).then(lessonsData => {
        setLessons(lessonsData.sort((a, b) => a.order - b.order));
      });
    }
    setIsLessonDialogOpen(false);
    setEditLesson(null);
  };

  return (
    <div className="p-4 md:p-6">
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
          <LessonFormDialog
            lesson={editLesson}
            courseId={courseId || ""}
            onSuccess={handleLessonFormSuccess}
            onCancel={() => {
              setIsLessonDialogOpen(false);
              setEditLesson(null);
            }}
            existingLessons={lessons}
          />
        </Dialog>
      </div>

      <div className="bg-card border rounded-md">
        <div className="p-4 flex items-center gap-4 border-b">
          <div className="relative flex-1">
            <ListFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Has Quiz</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-5 w-8" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-48" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-8 float-right" />
                      </TableCell>
                    </TableRow>
                  ))
              ) : filteredLessons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-12 w-12 text-muted-foreground/50" />
                      <h3 className="font-medium text-lg">No lessons found</h3>
                      <p className="text-sm text-muted-foreground">
                        {lessons.length === 0
                          ? "Add your first lesson to get started"
                          : "Try adjusting your search query"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLessons.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell>{lesson.order}</TableCell>
                    <TableCell className="font-medium">{lesson.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          lesson.published
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }
                      >
                        {lesson.published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {/* This would need logic to check if there's a quiz */}
                        TODO
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(lesson)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleManageQuiz(lesson)}>
                            <QrCode className="mr-2 h-4 w-4" />
                            Manage Quiz
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{lesson.title}"?
                                  This will also delete any quizzes associated
                                  with this lesson. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(lesson.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Quiz Dialog */}
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
    </div>
  );
};

export default AdminLessons;
