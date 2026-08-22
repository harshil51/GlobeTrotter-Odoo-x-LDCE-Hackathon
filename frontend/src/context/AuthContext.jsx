import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('globetrotter_token'));
  const [loading, setLoading] = useState(true);

  // Initialize and check current user
  useEffect(() => {
    const fetchMe = async () => {
      const storedToken = localStorage.getItem('globetrotter_token');
      if (storedToken) {
        try {
          const userData = await authApi.getMe();
          setUser(userData);
        } catch (err) {
          console.error('Failed to load user profile:', err);
          localStorage.removeItem('globetrotter_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchMe();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    localStorage.setItem('globetrotter_token', res.token);
    setToken(res.token);
    // Fetch full profile info
    try {
      const fullProfile = await authApi.getMe();
      setUser(fullProfile);
    } catch {
      setUser(res.user);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    localStorage.setItem('globetrotter_token', res.token);
    setToken(res.token);
    try {
      const fullProfile = await authApi.getMe();
      setUser(fullProfile);
    } catch {
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('globetrotter_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const updated = await authApi.updateProfile(profileData);
    setUser((prev) => ({ ...prev, ...updated }));
    return updated;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    updateProfile,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
