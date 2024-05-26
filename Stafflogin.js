import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Stafflogin() {
  const [name, SetName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/Staff/Login', { name,email, password });
      const result = response.data;
      if (result === 'Staff Successfully') {
        // Staff successfully logged in, store login status and navigate to StaffDashboard
        localStorage.setItem('loginStatus', result);
        localStorage.setItem('staff',name);
        navigate('/staffview');
      } else {
        setMessage('Invalid username,email or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setMessage('An error occurred while logging in');
    }
  };

  return (
    <div className='row vh-100 justify-content-center align-items-center bg-info'>
      <div className='col-lg-4 col-md-6 col-sm-8 col-xs-10'>
        <div className='card bg-info-subtle'>
          <div className='card-body'>
            <form onSubmit={handleSubmit}>
            <div className='mb-3'>
                <label htmlFor='name'>Name</label>
                <input
                  type='name'
                  placeholder='Enter Name'
                  className='form-control'
                  value={name}
                  onChange={(e) => SetName(e.target.value)}
                />
              </div>
              <div className='mb-3'>
                <label htmlFor='email'>Email</label>
                <input
                  type='email'
                  placeholder='Enter Email'
                  className='form-control'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className='mb-3'>
                <label htmlFor='password'>Password</label>
                <input
                  type='password'
                  placeholder='Enter Password'
                  className='form-control'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {message && <div className='text-danger'>{message}</div>}
              <button className='btn btn-success btn-block'>Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
