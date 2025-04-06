import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './PlaceDetail.css';

const PlaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get place from localStorage
  const places = JSON.parse(localStorage.getItem('places') || '[]');
  const place = places.find(p => p.id === id);

  const handleEditClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate('/login', { state: { from: `/places/${id}/edit` } });
      return;
    }

    if (place.createdBy !== user.username) {
      e.preventDefault();
      toast.error('Та зөвхөн өөрийн нэмсэн газрыг засах боломжтой');
      navigate(`/places/${id}`);
    }
  };

  const handleDelete = () => {
    if (!user) {
      navigate('/login', { state: { from: `/places/${id}` } });
      return;
    }

    if (window.confirm('Та энэ газрыг устгахдаа итгэлтэй байна уу?')) {
      const updatedPlaces = places.filter(p => p.id !== id);
      localStorage.setItem('places', JSON.stringify(updatedPlaces));
      navigate('/places');
    }
  };

  if (!place) {
    return (
      <div className="place-detail-container">
        <div className="place-not-found">
          <h2>Газар олдсонгүй</h2>
          <Link to="/places" className="back-button">Газрын жагсаалт руу буцах</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="place-detail-container">
      <div className="place-detail-header">
        <Link to="/places" className="back-button">← Газрын жагсаалт руу буцах</Link>
        <div className="place-actions">
          <Link 
            to={`/places/${id}/edit`} 
            className="edit-button"
            onClick={handleEditClick}
          >
            Засах
          </Link>
          {user && place.createdBy === user.username && (
            <button onClick={handleDelete} className="delete-button">Устгах</button>
          )}
        </div>
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
            <p>Нэмсэн хэрэглэгч: {place.createdBy}</p>
            <p>Нэмсэн огноо: {new Date(place.createdAt).toLocaleDateString()}</p>
          </div>

          {place.website && (
            <a 
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="website-link"
            >
              Вэб хуудас руу зочлох
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceDetail; 