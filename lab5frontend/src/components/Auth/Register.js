import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate input
    if (!username || !password || !confirmPassword) {
      setError('Бүх талбарыг бөглөнө үү');
      return;
    }

    if (password !== confirmPassword) {
      setError('Нууц үг таарахгүй байна');
      return;
    }

    if (password.length < 6) {
      setError('Нууц үг хамгийн багадаа 6 тэмдэгт байна');
      return;
    }

    if (register(username, password)) {
      navigate('/places');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Бүртгэл</h1>
        <p>Шинэ хэрэглэгч үүсгэх</p>
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
          <div className="form-group">
            <input
              type="password"
              placeholder="Нууц үг баталгаажуулах"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="login-input"
            />
          </div>
          <button type="submit" className="login-button">
            Бүртгүүлэх
          </button>
        </form>
        <p className="auth-link">
          Адь хэдийн бүртгэлтэй юу? <Link to="/login">Нэвтэрнэх</Link>
        </p>
      </div>
    </div>
  );
};

export default Register; 