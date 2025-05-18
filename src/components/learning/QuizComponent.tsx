
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { LessonQuiz } from '@/types/course';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import CompleteLessonButton from './CompleteLessonButton';

export interface QuizComponentProps {
  quiz: LessonQuiz;
  lessonId: string;
  onComplete: () => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({
  quiz,
  lessonId,
  onComplete
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    new Array(quiz.questions.length).fill(-1)
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const handleAnswerSelect = (answerIndex: number) => {
    if (isSubmitted) return;
    
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correct++;
      }
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };
  
  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowResults(true);
  };
  
  const currentQuiz = quiz.questions[currentQuestion];
  const isCorrect = selectedAnswers[currentQuestion] === currentQuiz.correct_answer;
  const score = calculateScore();
  const isPassing = score >= quiz.passing_score;

  if (showResults) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-4xl font-bold mb-2">{score}%</p>
            <p className="text-lg">
              {isPassing ? (
                <span className="text-accent-teal">You passed!</span>
              ) : (
                <span className="text-red-500">You didn't pass. Try again.</span>
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Needed {quiz.passing_score}% to pass
            </p>
          </div>
          
          <div className="space-y-4 mt-6">
            {quiz.questions.map((q, i) => {
              const isQuestionCorrect = selectedAnswers[i] === q.correct_answer;
              return (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    {isQuestionCorrect ? (
                      <CheckCircle className="h-5 w-5 text-accent-teal flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-medium mb-2">{q.question}</h4>
                      <div className="pl-2 border-l-2 border-muted">
                        <p className="text-sm mb-1">
                          Your answer: 
                          <span className={!isQuestionCorrect ? "text-red-400" : "text-accent-teal"}>
                            {' '}{selectedAnswers[i] >= 0 ? q.options[selectedAnswers[i]] : "Not answered"}
                          </span>
                        </p>
                        {!isQuestionCorrect && (
                          <p className="text-sm text-accent-teal">
                            Correct answer: {q.options[q.correct_answer]}
                          </p>
                        )}
                        {q.explanation && (
                          <p className="text-sm text-muted-foreground mt-2">{q.explanation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <CompleteLessonButton 
            lessonId={lessonId} 
            isCompleted={false} 
            onComplete={onComplete} 
            quizScore={score}
          />
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="text-lg font-medium">{currentQuiz.question}</h3>
        <RadioGroup 
          value={selectedAnswers[currentQuestion].toString()}
          onValueChange={(value) => handleAnswerSelect(parseInt(value))}
        >
          {currentQuiz.options.map((option, i) => (
            <div key={i} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={i.toString()} 
                id={`answer-${i}`}
                disabled={isSubmitted}
              />
              <Label 
                htmlFor={`answer-${i}`}
                className={cn(
                  isSubmitted && i === currentQuiz.correct_answer && "text-accent-teal",
                  isSubmitted && i !== currentQuiz.correct_answer && selectedAnswers[currentQuestion] === i && "text-red-400"
                )}
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        {isSubmitted && (
          <div className="mt-4 p-3 border rounded-lg bg-background/50">
            {isCorrect ? (
              <p className="text-accent-teal flex gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Correct! {currentQuiz.explanation}</span>
              </p>
            ) : (
              <p className="text-red-400 flex gap-2">
                <XCircle className="h-5 w-5" />
                <span>
                  Incorrect. The correct answer is: {currentQuiz.options[currentQuiz.correct_answer]}
                  {currentQuiz.explanation && `. ${currentQuiz.explanation}`}
                </span>
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          onClick={handlePrevQuestion}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        
        <div className="flex gap-2">
          {currentQuestion === quiz.questions.length - 1 && !isSubmitted ? (
            <Button onClick={handleSubmit} disabled={selectedAnswers.includes(-1)}>
              Submit Quiz
            </Button>
          ) : (
            <Button 
              onClick={handleNextQuestion}
              disabled={currentQuestion === quiz.questions.length - 1 || selectedAnswers[currentQuestion] === -1}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuizComponent;

// Add the missing cn function import
import { cn } from '@/lib/utils';
