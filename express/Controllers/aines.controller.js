/* 
Contoller käyttää modelin metodeja ja käsittelee niiden palauttamia arvoja.
*/

const Aines = require('../models/aines.model.js');

// Luo uusi aines
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Body cannot be empty!',
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
        message: err.message || 'Error creating ingredients',
      });
    else res.send(data);
  });
};

// Hae kaikki ainekset
exports.findAll = (req, res) => {
  Aines.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Error getting ingredients',
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
          message: 'Ingredient not found',
        });
      } else {
        res.status(500).send({
          message: 'Error in search',
        });
      }
    } else res.send(data);
  });
};

exports.findByRecipe = (req, res) => {
  Aines.findByRecipe(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Ingredient not found',
        });
      } else {
        res.status(500).send({
          message: 'Error in search',
        });
      }
    } else res.send(data);
  });
};

// Päivitä aines aineksen id:n perusteella
exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Body cannot be empty!',
    });
  }

  console.log(req.body);

  Aines.updateById(req.params.id, new Aines(req.body), (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found ingredient with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: 'Error updating ingredient with id ' + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Poista aines aineksen id:n perusteella
exports.delete = (req, res) => {
  Aines.remove(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send({
        message: 'Error deleting ingredient with id ' + req.params.id,
      });
    } else res.send(data);
  });
};

// Poista aines kun sille kuuluva resepti poistetaan
exports.deleteByRecipe = (req, res) => {
  Aines.removeByRecipe(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          'Error deleting ingredient with recipe id (r_id) ' +
          req.params.Resepti_r_id,
      });
    } else res.send(data);
  });
};
