import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [username, setusername] = useState('');
  const [contact, setcontact] = useState('03');
  const [address, setaddress] = useState('');
  const [age, setage] = useState('');
  const [image,setimage]=useState();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    if (!/^[A-Za-z_]+$/.test(e.target.value)) {
      setMessage('Invalid username');
    } else {
      setMessage('');
    }
    setusername(e.target.value);
  };

  const handleContactChange = (e) => {
    if (!/^[0-9]+$/.test(e.target.value)) {
      setMessage('Contact number must be numeric');
    } else if (e.target.value.length > 11) {
      setMessage('Contact number must be 11 digits');
    } else {
      setMessage('');
    }
    setcontact(e.target.value);
  };
  const handleAgeChange = (e) => {
    const age = parseInt(e.target.value);

    if (isNaN(age)) {
        // Not a number
        setMessage('Age must be a number');
    } else if (age < 0 || age > 120) {
        // Out of range
        setMessage('Age must be between 0 and 120');
    } else {
        setMessage('');
    }

    setage(age);
};

  const handlePasswordChange = (e) => {
    if (e.target.value.length < 8) {
      setMessage('Password must be at least 8 characters');
    } else {
      setMessage('');
    }
    setpassword(e.target.value);
  };

  const handleInsert = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Validation
    if (!username || !email || !contact || !address || !age || !image || !password) {
      setMessage('All fields are required');
      return;
    }

    try {
      const formdata=new FormData();
        formdata.append('username',username);
        formdata.append('email', email);
        formdata.append('contact', contact);
        formdata.append('address',address)
        formdata.append('age', age);
        formdata.append('image',image);
        formdata.append('password', password);
        const response = await axios.post('http://localhost:8081/register', formdata);

        console.log(response.data);
      
      setMessage('Data inserted successfully');
      navigate("/"); // Navigate to the main page on successful registration
    } catch (error) {
      console.error('Error inserting data: ' + error.message);
      setMessage('Error inserting data');
    }
  };


  return (
    <div className='d-flex row vh-150 justify-content-center align-items-center bg-info'>
      <div className='col-lg-4 col-md-6 col-sm-8 col-xs-10'>
          <div className='card bg-info-subtle'>
            <div className='card-body'>
        {message === 'Data inserted successfully' ? (
          <div>
            {/* Render additional content for successful login */}
          </div>
        ) : (
          <form onSubmit={handleInsert}>
            <div className='mb-3'>
              <label htmlFor='username'>User Name</label>
              <input type='text' placeholder='Enter User Name' className='form-control'
                onChange={handleUsernameChange} />
            </div>
            <div className='mb-3'>
              <label htmlFor='email'>Email</label>
              <input type='email' placeholder='Enter Email' className='form-control'
                onChange={e => setemail(e.target.value)} />
            </div>
            <div className='mb-3'>
              <label htmlFor='contact'>Contact</label>
              <input type='contact' className='form-control'
                value={contact} onChange={handleContactChange} />
            </div>
            <div className='mb-3'>
              <label htmlFor='address'>Address</label>
              <input type='text' placeholder='Enter Address' className='form-control'
                onChange={e => setaddress(e.target.value)} />
            </div>
            <div className='mb-3'>
            <label htmlFor='age'>Age</label>
            <input type='number' placeholder='Enter Your Age' className='form-control' value={age}
               onChange={handleAgeChange} />
            </div>
            <div className='mb-3 pb-5'>
                <label htmlFor='img'>Image</label>
                <input type='file' name='image' placeholder='Select Image' className='form-control' onChange={e => 
                    setimage(e.target.files[0])} />
            </div>
            <div className='mb-3'>
              <label htmlFor='password'>Password</label>
              <input type='password' placeholder='Enter Password' className='form-control'
                onChange={handlePasswordChange} />
            </div>
            <button className='btn btn-success'>Register</button>
          </form>
        )}
        {message && (
          <div className='alert alert-danger' role='alert'>
            {message}
          </div>
        )}
      </div>
    </div>
    </div>
    </div>
  );
}