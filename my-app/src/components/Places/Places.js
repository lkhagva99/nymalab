import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Places.css';

const Places = () => {
  // Get places from localStorage
  const places = JSON.parse(localStorage.getItem('places') || '[]');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCreateClick = (e) => {
    if (!user) {
      e.preventDefault();
      toast.error('Шинэ газар нэмэхэд нэвтэрсэн байх шаардлагатай');
      navigate('/login', { state: { from: '/places/new' } });
    }
  };

  return (
    <div className="places-container">
      <div className="places-header">
        <h1>Газрууд</h1>
        <Link 
          to="/places/new" 
          className="create-place-button"
          onClick={handleCreateClick}
        >
          Шинэ газар нэмэх
        </Link>
      </div>
      
      <div className="places-list">
        {places.length === 0 ? (
          <p className="no-places">Одоогоор газар нэмээгүй байна. Эхний газраа нэмнэ үү!</p>
        ) : (
          places.map((place) => (
            <Link 
              to={`/places/${place.id}`} 
              key={place.id} 
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
                  Нэмсэн: {place.createdBy} | 
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