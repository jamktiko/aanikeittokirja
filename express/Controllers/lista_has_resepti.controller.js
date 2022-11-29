/* 
Contoller käyttää modelin metodeja ja käsittelee niiden palauttamia arvoja.
*/

const Lista_has_Resepti = require('../models/lista_has_resepti.model.js');
const Lista = require('../models/lista.model.js');
const Kayttaja = require('../models/kayttaja.model.js');
// Luo uusi lista_has_resepti
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Body cannot be empty!',
    });
    return;
  }
  // Haetaan lista johon resepti lisätään että saadaan sen omistajan id
  Lista.findById(req.body.Lista_l_id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Lista not found',
        });
        return;
      } else {
        res.status(500).send({
          message: 'Search error.',
        });
        return;
      }
    } else {
      console.log('data.Kayttaja_k_id: ', data.Kayttaja_k_id);
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
          // Lista_l_id on listan id, johon resepti liitetään,
          // Resepti_r_id on reseptin id, joka liitetään listaan
          const lista_has_resepti = new Lista_has_Resepti({
            Lista_l_id: req.body.Lista_l_id,
            Resepti_r_id: req.body.Resepti_r_id,
          });
          Lista_has_Resepti.create(lista_has_resepti, (err, data) => {
            if (err) {
              res.status(500).send({
                message:
                  err.message || 'An error while creating lista_has_resepti',
              });
            } else res.send(data);
          });
        }
      });
    }
  });
};

// Hae lista_has_resepti id:n perusteella
exports.findOne = (req, res) => {
  Lista_has_Resepti.findById(req.params.id, (err, data) => {
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

// Poista lista id:n perusteella
exports.delete = (req, res) => {
  reseptit = req.body.poistettavat;

  reseptit.forEach((resepti) => {
    Lista.findById(resepti.Lista_l_id, (err, data) => {
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
      } else {
        // omistajan id:n perusteella haetaan omistaja että saadaan hänen cognito_id
        Kayttaja.findById(data.Kayttaja_k_id, (err, data) => {
          if (err) {
            res
              .status(500)
              .send({ message: err.message || 'Error getting user' });
            return;
          } else {
            user = data.cognito_id;
            //Testataan että lisääjä on sama kuin listan omistaja että joku muu ei voi editoida toisten listoja.
            if (user !== req.headers.cognitoid) {
              res
                .status(401)
                .send({ message: 'You can not create things for other users' });
              return;
            }
            Lista_has_Resepti.remove(resepti, (err, data) => {
              if (err) {
                res.status(500).send({
                  message:
                    'Error deleting lista_has_resepti with id ' + req.params.id,
                });
                return;
              }
            });
          }
        });
      }
    });
  });
  res.send({ message: 'ok' });
};
