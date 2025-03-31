import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Places.css';

const API_URL = 'http://localhost:5000/api';

const Places = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch(`${API_URL}/places`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch places');
        }

        const data = await response.json();
        setPlaces(data);
        setError('');
      } catch (err) {
        setError('Failed to load places. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [token]);

  if (loading) {
    return (
      <div className="places-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="places-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="places-container">
      <div className="places-header">
        <h1>Газрууд</h1>
        <Link to="/places/new" className="create-place-button">
          Шинэ газар нэмэх
        </Link>
      </div>
      
      <div className="places-list">
        {places.length === 0 ? (
          <p className="no-places">Одоогоор газар нэмээгүй байна. Эхний газраа нэмнэ үү!</p>
        ) : (
          places.map((place) => (
            <Link 
              to={`/places/${place._id}`} 
              key={place._id} 
              className="place-item"
            >
              <div className="place-image">
                <img src={place.imageUrl || 'https://via.placeholder.com/300x200'} alt={place.name} />
              </div>
              <div className="place-info">
                <h2>{place.name}</h2>
                <p className="place-location">{place.location}</p>
                <p className="place-description">{place.description.substring(0, 150)}...</p>
                <p className="place-metadata">
                  Нэмсэн: {place.createdBy.username} | 
                  Огноо: {new Date(place.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Places; 