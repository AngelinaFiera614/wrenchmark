
import React from "react";
import { Lesson } from "@/types/course";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";

interface LessonContentProps {
  lesson: Lesson | null;
  loading?: boolean;
}

const LessonContent: React.FC<LessonContentProps> = ({ lesson, loading = false }) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-8 w-3/4 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-9/12" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!lesson) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">Lesson not found</h3>
            <p className="text-muted-foreground">The lesson you're looking for doesn't exist or is not available.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold mb-6">{lesson.title}</h1>
        <div className="prose prose-invert max-w-none">
          {lesson.content ? (
            <ReactMarkdown>{lesson.content}</ReactMarkdown>
          ) : (
            <p className="text-muted-foreground">No content available for this lesson.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonContent;
