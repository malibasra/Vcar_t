import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Adminnavbar from './Adminnavbar';
import axios from 'axios';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, BarChart, Bar } from 'recharts';
import './AdminDashboard.css'; // Import CSS file

const AdminDashboard = () => {
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem('loginStatus') === 'Admin Successfully';

    // If admin is not logged in, redirect to admin login page
    if (!isLoggedIn) {
      navigate('/adminlogin');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8081/chartdata');
        const data = response.data;

        // Process data to aggregate by date with revenue calculation
        const aggregatedData = data.reduce((acc, { OrderDate, TotalAmount, ProductQuantity }) => {
          const date = new Date(OrderDate).toISOString().split('T')[0]; // Format date as YYYY-MM-DD
          const sale = TotalAmount * ProductQuantity;
          
          if (!acc[date]) {
            acc[date] = { date, TotalAmount: 0, Sale: 0, Revenue: 0 };
          }

          acc[date].TotalAmount += TotalAmount;
          acc[date].Sale += ProductQuantity;
          acc[date].Revenue += sale;

          return acc;
        }, {});

        // Convert aggregated data to an array
        const chartDataArray = Object.values(aggregatedData);
        setChartData(chartDataArray);
      } catch (error) {
        console.error('Error fetching order data from backend', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Adminnavbar />
      <div>
        <h1 className='text-center'>Welcome to Admin Dashboard</h1>
      </div>
      <div className='container'>
        <h2 className='text-center'>Revenue</h2>
        <div className='chart-container'>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: "lightgray" }} />
              <Legend />
              <Line type="monotone" dataKey="Revenue" stroke="green" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className='chart-container' style={{ marginTop: '50px' }}>
          <h2 className='text-center'>Sale</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <XAxis dataKey="date"/>
              <YAxis/>
              <Tooltip/>
              <Legend/>
              <Bar dataKey="Sale" fill='#8883d8'/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;



