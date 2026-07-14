// src/config/db.js
const { Pool } = require('pg');
const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_TYPE = process.env.DB_TYPE || 'postgres';

let pool;

// 🔹 Convert Postgres placeholders → MySQL
function convertPlaceholders(query, dbType) {
  if (dbType === 'mysql') {
    return query.replace(/\$\d+/g, '?');
  }
  return query;
}

// 🔹 Initialize Pool
if (DB_TYPE === 'postgres') {
  pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pool.on('error', (err) => {
    console.error('❌ PostgreSQL error:', err);
    process.exit(1);
  });

} else if (DB_TYPE === 'mysql') {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0,
  });

} else {
  throw new Error('Invalid DB_TYPE. Use "postgres" or "mysql"');
}

// 🔹 Common Query Function
async function query(text, params = []) {
  const sql = convertPlaceholders(text, DB_TYPE);

  try {
    if (DB_TYPE === 'postgres') {
      return await pool.query(sql, params);
    }

    if (DB_TYPE === 'mysql') {
      const [rows] = await pool.execute(sql, params);
      return { rows };
    }
  } catch (err) {
    console.error(`❌ DB Query Error (${DB_TYPE}):`, err.message);
    console.error('Query:', sql);
    console.error('Params:', params);
    throw err;
  }
}

// 🔹 Optional helper (useful for transactions later)
async function getClient() {
  if (DB_TYPE === 'postgres') {
    return await pool.connect();
  }
  return await pool.getConnection();
}

module.exports = {
  dbType: DB_TYPE,
  query,
  getClient,
};