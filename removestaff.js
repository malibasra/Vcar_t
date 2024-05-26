//admin can delete the product
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
const deleteStaff = async (Id) => {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    await request
      .input('Id', sql.Int, Id)
      .query('DELETE FROM dbo.Tbl_Staff WHERE StaffId = @Id');
    return { message: 'staff data deleted successfully' };
  } catch (error) {
    console.error('Error deleting staff data:', error.message);
    throw { message: 'Error deleting staff detail data' };
  }
};

module.exports = { deleteStaff };
