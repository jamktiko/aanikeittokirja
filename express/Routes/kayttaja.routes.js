module.exports = (app) => {
  const kayttaja = require('../controllers/kayttaja.controller.js');

  const router = require('express').Router();

  // Luo uusi käyttäjä
  router.post('/', kayttaja.create);

  // hae kaikki käyttäjät
  router.get('/', kayttaja.findAll);

  // Hae kaikki adminit
  router.get('/admins', kayttaja.findAllAdmins);

  // Hae käyttäjä id:n perusteella
  router.get('/:id', kayttaja.findOne);

  // Päivitä käyttäjä ID:n perusteella
  router.put('/:id', kayttaja.update);

  // Poista käyttäjä ID:n perusteella
  router.delete('/:id', kayttaja.delete);

  // Poista kaikki käyttäjät
  router.delete('/', kayttaja.deleteAll);

  app.use('/api/kayttaja', router);
};
