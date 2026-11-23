import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
export const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await api.get("/auth/me", {
          withCredentials: true,
        });
        console.log(res.data.user);

        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    verifyUser();
  }, []);
  const login = (userData) => setUser(userData);
  const logout = async () => {
    try {
      await api.post("/auth/logout");
      console.log("Successfully logged out");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };
  const isAuthenticated = !!user;
  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
