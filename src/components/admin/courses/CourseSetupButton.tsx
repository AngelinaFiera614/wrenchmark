
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { setupPermitCourse } from "@/scripts/setupCourse";
import { toast } from "sonner";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
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

interface CourseSetupButtonProps {
  onSuccess?: () => void;
}

const CourseSetupButton: React.FC<CourseSetupButtonProps> = ({ onSuccess }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const runSetup = async () => {
    setIsRunning(true);
    setIsSuccess(null);
    
    try {
      await setupPermitCourse();
      setIsSuccess(true);
      toast.success("Motorcycle Permit Essentials course created successfully!");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error setting up course:", error);
      setIsSuccess(false);
      toast.error("Failed to create course. Check console for details.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="outline">
            Create Permit Course
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create Permit Course</AlertDialogTitle>
            <AlertDialogDescription>
              This will create a new "Motorcycle Permit Essentials" course with starter lessons
              and quiz content. If the course already exists, it will not be modified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {isRunning && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
              <span className="ml-2">Creating course...</span>
            </div>
          )}
          
          {isSuccess === true && (
            <div className="flex items-center gap-2 py-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Course created successfully!</span>
            </div>
          )}
          
          {isSuccess === false && (
            <div className="flex items-center gap-2 py-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>Failed to create course. Check console for details.</span>
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRunning}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                runSetup();
              }}
              disabled={isRunning}
            >
              Create Course
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CourseSetupButton;
