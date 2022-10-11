/*
Route hallitsee sitä mitä metodeja käytetään controllereissa URL osoitteen perusteella.
esimerkki URL GET http://localhost:3000/api/aines/ hakee kaikki käyttäjät
*/
module.exports = (app) => {
  const Aines = require('../controllers/aines.controller.js');

  const router = require('express').Router();

  // Luo uusi Aines
  router.post('/', Aines.create);

  // hae kaikki Ainekset
  router.get('/', Aines.findAll);

  // Hae Aines id:n perusteella
  router.get('/:id', Aines.findOne);

  // Hae ainekset reseptin ID:n perustella
  router.get('/resepti/:id', Aines.findByRecipe);

  // Päivitä Aines ID:n perusteella
  router.put('/:id', Aines.update);

  // Poista Aines ID:n perusteella
  router.delete('/:id', Aines.delete);

  // Poista Aines reseptin ID:n perusteella
  router.delete('/resepti/:id', Aines.delete);

  //Tämä tulee kaikkien muiden muuttujien eteen
  app.use('/api/aines', router);
};
