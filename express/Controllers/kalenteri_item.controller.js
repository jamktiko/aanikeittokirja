/* 
Contoller käyttää modelin metodeja ja käsittelee niiden palauttamia arvoja.
*/

const Kalenteri_Item = require('../models/kalenteri_item.model.js');
const Kayttaja = require('../models/kayttaja.model');

// Luo uusi kalenteri_item
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Body cannot be empty!',
    });
  }

  // pvm on kalenteri_itemin päivämäärä,
  // Kayttaja_k_id on käyttäjän id, joka liitetään kalenteri_itemiin,
  // Resepti_r_id on reseptin id, joka liitetään kalenteri_itemiin
  const kalenteri_item = new Kalenteri_Item({
    pvm: req.body.pvm,
    Kayttaja_k_id: req.body.Kayttaja_k_id,
    Resepti_r_id: req.body.Resepti_r_id,
  });

  Kalenteri_Item.create(kalenteri_item, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'An error while creating kalenteri_item',
      });
    else res.send(data);
  });
};

// Hae kaikki kalenteri_itemit
exports.findAll = (req, res) => {
  Kalenteri_Item.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || 'An error occurred while finding kalenteri_item.',
      });
    else res.send(data);
  });
};

exports.findByUser = (req, res) => {
  Kalenteri_Item.findByUser(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Kalenteri_Item not found',
        });
      } else {
        res.status(500).send({
          message: 'Search error',
        });
      }
    } else res.send(data);
  });
};

// Hae kalenteri_item id:n perusteella
exports.findOne = (req, res) => {
  Kalenteri_Item.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Kalenteri_item not found',
        });
      } else {
        res.status(500).send({
          message: 'Search error.',
        });
      }
    } else res.send(data);
  });
};

// Päivitä kalenteri_item id:n perusteella
exports.update = (req, res) => {
  if (!req.body || !req.body.ka_id) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
  }

  console.log(req.body);

  Kalenteri_Item.updateById(
    req.params.id,
    new Kalenteri_Item(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          res.status(404).send({
            message: `Not found kalenteri_item with id ${req.params.id}.`,
          });
        } else {
          res.status(500).send({
            message: 'Error updating kalenteri_item with id ' + req.params.id,
          });
        }
      } else res.send(data);
    }
  );
};

// Poista kalenteri_item id:n perusteella
exports.delete = (req, res) => {
  poistettavat = req.body.toBeDeleted;
  poistettavat.forEach((poistettava) => {
    Kayttaja.findById(poistettava.Kayttaja_k_id, (err, data) => {
      if (err) {
        res.status(500).send({
          message: 'Error deleting kalenteri_item with id ' + poistettava.ka_id,
        });
        return;
      } else {
        if ((data.cognito_id = req.headers.cognitoid)) {
          Kalenteri_Item.remove(poistettava, (err, data) => {
            if (err) {
              res.status(500).send({
                message:
                  'Error deleting kalenteri_item with id ' + req.params.id,
              });
              return;
            }
          });
        }
      }
    });
  });
  res.send({ message: 'Deleted all marked calendar items.' });
};
