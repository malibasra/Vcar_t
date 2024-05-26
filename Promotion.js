import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Promotion() {
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [mergedData, setMergedData] = useState([]);
  const [quantity, setQuantity] = useState({});
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

  const handleQuantityChange = (index, productID, value) => {
    setQuantity((prevQuantity) => ({
      ...prevQuantity,
      [`${productID}_${index}`]: Math.max((prevQuantity[`${productID}_${index}`] || 1) + value, 1)
    }));
  };

  const handleAddToCart = (index, product) => {
    const UserName = localStorage.getItem('username');
    const loginStatus = localStorage.getItem('loginStatus');
    const productQuantity = quantity[`${product.ProductID}_${index}`] || 1;

    if (loginStatus === 'Login Successfully') {
      const currentDateTime = new Date();
      const buy = 1;
      const size = product.ProductSize - productQuantity;
      const productData = {
        ProductID: product.Id,
        UserName: UserName,
        Quantity: productQuantity,
        OrderDate: currentDateTime,
        ProductPrice: product.promotionPrice,
        Buy: buy,
      };
      const updatedata = {
        ProductID: product.Id,
        ProductSize: size
      };

      axios.post('http://localhost:8081/cart/add', productData)
        .then(() => {
          // Make the additional axios request to update the product size
          axios.post('http://localhost:8081/product/updateSize', updatedata)
            .then(() => {
              // Navigate to cart only after the product size update succeeds
              navigate('/cart');
              localStorage.setItem('productID', product.Id);
            })
            .catch((error) => {
              console.log('Error updating product size: ', error);
            });
        })
        .catch((error) => {
          console.log('Error adding product to cart: ', error);
        });
    } else {
      navigate('/login');
    }
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
            };
          }
        }
        return null; // Return null for products without a matching or valid promotion
      }).filter(product => product !== null); // Filter out null values

      setMergedData(merged);
    }
  }, [products, promotions]);

  return (
    <div className="container">
      <h1 className='text-center'>Discount Offers</h1>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 justify-content-center">
        {mergedData.map((product, index) => (
          <div className="col" key={product.Id}>
            <div className="card h-100 text-center" style={{ margin: '1rem' }}>
              <div className="d-flex align-items-center justify-content-center" style={{ height: '150px' }}>
                <img
                  src={`http://localhost:8081/product/${product.ProductPic}`}
                  className="card-img-top"
                  alt={product.ProductName}
                  style={{ objectFit: 'contain', maxHeight: '100%', maxWidth: '100%' }}
                />
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.ProductName}</h5>
                <p className="card-text">Promotion Price: ${product.promotionPrice}</p>
                <p className="card-text">Promotion Ends: {product.promotionEndDate.toLocaleDateString()}</p>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <button
                    className="btn btn-sm btn-light"
                    onClick={() => handleQuantityChange(index, product.ProductID, -1)}
                    disabled={quantity[`${product.ProductID}_${index}`] === 1}
                  >-</button>
                  <span className="quantity">{quantity[`${product.ProductID}_${index}`] || 1}</span>
                  <button
                    className="btn btn-sm btn-light"
                    onClick={() => handleQuantityChange(index, product.ProductID, 1)}
                  >+</button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleAddToCart(index, product)}
                  >Add to Cart (${product.promotionPrice})</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
