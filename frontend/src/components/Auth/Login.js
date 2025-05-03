import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Хэрэглэгчийн нэр оруулна уу';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Хэрэглэгчийн нэр хамгийн багадаа 3 тэмдэгт байна';
    }

    if (!formData.password) {
      newErrors.password = 'Нууц үг оруулна уу';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Нууц үг хамгийн багадаа 6 тэмдэгт байна';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await login(formData.username, formData.password);
    if (result) {
      navigate('/');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Нэвтрэх</h1>
        <form onSubmit={handleSubmit}>
          {(authError || Object.keys(errors).length > 0) && (
            <div className="error-message">
              {authError || Object.values(errors)[0]}
            </div>
          )}
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Хэрэглэгчийн нэр"
              value={formData.username}
              onChange={handleChange}
              className={`login-input ${errors.username ? 'error' : ''}`}
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Нууц үг"
              value={formData.password}
              onChange={handleChange}
              className={`login-input ${errors.password ? 'error' : ''}`}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
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