import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Adminnavbar from './Adminnavbar';

export default function Promotionmanagement() {
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [mergedData, setMergedData] = useState([]);
  const [promotionprice,setpromotionprice] = useState('');
  const [promotionend,setpromotionend] = useState('');
  const [productpromotion, setproductpromotion] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Fetch the product data
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

  // Fetch the promotion data
  useEffect(() => {
    axios.get('http://localhost:8081/promotion')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setPromotions(response.data);
        } else {
          console.log('Error: Promotion data is not an array');
        }
      })
      .catch((error) => {
        console.log('Error fetching promotions: ', error);
      });
  }, []);
    // Insert data in product table
    const handleInsert = async (e) => {
        e.preventDefault(); // Prevent the default form submission
    
        // Validate input fields
        if (!promotionprice || !promotionend || !productpromotion) {
          setMessage('All fields are required');
          return;
        }
    
        try {

          
          const response = await axios.post('http://localhost:8081/promotion/insert', 
                            {productpromotion,promotionprice,promotionend});
    
          console.log(response.data.message);
    
          setMessage('Discount Product inserted successfully');
          setSuccess(true);
    
          // Reset form fields
          setpromotionprice('');
          setpromotionend('');
          setproductpromotion('');
    
          // Refresh the product list
          const updatedpromotions = await axios.get('http://localhost:8081/promotion');
          setPromotions(updatedpromotions.data);
          
        } catch (error) {
          console.error('Error inserting data: ' + error.message);
          setMessage('Error inserting data');
        }
      };

  const handleUpdate = async (id) => {
    localStorage.setItem('promotionid',id);
    navigate(`/Updatepromotion`)
  };

  const handleDelete = async (id) => {
    const deleteProduct = {
      PromotionID: id,
    };
    await axios.delete(`http://localhost:8081/promotion/remove`, { data: deleteProduct });
    setPromotions(promotions.filter(promotion => promotion.PromotionId !== id));
  };




  // Merge product and promotion data and filter out expired promotions
  useEffect(() => {
    if (products.length > 0 && promotions.length > 0) {
      const today = new Date();

      const merged = products.map(product => {
        const promotion = promotions.find(promo => promo.ProductFID === product.Id);
        if (promotion) {
          const promotionStartDate = new Date(promotion.PeomotionStart);
          const promotionEndDate = new Date(promotionStartDate);
          promotionEndDate.setDate(promotionEndDate.getDate() + promotion.PromotionEnd);

          // Only include promotions that haven't ended
          if (promotionEndDate >= today) {
            return {
              ...product,
              promotionPrice: promotion.PromotionPrice,
              promotionStartDate: promotionStartDate,
              promotionEndDate: promotionEndDate,
              promotionId: promotion.PromotionId,
            };
          }
        }
        return null; // Return null for products without a matching or valid promotion
      }).filter(product => product !== null); // Filter out null values

      setMergedData(merged);
    }
  }, [products, promotions]);

  return (
    <>
    <Adminnavbar/>
    <div className="container">
      <h1 className='text-center'>Discount Offers</h1>
      <div className="row">
        {mergedData.map((product, index) => (
          <div className="card text-center" style={{ width: '18rem', margin: '1rem' }} key={product.Id}>
            <img src={`http://localhost:8081/product/${product.ProductPic}`} className="card-img-top" alt={product.ProductName} />
            <div className="card-body">
              <h5 className="card-title">{product.ProductName}</h5>
              <p className="card-text">Promotion Price: ${product.promotionPrice}</p>
              <p className='test-center'>{product.PromotionEnd}</p>
              <p className="card-text">Promotion Ends: {product.promotionEndDate.toLocaleDateString()}</p>
              <div className="mt-auto d-flex justify-content-between">
                    <button 
                      onClick={() => handleUpdate(product.promotionId)} 
                      className="btn btn-light"
                    >
                      <FaPencilAlt/>
                    </button>
                    <button 
                      onClick={() => handleDelete(product.promotionId)} 
                      className="btn btn-light"
                    >
                      <FaTrash/>
                    </button>
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
        <button type="submit" className='btn btn-dark'> Insert </button>
      </div>
    </form>
  </div>
  </>
  );
}
