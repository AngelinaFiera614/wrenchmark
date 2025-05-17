
export interface GlossaryTerm {
  id: string;
  term: string;
  slug: string;
  definition: string;
  category: string[];
  related_terms: string[];
  image_url: string | null;
  video_url: string | null;
  created_at: string;
  updated_at: string;
}

export type GlossaryFormValues = Omit<GlossaryTerm, 'id' | 'created_at' | 'updated_at'> & {
  id?: string; // Make ID optional for when editing
};
