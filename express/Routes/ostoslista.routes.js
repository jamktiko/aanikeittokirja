/*
Route hallitsee sitä mitä metodeja käytetään controllereissa URL osoitteen perusteella.
esimerkki URL GET http://localhost:3000/api/ostoslista/ hakee kaikki käyttäjät
*/
module.exports = (app) => {
  const Ostoslista = require('../controllers/ostoslista.controller.js');

  const router = require('express').Router();

  // Luo uusi ostoslista
  router.post('/', Ostoslista.create);

  // hae kaikki ostoslista
  router.get('/', Ostoslista.findAll);

  // Hae ostoslista id:n perusteella
  router.get('/:id', Ostoslista.findOne);

  // Päivitä ostoslista ID:n perusteella
  router.put('/:id', Ostoslista.update);

  // Poista ostoslista ID:n perusteella
  router.delete('/:id', Ostoslista.delete);

  //Tämä tulee kaikkien muiden muuttujien eteen
  app.use('/api/ostoslista', router);
};
