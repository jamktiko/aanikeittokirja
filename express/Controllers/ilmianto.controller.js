const Ilmianto = require('../models/ilmianto.model');
const Kayttaja = require('../models/kayttaja.model');

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Body cannot be empty!',
    });
    return;
  }
  let user;
  Kayttaja.findById(req.body.Kayttaja_k_id, (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || 'Error getting user' });
      return;
    } else {
      user = data.cognito_id;

      if (user !== req.headers.cognitoid) {
        res.status(401).send({ message: 'You can not report as another user' });
        return;
      }

      const ilmianto = new Ilmianto({
        arvostelu: req.body.arvostelu,
        Resepti_r_id: req.body.Resepti_r_id,
        Kayttaja_k_id: req.body.Kayttaja_k_id,
        viesti: req.body.viesti,
        pvm: req.body.pvm,
      });

      Ilmianto.create(ilmianto, (err, data) => {
        if (err) {
          res.status(500).send({
            message: err.message || 'Error creating report',
          });
        } else {
          res.send(data);
        }
      });
    }
  });
};
