
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { completeLesson } from "@/services/lessonService";
import { toast } from "sonner";
import { useAuth } from "@/context/auth";

interface CompleteLessonButtonProps {
  lessonId: string;
  isCompleted: boolean;
  onComplete?: () => void;
  quizScore?: number;
  hasQuiz?: boolean;
  onStartQuiz?: () => void;
}

const CompleteLessonButton: React.FC<CompleteLessonButtonProps> = ({
  lessonId,
  isCompleted,
  onComplete,
  quizScore,
  hasQuiz = false,
  onStartQuiz
}) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleComplete = async () => {
    if (!user) {
      toast.error("You need to sign in to track your progress");
      return;
    }
    
    setLoading(true);
    try {
      await completeLesson(lessonId, quizScore);
      toast.success("Lesson marked as completed");
      onComplete?.();
    } catch (error) {
      console.error("Error completing lesson:", error);
      toast.error("Failed to mark lesson as complete");
    } finally {
      setLoading(false);
    }
  };

  if (isCompleted) {
    return (
      <Button variant="outline" disabled className="w-full sm:w-auto">
        <CheckCircle2 className="mr-2 h-4 w-4 text-accent-teal" />
        Completed
      </Button>
    );
  }
  
  if (hasQuiz && onStartQuiz) {
    return (
      <Button 
        onClick={onStartQuiz}
        className="w-full sm:w-auto"
      >
        Take Quiz to Complete
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleComplete}
      disabled={loading}
      className="w-full sm:w-auto"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Mark as Complete
        </>
      )}
    </Button>
  );
};

export default CompleteLessonButton;
