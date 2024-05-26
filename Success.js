import React from 'react';
import { Link } from 'react-router-dom';
import './Success.css'; // Import your CSS file for styling

export default function Success() {
  return (
    <div className="success-container">
      <div className="success-content">
        <h1 className="success-heading">Payment Successful!</h1>
        <p className="success-message">Thank you for your purchase.</p>
        <Link to="/" className="btn btn-dark success-button">Continue Shopping</Link>
      </div>
    </div>
  );
}

