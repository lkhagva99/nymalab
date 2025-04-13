import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError('Хэрэглэгчдийн жагсаалтыг ачаалахад алдаа гарлаа');
      setLoading(false);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/users/${userId}/places`);
  };

  if (loading) {
    return (
      <div className="user-list-container">
        <div className="loading">Ачаалж байна...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-list-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h1>Хэрэглэгчид</h1>
        <button onClick={() => navigate('/places')} className="back-button">
          Буцах
        </button>
      </div>
      <div className="user-list">
        {users.map((user) => (
          <div 
            key={user._id} 
            className="user-card"
            onClick={() => handleUserClick(user._id)}
            role="button"
            tabIndex={0}
          >
            <div className="user-avatar">
              {user.profilePictureUrl ? (
                <img src={user.profilePictureUrl} alt={user.username} />
              ) : (
                <div className="avatar-placeholder">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="user-info">
              <h3>{user.username}</h3>
              <p>{user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList; 