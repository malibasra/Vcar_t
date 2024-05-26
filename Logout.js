import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('username');
    localStorage.removeItem('loginStatus');
    navigate('/login');
  }

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}