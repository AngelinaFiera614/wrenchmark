
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SecureContentRenderer } from '@/components/security/SecureContentRenderer';
import { useAuth } from '@/context/auth';

interface Condition {
  type: 'skill_level' | 'progress' | 'quiz_score';
  operator: '>=' | '<=' | '==' | '!=';
  value: string;
}

interface ConditionalContentBlockProps {
  data: {
    content: string;
    conditions: Condition[];
    fallback_content: string;
  };
}

export default function ConditionalContentBlock({ data }: ConditionalContentBlockProps) {
  const { content, conditions, fallback_content } = data;
  const { user } = useAuth();
  const [shouldShowContent, setShouldShowContent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const evaluateConditions = async () => {
      if (!user) {
        setShouldShowContent(false);
        setIsLoading(false);
        return;
      }

      // For now, we'll implement basic condition evaluation
      // In a real implementation, you'd fetch user progress, skills, etc.
      try {
        let allConditionsMet = true;

        for (const condition of conditions) {
          let conditionMet = false;

          switch (condition.type) {
            case 'skill_level':
              // Mock skill level check - in real app, fetch from database
              const userSkillLevel = 5; // This would come from user_skills table
              const requiredLevel = parseInt(condition.value);
              conditionMet = evaluateOperator(userSkillLevel, condition.operator, requiredLevel);
              break;

            case 'progress':
              // Mock progress check - in real app, fetch from user_progress table
              const userProgress = 75; // This would be calculated from completed lessons
              const requiredProgress = parseInt(condition.value);
              conditionMet = evaluateOperator(userProgress, condition.operator, requiredProgress);
              break;

            case 'quiz_score':
              // Mock quiz score check - in real app, fetch from lesson analytics
              const userQuizScore = 85; // This would come from lesson_analytics table
              const requiredScore = parseInt(condition.value);
              conditionMet = evaluateOperator(userQuizScore, condition.operator, requiredScore);
              break;

            default:
              conditionMet = false;
          }

          if (!conditionMet) {
            allConditionsMet = false;
            break;
          }
        }

        setShouldShowContent(allConditionsMet);
      } catch (error) {
        console.error('Error evaluating conditions:', error);
        setShouldShowContent(false);
      } finally {
        setIsLoading(false);
      }
    };

    evaluateConditions();
  }, [user, conditions]);

  const evaluateOperator = (userValue: number, operator: string, requiredValue: number): boolean => {
    switch (operator) {
      case '>=':
        return userValue >= requiredValue;
      case '<=':
        return userValue <= requiredValue;
      case '==':
        return userValue === requiredValue;
      case '!=':
        return userValue !== requiredValue;
      default:
        return false;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const contentToShow = shouldShowContent ? content : fallback_content;

  return (
    <Card className={shouldShowContent ? '' : 'border-dashed border-muted-foreground/30'}>
      <CardContent className="p-6">
        <div className="prose prose-invert max-w-none">
          <SecureContentRenderer 
            content={contentToShow}
            type="html"
            className="conditional-content"
          />
        </div>
        {!shouldShowContent && conditions.length > 0 && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 Additional content will unlock when you meet the requirements:
            </p>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1">
              {conditions.map((condition, index) => (
                <li key={index}>
                  • {condition.type.replace('_', ' ')}: {condition.operator} {condition.value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
