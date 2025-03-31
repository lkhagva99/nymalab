import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './CreatePlace.css'; // Reusing the same styles

const EditPlace = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    imageUrl: '',
    website: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Load place data
    const places = JSON.parse(localStorage.getItem('places') || '[]');
    const place = places.find(p => p.id === id);
    
    if (!place) {
      navigate('/places');
      return;
    }

    // Check if user has permission to edit
    if (place.createdBy !== user.username) {
      navigate('/places');
      return;
    }

    setFormData(place);
  }, [id, navigate, user.username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!formData.name || !formData.location || !formData.description) {
      setError('Нэр, байршил, тайлбар заавал оруулна уу');
      return;
    }

    // Update place in storage
    const places = JSON.parse(localStorage.getItem('places') || '[]');
    const placeIndex = places.findIndex(p => p.id === id);
    
    if (placeIndex === -1) {
      setError('Газар олдсонгүй');
      return;
    }

    const updatedPlace = {
      ...places[placeIndex],
      ...formData,
      updatedAt: new Date().toISOString()
    };

    places[placeIndex] = updatedPlace;
    localStorage.setItem('places', JSON.stringify(places));

    // Navigate back to the place's detail page
    navigate(`/places/${id}`);
  };

  return (
    <div className="create-place-container">
      <h1>Газрын мэдээлэл засах</h1>
      
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
          <button type="button" onClick={() => navigate(`/places/${id}`)} className="cancel-button">
            Цуцлах
          </button>
          <button type="submit" className="submit-button">
            Хадгалах
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPlace; 