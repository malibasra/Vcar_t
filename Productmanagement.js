import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Adminnavbar from './Adminnavbar';
import { useNavigate } from 'react-router-dom';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

export default function Productmanagement() {
  const [products, setProducts] = useState([]);
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

  // View the product
  useEffect(() => {
    axios.get('http://localhost:8081/product')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.log('Error: Product data is not an array');
        }
      })
      .catch((error) => {
        console.log('Error fetching products: ', error);
      });
  }, []);

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
  const handleInsert = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Validate input fields
    if (!productname || !productcost || !productprice || !productdescription || !productimage || !productcategory || !productsize) {
      setMessage('All fields are required');
      return;
    }

    try {
      const formdata = new FormData();
      formdata.append('productname', productname);
      formdata.append('productcost', productcost);
      formdata.append('productprice', productprice);
      formdata.append('productimage', productimage);
      formdata.append('productsize', productsize);
      formdata.append('productdescription', productdescription);
      formdata.append('productcategory', productcategory);
      
      const response = await axios.post('http://localhost:8081/product/insert', formdata);

      console.log(response.data);

      setMessage('Product inserted successfully');
      setSuccess(true);

      // Reset form fields
      setProductname('');
      setProductcost('');
      setProductprice('');
      setProductdescription('');
      setProductimage(null);
      setProductcategory('');
      setProductsize('');

      // Refresh the product list
      const updatedProducts = await axios.get('http://localhost:8081/product');
      setProducts(updatedProducts.data);
      
    } catch (error) {
      console.error('Error inserting data: ' + error.message);
      setMessage('Error inserting data');
    }
  };

  const handleUpdate = async (id) => {
    localStorage.setItem('productid',id);
    navigate(`/Updateproductadmin`)
    //navigate(`/updateproduct`);
  };

  const handleDelete = async (id) => {
    const deleteProduct = {
      ProductID: id,
    };
    await axios.delete(`http://localhost:8081/product/remove`, { data: deleteProduct });
    setProducts(products.filter(product => product.Id !== id));
  };

  return (
    <>
      <Adminnavbar />
      <div className="container mt-4">
        <div className="row">
          <h1 className='text-center'>Products</h1>
          {products.map((product) => (
            <div key={product.Id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div className="card h-100">
                <img 
                  src={`http://localhost:8081/product/${product.ProductPic}`} 
                  className="card-img-top" 
                  alt={product.ProductName} 
                  style={{ objectFit: 'cover', height: '200px', width: '100%' }} 
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.ProductName}</h5>
                  <p className="card-text">{product.ProductDescription}</p>
                  <div className="mt-auto d-flex justify-content-between">
                    <button 
                      onClick={() => handleUpdate(product.Id)} 
                      className="btn btn-light"
                    >
                      <FaPencilAlt/>
                    </button>
                    <button 
                      onClick={() => handleDelete(product.Id)} 
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
        <h1 className='text-center'>Insert Product</h1>
        {message && <div className={`alert ${success ? 'alert-success' : 'alert-danger'}`} role="alert">{message}</div>}
        <form className="row g-3" onSubmit={handleInsert}>
          <div className='mb-3'>
            <label htmlFor='productname'>Product Name</label>
            <input type='text' placeholder='Enter Product Name' className='form-control'
              value={productname} onChange={e => setProductname(e.target.value)} />
          </div>
          <div className='col-md-6'>
            <label htmlFor='productcost'>Product Cost</label>
            <input type='number' placeholder='Enter Cost' className='form-control'
              value={productcost} onChange={e => setProductcost(e.target.value)} />
          </div>
          <div className='col-md-6'>
            <label htmlFor='productprice'>Product Price</label>
            <input type='number' placeholder='Enter Price' className='form-control'
              value={productprice} onChange={e => setProductprice(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label htmlFor="productimage" className="form-label">Product Image</label>
            <input type='file' name='image' placeholder='Select Image' className='form-control' 
              onChange={e => setProductimage(e.target.files[0])} />
          </div>
          <div className="col-md-6">
            <label htmlFor="productsize" className="form-label">Inventory Size</label>
            <input type="number" className="form-control"
              value={productsize} onChange={e => setProductsize(e.target.value)} />
          </div>
          <div className="col-md-8">
            <label htmlFor="productdescription" className="form-label">Product Description</label>
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
            <button type="submit" className='btn btn-dark'>Add</button>
          </div>
        </form>
      </div>
    </>
  );
}
