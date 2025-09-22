import { useState, useEffect } from "react";
import { LoginForm } from "@/components/LoginForm";
import { CollectionView } from "@/components/CollectionView";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved login credentials
    const savedUsername = localStorage.getItem("gaming_username");
    const savedToken = localStorage.getItem("gaming_token");
    
    if (savedUsername && savedToken) {
      setUsername(savedUsername);
      setToken(savedToken);
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  const handleLogin = (user: string, authToken: string) => {
    setUsername(user);
    setToken(authToken);
    setIsAuthenticated(true);
    setIsLoading(false);
    
    // Save credentials to localStorage
    localStorage.setItem("gaming_username", user);
    localStorage.setItem("gaming_token", authToken);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setToken("");
    setIsLoading(false);
    
    // Clear credentials from localStorage
    localStorage.removeItem("gaming_username");
    localStorage.removeItem("gaming_token");
  };

  const handleLoginAttempt = () => {
    setIsLoading(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-surface">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <CollectionView
        username={username}
        token={token}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <LoginForm 
      onLogin={handleLogin}
      isLoading={isLoading}
    />
  );
};

export default Index;
