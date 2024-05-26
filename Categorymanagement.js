import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Adminnavbar from './Adminnavbar';
import { useNavigate } from 'react-router-dom';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

export default function Categorymanagement() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryPic, setCategoryPic] = useState(null);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  // View the categories
  useEffect(() => {
    axios.get('http://localhost:8081/category')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.log('Error: Category data is not an array');
        }
      })
      .catch((error) => {
        console.log('Error fetching categories: ', error);
      });
  }, []);

  // Insert data in category table
  const handleInsert = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Validate input fields
    if (!categoryName || !categoryPic) {
      setMessage('All fields are required');
      return;
    }

    try {
      const formdata = new FormData();
      formdata.append('categoryName', categoryName);
      formdata.append('categoryPic', categoryPic);
      
      const response = await axios.post('http://localhost:8081/category/insert', formdata);

      console.log(response.data);

      setMessage('Category inserted successfully');
      setSuccess(true);

      // Reset form fields
      setCategoryName('');
      setCategoryPic(null);

      // Refresh the category list
      const updatedCategories = await axios.get('http://localhost:8081/category');
      setCategories(updatedCategories.data);
      
    } catch (error) {
      console.error('Error inserting data: ' + error.message);
      setMessage('Error inserting data');
    }
  };

  const handleUpdate = async (id) => {
    localStorage.setItem('categoryId', id);
    navigate(`/Updatecategory`);
  };

  const handleDelete = async (id) => {
    const deleteCategory = {
      CategoryID: id,
    };
    await axios.delete(`http://localhost:8081/category/remove`, { data: deleteCategory });
    setCategories(categories.filter(category => category.Id !== id));
  };

  return (
    <>
      <Adminnavbar />
      <div className="container mt-4">
        <div className="row">
          <h1 className='text-center'>Categories</h1>
          {categories.map((category) => (
            <div key={category.Id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div className="card h-100">
                <img 
                  src={`http://localhost:8081/category/${category.CategoryPic}`} 
                  className="card-img-top" 
                  alt={category.CategoryName} 
                  style={{ objectFit: 'cover', height: '200px', width: '100%' }} 
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{category.CategoryName}</h5>
                  <div className="mt-auto d-flex justify-content-between">
                    <button 
                      onClick={() => handleUpdate(category.Id)} 
                      className="btn btn-light"
                    >
                      <FaPencilAlt/>
                    </button>
                    <button 
                      onClick={() => handleDelete(category.Id)} 
                      className="btn btn-light"
                    >
                      <FaTrash/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='container'>
        <h1 className='text-center'>Insert Category</h1>
        {message && <div className={`alert ${success ? 'alert-success' : 'alert-danger'}`} role="alert">{message}</div>}
        <form className="row g-3" onSubmit={handleInsert}>
          <div className='mb-3'>
            <label htmlFor='categoryName'>Category Name</label>
            <input type='text' placeholder='Enter Category Name' className='form-control'
              value={categoryName} onChange={e => setCategoryName(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label htmlFor="categoryPic" className="form-label">Category Image</label>
            <input type='file' name='image' placeholder='Select Image' className='form-control' 
              onChange={e => setCategoryPic(e.target.files[0])} />
          </div>
          <div className="col-12 text-center">
            <button type="submit" className='btn btn-dark'>Insert Category</button>
          </div>
        </form>
      </div>
    </>
  );
}

