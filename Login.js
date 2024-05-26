import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [loginResult, setLoginResult] = useState('');

  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    if (!/^[A-Za-z_]+$/.test(e.target.value)) {
      setMessage('Invalid username');
    } else {
      setMessage('');
    }
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    if (e.target.value.length < 8) {
      setMessage('Password must be at least 8 characters');
    } else {
      setMessage('');
    }
    setPassword(e.target.value);
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedLoginStatus = localStorage.getItem('loginStatus');

    if (storedUsername && storedLoginStatus) {
      setUsername(storedUsername);
      setLoginResult(storedLoginStatus);
    }
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    if (!username || !email || !password) {
      setMessage('All fields are required');
      return;
    }
    axios.post('http://localhost:8081/Login', { username, email, password })
      .then((res) => {
        const result = res.data;
        setLoginResult(result);
        if (result === 'Login Successfully') {
          localStorage.setItem('username', username);
          localStorage.setItem('loginStatus', result);
          navigate('/');
          setMessage(''); // Clear error message on successful login
        } 
        else {
          setMessage('Please register yourself');
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className='row vh-100 justify-content-center align-items-center bg-info'>
      <div className='col-lg-4 col-md-6 col-sm-8 col-xs-10'>
          <div className='card bg-info-subtle'>
            <div className='card-body'>
        {loginResult === 'Login Successfully' ? (
          <div>
            <h1>You are already Login.</h1>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label htmlFor='username'>User Name</label>
              <input
                type='text'
                placeholder='Enter User Name'
                className='form-control'
                onChange={handleUsernameChange}
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                placeholder='Enter Email'
                className='form-control'
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                placeholder='Enter Password'
                className='form-control'
                onChange={handlePasswordChange}
              />
            </div>
            {message && (
              <div className='text-danger'>{message}</div>
            )}
            <button className='btn btn-success btn-block'>Login</button>
            {message === 'Please register yourself' && (
              <p className='text-primary' onClick={() => navigate('/register')}>
                Click for registration
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  </div>
  </div>
  );
}