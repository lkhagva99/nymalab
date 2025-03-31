import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Header from './components/Header/Header';
import Places from './components/Places/Places';
import PlaceDetail from './components/Places/PlaceDetail';
import CreatePlace from './components/Places/CreatePlace';
import EditPlace from './components/Places/EditPlace';
import './App.css';

// Wrapper component to handle auth logic
const AuthWrapper = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // If user is not logged in and trying to access a protected route
  if (!user && location.pathname !== '/login' && location.pathname !== '/register') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is logged in and trying to access login/register
  if (user && (location.pathname === '/login' || location.pathname === '/register')) {
    return <Navigate to="/places" replace />;
  }

  return (
    <>
      {user && <Header />}
      {children}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthWrapper>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/places" element={<Places />} />
              <Route path="/places/new" element={<CreatePlace />} />
              <Route path="/places/:id/edit" element={<EditPlace />} />
              <Route path="/places/:id" element={<PlaceDetail />} />
              <Route path="/" element={<Navigate to="/places" replace />} />
            </Routes>
          </div>
        </AuthWrapper>
      </Router>
    </AuthProvider>
  );
}

export default App;
