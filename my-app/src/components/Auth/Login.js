import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password)
    if (result) {
      navigate('/');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Нэвтрэх</h1>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <input
              type="text"
              placeholder="Хэрэглэгчийн нэр"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Нууц үг"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
          </div>
          <button type="submit" className="login-button">
            Нэвтрэх
          </button>
        </form>
        <p className="auth-link">
          Шинэ хэрэглэгч үү? <Link to="/register">Бүртгэл үүсгэх</Link>
        </p>
      </div>
    </div>
  );
};

export default Login; 