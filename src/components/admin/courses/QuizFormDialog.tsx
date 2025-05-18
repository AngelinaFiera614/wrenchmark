
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { getQuizForLesson, createQuizForLesson, updateQuiz, deleteQuiz } from "@/services/lessonService";
import { LessonQuiz, QuizQuestion } from "@/types/course";
import { toast } from "sonner";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2, ListReordering } from "lucide-react";
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

const MINIMUM_OPTIONS = 2;
const MAXIMUM_OPTIONS = 6;

const questionSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(1, "Question text is required"),
  options: z.array(z.string().min(1, "Option text is required")).min(MINIMUM_OPTIONS, `At least ${MINIMUM_OPTIONS} options are required`),
  correct_answer: z.number().min(0).max(MAXIMUM_OPTIONS - 1),
  explanation: z.string().optional(),
});

const quizSchema = z.object({
  passing_score: z.coerce.number().int().min(1).max(100),
  questions: z.array(questionSchema).min(1, "At least one question is required"),
});

type FormData = z.infer<typeof quizSchema>;

interface QuizFormDialogProps {
  lessonId: string;
  lessonTitle: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const QuizFormDialog: React.FC<QuizFormDialogProps> = ({
  lessonId,
  lessonTitle,
  onSuccess,
  onCancel,
}) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [existingQuiz, setExistingQuiz] = useState<LessonQuiz | null>(null);
  const [activeTab, setActiveTab] = useState<string>("question-0");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      passing_score: 70,
      questions: [
        {
          question: "",
          options: ["", ""],
          correct_answer: 0,
          explanation: "",
        },
      ],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  // Load existing quiz if available
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        const quizData = await getQuizForLesson(lessonId);
        
        if (quizData) {
          setExistingQuiz(quizData);
          
          // Transform the data structure if needed
          form.reset({
            passing_score: quizData.passing_score,
            questions: quizData.questions,
          });
        }
      } catch (error) {
        console.error("Error loading quiz:", error);
        // Non-critical error, can continue without existing quiz
      } finally {
        setLoading(false);
      }
    };
    
    loadQuiz();
  }, [lessonId, form]);

  const addQuestion = () => {
    const newQuestion = {
      question: "",
      options: ["", ""],
      correct_answer: 0,
      explanation: "",
    };
    
    append(newQuestion);
    
    // Set the active tab to the new question
    setTimeout(() => {
      setActiveTab(`question-${fields.length}`);
    }, 100);
  };

  const removeQuestion = (index: number) => {
    // Don't allow removing if it's the last question
    if (fields.length <= 1) {
      toast.error("You must have at least one question");
      return;
    }
    
    remove(index);
    
    // Update active tab if needed
    if (activeTab === `question-${index}`) {
      const newIndex = index > 0 ? index - 1 : 0;
      setActiveTab(`question-${newIndex}`);
    } else if (parseInt(activeTab.split('-')[1]) > index) {
      // Adjust tab index if a question before the active one was removed
      const currentIndex = parseInt(activeTab.split('-')[1]);
      setActiveTab(`question-${currentIndex - 1}`);
    }
  };

  const addOption = (questionIndex: number) => {
    const questions = form.getValues().questions;
    const question = questions[questionIndex];
    
    if (question.options.length >= MAXIMUM_OPTIONS) {
      toast.error(`Maximum ${MAXIMUM_OPTIONS} options allowed`);
      return;
    }
    
    const updatedOptions = [...question.options, ""];
    form.setValue(`questions.${questionIndex}.options`, updatedOptions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const questions = form.getValues().questions;
    const question = questions[questionIndex];
    
    if (question.options.length <= MINIMUM_OPTIONS) {
      toast.error(`Minimum ${MINIMUM_OPTIONS} options required`);
      return;
    }
    
    // Adjust correct_answer value if needed
    if (question.correct_answer === optionIndex) {
      form.setValue(`questions.${questionIndex}.correct_answer`, 0);
    } else if (question.correct_answer > optionIndex) {
      form.setValue(
        `questions.${questionIndex}.correct_answer`,
        question.correct_answer - 1
      );
    }
    
    const updatedOptions = [...question.options];
    updatedOptions.splice(optionIndex, 1);
    form.setValue(`questions.${questionIndex}.options`, updatedOptions);
  };

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);
      
      if (existingQuiz) {
        await updateQuiz(existingQuiz.id, {
          ...data,
          lesson_id: lessonId,
        });
        toast.success("Quiz updated successfully");
      } else {
        await createQuizForLesson({
          ...data,
          lesson_id: lessonId,
        });
        toast.success("Quiz created successfully");
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast.error(existingQuiz ? "Failed to update quiz" : "Failed to create quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuiz = async () => {
    if (!existingQuiz) return;
    
    try {
      setSubmitting(true);
      await deleteQuiz(existingQuiz.id);
      toast.success("Quiz deleted successfully");
      onSuccess();
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Failed to delete quiz");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DialogContent className="sm:max-w-[800px]">
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
          <p className="ml-2">Loading quiz...</p>
        </div>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle>{existingQuiz ? "Edit Quiz" : "Create Quiz"}</DialogTitle>
        <DialogDescription>
          {existingQuiz
            ? `Edit the quiz for "${lessonTitle}"`
            : `Create a quiz for "${lessonTitle}"`}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          <FormField
            control={form.control}
            name="passing_score"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passing Score (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Minimum percentage required to pass the quiz
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="border rounded-md p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Questions</h3>
              <Button
                type="button"
                onClick={addQuestion}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Question
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-4">
                <TabsList className="overflow-x-auto">
                  {fields.map((field, index) => (
                    <TabsTrigger
                      key={field.id}
                      value={`question-${index}`}
                      className="whitespace-nowrap"
                    >
                      Question {index + 1}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {fields.map((field, questionIndex) => (
                <TabsContent key={field.id} value={`question-${questionIndex}`}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-base">
                        Question {questionIndex + 1}
                      </CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(questionIndex)}
                        disabled={fields.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove question</span>
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`questions.${questionIndex}.question`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Question Text *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter the question"
                                rows={2}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <FormLabel>Answer Options *</FormLabel>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addOption(questionIndex)}
                            disabled={form.getValues().questions[questionIndex]?.options.length >= MAXIMUM_OPTIONS}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Option
                          </Button>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name={`questions.${questionIndex}.correct_answer`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={(value) => field.onChange(parseInt(value))}
                                  value={field.value.toString()}
                                  className="space-y-2"
                                >
                                  {form.getValues().questions[questionIndex]?.options.map((_, optionIndex) => (
                                    <div
                                      key={optionIndex}
                                      className="flex items-center space-x-2"
                                    >
                                      <RadioGroupItem
                                        value={optionIndex.toString()}
                                        id={`q${questionIndex}-option-${optionIndex}`}
                                      />
                                      <div className="flex-1">
                                        <FormField
                                          control={form.control}
                                          name={`questions.${questionIndex}.options.${optionIndex}`}
                                          render={({ field }) => (
                                            <FormItem className="flex-1 mb-0">
                                              <FormControl>
                                                <Input
                                                  placeholder={`Option ${optionIndex + 1}`}
                                                  {...field}
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeOption(questionIndex, optionIndex)}
                                        disabled={form.getValues().questions[questionIndex]?.options.length <= MINIMUM_OPTIONS}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Remove option</span>
                                      </Button>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </FormControl>
                              <FormDescription>
                                Select the correct answer
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`questions.${questionIndex}.explanation`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Explanation (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Explain why this answer is correct"
                                rows={2}
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormDescription>
                              Shown to users after they answer
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <DialogFooter className="flex justify-between gap-2">
            <div>
              {existingQuiz && (
                <AlertDialog
                  open={confirmDeleteOpen}
                  onOpenChange={setConfirmDeleteOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={submitting}
                    >
                      Delete Quiz
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this quiz? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => setConfirmDeleteOpen(false)}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteQuiz}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {existingQuiz ? "Update Quiz" : "Create Quiz"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default QuizFormDialog;
