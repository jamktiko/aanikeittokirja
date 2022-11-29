/*
Route hallitsee sitä mitä metodeja käytetään controllereissa URL osoitteen perusteella.
esimerkki URL GET http://localhost:3000/api/lista/ hakee kaikki listat
*/
const { validateAuth } = require('../auth');
module.exports = (app) => {
  const link = require('../Controllers/link.controller.js');

  const router = require('express').Router();

  // Luo uusi lista
  router.post('/', validateAuth, link.getInfoFromLink);

  // Tämä tulee kaikkien muiden muuttujien eteen
  app.use('/api/link', router);
};
