
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import { useLessonForm } from './lesson-form/useLessonForm';
import LessonFormTabs from './lesson-form/LessonFormTabs';
import LessonTemplateGallery from './lesson-templates/LessonTemplateGallery';
import { LessonTemplate } from '@/services/lessonTemplateService';
import { useState } from 'react';
import { toast } from 'sonner';

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
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  
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

  const handleTemplateApply = (template: LessonTemplate) => {
    // Apply template data to form
    form.setValue('title', template.name);
    setContentBlocks(template.template_blocks);
    
    // Set other form fields if template contains them
    if (template.description) {
      form.setValue('content', template.description);
    }
    
    toast.success(`Applied template: ${template.name}`);
    setShowTemplateGallery(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>{isEditing ? 'Edit Lesson' : 'Create New Lesson'}</DialogTitle>
                <DialogDescription>
                  {isEditing 
                    ? 'Make changes to the lesson details below.'
                    : 'Add a new lesson to this course with modular content blocks.'}
                </DialogDescription>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTemplateGallery(true)}
                  className="flex items-center gap-2"
                >
                  <Bookmark className="h-4 w-4" />
                  Use Template
                </Button>
              )}
            </div>
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

      <LessonTemplateGallery
        open={showTemplateGallery}
        onOpenChange={setShowTemplateGallery}
        onTemplateApply={handleTemplateApply}
      />
    </>
  );
}
