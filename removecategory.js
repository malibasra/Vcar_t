//admin can delete the category
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

// Function to delete item from staff detail
const deleteCategory = async (Id) => {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    await request
      .input('Id', sql.Int, Id)
      .query('DELETE FROM dbo.Tbl_Product_Category WHERE Id = @Id');
    return { message: 'Category data deleted successfully' };
  } catch (error) {
    console.error('Error deleting category data:', error.message);
    throw { message: 'Error deleting category data' };
  }
};

module.exports = { deleteCategory };
