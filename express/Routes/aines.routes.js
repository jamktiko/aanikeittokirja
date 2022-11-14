/*
Route hallitsee sitä mitä metodeja käytetään controllereissa URL osoitteen perusteella.
esimerkki URL GET http://localhost:3000/api/aines/ hakee kaikki käyttäjät
*/
const { validateAuth } = require('../auth');
module.exports = (app) => {
  const Aines = require('../Controllers/aines.controller.js');

  const router = require('express').Router();

  // Hae ainekset reseptin ID:n perustella
  router.get('/resepti/:id', Aines.findByRecipe);

  //Tämä tulee kaikkien muiden muuttujien eteen
  app.use('/api/aines', router);
};
