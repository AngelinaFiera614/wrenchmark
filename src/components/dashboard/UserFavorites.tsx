
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface UserFavoritesProps {
  limit?: number;
}

interface Favorite {
  id: string;
  motorcycle_id: string;
  notes: string | null;
  created_at: string;
  motorcycle_models: {
    id: string;
    name: string;
    slug: string;
    type: string;
    default_image_url: string | null;
    brands: {
      name: string;
    };
  };
}

const UserFavorites: React.FC<UserFavoritesProps> = ({ limit = 10 }) => {
  const { user } = useAuth();

  const { data: favorites, isLoading, refetch } = useQuery({
    queryKey: ['user-favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_motorcycle_favorites')
        .select(`
          id,
          motorcycle_id,
          notes,
          created_at,
          motorcycle_models (
            id,
            name,
            slug,
            type,
            default_image_url,
            brands (name)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const removeFavorite = async (favoriteId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_motorcycle_favorites')
        .delete()
        .eq('id', favoriteId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast.success('Removed from favorites');
      refetch();
    } catch (error: any) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-muted h-20 rounded"></div>
        ))}
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="mb-4">No favorites yet</p>
        <Link to="/motorcycles">
          <Button variant="outline" className="border-accent-teal text-accent-teal hover:bg-accent-teal/10">
            Explore Motorcycles
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {favorites.map((favorite) => (
        <Card key={favorite.id} className="border-l-4 border-l-accent-teal/50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              {favorite.motorcycle_models?.default_image_url && (
                <img
                  src={favorite.motorcycle_models.default_image_url}
                  alt={favorite.motorcycle_models.name}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div>
                <h4 className="font-medium">
                  {favorite.motorcycle_models?.brands?.name} {favorite.motorcycle_models?.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {favorite.motorcycle_models?.type}
                </p>
                {favorite.notes && (
                  <p className="text-xs text-muted-foreground mt-1">
                    "{favorite.notes}"
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link to={`/motorcycles/${favorite.motorcycle_models?.slug}`}>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFavorite(favorite.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Heart className="h-4 w-4 fill-current" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      {favorites.length >= limit && (
        <div className="text-center pt-4">
          <Link to="/dashboard/favorites">
            <Button variant="ghost" className="text-accent-teal">
              View All Favorites
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserFavorites;
