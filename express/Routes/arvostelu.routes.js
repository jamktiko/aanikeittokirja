/*
Route hallitsee sitä mitä metodeja käytetään controllereissa URL osoitteen perusteella.
esimerkki URL GET http://localhost:3000/api/arvostelu/ hakee kaikki käyttäjät
*/
const { validateAuth } = require('../auth');
module.exports = (app) => {
  const Arvostelu = require('../Controllers/arvostelu.controller.js');

  const router = require('express').Router();

  // Luo uusi arvostelu
  router.post('/', validateAuth, Arvostelu.create);

  // hae kaikki arvostelut
  router.get('/', Arvostelu.findAll);

  // Hae arvostelu id:n perusteella
  router.get('/:id', Arvostelu.findOne);

  // Hae arvostelu reseptin id:n perusteella
  router.get('/recipe/:id', Arvostelu.findByRecipe);

  // Hae arvostelu käyttäjän id:n perusteella
  router.get('/user/:id', Arvostelu.findByUser);

  // Päivitä arvostelu ID:n perusteella
  router.put('/:id', validateAuth, Arvostelu.update);

  // Poista arvostelu ID:n perusteella
  router.delete('/:id', validateAuth, Arvostelu.delete);

  // Hakee tietyn käyttäjän tietyn reseptin arvostelun.
  router.post('/userrecipe', Arvostelu.findByUserAndRecipe);

  //Tämä tulee kaikkien muiden muuttujien eteen
  app.use('/api/arvostelu', router);
};
