import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:5000/api/users/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
        }
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  const register = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', {
        username,
        password
      });
      
      const userData = response.data;
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
      const response = await axios.post('http://localhost:5000/api/users/login', {
        username,
        password
      });
      
      const userData = response.data;
      localStorage.setItem('token', userData.token);
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
      localStorage.removeItem('user');
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setError('');
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