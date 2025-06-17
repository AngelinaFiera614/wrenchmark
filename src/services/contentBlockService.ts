
import { supabase } from "@/integrations/supabase/client";
import { ContentBlockType } from "@/types/course";

export async function getContentBlockTypes(): Promise<ContentBlockType[]> {
  const { data, error } = await supabase
    .from("content_block_types")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching content block types:", error);
    throw error;
  }

  return data || [];
}

export async function createContentBlockType(blockType: Partial<ContentBlockType>): Promise<ContentBlockType> {
  const { data, error } = await supabase
    .from("content_block_types")
    .insert(blockType)
    .select()
    .single();

  if (error) {
    console.error("Error creating content block type:", error);
    throw error;
  }

  return data;
}

export async function updateContentBlockType(id: string, updates: Partial<ContentBlockType>): Promise<ContentBlockType> {
  const { data, error } = await supabase
    .from("content_block_types")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating content block type:", error);
    throw error;
  }

  return data;
}

export async function deleteContentBlockType(id: string): Promise<void> {
  const { error } = await supabase
    .from("content_block_types")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting content block type:", error);
    throw error;
  }
}

// Enhanced functions for the new content blocks
export async function validateContentBlockData(type: string, data: any): Promise<boolean> {
  const { data: blockType } = await supabase
    .from("content_block_types")
    .select("schema")
    .eq("name", type)
    .single();

  if (!blockType?.schema) {
    console.warn(`No schema found for content block type: ${type}`);
    return true; // Allow if no schema is defined
  }

  // Basic validation - in a real app, you'd use a JSON schema validator
  try {
    const schema = blockType.schema as any;
    const required = schema.required || [];
    
    for (const field of required) {
      if (!(field in data) || data[field] === null || data[field] === undefined) {
        console.error(`Required field missing: ${field}`);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error validating content block data:", error);
    return false;
  }
}

export function getContentBlockTemplate(type: string): any {
  const templates: Record<string, any> = {
    rich_text: {
      content: "<p>Enter your rich text content here...</p>",
      title: "",
      format: "html"
    },
    interactive_quiz: {
      questions: [
        {
          id: "1",
          type: "multiple_choice",
          question: "What is the correct answer?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correct_answer: "Option A",
          explanation: "This is why Option A is correct.",
          points: 1
        }
      ],
      passing_score: 70,
      allow_retries: true,
      show_results: true
    },
    code_highlight: {
      code: "console.log('Hello, World!');",
      language: "javascript",
      title: "",
      line_numbers: true,
      highlight_lines: []
    },
    audio_player: {
      audio_url: "",
      title: "",
      description: "",
      auto_play: false,
      show_controls: true,
      transcript: ""
    },
    interactive_image: {
      image_url: "",
      alt_text: "",
      hotspots: []
    },
    conditional_content: {
      content: "<p>This content will show when conditions are met.</p>",
      conditions: [
        {
          type: "skill_level",
          operator: ">=",
          value: "5"
        }
      ],
      fallback_content: "<p>Complete more lessons to unlock this content.</p>"
    }
  };

  return templates[type] || {};
}
