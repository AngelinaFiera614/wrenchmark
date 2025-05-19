
// Export all tag-related functionality from a single entry point
export * from './utils';
export * from './fetch';
export * from './create';
export * from './update';

// Import types from the new location
import { ManualTag, TagAssociation } from '@/types/manual-tags';
export type { ManualTag, TagAssociation };
