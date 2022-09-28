const mysql = require('mysql');
require('dotenv').config();
const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

conn.connect(function (err) {
  if (err) throw err;
  console.log('Connected!');
});

module.exports = conn;
