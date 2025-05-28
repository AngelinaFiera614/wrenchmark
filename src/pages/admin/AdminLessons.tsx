
import React from "react";
import { useAdminLessons } from "./lessons/hooks/useAdminLessons";
import AdminLessonsHeader from "./lessons/components/AdminLessonsHeader";
import AdminLessonsSearch from "./lessons/components/AdminLessonsSearch";
import AdminLessonsTable from "./lessons/components/AdminLessonsTable";
import AdminLessonsDialogs from "./lessons/components/AdminLessonsDialogs";

const AdminLessons: React.FC = () => {
  const {
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
  } = useAdminLessons();

  return (
    <div className="p-4 md:p-6">
      <AdminLessonsHeader
        course={course}
        loading={loading}
        isLessonDialogOpen={isLessonDialogOpen}
        setIsLessonDialogOpen={setIsLessonDialogOpen}
      />

      <div className="bg-card border rounded-md">
        <AdminLessonsSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className="overflow-x-auto">
          <AdminLessonsTable
            loading={loading}
            filteredLessons={filteredLessons}
            lessons={lessons}
            handleEdit={handleEdit}
            handleManageQuiz={handleManageQuiz}
            handleDelete={handleDelete}
          />
        </div>
      </div>

      <AdminLessonsDialogs
        courseId={courseId || ""}
        editLesson={editLesson}
        setEditLesson={setEditLesson}
        selectedLessonForQuiz={selectedLessonForQuiz}
        setSelectedLessonForQuiz={setSelectedLessonForQuiz}
        isLessonDialogOpen={isLessonDialogOpen}
        setIsLessonDialogOpen={setIsLessonDialogOpen}
        isQuizDialogOpen={isQuizDialogOpen}
        setIsQuizDialogOpen={setIsQuizDialogOpen}
        handleLessonFormSuccess={handleLessonFormSuccess}
        lessons={lessons}
      />
    </div>
  );
};

export default AdminLessons;
