
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import { 
  getUserPreferences, 
  upsertUserPreferences, 
  UserPreferences 
} from "@/services/userPreferencesService";
import { toast } from "sonner";

export function useUserPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPreferences = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getUserPreferences(user.id);
      setPreferences(data);
    } catch (err) {
      setError(err as Error);
      console.error("Failed to fetch preferences:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user?.id) {
      toast.error("You must be logged in to update preferences");
      return;
    }

    setIsLoading(true);
    try {
      const updated = await upsertUserPreferences(user.id, updates);
      setPreferences(updated);
      toast.success("Preferences updated successfully");
    } catch (err) {
      setError(err as Error);
      toast.error("Failed to update preferences");
      console.error("Failed to update preferences:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchPreferences();
    } else {
      setPreferences(null);
    }
  }, [user?.id]);

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
    refreshPreferences: fetchPreferences
  };
}
