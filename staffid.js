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

const getStaffID = async (staffname) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('StaffName', sql.NVarChar, staffname)
      .query('SELECT StaffId FROM Tbl_Staff WHERE StaffName = @StaffName');

    if (result.recordset.length > 0) {
      return result.recordset[0].StaffId;
    } else {
      throw new Error('Staff ID not found');
    }
  } catch (err) {
    console.error('Error fetching staff ID:', err.message);
    throw err;
  }
};

module.exports = { getStaffID };