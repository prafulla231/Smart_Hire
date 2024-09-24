const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a MySQL connection pool
const pool = mysql.createPool({
  host:process.env.DB_HOST,         // Replace with your MySQL host
  user :process.env.DB_USER,
  password :'',
  database :process.env.DB_NAME,   // Replace with your MySQL database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port:3306
});

module.exports = pool;  // Use promise-based connection for async/await
