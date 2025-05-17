import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { GlossaryTerm } from "@/types/glossary";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { GlossaryForm } from "./GlossaryForm";
import { GlossaryFormValues } from "@/types/glossary";

interface AdminGlossaryDialogProps {
  open: boolean;
  term: GlossaryTerm | null;
  onClose: (refreshData?: boolean) => void;
  availableTerms?: GlossaryTerm[];
}

const AdminGlossaryDialog: React.FC<AdminGlossaryDialogProps> = ({ 
  open, 
  term, 
  onClose,
  availableTerms = []
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const { user, isAdmin } = useAuth();
  
  // Clear any existing timeout when component unmounts or dialog closes
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);
  
  // Clear timeout when dialog closes
  useEffect(() => {
    if (!open && saveTimeout) {
      clearTimeout(saveTimeout);
      setSaveTimeout(null);
    }
  }, [open, saveTimeout]);
  
  const handleSubmit = async (values: GlossaryFormValues) => {
    setLoading(true);
    
    // Create a timeout to detect if the save operation is taking too long
    const timeout = setTimeout(() => {
      console.error("Glossary term save operation timed out after 10 seconds");
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Save operation timed out",
        description: "The operation took too long. Please try again and check your connection.",
      });
    }, 10000); // 10 second timeout
    
    setSaveTimeout(timeout);
    
    try {
      // Log authentication state
      console.log("Auth state during save:", { 
        isLoggedIn: !!user, 
        userId: user?.id,
        isAdmin,
      });
      
      console.log("Submitting glossary term data:", values);
      
      // Ensure arrays are properly handled
      const glossaryData = {
        term: values.term,
        slug: values.slug,
        definition: values.definition,
        category: Array.isArray(values.category) ? values.category : [],
        related_terms: Array.isArray(values.related_terms) ? values.related_terms : [],
        image_url: values.image_url || null,
        video_url: values.video_url || null,
      };

      console.log("Cleaned glossary data for database:", glossaryData);

      let response;
      
      if (term) {
        // Update existing glossary term
        console.log("Updating existing glossary term with ID:", term.id);
        const startTime = Date.now();
        
        response = await supabase
          .from('glossary_terms')
          .update(glossaryData)
          .eq('id', term.id);
          
        console.log(`Update operation took ${Date.now() - startTime}ms`);
        
        if (response.error) {
          console.error("Supabase update error:", response.error);
          throw response.error;
        }
        
        console.log("Glossary term updated successfully:", response);
        
        toast({
          title: "Term updated",
          description: `${values.term} has been updated successfully.`,
        });
      } else {
        // Create new glossary term
        console.log("Creating new glossary term");
        const startTime = Date.now();
        
        response = await supabase
          .from('glossary_terms')
          .insert([glossaryData]);
          
        console.log(`Insert operation took ${Date.now() - startTime}ms`);
        
        if (response.error) {
          console.error("Supabase insert error:", response.error);
          throw response.error;
        }
        
        console.log("Glossary term created successfully:", response);
        
        toast({
          title: "Term added",
          description: `${values.term} has been added successfully.`,
        });
      }
      
      // Clear the timeout since the operation completed successfully
      if (saveTimeout) {
        clearTimeout(saveTimeout);
        setSaveTimeout(null);
      }
      
      // Close dialog and refresh data
      onClose(true); 
      
    } catch (error: any) {
      // Clear the timeout if there's an error
      if (saveTimeout) {
        clearTimeout(saveTimeout);
        setSaveTimeout(null);
      }
      
      console.error("Error saving glossary term:", error);
      
      // Provide more specific error messages based on error type
      if (error.code === "PGRST301") {
        toast({
          variant: "destructive",
          title: "Permission denied",
          description: "You don't have permission to perform this action. Please verify you're logged in as an admin.",
        });
      } else if (error.code === "23505") {
        toast({
          variant: "destructive",
          title: "Duplicate entry",
          description: "A term with this slug already exists. Please use a unique slug.",
        });
      } else if (error.message && error.message.includes("JWT")) {
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: "Your session may have expired. Please refresh the page and log in again.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error saving term",
          description: error.message || "Failed to save term. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {term ? "Edit Term" : "Add New Term"}
          </DialogTitle>
          <DialogDescription>
            {term 
              ? "Update the details for this glossary term."
              : "Fill in the details to add a new term to the motorcycle glossary."}
          </DialogDescription>
        </DialogHeader>

        <GlossaryForm 
          term={term} 
          isSubmitting={loading} 
          onSubmit={handleSubmit} 
          onCancel={() => onClose()}
          availableTerms={availableTerms}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AdminGlossaryDialog;
