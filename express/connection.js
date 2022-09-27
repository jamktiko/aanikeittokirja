const mysql = require('mysql');
const con = mysql.createConnection({
  host: 'database-1.cybukhdg15wo.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'password',
  database: 'Reseptipankki',
});

con.connect(function (err) {
  if (err) throw err;
  console.log('Connected!');
});

con.end();
