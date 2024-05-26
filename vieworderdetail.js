//view the data of user  from table order detail
const sql = require('mssql');

// Database configuration
const config = {
  user: 'Vcart',
  password: '12345',
  server: 'DESKTOP-P8H0KJB\\MSSQLSERVER01',
  database: 'Vcart',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Function to get order details by user ID
const getOrderDetail = async (userId) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM Tbl_OrderDetail WHERE UserFID = @userId');

    return result.recordset || []; // Return an empty array if no records found
  } catch (err) {
    console.error('Error fetching Order detail:', err.message);
    throw err;
  }
};

module.exports = { getOrderDetail };
