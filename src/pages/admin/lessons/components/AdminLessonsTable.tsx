
import React from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MoreVertical,
  Pencil,
  Trash2,
  FileText,
  QrCode,
} from "lucide-react";
import { Lesson } from "@/types/course";

interface AdminLessonsTableProps {
  loading: boolean;
  filteredLessons: Lesson[];
  lessons: Lesson[];
  handleEdit: (lesson: Lesson) => void;
  handleManageQuiz: (lesson: Lesson) => void;
  handleDelete: (id: string) => void;
}

export default function AdminLessonsTable({
  loading,
  filteredLessons,
  lessons,
  handleEdit,
  handleManageQuiz,
  handleDelete
}: AdminLessonsTableProps) {
  if (loading) {
    return (
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
          {Array(3)
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
            ))}
        </TableBody>
      </Table>
    );
  }

  if (filteredLessons.length === 0) {
    return (
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
        </TableBody>
      </Table>
    );
  }

  return (
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
        {filteredLessons.map((lesson) => (
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
        ))}
      </TableBody>
    </Table>
  );
}
