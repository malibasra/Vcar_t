import React, { useState, useEffect }  from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Adminnavbar from './Adminnavbar';

export default function Updateproductadmin() {
  const [productname, setProductname] = useState('');
  const [productcost, setProductcost] = useState('');
  const [productprice, setProductprice] = useState('');
  const [productdescription, setProductdescription] = useState('');
  const [productimage, setProductimage] = useState(null);
  const [productcategory, setProductcategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [productsize, setProductsize] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const id = localStorage.getItem('productid');

  // Fetch categories
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

  // Insert data in product table
  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Validate input fields
    if (!productname || !productcost || !productprice || !productdescription || !productimage || !productcategory || !productsize) {
      setMessage('All fields are required');
      return;
    }

    try {
      const formdata = new FormData();
      formdata.append('productId',id);
      formdata.append('productname', productname);
      formdata.append('productcost', productcost);
      formdata.append('productprice', productprice);
      formdata.append('productimage', productimage);
      formdata.append('productsize', productsize);
      formdata.append('productdescription', productdescription);
      formdata.append('productcategory', productcategory);
      
      const response = await axios.post('http://localhost:8081/product/update', formdata);

      console.log(response.data);

      setMessage('Product update successfully');
      setSuccess(true);
      localStorage.removeItem('productid');
      navigate('/Productmanagement');
      
    } catch (error) {
      console.error('Error updating up data: ' + error.message);
      setMessage('Error updating data');
    }
  };
  return (
    <div>
      <Adminnavbar/>
      <div className='container'>
        <h1 className='text-center'>Update Product</h1>
        {message && <div className={`alert ${success ? 'alert-success' : 'alert-danger'}`} role="alert">{message}</div>}
        <form className="row g-3" onSubmit={handleUpdate}>
          <div className='mb-3'>
            <label htmlFor='productname'>New Product Name</label>
            <input type='text' placeholder='Enter Product Name' className='form-control'
              value={productname} onChange={e => setProductname(e.target.value)} />
          </div>
          <div className='col-md-6'>
            <label htmlFor='productcost'>New Product Cost</label>
            <input type='number' placeholder='Enter Cost' className='form-control'
              value={productcost} onChange={e => setProductcost(e.target.value)} />
          </div>
          <div className='col-md-6'>
            <label htmlFor='productprice'>New Product Price</label>
            <input type='number' placeholder='Enter Price' className='form-control'
              value={productprice} onChange={e => setProductprice(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label htmlFor="productimage" className="form-label">New Product Image</label>
            <input type='file' name='image' placeholder='Select Image' className='form-control' 
              onChange={e => setProductimage(e.target.files[0])} />
          </div>
          <div className="col-md-6">
            <label htmlFor="productsize" className="form-label">Update Inventory</label>
            <input type="number" className="form-control"
              value={productsize} onChange={e => setProductsize(e.target.value)} />
          </div>
          <div className="col-md-8">
            <label htmlFor="productdescription" className="form-label">New Product Description</label>
            <textarea className="form-control" rows="3"
              value={productdescription} onChange={e => setProductdescription(e.target.value)}></textarea>
          </div>
          <div className="col-md-4">
            <label htmlFor="productcategory" className="form-label">Category</label>
            <select id="productcategory" className="form-select"
              value={productcategory} onChange={e => setProductcategory(e.target.value)}>
              <option value="">Select...</option>
              {categories.map((category) => (
                <option key={category.Id} value={category.Id}>{category.CategoryName}</option>
              ))}
            </select>
          </div>
          <div className="col-12 text-center">
            <button type="submit" className='btn btn-dark'>Update</button>
          </div>
        </form>
      </div>
      <p>{id}</p>
    </div>
  )
}

