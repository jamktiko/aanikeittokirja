const express = require('express');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.status(200);
  res.send('Welcome to root URL of Server');
});

app.get('/test', (req, res) => {
  res.status(200);
  res.send('Test complete');
});

app.listen(PORT, (error) => {
  if (!error) console.log('Server is running on port ' + PORT);
  else console.log("Error occurred, server can't start", error);
});
