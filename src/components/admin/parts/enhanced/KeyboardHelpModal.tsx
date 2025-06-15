
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Keyboard, Badge, Button } from "lucide-react";

interface KeyboardHelpModalProps {
  onClose: () => void;
}

const KeyboardHelpModal: React.FC<KeyboardHelpModalProps> = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <Card className="bg-explorer-card border-explorer-chrome/30 w-96 max-h-[80vh] overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-explorer-text flex items-center gap-2">
          <Keyboard className="h-5 w-5" />
          Keyboard Shortcuts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-explorer-text-muted">Refresh</span>
            <span className="px-2 py-0.5 border rounded bg-gray-100 text-gray-800 text-xs">R</span>
          </div>
          <div className="flex justify-between">
            <span className="text-explorer-text-muted">Search</span>
            <span className="px-2 py-0.5 border rounded bg-gray-100 text-gray-800 text-xs">Ctrl+F</span>
          </div>
          <div className="flex justify-between">
            <span className="text-explorer-text-muted">New</span>
            <span className="px-2 py-0.5 border rounded bg-gray-100 text-gray-800 text-xs">Ctrl+N</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-full mt-2 h-10 px-4 py-2 rounded bg-accent-teal text-black hover:bg-accent-teal/80 font-medium"
        >
          Close
        </button>
      </CardContent>
    </Card>
  </div>
);

export default KeyboardHelpModal;
