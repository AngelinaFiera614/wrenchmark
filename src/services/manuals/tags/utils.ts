
import { ManualTag } from './types';

/**
 * Generate a random color for tags
 */
export const getRandomColor = (): string => {
  // Generate teal-ish colors to match the brand
  const hue = Math.floor(160 + Math.random() * 40); // Between 160-200 (blue-green range)
  const saturation = Math.floor(70 + Math.random() * 30); // Between 70-100%
  const lightness = Math.floor(40 + Math.random() * 30); // Between 40-70%
  
  // Convert HSL to hex
  return hslToHex(hue, saturation, lightness);
};

/**
 * Convert HSL color values to hex string
 */
const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

/**
 * Transform and validate a database row to a ManualTag object
 */
export const transformToManualTag = (data: any): ManualTag => {
  if (!data || typeof data !== 'object') {
    throw new Error("Invalid tag data");
  }
  
  // Ensure all required fields are present
  if (!data.id || !data.name || !data.color) {
    console.error("Missing required fields in tag data:", data);
    throw new Error("Tag data missing required fields");
  }
  
  return {
    id: data.id,
    name: data.name,
    description: data.description || null,
    color: data.color
  };
};
