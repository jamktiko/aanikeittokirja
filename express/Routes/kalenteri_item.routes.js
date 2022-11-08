/*
Route hallitsee sitä mitä metodeja käytetään controllereissa URL osoitteen perusteella.
esimerkki URL GET http://localhost:3000/api/kalenteri_item/ hakee kaikki kalentereihin liitetyt reseptit
*/
const { validateAuth } = require('../auth');
module.exports = (app) => {
  const kalenteri_item = require('../Controllers/kalenteri_item.controller.js');

  const router = require('express').Router();

  // Luo uusi kalenteri_item
  router.post('/', validateAuth, kalenteri_item.create);

  // Hae kaikki kalenteri_itemit
  router.get('/', kalenteri_item.findAll);

  // Hae kalenteri_item id:n perusteella
  router.get('/:id', kalenteri_item.findOne);

  // Hae kalenteri_item käyttäjän perusteella
  router.get('/user/:id', kalenteri_item.findByUser);

  // Päivitä kalenteri_item id:n perusteella
  router.put('/:id', validateAuth, kalenteri_item.update);

  // Poista kalenteri_item id:n perusteella
  router.delete('/:id', validateAuth, kalenteri_item.delete);

  // Tämä tulee kaikkien muiden muuttujien eteen
  app.use('/api/kalenteri_item', router);
};
