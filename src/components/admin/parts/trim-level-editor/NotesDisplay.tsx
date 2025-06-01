
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, ChevronDown, ChevronUp, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotesDisplayProps {
  description?: string;
  notes?: string;
  isPreview?: boolean;
}

const NotesDisplay = ({ description, notes, isPreview = false }: NotesDisplayProps) => {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(!isPreview);

  if (!description && !notes) {
    return null;
  }

  const handleCopyNotes = () => {
    const content = `${description ? `Description: ${description}\n\n` : ''}${notes || ''}`;
    navigator.clipboard.writeText(content);
    toast({
      title: "Notes copied",
      description: "Configuration notes copied to clipboard",
    });
  };

  const formatNotes = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.trim().startsWith('•')) {
        return (
          <li key={index} className="ml-4">
            {line.trim().substring(1).trim()}
          </li>
        );
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="mb-1">{line}</p>;
    });
  };

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-explorer-text">
            <FileText className="h-4 w-4 text-accent-teal" />
            Configuration Notes
            {(description || notes) && (
              <Badge variant="outline" className="text-accent-teal border-accent-teal/30">
                {description && notes ? 'Complete' : description ? 'Description only' : 'Notes only'}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyNotes}
              className="text-explorer-text-muted hover:text-explorer-text"
            >
              <Copy className="h-3 w-3" />
            </Button>
            {isPreview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-explorer-text-muted hover:text-explorer-text"
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          {description && (
            <div>
              <h4 className="text-sm font-medium text-explorer-text mb-2">Description</h4>
              <p className="text-sm text-explorer-text-muted bg-explorer-dark/50 p-3 rounded">
                {description}
              </p>
            </div>
          )}
          
          {notes && (
            <div>
              <h4 className="text-sm font-medium text-explorer-text mb-2">Detailed Notes</h4>
              <div className="text-sm text-explorer-text-muted bg-explorer-dark/50 p-3 rounded whitespace-pre-wrap font-mono">
                {formatNotes(notes)}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default NotesDisplay;
