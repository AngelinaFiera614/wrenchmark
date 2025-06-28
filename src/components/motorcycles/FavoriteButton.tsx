
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Loader2 } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface FavoriteButtonProps {
  motorcycleId: string;
  variant?: 'default' | 'icon';
  size?: 'default' | 'sm' | 'lg';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  motorcycleId, 
  variant = 'default',
  size = 'default'
}) => {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite, isAdding, isRemoving } = useFavorites();
  const [showTooltip, setShowTooltip] = useState(false);

  const isCurrentlyFavorite = isFavorite(motorcycleId);
  const isLoading = isAdding || isRemoving;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please sign in to save favorites');
      return;
    }

    toggleFavorite(motorcycleId);
  };

  if (!user) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/login" onClick={(e) => e.stopPropagation()}>
              <Button 
                variant="outline" 
                size={size}
                className="border-accent-teal/30 hover:bg-accent-teal/10"
              >
                {variant === 'icon' ? (
                  <Heart className="h-4 w-4" />
                ) : (
                  <>
                    <Heart className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sign in to save favorites</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      onClick={handleClick}
      variant={isCurrentlyFavorite ? "default" : "outline"}
      size={size}
      disabled={isLoading}
      className={
        isCurrentlyFavorite 
          ? "bg-accent-teal hover:bg-accent-teal/90 text-black"
          : "border-accent-teal/30 hover:bg-accent-teal/10"
      }
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart 
          className={`h-4 w-4 ${isCurrentlyFavorite ? 'fill-current' : ''} ${variant !== 'icon' ? 'mr-2' : ''}`} 
        />
      )}
      {variant !== 'icon' && (
        <span>{isCurrentlyFavorite ? 'Saved' : 'Save'}</span>
      )}
    </Button>
  );
};

export default FavoriteButton;
