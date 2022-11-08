/*
Route hallitsee sitä mitä metodeja käytetään controllereissa URL osoitteen perusteella.
esimerkki URL GET http://localhost:3000/api/resepti/ hakee kaikki reseptit
*/
const { validateAuth } = require('../auth');
module.exports = (app) => {
  const resepti = require('../Controllers/resepti.controller.js');

  const router = require('express').Router();

  // Luo uusi resepti
  router.post('/', validateAuth, resepti.create);

  // hae kaikki reseptit
  router.get('/', resepti.findAll);

  // hae kriteerien perusteella
  router.post('/search', resepti.findByCriteria);

  // Hae kaikki julkiset reseptit
  router.get('/public', resepti.findAllPublic);

  // Hae kaikki suositellut reseptit
  router.get('/recommended', resepti.findAllRecommended);

  // Hae resepti id:n perusteella
  router.get('/:id', resepti.findOne);

  // Päivitä resepti ID:n perusteella
  router.put('/:id', validateAuth, resepti.update);

  // Poista resepti ID:n perusteella
  router.delete('/:id', validateAuth, resepti.delete);

  //Tämä tulee kaikkien muiden muuttujien eteen
  app.use('/api/resepti', router);
};
