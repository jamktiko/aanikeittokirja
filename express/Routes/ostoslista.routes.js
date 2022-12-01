/*
Route hallitsee sitä mitä metodeja käytetään controllereissa URL osoitteen perusteella.
esimerkki URL GET http://localhost:3000/api/ostoslista/ hakee kaikki käyttäjät
*/

const { validateAuth } = require('../auth');
module.exports = (app) => {
  const Ostoslista = require('../Controllers/ostoslista.controller.js');

  const router = require('express').Router();

  // Luo uusi ostoslista
  router.post('/', validateAuth, Ostoslista.create);

  // hae kaikki ostoslista
  router.get('/', Ostoslista.findAll);

  // Hae käyttäjän kaikki ostoslistat
  router.get('/kayttaja/:id', Ostoslista.findByUser);

  // Hae ostoslista id:n perusteella
  router.get('/:id', Ostoslista.findOne);

  // Päivitä ostoslista ID:n perusteella
  router.put('/:id', validateAuth, Ostoslista.update);

  // Poista ostoslista ID:n perusteella
  router.delete('/:id', validateAuth, Ostoslista.delete);

  //Tämä tulee kaikkien muiden muuttujien eteen
  app.use('/api/ostoslista', router);
};
