import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePictureUrl: ''
  });
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Хэрэглэгчийн нэр оруулна уу';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Хэрэглэгчийн нэр хамгийн багадаа 3 тэмдэгт байна';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Хэрэглэгчийн нэр зөвхөн үсэг, тоо, доогуур зураас агуулж болно';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'И-мэйл хаяг оруулна уу';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Зөв и-мэйл хаяг оруулна уу';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Нууц үг оруулна уу';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Нууц үг хамгийн багадаа 6 тэмдэгт байна';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Нууц үг том үсэг, жижиг үсэг, тоо агуулсан байх ёстой';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Нууц үгээ баталгаажуулна уу';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Нууц үг таарахгүй байна';
    }

    // Profile picture URL validation (optional)
    if (formData.profilePictureUrl && !/^https?:\/\/.+/.test(formData.profilePictureUrl)) {
      newErrors.profilePictureUrl = 'Зөв URL хаяг оруулна уу';
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

    const result = await register(
      formData.username,
      formData.password,
      formData.email,
      formData.profilePictureUrl
    );
    
    if (result) {
      navigate('/places');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Бүртгэл</h1>
        <p>Шинэ хэрэглэгч үүсгэх</p>
        <form onSubmit={handleSubmit}>
          {Object.keys(errors).length > 0 && (
            <div className="error-message">
              {Object.values(errors)[0]}
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
              type="email"
              name="email"
              placeholder="И-мэйл хаяг"
              value={formData.email}
              onChange={handleChange}
              className={`login-input ${errors.email ? 'error' : ''}`}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <input
              type="url"
              name="profilePictureUrl"
              placeholder="Профайл зургийн холбоос (заавал биш)"
              value={formData.profilePictureUrl}
              onChange={handleChange}
              className={`login-input ${errors.profilePictureUrl ? 'error' : ''}`}
            />
            {errors.profilePictureUrl && <span className="field-error">{errors.profilePictureUrl}</span>}
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
          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Нууц үг баталгаажуулах"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`login-input ${errors.confirmPassword ? 'error' : ''}`}
            />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>
          <button type="submit" className="login-button">
            Бүртгүүлэх
          </button>
        </form>
        <p className="auth-link">
          Аль хэдийн бүртгэлтэй юу? <Link to="/login">Нэвтрэх</Link>
        </p>
      </div>
    </div>
  );
};

export default Register; 