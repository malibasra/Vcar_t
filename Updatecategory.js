import React, { useState }  from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Adminnavbar from './Adminnavbar';

export default function Updatecategory() {
  const [categoryName, setcategoryname] = useState('');
  const [categoryPic, setcategorypic] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const id = localStorage.getItem('categoryId');


  // Insert data in staff table
  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Validate input fields
    if (!categoryName || !categoryPic) {
      setMessage('All fields are required');
      return;
    }

    try {
      const formdata = new FormData();
      formdata.append('categoryId',id);
      formdata.append('categoryName', categoryName);
      formdata.append('categoryPic', categoryPic);
      
      const response = await axios.post('http://localhost:8081/category/update', formdata);

      console.log(response.data);

      setMessage('Category update successfully');
      setSuccess(true);
      localStorage.removeItem('categoryId');
      navigate('/Categorymanagement');
      
    } catch (error) {
      console.error('Error updating up data: ' + error.message);
      setMessage('Error updating data');
    }
  };
  return (
    <div>
      <Adminnavbar/>
      <div className='container'>
        <h1 className='text-center'>Update Category </h1>
        {message && <div className={`alert ${success ? 'alert-success' : 'alert-danger'}`} role="alert">{message}</div>}
        <form className="row g-3" onSubmit={handleUpdate}>
          <div className='mb-3'>
            <label htmlFor='staffname'>New Category Name</label>
            <input type='text' placeholder='Enter Category Name' className='form-control'
              value={categoryName} onChange={e => setcategoryname(e.target.value)} />
          </div>
          <div className="col-md-5">
            <label htmlFor="categorypic" className="form-label">Category Image</label>
            <input type='file' name='pic' placeholder='Select Picture' className='form-control' 
              onChange={e => setcategorypic(e.target.files[0])} />
          </div>
          <div className="col-12 text-center">
            <button type="submit" className='btn btn-dark'>Update Category</button>
          </div>
        </form>
      </div>
    </div>
  )
}

