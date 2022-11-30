/*
Route hallitsee sitä mitä metodeja käytetään controllereissa URL osoitteen perusteella.
esimerkki URL GET http://localhost:3000/api/ilmianto/ hakee kaikki listat
*/
const { validateAuth } = require('../auth');
module.exports = (app) => {
  const ilmianto = require('../Controllers/ilmianto.controller.js');

  const router = require('express').Router();

  // Luo uusi lista
  router.post('/', validateAuth, ilmianto.create);

  // Tämä tulee kaikkien muiden muuttujien eteen
  app.use('/api/ilmianto', router);
};
