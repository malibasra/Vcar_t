import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';

export default function Adminnavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout actions here, e.g., clearing local storage, redirecting to login page
    // For demonstration purposes, let's assume clearing local storage
    localStorage.clear();
    navigate('/adminlogin');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <button
            className="btn btn-dark me-2"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasExample"
            aria-controls="offcanvasExample"
          >
            <FaBars />
          </button>
          <Link className="navbar-brand ms-auto" to="/admindashboard">Admin Dashboard</Link>
          <Link className="navbar-brand ms-auto" to="/">V CART</Link>
          <button className="btn btn-dark" onClick={handleLogout}><FaSignOutAlt />Logout</button>
        </div>
      </nav>

      <div className="offcanvas offcanvas-start text-bg-dark" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel">Admin Dashboard</h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <div className="list-group">
            <Link className="list-group-item list-group-item-action text-bg-dark" to="/productmanagement">Product Management</Link>
            <Link className="list-group-item list-group-item-action text-bg-dark" to="/usermanagement">User Management</Link>
            <Link className="list-group-item list-group-item-action text-bg-dark" to="/staffmanagement">Staff Management</Link>
            <Link className="list-group-item list-group-item-action text-bg-dark" to="/categorymanagement">Category Management</Link>
            <Link className="list-group-item list-group-item-action text-bg-dark" to="/ordermanagement">Order Management</Link>
            <Link className="list-group-item list-group-item-action text-bg-dark" to="/promotionmanagement">Promotion Management</Link>
          </div>
        </div>
      </div>
    </>
  );
}
