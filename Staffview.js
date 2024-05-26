import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Staffnavbar from './Staffnavbar'; // Assuming you have a StaffNavbar component

const Staffview = () => {
  const navigate = useNavigate();
  const [orderdata, setOrderData] = useState([]);
  const staffname = localStorage.getItem('staff');

  // Fetch order status data
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderData = {
          StaffName: staffname
        };
        const response = await axios.post('http://localhost:8081/order/details', orderData);
        if (Array.isArray(response.data)) {
          setOrderData(response.data);
        } else {
          console.log('Error: order data is not an array');
        }
      } catch (error) {
        console.log('Error fetching order details: ', error);
      }
    };

    fetchOrderDetails();
  }, [staffname]);

  // Update order status to "Delivered"
  const handleDelivery = async (orderId, productName, userName) => {
    try {
      const response = await axios.post('http://localhost:8081/deliver/order', {
        OrderId: orderId,
        ProductName: productName,
        UserName: userName,
        StaffName: staffname
      });
      console.log('Delivery status updated successfully:', response.data);
      
      // Update orderdata state to reflect the delivery status change
      setOrderData(prevData =>
        prevData.map(item =>
          item.OrderFID === orderId &&
          item.ProductName === productName &&
          item.UserName === userName
            ? { ...item, Status: 'Delivered' }
            : item
        )
      );
    } catch (error) {
      console.log('Error updating delivery status:', error);
    }
  };

  // Check if staff is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loginStatus') === 'Staff Successfully';

    // If staff is not logged in, redirect to staff login page
    if (!isLoggedIn) {
      navigate('/stafflogin');
    }
  }, [navigate]);

  // Render the staff dashboard content
  return (
    <div>
      <Staffnavbar />
      <div className='container'>
        <h1 className='text-center'>Welcome to {staffname}!</h1>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Order Number</th>
                <th scope="col">Product Name</th>
                <th scope="col">Customer Name</th>
                <th scope='col'>Customer Address</th>
                <th scope='col'>Customer Cell</th>
                <th scope="col">Product Quantity</th>
                <th scope="col">Total Price</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {orderdata.map((order, index) => (
                <tr key={index}>
                  <th scope="row">{order.OrderFID}</th>
                  <td>{order.ProductName}</td>
                  <td>{order.UserName}</td>
                  <td>{order.UserAddress}</td>
                  <td>0{order.UserCell}</td>
                  <td>{order.ProductQuantity}</td>
                  <td>{order.Total}</td>
                  <td>{order.Status}</td>
                  <td>
                    <button 
                      className='btn btn-dark' 
                      onClick={() => handleDelivery(order.OrderFID, order.ProductName, order.UserName)}
                      disabled={order.Status === 'Delivered'}
                    >
                      Delivered
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Staffview;
