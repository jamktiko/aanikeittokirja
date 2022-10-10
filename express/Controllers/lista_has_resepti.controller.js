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