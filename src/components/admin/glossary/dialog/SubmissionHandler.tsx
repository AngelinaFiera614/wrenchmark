
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { GlossaryTerm, GlossaryFormValues } from "@/types/glossary";
import { createGlossaryTerm, updateGlossaryTerm } from "@/services/glossary/termService"; 
import { generateUniqueSlug } from "@/services/glossary/slugService";

interface UseSubmissionHandlerProps {
  term: GlossaryTerm | null;
  onClose: (refreshData?: boolean) => void;
  user: any;
  isAdmin: boolean;
}

export const useSubmissionHandler = ({
  term,
  onClose,
  user,
  isAdmin,
}: UseSubmissionHandlerProps) => {
  const [loading, setLoading] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Clear any existing timeout when component unmounts
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);

  const handleSubmit = async (values: GlossaryFormValues) => {
    setLoading(true);
    
    // Create a timeout to detect if the save operation is taking too long
    const timeout = setTimeout(() => {
      console.error("Glossary term save operation timed out after 10 seconds");
      setLoading(false);
      toast("Save operation timed out. The operation took too long. Please try again and check your connection.", {
        description: "The operation took too long. Please try again and check your connection."
      });
    }, 10000); // 10 second timeout
    
    setSaveTimeout(timeout);
    
    try {
      // Check authentication and permissions
      if (!user) {
        throw new Error("You must be logged in to perform this action");
      }
      
      if (!isAdmin) {
        throw new Error("You don't have permission to manage glossary terms");
      }
      
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
        
        response = await updateGlossaryTerm(term.id, glossaryData);
          
        console.log(`Update operation took ${Date.now() - startTime}ms`);
        console.log("Glossary term updated successfully:", response);
        
        toast("Term updated successfully");
      } else {
        // Create new glossary term
        console.log("Creating new glossary term");
        const startTime = Date.now();
        
        response = await createGlossaryTerm(glossaryData);
          
        console.log(`Insert operation took ${Date.now() - startTime}ms`);
        console.log("Glossary term created successfully:", response);
        
        toast("Term added successfully");
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
      if (error.message && error.message.includes("slug")) {
        toast("Duplicate slug", {
          description: error.message
        });
      } else if (error.code === "PGRST301") {
        toast("Permission denied", {
          description: "You don't have permission to perform this action. Please verify you're logged in as an admin."
        });
      } else if (error.message && error.message.includes("JWT")) {
        toast("Authentication error", {
          description: "Your session may have expired. Please refresh the page and log in again."
        });
      } else {
        toast("Error saving term", {
          description: error.message || "Failed to save term. Please try again."
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSubmit,
  };
};
