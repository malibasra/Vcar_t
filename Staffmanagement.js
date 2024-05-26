import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Adminnavbar from './Adminnavbar';
import { useNavigate } from 'react-router-dom';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

export default function StaffManagement() {
  const [staffList, setStaffList] = useState([]);
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffCell, setStaffCell] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffAddress, setStaffAddress] = useState('');
  const [staffPic, setStaffPic] = useState(null);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  // View the staff list
  useEffect(() => {
    axios.get('http://localhost:8081/staff')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setStaffList(response.data);
        } else {
          console.log('Error: Staff data is not an array');
        }
      })
      .catch((error) => {
        console.log('Error fetching staff data: ', error);
      });
  }, []);

  // Insert data in staff table
  const handleInsert = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Validate input fields
    if (!staffName || !staffEmail || !staffCell || !staffPassword || !staffAddress || !staffPic) {
      setMessage('All fields are required');
      return;
    }

    try {
      const formdata = new FormData();
      formdata.append('staffName', staffName);
      formdata.append('staffEmail', staffEmail);
      formdata.append('staffCell', staffCell);
      formdata.append('staffPassword', staffPassword);
      formdata.append('staffAddress', staffAddress);
      formdata.append('staffPic', staffPic);

      const response = await axios.post('http://localhost:8081/staff/insert', formdata);

      console.log(response.data);

      setMessage('Staff inserted successfully');
      setSuccess(true);

      // Reset form fields
      setStaffName('');
      setStaffEmail('');
      setStaffCell('');
      setStaffPassword('');
      setStaffAddress('');
      setStaffPic(null);

      // Refresh the staff list
      const updatedStaffList = await axios.get('http://localhost:8081/staff');
      setStaffList(updatedStaffList.data);

    } catch (error) {
      console.error('Error inserting data: ' + error.message);
      setMessage('Error inserting data');
    }
  };

  const handleUpdate = async (id) => {
    localStorage.setItem('staffId', id);
    navigate(`/updatestaff`);
  };

  const handleDelete = async (id) => {
    const deleteStaff = {
      staffId: id,
    };
    await axios.delete(`http://localhost:8081/staff/remove`, { data: deleteStaff });
    setStaffList(staffList.filter(staff => staff.staffId !== id));
  };

  return (
    <>
      <Adminnavbar />
      <div className="container mt-4">
        <div className="row">
          <h1 className='text-center'>Staff Members</h1>
          {staffList.map((staff) => (
            <div key={staff.staffId} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div className="card h-100">
                <img
                  src={`http://localhost:8081/staff/${staff.StaffPic}`}
                  className="card-img-top"
                  alt={staff.staffName}
                  style={{ objectFit: 'cover', height: '200px', width: '100%' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{staff.StaffName}</h5>
                  <p className="card-text">Email: {staff.StaffEmail}</p>
                  <p className="card-text">Cell: 0{staff.StaffCell}</p>
                  <div className="mt-auto d-flex justify-content-between">
                    <button
                      onClick={() => handleUpdate(staff.StaffId)}
                      className="btn btn-light"
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      onClick={() => handleDelete(staff.StaffId)}
                      className="btn btn-light"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='container'>
        <h1 className='text-center'>Add Staff Member</h1>
        {message && <div className={`alert ${success ? 'alert-success' : 'alert-danger'}`} role="alert">{message}</div>}
        <form className="row g-3" onSubmit={handleInsert}>
          <div className='mb-3'>
            <label htmlFor='staffName'>Staff Name</label>
            <input type='text' placeholder='Enter Staff Name' className='form-control'
              value={staffName} onChange={e => setStaffName(e.target.value)} />
          </div>
          <div className='col-md-6'>
            <label htmlFor='staffEmail'>Staff Email</label>
            <input type='email' placeholder='Enter Staff Email' className='form-control'
              value={staffEmail} onChange={e => setStaffEmail(e.target.value)} />
          </div>
          <div className='col-md-6'>
            <label htmlFor='staffCell'>Staff Cell</label>
            <input type='text' placeholder='Enter Staff Cell' className='form-control'
              value={staffCell} onChange={e => setStaffCell(e.target.value)} />
          </div>
          <div className='col-md-6'>
            <label htmlFor='staffPassword'>Staff Password</label>
            <input type='password' placeholder='Enter Staff Password' className='form-control'
              value={staffPassword} onChange={e => setStaffPassword(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label htmlFor="staffPic" className="form-label">Staff Picture</label>
            <input type="file" className="form-control" id="staffPic" onChange={e => setStaffPic(e.target.files[0])} />
          </div>
          <div className='col-md-10'>
            <label htmlFor='staffAddress'>Staff Address</label>
            <input type='text' placeholder='Enter Staff Address' className='form-control'
              value={staffAddress} onChange={e => setStaffAddress(e.target.value)} />
          </div>
          <div className="col-12 text-center">
            <button type="submit" className='btn btn-dark'>Add</button>
          </div>
        </form>
      </div>
    </>
  );
}
