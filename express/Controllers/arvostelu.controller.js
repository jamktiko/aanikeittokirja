/* 
Contoller käyttää modelin metodeja ja käsittelee niiden palauttamia arvoja.
*/

const Arvostelu = require('../models/arvostelu.model.js');

// Luo uusi arvostelu
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Body cannot be empty!',
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
      const arvostelu = new Arvostelu({
        arvostelu: req.body.arvostelu,
        Resepti_r_id: req.body.Resepti_r_id,
        Kayttaja_k_id: req.body.Kayttaja_k_id,
      });

      Arvostelu.create(arvostelu, (err, data) => {
        if (err)
          res.status(500).send({
            message: err.message || 'Error creating review',
          });
        else res.send(data);
      });
    }
  });
};

// Hae kaikki arvostelut
exports.findAll = (req, res) => {
  Arvostelu.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Error getting reviews',
      });
    else res.send(data);
  });
};

// Hae ostoslista ostoslistan id:n perusteella
exports.findOne = (req, res) => {
  Arvostelu.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Review not found',
        });
      } else {
        res.status(500).send({
          message: 'Error in search',
        });
      }
    } else res.send(data);
  });
};

// Hae ostoslista käyttäjän id:n perusteella
exports.findByUser = (req, res) => {
  Arvostelu.findByUser(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Review not found',
        });
      } else {
        res.status(500).send({
          message: 'Error in search',
        });
      }
    } else res.send(data);
  });
};

// Hae ostoslista reseptin id:n perusteella
exports.findByRecipe = (req, res) => {
  Arvostelu.findByRecipe(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Review not found',
        });
      } else {
        res.status(500).send({
          message: 'Error in search',
        });
      }
    } else res.send(data);
  });
};

// Päivitä arvostelu arvostelun id:n perusteella
exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Body cannot be empty!',
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
      Arvostelu.updateById(
        req.params.id,
        new Arvostelu(req.body),
        (err, data) => {
          if (err) {
            if (err.kind === 'not_found') {
              res.status(404).send({
                message: `Not found review with id ${req.params.id}.`,
              });
            } else {
              res.status(500).send({
                message: 'Error updating review with id ' + req.params.id,
              });
            }
          } else res.send(data);
        }
      );
    }
  });
};

// Poista arvostelu arvostelun id:n perusteella
exports.delete = (req, res) => {
  Arvostelu.findById(req.params.id, (err, data) => {
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
          Arvostelu.remove(req.params.id, (err, data) => {
            if (err) {
              res.status(500).send({
                message: 'Error deleting review with id ' + req.params.id,
              });
            } else res.send(data);
          });
        }
      });
    }
  });
};
