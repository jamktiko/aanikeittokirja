/* 
Contoller käyttää modelin metodeja ja käsittelee niiden palauttamia arvoja.
*/

const Lista_has_Resepti = require('../models/lista_has_resepti.model.js');

// Luo uusi lista_has_resepti
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Body cannot be empty!',
    });
  }

  // Lista_l_id on listan id, johon resepti liitetään,
  // Resepti_r_id on reseptin id, joka liitetään listaan
  const lista_has_resepti = new Lista_has_Resepti({
    Lista_l_id: req.body.Lista_l_id,
    Resepti_r_id: req.body.Resepti_r_id,
  });

  Lista_has_Resepti.create(lista_has_resepti, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'An error while creating lista_has_resepti',
      });
    else res.send(data);
  });
};

// Hae kaikki lista_has_reseptit
exports.findAll = (req, res) => {
  Lista.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || 'An error occurred while finding lista_has_resepti.',
      });
    else res.send(data);
  });
};

// Hae lista_has_resepti id:n perusteella
exports.findOne = (req, res) => {
  Lista.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Lista_has_resepti not found',
        });
      } else {
        res.status(500).send({
          message: 'Search error.',
        });
      }
    } else res.send(data);
  });
};

// Päivitä lista_has_resepti id:n perusteella
exports.update = (req, res) => {
  if (!req.body || !req.body.lista_has_resepti_id) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
  }

  console.log(req.body);

  Lista.updateById(
    req.params.id,
    new Lista_has_Resepti(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          res.status(404).send({
            message: `Not found lista_has_resepti with id ${req.params.id}.`,
          });
        } else {
          res.status(500).send({
            message:
              'Error updating lista_has_resepti with id ' + req.params.id,
          });
        }
      } else res.send(data);
    }
  );
};

// Poista lista id:n perusteella
exports.delete = (req, res) => {
  Lista.remove(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send({
        message: 'Error deleting lista_has_resepti with id ' + req.params.id,
      });
    } else res.send(data);
  });
};
