import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../config/api";
import type { IUser } from "../assets/assets";

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const verifySession = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/auth/verify", { method: "GET" });
      if (res.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch (err: any) {
      setUser(null);
      // Silently fail verification if session doesn't exist
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch("/auth/login", {
        method: "POST",
        bodyData: { email, password },
      });
      setUser(res.user);
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch("/auth/register", {
        method: "POST",
        bodyData: { name, email, password },
      });
      setUser(res.user);
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await apiFetch("/auth/logout", { method: "POST" });
      setUser(null);
    } catch (err: any) {
      setError(err.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifySession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
