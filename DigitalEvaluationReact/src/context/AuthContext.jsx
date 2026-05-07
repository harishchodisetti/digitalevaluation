import { createContext, useState, useEffect, useContext } from "react";
import API, { setAccessToken } from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessTokenState] = useState(null);
  const [loading, setLoading] = useState(true); // NEW

  // Try to refresh token on mount
  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const res = await API.get("/Auth/refreshToken");
        setAccessTokenState(res.data.token);
        setAccessToken(res.data.token);
        setUser({ username: res.data.username });
      } catch {
        setUser(null);
        setAccessTokenState(null);
        setAccessToken(null);
      } finally {
        setLoading(false); // ✅ wait until refresh finishes
      }
    };
    tryRefresh();
  }, []);

  // Login
  const login = async (formData) => {
    const res = await API.post("/Auth/login", formData);
    setAccessTokenState(res.data.token);
    setAccessToken(res.data.token);
    setUser({ username: res.data.username });
    return res.data;
  };

  // Logout with confirm
  const logout = () => {
    const confirmLogout = window.confirm("Do you want to logout?");
    if (confirmLogout) {
      setAccessTokenState(null);
      setAccessToken(null);
      setUser(null);
      window.location.href = "/login"; // optional redirect
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
