/*
Route hallitsee sitä mitä metodeja käytetään controllereissa URL osoitteen perusteella.
esimerkki URL GET http://localhost:3000/api/arvostelu/ hakee kaikki käyttäjät
*/
module.exports = (app) => {
  const Arvostelu = require('../controllers/arvostelu.controller.js');

  const router = require('express').Router();

  // Luo uusi arvostelu
  router.post('/', Arvostelu.create);

  // hae kaikki arvostelut
  router.get('/', Arvostelu.findAll);

  // Hae arvostelu id:n perusteella
  router.get('/:id', Arvostelu.findOne);

  // Hae arvostelu reseptin id:n perusteella
  router.get('/recipe/:id', Arvostelu.findByRecipe);

  // Hae arvostelu käyttäjän id:n perusteella
  router.get('/user/:id', Arvostelu.findByUser);

  // Päivitä arvostelu ID:n perusteella
  router.put('/:id', Arvostelu.update);

  // Poista arvostelu ID:n perusteella
  router.delete('/:id', Arvostelu.delete);

  //Tämä tulee kaikkien muiden muuttujien eteen
  app.use('/api/arvostelu', router);
};
