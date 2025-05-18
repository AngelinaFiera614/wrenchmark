
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader, BookOpen, Award } from "lucide-react";
import { useGlossaryLearning } from "@/hooks/useGlossaryLearning";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function GlossaryProgressSection() {
  const { useGlossaryStats, useRecentlyLearnedTerms } = useGlossaryLearning();
  const { totalLearned, totalTerms, isLoading: statsLoading } = useGlossaryStats();
  const { recentTerms, isLoading: termsLoading } = useRecentlyLearnedTerms();
  
  // Calculate percentage
  const percentage = totalTerms > 0 ? (totalLearned / totalTerms) * 100 : 0;

  const getProgressLabel = () => {
    if (percentage >= 80) return "Expert";
    if (percentage >= 60) return "Advanced";
    if (percentage >= 40) return "Intermediate";
    if (percentage >= 20) return "Beginner";
    return "Novice";
  };

  if (statsLoading || termsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Glossary Learning Progress</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader className="h-8 w-8 animate-spin text-accent-teal" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Glossary Learning Progress</CardTitle>
          <Badge variant="outline" className="bg-accent-teal/10">
            {getProgressLabel()}
          </Badge>
        </div>
        <CardDescription>
          Track your motorcycle terminology knowledge
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{totalLearned} terms learned</span>
            <span>{totalTerms} total terms</span>
          </div>
          <Progress value={percentage} className="h-2" />
          <div className="text-xs text-center text-muted-foreground">
            {percentage.toFixed(1)}% complete
          </div>
        </div>

        {recentTerms.length > 0 ? (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center">
              <Award className="h-4 w-4 mr-1 text-accent-teal" />
              Recently Learned Terms
            </h4>
            <ul className="space-y-2">
              {recentTerms.map((item) => (
                <li key={item.term_slug} className="flex items-center justify-between text-sm">
                  <Link to={`/glossary/${item.term_slug}`} className="flex items-center hover:text-accent-teal">
                    <BookOpen className="h-3.5 w-3.5 mr-1.5 text-accent-teal" />
                    <span className="capitalize">{item.term}</span>
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.learned_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-4 text-sm text-muted-foreground">
            You haven't marked any terms as learned yet
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link to="/glossary">
            <BookOpen className="h-4 w-4 mr-2" />
            Browse Glossary
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
