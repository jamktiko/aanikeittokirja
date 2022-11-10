/* 
Contoller käyttää modelin metodeja ja käsittelee niiden palauttamia arvoja.
*/

const Lista = require('../models/lista.model.js');
const Kayttaja = require('../models/kayttaja.model.js');

// Luo uusi lista
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
  }

  let user;
  Kayttaja.findById(req.body.k_id, (err, data) => {
    if (err)
      res.status(500).send({ message: err.message || 'Error getting user' });
    else {
      user = data.cognito_id;

      if (user !== req.headers.cognitoid) {
        res
          .status(401)
          .send({ message: 'You can not create things for other users' });
        return;
      }

      const lista = new Lista({
        nimi: req.body.nimi,
        kuvaus: req.body.kuvaus,
        cognito_id: req.body.cognito_id,
      });

      Lista.create(lista, (err, data) => {
        if (err)
          res.status(500).send({
            message: err.message || 'An error occurred while finding lists.',
          });
        else res.send(data);
      });
    }
  });
};

// Hae kaikki listat
exports.findAll = (req, res) => {
  Lista.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'An error occurred while finding users.',
      });
    else res.send(data);
  });
};

// Hae lista id:n perusteella
exports.findOne = (req, res) => {
  Lista.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Lista not found',
        });
      } else {
        res.status(500).send({
          message: 'Search error.',
        });
      }
    } else res.send(data);
  });
};

// Listojen haku käyttäjän perusteella
exports.findByUser = (req, res) => {
  Lista.findByUser(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Lista not found',
        });
      } else {
        res.status(500).send({
          message: 'Search error.',
        });
      }
    } else res.send(data);
  });
};

// Päivitä lista id:n perusteella
exports.update = (req, res) => {
  if (!req.body || !req.body.nimi) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
  }

  let user;
  Kayttaja.findById(req.body.Kayttaja_k_id, (err, data) => {
    if (err)
      res.status(500).send({ message: err.message || 'Error getting user' });
    else {
      user = data.cognito_id;
      if (user !== req.headers.cognitoid) {
        res
          .status(401)
          .send({ message: 'You can not create things for other users' });
        return;
      }

      Lista.updateById(req.params.id, new Lista(req.body), (err, data) => {
        if (err) {
          if (err.kind === 'not_found') {
            res.status(404).send({
              message: `Not found lista with id ${req.params.id}.`,
            });
          } else {
            res.status(500).send({
              message: 'Error updating lista with id ' + req.params.id,
            });
          }
        } else res.send(data);
      });
    }
  });
};

// Poista lista id:n perusteella
exports.delete = (req, res) => {
  let user;
  Ostoslista.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Shopping list not found',
        });
      } else {
        res.status(500).send({
          message: 'Error in search',
        });
      }
    } else {
      Kayttaja.findById(data.Kayttaja_k_id, (err, data) => {
        if (err)
          res
            .status(500)
            .send({ message: err.message || 'Error getting user' });
        else {
          user = data.cognito_id;
          if (user !== req.headers.cognitoid) {
            res
              .status(401)
              .send({ message: 'You can not create things for other users' });
            return;
          }
          Lista.remove(req.params.id, (err, data) => {
            if (err) {
              res.status(500).send({
                message: 'Error deleting lista with id ' + req.params.id,
              });
            } else res.send(data);
          });
        }
      });
    }
  });
};
