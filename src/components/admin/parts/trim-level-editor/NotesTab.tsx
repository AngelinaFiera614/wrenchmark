
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Copy, Download } from "lucide-react";

interface NotesTabProps {
  formData: {
    description: string;
    notes: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const NotesTab = ({ formData, onInputChange }: NotesTabProps) => {
  const handleCopyNotes = () => {
    navigator.clipboard.writeText(formData.notes);
  };

  const handleExportNotes = () => {
    const content = `Description: ${formData.description}\n\nNotes:\n${formData.notes}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'configuration-notes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-explorer-text">
            <FileText className="h-5 w-5 text-accent-teal" />
            Configuration Notes & Description
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-explorer-text">
              Short Description
            </Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => onInputChange('description', e.target.value)}
              placeholder="Brief summary of this configuration (e.g., Sport touring setup with upgraded suspension)"
              className="bg-explorer-dark border-explorer-chrome/30"
            />
            <p className="text-xs text-explorer-text-muted">
              A brief summary that will appear in configuration cards and previews
            </p>
          </div>

          {/* Notes Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="notes" className="text-explorer-text">
                Detailed Notes
              </Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyNotes}
                  disabled={!formData.notes}
                  className="border-explorer-chrome/30"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleExportNotes}
                  disabled={!formData.notes && !formData.description}
                  className="border-explorer-chrome/30"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
              </div>
            </div>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => onInputChange('notes', e.target.value)}
              placeholder="Detailed notes about this configuration...

Examples:
• Suspension settings optimized for track use
• Brake pads upgraded to high-performance compound
• Weight reduction through carbon fiber components
• Specific tuning notes or recommendations
• Installation tips or compatibility notes"
              className="bg-explorer-dark border-explorer-chrome/30 min-h-[200px] font-mono text-sm"
            />
            <p className="text-xs text-explorer-text-muted">
              Detailed notes, installation tips, compatibility information, and other relevant details
            </p>
          </div>

          {/* Notes Templates */}
          <div className="space-y-2">
            <Label className="text-explorer-text">Quick Templates</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onInputChange('notes', 
                  'Performance Configuration:\n• Engine: [Details]\n• Suspension: [Details]\n• Brakes: [Details]\n• Weight: [Details]\n\nNotes:\n[Additional notes]'
                )}
                className="border-explorer-chrome/30 text-left justify-start"
              >
                Performance Template
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onInputChange('notes', 
                  'Touring Configuration:\n• Comfort Features: [Details]\n• Luggage Capacity: [Details]\n• Fuel Economy: [Details]\n• Ergonomics: [Details]\n\nRecommendations:\n[Usage recommendations]'
                )}
                className="border-explorer-chrome/30 text-left justify-start"
              >
                Touring Template
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onInputChange('notes', 
                  'Entry-Level Configuration:\n• Beginner-friendly features\n• Safety considerations\n• Learning curve notes\n• Maintenance requirements\n\nRecommended for:\n[Target rider profile]'
                )}
                className="border-explorer-chrome/30 text-left justify-start"
              >
                Entry-Level Template
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onInputChange('notes', 
                  'Custom Configuration:\n• Modifications: [List]\n• Performance impact: [Details]\n• Installation notes: [Details]\n• Compatibility: [Requirements]\n\nWarnings:\n[Important notes]'
                )}
                className="border-explorer-chrome/30 text-left justify-start"
              >
                Custom Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotesTab;
