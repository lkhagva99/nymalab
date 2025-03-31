import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = (username, password) => {
    // Get existing users or initialize empty array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if username already exists
    if (users.some(user => user.username === username)) {
      setError('Username already exists');
      return false;
    }

    // Add new user
    const newUser = {
      username,
      password, // In a real app, you should hash the password
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after registration
    const userData = { username, createdAt: newUser.createdAt };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setError('');
    return true;
  };

  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      const userData = { 
        username: user.username,
        createdAt: user.createdAt
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setError('');
      return true;
    }
    
    setError('Invalid username or password');
    return false;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setError('');
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