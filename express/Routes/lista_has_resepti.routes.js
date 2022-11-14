/*
Route hallitsee sitä mitä metodeja käytetään controllereissa URL osoitteen perusteella.
esimerkki URL GET http://localhost:3000/api/lista_has_resepti/ hakee kaikki listoihin liitetyt reseptit
*/
const { validateAuth } = require('../auth');
module.exports = (app) => {
  const lista_has_resepti = require('../Controllers/lista_has_resepti.controller.js');

  const router = require('express').Router();

  // Luo uusi lista_has_resepti
  router.post('/', validateAuth, lista_has_resepti.create);

  // Hae lista_has_resepti id:n perusteella
  router.get('/:id', lista_has_resepti.findOne);

  // Poista lista_has_resepti id:n perusteella
  router.delete('/delete', validateAuth, lista_has_resepti.delete);

  // Tämä tulee kaikkien muiden muuttujien eteen
  app.use('/api/lista_has_resepti', router);
};
