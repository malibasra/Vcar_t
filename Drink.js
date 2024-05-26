import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Comm/Navbar';

export default function Drink() {
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState({});
  const navigate = useNavigate();

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
        ProductPrice: product.ProductPrice,
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

  return (
    <div>
      <Navbar />
      <div className="fst-italic text-center bg-primary-subtle vh-150">
        <h1 style={{ fontSize: '100px' }}>Drinks</h1>
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 justify-content-center">
            {products.filter(product => product.ProductCategoryFID === 8 && product.ProductSize > 0).length > 0 ? (
              products.filter(product => product.ProductCategoryFID === 8 && product.ProductSize > 0).map((product, index) => (
                <div key={product.ProductID} className="col">
                  <div className="card h-100">
                    <div className="d-flex align-items-center justify-content-center" style={{ height: '150px' }}>
                      <img
                        src={`http://localhost:8081/product/${product.ProductPic}`}
                        className="card-img-top"
                        alt={product.Id}
                        style={{ objectFit: 'contain', maxHeight: '100%', maxWidth: '100%' }}
                      />
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title" style={{ fontSize: '14px' }}>{product.ProductName}</h5>
                      <p className="card-title" style={{ fontSize: '10px' }}>{product.ProductPrice}</p>
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
                        >Add to Cart</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-md-12 text-center">
                <h5>No products available in this category</h5>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
