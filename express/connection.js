/* eslint-disable space-before-function-paren */
const mysql = require('mysql');
require('dotenv').config();
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306,
  waitForConnections: true,
});

pool.getConnection(function (err) {
  if (err) console.log(err);
  console.log('Connected!');
});

module.exports = pool;
