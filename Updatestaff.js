import React, { useState }  from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Adminnavbar from './Adminnavbar';

export default function Updatestaff() {
  const [staffName, setstaffname] = useState('');
  const [staffEmail, setstaffemail] = useState('');
  const [staffCell, setstaffcell] = useState('');
  const [staffPassword, setstaffpassword] = useState('');
  const [staffAddress, setstaffaddress] = useState(null);
  const [staffPic, setstaffpic] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const id = localStorage.getItem('staffId');


  // Insert data in staff table
  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Validate input fields
    if (!staffName || !staffEmail || !staffCell || !staffPassword || !staffAddress || !staffPic) {
      setMessage('All fields are required');
      return;
    }

    try {
      const formdata = new FormData();
      formdata.append('staffId',id);
      formdata.append('staffName', staffName);
      formdata.append('staffEmail', staffEmail);
      formdata.append('staffCell', staffCell);
      formdata.append('staffPassword', staffPassword);
      formdata.append('staffAddress', staffAddress);
      formdata.append('staffPic', staffPic);
      
      const response = await axios.post('http://localhost:8081/staff/update', formdata);

      console.log(response.data);

      setMessage('Staff update successfully');
      setSuccess(true);
      localStorage.removeItem('staffId');
      navigate('/Staffmanagement');
      
    } catch (error) {
      console.error('Error updating up data: ' + error.message);
      setMessage('Error updating data');
    }
  };
  return (
    <div>
      <Adminnavbar/>
      <div className='container'>
        <h1 className='text-center'>Update Staff </h1>
        {message && <div className={`alert ${success ? 'alert-success' : 'alert-danger'}`} role="alert">{message}</div>}
        <form className="row g-3" onSubmit={handleUpdate}>
          <div className='mb-3'>
            <label htmlFor='staffname'>New Staff Name</label>
            <input type='text' placeholder='Enter Staff Name' className='form-control'
              value={staffName} onChange={e => setstaffname(e.target.value)} />
          </div>
          <div className='col-md-6'>
            <label htmlFor='staffemail'>New Staff Email</label>
            <input type='email' placeholder='Enter Email' className='form-control'
              value={staffEmail} onChange={e => setstaffemail(e.target.value)} />
          </div>
          <div className='col-md-6'>
            <label htmlFor='staffcell'>Staff Contact Number</label>
            <input type='number' placeholder='Enter Number' className='form-control'
              value={staffCell} onChange={e => setstaffcell(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label htmlFor="staffpassword" className="form-label">Staff Password</label>
            <input type="password" className="form-control"
              value={staffPassword} onChange={e => setstaffpassword(e.target.value)} />
          </div>
          <div className="col-md-5">
            <label htmlFor="staffpic" className="form-label">Staff Picture</label>
            <input type='file' name='pic' placeholder='Select Picture' className='form-control' 
              onChange={e => setstaffpic(e.target.files[0])} />
          </div>
          <div className="col-md-8">
            <label htmlFor="staffaddress" className="form-label">Staff Address</label>
            <textarea className="form-control" rows="2"
              value={staffAddress} onChange={e => setstaffaddress(e.target.value)}></textarea>
          </div>
          <div className="col-12 text-center">
            <button type="submit" className='btn btn-dark'>Update</button>
          </div>
        </form>
      </div>
    </div>
  )
}

