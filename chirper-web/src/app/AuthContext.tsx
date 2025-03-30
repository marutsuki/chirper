import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  getAuthHeaders: () => HeadersInit;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'chirper_auth_token';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const navigate = useNavigate();

  useEffect(() => {
    // Update authentication state when token changes
    setIsAuthenticated(!!token);
    
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
  };

  const logout = async () => {
    try {
      // Call the logout endpoint (optional, since we're using JWT)
      await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear token regardless of API call success
      setToken(null);
      navigate('/');
    }
  };

  const getAuthHeaders = (): HeadersInit => {
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const value = {
    token,
    isAuthenticated,
    login,
    logout,
    getAuthHeaders,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
