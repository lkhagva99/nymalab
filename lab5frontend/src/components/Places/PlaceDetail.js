import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './PlaceDetail.css';

const API_URL = 'http://localhost:5000/api';

const PlaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

        const data = await response.json();
        setPlace(data);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load place details');
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [id, token]);

  const handleDelete = async () => {
    if (window.confirm('Та энэ газрыг устгахдаа итгэлтэй байна уу?')) {
      try {
        const response = await fetch(`${API_URL}/places/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete place');
        }

        navigate('/places');
      } catch (err) {
        setError(err.message || 'Failed to delete place');
      }
    }
  };

  if (loading) {
    return (
      <div className="place-detail-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="place-detail-container">
        <div className="place-not-found">
          <h2>{error || 'Газар олдсонгүй'}</h2>
          <Link to="/places" className="back-button">Газрын жагсаалт руу буцах</Link>
        </div>
      </div>
    );
  }

  const isOwner = place.createdBy._id === user._id;

  return (
    <div className="place-detail-container">
      <div className="place-detail-header">
        <Link to="/places" className="back-button">← Газрын жагсаалт руу буцах</Link>
        {isOwner && (
          <div className="place-actions">
            <Link to={`/places/${id}/edit`} className="edit-button">
              Засах
            </Link>
            <button onClick={handleDelete} className="delete-button">
              Устгах
            </button>
          </div>
        )}
      </div>

      <div className="place-detail-content">
        <div className="place-detail-image">
          <img src={place.imageUrl || 'https://via.placeholder.com/800x400'} alt={place.name} />
        </div>

        <div className="place-detail-info">
          <h1>{place.name}</h1>
          <p className="place-location">{place.location}</p>
          <p className="place-description">{place.description}</p>

          <div className="place-metadata">
            <p>Нэмсэн: {place.createdBy.username}</p>
            <p>Огноо: {new Date(place.createdAt).toLocaleDateString()}</p>
            {place.website && (
              <p>
                <a href={place.website} target="_blank" rel="noopener noreferrer" className="website-link">
                  Вэб хуудас руу зочлох
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetail; 