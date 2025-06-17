
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'drag_drop';
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  points: number;
}

interface InteractiveQuizBlockProps {
  data: {
    questions: Question[];
    passing_score: number;
    allow_retries: boolean;
    show_results: boolean;
  };
}

export default function InteractiveQuizBlock({ data }: InteractiveQuizBlockProps) {
  const { questions, passing_score = 70, allow_retries = true, show_results = true } = data;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) {
        correct += q.points;
      }
    });
    return (correct / questions.reduce((sum, q) => sum + q.points, 0)) * 100;
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setSubmitted(true);
    
    if (finalScore >= passing_score) {
      toast.success(`Quiz completed! Score: ${finalScore.toFixed(1)}%`);
    } else {
      toast.error(`Score: ${finalScore.toFixed(1)}%. Passing score is ${passing_score}%`);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setCurrentQuestion(0);
    setScore(0);
  };

  const question = questions[currentQuestion];

  if (!questions || questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No quiz questions available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Interactive Quiz</span>
          <span className="text-sm font-normal text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!submitted ? (
          <>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{question.question}</h3>
              
              {question.type === 'multiple_choice' && (
                <RadioGroup
                  value={answers[question.id] || ''}
                  onValueChange={(value) => handleAnswer(question.id, value)}
                >
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                      <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {question.type === 'true_false' && (
                <RadioGroup
                  value={answers[question.id] || ''}
                  onValueChange={(value) => handleAnswer(question.id, value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id={`${question.id}-true`} />
                    <Label htmlFor={`${question.id}-true`}>True</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id={`${question.id}-false`} />
                    <Label htmlFor={`${question.id}-false`}>False</Label>
                  </div>
                </RadioGroup>
              )}
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              {currentQuestion === questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length !== questions.length}
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                >
                  Next
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            {show_results && (
              <>
                <div className="text-center space-y-2">
                  <div className={`text-2xl font-bold ${score >= passing_score ? 'text-green-600' : 'text-red-600'}`}>
                    {score >= passing_score ? (
                      <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                    ) : (
                      <XCircle className="w-8 h-8 mx-auto mb-2" />
                    )}
                    Score: {score.toFixed(1)}%
                  </div>
                  <p className="text-muted-foreground">
                    {score >= passing_score ? 'Quiz passed!' : `Passing score is ${passing_score}%`}
                  </p>
                </div>

                <div className="space-y-3">
                  {questions.map((q, index) => {
                    const isCorrect = answers[q.id] === q.correct_answer;
                    return (
                      <div key={q.id} className="border rounded-lg p-4">
                        <div className="flex items-start space-x-2">
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{q.question}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Your answer: {answers[q.id] || 'Not answered'}
                            </p>
                            {!isCorrect && (
                              <p className="text-sm text-green-600 mt-1">
                                Correct answer: {q.correct_answer}
                              </p>
                            )}
                            {q.explanation && (
                              <p className="text-sm text-muted-foreground mt-2 italic">
                                {q.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {allow_retries && score < passing_score && (
              <div className="text-center">
                <Button onClick={handleRetry} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retry Quiz
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
