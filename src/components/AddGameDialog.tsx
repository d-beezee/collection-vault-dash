import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";

interface SearchResult {
  id: number;
  name: string;
}

interface AddGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
  token: string;
  onGameAdded: () => void;
  collection: { id: string }[];
}

export function AddGameDialog({
  open,
  onOpenChange,
  username,
  token,
  onGameAdded,
  collection,
}: AddGameDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const searchGames = useCallback(
    async (query: string) => {
      if (query.length < 3) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `http://localhost:3000/games?q=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
          throw new Error("Failed to search games");
        }

        const results: { items: SearchResult[] } = await response.json();
        setSearchResults(results.items);
      } catch (error) {
        console.error("Error searching games:", error);
        toast({
          title: "Search failed",
          description: "Unable to search for games. Please try again.",
          variant: "destructive",
        });
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [toast]
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchGames(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, searchGames]);

  const addGameToCollection = async (gameId: number) => {
    setIsAdding(true);
    try {
      const response = await fetch(
        `http://localhost:3000/${username}/collection`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: gameId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add game");
      }

      toast({
        title: "Game added!",
        description: "The game has been added to your collection",
      });

      onGameAdded();
      onOpenChange(false);
      setSearchTerm("");
      setSearchResults([]);
    } catch (error) {
      console.error("Error adding game:", error);
      toast({
        title: "Failed to add game",
        description:
          "Unable to add the game to your collection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      setSearchTerm("");
      setSearchResults([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Game</DialogTitle>
          <DialogDescription>
            Search for games to add to your collection
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search games... (min 3 characters)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              disabled={isAdding}
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2">
            {searchTerm.length > 0 && searchTerm.length < 3 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Type at least 3 characters to search
              </p>
            )}

            {searchTerm.length >= 3 &&
              !isSearching &&
              searchResults.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No games found
                </p>
              )}

            {searchResults.map((game) => {
              const isInCollection = collection.some(item => item.id === game.id.toString());
              return (
                <div
                  key={game.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <div className="flex-1">
                    <span className="font-medium">{game.name}</span>
                    {isInCollection && (
                      <span className="text-xs text-muted-foreground ml-2">
                        (Already in collection)
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => addGameToCollection(game.id)}
                    disabled={isAdding || isInCollection}
                    className="ml-2"
                  >
                    {isAdding ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
