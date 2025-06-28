
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, ExternalLink, Globe, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface UserComparisonListsProps {
  limit?: number;
}

interface ComparisonList {
  id: string;
  name: string;
  description: string | null;
  motorcycle_ids: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

const UserComparisonLists: React.FC<UserComparisonListsProps> = ({ limit = 5 }) => {
  const { user } = useAuth();

  const { data: lists, isLoading } = useQuery({
    queryKey: ['user-comparison-lists', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_comparison_lists')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as ComparisonList[];
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-muted h-16 rounded"></div>
        ))}
      </div>
    );
  }

  if (!lists || lists.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="mb-4">No comparison lists yet</p>
        <Link to="/compare">
          <Button variant="outline" className="border-accent-teal text-accent-teal hover:bg-accent-teal/10">
            Create Your First List
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {lists.map((list) => (
        <Card key={list.id} className="border-l-4 border-l-accent-teal/50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">{list.name}</h4>
                  {list.is_public ? (
                    <Globe className="h-3 w-3 text-accent-teal" />
                  ) : (
                    <Lock className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
                {list.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {list.description}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {list.motorcycle_ids.length} motorcycles
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Updated {format(new Date(list.updated_at), 'MMM d')}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/compare?list=${list.id}`}>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      {lists.length >= limit && (
        <div className="text-center pt-4">
          <Link to="/dashboard/lists">
            <Button variant="ghost" className="text-accent-teal">
              View All Lists
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserComparisonLists;
