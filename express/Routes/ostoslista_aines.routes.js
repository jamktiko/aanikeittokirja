/*
Route hallitsee sitä mitä metodeja käytetään controllereissa URL osoitteen perusteella.
esimerkki URL GET http://localhost:3000/api/ostos_aines/ hakee kaikki käyttäjät
*/
const { validateAuth } = require('../auth');
module.exports = (app) => {
  const Ostoslista_Aines = require('../controllers/ostoslista_aines.controller.js');

  const router = require('express').Router();

  // Luo uusi Aines
  router.post('/', validateAuth, Ostoslista_Aines.create);

  // hae kaikki Ainekset
  router.get('/', Ostoslista_Aines.findAll);

  // Hae Aines id:n perusteella
  router.get('/:id', Ostoslista_Aines.findOne);

  // Hae ainekset ostoslistan ID:n perustella
  router.get('/ostoslista/:id', Ostoslista_Aines.findByShoppingList);

  // Päivitä Aines ID:n perusteella
  router.put('/:id', validateAuth, Ostoslista_Aines.update);

  // Poista Aines ID:n perusteella
  router.delete('/:id', validateAuth, Ostoslista_Aines.delete);

  // Poista Aines ostoslistan ID:n perusteella
  router.delete('/ostoslista/:id', validateAuth, Ostoslista_Aines.deleteByList);

  //Tämä tulee kaikkien muiden muuttujien eteen
  app.use('/api/ostos_aines', router);
};
