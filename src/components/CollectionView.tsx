import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/const";
import { useToast } from "@/hooks/use-toast";
import {
  Gamepad2,
  Grid3X3,
  List,
  LogOut,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AddGameDialog } from "./AddGameDialog";
import { GameCard } from "./GameCard";

interface GameItem {
  id: string;
  main: string;
  collectionId: string;
  game: string;
  image: string;
  rating?: number;
}

interface CollectionData {
  items: GameItem[];
}

interface CollectionViewProps {
  username: string;
  token: string;
  onLogout: () => void;
}

export function CollectionView({
  username,
  token,
  onLogout,
}: CollectionViewProps) {
  const [collection, setCollection] = useState<GameItem[]>([]);
  const [filteredCollection, setFilteredCollection] = useState<GameItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  const fetchCollection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/${username}/collection`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch collection");
      }

      const data: CollectionData = await response.json();
      setCollection(data.items);
      setFilteredCollection(data.items);
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
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-lg sm:rounded-xl flex items-center justify-center">
                <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <div className="min-w-0 flex-1 sm:flex-none">
                <h1 className="text-lg sm:text-xl font-bold font-display truncate">Gaming Collection</h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate font-medium">
                  Welcome back, {username}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowAddDialog(true)}
                className="bg-gaming-accent hover:bg-gaming-accent/90 h-8 sm:h-9 px-2 sm:px-3"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Add Game</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchCollection()}
                disabled={isLoading}
                className="hover:bg-gaming-surface-hover h-8 sm:h-9 w-8 sm:w-9 p-0"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="hover:bg-gaming-surface-hover text-muted-foreground hover:text-foreground h-8 sm:h-9 w-8 sm:w-9 p-0"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search and controls - Desktop only */}
          <div className="mt-3 sm:mt-4 hidden sm:flex flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gaming-surface border-border/50 focus:border-primary h-10"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="hover:bg-gaming-surface-hover h-10 px-4"
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="ml-2">Grid</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="hover:bg-gaming-surface-hover h-10 px-4"
              >
                <List className="w-4 h-4" />
                <span className="ml-2">List</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-20 sm:pb-6">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-gaming-surface rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : filteredCollection.length === 0 ? (
          <div className="text-center py-12 sm:py-16 px-4">
            <Gamepad2 className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-medium font-display mb-2">
              {searchTerm ? "No games found" : "No games in collection"}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Your gaming collection appears to be empty"}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-display">Your Collection</h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {filteredCollection.length}{" "}
                  {filteredCollection.length === 1 ? "game" : "games"}
                  {searchTerm &&
                    collection.length !== filteredCollection.length && (
                      <span className="hidden sm:inline"> (filtered from {collection.length})</span>
                    )}
                </p>
              </div>
            </div>

            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
                  : "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
              }
            >
              {filteredCollection.map((item) => (
                <GameCard
                  key={item.id}
                  item={item}
                  token={token}
                  username={username}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Mobile Search and Controls Bar - Fixed Bottom */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border/50 p-3 z-40">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gaming-surface border-border/50 focus:border-primary h-10"
            />
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="hover:bg-gaming-surface-hover h-10 w-10 p-0"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="hover:bg-gaming-surface-hover h-10 w-10 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <AddGameDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        username={username}
        token={token}
        onGameAdded={fetchCollection}
        collection={collection}
      />
    </div>
  );
}
