import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Dynamic helper to resolve Backend Base URL (http://ip:5000 or origin) on PC, Mobile devices, and Tunnels
export const getApiBaseUrl = () => {
  const customApiUrl = import.meta.env.VITE_API_URL;
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    // When accessed from mobile phone / local network IP (e.g., 192.168.x.x, 10.x.x.x) or Tunnel:
    if (!customApiUrl || customApiUrl.includes("localhost") || customApiUrl.includes("127.0.0.1")) {
      const port = window.location.port === "5176" ? "5000" : (window.location.port || "");
      return `${window.location.protocol}//${window.location.hostname}${port ? `:${port}` : ""}`;
    }
    return customApiUrl.replace(/\/api\/?$/, "");
  }
  if (customApiUrl) {
    return customApiUrl.replace(/\/api\/?$/, "");
  }
  return "http://localhost:5000";
};

export const getApiUrl = () => {
  return `${getApiBaseUrl()}/api`;
};

// Setup request interceptor to dynamically replace hardcoded localhost URLs for mobile devices
axios.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers["ngrok-skip-browser-warning"] = "true";
  config.headers["Bypass-Tunnel-Reminder"] = "true";

  const apiBase = getApiBaseUrl();

  if (config.url && (config.url.startsWith("http://localhost:5000") || config.url.startsWith("http://127.0.0.1:5000"))) {
    config.url = config.url.replace(/^http:\/\/(localhost|127\.0\.0\.1):5000/, apiBase);
  }
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (user && user.id) {
      const socketUrl = getApiBaseUrl();
      const newSocket = io(socketUrl);
      newSocket.emit("registerSocketUser", { userId: user.id });
      setSocket(newSocket);
      return () => {
        newSocket.close();
      };
    } else {
      setSocket(null);
    }
  }, [user]);

  // =========================
  // REGISTER
  // =========================
  const register = async (userData) => {
    const API_URL = getApiUrl();
    await axios.post(
      `${API_URL}/auth/register`,
      userData
    );

    return true;
  };

  // =========================
  // LOGIN
  // =========================
  const login = async (credentials) => {
    const API_URL = getApiUrl();
    const res = await axios.post(
      `${API_URL}/auth/login`,
      credentials
    );

    const { token, user } = res.data;

    localStorage.getItem("token");
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;

    setUser(user);

    return user;
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    delete axios.defaults.headers.common[
      "Authorization"
    ];

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        socket,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
