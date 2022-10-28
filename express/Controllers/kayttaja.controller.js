/* 
Contoller käyttää modelin metodeja ja käsittelee niiden palauttamia arvoja.
*/

const Kayttaja = require('../models/kayttaja.model.js');

// Luo uusi käyttäjä
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Body cannot be empty!',
    });
  }

  const kayttaja = new Kayttaja({
    enimi: req.body.enimi,
    snimi: req.body.snimi,
    email: req.body.email,
    cognito_id: req.body.cognito_id,
    isAdmin: req.body.isAdmin,
    erikoisruokavaliot: req.body.erikoisruokavaliot,
  });

  Kayttaja.create(kayttaja, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Error creating an user',
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
        message: err.message || 'Error getting users',
      });
    else res.send(data);
  });
};

// Hae käyttäjä käyttäjän id:n perusteella
exports.findOne = (req, res) => {
  Kayttaja.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'User not found',
        });
      } else {
        res.status(500).send({
          message: 'Error in search',
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
        message: err.message || 'Error getting users',
      });
    else res.send(data);
  });
};

// Päivitä käyttäjä käyttäjän id:n perusteella
exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Body cannot be empty!',
    });
  }

  console.log(req.body);

  Kayttaja.updateById(req.params.id, new Kayttaja(req.body), (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found user with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: 'Error updating user with id ' + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Poista käyttäjä käyttäjän id:n perusteella
exports.delete = (req, res) => {
  Kayttaja.remove(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send({
        message: 'Error deleting user with id ' + req.params.id,
      });
    } else res.send(data);
  });
};
