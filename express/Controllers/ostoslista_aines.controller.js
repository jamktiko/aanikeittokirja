/* 
Contoller käyttää modelin metodeja ja käsittelee niiden palauttamia arvoja.
*/

const conn = require('../connection.js');
const Ostoslista_aines = require('../models/ostoslista_aines.model.js');
const Ostoslista = require('../models/ostoslista.model');
const Kayttaja = require('../models/kayttaja.model');
// Luo uusi aines
/* tieto tänne muodossa 
{
"ainekset": [{"aines":"aineksen nimi", "maara":"aineksen määrä", "yksikko": "yksikko tähän"}, jatka muille aineksille]
"Ostoskori_o_id": kohde ostoskorin id
}
*/
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Body cannot be empty!'
    });
  }
  // Haetaan lista johon resepti lisätään että saadaan sen omistajan id
  Ostoslista.findById(req.body.Ostoslista_o_id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Lista not found'
        });
      } else {
        res.status(500).send({
          message: 'Search error.'
        });
      }
    } else {
      // omistajan id:n perusteella haetaan omistaja että saadaan hänen cognito_id
      Kayttaja.findById(data.Kayttaja_k_id, (err, data) => {
        if (err)
          res
            .status(500)
            .send({ message: err.message || 'Error getting user' });
        else {
          user = data.cognito_id;
          //Testataan että lisääjä on sama kuin listan omistaja että joku muu ei voi editoida toisten listoja.
          if (user !== req.headers.cognitoid) {
            res
              .status(401)
              .send({ message: 'You can not create things for other users' });
            return;
          }
          const ainekset = req.body.ainekset;
          //Tässä käytetään transaktiota varmuuden vuoksi
          conn.beginTransaction(function (err) {
            let final;
            ainekset.forEach((aines) => {
              const AinesData = new Ostoslista_aines({
                aines: aines.aines,
                maara: aines.maara,
                yksikko: aines.yksikko,
                Ostoslista_o_id: aines.Ostoslista_o_id
              });
              Ostoslista_aines.create(AinesData, (err, data) => {
                if (err) {
                  conn.rollback(function () {
                    throw err;
                  });
                }
                final += data;
              });
            });
            conn.commit(function (err) {
              console.log('commit');
              if (err) {
                conn.rollback(function () {
                  throw err;
                });
              } else {
                console.log('Successfully added ingredients to shopping list');
                res.send({
                  message: 'Successfully added ingredients to shopping list'
                });
              }
            });
          });
        }
      });
    }
  });
};

// Hae kaikki ainekset
exports.findAll = (req, res) => {
  Ostoslista_aines.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Error getting ingredients'
      });
    else res.send(data);
  });
};

// Hae aines id:n perusteella
exports.findOne = (req, res) => {
  Ostoslista_aines.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Ingredient not found'
        });
      } else {
        res.status(500).send({
          message: 'Error in search'
        });
      }
    } else res.send(data);
  });
};

// Hae reseptin ainekset reseptin id:n perusteella
exports.findByShoppingList = (req, res) => {
  Ostoslista_aines.findByShoppingList(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Ingredient not found'
        });
      } else {
        res.status(500).send({
          message: 'Error in search'
        });
      }
    } else res.send(data);
  });
};

// Päivitä aines aineksen id:n perusteella
/*Tähän tulee tieto muodossa
{
"aines": "aines",
"maara": "maara",
"yksikko": "yksikko"
}
*/
exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Body cannot be empty!'
    });
  }
  Ostoslista.findById(req.body.Ostoslista_o_id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Lista not found'
        });
      } else {
        res.status(500).send({
          message: 'Search error.'
        });
      }
    } else {
      // omistajan id:n perusteella haetaan omistaja että saadaan hänen cognito_id
      Kayttaja.findById(data.Kayttaja_k_id, (err, data) => {
        if (err)
          res
            .status(500)
            .send({ message: err.message || 'Error getting user' });
        else {
          user = data.cognito_id;
          //Testataan että lisääjä on sama kuin listan omistaja että joku muu ei voi editoida toisten listoja.
          if (user !== req.headers.cognitoid) {
            res
              .status(401)
              .send({ message: 'You can not create things for other users' });
            return;
          }
          Ostoslista_aines.updateById(
            req.params.id,
            new Ostoslista_aines(req.body),
            (err, data) => {
              if (err) {
                if (err.kind === 'not_found') {
                  res.status(404).send({
                    message: `Not found ingredient with id ${req.params.id}.`
                  });
                } else {
                  res.status(500).send({
                    message:
                      'Error updating ingredient with id ' + req.params.id
                  });
                }
              } else res.send(data);
            }
          );
        }
      });
    }
  });
};

// Poista aines aineksen id:n perusteella
exports.delete = (req, res) => {
  Kayttaja.findById(req.params.Kayttaja_k_id, (err, data) => {
    if (err)
      res.status(500).send({ message: err.message || 'Error getting user' });
    else {
      user = data.cognito_id;
      //Testataan että lisääjä on sama kuin listan omistaja että joku muu ei voi editoida toisten listoja.
      if (user !== req.headers.cognitoid) {
        res
          .status(401)
          .send({ message: 'You can not create things for other users' });
        return;
      }
      Ostoslista_aines.remove(req.params.id, (err, data) => {
        if (err) {
          res.status(500).send({
            message: 'Error deleting ingredient with id ' + req.params.id
          });
        } else res.send(data);
      });
    }
  });
};
