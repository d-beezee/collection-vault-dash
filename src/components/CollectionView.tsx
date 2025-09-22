import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GameCard } from "./GameCard";
import { LogOut, Search, Gamepad2, Grid3X3, List, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GameItem {
  id: string;
  main: string;
  game: string;
  image: string;
}

interface CollectionData {
  items: GameItem[];
}

interface CollectionViewProps {
  username: string;
  token: string;
  onLogout: () => void;
}

export function CollectionView({ username, token, onLogout }: CollectionViewProps) {
  const [collection, setCollection] = useState<GameItem[]>([]);
  const [filteredCollection, setFilteredCollection] = useState<GameItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { toast } = useToast();

  const fetchCollection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/${username}/collection`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch collection");
      }

      const data: CollectionData = await response.json();
      setCollection(data.items);
      setFilteredCollection(data.items);
      
      toast({
        title: "Collection loaded!",
        description: `Found ${data.items.length} games in your collection`,
      });
    } catch (error) {
      toast({
        title: "Error loading collection",
        description: "Failed to fetch your games. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, [username, token]);

  useEffect(() => {
    const filtered = collection.filter(
      (item) =>
        item.main.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.game.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCollection(filtered);
  }, [searchTerm, collection]);

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Gaming Collection</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {username}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchCollection()}
                disabled={isLoading}
                className="hover:bg-gaming-surface-hover"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="hover:bg-gaming-surface-hover text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search and controls */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gaming-surface border-border/50 focus:border-primary"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="hover:bg-gaming-surface-hover"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="hover:bg-gaming-surface-hover"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gaming-surface rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredCollection.length === 0 ? (
          <div className="text-center py-16">
            <Gamepad2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm ? "No games found" : "No games in collection"}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? "Try adjusting your search terms"
                : "Your gaming collection appears to be empty"
              }
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Your Collection</h2>
                <p className="text-muted-foreground">
                  {filteredCollection.length} {filteredCollection.length === 1 ? 'game' : 'games'}
                  {searchTerm && collection.length !== filteredCollection.length && (
                    <span> (filtered from {collection.length})</span>
                  )}
                </p>
              </div>
            </div>

            <div className={
              viewMode === "grid"
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
                : "grid grid-cols-1 md:grid-cols-2 gap-4"
            }>
              {filteredCollection.map((item) => (
                <GameCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}