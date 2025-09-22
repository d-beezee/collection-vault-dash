import { Card } from "@/components/ui/card";
import { ImageOff } from "lucide-react";
import { useState } from "react";

interface GameItem {
  id: string;
  main: string;
  game: string;
  image: string;
}

interface GameCardProps {
  item: GameItem;
}

export function GameCard({ item }: GameCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card className="group bg-gradient-card border-border/50 overflow-hidden transition-all duration-300 hover:shadow-card-gaming hover:scale-[1.02] hover:border-primary/30">
      <div className="aspect-[3/4] relative overflow-hidden">
        {!imageError ? (
          <img
            src={item.image}
            alt={item.main}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
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
              <p className="text-white/80 text-xs">
                {item.game}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom info (always visible) */}
      <div className="p-3 space-y-1">
        <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {item.main}
        </h3>
        {item.game !== item.main && (
          <p className="text-muted-foreground text-xs line-clamp-1">
            {item.game}
          </p>
        )}
        <p className="text-xs text-muted-foreground/70">
          ID: {item.id}
        </p>
      </div>
    </Card>
  );
}