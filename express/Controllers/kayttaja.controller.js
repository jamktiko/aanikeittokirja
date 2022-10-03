/* 
Contoller käyttää modelin metodeja ja käsittelee niiden palauttamia arvoja.
*/

const Kayttaja = require('../models/kayttaja.model.js');

// Luo uusi käyttäjä
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Sisältö ei voi olla tyhjä!',
    });
  }

  const kayttaja = new Kayttaja({
    enimi: req.body.enimi,
    snimi: req.body.snimi,
    email: req.body.email,
    salasana: req.body.salasana,
    isAdmin: req.body.isAdmin,
    erikoisruokavaliot: req.body.erikoisruokavaliot,
  });

  Kayttaja.create(kayttaja, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Virhe tapahtui käyttäjää luodessa.',
      });
    else res.send(data);
  });
};

// Hae kaikki käyttäjät
exports.findAll = (req, res) => {
  const enimi = req.query.title;

  Kayttaja.getAll(enimi, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Virhe tapahtui käyttäjie hakiessa.',
      });
    else res.send(data);
  });
};

// Hae käyttäjä id:n perusteella
exports.findOne = (req, res) => {
  Kayttaja.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Käyttjä not found',
        });
      } else {
        res.status(500).send({
          message: 'Virhe haussa.',
        });
      }
    } else res.send(data);
  });
};

// Hae kaikki adminit
exports.findAllAdmins = (req, res) => {
  Kayttaja.getAllAdmins((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Virhe tapahtui käyttäjiä etsiessä.',
      });
    else res.send(data);
  });
};

// Päivitä käyttäjä id:n perusteella
exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
  }

  console.log(req.body);

  Kayttaja.updateById(req.params.id, new Kayttaja(req.body), (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found Kayttaja with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: 'Error updating Kayttaja with id ' + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Poista tutoriaali id:n perusteella
exports.delete = (req, res) => {};
