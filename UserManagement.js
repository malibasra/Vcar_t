import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Adminnavbar from './Adminnavbar';
import './UserManagement.css'; // Import CSS file for styling

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [orderDetail, setOrderDetail] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch users
    axios.get('http://localhost:8081/user')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.log('Error: User data is not an array');
        }
      })
      .catch((error) => {
        console.log('Error fetching users: ', error);
      });
      
    // Fetch products
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

  // Function to fetch order details for a specific user
  const getOrderDetail = async (userId) => {
    try {
      const UserData = {
        userId: userId,
      };
      // Call your backend API to fetch order details for the specific user
      const response = await axios.post('http://localhost:8081/vieworderdetail', UserData);
      setOrderDetail(response.data);
    } catch (error) {
      console.error('Error fetching order details: ', error);
    }
  };

  return (
    <>
      <Adminnavbar />
      <div className='container'>
        <h1 className='text-center'>User Management</h1>
        {users.filter(user => user.Id !== 1).map((user, index) => ( // Filter out the user with userId equal to 1
          <div key={index} className="user-container">
            <button
              className="btn btn-light user-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#userCollapse${index}`}
              aria-expanded="false"
              aria-controls={`userCollapse${index}`}
              onClick={() => getOrderDetail(user.Id)} // Pass userId to getOrderDetail function
            >
              <div className="user-info">
                <div className="user-left">
                  <img className="user-image" src={`http://localhost:8081/users/${user.UserPic}`} alt={user.Id} />
                  <p className="user-name">{user.UserName}</p>
                </div>
                <div className="user-right">
                  <p className="user-contact">Contact: 0{user.UserCell}</p>
                  <p className="user-email">Email: {user.UserEmail}</p>
                  <p className="user-address">Address: {user.UserAddress}</p>
                </div>
              </div>
            </button>
            <div className="collapse" id={`userCollapse${index}`}>
              <div className="card card-body">
                {/* Render order detail data here */}
                {orderDetail && (
                  <>
                    <h5>Order Details</h5>
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">OrderNo.</th>
                          <th scope="col">Product</th>
                          <th scope='col'>Quantity</th>
                          <th scope="col">Amount</th>
                          <th scope="col">Order Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderDetail
                          .filter(order => order.UserFID === user.Id) // Filter order details for the current user
                          .map((order, idx) => {
                            const product = products.find(product => product.Id === order.ProductFID);
                            return (
                              <tr key={idx}>
                                <th scope="row">{order.OrderId}</th>
                                <td>
                                  {product && (
                                    <div className="product-info">
                                      <img className="product-image" src={`http://localhost:8081/product/${product.ProductPic}`} alt={product.ProductName} />
                                      <p className="product-name">{product.ProductName}</p>
                                    </div>
                                  )}
                                </td>
                                <td>{order.ProductQuantity}</td>
                                <td>{order.TotalAmount * order.ProductQuantity}</td>
                                <td>{order.OrderDate}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
