
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useLessonForm } from './lesson-form/useLessonForm';
import LessonFormTabs from './lesson-form/LessonFormTabs';

interface LessonFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson?: any;
  courseId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  existingLessons?: any[];
}

export default function LessonFormDialog({
  open,
  onOpenChange,
  lesson,
  courseId,
  onSuccess,
  onCancel
}: LessonFormDialogProps) {
  const {
    form,
    isPending,
    isEditing,
    contentBlocks,
    setContentBlocks,
    handleTitleChange,
    onSubmit
  } = useLessonForm({ lesson, courseId, onSuccess, onOpenChange, open });

  const handleCancel = () => {
    onOpenChange(false);
    onCancel?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Lesson' : 'Create New Lesson'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Make changes to the lesson details below.'
              : 'Add a new lesson to this course with modular content blocks.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <LessonFormTabs
              form={form}
              isEditing={isEditing}
              contentBlocks={contentBlocks}
              setContentBlocks={setContentBlocks}
              onTitleChange={handleTitleChange}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isEditing ? 'Update Lesson' : 'Create Lesson'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
