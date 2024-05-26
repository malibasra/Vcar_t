//add data in the order detail table
const sql = require('mssql');

// Configure connection pool settings
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

// Initialize the connection pool
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

const getUserID = async (username) => {
  try {
    const pool = await poolPromise;
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

const addProductToCart = async (ProductID, UserName, Quantity, OrderDate, ProductPrice, Buy) => {
  try {
    const UserId = await getUserID(UserName);

    const pool = await poolPromise;
    await pool.request()
      .input('UserFID', sql.Int, UserId)
      .input('ProductFID', sql.Int, ProductID)
      .input('OrderDate', sql.Date, OrderDate)
      .input('ProductQuantity', sql.Int, Quantity)
      .input('TotalAmount', sql.Money, ProductPrice)
      .input('Buy', sql.Int, Buy)
      .query(`INSERT INTO dbo.Tbl_OrderDetail (UserFID, ProductFID, OrderDate, ProductQuantity, TotalAmount, Buy) 
              VALUES (@UserFID, @ProductFID, @OrderDate, @ProductQuantity, @TotalAmount, @Buy)`);

    return { message: 'Product added to cart successfully' };
  } catch (error) {
    console.error('Error adding product to cart:', error.message);
    throw { message: 'Error adding product to cart' };
  }
};

module.exports = { addProductToCart, getUserID };

