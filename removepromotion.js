//admin can delete the promotion
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

// Function to delete item from order detail
const deletePromotion = async (Id) => {
  try {
    //console.log(Id);
    const pool = await sql.connect(config);
    const request = pool.request();
    await request
      .input('Id', sql.Int, Id)
      .query('DELETE FROM dbo.Tbl_Promotion WHERE PromotionId = @Id');
    return { message: 'Promotion data deleted successfully' };
  } catch (error) {
    console.error('Error deleting promotion data:', error.message);
    throw { message: 'Error deleting promotion data' };
  }
};

module.exports = { deletePromotion };
