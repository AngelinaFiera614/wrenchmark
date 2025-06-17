
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { Motorcycle } from "@/types";

interface MotorcycleAdminNotesProps {
  motorcycle: Motorcycle;
  onUpdate: () => void;
}

const MotorcycleAdminNotes = ({ motorcycle, onUpdate }: MotorcycleAdminNotesProps) => {
  const [newNote, setNewNote] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Mock data - in real implementation, this would come from a notes table
  const notes = [
    {
      id: "1",
      content: "Need to verify engine specifications with manufacturer data",
      createdAt: new Date().toISOString(),
      author: "Admin"
    }
  ];

  const tasks = [
    {
      id: "1",
      title: "Add component assignments",
      status: "pending" as const,
      priority: "high" as const,
      createdAt: new Date().toISOString()
    },
    {
      id: "2", 
      title: "Update pricing information",
      status: "pending" as const,
      priority: "medium" as const,
      createdAt: new Date().toISOString()
    }
  ];

  const getTaskIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-yellow-400" />;
      default: return <AlertTriangle className="h-4 w-4 text-red-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400 text-red-400';
      case 'medium': return 'border-yellow-400 text-yellow-400';
      default: return 'border-green-400 text-green-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Tasks */}
      <Card className="bg-explorer-dark border-explorer-chrome/20">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center justify-between">
            Admin Tasks
            <Badge variant="outline" className="text-red-400 border-red-400">
              {tasks.filter(t => t.status === 'pending').length} Pending
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-explorer-card rounded-lg border border-explorer-chrome/20">
              <div className="flex items-center gap-3">
                {getTaskIcon(task.status)}
                <div>
                  <div className="text-explorer-text">{task.title}</div>
                  <div className="text-xs text-explorer-text-muted">
                    Created {new Date(task.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
                <Button size="sm" variant="outline">
                  Mark Complete
                </Button>
              </div>
            </div>
          ))}

          <div className="flex gap-2 pt-3 border-t border-explorer-chrome/20">
            <input
              type="text"
              placeholder="Add new task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 px-3 py-2 bg-explorer-card border border-explorer-chrome/30 rounded-md text-explorer-text placeholder-explorer-text-muted"
            />
            <Button size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Admin Notes */}
      <Card className="bg-explorer-dark border-explorer-chrome/20">
        <CardHeader>
          <CardTitle className="text-explorer-text">Admin Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="p-3 bg-explorer-card rounded-lg border border-explorer-chrome/20">
              <div className="text-explorer-text mb-2">{note.content}</div>
              <div className="text-xs text-explorer-text-muted">
                By {note.author} • {new Date(note.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}

          <div className="space-y-2">
            <Textarea
              placeholder="Add a note about this motorcycle..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="bg-explorer-card border-explorer-chrome/30"
              rows={3}
            />
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Completeness Suggestions */}
      <Card className="bg-explorer-dark border-explorer-chrome/20">
        <CardHeader>
          <CardTitle className="text-explorer-text">Completion Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span className="text-explorer-text">Consider adding component assignments for better spec accuracy</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span className="text-explorer-text">Torque specifications missing - affects performance calculations</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span className="text-explorer-text">No image URL specified - default placeholder will be used</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MotorcycleAdminNotes;
