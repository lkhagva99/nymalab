import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './CreatePlace.css';

const API_URL = 'http://localhost:5000/api';

const CreatePlace = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    imageUrl: '',
    website: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    // Validate required fields
    if (!formData.name || !formData.location || !formData.description) {
      setError('Нэр, байршил, тайлбар заавал оруулна уу');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/places`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create place');
      }

      const newPlace = await response.json();
      navigate(`/places/${newPlace._id}`);
    } catch (err) {
      setError(err.message || 'Failed to create place. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-place-container">
      <h1>Шинэ газар нэмэх</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Нэр</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Газрын нэр"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Байршил</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Газрын байршил"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Тайлбар</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Газрын тайлбар"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Зургийн холбоос</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Зургийн URL"
          />
        </div>

        <div className="form-group">
          <label htmlFor="website">Вэб хуудас</label>
          <input
            type="text"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Вэб хуудасны холбоос"
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Хадгалж байна...' : 'Хадгалах'}
        </button>
      </form>
    </div>
  );
};

export default CreatePlace; 