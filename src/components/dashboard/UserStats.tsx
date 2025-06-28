
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, BarChart3, BookOpen, Award } from 'lucide-react';

const UserStats: React.FC = () => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const [favoritesResult, listsResult, progressResult, glossaryResult] = await Promise.all([
        // Count favorites
        supabase
          .from('user_motorcycle_favorites')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),
        
        // Count comparison lists
        supabase
          .from('user_comparison_lists')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),
        
        // Count completed lessons
        supabase
          .from('user_progress')
          .select('lesson_id', { count: 'exact', head: true })
          .eq('user_id', user.id),
        
        // Count learned glossary terms
        supabase
          .from('user_glossary_terms')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_learned', true)
      ]);

      return {
        favorites: favoritesResult.count || 0,
        lists: listsResult.count || 0,
        completedLessons: progressResult.count || 0,
        learnedTerms: glossaryResult.count || 0
      };
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse bg-muted h-24 rounded"></div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Favorites',
      value: stats.favorites,
      icon: Heart,
      color: 'text-red-500'
    },
    {
      title: 'Comparison Lists',
      value: stats.lists,
      icon: BarChart3,
      color: 'text-blue-500'
    },
    {
      title: 'Lessons Completed',
      value: stats.completedLessons,
      icon: BookOpen,
      color: 'text-green-500'
    },
    {
      title: 'Terms Learned',
      value: stats.learnedTerms,
      icon: Award,
      color: 'text-accent-teal'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserStats;
