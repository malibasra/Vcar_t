const sql = require('mssql');

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

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

async function findProductCategory(productName) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('productName', sql.VarChar, productName)
    .query('SELECT ProductCategoryFID FROM dbo.Tbl_Product WHERE ProductName = @productName');
  
  if (result.recordset.length === 0) {
    return null;
  }
  
  return result.recordset[0].ProductCategoryFID;
}

async function findCategoryName(categoryId) {
  const pool = await poolPromise;
  const categoryResult = await pool.request()
    .input('categoryId', sql.Int, categoryId)
    .query('SELECT CategoryName FROM dbo.Tbl_Product_Category WHERE Id = @categoryId');
  
  return categoryResult.recordset.length ? categoryResult.recordset[0].CategoryName : null;
}

module.exports = { findProductCategory, findCategoryName };
