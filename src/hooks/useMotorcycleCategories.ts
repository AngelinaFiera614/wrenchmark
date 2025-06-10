
import { useState, useEffect } from "react";
import { MotorcycleCategory } from "@/types";

const DEFAULT_CATEGORIES: MotorcycleCategory[] = [
  "Sport",
  "Cruiser", 
  "Touring",
  "Adventure",
  "Naked",
  "Standard",
  "Scooter",
  "Off-road",
  "Dual-sport",
];

const STORAGE_KEY = "wrenchmark_motorcycle_categories";

export function useMotorcycleCategories() {
  const [categories, setCategories] = useState<MotorcycleCategory[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : DEFAULT_CATEGORIES;
      }
    } catch (error) {
      console.error("Error loading categories from localStorage:", error);
    }
    return DEFAULT_CATEGORIES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error("Error saving categories to localStorage:", error);
    }
  }, [categories]);

  const updateCategories = (newCategories: MotorcycleCategory[]) => {
    setCategories(newCategories);
  };

  const resetToDefaults = () => {
    setCategories(DEFAULT_CATEGORIES);
  };

  return {
    categories,
    updateCategories,
    resetToDefaults
  };
}
