//for handle backet with product table size column
const sql = require('mssql');

// Configure connection pool settings
const config = {
  user: 'Vcart',
  password: '12345',
  server: 'DESKTOP-P8H0KJB\\MSSQLSERVER01',
  database: 'Vcart',
  options: {
    encrypt: true, // If you're on Microsoft Azure, set this to true
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

const updateProductSize = async (ProductID, ProductSize) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('ProductID', sql.Int, ProductID)
      .input('ProductSize', sql.Int, ProductSize)
      .query('UPDATE dbo.Tbl_Product SET ProductSize = @ProductSize WHERE Id = @ProductID');

    return { message: 'Product size updated successfully' };
  } catch (error) {
    console.error('Error updating product size:', error.message);
    throw { message: 'Error updating product size' };
  }
};

module.exports = { updateProductSize };
