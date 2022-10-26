/* eslint-disable quotes */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('./connection');
const app = express();
const PORT = 3000;

import { generateUploadURL } from './s3.js';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('./Routes/kayttaja.routes')(app);
require('./Routes/resepti.routes')(app);
require('./Routes/ostoslista.routes')(app);
require('./Routes/aines.routes')(app);
require('./Routes/lista.routes')(app);
require('./Routes/lista_has_resepti.routes')(app);
require('./Routes/kalenteri_item.routes')(app);
require('./Routes/ostoslista_aines.routes')(app);

app.get('/', (req, res) => {
  res.status(200);
  res.send('Welcome to root URL of Server');
});

app.get('/test', (req, res) => {
  res.status(200);
  res.send('Test complete');
});

// Käytetään kuvien käsittelyyn S3:ssa
app.use(express.static('reseptipankki'));
app.get('/s3Url', async (req, res) => {
  const url = await generateUploadURL();
  res.send({ url });
});

app.listen(PORT, (error) => {
  if (!error) console.log('Server is running on port ' + PORT);
  else console.log("Error occurred, server can't start", error);
});
