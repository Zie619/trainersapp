import React from 'react';
import { useAuth } from '../AuthContext';
import './UserView.css'; // Import your existing CSS file

const LogoutButton = () => {
  const { user, logout } = useAuth();
  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="logout-button-container"> {/* Add a class for styling */}
      <button onClick={handleLogout}  className="logout-button" > התנתקות </button>
    </div>
  );
};

export default LogoutButton;
