
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Copy, Clock, Zap } from 'lucide-react';
import { GlossaryTerm } from '@/types/glossary';

interface QuickActionsPanelProps {
  onAddTerm: () => void;
  onDuplicateTerm: (term: GlossaryTerm) => void;
  recentTerms: GlossaryTerm[];
}

export function QuickActionsPanel({
  onAddTerm,
  onDuplicateTerm,
  recentTerms,
}: QuickActionsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isExpanded && (
        <Card className="mb-4 w-64 shadow-lg">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onAddTerm}
                    className="w-full justify-start gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    New Term
                  </Button>
                </div>
              </div>

              {recentTerms.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent Terms
                  </h4>
                  <div className="space-y-1">
                    {recentTerms.slice(0, 3).map((term) => (
                      <div
                        key={term.id}
                        className="flex items-center justify-between p-2 hover:bg-accent rounded-sm"
                      >
                        <div className="text-sm truncate flex-1">{term.term}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDuplicateTerm(term)}
                          className="h-6 w-6 p-0 ml-2"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-12 w-12 rounded-full bg-accent-teal text-black hover:bg-accent-teal/80 shadow-lg"
        size="icon"
      >
        <Plus className={`h-6 w-6 transition-transform ${isExpanded ? 'rotate-45' : ''}`} />
      </Button>
    </div>
  );
}
