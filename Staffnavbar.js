import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';

export default function Staffnavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Redirect to the login page
    localStorage.removeItem('staff');
    localStorage.clear();
    navigate('/stafflogin');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
        <div className="container-fluid">
          {/*<h1 className="navbar-brand me-auto" style={{ color: 'lightgray', fontSize: '24px' }}>Hello! {staffname}</h1>*/}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" style={{ fontSize: '24px' }} to="/staffview">Staff Page</Link>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button className="btn btn-dark" onClick={handleLogout}><FaSignOutAlt />Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
