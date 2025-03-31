import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);
const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // Check if user is logged in on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed');
        return false;
      }

      // Save token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: data._id,
        username: data.username,
      }));
      
      setToken(data.token);
      setUser({
        _id: data._id,
        username: data.username,
      });
      setError('');
      return true;
    } catch (error) {
      setError('Registration failed. Please try again.');
      return false;
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return false;
      }

      // Save token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: data._id,
        username: data.username,
      }));
      
      setToken(data.token);
      setUser({
        _id: data._id,
        username: data.username,
      });
      setError('');
      return true;
    } catch (error) {
      setError('Login failed. Please try again.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setError('');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, error }}>
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