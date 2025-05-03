import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Та системээс гарахдаа итгэлтэй байна уу?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          Газрын Систем
        </Link>
        
        <div className="user-info">
          <span className="username">
            Сайн байна уу, {user.username}!
          </span>
          <button onClick={handleLogout} className="logout-button">
            Гарах
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 