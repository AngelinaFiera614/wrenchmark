
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export interface CourseFormDialogProps {
  onOpenChange: (open: boolean) => void;
  open?: boolean;
  course: any | null;
  onSuccess: (course: any) => Promise<void>;
}

const CourseFormDialog: React.FC<CourseFormDialogProps> = ({ 
  open, 
  onOpenChange, 
  course, 
  onSuccess 
}) => {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{course ? 'Edit Course' : 'Create New Course'}</DialogTitle>
      </DialogHeader>
      <div className="p-4">
        {/* Form content would go here */}
        <p>Course form placeholder - the actual form implementation is read-only.</p>
      </div>
    </DialogContent>
  );
};

export default CourseFormDialog;
