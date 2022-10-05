/* 
Contoller käyttää modelin metodeja ja käsittelee niiden palauttamia arvoja.
*/

const Aines = require('../models/aines.model.js');

// Luo uusi aines
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Sisältö ei voi olla tyhjä!',
    });
  }

  const aines = new Aines({
    aines: req.body.aines,
    maara: req.body.maara,
    yksikko: req.body.yksikko,
    Resepti_r_id: req.body.Resepti_r_id,
  });

  Aines.create(aines, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Virhe tapahtui ainesta luodessa.',
      });
    else res.send(data);
  });
};

// Hae kaikki ainekset
exports.findAll = (req, res) => {
  const enimi = req.query.title;

  Aines.getAll(enimi, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Virhe tapahtui aineksia hakiessa.',
      });
    else res.send(data);
  });
};

// Hae aines id:n perusteella
exports.findOne = (req, res) => {
  Aines.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Aines not found',
        });
      } else {
        res.status(500).send({
          message: 'Virhe haussa.',
        });
      }
    } else res.send(data);
  });
};

// Päivitä aines id:n perusteella
exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
  }

  console.log(req.body);

  Aines.updateById(req.params.id, new Aines(req.body), (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found aines with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: 'Error updating aines with id ' + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Poista aines id:n perusteella
exports.delete = (req, res) => {
  Aines.remove(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send({
        message: 'Error deleting aines with id ' + req.params.id,
      });
    } else res.send(data);
  });
};

exports.deleteByRecipe = (req, res) => {
  Aines.removeByRecipe(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send({
        message: 'Error deleting aines with r_id ' + req.params.Resepti_r_id,
      });
    } else res.send(data);
  });
};
