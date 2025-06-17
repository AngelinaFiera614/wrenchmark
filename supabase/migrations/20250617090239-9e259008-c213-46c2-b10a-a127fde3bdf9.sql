
-- Phase 1: Database Enhancement

-- Create media_library table for file storage integration
CREATE TABLE public.media_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size_bytes BIGINT,
  mime_type TEXT,
  alt_text TEXT,
  caption TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users
);

-- Create lesson_templates table for reusable lesson structures
CREATE TABLE public.lesson_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  template_blocks JSONB NOT NULL DEFAULT '[]',
  is_public BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users
);

-- Create lesson_analytics table for tracking lesson performance
CREATE TABLE public.lesson_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL REFERENCES public.lessons ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users,
  event_type TEXT NOT NULL, -- 'view', 'start', 'complete', 'quiz_attempt', etc.
  event_data JSONB,
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update content_block_types with better schema definitions
INSERT INTO public.content_block_types (name, description, icon, schema) VALUES
('rich_text', 'Rich text editor with formatting', 'type', '{
  "properties": {
    "content": {"type": "string", "description": "HTML content"},
    "title": {"type": "string", "description": "Optional title"},
    "format": {"type": "string", "enum": ["html", "markdown"], "default": "html"}
  },
  "required": ["content"]
}'),
('interactive_quiz', 'Interactive quiz with multiple question types', 'help-circle', '{
  "properties": {
    "questions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {"type": "string"},
          "type": {"type": "string", "enum": ["multiple_choice", "true_false", "fill_blank", "drag_drop"]},
          "question": {"type": "string"},
          "options": {"type": "array", "items": {"type": "string"}},
          "correct_answer": {"type": "string"},
          "explanation": {"type": "string"},
          "points": {"type": "number", "default": 1}
        }
      }
    },
    "passing_score": {"type": "number", "default": 70},
    "allow_retries": {"type": "boolean", "default": true},
    "show_results": {"type": "boolean", "default": true}
  }
}'),
('code_highlight', 'Code blocks with syntax highlighting', 'code', '{
  "properties": {
    "code": {"type": "string", "description": "Code content"},
    "language": {"type": "string", "default": "javascript"},
    "title": {"type": "string", "description": "Optional code title"},
    "line_numbers": {"type": "boolean", "default": true},
    "highlight_lines": {"type": "array", "items": {"type": "number"}}
  },
  "required": ["code"]
}'),
('audio_player', 'Audio player with controls', 'volume-2', '{
  "properties": {
    "audio_url": {"type": "string", "description": "Audio file URL"},
    "title": {"type": "string"},
    "description": {"type": "string"},
    "auto_play": {"type": "boolean", "default": false},
    "show_controls": {"type": "boolean", "default": true},
    "transcript": {"type": "string", "description": "Audio transcript"}
  },
  "required": ["audio_url"]
}'),
('interactive_image', 'Interactive image with hotspots', 'image', '{
  "properties": {
    "image_url": {"type": "string"},
    "alt_text": {"type": "string"},
    "hotspots": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "x": {"type": "number"},
          "y": {"type": "number"},
          "title": {"type": "string"},
          "content": {"type": "string"},
          "link": {"type": "string"}
        }
      }
    }
  },
  "required": ["image_url"]
}'),
('conditional_content', 'Content that shows based on conditions', 'eye', '{
  "properties": {
    "content": {"type": "string"},
    "conditions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": {"type": "string", "enum": ["skill_level", "progress", "quiz_score"]},
          "operator": {"type": "string", "enum": [">=", "<=", "==", "!="]},
          "value": {"type": "string"}
        }
      }
    },
    "fallback_content": {"type": "string"}
  },
  "required": ["content", "conditions"]
}')
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  schema = EXCLUDED.schema,
  updated_at = now();

-- Add RLS policies for media_library
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view media"
  ON public.media_library
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert media"
  ON public.media_library
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own media"
  ON public.media_library
  FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own media"
  ON public.media_library
  FOR DELETE
  USING (created_by = auth.uid());

-- Add RLS policies for lesson_templates
ALTER TABLE public.lesson_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view public templates"
  ON public.lesson_templates
  FOR SELECT
  USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Authenticated users can create templates"
  ON public.lesson_templates
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own templates"
  ON public.lesson_templates
  FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own templates"
  ON public.lesson_templates
  FOR DELETE
  USING (created_by = auth.uid());

-- Add RLS policies for lesson_analytics
ALTER TABLE public.lesson_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all analytics"
  ON public.lesson_analytics
  FOR SELECT
  USING (current_user_is_admin());

CREATE POLICY "Users can view their own analytics"
  ON public.lesson_analytics
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can insert analytics"
  ON public.lesson_analytics
  FOR INSERT
  WITH CHECK (true);

-- Add indexes for performance
CREATE INDEX idx_media_library_created_by ON public.media_library(created_by);
CREATE INDEX idx_media_library_file_type ON public.media_library(file_type);
CREATE INDEX idx_media_library_tags ON public.media_library USING GIN(tags);

CREATE INDEX idx_lesson_templates_category ON public.lesson_templates(category);
CREATE INDEX idx_lesson_templates_public ON public.lesson_templates(is_public);
CREATE INDEX idx_lesson_templates_created_by ON public.lesson_templates(created_by);

CREATE INDEX idx_lesson_analytics_lesson_id ON public.lesson_analytics(lesson_id);
CREATE INDEX idx_lesson_analytics_user_id ON public.lesson_analytics(user_id);
CREATE INDEX idx_lesson_analytics_event_type ON public.lesson_analytics(event_type);
CREATE INDEX idx_lesson_analytics_created_at ON public.lesson_analytics(created_at);

-- Update triggers for timestamps
CREATE TRIGGER update_media_library_updated_at
  BEFORE UPDATE ON public.media_library
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER update_lesson_templates_updated_at
  BEFORE UPDATE ON public.lesson_templates
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
