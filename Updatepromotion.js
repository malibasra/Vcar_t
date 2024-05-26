import React, { useState, useEffect }  from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Adminnavbar from './Adminnavbar';

export default function Updatepromotion() {
  const [promotionprice,setpromotionprice] = useState('');
  const [promotionend,setpromotionend] = useState('');
  const [productpromotion, setproductpromotion] = useState('');
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const id = localStorage.getItem('promotionid');

  // Fetch categories
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

  // Insert data in product table
  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Validate input fields
    if (!promotionprice || !productpromotion || !promotionend ) {
      setMessage('All fields are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/promotion/update',{promotionprice,productpromotion,promotionend,id});

      console.log(response.data);

      setMessage('Promotion update successfully');
      setSuccess(true);
      localStorage.removeItem('promotionid');
      navigate('/Promotionmanagement');
      
    } catch (error) {
      console.error('Error updating up data: ' + error.message);
      setMessage('Error updating data');
    }
  };
  return (
    <div>
      <Adminnavbar/>
      <div className='container'>
    <h1 className='text-center'>Update Discount Product</h1>
    {message && <div className={`alert ${success ? 'alert-success' : 'alert-danger'}`} role="alert">{message}</div>}
    <form className="row g-3" onSubmit={handleUpdate}>
      <div className='col-md-10'>
        <label htmlFor='promotionprice'>Price</label>
        <input type='number' placeholder='Enter Price' className='form-control'
          value={promotionprice} onChange={e => setpromotionprice(e.target.value)} />
      </div>
      <div className='col-md-6'>
        <label htmlFor='promotionend'>Discount End</label>
        <input type='number' placeholder='Discount End' className='form-control'
          value={promotionend} onChange={e => setpromotionend(e.target.value)} />
      </div>
      <div className="col-md-4">
        <label htmlFor="productpromotion" className="form-label">Product</label>
        <select id="productpromotion" className="form-select"
          value={productpromotion} onChange={e => setproductpromotion(e.target.value)}>
          <option value="">Select...</option>
          {products.map((product) => (
            <option key={product.Id} value={product.Id}>{product.ProductName}</option>
          ))}
        </select>
      </div>
      <div className="col-12 text-center">
        <button type="submit" className='btn btn-dark'> Update </button>
      </div>
    </form>
  </div>
  </div>
  )
}

