/*
Route hallitsee sitä mitä metodeja käytetään controllereissa URL osoitteen perusteella.
esimerkki URL GET http://localhost:3000/api/lista/ hakee kaikki käyttäjät
*/
module.exports = (app) => {
  const lista = require('../controllers/lista.controller.js');

  const router = require('express').Router();

  // Luo uusi lista
  router.post('/', lista.create);

  // hae kaikki listat
  router.get('/', lista.findAll);

  // Hae lista id:n perusteella
  router.get('/:id', lista.findOne);

  // Päivitä lista ID:n perusteella
  router.put('/:id', lista.update);

  // Poista lista ID:n perusteella
  router.delete('/:id', lista.delete);

  //Tämä tulee kaikkien muiden muuttujien eteen
  app.use('/api/lista', router);
};
