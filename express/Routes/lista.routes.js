/*
Route hallitsee sitä mitä metodeja käytetään controllereissa URL osoitteen perusteella.
esimerkki URL GET http://localhost:3000/api/lista/ hakee kaikki listat
*/
module.exports = (app) => {
  const lista = require('../controllers/lista.controller.js');

  const router = require('express').Router();

  // Luo uusi lista
  router.post('/', validateAuth, lista.create);

  // Hae kaikki listat
  router.get('/', lista.findAll);

  // Hae lista id:n perusteella
  router.get('/:id', lista.findOne);

  // Päivitä lista id:n perusteella
  router.put('/:id', validateAuth, lista.update);

  // Poista lista id:n perusteella
  router.delete('/:id', validateAuth, lista.delete);

  // Tämä tulee kaikkien muiden muuttujien eteen
  app.use('/api/lista', router);
};
