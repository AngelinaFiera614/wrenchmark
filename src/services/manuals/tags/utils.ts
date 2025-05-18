
import { ManualTag } from './types';

/**
 * Helper function to safely transform data into ManualTag format
 */
export const transformToManualTag = (item: any): ManualTag => {
  return {
    id: String(item?.id || ''),
    name: String(item?.name || ''),
    description: item?.description ? String(item.description) : undefined,
    color: String(item?.color || '#00D2B4')
  };
};

/**
 * Generate random colors for auto-generated tags
 */
export const getRandomColor = (): string => {
  const colors = [
    '#00D2B4', // Brand teal
    '#3B82F6', // Blue
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#F97316', // Orange
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
