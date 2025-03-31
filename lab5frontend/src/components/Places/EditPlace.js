import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './CreatePlace.css';

const API_URL = 'http://localhost:5000/api';

const EditPlace = () => {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await fetch(`${API_URL}/places/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Place not found');
        }

        const place = await response.json();
        
        // Check if user is the owner
        if (place.createdBy._id !== user._id) {
          navigate('/places');
          return;
        }

        setFormData({
          name: place.name,
          location: place.location,
          description: place.description,
          imageUrl: place.imageUrl || '',
          website: place.website || ''
        });
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load place details');
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [id, token, user._id, navigate]);

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
      const response = await fetch(`${API_URL}/places/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update place');
      }

      const updatedPlace = await response.json();
      navigate(`/places/${updatedPlace._id}`);
    } catch (err) {
      setError(err.message || 'Failed to update place. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="create-place-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="create-place-container">
      <h1>Газар засах</h1>
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

export default EditPlace; 