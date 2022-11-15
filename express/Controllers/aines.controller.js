/* 
Contoller käyttää modelin metodeja ja käsittelee niiden palauttamia arvoja.
*/

const Aines = require('../models/aines.model.js');

// Hae reseptin ainekset reseptin id:n perusteella
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
