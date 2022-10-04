/* 
Contoller käyttää modelin metodeja ja käsittelee niiden palauttamia arvoja.
*/

const Ostoslista = require('../models/ostoslista.model.js');

// Luo uusi ostoslista
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Sisältö ei voi olla tyhjä!',
    });
  }

  const ostoslista = new Ostoslista({
    nimi: req.body.nimi,
    Kayttaja_k_id: req.body.Kayttaja_k_id,
  });

  Ostoslista.create(ostoslista, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Virhe tapahtui ostoslistaa luodessa.',
      });
    else res.send(data);
  });
};

// Hae kaikki ostoslistat
exports.findAll = (req, res) => {
  const enimi = req.query.title;

  Ostoslista.getAll(enimi, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Virhe tapahtui ostoslistoja hakiessa.',
      });
    else res.send(data);
  });
};

// Hae ostoslista id:n perusteella
exports.findOne = (req, res) => {
  Ostoslista.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Ostoslista not found',
        });
      } else {
        res.status(500).send({
          message: 'Virhe haussa.',
        });
      }
    } else res.send(data);
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

  Ostoslista.updateById(
    req.params.id,
    new Ostoslista(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          res.status(404).send({
            message: `Not found ostoslista with id ${req.params.id}.`,
          });
        } else {
          res.status(500).send({
            message: 'Error updating ostoslista with id ' + req.params.id,
          });
        }
      } else res.send(data);
    }
  );
};

// Poista ostoslista id:n perusteella
exports.delete = (req, res) => {
  Ostoslista.remove(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send({
        message: 'Error deleting ostoslista with id ' + req.params.id,
      });
    } else res.send(data);
  });
};
