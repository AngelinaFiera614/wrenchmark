
// Main export file to simplify imports
export * from "./types";
export * from "./fetch";
export * from "./update";
export * from "./upload";
// Export all from tags index except types that would cause conflicts
export { 
  getTags,
  getTagsForManual,
  createTag,
  getOrCreateTagsByNames,
  updateTag,
  deleteTag,
  associateTagsWithManual,
  transformToManualTag,
  getRandomColor
} from "./tags";
export * from "./storage";
