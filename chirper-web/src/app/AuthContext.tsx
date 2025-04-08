import { backend } from '@/config';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  currentUserId: number | null;
  login: (token: string) => void;
  logout: () => void;
  getAuthHeaders: () => HeadersInit;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'chirper_auth_token';

// Function to decode JWT token and extract user ID
const getUserIdFromToken = (token: string): number | null => {
  try {
    // JWT tokens are in format: header.payload.signature
    const payload = token.split('.')[1];
    // Decode the base64 payload
    const decodedPayload = atob(payload);
    // Parse the JSON
    const parsedPayload = JSON.parse(decodedPayload);
    // Extract the subject (user ID)
    return parsedPayload.sub ? Number(parsedPayload.sub) : null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const [currentUserId, setCurrentUserId] = useState<number | null>(
    token ? getUserIdFromToken(token) : null
  );

  useEffect(() => {
    // Update authentication state when token changes
    setIsAuthenticated(!!token);
    setCurrentUserId(token ? getUserIdFromToken(token) : null);
    
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
      await fetch(backend('/auth/logout'), {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear token regardless of API call success
      setToken(null);
    }
  };

  const getAuthHeaders = (): HeadersInit => {
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const value = {
    token,
    isAuthenticated,
    currentUserId,
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
