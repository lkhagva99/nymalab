import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
const AuthContext = createContext(null);

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5005/api'
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Add request interceptor
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If error is 401 and we haven't tried to refresh token yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If already refreshing, wait for it to complete
          return new Promise((resolve) => {
            const interval = setInterval(() => {
              if (!isRefreshing) {
                clearInterval(interval);
                originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
                resolve(api(originalRequest));
              }
            }, 100);
          });
        }

        originalRequest._retry = true;
        setIsRefreshing(true);

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await api.post('/users/refresh-token', { refreshToken });
          const { token } = response.data;
          
          localStorage.setItem('token', token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          
          setIsRefreshing(false);
          return api(originalRequest);
        } catch (refreshError) {
          setIsRefreshing(false);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          setUser(null);
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await api.get('/users/me');
          setUser(response.data);
        }
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  const register = async (username, password, email, profilePictureUrl) => {
    try {
      const response = await api.post('/users/register', {
        username,
        password,
        email,
        profilePictureUrl
      });
      
      const userData = response.data;
      localStorage.setItem('token', userData.token);
      localStorage.setItem('refreshToken', userData.refreshToken);
      setUser(userData);
      setError('');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.post('/users/login', {
        username,
        password
      });
      
      const userData = response.data;
      localStorage.setItem('token', userData.token);
      localStorage.setItem('refreshToken', userData.refreshToken);
      setUser(userData);
      setError('');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setError('');
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 