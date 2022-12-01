/* 
Contoller käyttää modelin metodeja ja käsittelee niiden palauttamia arvoja.
*/

const Ostoslista = require('../models/ostoslista.model.js');
const Kayttaja = require('../models/kayttaja.model.js');

// Luo uusi ostoslista
exports.create = (req, res) => {
  let user;

  if (!req.body) {
    res.status(400).send({
      message: 'Body cannot be empty!',
    });
  }

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

      const ostoslista = new Ostoslista({
        nimi: req.body.nimi,
        Kayttaja_k_id: req.body.Kayttaja_k_id,
      });

      Ostoslista.create(ostoslista, (err, data) => {
        if (err)
          res.status(500).send({
            message: err.message || 'Error creating shopping list',
          });
        else res.send(data);
      });
    }
  });
};

// Hae kaikki ostoslistat
exports.findAll = (req, res) => {
  Ostoslista.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Error getting shopping lists',
      });
    else res.send(data);
  });
};

// Hae ostoslista ostoslistan id:n perusteella
exports.findOne = (req, res) => {
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
    } else res.send(data);
  });
};

// Päivitä ostoslista ostoslistan id:n perusteella
exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Body cannot be empty!',
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

      Ostoslista.updateById(
        req.params.id,
        new Ostoslista(req.body),
        (err, data) => {
          if (err) {
            if (err.kind === 'not_found') {
              res.status(404).send({
                message: `Not found shopping list with id ${req.params.id}.`,
              });
            } else {
              res.status(500).send({
                message:
                  'Error updating shopping list with id ' + req.params.id,
              });
            }
          } else res.send(data);
        }
      );
    }
  });
};

// Poista ostoslista ostoslistan id:n perusteella
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
          Ostoslista.remove(req.params.id, (err, data) => {
            if (err) {
              res.status(500).send({
                message:
                  'Error deleting shopping list with id ' + req.params.id,
              });
            } else res.send(data);
          });
        }
      });
    }
  });
};
