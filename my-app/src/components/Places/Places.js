import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Places.css';
import axios from 'axios';

const Places = () => {
  // Get places from localStorage
  const [places, setPlaces] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCreateClick = (e) => {
    if (!user) {
      e.preventDefault();
      toast.error('Шинэ газар нэмэхэд нэвтэрсэн байх шаардлагатай');
      navigate('/login', { state: { from: '/places/new' } });
    }
  };
  useEffect(() => {
    const fetchPlaces = async () => {
      const response = await axios.get('http://localhost:5000/api/places');
      setPlaces(response.data);
    };
    fetchPlaces();
  }, []);

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