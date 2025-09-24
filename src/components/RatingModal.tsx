import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { API_BASE_URL } from "@/const";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";
import { useState } from "react";

interface RatingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameName: string;
  currentRating?: number;
  username: string;
  token: string;
  collectionId: string;
  onRatingUpdate: (rating: number) => void;
}

export function RatingModal({
  open,
  onOpenChange,
  gameName,
  currentRating,
  username,
  token,
  collectionId,
  onRatingUpdate,
}: RatingModalProps) {
  const [selectedRating, setSelectedRating] = useState(currentRating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRatingUpdate = async () => {
    if (selectedRating < 0 || selectedRating > 10) {
      toast({
        title: "Invalid rating",
        description: "Rating must be between 0 and 10",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await fetch(`${API_BASE_URL}/${username}/collection/${collectionId}/rating`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating: selectedRating }),
      });

      onRatingUpdate(selectedRating);
      onOpenChange(false);
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
    } finally {
      setIsLoading(false);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating === 0) return 'hsl(var(--muted-foreground))';
    const normalized = rating / 10;
    const hue = normalized * 120;
    return `hsl(${hue}, 70%, 50%)`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            Rate "{gameName}"
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Star Rating */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-1">
              {Array.from({ length: 10 }, (_, i) => {
                const starValue = i + 1;
                const isFilled = starValue <= (hoveredRating || selectedRating);
                
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedRating(starValue)}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 rounded transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`w-6 h-6 transition-all duration-200 ${
                        isFilled
                          ? "fill-current"
                          : "fill-transparent"
                      }`}
                      style={{
                        color: isFilled ? getRatingColor(hoveredRating || selectedRating) : 'hsl(var(--muted-foreground))'
                      }}
                    />
                  </button>
                );
              })}
            </div>
            
            {/* Rating Display */}
            <div className="text-center">
              <div 
                className="text-2xl font-bold font-display"
                style={{ color: getRatingColor(hoveredRating || selectedRating) }}
              >
                {hoveredRating || selectedRating}/10
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedRating === 0 && "No rating"}
                {selectedRating > 0 && selectedRating <= 2 && "Poor"}
                {selectedRating > 2 && selectedRating <= 4 && "Fair"}
                {selectedRating > 4 && selectedRating <= 6 && "Good"}
                {selectedRating > 6 && selectedRating <= 8 && "Great"}
                {selectedRating > 8 && selectedRating <= 10 && "Excellent"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRatingUpdate}
              className="flex-1 bg-gaming-accent hover:bg-gaming-accent/90"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Rating"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}