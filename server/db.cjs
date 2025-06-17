
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'hotelbot',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password'
  // default schema is public
});

// Test connection
pool.connect()
  .then(client => {
    console.log('Database connected successfully');
    client.release();
  })
  .catch(err => {
    console.warn('Database connection failed:', err.message);
    console.warn('Check the DB_* variables in your .env file.');
    console.log('Server will continue without database functionality');
  });

module.exports = {
  query: async (text, params) => {
    try {
      return await pool.query(text, params);
    } catch (err) {
      console.error('Database query error:', err.message);
      throw err;
    }
  },
  pool
};
