
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getCoursesWithProgress } from "@/services/courseService";
import { CourseWithProgress } from "@/types/course";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import CourseGrid from "@/components/learning/CourseGrid";

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const coursesData = await getCoursesWithProgress();
        setCourses(coursesData);
      } catch (error) {
        console.error("Error loading courses:", error);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [user]);

  return (
    <>
      <Helmet>
        <title>Courses | Wrenchmark</title>
      </Helmet>
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Courses</h1>
          <p className="text-muted-foreground">
            Learn motorcycle maintenance, riding techniques, and more with our interactive courses
          </p>
        </div>

        <CourseGrid courses={courses} loading={loading} />
      </div>
    </>
  );
};

export default CoursesPage;
