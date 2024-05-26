import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Adminnavbar from './Adminnavbar';

export default function Ordermanagement() {
    const [orderdata, setOrderdata] = useState([]);
    const [staffData, setStaffData] = useState([]);

    useEffect(() => {
        // Fetch order data
        axios.post('http://localhost:8081/orderdata')
          .then((response) => {
            if (Array.isArray(response.data)) {
              setOrderdata(response.data);
              console.log('Fetched Order Data:', response.data);
            } else {
              console.error('Error: order data is not an array');
            }
          })
          .catch((error) => {
            console.error('Error fetching orders: ', error);
          });

        // Fetch staff data
        axios.post('http://localhost:8081/staffname')
          .then((response) => {
            if (Array.isArray(response.data)) {
              setStaffData(response.data);
              console.log('Fetched Staff Data:', response.data);
            } else {
              console.error('Error: staff data is not an array');
            }
          })
          .catch((error) => {
            console.error('Error fetching staffs: ', error);
          });
    }, []);

    return (
        <>
        <Adminnavbar/>
          <div className='container'>
            <h1 className='text-center'>Order Management</h1>
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
                    <th scope='col'>Staff Name</th>
                  </tr>
                </thead>
                <tbody>
                  {orderdata.map((order, index) => {
                    // Find the staff with matching StaffId
                    const matchingStaff = staffData.find(staff => String(staff.StaffId) === String(order.StaffFID));
                    return (
                      <tr key={index}>
                        <th scope="row">{order.OrderFID}</th>
                        <td className="text-center align-middle">{order.ProductName}</td>
                        <td className="text-center align-middle">{order.UserName}</td>
                        <td className="text-center align-middle">{order.UserAddress}</td>
                        <td className="text-center align-middle">0{order.UserCell}</td>
                        <td className="text-center align-middle">{order.ProductQuantity}</td>
                        <td>{order.Total}</td>
                        <td>{order.Status}</td>
                        {/* Display staff name if found, otherwise show '...' */}
                        <td>{matchingStaff ? matchingStaff.StaffName : '...'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
    );
}

