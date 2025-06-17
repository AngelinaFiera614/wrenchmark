
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminNote {
  id: string;
  content: string;
  createdAt: string;
  author: string;
}

interface AdminTask {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export const useAdminNotes = (motorcycleId: string) => {
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mock data for now - in real implementation, these would come from database
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          setNotes([
            {
              id: "1",
              content: "Need to verify engine specifications with manufacturer data",
              createdAt: new Date().toISOString(),
              author: "Admin"
            }
          ]);
          
          setTasks([
            {
              id: "1",
              title: "Add component assignments",
              status: "pending",
              priority: "high",
              createdAt: new Date().toISOString()
            },
            {
              id: "2", 
              title: "Update pricing information",
              status: "pending",
              priority: "medium",
              createdAt: new Date().toISOString()
            }
          ]);
          
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error loading admin data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [motorcycleId]);

  const addNote = async (content: string) => {
    const newNote: AdminNote = {
      id: Date.now().toString(),
      content,
      createdAt: new Date().toISOString(),
      author: "Current User"
    };
    
    setNotes(prev => [...prev, newNote]);
    toast({
      title: "Note Added",
      description: "Admin note has been saved successfully."
    });
  };

  const addTask = async (title: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    const newTask: AdminTask = {
      id: Date.now().toString(),
      title,
      status: "pending",
      priority,
      createdAt: new Date().toISOString()
    };
    
    setTasks(prev => [...prev, newTask]);
    toast({
      title: "Task Added",
      description: "Admin task has been created successfully."
    });
  };

  const updateTaskStatus = async (taskId: string, status: AdminTask['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
    
    toast({
      title: "Task Updated",
      description: `Task marked as ${status}.`
    });
  };

  return {
    notes,
    tasks,
    loading,
    addNote,
    addTask,
    updateTaskStatus
  };
};
