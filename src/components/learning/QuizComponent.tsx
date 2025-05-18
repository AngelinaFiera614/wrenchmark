
import React, { useState } from "react";
import { LessonQuiz, QuizQuestion } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface QuizComponentProps {
  quiz: LessonQuiz;
  onComplete: (score: number) => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ quiz, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>(Array(quiz.questions.length).fill(-1));
  const [showResults, setShowResults] = useState<boolean>(false);
  const [currentScore, setCurrentScore] = useState<number>(0);
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  
  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate score
      let score = 0;
      quiz.questions.forEach((question, index) => {
        if (answers[index] === question.correct_answer) {
          score++;
        }
      });
      
      const scorePercentage = Math.round((score / quiz.questions.length) * 100);
      setCurrentScore(scorePercentage);
      setShowResults(true);
      
      // Pass the score to parent
      onComplete(scorePercentage);
    }
  };
  
  const isPassed = currentScore >= quiz.passing_score;
  
  if (showResults) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Quiz Results</CardTitle>
          <CardDescription>
            You scored {currentScore}% ({currentScore >= quiz.passing_score ? "Passed" : "Failed"})
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-6">
          {isPassed ? (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="text-lg">Congratulations! You've passed the quiz.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-16 w-16 text-yellow-500" />
              <p className="text-lg">You didn't reach the passing score. You can review the lesson and try again.</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz</CardTitle>
        <CardDescription>
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
          <RadioGroup
            value={answers[currentQuestionIndex].toString()}
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 py-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-base">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={answers[currentQuestionIndex] === -1}
        >
          {currentQuestionIndex === quiz.questions.length - 1 ? "Finish" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizComponent;
