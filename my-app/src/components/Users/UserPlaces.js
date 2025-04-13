import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserPlaces.css';

const UserPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndPlaces = async () => {
      try {
        // Fetch user details
        const userResponse = await axios.get(`http://localhost:5000/api/users/id/${userId}`);
        setUser(userResponse.data);

        // Fetch user's places
        const placesResponse = await axios.get(`http://localhost:5000/api/places/${userId}/places`);
        setPlaces(placesResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Хэрэглэгчийн газруудыг ачаалахад алдаа гарлаа');
        setLoading(false);
      }
    };

    fetchUserAndPlaces();
  }, [userId]);

  if (loading) {
    return (
      <div className="user-places-container">
        <div className="loading">Ачаалж байна...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-places-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="user-places-container">
      <div className="user-places-header">
        <div className="user-info-header">
          <div className="user-avatar-large">
            {user?.profilePictureUrl ? (
              <img src={user.profilePictureUrl} alt={user.username} />
            ) : (
              <div className="avatar-placeholder-large">
                {user?.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="user-details">
            <h1>{user?.username}-н нэмсэн газрууд</h1>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>
        <button onClick={() => navigate('/users')} className="back-button">
          Буцах
        </button>
      </div>

      <div className="places-grid">
        {places.length === 0 ? (
          <p className="no-places">Энэ хэрэглэгч одоогоор газар нэмээгүй байна.</p>
        ) : (
          places.map((place) => (
            <Link 
              to={`/places/${place._id}`} 
              key={place._id} 
              className="place-card"
            >
              <div className="place-image">
                <img src={place.imageUrl || 'https://via.placeholder.com/300x200'} alt={place.name} />
              </div>
              <div className="place-info">
                <h2>{place.name}</h2>
                <p className="place-location">{place.location}</p>
                <p className="place-description">{place.description.substring(0, 100)}...</p>
                <p className="place-date">
                  Нэмсэн огноо: {new Date(place.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default UserPlaces; 