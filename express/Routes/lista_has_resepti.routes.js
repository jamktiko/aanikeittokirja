/*
Route hallitsee sitä mitä metodeja käytetään controllereissa URL osoitteen perusteella.
esimerkki URL GET http://localhost:3000/api/lista_has_resepti/ hakee kaikki listoihin liitetyt reseptit
*/
module.exports = (app) => {
  const lista_has_resepti = require('../controllers/lista_has_resepti.controller.js');

  const router = require('express').Router();

  // Luo uusi lista_has_resepti
  router.post('/', validateAuth, lista_has_resepti.create);

  // Hae kaikki lista_has_reseptit
  router.get('/', lista_has_resepti.findAll);

  // Hae lista_has_resepti id:n perusteella
  router.get('/:id', lista_has_resepti.findOne);

  // Poista lista_has_resepti id:n perusteella
  router.delete('/:r/:l', validateAuth, lista_has_resepti.delete);

  // Tämä tulee kaikkien muiden muuttujien eteen
  app.use('/api/lista_has_resepti', router);
};
