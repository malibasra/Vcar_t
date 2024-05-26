//on click 'Remove' button in cart remove item from table order detail
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

// Function to get user ID
const getUserID = async (username) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('UserName', sql.NVarChar, username)
      .query('SELECT Id FROM Tbl_User WHERE UserName = @UserName');

    if (result.recordset.length > 0) {
      return result.recordset[0].Id;
    } else {
      throw new Error('User ID not found');
    }
  } catch (err) {
    console.error('Error fetching user ID:', err.message);
    throw err;
  }
};

// Function to delete item from order detail
const deleteOrderDetailData = async (ProductID, UserName, Buy) => {
  try {
    const UserId = await getUserID(UserName);
    const pool = await sql.connect(config);
    const request = pool.request();
    await request
      .input('ProductID', sql.Int, ProductID)
      .input('UserId', sql.Int, UserId)
      .input('Buy', sql.Int, Buy)
      .query('DELETE FROM dbo.Tbl_OrderDetail WHERE ProductFID = @ProductID AND UserFID = @UserId AND Buy = @Buy;');
    return { message: 'Order detail data deleted successfully' };
  } catch (error) {
    console.error('Error deleting order detail data:', error.message);
    throw { message: 'Error deleting order detail data' };
  }
};

module.exports = { deleteOrderDetailData };
