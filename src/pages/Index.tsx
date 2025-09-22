import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { CollectionView } from "@/components/CollectionView";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (user: string, authToken: string) => {
    setUsername(user);
    setToken(authToken);
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setToken("");
    setIsLoading(false);
  };

  const handleLoginAttempt = () => {
    setIsLoading(true);
  };

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
