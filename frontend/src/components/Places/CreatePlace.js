import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './CreatePlace.css';
import axios from 'axios';

const CreatePlace = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    imageUrl: '',
    website: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Газрын нэр оруулна уу';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Газрын нэр хамгийн багадаа 3 тэмдэгт байна';
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = 'Байршил оруулна уу';
    } else if (formData.location.length < 3) {
      newErrors.location = 'Байршил хамгийн багадаа 3 тэмдэгт байна';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Тайлбар оруулна уу';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Тайлбар хамгийн багадаа 10 тэмдэгт байна';
    }

    // Image URL validation (optional)
    if (formData.imageUrl && !/^https?:\/\/.+/.test(formData.imageUrl)) {
      newErrors.imageUrl = 'Зөв зургийн URL хаяг оруулна уу';
    }

    // Website URL validation (optional)
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Зөв вэб хуудасны URL хаяг оруулна уу';
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

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5005/api/places', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      navigate(`/places/${response.data._id}`);
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: error.response?.data?.message || 'Газар нэмэхэд алдаа гарлаа'
      }));
    }
  };

  return (
    <div className="create-place-container">
      <h1>Шинэ газар нэмэх</h1>
      
      <form onSubmit={handleSubmit} className="create-place-form">
        {errors.submit && <div className="error-message">{errors.submit}</div>}
        
        <div className="form-group">
          <label htmlFor="name">Нэр *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Газрын нэр"
            className={`form-input ${errors.name ? 'error' : ''}`}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="location">Байршил *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Газрын байршил"
            className={`form-input ${errors.location ? 'error' : ''}`}
          />
          {errors.location && <span className="field-error">{errors.location}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Тайлбар *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Газрын тайлбар"
            className={`form-input ${errors.description ? 'error' : ''}`}
            rows="4"
          />
          {errors.description && <span className="field-error">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Зургийн холбоос</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Зургийн URL"
            className={`form-input ${errors.imageUrl ? 'error' : ''}`}
          />
          {errors.imageUrl && <span className="field-error">{errors.imageUrl}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="website">Вэб хуудас</label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Вэб хуудасны URL"
            className={`form-input ${errors.website ? 'error' : ''}`}
          />
          {errors.website && <span className="field-error">{errors.website}</span>}
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/places')} className="cancel-button">
            Цуцлах
          </button>
          <button type="submit" className="submit-button">
            Газар нэмэх
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePlace; 