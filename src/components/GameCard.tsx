import { Card } from "@/components/ui/card";
import { API_BASE_URL } from "@/const";
import { ImageOff, Trash, Star } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface GameItem {
  id: string;
  collectionId: string;
  main: string;
  game: string;
  image: string;
  rating?: number;
}

interface GameCardProps {
  item: GameItem;
  token: string;
  username: string;
}

export function GameCard({ item, token, username }: GameCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isEditingRating, setIsEditingRating] = useState(false);
  const [editRating, setEditRating] = useState(item.rating?.toString() || "");
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to remove "${item.main}"?`)) {
      return;
    }
    await fetch(`${API_BASE_URL}/${username}/collection/${item.collectionId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    window.location.reload();
  };

  const handleRatingUpdate = async () => {
    try {
      const rating = parseFloat(editRating);
      if (isNaN(rating) || rating < 0 || rating > 10) {
        toast({
          title: "Invalid rating",
          description: "Rating must be between 0 and 10",
          variant: "destructive",
        });
        return;
      }

      await fetch(`${API_BASE_URL}/${username}/collection/${item.collectionId}/rating`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      });

      item.rating = rating;
      setIsEditingRating(false);
      toast({
        title: "Rating updated",
        description: "Your rating has been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error updating rating",
        description: "Failed to save your rating. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getRatingColor = (rating: number) => {
    // Normalize rating from 0-10 to 0-1
    const normalized = rating / 10;
    // Red to green gradient based on rating
    const hue = normalized * 120; // 0 = red, 120 = green
    return `hsl(${hue}, 70%, 50%)`;
  };

  const handleRatingClick = () => {
    if (!isEditingRating) {
      setIsEditingRating(true);
      setEditRating(item.rating?.toString() || "");
    }
  };

  const handleRatingSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRatingUpdate();
    } else if (e.key === 'Escape') {
      setIsEditingRating(false);
      setEditRating(item.rating?.toString() || "");
    }
  };

  return (
    <Card className="group bg-gradient-card border-border/50 overflow-hidden transition-all duration-300 hover:shadow-card-gaming hover:scale-[1.02] hover:border-primary/30">
      <div className="aspect-[3/4] relative overflow-hidden">
        {!imageError ? (
          <img
            src={item.image}
            alt={item.main}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gaming-surface flex items-center justify-center">
            <ImageOff className="w-12 h-12 text-muted-foreground" />
          </div>
        )}

        {/* Loading skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gaming-surface animate-pulse" />
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Game info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="space-y-1">
            <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2">
              {item.main}
            </h3>
            {item.game !== item.main && (
              <p className="text-white/80 text-xs">{item.game}</p>
            )}
          </div>
        </div>
        <div className="absolute top-0 right-0 p-2 transform translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleDelete}
            className="group/item relative p-2.5 bg-gaming-surface/90 backdrop-blur-sm rounded-xl border border-border/30 hover:bg-gradient-to-br hover:from-red-500/20 hover:to-red-600/30 hover:border-red-400/50 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/25 active:scale-95"
          >
            <Trash className="w-4 h-4 text-muted-foreground group-hover/item:text-red-400 transition-colors duration-300" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </button>
        </div>
      </div>

      {/* Bottom info (always visible) */}
      <div className="p-3 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {item.main}
            </h3>
            {item.game !== item.main && (
              <p className="text-muted-foreground text-xs line-clamp-1">
                {item.game}
              </p>
            )}
          </div>
          
          {/* Rating */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            <Star className="w-3 h-3 text-yellow-500" />
            {isEditingRating ? (
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={editRating}
                onChange={(e) => setEditRating(e.target.value)}
                onBlur={handleRatingUpdate}
                onKeyDown={handleRatingSubmit}
                className="w-12 h-5 text-xs bg-gaming-surface border border-border/50 rounded px-1 focus:outline-none focus:border-primary"
                autoFocus
              />
            ) : (
              <button
                onClick={handleRatingClick}
                className="text-xs font-medium px-1 py-0.5 rounded hover:bg-gaming-surface transition-colors cursor-pointer"
                style={{
                  color: item.rating ? getRatingColor(item.rating) : 'hsl(var(--muted-foreground))'
                }}
              >
                {item.rating ? item.rating.toFixed(1) : 'N/A'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
