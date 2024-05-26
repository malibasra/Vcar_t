import React from 'react';
import { Link } from 'react-router-dom';
import './Cancel.css'; // Import your CSS file for styling

export default function Cancel() {
  return (
    <div className="cancel-container">
      <div className="cancel-content">
        <h1 className="cancel-heading">Payment Unsuccessful!</h1>
        <p className="cancel-message">Your payment could not be processed.</p>
        <Link to="/" className="btn btn-dark cancel-button">Try Again</Link>
      </div>
    </div>
  );
}
