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
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!formData.name || !formData.location || !formData.description) {
      setError('Нэр, байршил, тайлбар заавал оруулна уу');
      return;
    }

    // Create new place object
    const newPlace = {
      id: Date.now().toString(),
      ...formData,
      // createdBy: user.username,
      // createdAt: new Date().toISOString()
    };

    // Get existing places and add new one
    // const places = JSON.parse(localStorage.getItem('places') || '[]');
    // places.push(newPlace);
    // localStorage.setItem('places', JSON.stringify(places));
    const token = localStorage.getItem('token');
    const response = await axios.post('http://localhost:5000/api/places', newPlace,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(response.data);

    // Navigate to the new place's detail page
    navigate(`/places/${response.data._id}`);
  };

  return (
    <div className="create-place-container">
      <h1>Шинэ газар нэмэх</h1>
      
      <form onSubmit={handleSubmit} className="create-place-form">
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="name">Нэр *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Газрын нэр"
            className="form-input"
          />
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
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Тайлбар *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Газрын тайлбар"
            className="form-input"
            rows="4"
          />
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
            className="form-input"
          />
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
            className="form-input"
          />
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