
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';

export const useFavorites = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['user-favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_motorcycle_favorites')
        .select('motorcycle_id')
        .eq('user_id', user.id);

      if (error) throw error;
      return data.map(f => f.motorcycle_id);
    },
    enabled: !!user,
  });

  const addFavoriteMutation = useMutation({
    mutationFn: async ({ motorcycleId, notes }: { motorcycleId: string; notes?: string }) => {
      if (!user) throw new Error('Must be logged in');
      
      const { data, error } = await supabase
        .from('user_motorcycle_favorites')
        .insert({
          user_id: user.id,
          motorcycle_id: motorcycleId,
          notes: notes || null
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
      toast.success('Added to favorites');
    },
    onError: (error: any) => {
      console.error('Error adding favorite:', error);
      toast.error('Failed to add favorite');
    }
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (motorcycleId: string) => {
      if (!user) throw new Error('Must be logged in');
      
      const { error } = await supabase
        .from('user_motorcycle_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('motorcycle_id', motorcycleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
      toast.success('Removed from favorites');
    },
    onError: (error: any) => {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
    }
  });

  const isFavorite = (motorcycleId: string) => {
    return favorites?.includes(motorcycleId) || false;
  };

  const toggleFavorite = (motorcycleId: string, notes?: string) => {
    if (isFavorite(motorcycleId)) {
      removeFavoriteMutation.mutate(motorcycleId);
    } else {
      addFavoriteMutation.mutate({ motorcycleId, notes });
    }
  };

  return {
    favorites,
    isLoading,
    isFavorite,
    toggleFavorite,
    addFavorite: addFavoriteMutation.mutate,
    removeFavorite: removeFavoriteMutation.mutate,
    isAdding: addFavoriteMutation.isPending,
    isRemoving: removeFavoriteMutation.isPending
  };
};
