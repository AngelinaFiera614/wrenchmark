
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Zap, AlertTriangle } from 'lucide-react';
import { TermSuggestion } from '@/services/termSuggestionService';
import { GlossaryTerm } from '@/types/glossary';

interface TermSuggestionsProps {
  suggestions: TermSuggestion[];
  duplicates: GlossaryTerm[];
  onApplySuggestion: (suggestion: TermSuggestion) => void;
  onViewDuplicate: (duplicate: GlossaryTerm) => void;
}

export function TermSuggestions({
  suggestions,
  duplicates,
  onApplySuggestion,
  onViewDuplicate,
}: TermSuggestionsProps) {
  if (suggestions.length === 0 && duplicates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Duplicate Warning */}
      {duplicates.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
                  Potential Duplicates Found
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                  Similar terms already exist in the glossary:
                </p>
                <div className="flex flex-wrap gap-2">
                  {duplicates.map((duplicate) => (
                    <Button
                      key={duplicate.id}
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDuplicate(duplicate)}
                      className="text-orange-700 border-orange-300 hover:bg-orange-100 dark:text-orange-300 dark:border-orange-700 dark:hover:bg-orange-900"
                    >
                      {duplicate.term}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Term Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-accent-teal mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  Suggestions
                  <Badge variant="secondary" className="text-xs">
                    {suggestions.length}
                  </Badge>
                </h4>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{suggestion.term}</span>
                          <Badge 
                            variant="outline" 
                            className="text-xs"
                            title={`Confidence: ${Math.round(suggestion.confidence * 100)}%`}
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            {Math.round(suggestion.confidence * 100)}%
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mb-1">
                          {suggestion.reason}
                        </div>
                        {suggestion.categories && suggestion.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {suggestion.categories.slice(0, 3).map((category) => (
                              <Badge key={category} variant="secondary" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                            {suggestion.categories.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{suggestion.categories.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onApplySuggestion(suggestion)}
                        className="ml-2"
                      >
                        Apply
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
