import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {loadStripe} from '@stripe/stripe-js';
import Navbar from '../Comm/Navbar';
import './Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const [useraddress,setuseraddress] = useState('');
  const [usercell, setusercell] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [details, setDetails] = useState([]); // Array to store displayed cart details
  const [orderStatus, setOrderStatus] = useState([]);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const staffid = Math.floor(Math.random() * 8) + 5;

  const selectedCategory = localStorage.getItem('selectedCategory');
  const username = localStorage.getItem('username');
  //get user address
  useEffect(() => {
    if (username) {
      axios.get('http://localhost:8081/useraddress', { params: { username } })
        .then((response) => {
          setuseraddress(response.data.address);
          setusercell(response.data.cell);
        })
        .catch((error) => {
          console.log('Error fetching address: ', error);
        });
    }
  }, [username]);

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
        setError(error.message);
      });
  }, []);

  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const productID = localStorage.getItem('productID');
        const username = localStorage.getItem('username');
        const buy = 1;
        const productData = {
          ProductID: productID,
          UserName: username,
          Buy: buy,
        };
        const response = await axios.post('http://localhost:8081/cart/details', productData);
        if (Array.isArray(response.data)) {
          setCartItems(response.data);
        } else {
          console.log('Error: Cart data is not an array');
          return;
        }
      } catch (error) {
        console.log('Error fetching cart details: ', error);
        setError(error.message);
      }
    };

    fetchCartDetails();
  }, []);

useEffect(() => {
    // Extract displayed cart details and store in the details array
    const username = localStorage.getItem('username');
    const orstatus = "Not Delivered";
    const displayedDetails = cartItems
      .filter(item => item.Buy === 1)
      .map(item => {
        const product = products.find(p => p.Id === item.ProductFID);
        if (!product) return null;
        return {
          cardid: item.OrderId,
          username: username,
          productId: product.Id,
          productName: product.ProductName,
          productPic: product.ProductPic,
          productDescription: product.ProductDescription,
          productSize: product.ProductSize,
          productPrice: item.TotalAmount,
          productQuantity: item.ProductQuantity,
          subtotal: item.TotalAmount * item.ProductQuantity
        };
      })
      .filter(detail => detail !== null);

    setDetails(displayedDetails);

    // Extract required fields for orderStatus and assign a random staffId
    const orderStatusArray = displayedDetails.map(detail => ({
      username: detail.username,
      productName: detail.productName,
      productQuantity: detail.productQuantity,
      orderId: detail.cardid,
      subtotal: detail.subtotal,
      useraddress:useraddress,
      usercell:usercell,
      status:orstatus,
      staffId:staffid  // Random staffId between 1 and 5
    }));

    setOrderStatus(orderStatusArray);
  }, [cartItems, products]);

  const handleContinueShopping = () => {
    if (selectedCategory) {
      navigate(`/${selectedCategory}`);
    } else {
      navigate('/');
    }
  };
//payment integration
const handleBuyNow = async () => {
  try {
    // Initialize Stripe
    const stripe = await loadStripe("pk_test_51PJy6jBCK7se0GTnCFo58crSuLoVZhbhyMmDn4cpRF64b9eYoZHtl0nxJOjzTXAwaJ0urc3CFeRcyUc9BvkfC6tC00Ahh1Wwu7");

    // Update the Buy columns in the database based on login username
    const username = localStorage.getItem('username');
    const buy = 0;
    const updateData = {
      UserName: username,
      Buy: buy,
    };
    await axios.post("http://localhost:8081/update/buy", updateData);

    // Insert data to the order status table in the backend
    await axios.post("http://localhost:8081/insert/orderstatus", {orderStatus:orderStatus});

    // Create checkout session
    const body = {
      products: details
    };
    const headers = {
      "Content-Type": "application/json"
    };
    const response = await axios.post("http://localhost:8081/api/create-checkout-session", body, { headers });

    const session = response.data;

    // Redirect to checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    });

    if (result.error) {
      console.log(result.error);
    }
  } catch (error) {
    console.error('Error during handleBuyNow:', error);
  }
  // Uncomment the following line if you want to navigate to the checkout page after handling the payment
  // navigate('/checkout');
};


  const handleRemoveFromCart = async (productId, Quantity, Productsize) => {
    try {
      const username = localStorage.getItem('username');
      const buy = 1;
      const size1 = Productsize + Quantity;
      const productData = {
        ProductID: productId,
        UserName: username,
        Buy: buy,
      };
      const updatedata = {
        ProductID: productId,
        ProductSize: size1,
      };

      await axios.delete(`http://localhost:8081/cart/remove`, { data: productData });

      const updatedCartItems = cartItems.filter(item => item.ProductFID !== productId);
      setCartItems(updatedCartItems);

      await axios.post(`http://localhost:8081/product/updateSize`, updatedata);

      if (updatedCartItems.length === 0) {
        navigate(`/${selectedCategory}`);
      }

    } catch (error) {
      console.log('Error removing item from cart: ', error);
      setError(error.message);
    }
  };

  // Calculate the total amount
  const totalAmount = details.reduce((total, item) => total + item.subtotal, 0);

  return (
    <>
      <div>
        <Navbar />
        <div className="container mt-5">
          <h2>Cart</h2>
          {details.length > 0 ? (
            <div className="cart-container">
              {details.map((detail, index) => (
                <div key={index} className="cart-item row">
                  <div className="col-md-3 product-info">
                    <img className="product-image" src={`http://localhost:8081/product/${detail.productPic}`} alt="Product" />
                    <div>
                      <h5>{detail.productName}</h5>
                      <p>{detail.productDescription}</p>
                      <button className="btn btn-dark" onClick={() => handleRemoveFromCart(detail.productId, detail.productQuantity, detail.productSize)}>Remove</button>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <p>Price: ${detail.productPrice}</p>
                  </div>
                  <div className="col-md-3">
                    <p>Quantity: {detail.productQuantity}</p>
                  </div>
                  <div className="col-md-3">
                    <p>Subtotal: ${detail.subtotal}</p>
                  </div>
                </div>
              ))}
              <div className="total-amount">
                <h3>Total Amount: ${totalAmount}</h3>
              </div>
              <div className="buttons">
                <button className="btn btn-secondary" onClick={handleContinueShopping}>Continue Shopping</button>
                <button className="btn btn-primary" onClick={handleBuyNow}>Buy Now</button>
              </div>
            </div>
          ) : (
            <p>Your cart is empty.</p>
          )}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </div>
    </>
  );
}
