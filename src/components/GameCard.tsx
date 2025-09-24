import { Card } from "@/components/ui/card";
import { API_BASE_URL } from "@/const";
import { ImageOff, Trash, Star } from "lucide-react";
import { useState } from "react";
import { RatingModal } from "./RatingModal";

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
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentRating, setCurrentRating] = useState(item.rating);

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

  const getRatingColor = (rating: number) => {
    if (rating === 0) return 'hsl(var(--muted-foreground))';
    const normalized = rating / 10;
    const hue = normalized * 120;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const handleRatingUpdate = (newRating: number) => {
    setCurrentRating(newRating);
    item.rating = newRating;
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
            <button
              onClick={() => setShowRatingModal(true)}
              className="text-xs font-medium px-1 py-0.5 rounded hover:bg-gaming-surface transition-colors cursor-pointer"
              style={{
                color: currentRating ? getRatingColor(currentRating) : 'hsl(var(--muted-foreground))'
              }}
            >
              {currentRating ? currentRating.toFixed(1) : 'N/A'}
            </button>
          </div>
        </div>
      </div>

      <RatingModal
        open={showRatingModal}
        onOpenChange={setShowRatingModal}
        gameName={item.main}
        currentRating={currentRating}
        username={username}
        token={token}
        collectionId={item.collectionId}
        onRatingUpdate={handleRatingUpdate}
      />
    </Card>
  );
}
