/* 
Contoller käyttää modelin metodeja ja käsittelee niiden palauttamia arvoja.
*/

const Lista = require('../models/lista.model.js');

// Luo uusi lista
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
  }

  const lista = new Lista({
    nimi: req.body.nimi,
    kuvaus: req.body.kuvaus,
    Kayttaja_k_id: req.body.Kayttaja_k_id,
  });

  Lista.create(lista, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'An error occurred while finding lists.',
      });
    else res.send(data);
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

// Päivitä lista id:n perusteella
exports.update = (req, res) => {
  if (!req.body || !req.body.nimi) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
  }

  console.log(req.body);

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
};

// Poista lista id:n perusteella
exports.delete = (req, res) => {
  Lista.remove(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send({
        message: 'Error deleting lista with id ' + req.params.id,
      });
    } else res.send(data);
  });
};
