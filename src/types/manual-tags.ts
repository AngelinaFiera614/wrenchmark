
/**
 * Types related to manual tags
 */

export interface ManualTag {
  id: string;
  name: string;
  description?: string;
  color: string;
}

export interface TagAssociation {
  manual_id: string;
  tag_id: string;
}
